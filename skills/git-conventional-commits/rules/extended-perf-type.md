# Use perf type for performance improvements

Use `perf:` type for commits that improve code performance.
This type does not change behavior, only makes code faster or more efficient.

## Incorrect

```git
performance: optimize database queries
```

Using `performance:` is not part of the conventional commits specification.

```git
optimize: reduce memory usage
```

Using `optimize:` is not a recognized type.

```git
perf: fix race condition in cache
```

If it fixes a bug, use `fix:` not `perf:`.

## Correct

```git
perf: optimize database queries by adding index
```

Performance improvement with proper `perf:` prefix.

```git
perf(api): reduce API response time by caching
```

Performance improvement with scope and context.

```git
perf: decrease memory usage in image processing
```

Memory optimization with proper prefix.

```git
perf: implement lazy loading for routes
```

Performance improvement strategy with proper prefix.

## Why It Matters

- Distinguishes performance work from other changes
- Helps reviewers focus on performance implications
- Allows automated tools to track performance improvements
- Makes git history more useful for performance analysis

## Additional Context

The `perf:` type should be used when:
- Improving execution speed
- Reducing memory usage
- Optimizing database queries
- Implementing caching
- Reducing network requests
- Improving algorithm efficiency
- Optimizing build times

The `perf:` type has no SemVer effect unless it includes a BREAKING CHANGE,
which is rare for performance improvements.

**Important:** Do not use `perf:` for:
- Bug fixes (use `fix:`)
- New features (use `feat:`)
- Code restructuring without performance benefit (use `refactor:`)
- Style/formatting (use `style:`)

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
