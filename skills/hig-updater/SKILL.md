---
name: hig-updater
description: >-
  Update the local Apple HIG agent skills in ~/.config/opencode/skills to the latest
  upstream snapshot from raintree-technology/hig-doctor. Use this skill when the user
  asks to "update the HIG skills", "refresh the Apple HIG skills", "sync the hig-*
  skills", or asks whether the local HIG copy is stale or which snapshot it carries.
---

# HIG skills updater

The full procedure lives in ~/.config/opencode/skills/hig-README.md. Read it first, then:

1. Run its step 1 (fetch upstream) and step 2 (preview diff). Never skip the preview.
2. Report to the user: which skill directories differ, the upstream commit, and the
   snapshot date found in the references. An empty diff means already current; stop there.
3. Wait for confirmation before step 3 (sync), unless the user already said to apply
   without asking.
4. After syncing, run step 4 (verify and stamp the Update log) and step 5 (clean up).
5. If skill text conflicts with Apple's live HIG, the live HIG wins; record the conflict
   in the Update log per the README's policy.

Note: the update loop iterates over upstream's skills/hig-* list, so local-only hig-*
directories (this skill included) are never diffed, synced, or deleted.
