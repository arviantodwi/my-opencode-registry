# Use reference footers to link to issues and PRs

Use footers like `Refs:`, `Closes:`, and `Fixes:` to link commits to issues
and pull requests. These follow git trailer format conventions.

## Incorrect

```git
fix: resolve null pointer exception

Closes #123
```

Missing colon and space after the token.

```git
fix: resolve null pointer exception

Fixes- #123
```

Uses hyphen instead of colon, and space before number.

```git
fix: resolve null pointer exception

refs #123, #124
```

Multiple issues should be separated by commas after the colon.

```git
fix: resolve null pointer exception

Resolves: issue #123
```

Don't include "issue" or "PR" text - just use the number.

## Correct

```git
fix: resolve null pointer exception

Closes: #123
```

Proper reference footer with colon and space.

```git
fix: resolve null pointer exception

Refs: #123, #124, #125
```

Multiple references separated by commas.

```git
fix: resolve null pointer exception

Fixes: #123
```

Indicates this commit fixes the issue.

```git
feat: add user authentication

Refs: #123, #124
```

References multiple related issues.

```git
fix: resolve null pointer exception

This fixes the null pointer issue reported by multiple users.

Refs: #123, #124, #125
```

Reference footer separated from body by blank line.

## Why It Matters

- Provides traceability from code to issue tracking
- Helps automated tools link commits to issues
- Makes it easier to understand the context of changes
- Enables better code review and project management

## Additional Context

Reference footer tokens:
- `Refs:` - General reference to related issues
- `Closes:` - Indicates the commit closes the issue(s)
- `Fixes:` - Indicates the commit fixes the issue(s)
- `Resolves:` - Alternative to `Closes:`

Format requirements:
- Token followed by `:` and space: `Refs: #123`
- Multiple references separated by commas: `Refs: #123, #124`
- Footers separated from body and other footers by blank lines
- Just the number, not "issue" or "PR"

**Semantic differences:**
- `Refs:` - Generic reference, issue may still be open
- `Closes:` - Issue will be closed when commit is merged
- `Fixes:` - Same as `Closes:`, just different wording
- `Resolves:` - Same as `Closes:`, just different wording

**Best Practices:**
- Use `Refs:` when commit is related but doesn't fully resolve
- Use `Closes:` when commit fully resolves and the issue should be closed
- Include all relevant issue numbers
- One footer per reference type (don't mix `Refs:` and `Closes:`)

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Git Trailers](https://git-scm.com/docs/git-interpret-trailers)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
