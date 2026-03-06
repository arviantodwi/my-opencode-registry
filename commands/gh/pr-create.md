---
description: Create GitHub pull request with target branch argument
agent: general
model: zai-coding-plan/glm-4.7-flash
subtask: true
version: "1.0.0"
author: "Arvianto D. Wicaksono <dev@arvian.to>"
---

Create a pull request for the current repository using GitHub CLI.

**Parse arguments:**

- `/gh/pr-create` → target: default branch
- `/gh/pr-create base:dev` → target: dev branch
- `/gh/pr-create draft` → creates draft PR
- `/gh/pr-create base:dev draft` → creates draft PR targeting dev branch

**Execute:**

The command executes the following steps:

### 1. Verify Prerequisites

First, it checks that GitHub CLI (gh) is installed and that you're authenticated:

- Checks if `gh` is available in your system
- Verifies you're logged in to GitHub
- Shows helpful error messages if prerequisites aren't met

### 2. Parse Command Arguments

**Parse the command string to extract optional arguments:**

```bash
# Example command: /gh/pr-create base:dev draft
# Parse logic:
# 1. Check for "draft" word presence → set isDraft=true
# 2. Check for "base:" prefix → extract target branch
# 3. Default values: isDraft=false, target=main
```

The command accepts optional arguments:

- **Target branch:** using the `base:` prefix
  - Default target: `main` (if no argument provided)
  - With argument: `/gh/pr-create base:dev` targets the `dev` branch
  - Example: `/gh/pr-create base:develop` targets the `develop` branch
  - **Implementation:** Extract after "base:" prefix, remove "base:" from final command
- **Draft mode:** using the `draft` argument
  - Creates PR as draft
  - Example: `/gh/pr-create draft` creates draft PR
  - Combined: `/gh/pr-create base:dev draft` creates draft PR targeting dev branch
  - **Implementation:** Check if "draft" appears anywhere in command string, set `isDraft=true`

**Argument parsing algorithm:**

```bash
# Parse command string to extract arguments
function parse_arguments() {
  local command_string="$1"
  local isDraft=false
  local target="main"  # Default branch

  # Check for draft mode
  if [[ "$command_string" == *"draft"* ]]; then
    isDraft=true
  fi

  # Check for base: prefix and extract target branch
  if [[ "$command_string" == *"base:"* ]]; then
    # Extract value after "base:" prefix
    target=$(echo "$command_string" | grep -oP 'base:\K[^ ]+' | head -1)
  fi

  echo "isDraft=$isDraft"
  echo "target=$target"
}
```

**Usage in implementation:**
- Parse the command string at the beginning of execution
- Store parsed values in variables (`isDraft`, `target`)
- Use these variables when constructing the `gh pr create` command
- Apply `--draft` flag conditionally based on `isDraft` value
- Use `target` variable for `--base` parameter

### 3. Get Current Branch Information

The command identifies:

- Your current working branch name
- All commits on your branch
- Files that have been modified, added, or deleted

If no commits are found between branches, it displays an error and exits. Don't
include commits from other branches.

### 4. Generate PR Title

The PR title is generated from your commit messages:

- Extracts action verbs (add, fix, improve, etc.) from commits
- Identifies key nouns (authentication, security, performance, etc.)
- Combines them into a comprehensive, concise title
- Applies title case formatting (like paper titles)
- Ensures the title is between 80-100 characters
- Falls back to the first commit message if needed

### 5. Generate PR Body

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
- Omit the visuals section entirely if no UI files were modified
- Write `*TBD*` as a placeholder for screenshots or GIFs if UI changes exist.

### 6. Create Pull Request

Finally, the command uses GitHub CLI to create the PR:

**Build and execute the gh pr create command:**

```bash
# Base command structure
gh pr create [flags] --base <target> --title "<title>" --body "<body>"

# Add --draft flag only if isDraft=true
if [ "$isDraft" = true ]; then
  gh pr create --draft --base "$target" --title "$title" --body "$body"
else
  gh pr create --base "$target" --title "$title" --body "$body"
fi
```

**Execution steps:**

- Parse arguments from command string (isDraft flag, target branch)
- Creates PR from your current branch to target branch
- Uses the auto-generated title (80-100 chars, title case)
- Uses the auto-generated body (Visuals section omitted if no UI changes)
- **Includes `--draft` flag only if "draft" argument was present in command string**
- Handles any GitHub API errors gracefully

**Argument usage in command:**
```bash
# Example: /gh/pr-create base:dev draft
# → isDraft=true, target=dev
# → Executed: gh pr create --draft --base dev --title "..." --body "..."

# Example: /gh/pr-create draft
# → isDraft=true, target=main (default)
# → Executed: gh pr create --draft --base main --title "..." --body "..."

# Example: /gh/pr-create
# → isDraft=false, target=main (default)
# → Executed: gh pr create --base main --title "..." --body "..."
```

**Error handling:**

- Missing target branch → use default branch
- Invalid `base:` argument (no value after prefix) → show error and suggest correct format
- Invalid target branch name → suggest running `git branch -r` to list available remote branches
- Authentication failure → prompt user to authenticate with `gh auth login`
- No changes to commit → ask user to stage changes first with `git add`
- **Draft mode argument validation** → ensure "draft" is not combined with invalid target branch format
- **Argument parsing failures** → show which argument could not be parsed and suggest correct format
- **GitHub API errors** → display specific error message from GitHub CLI

**Argument validation rules:**
```
- "draft" can appear anywhere in command string
- "base:" must be followed by a valid branch name
- No spaces allowed between "base:" and branch name (e.g., "base: dev" is invalid)
- Branch names must exist in remote repository
- Draft argument is optional, can be combined with base: or used alone
```
