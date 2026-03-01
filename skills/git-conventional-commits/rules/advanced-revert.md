# Use revert type for reverting commits

Use `revert:` type when reverting previous commits.
Include a footer referencing the commit SHAs being reverted.

## Incorrect

```git
revert: removed user authentication
```

Missing reference to what was reverted.

```git
revert: revert commit 676104e
```

Redundant to say "revert commit" - just provide the SHA.

```git
revert: remove user authentication feature

The feature was causing issues.
```

No reference to the original commit SHA.

```git
revert: feat add user authentication
```

Missing the colon after "revert" and no SHA reference.

## Correct

```git
revert: let us never again speak of the noodle incident

Refs: 676104e
```

Proper revert with reference to the original commit.

```git
revert: remove user authentication feature

This feature was causing performance issues and conflicts with the new auth system.

Refs: 676104e, a215868
```

Revert with detailed explanation and multiple commit references.

```git
revert: undo database migration changes

The migration caused production issues. We'll need to address this differently.

Refs: abc1234, def5678, ghi9012
```

Revert of multiple commits with explanation.

```git
revert(chore): remove obsolete configuration

Refs: 1234abcd
```

Revert with scope for clarity.

## Why It Matters

- Makes it clear when commits are being undone
- Provides traceability to the original changes
- Helps maintain accurate project history
- Allows automated tools to understand reverts

## Additional Context

Revert format requirements:
- Type: `revert:`
- Description: Imperative mood, describes what's being reverted
- Footer: `Refs:` followed by one or more commit SHAs
- Body: Optional but recommended for explaining why

**When to use revert:**
- When a commit introduced a bug
- When a feature needs to be removed
- When a change needs to be undone before release
- When reverting merge commits

**Finding commit SHAs:**
```bash
# Find the commit to revert
git log --oneline

# Or use the short SHA
git show 676104e
```

**Best Practices:**
- Revert specific commits rather than undoing changes manually
- Provide a clear description of what's being reverted
- Include the reason for the revert in the body
- Reference the original commit(s) with `Refs:`
- Consider whether a revert is the right approach vs. fixing the issue

**Multiple commits:**
- List multiple SHAs separated by commas: `Refs: abc123, def456`
- Revert commits in reverse order (newest first)
- Consider if `git revert` with multiple commits is better

## References

- [Conventional Commits FAQ](https://www.conventionalcommits.org/en/v1.0.0/#faqs)
- [Git Revert Documentation](https://git-scm.com/docs/git-revert)
- [Conventional Commits - Examples](https://www.conventionalcommits.org/en/v1.0.0/#examples)
