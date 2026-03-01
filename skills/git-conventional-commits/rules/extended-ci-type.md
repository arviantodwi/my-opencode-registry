# Use ci type for CI/CD configuration changes

Use `ci:` type for commits that affect CI/CD configuration files and scripts.
This type does not change source code behavior directly.

## Incorrect

```git
github: add workflow for automated testing
```

Using `github:` is not part of the conventional commits specification.

```git
workflow: configure deployment pipeline
```

Using `workflow:` is not a recognized type.

```git
ci: fix authentication bug
```

If it changes source code behavior, use `fix:` not `ci:`.

## Correct

```git
ci: add workflow for automated testing on PRs
```

CI configuration addition with proper `ci:` prefix.

```git
ci: configure deployment pipeline for production
```

Pipeline configuration with proper prefix.

```git
ci(github): add code coverage reporting
```

CI change with scope specifying the platform.

```git
ci: update Node.js version in CI environment
```

Environment update with proper prefix.

## Why It Matters

- Separates CI/CD changes from application code
- Helps reviewers focus on CI/CD configuration
- Allows automated tools to track infrastructure changes
- Makes git history more useful for debugging build failures

## Additional Context

The `ci:` type should be used when:
- Adding or modifying GitHub Actions workflows
- Changing GitLab CI/CD pipelines
- Modifying Jenkins files
- Updating Travis CI configuration
- Changing CircleCI configuration
- Modifying CI scripts or helper tools
- Updating CI environment variables
- Adding or changing continuous deployment configuration
- Changes to Docker Compose for CI

The `ci:` type has no SemVer effect unless it includes a BREAKING CHANGE,
which is rare for CI-only commits.

**Important:** If a CI change introduces a breaking change for contributors
(e.g., requiring specific environment setup), include a BREAKING CHANGE footer
or communicate it clearly in the commit message.

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
