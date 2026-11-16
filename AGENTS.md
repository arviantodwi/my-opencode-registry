## Agents language

Always use English in every response. Some open-weighted models tend to give a response in Chinese/Mandarin, and I totally don't understand it.

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

## Git policy

Never commit after every change. Commit only when the user explicitly instructed.

## GitHub CLI

- Read-only `gh` use is always fine: `gh pr view`, `gh pr diff`, `gh issue view`, `gh run view`, `gh api` GET requests.
- Ask before any GitHub-side write: create/edit/close an issue or PR, post a comment or review, push a branch, rerun/cancel a workflow, merge, release, or delete. "Fix this" authorizes local changes, not a public PR or comment.
- Merging is always an explicit user decision, even when checks pass.
- Authentication is user-owned and interactive; the user runs `gh auth login`. Never ask for a token in chat.

## Obsidian knowledge base

- For explicit vault work, load the `obsidian-vault` skill by ID before reading or changing notes.
- Session bootstrap (unconditional): on the first turn of a session, before answering anything — including a trivial question — load the `obsidian-vault` skill, resolve the vault with its helper, and read the vault's `index.md` in full, alongside handling the first message. Never skip this because the request looks too simple: you cannot know from the first message whether the session will become real work, and the map is needed exactly then. Do not gate this on whether the task looks vault-related; the accepted cost is one resolver call plus one small file read. This bootstrap read is the one unconditional vault access; the skill's candidate-gating rule otherwise stands. If the resolver reports a setup or access problem (for example an iCloud vault temporarily unreachable), skip the read, mention it in one line, and continue the session's work; never block the task on vault setup. The bootstrap is silent: never mention the vault, the index, the resolver, or a capture judgment in the reply — not even parenthetically — unless the user asks, a note was actually created or updated during the session, or the vault is genuinely unavailable (then one line stating the access problem, never "nothing was worth capturing"). The tool activity already shows the work.
- This file holds behavior, not knowledge. Before adding a fact, fix, recipe, or reference here — however small — check the vault's `index.md` at the vault root (resolve the vault via the obsidian-vault skill's helper; the path is machine-local, and device-specific paths stay out of shared instructions). Extend the existing note or capture a new one, and reference it from here only if agents need it during normal work. Only standing instructions belong in this file.
- Knowledge precedence when applying or capturing: project-local AGENTS.md and its docs/ first (project-scoped facts and guidelines), then the vault (global memory for durable, reusable knowledge), then this file (behavior only).
- At meaningful task outcomes, proactively consider whether the session produced potentially reusable knowledge or an evidence-backed idea. When a plausible candidate exists, load `obsidian-vault` and apply its capture criteria, following its search-first rule before creating or updating notes. If no plausible candidate exists, skip vault access.
- Reading the vault is generally permitted, including in read-only modes such as Plan mode, subject to active tool permissions. All writes, including first-use configuration, must respect the active agent mode and the skill's approval boundaries.
- The skill is the source of truth for capture criteria, permitted vault paths, evidence, tags, tracking, and approval boundaries.
