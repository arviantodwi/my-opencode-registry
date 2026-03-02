# Conventional Commits for Automated PR Generation

Use conventional commit format when writing commit messages. The `/gh/pr-create` command uses these commit messages to automatically generate both PR titles and PR bodies.

## When to Use

Use this format for:
- All commit messages
- Better automated PR title generation
- Better automated PR body generation
- Clear communication of change types

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

**Good Commit Messages (lead to better PR generation):**
```
feat: add OAuth2 authentication support
fix: resolve login timeout in production
docs: update API endpoint documentation
refactor: simplify error handling middleware
perf: optimize database queries
test: add unit tests for user service
```

**Bad Commit Messages (lead to poor PR generation):**
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

- **Better PR titles**: Conventional commits generate more accurate, descriptive PR titles
- **Better PR bodies**: Commit types are used to group and structure PR content
- **Automated changelogs**: Tools can generate changelogs from commit messages
- **Semantic versioning**: Automatically determine version bumps
- **Clear communication**: Convey change nature to team
- **CI/CD integration**: Trigger builds/publishes based on commit types

## Integration with Commands

The `/gh/pr-create` command automatically generates PR titles and bodies from commit messages:

**Input:**
- Branch: `feature/overview`
- Commits:
  - "feat: add CORS support"
  - "feat: implement API key authentication"
  - "fix: resolve session timeout"

**Output:**
- PR Title: "Add CORS Support, API Key Authentication, Fix Session Timeout"
- PR Body: Auto-generated with Summary, Context, Changes, Testing, Risk/Impact, Visuals sections

## Anti-Patterns

- ❌ Don't use uppercase types → use lowercase (`feat:`, not `Feat:`)
- ❌ Don't add period at end → keep it clean
- ❌ Don't make descriptions too long → keep under 72 characters
- ❌ Don't be vague → use specific, descriptive language
- ❌ Don't commit without conventional format → poor PR generation

## Best Practices

1. **Use lowercase**: All letters should be lowercase
2. **Imperative mood**: Use present tense ("add", not "added" or "adds")
3. **No period**: Don't end description with period
4. **Be specific**: Clearly describe what was done
5. **Keep it short**: Aim for 50-72 characters total
6. **Be consistent**: Use the same format for all commits in a PR

## Automated PR Generation

### How Commit Messages Affect PR Title

**Good commits → Good PR title:**
```
feat: add OAuth2 authentication
fix: resolve session timeout
test: add integration tests
```
→ PR Title: "Add OAuth2 Authentication, Fix Session Timeout"

**Poor commits → Poor PR title:**
```
update
fix bug
test
```
→ PR Title: "Update Code" (too vague)

### How Commit Messages Affect PR Body

Commit types are used to group changes in the PR body:

- **Features**: All `feat:` commits grouped together
- **Bug Fixes**: All `fix:` commits grouped together
- **Documentation**: All `docs:` commits grouped together
- **Refactoring**: All `refactor:` commits grouped together

## Example Workflow

```bash
# 1. Create feature branch
git checkout -b feature/security-enhancements

# 2. Make changes and commit with conventional format
git add .
git commit -m "feat: add CORS support for cross-origin requests"
git add .
git commit -m "feat: implement API key authentication middleware"
git add .
git commit -m "fix: resolve session timeout in auth flow"
git add .
git commit -m "test: add integration tests for authentication"

# 3. Push and create PR
git push -u origin feature/security-enhancements
/gh/pr-create base:main

# 4. Review auto-generated PR
# Title: "Add CORS Support, API Key Authentication, Fix Session Timeout"
# Body: Auto-generated with all sections populated from commit messages
```

## Integration with SemVer

| Commit Type                     | Version Bump |
| ------------------------------- | ------------ |
| `feat:`                         | MINOR        |
| `fix:`                          | PATCH        |
| Any type with `!` or BREAKING CHANGE | MAJOR        |

## Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Conventional Commits for npm](https://docs.npmjs.com/cli/v6/using-npm/semver#new-features-backward-compatibility-semantic-versioning)
- [Angular Commit Convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
- See also: [Automated PR Body Generation](./pr-body-automated-generation.md)
