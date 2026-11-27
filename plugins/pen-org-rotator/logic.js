// pen-org-rotator logic — pure functions, no plugin imports.
// Rotates the active pen.dev workspace (organization) when the active org's
// free MCP usage days are exhausted. Attribution follows the organizationId in
// ~/.pencil/session-desktop.json, which the Pen desktop app re-reads on every
// MCP tool call (getCurrentWorkspace -> readSessionFile), so a rewrite is a
// hot swap; no app restart needed.

import { readFileSync, writeFileSync, renameSync, appendFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { homedir } from "node:os"

export const SESSION_PATH = join(homedir(), ".pencil", "session-desktop.json")
export const LOG_PATH = join(homedir(), ".pencil", "org-rotator.log")
export const API = "https://api.pencil.dev"

const FEATURE = "mcp_usage_days"
const CLIENT = "desktop-editor"

export function timeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  } catch {
    return "UTC"
  }
}

export function todayKey() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function log(message) {
  try {
    mkdirSync(dirname(LOG_PATH), { recursive: true })
    appendFileSync(LOG_PATH, `${new Date().toISOString()} ${message}\n`)
  } catch {
    // never break a tool call over logging
  }
}

export function readSession(sessionPath = SESSION_PATH) {
  const raw = readFileSync(sessionPath, "utf8")
  const data = JSON.parse(raw)
  return {
    data,
    email: data?.email,
    token: data?.token,
    current: data?.currentWorkspace,
    path: sessionPath,
  }
}

async function api(method, endpoint, token, body) {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    client: CLIENT,
  }
  if (body !== undefined) headers["Content-Type"] = "application/json"
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`${endpoint} -> ${res.status} ${text.slice(0, 120)}`)
  }
  return res.json()
}

export async function listOrgs(token) {
  const data = await api("GET", "/user/workspaces", token)
  return (data?.organizations ?? []).map((o) => ({
    id: o.id,
    name: o.name,
    isPersonal: o.isPersonal === true,
    ownerSlug: o.ownerSlug ?? o.slug,
    workspaces: o.workspaces ?? [],
  }))
}

export async function orgStatus(token, organizationId) {
  const status = await api("POST", "/public/usage-status", token, {
    organizationId,
    featureKey: FEATURE,
    timeZone: timeZone(),
  })
  return {
    allowed: status.allowed !== false,
    used: status.used,
    limit: status.limit,
    remaining: typeof status.remaining === "number" ? status.remaining : (status.limit ?? 0) - (status.used ?? 0),
  }
}

// The workspace selection object the app stores in currentWorkspace.
// Orgs that own workspaces select their first workspace; bare orgs select at
// org level ({organizationId, slug: ownerSlug}), matching what the UI wrote
// for OrgTest/Route2.
export function selectionForOrg(org) {
  const ws = (org.workspaces ?? [])[0]
  if (ws) {
    return {
      organizationId: org.id,
      workspaceId: ws.id,
      slug: `${org.ownerSlug}/${ws.slug}`,
      label: `${org.name} / ${ws.name}`,
    }
  }
  return {
    organizationId: org.id,
    slug: org.ownerSlug,
    label: `${org.name} workspace`,
  }
}

export function applyWorkspace(session, selection) {
  const next = { ...session.data, currentWorkspace: selection }
  const tmp = `${session.path}.rotator-tmp`
  writeFileSync(tmp, JSON.stringify(next, null, 2))
  renameSync(tmp, session.path)
}

export function sameSelection(a, b) {
  return a && b && a.organizationId === b.organizationId && (a.workspaceId ?? "") === (b.workspaceId ?? "")
}

// Target selection policy (pure, no I/O — unit-tested in test.js).
// Preference ladder:
//   Tier A: orgs already burning this month (used > 0, remaining > 0) —
//           their leftover days risk expiring at the monthly reset, so drain
//           them first; among ties pick the FEWEST remaining, then API order.
//   Tier B: pristine buckets (used == 0, remaining > 0) — opened strictly
//           one at a time in API order (personal org included; the
//           remaining > 0 filter keeps exhausted personal out).
//   Tier C: nothing left -> undefined (caller keeps the upgrade notice).
export function pickTarget(candidates) {
  const alive = candidates.filter((c) => c.status.remaining > 0)
  const burning = alive.filter((c) => (c.status.used ?? 0) > 0)
  const pool = burning.length
    ? [...burning].sort(
        (a, b) => a.status.remaining - b.status.remaining,
      )[0]
    : alive[0]
  return pool
}

// One rotation cycle:
// 1. session file must exist and carry a token
// 2. ask the API whether the active org is still allowed today
// 3. if allowed -> nothing to do
// 4. otherwise pick the member org with the most remaining days and flip
export async function rotate({ sessionPath = SESSION_PATH, dryRun = false } = {}) {
  let session
  try {
    session = readSession(sessionPath)
  } catch {
    return { action: "noop", detail: "no session file or unreadable" }
  }
  if (!session.token || !session.email) {
    return { action: "noop", detail: "not signed in" }
  }

  let orgs
  try {
    orgs = await listOrgs(session.token)
  } catch (err) {
    log(`list-orgs failed: ${err.message}`)
    return { action: "error", detail: `list orgs: ${err.message}` }
  }
  if (!orgs.length) return { action: "noop", detail: "no organizations" }

  const active = orgs.find((o) => o.id === session.current?.organizationId)

  if (active) {
    try {
      const status = await orgStatus(session.token, active.id)
      if (status.allowed) {
        return {
          action: "noop",
          detail: `${active.name} allowed (used ${status.used}/${status.limit})`,
          status,
        }
      }
    } catch (err) {
      // 404 (org gone / no membership) counts as not allowed; other errors abort
      if (!String(err.message).includes("404")) {
        log(`status failed: ${err.message}`)
        return { action: "error", detail: `status: ${err.message}` }
      }
      log(`active org ${active.name} rejected by server (404), rotating`)
    }
  } else {
    log(`current org not found in membership list, rotating`)
  }

  const results = await Promise.allSettled(orgs.map((o) => orgStatus(session.token, o.id)))
  const candidates = []
  orgs.forEach((org, i) => {
    const r = results[i]
    if (r.status === "fulfilled") candidates.push({ org, status: r.value })
    else log(`status ${org.name} failed: ${r.reason?.message ?? r.reason}`)
  })

  const best = pickTarget(candidates)

  if (!best) {
    log("all orgs exhausted")
    return { action: "exhausted", detail: "no org with remaining days" }
  }

  const selection = selectionForOrg(best.org)
  const detail = `${session.current?.label ?? "none"} -> ${selection.label} (remaining ${best.status.remaining})`
  if (dryRun) return { action: "would-rotate", detail, selection }

  try {
    applyWorkspace(session, selection)
  } catch (err) {
    log(`apply failed: ${err.message}`)
    return { action: "error", detail: `apply: ${err.message}` }
  }
  log(`rotated: ${detail}`)
  return { action: "rotated", detail, selection, status: best.status }
}
