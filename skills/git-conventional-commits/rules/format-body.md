# Use blank line between description and body

Separate the commit description and body with a single blank line.
The body provides detailed context about the change.

## Incorrect

```git
feat: add user authentication
This commit implements OAuth2 authentication with support for Google and GitHub.
```

No blank line between description and body.

```git
feat: add user authentication


This commit implements OAuth2 authentication with support for Google and GitHub.
```

Too many blank lines (should be exactly one).

```git
feat: add user authentication

This commit implements OAuth2 authentication with support for Google and GitHub. It also handles token refresh and logout functionality.
```

Body should use proper paragraph separation for multiple ideas.

## Correct

```git
feat: add user authentication

This commit implements OAuth2 authentication with support for Google and GitHub.
```

Single blank line separates description from body.

```git
feat: add user authentication

This commit implements OAuth2 authentication with support for Google and GitHub.
Token refresh is handled automatically.

BREAKING CHANGE: removes legacy token-based authentication.
```

Multiple paragraphs in body separated by blank lines, with footer.

```git
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Remove timeouts which were used to mitigate the racing issue but are
obsolete now.

Refs: #123
```

Multiple paragraphs and footers, all properly separated.

## Why It Matters

- Clear visual separation between summary and details
- Automated tools can parse description and body separately
- Follows the conventional commits specification
- Makes commit messages more readable in git log

## Additional Context

Body format requirements:
- MUST begin one blank line after the description
- May consist of multiple paragraphs separated by blank lines
- Free-form text can be used
- Explain WHAT and WHY, not HOW (the code shows HOW)
- Can include bullet points, numbered lists, etc.

Good use cases for the body:
- Explaining the motivation behind the change
- Describing edge cases that were handled
- Noting alternative approaches considered
- Providing migration guidance for breaking changes
- Documenting complex algorithms or logic

**Length Guidelines:**
- Wrap lines at 72 characters for readability
- Be concise but thorough
- Include enough context for future maintainers

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Conventional Commits - Examples](https://www.conventionalcommits.org/en/v1.0.0/#examples)
