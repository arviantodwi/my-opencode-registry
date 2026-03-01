# Use build type for build system changes

Use `build:` type for commits that affect build systems or external dependencies.
This type does not change source code behavior directly.

## Incorrect

```git
npm: update dependencies to latest versions
```

Using `npm:` is not part of the conventional commits specification.

```git
webpack: add production build optimization
```

Tool names should not be used as commit types.

```git
build: add new API endpoint
```

If it changes source code behavior, use `feat:` not `build:`.

## Correct

```git
build: update dependencies to latest versions
```

Dependency update with proper `build:` prefix.

```git
build: add production build optimization for webpack
```

Build configuration change with proper prefix.

```git
build(webpack): configure code splitting for production
```

Build change with scope specifying the tool.

```git
build: upgrade TypeScript to version 5.0
```

Tool upgrade with proper prefix.

## Why It Matters

- Separates build configuration from application code
- Helps reviewers understand that production code behavior is unchanged
- Allows automated tools to track build system changes
- Makes it easier to revert build changes if needed

## Additional Context

The `build:` type should be used when:
- Updating dependencies (npm, yarn, cargo, pip, etc.)
- Changing build configuration (webpack, rollup, parcel, etc.)
- Modifying build scripts or npm scripts
- Changing deployment configuration
- Upgrading build tools or tooling
- Adding or removing build steps
- Changes to Dockerfiles, Docker Compose, or similar

The `build:` type has no SemVer effect unless it includes a BREAKING CHANGE,
which may occur if build requirements change significantly (e.g., Node version bump).

**Important:** If a build change introduces a breaking change for users
(e.g., requiring a newer Node.js version), include a BREAKING CHANGE footer.

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
