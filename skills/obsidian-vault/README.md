# Portable Obsidian Vault Skill

Keep this folder, global `AGENTS.md`, and `commands/vault-capture.md` in the shared OpenCode configuration repository. OpenCode discovers the skill by ID from `~/.config/opencode/skills/obsidian-vault/`; shared instructions need no username or vault path.

## Per-machine setting

Each machine keeps its own `~/.config/obsidian-vault/config.json`, outside the shared repository:

```json
{
  "vault_root": "~/Notes/AI-KB"
}
```

This is an illustrative path. The actual directory must already exist and be accessible to the machine running the agent. For a VM, use its local copy or mount path. Configuring a path does not synchronize the vault's contents.

Vault layout: durable knowledge notes live at the vault root, idea notes live in `ideas/`, and a single `index.md` at the root lists every note by location.

When vault access is first needed, the agent asks for a path if the setting is missing. The helper validates it and, in a write-capable mode, saves the resolved absolute path. In Plan mode, path validation and vault reads are available; saving setup or notes is deferred.

## Helper

Requires Python 3 with the standard library. From this skill's directory:

```text
python3 scripts/resolve_vault.py
python3 scripts/resolve_vault.py check "~/Notes/AI-KB"
python3 scripts/resolve_vault.py configure "~/Notes/AI-KB"
```

Default resolution and `check` are read-only. `configure` creates the local setting; changing an existing setting requires `--replace`. The helper returns JSON and never asks questions on stdin. It reports an absent `ideas/` folder but never creates it. A symlink for the vault root is supported; redirecting `ideas/` through a symlink is rejected so the approved folder boundary remains explicit.

For another agent that discovers `~/.agents/skills`, that installation can link `obsidian-vault` to this directory instead of keeping a second editable copy.

## Verification

```text
python3 -B -m unittest discover -s tests -v
```

Tests use temporary homes and fixture directories. They do not read or change the real vault or machine-local setting.
