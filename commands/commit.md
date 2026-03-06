---
description: Commit staged or unstaged changes using Conventional Commits
agent: general
model: opencode/minimax-m2.5-free
subtask: true
---

Use the git-conventional-commits skill to commit staged or unstaged changes within the active branch. Determine whether to commit changes as a single commit or multiple commits based on clarity.

**Step 1: Check for changes**
- Run `git status` to see staged or unstaged changes
- Run `git diff --staged` and `git diff` to review changes

**Step 2: If no changes exist**
- Inform user: "No staged or unstaged changes to commit"

**Step 3: If changes exist**
1. Load git-conventional-commits skill for guidance
2. Analyze changes to determine commit type(s):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`, `chore:` for other changes
   - Add `!` or BREAKING CHANGE footer for breaking changes
3. Decide: single commit or multiple commits?
   - **Multiple commits** when: changes are unrelated, mixed types, or contain breaking changes
   - **Single commit** when: changes are cohesive and serve one purpose
4. For each commit:
   - Stage relevant files (`git add <files>` or `git add -A`)
   - Write message following conventional format: `<type>[scope]: <description>`
   - Add body/footer if needed (breaking changes, refs, co-authors)
5. Execute: `git commit -m "<message>"`
6. Verify: Run `git status` to confirm

**Best practices:**
- Use lowercase, imperative mood, no period at end
- Include scope for context: `feat(api):` only when applicable
- Separate paragraphs with blank lines
- BREAKING CHANGE must be uppercase

After committing, summarize what was committed and the reasoning.
