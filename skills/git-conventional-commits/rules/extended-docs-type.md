# Use docs type for documentation changes

Use `docs:` type for commits that only affect documentation.
This type has no implicit semantic versioning effect.

## Incorrect

```git
readme: update installation instructions
```

Using `readme:` is not part of the conventional commits specification.

```git
doc: fix typos in API documentation
```

Must be `docs:` not `doc:`.

```git
documentation: update contributing guidelines
```

Using full word is not the conventional format.

## Correct

```git
docs: correct spelling of CHANGELOG
```

Documentation fix with proper `docs:` prefix.

```git
docs(api): update authentication examples in README
```

Documentation change with scope for clarity.

```git
docs: add migration guide for v2.0
```

New documentation with proper prefix.

```git
docs(changelog): update release notes for v1.5.0
```

Documentation update in specific file.

## Why It Matters

- Separates documentation changes from code changes
- Allows automated tools to filter documentation-only commits
- Helps reviewers focus on the right aspects during code review
- Maintains clear distinction between code and documentation

## Additional Context

The `docs:` type should be used when:
- Editing README, CONTRIBUTING, or other markdown files
- Updating inline code comments (though this is debated)
- Writing or updating API documentation
- Adding or modifying examples
- Changing documentation in docstrings

The `docs:` type has no SemVer effect unless it includes a BREAKING CHANGE,
which is rare for documentation-only commits.

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
