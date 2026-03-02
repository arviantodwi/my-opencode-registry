---
description: Create GitHub pull request with target branch argument
agent: general
model: opencode/minimax-m2.5-free
subtask: false
version: "1.0.0"
author: "Arvianto D. Wicaksono <dev@arvian.to>"
---

Create a pull request for the current repository using GitHub CLI.

**Step 1: Check prerequisites**
- Verify gh CLI is installed: `gh --version`
- Check authentication: `gh auth status`
- Ensure we're in a Git repository

**Step 2: Parse arguments**
The command accepts arguments in the following format:
- `/gh/pr-create` → target: default branch, user: current account
- `/gh/pr-create to dev` → target: dev branch, user: current account
- `/gh/pr-create to dev as myusername` → target: dev branch, user: myusername

**Step 3: Determine PR details**
- Source branch: `$(git rev-parse --abbrev-ref HEAD)`
- Target branch: Parse from `to <branch>` pattern or use default branch
- User account: Parse from `as <username>` pattern or use current account
- PR title: Generated from branch name and latest commit message
- PR body: Generated from changes summary

**Step 4: Generate PR metadata**
```bash
# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Get default branch (from remote config)
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")

# Parse target branch
TARGET_BRANCH="${TARGET_BRANCH:-$DEFAULT_BRANCH}"

# Generate PR title from branch name
# e.g., feature/auth-login → "Add authentication login flow"
PR_TITLE=$(echo "$CURRENT_BRANCH" | sed 's/[-_]/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')

# Generate PR body from diff summary
PR_BODY=$(git diff origin/$TARGET_BRANCH...HEAD --stat 2>/dev/null || git log --oneline origin/$TARGET_BRANCH...HEAD 2>/dev/null || echo "New feature branch")
```

**Step 5: Create PR using gh CLI**
```bash
gh pr create \
  --source "$CURRENT_BRANCH" \
  --base "$TARGET_BRANCH" \
  --title "$PR_TITLE" \
  --body "$PR_BODY" \
  --reviewer "$REVIEWER"
```

**Step 6: Handle authentication if not set up**
If authentication fails, guide the user:
```bash
# SSH authentication (recommended)
gh auth login --ssh

# Or HTTPS authentication
gh auth login
```

**Step 7: Verify PR creation**
- Display PR URL
- Confirm PR status
- Show next steps (review, merge, etc.)

**Error handling:**
- Missing target branch → use default branch
- Authentication failure → prompt user to authenticate
- Invalid branch → suggest running `/gh/get-branches`
- No changes to commit → ask user to stage changes first
