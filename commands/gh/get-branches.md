---
description: List available branches in repository
agent: general
model: opencode/minimax-m2.5-free
subtask: false
version: "1.0.0"
author: "Arvianto D. Wicaksono <dev@arvian.to>"
---

List all available branches in the repository to help users identify target branches for pull requests.

**Step 1: Check prerequisites**
- Verify we're in a Git repository: `git rev-parse --git-dir`
- Ensure we have remote branches: `git branch -r`

**Step 2: List all branches**
```bash
# List all remote branches
git branch -r

# List all local branches
git branch

# Get current branch
git rev-parse --abbrev-ref HEAD

# Get default branch
git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'
```

**Step 3: Display branch information**
Show branches in a formatted way:
- Current branch (marked with *)
- Default branch (typically main or master)
- Available remote branches
- Available local branches

**Step 4: Suggest next steps**
After displaying branches, suggest:
- Use `/gh/pr-create to <branch>` to create PR to specific branch
- Use `/gh/pr-create` to create PR to default branch
- Use `git checkout <branch>` to switch branches

**Error handling:**
- Not in a Git repository → show error message
- No remote branches → ask user to fetch remotes
- No branches at all → repository might be empty
