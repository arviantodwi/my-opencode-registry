---
name: TypeScript Review
description: Structured TypeScript code review (fallow + tsc + eslint + ast-grep) that produces
  an openchamber plan and per-finding tickets, then stops for human review. Invoke only via
  /ts-review or when the user explicitly asks for a TypeScript review of a branch, diff, or
  directory. Never for writing code, quick questions, debugging, or ordinary TypeScript work.
---

# TypeScript Review

A diff-scoped code review whose only outputs are one openchamber plan plus tickets.
**The review never fixes anything.** Its final act is publishing the plan and tickets,
then stopping for human review. Fixes belong to later sessions that pick up tickets.

Mandate: read-only over application code. Do not edit, do not add suppression
comments, do not run `fallow fix`. The only writes allowed are the plan, its todos,
and — only when the openchamber knowledge tooling is unavailable — a markdown report file.

## 1. Argument contract

| Arg | Kind | Default (resolve live) | Effect |
| --- | --- | --- | --- |
| `context-dir` | positional 1 | repo root (whole diff) | scopes review + sweep to a subtree |
| `feature-branch` | positional 2 | current branch | branch under review |
| `base-branch` | positional 3 | repo default branch | merge-base diff target |
| `--mutation` | flag | off | adds `fallow mutation` (runs the project test suite) |
| `--full` | flag | off | whole-repo audit instead of the branch diff; ignores feature/base, keeps context-dir |
| `--similar` | flag | off | adds `fallow similar-code` (same-intent duplicates; local model, first run downloads it) |

Resolution commands (run these before asking; the `/ts-review` command pre-resolves them
via shell blocks, so reuse that output when present):

```bash
git branch --show-current                                   # default feature-branch
(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null || echo refs/remotes/origin/main) | sed 's@^refs/remotes/origin/@@'   # default base-branch
git rev-parse --show-toplevel                               # repo root = default context-dir
```

### Behaviors

1. **Complete arguments** → proceed silently, zero questions.
2. **No arguments** → show the full interactive form below.
3. **Partial arguments** → show the form with only the unsupplied fields; already-supplied
   values are never re-asked.
4. **Unknown or invalid argument** → state it is not valid, list the valid arguments, and
   re-ask only the affected fields. Never guess a flag's meaning.
5. Positional parsing: fill in order `context-dir → feature-branch → base-branch`. A lone
   positional is `context-dir` if that path exists, otherwise it is `feature-branch` (and a
   following positional is `base-branch`). Use `.` for "repo root" when skipping an early
   positional. Long forms `--context/--feature/--base <value>` are also accepted anywhere.
6. `--full` together with explicit branches: warn once that branches are ignored, keep
   `--full`.

### Interactive form

Show every field's **resolved default** — the user is learning the interface and should see
*their* defaults, not generic ones. Preferred renderer: the openchamber page tool
(`render.page` with `ui` and `awaitAnswer`) using this shape; otherwise use the question
tool or plain numbered questions with the same fields:

| Field | Kind | Label | Placeholder / options |
| --- | --- | --- | --- |
| context | Input | Which part of the codebase? (the @-scope) | `default: repo root (whole diff) — e.g. apps/api` (prefill resolved root) |
| feature | Input | Branch under review | `resolved live: your current branch — e.g. feat/payment-retry` (prefill resolved branch) |
| base | Input | Diff target | `resolved live: the repo's default branch — e.g. main` (prefill resolved default) |
| mutation | Choice | Run mutation testing? | `off (default)` / `on — adds fallow mutation, runs your suite` |
| full | Choice | Full sweep instead of branch diff? | `off (default)` / `on — whole-repo audit, ignores feature/base, keeps context-dir` |
| similar | Choice | Hunt same-intent duplicates? | `off (default)` / `on — fallow similar-code; first use downloads a local model` |

Unanswered fields take their defaults.

### Canonical echo

Immediately after collecting arguments — before any work — print the exact invocation the
user would have typed, in a bash code block, e.g.:

```bash
/ts-review apps/api dev main --mutation
```

Rules: `.` stands for repo-root context; omit flags that are off; include flags that are on.
This echo is deliberate: each interactive run teaches the next manual one.

## 2. Preflight

