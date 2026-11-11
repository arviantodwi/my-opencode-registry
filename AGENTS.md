## CLI tooling
- Use rg/fd for shell pipelines and batch operations; built-in search tools remain fine for single lookups.
- Use jq for JSON in shell pipelines.
- Use ast-grep for structural searches and multi-file codemods; preview the diff before applying.

## tmux for long-running processes

Use tmux for anything that outlives a single tool call: dev servers, file watchers, long builds, and interactive logins. Do not leave orphaned processes behind from the shell tool.

- One session per project, named `oc-<repo>` from the git root basename (e.g. `oc-my-personal-website`), with the repo root as its start directory.
- Windows are roles: `dev` for the app server, `run` for builds/tests/watchers, `auth` for interactive logins. Keep `dev` as window 0 and create the others on demand.
- Before creating, run `tmux has-session -t "=$S" 2>/dev/null`; reuse the session if it exists. Never start a second server on the same port.
- Create detached: `tmux new-session -d -s "$S" -c "$ROOT" -n dev`, then run the command with `tmux send-keys -t "$S:dev" '<command>' C-m`.
- Never run `tmux attach` from an agent shell; it blocks. Read output with `tmux capture-pane -pt "$S:dev" -S -300`; send input with `tmux send-keys`.
- Wait for readiness by polling the URL or a specific log line, not by sleeping blindly. Respect the project's documented port; if it is occupied, identify the owner and reuse it, never kill it blindly.
- Stop a process with `C-c` in its window and verify the port is free. Leave the session alive during active work and tell the user `tmux attach -t "=$S"` (detach with `Ctrl-b d`). Kill it with `tmux kill-session -t "=$S"` when the work is finished and the user no longer needs it, or when the user asks.
- Never run `tmux kill-server`; it destroys the user's sessions too.
- For interactive authentication such as `gh auth login`, use the `auth` window and ask the user to attach and complete it.

## GitHub CLI

- Read-only `gh` use is always fine: `gh pr view`, `gh pr diff`, `gh issue view`, `gh run view`, `gh api` GET requests.
- Ask before any GitHub-side write: create/edit/close an issue or PR, post a comment or review, push a branch, rerun/cancel a workflow, merge, release, or delete. "Fix this" authorizes local changes, not a public PR or comment.
- Merging is always an explicit user decision, even when checks pass.
- Authentication is user-owned and interactive; the user runs `gh auth login`. Never ask for a token in chat.

## Obsidian knowledge base

- Canonical vault: `/Users/sean/Desktop/Obsidian/AI-KB`.
- For explicit vault work, load the global `obsidian-vault` skill before reading or changing notes. Its skill ID is `obsidian-vault`; its file is `/Users/sean/.agents/skills/obsidian-vault/SKILL.md`.
- At meaningful task outcomes, proactively consider whether the session produced potentially reusable knowledge or an evidence-backed idea. When a plausible candidate exists, load `obsidian-vault` and apply its capture criteria, following its search-first rule before creating or updating notes. If no plausible candidate exists, skip vault access.
- An explicit `/vault-capture` requests a manual review of the current session for missed capture opportunities, using the same capture criteria as proactive capture. Creating no notes is a valid outcome; briefly explain why nothing qualified.
- Reading the vault is generally permitted, including in read-only modes such as Plan mode; writes follow the skill's approval boundaries.
- The skill is the source of truth for capture criteria, permitted vault paths, evidence, tags, tracking, and approval boundaries.
