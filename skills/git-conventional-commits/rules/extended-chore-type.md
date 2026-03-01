# Use chore type for maintenance tasks

Use `chore:` type for commits that don't fit in other types.
This type covers miscellaneous maintenance tasks and updates.

## Incorrect

```git
misc: update copyright year in all files
```

Using `misc:` is not part of the conventional commits specification.

```git
update: add gitignore entry for .DS_Store
```

Using `update:` is too generic and not a recognized type.

```git
chore: fix authentication bug
```

If it fixes a bug, use `fix:` not `chore:`.

## Correct

```git
chore: update copyright year in all files
```

Maintenance task with proper `chore:` prefix.

```git
chore: add .DS_Store to .gitignore
```

Git configuration update with proper prefix.

```git
chore: update README with new contributors
```

Documentation update that's not technical docs.

```git
chore: rename project from myapp to newname
```

Project rename with proper prefix.

```git
chore: remove obsolete configuration files
```

Cleanup task with proper prefix.

## Why It Matters

- Provides a catch-all type for miscellaneous changes
- Helps maintain clean commit history
- Allows automated tools to categorize miscellaneous changes
- Keeps other types focused and meaningful

## Additional Context

The `chore:` type should be used when:
- Updating package.json metadata (author, license, etc.)
- Changing project configuration that doesn't fit `build:` or `ci:`
- Updating non-code files (.gitignore, .editorconfig, etc.)
- Renaming or moving files without behavior change
- Updating scripts or tooling configuration
- General maintenance tasks
- Removing obsolete code or files

The `chore:` type has no SemVer effect unless it includes a BREAKING CHANGE,
which is rare for miscellaneous maintenance tasks.

**Important:** Use `chore:` as a last resort. If a commit fits another type,
use that instead:
- Code changes → `fix:`, `feat:`, `refactor:`, `perf:`, `style:`
- Documentation → `docs:`
- Tests → `test:`
- Build/dependencies → `build:`
- CI/CD → `ci:`

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
