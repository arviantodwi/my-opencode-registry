#!/usr/bin/env node
// pen — CLI wrapper for the Pen desktop app with event-driven org rotation.
//
//   pen              launch Pen.app and start the rotation watcher (detached)
//   pen watch        run the rotation watcher in the foreground (for debugging)
//   pen stop         stop a running watcher
//   pen list         all organizations with their MCP usage
//   pen status       the active organization's usage
//   pen rotate       rotate now if the active org is exhausted
//   pen use <name>   switch to an organization by name
//
// Watcher: tails ~/Library/Logs/Pen/main*.log for native agent tool failures
// (the moment the "usage limit" banner blocks pen.app's own agent), debounces
// 15s, then verifies the active org's quota via the API and rotates the
// workspace if it is exhausted. Every billing consume re-reads
// ~/.pencil/session-desktop.json from disk, so the flip applies to the very
// next tool call, native or MCP, without restarting pen.app.

import {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
  openSync,
  readSync,
  closeSync,
  unlinkSync,
  watch as fsWatch,
} from "node:fs"
import { homedir } from "node:os"
import path from "node:path"
import { spawn, execFile, execSync } from "node:child_process"
import { rotate, readSession, listOrgs, orgStatus, selectionForOrg, applyWorkspace, log } from "./logic.js"

const APP = "/Applications/Pen.app"
const PIDFILE = path.join(homedir(), ".pencil", "org-rotator-watch.pid")
const FAIL_DEBOUNCE_MS = 15_000
const VERIFY_COOLDOWN_MS = 5_000
const FAIL_RE = /\[agent\] [0-9a-f-]{36} tool [0-9a-f-]{36}(:item_\d+)? failed/

function logWatch(message) {
  log(`[watch] ${message}`)
  if (process.stdout.isTTY) console.log(`[watch] ${message}`)
}

function notifyMac(message) {
  try {
    execFile("osascript", [
      "-e",
      `display notification ${JSON.stringify(message)} with title "pen-org-rotator"`,
    ])
  } catch {
    // notifications are best-effort
  }
}

function logDir() {
  return process.env.PEN_LOG_DIR || path.join(homedir(), "Library", "Logs", "Pen")
}

function pickNewestLog(dir) {
  let best
  for (const entry of readdirSync(dir)) {
    if (!/^main.*\.log$/.test(entry)) continue
    const full = path.join(dir, entry)
    try {
      const m = statSync(full).mtimeMs
      if (!best || m > best.m) best = { p: full, m }
    } catch {
      // file vanished mid-scan, ignore
    }
  }
  return best?.p
}

function penProcessPattern() {
  // test/simulation hook: which command line counts as "Pen running"
  return process.env.PEN_PROCESS_PATTERN || "Pen\\.app/Contents/MacOS/Pen"
}

function isPenRunning() {
  try {
    execSync(`pgrep -f ${JSON.stringify(penProcessPattern())}`, { stdio: "ignore" })
    return true
  } catch {
    return false
  }
}

function watcherAlive() {
  if (!existsSync(PIDFILE)) return 0
  const pid = Number(readFileSync(PIDFILE, "utf8").trim())
  if (!pid || pid === process.pid) return 0
  try {
    process.kill(pid, 0)
    return pid
  } catch {
    return 0
  }
}

