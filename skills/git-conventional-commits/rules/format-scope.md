# Use scope for additional context

Add an optional scope in parentheses after the type to provide additional context.
The scope should describe the section of the codebase affected.

## Incorrect

```git
feat add user authentication
```

Missing the required colon and space after type.

```git
feat: add user authentication (auth)
```

Scope must be in parentheses immediately after type, not at the end.

```git
feat-auth: add user authentication
```

Scope should not be hyphenated to the type.

## Correct

```git
feat: add user authentication
```

No scope is acceptable when the context is clear.

```git
feat(auth): add user authentication
```

Scope `auth` provides context about what's affected.

```git
feat(api): add user authentication endpoint
```

Scope `api` specifies the API module.

```git
fix(parser): handle malformed JSON in request body
```

Scope `parser` indicates the parser component.

```git
docs(readme): update installation instructions
```

Scope `readme` specifies which documentation file.

## Why It Matters

- Provides immediate context about what's affected
- Helps reviewers quickly understand the impact
- Allows automated tools to filter commits by scope
- Makes commit history more searchable and navigable

## Additional Context

Scope format:
- Must be in parentheses: `type(scope):`
- Must consist of a noun: `auth`, `api`, `parser`, etc.
- Can be omitted when the context is clear from the description
- Should be consistent within a project
- Should use the same naming conventions as modules/packages

Common scope examples:
- Module names: `auth`, `api`, `database`, `ui`, `core`
- Specific components: `parser`, `validator`, `middleware`
- File types: `readme`, `changelog`, `config`

**Best Practices:**
- Keep scopes short and meaningful
- Use consistent scope names across the project
- Document your project's scope conventions
- Avoid overly granular scopes (e.g., `user-authentication-validator`)

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Conventional Commits - Examples](https://www.conventionalcommits.org/en/v1.0.0/#examples)
