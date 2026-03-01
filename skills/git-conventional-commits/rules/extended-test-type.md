# Use test type for test changes

Use `test:` type for commits that add, update, or remove tests.
This type does not change production code behavior.

## Incorrect

```git
testing: add unit tests for user service
```

Using `testing:` is not part of the conventional commits specification.

```git
spec: fix broken integration test
```

Using `spec:` is not a recognized type.

```git
test: fix authentication bug
```

If it fixes production code, use `fix:` not `test:`.

## Correct

```git
test: add unit tests for user service
```

Test addition with proper `test:` prefix.

```git
test(api): fix broken integration test for authentication
```

Test fix with scope specifying what's tested.

```git
test: increase coverage for auth module to 80%
```

Test coverage improvement with proper prefix.

```git
test: remove deprecated test helper functions
```

Test cleanup with proper prefix.

## Why It Matters

- Separates test changes from production code changes
- Helps reviewers focus on test quality without checking production code
- Allows automated tools to track test coverage improvements
- Makes git bisect easier when searching for test failures

## Additional Context

The `test:` type should be used when:
- Adding new unit, integration, or end-to-end tests
- Fixing broken tests
- Updating tests for new functionality
- Removing obsolete tests
- Improving test coverage
- Changing test fixtures or mocks

The `test:` type has no SemVer effect unless it includes a BREAKING CHANGE,
which is extremely rare for test-only commits.

**Important:**
- If a commit changes both tests AND production code, use the production code type
- If fixing a broken test that was revealed by a production bug, use `fix:` and include both fixes
- Consider pairing `test:` commits with corresponding `feat:` or `fix:` commits

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
