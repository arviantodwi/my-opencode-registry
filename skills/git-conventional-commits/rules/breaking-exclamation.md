# Use exclamation mark for breaking changes in type/scope prefix

Place `!` immediately before the `:` in the type/scope prefix to indicate a breaking change.
This is an alternative (or complement) to using a BREAKING CHANGE footer.

## Incorrect

```git
feat!: send email when product shipped
```

Good! But without context about what broke, it's not clear.

```git
feat(api): send email when product shipped
BREAKING CHANGE: this changes the response format
```

Breaking change only in footer, not in prefix.

```git
feat:!: send email when product shipped
```

Incorrect placement - `!` should be directly before `:` not after.

## Correct

```git
feat!: send an email to the customer when a product is shipped
```

Clear breaking change indicator with `!` before colon.

```git
feat(api)!: send an email to the customer when a product is shipped
```

Breaking change with scope and `!` indicator.

```git
chore!: drop support for Node 6

BREAKING CHANGE: use JavaScript features not available in Node 6.
```

Both `!` and BREAKING CHANGE footer for maximum clarity.

```git
refactor(auth)!: redesign authentication flow

BREAKING CHANGE: the authenticate() function now requires an async callback
instead of returning a promise directly
```

Breaking change with detailed explanation in footer.

## Why It Matters

- The `!` in the prefix makes breaking changes immediately visible
- Helps reviewers quickly identify commits that need extra attention
- Automated tools can detect breaking changes without parsing footers
- Works in conjunction with BREAKING CHANGE footer for detailed explanations

## Additional Context

When using `!`:
- Place it immediately before the `:` (or `):` when scope is present)
- Example: `feat!:`, `feat(api)!:`, `fix(core)!:`
- The `!` alone is sufficient to indicate a breaking change
- A BREAKING CHANGE footer may be added for detailed explanation
- The commit description should describe what changed

If using `!`, you may omit the BREAKING CHANGE footer if the description
clearly explains the breaking change. However, including both is often
preferred for clarity.

## References

- [Conventional Commits Specification - Breaking Changes](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Conventional Commits - Examples](https://www.conventionalcommits.org/en/v1.0.0/#examples)