async function watch() {
  const alive = watcherAlive()
  if (alive) {
    console.log(`watcher already running (pid ${alive})`)
    return
  }
  writeFileSync(PIDFILE, String(process.pid))
  logWatch(`started (pid ${process.pid}), tailing ${logDir()}`)

  let current = null
  let offset = 0
  let debounceTimer = null
  let lastVerify = 0
  let dirWatcher = null
  let retryTimer = null
  let quitTimer = null
  let pollTimer = null
  let switchDebounce = null

  const run = async () => {
    debounceTimer = null
    if (Date.now() - lastVerify < VERIFY_COOLDOWN_MS) return
    lastVerify = Date.now()
    try {
      const result = await rotate({})
      logWatch(`verify: ${result.action} — ${result.detail}`)
      if (result.action === "rotated") notifyMac(`Switched: ${result.detail}`)
      else if (result.action === "exhausted") notifyMac("All pen.dev orgs exhausted this month")
    } catch (err) {
      logWatch(`verify failed: ${err?.message ?? err}`)
    }
  }

  const schedule = () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(run, FAIL_DEBOUNCE_MS)
  }

  const readNew = () => {
    try {
      const size = statSync(current).size
      if (size === offset) return
      if (size < offset) offset = 0 // truncated or rolled
      const fd = openSync(current, "r")
      const buf = Buffer.alloc(size - offset)
      readSync(fd, buf, 0, size - offset, offset)
      closeSync(fd)
      offset = size
      for (const line of buf.toString().split("\n")) {
        if (!FAIL_RE.test(line)) continue
        logWatch("native agent tool failure detected")
        schedule()
      }
    } catch {
      // file disappeared mid-read; the dir watcher triggers a rescan
    }
  }

  const rescan = () => {
    let newest
    try {
      newest = pickNewestLog(logDir())
    } catch {
      return
    }
    if (!newest) return
    if (newest !== current) {
      const firstAttach = current === null
      current = newest
      // first attach skips history; later file rolls start fresh
      offset = firstAttach ? statSync(newest).size : 0
      logWatch(`tailing ${path.basename(current)}`)
    }
    readNew()
  }

  const stop = (reason) => {
    logWatch(`stopped (${reason})`)
    try {
      dirWatcher?.close()
    } catch {}
    if (quitTimer) clearInterval(quitTimer)
    if (pollTimer) clearInterval(pollTimer)
    if (switchDebounce) clearTimeout(switchDebounce)
    if (retryTimer) clearTimeout(retryTimer)
    if (debounceTimer) clearTimeout(debounceTimer)
    try {
      unlinkSync(PIDFILE)
    } catch {}
  }

  const armDirWatcher = () => {
    try {
      dirWatcher = fsWatch(logDir(), () => rescan())
    } catch {
      // log dir may not exist yet (first launch); retry quietly
      retryTimer = setTimeout(armDirWatcher, 10_000)
    }
  }

  armDirWatcher()
  rescan()
  // Workspace-change surveillance: whoever switches the active org (user in
  // the app UI, or anything else writing session-desktop.json) lands on an
  // org we haven't vetted. Policy, uniformly applied: when the landed-on org
  // is exhausted, rebalance *metering* to the healthiest org. Browsing stays
  // wherever the user is (viewing is free; billing always reads this file).
  let lastOrgId
  try {
    lastOrgId = readSession()?.current?.organizationId
  } catch {}
  const pollSessionFile = () => {
    let cur
    try {
      cur = readSession()
    } catch {
      return
    }
    if (!cur?.token) return
    const orgId = cur.current?.organizationId
    if (!orgId || orgId === lastOrgId) return
    const isFirstObservation = lastOrgId === undefined
    lastOrgId = orgId
    if (isFirstObservation) return
    if (switchDebounce) clearTimeout(switchDebounce)
    switchDebounce = setTimeout(async () => {
      switchDebounce = null
      const label = cur.current?.label ?? orgId
      try {
        let status
        try {
          status = await orgStatus(cur.token, orgId)
        } catch (err) {
          // 404 = file points at an org we lost access to; treat like
          // exhaustion so the metering gets rebuilt on a valid org
          if (!String(err.message).includes("404")) throw err
          logWatch(`workspace changed -> ${label}: server rejects this org (404), rebuilding`)
          const rescue = await rotate({})
          logWatch(`rebalance: ${rescue.action} — ${rescue.detail}`)
          if (rescue.action === "rotated") notifyMac(`Org unavailable — agent billing moved to ${rescue.selection?.label}`)
          return
        }
        if (status.allowed) {
          logWatch(`workspace changed -> ${label}: healthy (remaining ${status.remaining})`)
          return
        }
        logWatch(`workspace changed -> exhausted org ${label}, rebalancing metering`)
        const result = await rotate({})
        logWatch(`rebalance: ${result.action} — ${result.detail}`)
        if (result.action === "rotated") {
          notifyMac(
            `${label} is exhausted — agent billing moved to ${result.selection?.label}`,
          )
        }
      } catch (err) {
        logWatch(`workspace-change check failed: ${err?.message ?? err}`)
      }
    }, 2000)
  }
  // fs.watch on macOS (FSEvents) unreliably delivers events for content
  // appends to an existing file — a real incident was missed this way. Poll
  // the file's size as a deterministic safety net; fs.watch stays as the
  // fast path for instant reaction.
  pollTimer = setInterval(() => {
    rescan()
    pollSessionFile()
  }, 3_000)
  // Quit-watch hardening: only judge after pen.app has been seen alive once
  // (protects slow cold boots), and require two consecutive misses so a brief
  // restart gap (e.g. the auto-updater relaunching the process) is survived.
  let seenPen = false
  let misses = 0
  const tickMs = Number(process.env.PEN_TICK_MS) || 20_000
  quitTimer = setInterval(() => {
    const running = isPenRunning()
    if (running) {
      if (!seenPen) {
        seenPen = true
        misses = 0
        logWatch("pen.app detected, quit-watch armed")
      } else if (misses > 0) {
        misses = 0
        logWatch("pen.app is back — survived a restart gap")
      }
      return
    }
    if (!seenPen) return // grace: no verdict before first sighting
    misses++
    if (misses >= 2) {
      stop("pen.app quit")
      process.exit(0)
    }
    logWatch(`pen.app missing (${misses}/2) — waiting for a possible restart`)
  }, tickMs)
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      stop(signal)
      process.exit(0)
    })
  }
}

