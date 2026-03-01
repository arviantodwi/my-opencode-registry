# Understand type to semantic version mapping

Different commit types map to different semantic version bumps.
Understanding this helps you anticipate version changes.

## Incorrect

```git
feat: add user authentication

This should be a MAJOR version bump.
```

Incorrect - `feat:` maps to MINOR, not MAJOR.

```git
fix: resolve null pointer exception

This requires a MAJOR version bump.
```

Incorrect - `fix:` maps to PATCH, not MAJOR.

```git
docs: update README

This requires a version bump.
```

Incorrect - `docs:` has no automatic SemVer effect.

## Correct

```git
feat: add user authentication

This is a MINOR version bump.
```

Correct - `feat:` maps to MINOR.

```git
fix: resolve null pointer exception

This is a PATCH version bump.
```

Correct - `fix:` maps to PATCH.

```git
feat(api)!: remove deprecated authentication

BREAKING CHANGE: removes legacy token-based authentication

This is a MAJOR version bump.
```

Correct - breaking changes trigger MAJOR.

## Version Mapping Table

| Commit Type                     | Version Bump | Example         |
| -------------------------------- | ------------ | --------------- |
| `feat:`                          | MINOR        | v1.0.0 → v1.1.0 |
| `fix:`                           | PATCH        | v1.0.0 → v1.0.1 |
| Any type with `!`                | MAJOR        | v1.0.0 → v2.0.0 |
| Any type with BREAKING CHANGE    | MAJOR        | v1.0.0 → v2.0.0 |
| `docs:`, `style:`, `refactor:`  | None         | v1.0.0 → v1.0.0 |
| `perf:`, `test:`, `build:`       | None         | v1.0.0 → v1.0.0 |
| `ci:`, `chore:`, `revert:`       | None         | v1.0.0 → v1.0.0 |

## Examples

### MAJOR Version Bump

```git
feat(api)!: remove deprecated authentication endpoint

BREAKING CHANGE: the /api/v1/auth endpoint has been removed. Use /api/v2/auth instead.

Result: v1.2.3 → v2.0.0
```

```git
fix(auth)!: change token format

BREAKING CHANGE: tokens must now be in JWT format. Old tokens will no longer work.

Result: v1.2.3 → v2.0.0
```

### MINOR Version Bump

```git
feat: add user profile editing

Result: v1.2.3 → v1.3.0
```

```git
feat(api): add pagination to user list endpoint

Result: v1.2.3 → v1.3.0
```

### PATCH Version Bump

```git
fix: resolve null pointer exception in user service

Result: v1.2.3 → v1.2.4
```

```git
fix(api): handle malformed JSON in request body

Result: v1.2.3 → v1.2.4
```

### No Version Bump

```git
docs: update installation guide

Result: v1.2.3 → v1.2.3
```

```git
style: fix indentation in user service

Result: v1.2.3 → v1.2.3
```

## How Automated Tools Determine Versions

Tools like `semantic-release` analyze the commit history since the last release:

1. **Scan all new commits**
2. **Check for BREAKING CHANGE or `!`**
   - If found → MAJOR bump
3. **If no breaking changes, check for `feat:`**
   - If found → MINOR bump
4. **If no features, check for `fix:`**
   - If found → PATCH bump
5. **If none of the above**
   - No version bump (or PATCH if forced)

## Multiple Commits Between Releases

```bash
# Commit history since last release
feat: add user authentication
fix: resolve login bug
docs: update README
feat: add password reset
fix: handle edge case in password reset
style: format code

# Version decision: MINOR bump (because of feat commits)
# Result: v1.0.0 → v1.1.0
```

```bash
# Commit history since last release
feat: add user authentication
fix: resolve login bug
docs: update README
feat(api)!: remove deprecated endpoint

# Version decision: MAJOR bump (because of breaking change)
# Result: v1.0.0 → v2.0.0
```

## Best Practices

1. **Mark breaking changes clearly**
   - Use `!` in the type/scope prefix
   - Include BREAKING CHANGE footer with details
   - Explain migration steps in the body

2. **Separate concerns into multiple commits**
   - Don't mix `feat:` and `fix:` in one commit
   - Split breaking changes into their own commits
   - Make commits atomic and focused

3. **Review commit messages before release**
   - Ensure all types are correct
   - Verify breaking changes are properly marked
   - Check that version bumps will be accurate

## Tools That Use This Mapping

- `semantic-release` - Automated version publishing
- `standard-version` - Changelog generation and version bumping
- `lerna` - Monorepo version management
- `release-it` - Release automation tool
- Custom CI/CD scripts

## References

- [Conventional Commits FAQ](https://www.conventionalcommits.org/en/v1.0.0/#faqs)
- [Semantic Versioning](https://semver.org/)
- [semantic-release Documentation](https://github.com/semantic-release/semantic-release)
