# Use blank lines to separate body paragraphs

Separate multiple paragraphs in the commit body with blank lines.
Each paragraph should address a specific aspect of the change.

## Incorrect

```git
feat: add user authentication

This commit implements OAuth2 authentication with support for Google and GitHub.
Token refresh is handled automatically to ensure seamless user sessions.
The authentication flow has been redesigned to improve security.

BREAKING CHANGE: removes legacy token-based authentication.
```

Body paragraphs are run together without separation.

```git
feat: add user authentication

This commit implements OAuth2 authentication with support for Google and GitHub.

Token refresh is handled automatically to ensure seamless user sessions. The authentication flow has been redesigned to improve security.

BREAKING CHANGE: removes legacy token-based authentication.
```

Middle paragraph is too long and dense.

## Correct

```git
feat: add user authentication

This commit implements OAuth2 authentication with support for Google and GitHub.

Token refresh is handled automatically to ensure seamless user sessions.

The authentication flow has been redesigned to improve security.

BREAKING CHANGE: removes legacy token-based authentication.
```

Each idea in its own paragraph, properly separated by blank lines.

```git
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Remove timeouts which were used to mitigate the racing issue but are
obsolete now.

Reviewed-by: John Doe
Refs: #123
```

Clear separation between paragraphs and footers.

```git
refactor(auth): redesign authentication flow

Extracted authentication logic into separate service class for better
testability and reusability.

Simplified error handling by implementing a unified error response
format across all authentication endpoints.

BREAKING CHANGE: the authenticate() function signature changed from
authenticate(credentials) to authenticate(credentials, options).
```

Multiple paragraphs explaining different aspects of the refactor.

## Why It Matters

- Improves readability of complex commit messages
- Helps reviewers understand different aspects of the change
- Makes commit history more useful for future reference
- Follows established documentation conventions

## Additional Context

When to use multiple paragraphs:
- Explaining different aspects of a complex change
- Separating technical details from motivation
- Describing multiple related but distinct improvements
- Providing migration steps for breaking changes
- Documenting edge cases or special considerations

Best practices:
- One idea per paragraph
- Keep paragraphs concise
- Use blank lines consistently
- Separate body paragraphs from footers with blank lines
- Consider bullet points for lists

**Alternative: Use lists for sequential items:**

```git
feat: add user authentication

This commit implements OAuth2 authentication with:
- Google OAuth integration
- GitHub OAuth integration
- Automatic token refresh
- Secure session management
```

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Conventional Commits - Examples](https://www.conventionalcommits.org/en/v1.0.0/#examples)
