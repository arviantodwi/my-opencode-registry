// Unit tests for pickTarget — run: node test.js
// Pure function: no network, no file writes.

import { pickTarget } from "./logic.js"

let failures = 0
function check(name, actual, expected) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a === e) console.log(`PASS ${name}`)
  else {
    failures++
    console.log(`FAIL ${name}\n  expected ${e}\n  actual   ${a}`)
  }
}

// helpers — ids reflect API order (personal = index 0)
const cand = (id, used, remaining, opts = {}) => ({
  org: { id, name: id, isPersonal: opts.personal ?? id === "personal" },
  status: { used, remaining, ...(opts.allowed === false ? { allowed: false } : {}) },
})

// 1. burning beats pristine (the index-3 complaint)
check(
  "tier A beats pristine",
  pickTarget([cand("personal", 5, 0, { allowed: false }), cand("b", 0, 5), cand("c", 2, 3)])?.org.id,
  "c",
)

// 2. fewest remaining first within Tier A
check(
  "fewest remaining wins in Tier A",
  pickTarget([cand("a", 1, 4), cand("b", 3, 2), cand("c", 2, 3)])?.org.id,
  "b",
)

// 3. tie in Tier A -> API order (stable)
check(
  "tier A tie -> API order",
  pickTarget([cand("a", 1, 4), cand("b", 2, 4), cand("c", 3, 4)])?.org.id,
  "a",
)

// 4. all burned out -> first pristine in API order (personal included)
check(
  "tier B first pristine (API order, personal eligible)",
  pickTarget([cand("personal", 5, 0, { allowed: false }), cand("b", 5, 0, { allowed: false }), cand("c", 0, 5), cand("d", 0, 5)])?.org.id,
  "c",
)

// 5. exhausted pristine is never picked
check(
  "exhausted pristine excluded",
  pickTarget([cand("personal", 5, 0, { allowed: false }), cand("b", 5, 0, { allowed: false })]),
  undefined,
)

// 6. mixed: exhausted everywhere except one burning org
check(
  "sole survivor picked",
  pickTarget([cand("a", 5, 0, { allowed: false }), cand("b", 4, 1), cand("c", 5, 0, { allowed: false })])?.org.id,
  "b",
)

// 7. nothing alive at all -> undefined (Tier C)
check("all exhausted -> undefined", pickTarget([cand("a", 5, 0, { allowed: false })]), undefined)

// 8. empty candidate list
check("empty list -> undefined", pickTarget([]), undefined)

// 9. missing `used` field treated as pristine (defensive)
check(
  "missing used -> treated pristine",
  pickTarget([cand("a", undefined, 5)])?.org.id,
  "a",
)

// 10. Tier A still preferred when pristine has MORE remaining
check(
  "pristine with more remaining still loses to burning",
  pickTarget([cand("a", 1, 1), cand("b", 0, 5)])?.org.id,
  "a",
)

// 11. personal burning participates in Tier A normally
check(
  "personal burning eligible in Tier A",
  pickTarget([cand("personal", 2, 3), cand("b", 0, 5)])?.org.id,
  "personal",
)

process.exit(failures ? 1 : 0)
