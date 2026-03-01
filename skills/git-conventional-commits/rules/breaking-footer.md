# Use BREAKING CHANGE footer for detailed breaking change descriptions

Use the BREAKING CHANGE footer to provide detailed explanations of breaking changes.
This footer is required when a commit introduces breaking API changes.

## Incorrect

```git
feat: add new authentication method

The old method is deprecated.
```

Breaking change mentioned in body but not in proper footer format.

```git
feat: add new authentication method

BREAKINGCHANGE: old method no longer works
```

Must be `BREAKING CHANGE:` with a space, not `BREAKINGCHANGE:`.

```git
feat!: add new authentication method

breaking change: old method removed
```

`BREAKING CHANGE:` must be uppercase with a space after colon.

## Correct

```git
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

Clear breaking change with proper footer format.

```git
chore: drop support for Node 6

BREAKING CHANGE: use JavaScript features not available in Node 6.
```

Breaking change footer with period at end (optional).

```git
refactor(auth): redesign authentication flow

BREAKING CHANGE: the authenticate() function signature changed:
- Old: authenticate(credentials) returns Promise<User>
- New: authenticate(credentials, options) returns Promise<AuthResult>
- The User object structure has changed to include additional fields
```

Breaking change with detailed multi-line explanation.

```git
feat(api)!: redesign authentication flow

BREAKING CHANGE: the /api/auth endpoint now requires:
- Content-Type: application/json header
- All requests must include X-Request-ID header
- Response format changed from {token} to {data: {token}, meta: {...}}
```

Both `!` in prefix and BREAKING CHANGE footer for maximum clarity.

## Why It Matters

- BREAKING CHANGE footer provides space for detailed explanations
- Automated changelog generators extract breaking change descriptions
- Makes it clear to users what needs to be updated when upgrading
- Required by the Conventional Commits specification for breaking changes

## Additional Context

BREAKING CHANGE footer format:
- Must be uppercase: `BREAKING CHANGE:`
- Must include space after colon
- Can span multiple lines
- Can be used with or without `!` in the type/scope prefix
- Can be used with any commit type, not just `feat:` or `fix:`

Breaking changes MUST be indicated in one of two ways:
1. A `!` in the type/scope prefix (immediately before `:`)
2. A BREAKING CHANGE footer
3. Both (recommended for clarity)

## References

- [Conventional Commits Specification - Breaking Changes](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- [Conventional Commits - Examples](https://www.conventionalcommits.org/en/v1.0.0/#examples)
