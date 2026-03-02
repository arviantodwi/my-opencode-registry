# Automated PR Body Generation

## Overview

The `/gh/pr-create` command automatically generates comprehensive pull request bodies from commit messages and git data. This approach eliminates the need for manual templates while providing structured, informative PR descriptions.

## Body Structure

The generated PR body contains the following sections:

### 1. Summary
High-level overview of the PR including:
- Count of features added
- Count of bug fixes
- Count of documentation updates
- Count of refactorings

### 2. Context
Detailed explanation of why the changes were made, grouped by commit type:
- **Features**: List of all `feat:` commits
- **Bug Fixes**: List of all `fix:` commits
- **Documentation**: List of all `docs:` commits
- **Refactorings**: List of all `refactor:` commits

### 3. Changes
List of all modified files with their status:
- **Modified**: Existing files that were changed
- **Added**: New files created
- **Deleted**: Files that were removed
- **Renamed**: Files that were moved or renamed

### 4. Testing
Information about test coverage:
- List of test files modified
- Test coverage status
- Manual testing recommendations if no test files found

### 5. Risk/Impact
Assessment of potential impact:
- **High Risk**: Core files, configuration files modified
- **Medium Risk**: Some core files modified
- **Low Risk**: No core files modified

### 6. Visuals
UI-related changes:
- List of UI component files modified
- Placeholder for screenshots/GIFs if UI changes detected

## Automation Rules

### Commit Message Parsing

The system parses all commits between the source and target branches:

```bash
git log --pretty=format:"%h|%s" origin/$TARGET_BRANCH..HEAD
```

Commit types are extracted:
- `feat:` → Features
- `fix:` → Bug Fixes
- `docs:` → Documentation
- `refactor:` → Refactoring
- `test:` → Tests
- `style:` → Styling
- `chore:` → Chores

### File Change Detection

Modified files are extracted:

```bash
git diff --name-status origin/$TARGET_BRANCH..HEAD
```

Status codes:
- `M` = Modified
- `A` = Added
- `D` = Deleted
- `R` = Renamed

### Test File Detection

Test files are identified by pattern matching:

```bash
grep -iE "(spec|test|e2e|integration)"
```

Common test file patterns:
- `*.spec.ts`, `*.spec.js`
- `*.test.ts`, `*.test.js`
- `*.e2e.ts`, `*.e2e.js`
- `integration/*.ts`, `integration/*.js`

### Risk File Detection

Risky files are identified as:
- Configuration files (`package.json`, `tsconfig.json`, `.env`)
- Core application files (`routes/`, `controllers/`, `models/`)
- Middleware files
- Database schema files

### UI File Detection

UI files are identified by extension:

```bash
grep -iE "\.(css|jsx|tsx|vue|html|scss|sass)"
```

## Title Generation Process

Titles are generated from the PR body, not branch names:

### Extraction Process

1. **Extract Action Verbs**
   - Add, implement, fix, remove, update
   - Improve, resolve, enhance, create
   - Delete, modify, refactor, optimize, secure

2. **Extract Key Nouns**
   - CORS, authentication, security, API
   - Login, token, session, middleware
   - Endpoint, feature, bug, performance
   - Database, cache, UI, interface

3. **Create Comprehensive Summary**
   - Combine actions and nouns
   - Apply title case formatting
   - Remove duplicate words

4. **Apply Length Constraints**
   - Target: 80-100 characters
   - Prefer shorter titles when possible
   - Add branch context if title is too short

### Title Examples

**Good Titles:**
- `Enhance Security with CORS and API Key Authentication` (69 chars)
- `Add OAuth2 Login and Fix Token Expiration` (63 chars)
- `Improve API Performance with Caching` (56 chars)
- `Fix Session Timeout and Optimize Database Queries` (70 chars)

**Bad Titles:**
- `feat: add cors and api authentication` (includes commit prefix)
- `Feature Security Add CORS API` (unclear, word salad)
- `Update code` (too vague)
- `Fixes` (too brief)

## Best Practices

### For Commit Messages

Write clear, descriptive commit messages:

