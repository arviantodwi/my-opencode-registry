"""Exercise the CLI with isolated homes and fixture vaults, never real notes."""

import json
import os
from pathlib import Path
import stat
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "resolve_vault.py"


class ResolverTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.home = Path(self.temporary.name).resolve()
        self.vault = self.home / "Vault With Spaces"
        self.vault.mkdir()
        self.config = self.home / ".config" / "obsidian-vault" / "config.json"
        self.env = dict(os.environ, HOME=str(self.home))

    def run_cli(self, *arguments, status="ready"):
        process = subprocess.run(
            [sys.executable, "-B", str(SCRIPT), *arguments],
            env=self.env,
            cwd=str(self.home),
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(process.stderr, "", process.stderr)
        result = json.loads(process.stdout)
        self.assertEqual(result["status"], status, result)
        self.assertEqual(process.returncode, 0 if status == "ready" else 1)
        self.assertEqual(result["config_path"], str(self.config))
        return result

    def test_missing_config_is_read_only(self):
        self.run_cli(status="config_missing")
        self.assertFalse(self.config.parent.exists())

    def test_check_expands_home_and_does_not_create_folders(self):
        result = self.run_cli("check", "~/Vault With Spaces")
        self.assertEqual(result["vault_root"], str(self.vault))
        self.assertEqual(result["folders"]["wiki"], str(self.vault / "wiki"))
        self.assertEqual(result["missing_folders"], ["wiki", "ideas"])
        self.assertFalse(self.config.parent.exists())
        self.assertEqual(list(self.vault.iterdir()), [])

    def test_configure_then_resolve_from_an_unrelated_working_directory(self):
        (self.vault / "wiki").mkdir()
        result = self.run_cli("configure", str(self.vault))
        self.assertTrue(result["saved"])
        self.assertEqual(json.loads(self.config.read_text()), {"vault_root": str(self.vault)})
        self.assertEqual(stat.S_IMODE(self.config.stat().st_mode), 0o600)
        result = self.run_cli("resolve")
        self.assertEqual(result["missing_folders"], ["ideas"])
        self.assertFalse((self.vault / "ideas").exists())

    def test_relative_and_empty_paths_are_rejected_without_writes(self):
        for value in ("Vault With Spaces", "", "   "):
            with self.subTest(value=value):
                self.run_cli("configure", value, status="invalid_vault_path")
                self.assertFalse(self.config.parent.exists())

    def test_invalid_config_is_reported_without_repairing_it(self):
        self.config.parent.mkdir(parents=True)
        for content in ("{", "[]", "{}", '{"vault_root": 12}', '{"vault_root": "relative"}'):
            with self.subTest(content=content):
                self.config.write_text(content)
                self.run_cli(status="config_invalid")
                self.assertEqual(self.config.read_text(), content)

    def test_missing_vault_is_not_recreated(self):
        self.run_cli("configure", str(self.vault))
        self.vault.rmdir()
        self.run_cli(status="vault_unavailable")
        self.assertFalse(self.vault.exists())

    def test_existing_config_requires_explicit_replacement(self):
        self.run_cli("configure", str(self.vault))
        second = self.home / "Other Vault"
        second.mkdir()
        self.config.write_text(json.dumps({"vault_root": str(self.vault), "extra": "preserve"}))
        original = self.config.read_bytes()
        self.run_cli("configure", str(second), status="config_exists")
        self.assertEqual(self.config.read_bytes(), original)
        self.run_cli("configure", str(second), "--replace")
        self.assertEqual(json.loads(self.config.read_text()), {"vault_root": str(second), "extra": "preserve"})
        self.assertEqual(sorted(p.name for p in self.config.parent.iterdir()), ["config.json"])

    def test_explicit_replacement_can_repair_invalid_json(self):
        self.config.parent.mkdir(parents=True)
        self.config.write_text("not json")
        self.run_cli("configure", str(self.vault), "--replace")
        self.run_cli()

    def test_missing_path_does_not_replace_a_valid_setting(self):
        self.run_cli("configure", str(self.vault))
        original = self.config.read_bytes()
        missing = self.home / "Unavailable Mount"
        self.run_cli("configure", str(missing), "--replace", status="vault_unavailable")
        self.assertEqual(self.config.read_bytes(), original)
        self.assertFalse(missing.exists())

    def test_vault_root_symlink_is_resolved(self):
        alias = self.home / "Vault Alias"
        alias.symlink_to(self.vault, target_is_directory=True)
        result = self.run_cli("check", str(alias))
        self.assertEqual(result["vault_root"], str(self.vault))

    def test_knowledge_folder_symlink_cannot_redirect_access(self):
        elsewhere = self.home / "Outside Vault"
        elsewhere.mkdir()
        (self.vault / "wiki").symlink_to(elsewhere, target_is_directory=True)
        self.run_cli("check", str(self.vault), status="vault_unavailable")
        self.assertFalse(self.config.parent.exists())

    def test_knowledge_folder_must_be_a_directory(self):
        (self.vault / "ideas").write_text("keep this file")
        self.run_cli("check", str(self.vault), status="vault_unavailable")
        self.assertEqual((self.vault / "ideas").read_text(), "keep this file")


if __name__ == "__main__":
    unittest.main()
