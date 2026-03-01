# Follow case sensitivity rules for commit types

Most commit types and footers are case-insensitive, but BREAKING CHANGE must be uppercase. Follow the specification's case sensitivity requirements.

## Incorrect

```git
FEAT: add user authentication
```

All caps is acceptable for the type, but lowercase is conventional.

```git
Fix: resolve null pointer exception
```

Capitalized type is acceptable but lowercase is conventional.

```git
feat: add user authentication

breaking change: removes legacy authentication
```

`breaking change:` must be uppercase: `BREAKING CHANGE:`

```git
feat(api)!: add user authentication

BREAKING-CHANGE: removes legacy authentication
```

`BREAKING-CHANGE:` with hyphen is acceptable in footers but `BREAKING CHANGE:` with space is preferred.

## Correct

```git
feat: add user authentication
```

Lowercase type is the conventional format.

```git
fix: resolve null pointer exception
```

Lowercase type is the conventional format.

```git
feat(api)!: add user authentication

BREAKING CHANGE: removes legacy authentication
```

`BREAKING CHANGE:` must be uppercase with a space.

```git
FIX: resolve null pointer exception
```

Uppercase type is acceptable (not conventional, but valid).

## Case Sensitivity Rules

### Types (Case-Insensitive)

All commit types are case-insensitive. All of these are valid:
- `feat:` or `FEAT:` or `Feat:` or `fEaT:`
- `fix:` or `FIX:` or `Fix:`
- `docs:` or `DOCS:` or `Docs:`

**Convention:** Use lowercase for consistency:
- `feat:` (recommended)
- `fix:` (recommended)
- `docs:` (recommended)

### BREAKING CHANGE (Case-Sensitive)

`BREAKING CHANGE` as a footer token MUST be uppercase.

**Invalid:**
- `breaking change:`
- `Breaking Change:`
- `BREAKING-CHANGE:` (hyphenated)

**Valid:**
- `BREAKING CHANGE:` (preferred)
- `BREAKING-CHANGE:` (synonym, acceptable but not preferred)

### Footer Tokens (Case-Sensitive)

Most footer tokens follow git trailer conventions and are case-sensitive:

**Standard tokens:**
- `Refs:`
- `Closes:`
- `Fixes:`
- `Resolves:`
- `Co-authored-by:`
- `Reviewed-by:`
- `Acked-by:`
- `Tested-by:`

**Note:** These should use the exact case shown above, as git trailers are case-sensitive.

## Examples

### Proper Case Usage

```git
feat: add user authentication

BREAKING CHANGE: removes legacy token-based authentication
Refs: #123
```

Lowercase type, uppercase BREAKING CHANGE, proper case for footers.

```git
FIX(api)!: resolve authentication issue

BREAKING-CHANGE: the /api/auth endpoint now requires authentication
Reviewed-by: John Doe <john@example.com>
```

Uppercase type (valid but unconventional), `BREAKING-CHANGE:` synonym, proper footer case.

```git
refactor: extract validation logic

This commit extracts user validation into a separate service.

Refs: #456, #789
```

Lowercase type, proper footer formatting.

### Incorrect Case Usage

```git
feat: add user authentication

breaking change: removes legacy authentication
```

Invalid - `breaking change:` must be uppercase.

```git
feat: add user authentication

BREAKING CHANGE: removes legacy authentication
refs: #123
```

Invalid - `refs:` should be capitalized as `Refs:`

## Best Practices

1. **Use lowercase for commit types**
   - `feat:` not `FEAT:` or `Feat:`
   - Consistency makes commits more readable

2. **Always use uppercase for BREAKING CHANGE**
   - `BREAKING CHANGE:` not `breaking change:`
   - This is required by the specification

3. **Use proper case for footer tokens**
   - `Refs:` not `refs:` or `REFS:`
   - Follow git trailer conventions

4. **Be consistent across your project**
   - Choose a style and stick with it
   - Use commitlint to enforce consistency
   - Document your conventions in CONTRIBUTING.md

## commitlint Configuration

To enforce case sensitivity rules:

```javascript
module.exports = {
  rules: {
    'type-case': [2, 'always', 'lower-case'], // Enforce lowercase types
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']],
    'footer-case': [2, 'always', 'upper-case'], // Enforce uppercase footers
  }
}
```

## Why Case Sensitivity Matters

- Automated tools parse commit messages and expect specific formatting
- BREAKING CHANGE must be uppercase for tools to detect breaking changes
- Consistent casing makes commits easier to read and search
- Following the specification ensures compatibility with all tools

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Git Trailers Documentation](https://git-scm.com/docs/git-interpret-trailers)
- [commitlint Documentation](https://commitlint.js.org/)
