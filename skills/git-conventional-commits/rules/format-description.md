# Use lowercase imperative mood for description

Write the description in lowercase, imperative mood, without a trailing period.
The description should be a short summary of what the commit does.

## Incorrect

```git
feat: Added user authentication
```

Starts with capital letter - should be lowercase.

```git
feat: add User Authentication
```

Capitalization in description - should be all lowercase.

```git
feat: adds user authentication
```

Uses third-person singular - should be imperative mood.

```git
fix: fixed null pointer exception.
```

Uses past tense and has trailing period - should be imperative without period.

```git
feat: Adding user authentication system to the application for better security
```

Too long - descriptions should be concise (usually 50-72 characters).

## Correct

```git
feat: add user authentication
```

Lowercase, imperative mood, no period, concise.

```git
fix: resolve null pointer exception
```

Lowercase, imperative mood, no period.

```git
docs: update installation guide
```

Lowercase, imperative mood, no period.

```git
refactor(auth): simplify login flow
```

Lowercase, imperative mood, no period, with scope.

```git
perf(api): optimize database queries
```

Lowercase, imperative mood, no period, concise.

## Why It Matters

- Consistency with git's default commit message style
- Automated tools expect this format
- Makes commit history more uniform and readable
- Follows established conventions in the open-source community

## Additional Context

Description guidelines:
- **Lowercase**: All letters should be lowercase (unless proper nouns)
- **Imperative mood**: Use "add" not "added" or "adds"
- **No trailing period**: Don't end with `.`
- **Concise**: Keep it under 72 characters when possible
- **Present tense**: Describe what the commit does, not what it did

Good examples:
- "add" not "added" or "adds"
- "fix" not "fixed" or "fixes"
- "update" not "updated" or "updates"
- "remove" not "removed" or "removes"

**Length Guidelines:**
- Aim for 50 characters or less
- Maximum 72 characters before wrapping
- Use the body for detailed explanations if needed

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
