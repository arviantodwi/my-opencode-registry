---
description: TypeScript Review — diff-scoped review (fallow + tsc + eslint + ast-grep) that writes an openchamber plan and tickets, then stops for human review. Read-only; never fixes.
subagent: false
---

Load the skill `ts-review` by ID and execute its full workflow.

## Invocation

User arguments: `$ARGUMENTS`

## Pre-resolved context (empty output means "not resolvable here"; the skill re-resolves at runtime)

- Current branch: !`git branch --show-current 2>/dev/null`
- Repo default branch: !`(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null || echo refs/remotes/origin/main) | sed 's@^refs/remotes/origin/@@'`
- Repo root: !`git rev-parse --show-toplevel 2>/dev/null`

## Steps

1. Apply the skill's Argument Contract to the user arguments plus the resolved context above: complete arguments proceed silently; anything missing is collected through the skill's interactive form with every field showing its resolved default; unknown arguments are corrected against the valid list before asking. After collection, print the skill's canonical echo line.
2. Run the pipeline exactly as the skill defines it: preflight → mechanical sweep → judgment passes → openchamber plan → tickets → gate.
3. Stop once the plan and tickets exist. Do not fix anything, do not apply `fallow fix`, do not touch application code.