**Good:**
```
feat: add CORS configuration to allow cross-origin requests
fix: resolve session timeout in authentication flow
docs: update API documentation with new endpoints
```

**Bad:**
```
update
fix bug
wip
```

### For PR Titles

Let the system generate titles automatically, but review them for:

- Clarity: Does it clearly describe what the PR does?
- Completeness: Does it capture the main changes?
- Conciseness: Is it between 80-100 characters?

### For Review

When reviewing auto-generated PRs:

1. Check the **Summary** section for accuracy
2. Verify the **Context** section matches actual changes
3. Review **Changes** for unexpected file modifications
4. Confirm **Testing** status
5. Assess **Risk/Impact** for potential issues
6. Add **Visuals** (screenshots/GIFs) if UI changes

## Examples

### Example 1: Security Enhancement

**Branch:** `feat/security/cors-api`

**Commits:**
```
feat: add CORS support for cross-origin requests
feat: implement API key authentication middleware
fix: resolve session timeout issue in auth flow
test: add integration tests for authentication
```

**Generated Body:**
```markdown
## Summary

This PR includes 2 feature(s). Fixes 1 issue(s).

## Context

### Why These Changes?

**Features:**
- Add CORS support for cross-origin requests
- Implement API key authentication middleware

**Bug Fixes:**
- Resolve session timeout issue in auth flow

## Changes

- Added: `src/middleware/cors.ts`
- Added: `src/middleware/auth.ts`
- Modified: `src/controllers/session.ts`
- Added: `tests/integration/auth.test.ts`

## Testing

Test files modified (1):
- `tests/integration/auth.test.ts`

All tests should pass with these changes.

## Risk/Impact

**Low Risk Changes:**
- No core or configuration files modified
- Safe to merge after review

## Visuals

No UI changes in this PR.
```

**Generated Title:**
```
Add CORS Support, API Key Authentication, Fix Session Timeout
```

### Example 2: Bug Fix

**Branch:** `fix/user-profile-bug`

**Commits:**
```
fix: resolve profile image upload issue
fix: fix memory leak in user profile loading
refactor: simplify profile data structure
```

**Generated Body:**
```markdown
## Summary

Fixes 2 issue(s). Refactors 1 component(s).

## Context

### Why These Changes?

**Bug Fixes:**
- Resolve profile image upload issue
- Fix memory leak in user profile loading

**Refactorings:**
- Simplify profile data structure

## Changes

- Modified: `src/components/Profile.tsx`
- Modified: `src/services/user.ts`
- Modified: `src/types/profile.ts`

## Testing

No test files modified in this PR. Manual testing recommended.

## Risk/Impact

**Low Risk Changes:**
- No core or configuration files modified
- Safe to merge after review

## Visuals

UI components modified (1):
- `src/components/Profile.tsx`

<!-- Add screenshots or GIFs here to demonstrate UI changes -->
```

**Generated Title:**
```
Fix Profile Image Upload, Memory Leak in User Profile
```

## Troubleshooting

### Empty PR Body

If the PR body is empty:
- Check if there are any commits between branches
- Ensure the target branch exists
- Verify git history is accessible

### Generic Title

If the title is too generic:
- Review commit messages for clarity
- Consider adding more descriptive commit messages
- The system will generate better titles from better commits

### Missing Sections

If sections are missing from the body:
- Verify git diff is working
- Check file paths and patterns
- Ensure branch is up to date with remote

## Integration

This automated generation integrates with:
- `/gh/pr-create` → Generates PR title and body automatically
- `/gh/get-branches` → Lists available branches for target selection
- `/commit` → Creates conventional commits for better PR generation

## Benefits

- **No Manual Templates**: All sections auto-populated from git data
- **Consistent Format**: Every PR has the same structured format
- **Clear Context**: Reviewers understand why changes were made
- **Risk Assessment**: Automatic detection of risky changes
- **Better Titles**: Generated from actual changes, not branch names
- **Time Saving**: No need to manually fill templates
- **Review Efficiency**: Structured format speeds up reviews