async function launch() {
  if (!existsSync(APP)) {
    console.error(`Pen.app not found at ${APP}`)
    process.exit(1)
  }
  // cold-start preflight: if the last-used org is exhausted, move metering to
  // the healthiest org BEFORE the app boots, so it comes up quota-ready and
  // its first workspace write goes to the healthy org too
  try {
    const pre = await rotate({})
    if (pre.action === "rotated") console.log(`preflight: ${pre.detail}`)
    else if (pre.action === "exhausted") console.log(`preflight: ${pre.detail}`)
  } catch (err) {
    console.log(`preflight skipped (${err?.message ?? err})`)
  }
  if (watcherAlive()) {
    console.log(`watcher already running (pid ${watcherAlive()}), just opening Pen.app`)
  } else {
    const child = spawn(process.execPath, [process.argv[1], "watch"], {
      detached: true,
      stdio: "ignore",
    })
    child.unref()
    // let the watcher write its pidfile before we print
    await new Promise((r) => setTimeout(r, 300))
    console.log(`watcher started in the background (pid ${watcherAlive() || "?"})`)
  }
  spawn("open", ["-a", "Pen"], { stdio: "ignore" }).unref()
  console.log("Pen.app opened. The watcher rotates orgs when its native agent hits the limit.")
  console.log(`log: ${path.join(homedir(), ".pencil", "org-rotator.log")}`)
}

async function stop() {
  const alive = watcherAlive()
  if (!alive) {
    console.log("no watcher running")
    try {
      unlinkSync(PIDFILE)
    } catch {}
    return
  }
  try {
    process.kill(alive, "SIGTERM")
    console.log(`stopped watcher (pid ${alive})`)
  } catch (err) {
    console.log(`could not stop watcher: ${err?.message ?? err}`)
    unlinkSync(PIDFILE)
  }
}

async function list() {
  const session = readSession()
  const orgs = await listOrgs(session.token)
  const rows = await Promise.all(
    orgs.map(async (o) => ({ org: o, status: await orgStatus(session.token, o.id) })),
  )
  console.log(`account: ${session.email}`)
  console.log(`active:  ${session.current?.label ?? "none"}`)
  console.log("")
  for (const { org, status } of rows) {
    const mark = org.id === session.current?.organizationId ? "*" : " "
    console.log(
      `${mark} ${org.name.padEnd(14)} ${String(status.used).padStart(2)}/${status.limit} used  ` +
        `remaining ${status.remaining}${status.allowed ? "" : "  (exhausted)"}`,
    )
  }
}

async function status() {
  const session = readSession()
  const orgs = await listOrgs(session.token)
  const active = orgs.find((o) => o.id === session.current?.organizationId)
  if (!active) return console.log("active org not in membership list")
  console.log(JSON.stringify(await orgStatus(session.token, active.id), null, 1))
}

async function use(name) {
  if (!name) return console.log("usage: pen use <org name>")
  const session = readSession()
  const orgs = await listOrgs(session.token)
  const org = orgs.find((o) => o.name.toLowerCase() === name.toLowerCase())
  if (!org) return console.log(`no org named "${name}" (${orgs.map((o) => o.name).join(", ")})`)
  const selection = selectionForOrg(org)
  applyWorkspace(session, selection)
  log(`[watch] manual switch -> ${selection.label}`)
  console.log(`switched to ${selection.label}`)
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2)
  switch (cmd) {
    case undefined:
      return launch()
    case "watch":
      return watch()
    case "stop":
      return stop()
    case "list":
      return list()
    case "status":
      return status()
    case "rotate": {
      const result = await rotate({})
      console.log(JSON.stringify(result, null, 1))
      if (result.action === "rotated") notifyMac(`Switched: ${result.detail}`)
      return
    }
    case "use":
      return use(args[0])
    default:
      console.log("usage: pen [watch|stop|list|status|rotate|use <name>]")
  }
}

main().catch((err) => {
  console.error(String(err))
  process.exit(1)
})
