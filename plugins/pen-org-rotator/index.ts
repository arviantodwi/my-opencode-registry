// pen-org-rotator — OpenCode plugin (server part).
// Event-driven workspace rotation for pen.dev. Checks the active
// organization's remaining free MCP days before pencil tool calls
// (throttled), reacts to billing-related tool errors by rotating
// immediately, and notifies the user on rotation.
//
// Scope note: this plugin only sees tool calls executed by OpenCode
// (MCP or Code Mode). Actions taken natively inside the pen.app UI
// (its built-in agent, workspace switching, sync) are invisible here.

import { Plugin } from "@opencode/plugin"
import { rotate, readSession, log } from "./logic.js"
import { execFile } from "node:child_process"

const CHECK_INTERVAL_MS = 2 * 60 * 1000

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

export default Plugin.define({
  id: "pen-org-rotator",
  async setup(ctx) {
    let lastCheckAt = 0
    let inFlight = undefined

    const check = (force = false) => {
      if (inFlight) return inFlight
      if (!force && Date.now() - lastCheckAt < CHECK_INTERVAL_MS) return undefined
      inFlight = (async () => {
        try {
          const session = readSession()
          if (!session.token) return
          const result = await rotate({})
          lastCheckAt = Date.now()
          if (result.action === "rotated") {
            log(`rotated: ${result.detail}`)
            notifyMac(`Switched: ${result.detail}`)
          } else if (result.action === "exhausted") {
            log(`exhausted: ${result.detail}`)
            notifyMac("All pen.dev orgs exhausted this month")
          } else if (result.action !== "noop") {
            log(`check: ${result.action} — ${result.detail}`)
          }
        } catch (err) {
          log(`check failed: ${err?.message ?? err}`)
        } finally {
          inFlight = undefined
        }
      })()
      return inFlight
    }

    const beforeReg = await ctx.tool.hook("execute.before", async (event) => {
      if (!/pencil/i.test(String(event?.tool ?? ""))) return
      await check(false)
    })

    // Billing errors surface in tool results/errors; react instantly instead
    // of waiting for the next throttled check.
    const afterReg = await ctx.tool.hook("execute.after", async (event) => {
      if (!/pencil/i.test(String(event?.tool ?? ""))) return
      const text = JSON.stringify(event?.error ?? event?.result ?? "").toLowerCase()
      if (/limit|upgrade|billing|usage|free day/.test(text)) await check(true)
    })

    log("plugin loaded (v2: ttl + error-reactive)")
    return () => {
      beforeReg.dispose()
      afterReg.dispose()
    }
  },
})