1. Verify a git repo; verify both branches resolve (`git rev-parse --verify`); verify the
   context path exists (or default to root).
2. Detect the stack for the judgment tiers: inspect `package.json` deps and configs.
   - `next` → **Next.js tier** (adds server/client boundary checks)
   - `react-native` → **React Native tier** (adds list/native perf checks)
   - other React (vite/webpack SPA) → **React tier**
   - none of the above → **universal tier** (skips pass 4.2 entirely)
   In workspaces, map `context-dir` to its workspace package for fallow `--workspace`.
3. Fallow binary: resolve once per run with `fallow --version`. The plain `fallow` binary
   on PATH is canonical — homebrew-managed and kept current by the user — so use it for
   every command in this workflow. Only when the binary is missing (another machine, CI),
   fall back to `npx fallow` and note the fallback in the report. Never silently skip
   the sweep.
4. Fallow config: if `.fallow/config.json` is absent, run `fallow recommend` (changes
   no files), summarize the proposed config, and get user confirmation before reviewing.
   Record the decision in the report.
5. Scope: `MB=$(git merge-base <feature> <base>)`; changed files via
   `git diff --name-only "$MB..<feature>" [-- <context-dir>]`; capture the count and the
   diff content for the judgment passes.

## 3. Mechanical sweep

Run from the repo root. Fall back to the repo's own scripts when they exist (e.g. the
package.json `typecheck`/`lint` scripts) — prefer repo config over assumptions.

