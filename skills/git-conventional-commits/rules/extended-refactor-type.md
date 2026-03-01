# Use refactor type for code restructuring

Use `refactor:` type for commits that restructure code without changing behavior.
This type neither fixes a bug nor adds a feature.

## Incorrect

```git
restructure: extract user validation logic
```

Using `restructure:` is not part of the conventional commits specification.

```git
cleanup: remove unused imports
```

Using `cleanup:` is not a recognized type.

```git
refactor: fix memory leak
```

If it fixes a bug, use `fix:` not `refactor:`.

## Correct

```git
refactor: extract user validation logic into separate service
```

Code restructuring with proper `refactor:` prefix.

```git
refactor(auth): simplify authentication flow
```

Refactoring with scope specifying the affected component.

```git
refactor: replace async/await with promises in user service
```

Change of async patterns with proper prefix.

```git
refactor(api): consolidate error handling middleware
```

Refactoring with context about affected area.

## Why It Matters

- Distinguishes internal improvements from user-facing changes
- Helps reviewers understand that behavior is unchanged
- Allows automated tools to track code quality improvements
- Makes git history more meaningful by showing intent

## Additional Context

The `refactor:` type should be used when:
- Extracting or consolidating code
- Changing code organization without behavior change
- Renaming variables or functions (without API change)
- Applying design patterns
- Simplifying complex logic
- Changing internal implementation details

The `refactor:` type has no SemVer effect unless it includes a BREAKING CHANGE,
which may occur if public APIs are restructured.

**Important:** Do not use `refactor:` for:
- Bug fixes (use `fix:`)
- New features (use `feat:`)
- Style/formatting only (use `style:`)
- Performance improvements (use `perf:`)
- Adding tests (use `test:`)

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
