# Use fix type for bug fixes

Use `fix:` type when a commit represents a bug fix for your application.
This type indicates a PATCH version bump in semantic versioning.

## Incorrect

```git
bugfix: resolve null pointer exception
```

Using `bugfix:` is not part of the conventional commits specification.

```git
patch: fixed memory leak
```

Using `patch:` is not a recognized type.

```git
fix null pointer exception
```

Missing the required colon and space after the type.

## Correct

```git
fix: resolve null pointer exception in user service
```

Clear bug fix with proper `fix:` prefix.

```git
fix(api): handle malformed JSON in request body
```

Fix with scope specifying the affected component.

```git
fix(auth)!: remove deprecated token validation

BREAKING CHANGE: tokens issued before 2024-01-01 will no longer be accepted
```

Fix with breaking change indicator (rare but possible).

## Why It Matters

- `fix:` commits map to PATCH version releases in SemVer
- Automated tools can distinguish bug fixes from features
- Changelog generators can highlight what's been fixed
- Clearer communication of bug remediation to users

## Additional Context

The `fix` type is one of two types that have semantic versioning implications:
- `feat:` → MINOR version bump
- `fix:` → PATCH version bump

A bug fix is a change that addresses incorrect behavior, crashes, or unexpected outputs. It does not include:
- New features (use `feat:`)
- Performance improvements (use `perf:`)
- Code refactoring without behavior change (use `refactor:`)

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Semantic Versioning](https://semver.org/)
