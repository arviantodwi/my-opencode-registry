# GitHub PR Automation

A comprehensive skill for GitHub pull request automation, featuring best practices for branch naming, PR creation, and workflow management.

## Overview

This skill provides guidelines and patterns for creating effective pull requests, managing branches, and establishing clear collaboration workflows. It integrates seamlessly with the `/gh-pr-create` and `/gh-get-branches` commands.

## Key Features

- **Branch Naming Conventions**: Consistent, descriptive branch naming patterns
- **PR Best Practices**: Clear title and description formats
- **Workflow Patterns**: GitFlow and similar branching strategies
- **Review Guidelines**: Effective code review processes
- **Automation Integration**: Seamless integration with GitHub CLI commands

## When to Use

Load this skill when:
- Creating pull requests using `/gh-pr-create`
- Planning branch naming for new features or fixes
- Establishing team coding standards and workflows
- Writing PR descriptions and commit messages
- Setting up automated PR workflows and CI/CD

## Branch Naming Conventions

### Standard Prefixes

- `feature/` - New feature development
- `fix/` - Bug fixes
- `hotfix/` - Urgent production fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation changes
- `test/` - Test additions or updates
- `chore/` - Maintenance tasks

### Examples

**Good Branch Names:**
```
feature/user-authentication
fix/login-timeout-error
hotfix/security-vulnerability
refactor/api-response-handling
docs/update-api-documentation
```

**Bad Branch Names:**
```
new-feature (too vague)
fix-the-bug (not descriptive)
auth (too short)
update (doesn't specify what's updated)
```

## PR Best Practices

### Title Format

Follow conventional commits format:
- `feat: add authentication flow`
- `fix: resolve login timeout issue`
- `docs: update API documentation`
- `refactor: simplify user service logic`

### Description Template

```markdown
## Summary
Brief description of changes

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How changes were tested

## Related Issues
Closes #123
Related to #456
```

## Integration with Commands

### `/gh-pr-create`

Automatically generates PR metadata based on branch names and commit messages:
- Parses branch names to generate titles
- Creates summaries from diff output
- Assigns reviewers when specified

### `/gh-get-branches`

Lists available branches to help you choose target branches:
- Shows current branch
- Displays default branch
- Lists all remote branches

## Workflow Patterns

### Feature Branch Workflow

1. Create feature branch from main
2. Make commits with conventional messages
3. Create PR to main branch
4. Review and merge
5. Delete feature branch

### GitFlow Workflow

1. Create `develop` branch if not exists
2. Create `feature/` branches from develop
3. Merge feature branches back to develop
4. Create `release/` branches from develop
5. Merge `release/` branches to main and develop
6. Create `hotfix/` branches from main when needed

## Review Guidelines

### For Reviewers

- **Check code quality**: Look for clean, readable code
- **Test thoroughly**: Verify changes work as expected
- **Give feedback**: Provide constructive, specific feedback
- **Approve clearly**: Use standard approval criteria

### For Authors

- **Keep PRs small**: Easier to review and merge
- **Write clear descriptions**: Explain what and why
- **Link related issues**: Provide context and references
- **Address feedback**: Respond to review comments promptly

## CI/CD Integration

### Automated Checks

- Run tests on PR creation
- Check code quality with linters
- Verify build process succeeds
- Deploy to staging environment

### Merge Protection

- Require review approvals
- Pass all CI checks
- Resolve merge conflicts
- Ensure PRs are up to date

## Benefits

- **Consistent naming**: Clear, organized branch structure
- **Better collaboration**: Easier code reviews and PR management
- **Automated workflows**: Streamlined PR creation and merging
- **Clear documentation**: Self-documenting PRs and commits
- **Faster reviews**: Smaller, focused PRs are easier to review

## Common Pitfalls

### Branch Naming

- ❌ Using generic names like `update` or `fix`
- ❌ Not using prefixes
- ❌ Making branch names too long
- ✅ Use descriptive, prefixed names

### PR Creation

- ❌ Vague titles like "Update code"
- ❌ Missing descriptions
- ❌ Not linking related issues
- ✅ Follow conventional commit format
- ✅ Provide detailed descriptions

### Review Process

- ❌ Waiting too long to review
- ❌ Giving vague feedback
- ❌ Approving without thorough review
- ✅ Review within 24-48 hours
- ✅ Provide specific, actionable feedback

## Additional Resources

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [GitFlow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Effective Code Review](https://google.github.io/eng-practices/review/reviewer/)

## Example Workflow

```bash
# 1. Create feature branch
git checkout -b feature/user-authentication

# 2. Make changes and commit
git add .
git commit -m "feat: add OAuth2 authentication support"

# 3. Push to remote
git push -u origin feature/user-authentication

# 4. Create PR
/gh-pr-create to main

# 5. Review and merge
# 6. Delete branch
git branch -d feature/user-authentication
```

## Contributing

To contribute improvements to this skill:
1. Update rules in the `rules/` directory
2. Update this README.md
3. Increment version in metadata.json
4. Submit a PR with conventional commit message
