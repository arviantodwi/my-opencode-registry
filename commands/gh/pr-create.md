---
description: Create GitHub pull request
agent: general
model: zai-coding-plan/glm-4.7-flash
subtask: true
version: "1.0.0"
author: "Arvianto D. Wicaksono <dev@arvian.to>"
---

Create a pull request for the current repository using GitHub CLI.

**Execute:**

The command executes the following steps:

### 1. Verify Prerequisites

First, it checks that GitHub CLI (gh) is installed and that you're authenticated:

- Checks if `gh` is available in your system
- Verifies you're logged in to GitHub
- Shows helpful error messages if prerequisites aren't met

### 2. Get Current Branch Information

The command identifies:

- Your current working branch name
- All commits on your branch
- Files that have been modified, added, or deleted

If no commits are found between branches, it displays an error and exits. Don't
include commits from other branches.

### 3. Generate PR Title

The PR title is generated from your commit messages:

- Extracts action verbs (add, fix, improve, etc.) from commits
- Identifies key nouns (authentication, security, performance, etc.)
- Combines them into a comprehensive, concise title
- Applies title case formatting (like paper titles)
- Ensures the title is between 80-100 characters
- Falls back to the first commit message if needed

### 4. Generate PR Body

The PR body must follow the following template:

```markdown
## Summary

<!-- Descriptive summary with proper paragraph structure -->

### Context

<!-- Context content -->

### Related Issues

<!-- Issue placeholder, showing other related issues -->

---

## Testing

<!-- Testing content -->

---

## Risk/Impact

<!-- Content to show the impact of changes -->

---

<!-- Remove visuals section if no UI changes -->
### Visuals

<!-- Visual placeholder -->
```

It's automatically generated with the following structure:

#### Summary Paragraph

- First paragraph directly describes the changes
- Created from the first 2-3 commit messages
- Removes commit type prefixes and scopes (e.g., "feat:", "fix(auth):")
- Limited to 150-250 characters for clarity

#### Context Section

Explains why changes were made by grouping commits by type:

- **Features:** Lists all feature commits
- **Bug Fixes:** Lists all bug fix commits
- **Documentation:** Lists all documentation updates
- **Refactorings:** Lists all code refactorings

Each commit is shown as a bullet point. Don't put commit message at the end of list item.

**Bad**

```
* Features:
  - Add typeahead search dropdown component (feat(59): add typeahead search dropdown component)
```

**Good**

```
* Features:
  - Add typeahead search dropdown component
```

#### Testing Section

Detects and reports test-related changes:

- Identifies test files (containing "spec", "test", "e2e", "integration")
- Lists modified test files
- Shows test file count
- Recommends manual testing if no tests were modified

#### Risk/Impact Section

Assesses potential impact of changes:

- **High Risk:** Core files, config files, or middleware were modified
- **Medium Risk:** API files or services files were modified
- **Low Risk:** Only application code files were modified
- Lists specific risky files if detected, only when risk is medium or high
- Provides appropriate testing recommendations

#### Visuals Section

Detects UI-related changes:

- Identifies UI component files (CSS, JSX, TSX, Vue, HTML, SCSS, Sass)
- Lists modified UI files with count
- Remove the visuals section entirely if no UI files were modified
- Write `*TBD*` as a placeholder for screenshots or GIFs if UI changes exist.

### 5. Create Pull Request

Finally, the command uses GitHub CLI to create the PR:

**Build and execute the gh pr create command:**

```bash
gh pr create $ARGUMENTS --title "<title>" --body "<body>"
```

**Execution steps:**

- Uses the auto-generated title (80-100 chars, title case)
- Uses the auto-generated body (Visuals section omitted if no UI changes)
- Handles any GitHub API errors gracefully

**Error handling:**

- Invalid target branch name → suggest running `git branch -r` to list available remote branches
- Authentication failure → prompt user to authenticate with `gh auth login`
- No changes to commit → ask user to stage changes first with `git add`
- **GitHub API errors** → display specific error message from GitHub CLI
