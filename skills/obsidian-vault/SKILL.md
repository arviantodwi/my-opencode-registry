---
name: Obsidian Vault
description: Search, capture, update, tag, and review durable knowledge and
  evidence-backed ideas in the configured Obsidian vault. Use for explicit vault
  work, when another task produces reusable factual knowledge, a research
  finding, a troubleshooting result, or an evidence-backed idea worth
  preserving, or when asked to review a session for missed capture
  opportunities (for example via `/vault-capture`).
---

# Obsidian Vault

## Purpose and activation

Use this skill when the user asks to search, create, edit, tag, link, or review vault notes. Also use it proactively at meaningful task outcomes when the session may have produced a genuinely reusable fact, research finding, verified troubleshooting result, or evidence-backed idea worth preserving.

There are two capture entry points, and both apply the same criteria:

- **Proactive**: at a meaningful task outcome, consider whether the session produced a plausible candidate. Considering does not require opening the vault; search and read only when a candidate is plausible, and never turn routine conversation into notes.
- **Manual**: an explicit `/vault-capture` (or an equivalent request) asks for a thorough review of the current session for opportunities the agent may have missed while working. See Session capture review below.

Reading the vault is generally permitted, including in read-only modes such as Plan mode, subject to active tool permissions. In a read-only mode, perform eligible reads and propose changes; defer every write, including local configuration, notes, indexes, and match tracking, until the user switches to a write-capable agent. Project status, task lists, and commitments belong with their corresponding project, not in this knowledge base, unless the user explicitly asks otherwise.

Treat Markdown files as the source of truth. Ordinary note work does not require the Obsidian desktop app or CLI.

### Session capture review

When the user invokes `/vault-capture` or otherwise asks for a capture review of the current session:

1. Review the full conversation where available, including earlier messages, not just the current exchange. State plainly when older context is unavailable.
2. Apply the same capture bar, search-first rule, evidence, and deduplication requirements as proactive capture. A manual review is a second pass over the same material, not a lower bar or an excuse to relax the quality threshold.
3. Prefer improving an existing note when a small verified addition fits it; create a new note only when it meets the full bar.
4. Finish with a brief outcome report: what was created or updated and why, or, when nothing qualifies, a specific reason. Creating no notes is a successful review, not a failure.
5. Re-running a review of the same session must not create duplicate notes or inflate idea match counts. A match counts only when the idea's substance materially helps a distinct user task.

## Resolve the vault and first-use setup

Resolve the vault when an explicit task needs vault access or a plausible capture candidate needs a search. A session review with no plausible candidates can finish without setup or vault access.

The machine-local setting is `~/.config/obsidian-vault/config.json`. It contains a `vault_root` string and stays outside the shared skill/configuration repository. It is read explicitly by the helper; Markdown does not interpolate variables or paths automatically.

Use the skill base directory supplied when this skill loads. Run the following with that directory as the shell working directory, or use the helper's absolute path derived from that base. Do not assume the current project directory contains the skill.

```text
python3 scripts/resolve_vault.py
```

The helper uses Python 3's standard library, prints JSON, and never prompts on stdin. A `ready` result exits with code 0; setup or access problems exit with code 1 and a status/message. The agent handles the conversation:

- **`ready`**: use the returned absolute `vault_root` and `folders.wiki` / `folders.ideas` paths for file tools. Re-resolve at the start of each vault task; do not rely on a path remembered from another machine or an earlier task.
- **`config_missing`**: ask once, through the available chat question/input UI: "Where is your Obsidian vault on the machine running this agent? Give an existing absolute path or a path starting with `~/`. I'll save it as this machine's local vault setting." On a VM, ask for a path accessible inside the VM, such as a synced copy or mount.
- **`config_invalid`** or **`invalid_vault_path`**: explain the validation error and ask for a corrected path. Do not scan the filesystem to guess a vault.
- **`vault_unavailable`**: explain which path is unavailable. Ask whether the user wants to restore access and retry or configure a different existing directory. Do not create a replacement vault or silently fall back to another location.
- **`config_exists`**: preserve the existing setting. Use `--replace` only when the user has explicitly chosen to change or repair it.
- **`config_error`**: report the local configuration access/write problem; do not fall back to another configuration location.

