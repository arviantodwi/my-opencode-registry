#!/usr/bin/env python3
"""Resolve a machine-local vault, or validate/configure one on explicit request.

Default resolution and `check` never write. Only `configure` saves a setting.
All normal results are JSON; questions belong to the agent, not stdin.
"""

import argparse
import json
import os
from pathlib import Path
import tempfile


class VaultError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status


def config_location():
    return Path.home() / ".config" / "obsidian-vault" / "config.json"


def read_config(path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise VaultError("config_missing", "No local vault configuration exists yet.")
    except (json.JSONDecodeError, UnicodeError) as exc:
        raise VaultError("config_invalid", "Cannot parse local configuration: {}".format(exc))
    except OSError as exc:
        raise VaultError("config_error", "Cannot read local configuration: {}".format(exc))
    if not isinstance(data, dict):
        raise VaultError("config_invalid", "Configuration must be a JSON object.")
    if not isinstance(data.get("vault_root"), str) or not data["vault_root"].strip():
        raise VaultError("config_invalid", "vault_root must be a nonempty path string.")
    return data


def inspect_vault(value, config):
    try:
        path = Path(value).expanduser()
    except (ValueError, RuntimeError) as exc:
        raise VaultError("invalid_vault_path", "Cannot expand vault path: {}".format(exc))
    if not value.strip() or not path.is_absolute():
        raise VaultError("invalid_vault_path", "Use an absolute path or a path starting with ~/.")
    try:
        root = path.resolve(strict=True)
        if not root.is_dir():
            raise VaultError("vault_unavailable", "Vault path is not a directory: {}".format(root))
        if not os.access(root, os.R_OK | os.X_OK):
            raise VaultError("vault_unavailable", "Vault directory is not readable: {}".format(root))

        folders = {}
        missing = []
        for name in ("wiki", "ideas"):
            folder = root / name
            if folder.resolve(strict=False) != folder:
                raise VaultError(
                    "vault_unavailable",
                    "Knowledge folder redirects through a symlink: {}".format(folder),
                )
            if folder.exists():
                if not folder.is_dir() or not os.access(folder, os.R_OK | os.X_OK):
                    raise VaultError("vault_unavailable", "Knowledge folder is not a readable directory: {}".format(folder))
            else:
                missing.append(name)
            folders[name] = str(folder)
    except (OSError, ValueError, RuntimeError) as exc:
        raise VaultError("vault_unavailable", "Cannot access vault path: {}".format(exc))

    return {
        "status": "ready",
        "config_path": str(config),
        "vault_root": str(root),
        "folders": folders,
        "missing_folders": missing,
    }


def save_config(path, root, replace):
    data = {}
    if path.exists() or path.is_symlink():
        if not replace:
            raise VaultError("config_exists", "Local configuration already exists; use --replace only for an explicitly requested change.")
        try:
            data = read_config(path)
        except VaultError as exc:
            if exc.status not in ("config_missing", "config_invalid"):
                raise
    data["vault_root"] = root

    try:
        path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    except OSError as exc:
        raise VaultError("config_error", "Cannot create configuration directory: {}".format(exc))

    temporary = None
    try:
        fd, temporary = tempfile.mkstemp(prefix=".config-", suffix=".json", dir=str(path.parent))
        with os.fdopen(fd, "w", encoding="utf-8") as stream:
            json.dump(data, stream, indent=2, ensure_ascii=False)
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
        if replace:
            os.replace(temporary, path)
        else:
            # Publish atomically without overwriting a setting created by another session.
            os.link(temporary, path)
    except FileExistsError:
        raise VaultError("config_exists", "Local configuration already exists; resolve it before changing anything.")
    except OSError as exc:
        raise VaultError("config_error", "Cannot save local configuration: {}".format(exc))
    finally:
        if temporary is not None:
            try:
                os.unlink(temporary)
            except FileNotFoundError:
                pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command")
    commands.add_parser("resolve", help="Read the local setting (the default); never writes.")
    check = commands.add_parser("check", help="Validate a proposed vault path without writing anything.")
    check.add_argument("vault_root")
    configure = commands.add_parser("configure", help="Validate a path and save this machine's setting.")
    configure.add_argument("vault_root")
    configure.add_argument("--replace", action="store_true", help="Explicitly replace an existing setting.")
    args = parser.parse_args()
    config = config_location()

    try:
        if args.command in (None, "resolve"):
            data = read_config(config)
            try:
                result = inspect_vault(data["vault_root"], config)
            except VaultError as exc:
                if exc.status == "invalid_vault_path":
                    raise VaultError("config_invalid", str(exc))
                raise
        else:
            result = inspect_vault(args.vault_root, config)
            if args.command == "configure":
                save_config(config, result["vault_root"], args.replace)
                result["saved"] = True
        print(json.dumps(result, ensure_ascii=False))
        return 0
    except VaultError as exc:
        print(json.dumps({"status": exc.status, "config_path": str(config), "message": str(exc)}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