| Check | Command | Notes |
| --- | --- | --- |
| Diff gate (front door) | `fallow audit --base <base> --format json --quiet` | only findings the change introduces; with `--full`: `fallow --format json --quiet` + `fallow architecture` instead |
| Dead code | `fallow dead-code --format json --quiet` | verify each ticketable deletion with `--trace <file:symbol>` before writing the ticket |
| Duplication | `fallow dupes --format json --quiet` | |
| Complexity / health | `fallow health --format json --quiet` | hotspots + score |
| Architecture / cycles | `fallow architecture --format json --quiet` | boundary presets + circular deps |
| Styling drift | `fallow health --css --format json --quiet` | frontend tiers only |
| Types | `tsc --noEmit` (repo's script/project refs) | fallow does not type-check |
| Lint + hooks | eslint on changed files | `react-hooks` rules must be at error level; a repo missing the plugin config is itself a **tooling finding** |
| Formatting | repo formatter in check mode (`prettier --check` / `biome check`) | never fight the repo config |
| Risk patterns | `for f in null-undefined numbers-dates async-races equality-conditionals; do ast-grep scan --rule <skill-rules>/$f.yml <changed paths>; done` — `--rule` cannot repeat on current ast-grep; run once per family file | `<skill-rules>` is this skill's `rules/` directory; see Appendix B |
| `--mutation` | `fallow mutation --format json --quiet` | runs the test suite; targets changed code |
| `--similar` | `fallow similar-code` | candidates, not findings; first run downloads a local model |

Mechanical output is **input signal for the judgment passes, not the review itself**.
Keep the sweep in the main session (deterministic, seconds); it is cheap.

## 4. Judgment passes

Four passes over the changed code, each fed by the relevant mechanical findings.
For large diffs, dispatch subagents in parallel — one per pass, each given the changed
files, the diff, and its pass's mechanical input — and synthesize in the main session.
The review session's model is whatever the session runs on; never pin one.

### 4.1 Business logic and edge cases

Anchor on: error paths and their handling, boundary values, state transitions,
ordering/atomicity, caching and concurrency, date/number formatting, i18n.
ast-grep hits are **leads, not verdicts**. Every finding must cite the exact
input that triggers it — a bug without a triggering input is a suspicion, not a finding.

### 4.2 Rendering and re-renders (React tiers only)

Heuristics: inline object/array/function props into hot components; context value churn
(new object each render); missing memoization on expensive subtrees; over-subscribed
selectors (store slices pulled whole); unstable list keys; derived state stored in effects
instead of computed; expensive computation in render bodies; random values in render.
Next.js tier adds: server/client boundary violations, non-serializable props across it,
`"use client"` placement. React Native tier adds: FlatList vs map-of-Views, inline
styles/functions in list rows.

### 4.3 Rules of hooks and dependencies

Lint output plus what the linter cannot see: dependency arrays with missing/extra/stale
entries; hooks behind conditional returns; stale closures captured in callbacks and
effects; missing effect cleanup; ref read/write timing across renders.

### 4.4 Test adequacy

For **every** finding, name the test that should have caught it. Flag tests that assert
implementation over behavior. With `--mutation`, fallow mutation survivors are the primary
evidence: a change no test detects is a test gap by definition.

### Tooling findings

Missing react-hooks config, no formatter, no `.fallow/config.json` (when recommend was
skipped), no lint in CI — report these as findings; they are the review improving itself.

## 5. Report

Publish via the openchamber knowledge tool: one plan (`kind: plan`). Fallback when the
knowledge tooling is unavailable: write `docs/reviews/YYYY-MM-DD-<feature>.md` and present
the summary in chat. Structure, identical every time:

1. **Verdict** — go / fix-first / no-go, with a one-paragraph rationale.
2. **Findings** — severity-ranked (`blocker` / `major` / `minor`); each entry: file:line,
   what and why, triggering input, suggested fix direction, the test that should exist,
   and the fallow fingerprint when mechanical (fingerprints let a re-review diff progress).
3. **Mechanical summary** — counts per fallow analysis; one line for notable *inherited*
   debt outside the diff (report, don't ticket).
4. **Test-gap map** — findings ↔ missing tests.
5. **Metrics** — health score, duplication %, cycle count, tsc/eslint/formatter status.
6. **Ticket index** — todo ids ↔ findings.

Severity rubric: blocker = merge-blocking (data loss, security, crash on main paths);
major = reachable bug on production paths; minor = quality and structure.

## 6. Tickets

Create openchamber todos linked to the plan (`planId`), **one per finding** — including
every judgment finding. Single exception: mechanical findings flagged `auto_fixable` by
fallow bundle into ONE ticket ("Apply fallow auto-fixes — N findings"), whose body
instructs running `fallow fix --dry-run`, reviewing the preview, then applying.

Todo body template:

```
[<severity>] <pass>: <short title>
File: <path>:<line>
What/why: <...>
Triggering input: <...>          (logic bugs only)
Fix direction: <...>
Test to add: <...>
Fingerprint: <fallow id, if mechanical>
```

Each ticket must be executable cold — the fixing session needs none of the review
session's context. Set `dependsOn`: blockers first; dead-code removals last, after
behavior fixes (nothing new should reference removed exports).

## 7. Gate

After the plan and todos exist, end the turn. Final message: verdict, top blockers,
plan + ticket count, and where to review them. If the user asks for fixes in the same
breath, decline: fixes start in a new session that picks up tickets.

## Appendix A — tool robustness

- `fallow schema` prints every command, flag, output format, and exit code as JSON for
  the *installed* version. Consult it when a flag errors; never hardcode assumptions
  across fallow releases.
- fallow exit codes: 0 clean/pass/warn · 1 findings or fail (a normal outcome) · 2
  validation/runtime error — never swallow a 2, and never treat it as "no findings".
- `--type-aware` sharpens dead-code results (exact symbol identity across aliases and
  re-exports) when they look suspicious.
- Suppression comments (`fallow-ignore-next-line`, `fallow-ignore-file`) may exist in the
  repo; report their presence and effect, never add them.
- `fallow agent install` targets Claude/Codex/Cursor, not OpenCode — irrelevant here; this
  skill calls the CLI directly.

## Appendix B — ast-grep rule pack

Rules live beside this file in `rules/` (the skill's base directory is provided at load
time). Files: `null-undefined.yml`, `numbers-dates.yml`, `async-races.yml`,
`equality-conditionals.yml`. They are leads for the judgment passes, not findings.

Version notes, verified against ast-grep 0.51.2:

- `--rule` cannot be repeated in one invocation — scan once per family file.
- Each rule ships as a TypeScript/Tsx twin pair: the TypeScript twin scans `.ts`, the Tsx
  twin scans `.tsx`, so both languages are covered without `languageGlobs` (not supported
  in this rule schema). If a future ast-grep supports it, twins can be merged.
- If a rule file fails to parse on a different installed version, validate with
  `ast-grep scan --rule <file> <fixture>` and adjust that field.