Validate a user-supplied path before saving it, quoting it as one shell argument:

```text
python3 scripts/resolve_vault.py check "<user-supplied-path>"
```

`check` is read-only. In Plan/read-only mode, its returned paths may be used for the requested read-only work, but report that saving the setting and any note changes require a write-capable agent. Do not invoke `configure` in that mode.

In a write-capable mode, save the validated choice and resume the original task:

```text
python3 scripts/resolve_vault.py configure "<user-supplied-path>"
```

For a user-requested correction of an existing setting, use `configure "<user-supplied-path>" --replace`. Creating or replacing this one local setting is separate from capturing notes: it needs no vault-wide search and does not count as an idea match. The helper creates only its local configuration directory/file, never the vault or note folders.

If the user declines setup, skip the vault operation and say so briefly. Do not ask again during the same session unless the user requests setup, retries the operation, or explicitly invokes `/vault-capture` again. An access/setup blocker is different from "nothing qualified."

## Vault boundary

- The configured, resolved `vault_root` is the vault for this machine.
- Search, read, and write only Markdown notes inside the returned `folders.wiki` and `folders.ideas`. Do not inspect other vault paths, root-level files, `.obsidian/`, or attachments. Reading the machine-local configuration and running the bundled resolver are the setup exceptions, outside the vault.
- Resolve file paths before access; do not follow note or nested-directory symlinks outside their approved knowledge folder. The resolver checks the two top-level folder paths, not every descendant.
- These are the only approved knowledge folders. `missing_folders` identifies folders that do not exist yet: create one only when a qualifying note or its index needs to be written and the active mode permits writes. Do not create other directories without approval.
- An inaccessible vault or an invalid existing knowledge folder is a blocker. Follow the recovery flow above rather than selecting another location automatically.

## Decide whether to capture

Proactive creation and editing are allowed, but use a high quality bar:

1. Capture only information that is genuinely new, useful beyond the current exchange, and sufficiently clear to preserve.
2. Before every create or edit, search existing note titles and contents in both approved folders, including the indexes. Reuse or improve a suitable note instead of creating a near-duplicate. If the information is already covered, do not write it again.
3. Skip borderline material. Ask only when an ambiguous item seems unusually important.
4. Do not automatically capture personal details or preferences. Save a personal detail only when the user explicitly asks. Never put passwords, API keys, tokens, or other credentials in the vault.

### Quality bar

- Skip material that mostly restates documentation or other public sources. A clear explanation qualifies only when the session adds a meaningful insight, application, or lesson beyond what the source already says.
- Skip one-off fixes whose cause is unverified: a problem that disappeared after a single unrepeated step waits for a repeatable result before capture.
- Verified negative findings qualify for `wiki/`: what was tried, why it failed, and the conditions under which the conclusion holds, even when no working solution was found.
- Findings that mainly help one project belong in that project's documentation, not the vault. The vault holds transferable knowledge; when a broader lesson was verified in one environment, scope it explicitly in the note.
- Small, verified tips may justify a concise update to an existing relevant note even when they do not deserve a note of their own.

Classify qualifying content as follows:

- **`wiki/`**: durable, reusable, genuinely new factual knowledge or a well-supported process. This can be technical or non-technical.
- **`ideas/`**: a promising direction supported by practical evidence — a test, experiment, implementation result, or observable outcome — that is not yet established knowledge. Clearly label what remains unverified; add its rationale and questions to revisit when useful. A well-argued idea without practical evidence waits for a test, prototype result, or demonstrated usefulness before capture.

Do not put unsupported factual claims in `wiki/`. If an uncertain item does not meet the idea bar above, skip it rather than laundering it into a note.

## Note conventions

