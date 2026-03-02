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
- Creating pull requests using `/gh/pr-create` command
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

The `/gh/pr-create` command automatically generates PR titles from commit messages:
- **Auto-generated**: "Add OAuth2 Authentication and Fix Session Timeout"
- **Auto-generated**: "Improve API Performance with Caching"
- **Auto-generated**: "Fix Login Timeout and Optimize Database Queries"

**Title Generation Rules:**
- Generated from commit messages, not branch names
- Target length: 80-100 characters (prefer shorter)
- Single comprehensive summary (clarity is top priority)
- Title case formatting
- Extracts action verbs and key nouns from commits
- No conventional commit prefixes (`feat:`, `fix:`, etc.)

### PR Description Template

The `/gh/pr-create` command automatically generates PR bodies with the following structure:

```markdown
## Summary
High-level overview of changes (features, fixes, docs, refactorings)

## Context
### Why These Changes?
**Features:**
- List of feature commits

**Bug Fixes:**
- List of bug fix commits
 
## Testing
Test files modified and status
All tests should pass with these changes

## Risk/Impact
**Low/Medium/High Risk Changes:**
- Assessment of potential impact
- List of risky files if applicable

## Visuals
UI components modified or "No UI changes in this PR"
<!-- Add screenshots or GIFs here if applicable -->
```

**Note:** All sections are auto-generated from git data. No manual templates required.

## Core Guidelines

### 1. Branch Naming (HIGH)

- Use `feature/`, `fix/`, `hotfix/` prefixes for different types of changes
- Use descriptive, kebab-case names
- Keep branch names under 50 characters

### 2. PR Best Practices (HIGH)

- Use conventional commit format in PR titles
- Provide detailed change descriptions
- Link to related issues and PRs
- Assign appropriate reviewers

### 3. Review Guidelines (MEDIUM)

- Provide review checklist
- Give constructive feedback
- Clear approval criteria

### 4. Workflow Patterns (MEDIUM)

- Use GitFlow or similar branching strategy
- Integrate with CI/CD pipelines
- Choose appropriate merge strategies

## Integration with Commands

This skill integrates with:
- `/gh/pr-create` → Automated PR title and body generation from commit messages
- `/gh/get-branches` → Branch listing and selection
- `/commit` → Conventional commits integration (better commits = better PR generation)

## Benefits

- **Automated generation** → PR titles and bodies auto-generated from commit messages
- **No manual templates** → All sections populated from git data
- **Consistent format** → Every PR has the same structured format
- **Better collaboration** → Easier code reviews and PR management
- **Clear context** → Reviewers understand why changes were made
- **Risk assessment** → Automatic detection of risky changes
- **Time saving** → No need to manually fill templates

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

Good PR titles (auto-generated):
```
Add OAuth2 Authentication and Fix Session Timeout
Improve API Performance with Caching
Fix Login Timeout and Optimize Database Queries
Update API Documentation with New Endpoints
Simplify Error Handling and Improve Readability
```

Bad branch names:
```
new-feature (too vague)
fix-the-bug (not descriptive)
auth (too short)
update (doesn't specify what's updated)
```

Bad PR titles (to avoid):
```
feat: add cors and api authentication (includes commit prefix)
Feature Security Add CORS API (unclear, word salad)
Update code (too vague)
Fixes (too brief)
wip (work in progress)
```
