# Define custom types for your project

You may define custom commit types beyond the standard ones.
Custom types should be documented and consistent across your project.

## Incorrect

```git
hotfix: urgent patch for production bug
```

Using `hotfix:` - should use standard `fix:` type instead.

```git
wip: work in progress on authentication
```

Using `wip:` for incomplete work - commit should be complete.

```git
custom-type: some change
```

Custom type without documentation or team agreement.

```git
update: update dependencies
```

Using generic `update:` - should use standard `build:` instead.

## Correct

```git
fix: urgent patch for production bug
```

Use standard `fix:` type even for urgent patches.

```git
feat: add authentication
```

Commit should be complete when committed, not WIP.

```git
release: prepare v2.0.0 release
```

Custom `release:` type documented in project guidelines.

```git
build: update dependencies
```

Use standard `build:` type for dependency updates.

## Custom Type Examples

If your project needs custom types, document them clearly:

```git
release: prepare v2.0.0 release

This commit updates version numbers, changelog, and tags for the v2.0.0 release.

Refs: #456
```

```git
bump: increment version to 2.1.0

Automated version bump by CI process.
```

```git
i18n: add Spanish language support

Add translations and locale files for Spanish language support.
```

## When to Define Custom Types

Consider custom types when:
- A change doesn't fit into any existing type
- The type is needed frequently enough to be useful
- The team agrees on the type and its usage
- The type is clearly documented

**Common custom types:**
- `release:` - Release preparation and version bumps
- `bump:` - Version number increments
- `i18n:` - Internationalization changes
- `security:` - Security fixes (some use instead of `fix:`)
- `dependencies:` - Dependency updates (alternative to `build:`)

## Best Practices

1. **Document your custom types**
   - Add them to your project's CONTRIBUTING.md
   - Create commitlint configuration if using automated tools
   - Train your team on when to use each type

2. **Use standard types first**
   - `feat:` for features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for restructuring
   - `perf:` for performance
   - `test:` for tests
   - `build:` for build/dependencies
   - `ci:` for CI/CD
   - `chore:` for miscellaneous

3. **Be consistent**
   - Once defined, use the type consistently
   - Don't create too many custom types
   - Review custom types periodically

## Example Configuration

**commitlint.config.js:**
```javascript
module.exports = {
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test',
      'build', 'ci', 'chore', 'revert', 'release', 'bump'
    ]]
  }
}
```

## Why Custom Types Matter

- Tailors the specification to your project's needs
- Provides clarity for project-specific workflows
- Maintains consistency while allowing flexibility
- Supports automated tooling with custom configurations

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
- [Commitlint Configuration](https://commitlint.js.org/)
