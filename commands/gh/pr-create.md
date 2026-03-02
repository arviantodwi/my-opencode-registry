---
description: Create GitHub pull request with target branch argument
agent: general
model: opencode/minimax-m2.5-free
subtask: false
version: "1.0.0"
author: "Arvianto D. Wicaksono <dev@arvian.to>"
---

Create a pull request for the current repository using GitHub CLI.

**Parse arguments:**
- `/gh/pr-create` → target: default branch, user: current account
- `/gh/pr-create to dev` → target: dev branch, user: current account
- `/gh/pr-create to dev as myusername` → target: dev branch, user: myusername

**Execute:**
```bash
# Check prerequisites
gh --version || echo "Error: GitHub CLI not installed. Install with: brew install gh"
gh auth status || echo "Error: Not authenticated. Run: gh auth login --ssh"

# Parse arguments to extract target branch and reviewer
TARGET_BRANCH="main"
REVIEWER=""
args=$@()

# Parse "to <branch>" pattern
for ((i=0; i<${#args[@]}; i++)); do
  if [ "${args[$i]}" = "to" ] && [ $((i+1)) -lt ${#args[@]} ]; then
    TARGET_BRANCH="${args[$((i+1))]}"
  fi
  # Parse "as <username>" pattern
  if [ "${args[$i]}" = "as" ] && [ $((i+1)) -lt ${#args[@]} ]; then
    REVIEWER="${args[$((i+1))]}"
  fi
done

# Get current branch and generate PR details
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
PR_TITLE=$(echo "$CURRENT_BRANCH" | sed 's/[-_]/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')
PR_BODY=$(git diff origin/$TARGET_BRANCH...HEAD --stat 2>/dev/null || git log --oneline origin/$TARGET_BRANCH...HEAD 2>/dev/null || echo "New feature branch")

# Create PR
gh pr create --source "$CURRENT_BRANCH" --base "$TARGET_BRANCH" --title "$PR_TITLE" --body "$PR_BODY" ${REVIEWER:+--reviewer "$REVIEWER"}
```

**Error handling:**
- Missing target branch → use default branch
- Authentication failure → prompt user to authenticate
- Invalid branch → suggest running `/gh/get-branches`
- No changes to commit → ask user to stage changes first
