---
name: github-pr-automation
version: "1.0.0"
author: "Arvianto D. Wicaksono <dev@arvian.to>"
description: Best practices for creating pull requests, branch naming conventions, and PR workflow guidelines
tags: github, pull-request, workflow, branch-naming
---

Comprehensive guide to GitHub pull request automation and best practices for software development workflows.

## When to Apply

Use this skill when:
- Creating pull requests using `/gh-pr-create` command
- Planning branch naming conventions
- Establishing PR review processes
- Setting up automated PR workflows
- Writing PR descriptions and commit messages
- Managing PR lifecycles and merges

## Quick Reference

### Branch Naming Conventions

Use consistent, descriptive branch names:
- `feature/feature-name` → New feature development
- `fix/bug-description` → Bug fixes
- `hotfix/critical-issue` → Urgent production fixes
- `refactor/component-name` → Code refactoring
- `docs/update-description` → Documentation changes
- `test/add-coverage` → Test additions or updates
- `chore/maintenance-task` → Maintenance tasks

### PR Title Patterns

Follow conventional commits format in PR titles:
- `feat: add authentication flow`
- `fix: resolve login timeout issue`
- `docs: update API documentation`
- `refactor: simplify user service logic`

### PR Description Template

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

## Rule Categories

| Priority | Category         | Impact | Prefix       |
| -------- | ---------------- | ------ | ------------ |
| 1        | Branch Naming    | HIGH   | `branch-`    |
| 2        | PR Best Practices | HIGH | `pr-`         |
| 3        | Review Guidelines | MEDIUM | `review-`    |
| 4        | Workflow Patterns | MEDIUM | `workflow-`  |

## Core Guidelines

### 1. Branch Naming (HIGH)

- `branch-feature-prefix` → Use `feature/`, `fix/`, `hotfix/` prefixes
- `branch-descriptive-name` → Use descriptive, kebab-case names
- `branch-length-limit` → Keep branch names under 50 characters

### 2. PR Best Practices (HIGH)

- `pr-clear-titles` → Use conventional commit format in titles
- `pr-descriptive-bodies` → Provide detailed change descriptions
- `pr-linked-issues` → Link to related issues and PRs
- `pr-reviewers` → Assign appropriate reviewers

### 3. Review Guidelines (MEDIUM)

- `review-checklist` → Provide review checklist
- `review-feedback` → Give constructive feedback
- `review-approval` | Clear approval criteria

### 4. Workflow Patterns (MEDIUM)

- `workflow-branching` → Use GitFlow or similar branching strategy
- `workflow-ci-cd` → Integrate with CI/CD pipelines
- `workflow-merge-strategies` | Choose appropriate merge strategies

## Integration with Commands

This skill integrates with:
- `/gh-pr-create` → Automated PR creation
- `/gh-get-branches` → Branch listing and selection
- `/commit` → Conventional commits integration

## Benefits

- **Consistent naming** → Clear, organized branch structure
- **Better collaboration** → Easier code reviews and PR management
- **Automated workflows** → Streamlined PR creation and merging
- **Clear documentation** → Self-documenting PRs and commits

## Usage

Load this skill when:
1. Planning a new feature or bug fix
2. Creating pull requests
3. Establishing team coding standards
4. Setting up automated CI/CD workflows

## Examples

Good branch names:
```
feature/user-authentication
fix/login-timeout-error
hotfix/security-vulnerability-cve-2025-001
refactor-api-response-handling
docs/update-api-documentation
```

Good PR titles:
```
feat: add OAuth2 authentication support
fix: resolve session timeout in production
docs: update API endpoint documentation
refactor: simplify error handling middleware
```

Bad branch names:
```
new-feature (too vague)
fix-the-bug (not descriptive)
auth (too short)
update (doesn't specify what's updated)
```

Bad PR titles:
```
Update code (not descriptive)
Fix bug (doesn't specify which bug)
Changes (no context)
WIP (work in progress, should be finalized before PR)
```