- Write notes in English. Prefer plain, concise language; avoid unnecessary jargon and filler.
- Use Title Case filenames for new notes. Do not proactively rename existing notes to normalize their names.
- Keep one main topic per note. Make it self-contained and easy for both a person and another agent to understand. Use headings such as summary, evidence, rationale, or questions to revisit when they help; there is no rigid body template.
- Use Obsidian `[[wikilinks]]` for note links. Add a short related-notes section at the bottom when relevant.
- Use YAML/Obsidian `tags` properties when tags are applicable. Tags are freeform but must stay relevant and meaningful: assign only tags that describe the note's actual topic, tool, or concept, never random or weakly related tags. Meaningful tags improve AI retrieval and keep tag/graph connections useful and efficient to traverse. Use lowercase kebab-case, reuse existing relevant tags, and add all salient topic/tool/concept tags without padding the list with generic tags. For example, a React Hook Form and Zod note could include `react-hook-form`, `zod`, `typescript`, `react`, `form-validation`, and `hookform-resolvers` when each is genuinely relevant.
- Add tags to new notes and to existing notes being edited, except index notes. Do not bulk-tag older notes unless asked.
- Maintain `wiki/Wiki Index.md` and `ideas/Ideas Index.md` as concise lists of wikilinks with helpful descriptions. Both index notes carry no `tags` property. Keep the ideas index's match count and last-matched date current. Create an index when the first qualifying note in its folder is written; do not create empty placeholder indexes just for housekeeping.

## Evidence, sources, and troubleshooting

- In `wiki/`, support factual claims with references or clearly labeled provenance. For researched claims, prefer primary or official sources and include links plus the date or product/version when it affects whether the information remains current.
- Distinguish independently verified facts from user-reported information and unverified claims. Label provenance or uncertainty clearly. Never invent or imply a source that was not checked.
- When reliable evidence resolves a conflict in an existing note, update the current claim and retain the previous claim with its date and source so the change is traceable. If the evidence does not clearly resolve the conflict, preserve the competing claims and flag the discrepancy.
- For troubleshooting notes, preserve the relevant environment and versions, symptoms, hypotheses, attempted steps (including failures), confirmed cause versus remaining uncertainty, fix, verification, and references. Do not present an unverified hypothesis as a confirmed fix.
- When using or editing a relevant note, refresh time-sensitive facts if reliable new evidence is available and flag stale or uncertain information. Do not scan the whole wiki for maintenance unless asked.

## Idea match tracking and weekly review

Every idea note should have YAML/Obsidian properties for `match_count`, `last_matched`, and `matches`. Each `matches` entry contains an ISO date and a short task label; do not copy full prompts into the log. For example:

```yaml
---
tags:
  - example-tag
match_count: 1
last_matched: YYYY-MM-DD
matches:
  - date: YYYY-MM-DD
    label: "Initial capture: concise task label"
---
```

- Count the task that first created the idea as match 1.
- Add at most one match for each distinct user task where the idea's substance materially helps. Do not count keyword overlap, repeated searching, follow-up turns, rephrases, or the weekly review itself.
- Track matches only; there is no automatic promotion threshold. A high count is a review signal, not permission to move a note.
- Run the review only when asked. Summarize ideas ordered by match count (highest first), then recency, and suggest possible `ideas/` → `wiki/` promotions. Never move an idea as a result of the count alone.
- Update `ideas/Ideas Index.md` when an idea is created or its tracking changes.

## Approval boundaries and reporting

- Creating or editing a note proactively is allowed when it meets this skill's capture bar and the search-first rule.
- Do not proactively move or delete notes. If you recommend either action, explain the exact change and wait for approval. A direct user instruction to move or delete a note counts as approval; do not ask for a second confirmation.
- Do not rename notes proactively. A direct user instruction to rename a note counts as approval.
- When a note is moved or renamed at the user's direction, update the affected index entries and links that are within the approved folders.
- Briefly report every note created or updated, with its path or wikilink and why it was worth saving. Do not dump the full note into the response unless asked.
- For a capture review, proactive or manual, state the outcome even when nothing qualified, with a specific reason. An empty result is a valid outcome, not a failure.
