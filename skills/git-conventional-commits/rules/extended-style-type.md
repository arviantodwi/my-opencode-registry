# Use style type for code style changes

Use `style:` type for commits that only affect code style/formatting.
This type does not change code behavior or functionality.

## Incorrect

```git
format: fix indentation in user service
```

Using `format:` is not part of the conventional commits specification.

```git
linting: remove trailing whitespace
```

Using `linting:` is not a recognized type.

```git
prettier: apply formatting to all files
```

Tool names should not be used as commit types.

## Correct

```git
style: fix indentation in user service
```

Style change with proper `style:` prefix.

```git
style: remove trailing whitespace from all files
```

Whitespace cleanup with proper prefix.

```git
style: convert single quotes to double quotes
```

Quote style change with proper prefix.

```git
style: add missing semicolons in auth module
```

Formatting change with scope.

## Why It Matters

- Separates style-only changes from functional changes
- Allows automated tools to filter or ignore style commits
- Helps reviewers understand that no behavior changes occurred
- Makes git blame and history more useful by isolating formatting

## Additional Context

The `style:` type should be used when:
- Fixing indentation or formatting
- Applying code style rules (Prettier, ESLint auto-fix, etc.)
- Changing whitespace, line endings, or line length
- Converting between single and double quotes
- Adding or removing braces without logic changes

The `style:` type has no SemVer effect unless it includes a BREAKING CHANGE,
which is extremely rare for style-only commits.

**Important:** If a commit changes both style AND behavior, split it into two
separate commits or use the appropriate functional type (fix, feat, refactor).

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
