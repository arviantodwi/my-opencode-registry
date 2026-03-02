# GitHub PR Automation

A comprehensive skill for GitHub pull request automation, featuring best practices for branch naming, PR creation, and workflow management.

## Overview

This skill provides guidelines and patterns for creating effective pull requests, managing branches, and establishing clear collaboration workflows. It integrates seamlessly with the `/gh-pr-create` and `/gh-get-branches` commands.

## Key Features

- **Branch Naming Conventions**: Consistent, descriptive branch naming patterns
- **Automated PR Generation**: Title and body generated from commit messages
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

PR titles are automatically generated from commit messages:
- "Add OAuth2 Authentication and Fix Session Timeout" (auto-generated)
- "Improve API Performance with Caching" (auto-generated)
- "Fix Login Timeout and Optimize Database Queries" (auto-generated)

**Title Rules:**
- Target: 80-100 characters (prefer shorter)
- Single comprehensive summary
- Title case formatting
- Generated from commit messages, not branch names

### Description Template

PR descriptions are automatically generated with the following structure:

```markdown
## Summary
High-level overview of changes (features, fixes, docs, refactorings)

## Context
### Why These Changes?
**Features:**
- List of feature commits

**Bug Fixes:**
- List of bug fix commits

## Changes
- Modified: `file1.ts`
- Added: `file2.ts`

## Testing
Test files modified and status
All tests should pass with these changes

## Risk/Impact
**Low/Medium/High Risk Changes:**
- Assessment of potential impact

## Visuals
UI components modified or "No UI changes in this PR"
```

**Note:** All sections are auto-generated from git data. No manual templates required.

## Integration with Commands

### `/gh-pr-create`

Automatically generates PR metadata from commit messages:
- **Title**: Generated from commit messages, 80-100 chars, title case
- **Body**: Auto-generated with Summary, Context, Changes, Testing, Risk/Impact, Visuals sections
- **Source/Target**: Uses current branch and target branch (or default if not specified)

**Note:** Better commit messages lead to better PR titles and bodies. Branch names are used for organization only.

### `/gh-get-branches`

Lists available branches to help you choose target branches:
- Shows current branch
- Displays default branch
- Lists all remote branches

**Usage:**
```bash
/gh/get-branches
# View available branches
/gh/pr-create base:dev
# Create PR to dev branch
```

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

- **Automated generation**: PR titles and bodies auto-generated from commit messages
- **No manual templates**: All sections populated from git data
- **Consistent format**: Every PR has the same structured format
- **Better collaboration**: Easier code reviews and PR management
- **Clear context**: Reviewers understand why changes were made
- **Risk assessment**: Automatic detection of risky changes
- **Time saving**: No need to manually fill templates
- **Better quality**: Improved commit messages lead to better PRs

## Common Pitfalls

### Branch Naming

- ❌ Using generic names like `update` or `fix`
- ❌ Not using prefixes
- ❌ Making branch names too long
- ✅ Use descriptive, prefixed names

### PR Creation

- ❌ Vague commit messages lead to poor PR titles
- ❌ Missing conventional commit format
- ❌ Poor commit descriptions lead to unclear PR bodies
- ✅ Use conventional commit format for better PR generation
- ✅ Write clear, descriptive commit messages
- ✅ Review auto-generated PR titles and bodies before creating

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
git checkout -b feature/security-enhancements

# 2. Make changes and commit with conventional format
git add .
git commit -m "feat: add CORS support for cross-origin requests"
git add .
git commit -m "feat: implement API key authentication middleware"
git add .
git commit -m "fix: resolve session timeout in auth flow"

# 3. Push to remote
git push -u origin feature/security-enhancements

# 4. Create PR (auto-generated title and body)
/gh-pr-create base:main

# 5. Review auto-generated PR
# Title: "Add CORS Support, API Key Authentication, Fix Session Timeout"
# Body: Complete with Summary, Context, Changes, Testing, Risk/Impact, Visuals

# 6. Review and merge
# 7. Delete branch
git branch -d feature/security-enhancements
```

## Contributing

To contribute improvements to this skill:
1. Update rules in the `rules/` directory
2. Update this README.md
3. Increment version in metadata.json
4. Submit a PR with conventional commit message
