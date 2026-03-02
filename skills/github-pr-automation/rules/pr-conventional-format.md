# Use Conventional Commit Format in PR Titles

Follow conventional commit format when writing pull request titles to provide clear, machine-readable information about the changes.

## When to Use

Use this format for:
- All pull request titles
- Describing the nature of changes
- Conveying breaking changes
- Providing context for automated tools

## Format Structure

```
<type>[optional scope]: <description>
```

## Type Categories

### Core Types (HIGH)

- `feat:` - New feature (MINOR version bump)
- `fix:` - Bug fix (PATCH version bump)

### Extended Types (MEDIUM)

- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, missing semi-colons, etc.)
- `refactor:` - Code refactoring without feature changes
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `build:` - Build system or dependency changes
- `ci:` - CI configuration changes
- `chore:` - Maintenance tasks

## Examples

**Good Examples:**
```
feat: add OAuth2 authentication support
fix: resolve login timeout in production
docs: update API endpoint documentation
refactor: simplify error handling middleware
perf: optimize database queries
test: add unit tests for user service
```

**Bad Examples:**
```
Update code (missing type)
Fix the bug (not specific)
Documentation (not in proper format)
Changes (no context)
WIP (work in progress, should be finalized)
```

## Scope Usage

Include scope in parentheses for additional context:

```
feat(auth): add OAuth2 authentication
fix(api): resolve timeout issue
refactor(user-service): simplify logic
perf(database): optimize queries
```

## Breaking Changes

Indicate breaking changes with `!` or BREAKING CHANGE footer:

```
feat!: remove deprecated API endpoint
feat(api)!: remove authentication
fix!: change data format (BREAKING CHANGE: requires migration)
```

## Why This Matters

- **Automated changelogs**: Tools can generate changelogs from PR titles
- **Semantic versioning**: Automatically determine version bumps
- **Clear communication**: Convey change nature to team
- **CI/CD integration**: Trigger builds/publishes based on commit types

## Integration with Commands

The `/gh-pr-create` command automatically generates PR titles from branch names:

Branch: `feature/user-authentication` → PR Title: `feat: add user authentication`

## Anti-Patterns

- ❌ Don't use uppercase types → use lowercase (`feat:`, not `Feat:`)
- ❌ Don't add period at end → keep it clean
- ❌ Don't make descriptions too long → keep under 72 characters
- ❌ Don't be vague → use specific, descriptive language

## Best Practices

1. **Use lowercase**: All letters should be lowercase
2. **Imperative mood**: Use present tense ("add", not "added" or "adds")
3. **No period**: Don't end description with period
4. **Be specific**: Clearly describe what was done
5. **Keep it short**: Aim for 50-72 characters total

## Template for PR Description

```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
How changes were tested

## Checklist
- [ ] Code follows project style guidelines
- [ ] Changes have been tested
- [ ] Documentation has been updated
- [ ] No new warnings generated
```

## Integration with SemVer

| Commit Type                     | Version Bump |
| ------------------------------- | ------------ |
| `feat:`                         | MINOR        |
| `fix:`                          | PATCH        |
| Any type with `!` or BREAKING CHANGE | MAJOR        |

## Example Workflow

```bash
# 1. Create feature branch
git checkout -b feature/user-authentication

# 2. Make changes and commit
git add .
git commit -m "feat: add OAuth2 authentication support"

# 3. Push and create PR
git push -u origin feature/user-authentication
/gh-pr-create to main

# 4. Review PR title
# Automatically generated: "feat: add user authentication"
```

## Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Conventional Commits for npm](https://docs.npmjs.com/cli/v6/using-npm/semver#new-features-backward-compatibility-semantic-versioning)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
