# hig-* skills: Apple HIG reference for agents

Maintenance notes for the 14 HIG skills in this directory (hig-foundations, hig-platforms,
hig-patterns, hig-inputs, hig-technologies, hig-project-context,
hig-components-{content,controls,dialogs,layout,menus,search,status,system}).

## What this is

- Copied from https://github.com/raintree-technology/hig-doctor (MIT). The same project
  publishes an audit CLI (`npx hig-doctor .`) and MCP server (`npx -y hig-mcp`); those run
  the latest published npm version, so nothing here needs updating for them.
- Text under `references/` is Apple HIG content, © Apple Inc., reorganized by HIG Doctor.
  Apple's live HIG is canonical: https://developer.apple.com/design/human-interface-guidelines/

## Freshness model

- These skills are a frozen snapshot, not a live feed. The freshness signal is the
  attribution line at the top of every `references/*.md`: "snapshot YYYY-MM-DD".
- The `version:` field in each SKILL.md does not track snapshot changes. Ignore it.
- Upstream detects drift against Apple's DocC JSON nightly, but content changes are
  human-reviewed, so upstream intentionally lags Apple. Structural guidance (menu bar,
  windows, toolbars, dialogs, navigation) ages well; visual language does not.
- Known gap at install time: the 2025-02-02 snapshot predates the macOS 26 / Liquid Glass
  design language.
- Policy: when skill text and the live HIG disagree, the live HIG wins. Note the conflict
  in the Update log below so later sessions see it.
- `hig-project-context` looks for `.claude/apple-design-context.md` (a Claude Code path);
  in OpenCode it no-ops. To give an app tailored guidance, create that file in the
  project root or adapt the skill's lookup path.
- Updated references apply to new sessions; a session already in progress keeps the
  copies it loaded.

## How to update

Run from anywhere. Preview first, sync second. New upstream hig-* skills are picked up
automatically by the same loop; local-only hig-* directories (for example hig-updater)
are never touched, because the loop walks upstream's skills/hig-* list. An agent can run
this procedure for you (see the hig-updater skill): it must preview and report before
syncing, and confirm before step 3 unless told to apply directly.

1. Fetch the latest upstream:

   git clone --depth 1 https://github.com/raintree-technology/hig-doctor /tmp/hig-doctor 2>/dev/null \
     || git -C /tmp/hig-doctor pull --ff-only

   If the pull fails, `rm -rf /tmp/hig-doctor` and clone again. If the URL 404s, the
   project has moved; check https://apple.raintree.technology for the current home.

2. Preview what would change. Empty output means nothing changed upstream; stop here.

   for s in /tmp/hig-doctor/skills/hig-*; do
     echo "== $(basename "$s")"
     diff -rq "$s" ~/.config/opencode/skills/"$(basename "$s")" || true
   done

3. Sync. The --delete is per skill directory on purpose: it drops reference files removed
   upstream so nothing stale lingers. Never run rsync --delete against the skills root;
   that would delete your other skills.

   for s in /tmp/hig-doctor/skills/hig-*; do
     rsync -a --delete "$s/" ~/.config/opencode/skills/"$(basename "$s")/"
   done

4. Verify and stamp the log:

   ls ~/.config/opencode/skills/hig-*/SKILL.md
   grep -m1 snapshot ~/.config/opencode/skills/hig-platforms/references/designing-for-macos.md
   git -C /tmp/hig-doctor rev-parse --short HEAD

   Add one line to the Update log below: date, upstream commit, snapshot date. Optionally
   read /tmp/hig-doctor/CHANGELOG.md to learn what changed in content, not just files.

5. Clean up:

   rm -rf /tmp/hig-doctor

## Update log

- 2026-11-25 · initial install, all 14 skills · upstream commit a0f1e4e · snapshot 2025-02-02
