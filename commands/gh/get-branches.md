---
description: List available branches in repository
agent: general
model: opencode/minimax-m2.5-free
subtask: false
version: "1.0.0"
author: "Arvianto D. Wicaksono <dev@arvian.to>"
---

List all available branches in the repository to help users identify target branches for pull requests.

**Execute:**
```bash
# Verify git repository
git rev-parse --git-dir || echo "Error: Not in a Git repository"

# List all branches with context
echo "=== Remote Branches ==="
git branch -r

echo ""
echo "=== Local Branches ==="
git branch

echo ""
echo "=== Current Branch ==="
git rev-parse --abbrev-ref HEAD

echo ""
echo "=== Default Branch ==="
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main"

echo ""
echo "=== Next Steps ==="
echo "Use /gh/pr-create to <branch> to create PR to specific branch"
echo "Use /gh/pr-create to create PR to default branch"
```

**Error handling:**
- Not in a Git repository → show error message
- No remote branches → ask user to fetch remotes
- No branches at all → repository might be empty
