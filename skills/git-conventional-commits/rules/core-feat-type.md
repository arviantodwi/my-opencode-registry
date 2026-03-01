# Use feat type for new features

Use `feat:` type when a commit adds a new feature to your application or library.
This type indicates a MINOR version bump in semantic versioning.

## Incorrect

```git
add: new user authentication system
```

Using `add:` is not part of the conventional commits specification.

```git
new: added login functionality
```

Using `new:` is not a recognized type.

```git
feat login functionality
```

Missing the required colon and space after the type.

## Correct

```git
feat: add user authentication system
```

Clear feature addition with proper `feat:` prefix.

```git
feat(api): add OAuth2 authentication endpoint
```

Feature with scope specifying the affected component.

```git
feat(auth)!: add support for multi-factor authentication

BREAKING CHANGE: removes legacy token-based authentication
```

Feature with breaking change indicator.

## Why It Matters

- `feat:` commits map to MINOR version releases in SemVer
- Automated tools can distinguish features from fixes
- Changelog generators can highlight new features
- Clearer communication of what's new in the codebase

## Additional Context

The `feat` type is one of two types that have semantic versioning implications:
- `feat:` → MINOR version bump
- `fix:` → PATCH version bump

All other types (docs, style, refactor, perf, test, build, ci, chore) have no implicit SemVer effect unless they include a BREAKING CHANGE.

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Semantic Versioning](https://semver.org/)
