# Use coauthoring footers for multi-author commits

Use footers like `Co-authored-by:`, `Reviewed-by:`, and `Acked-by:` to credit
multiple contributors. These follow git trailer format conventions.

## Incorrect

```git
feat: add user authentication

Co-authored-by John Doe <john@example.com>
```

Missing colon after the token.

```git
feat: add user authentication

Co-authored by: John Doe <john@example.com>
```

Incorrect token - should be `Co-authored-by:` with hyphen.

```git
feat: add user authentication

Co-authored-by: John Doe
```

Missing email address.

```git
feat: add user authentication

Co-authored-by: John Doe <john@example.com> Jane Smith <jane@example.com>
```

Multiple authors should be in separate footers.

## Correct

```git
feat: add user authentication

Co-authored-by: John Doe <john@example.com>
```

Single co-author with proper format.

```git
feat: add user authentication

Co-authored-by: John Doe <john@example.com>
Co-authored-by: Jane Smith <jane@example.com>
```

Multiple co-authors, each in their own footer.

```git
feat: add user authentication

Co-authored-by: John Doe <john@example.com>
Reviewed-by: Jane Smith <jane@example.com>
```

Co-author and reviewer credits.

```git
feat: add user authentication

Co-authored-by: John Doe <john@example.com>
Reviewed-by: Jane Smith <jane@example.com>
Acked-by: Bob Johnson <bob@example.com>

Refs: #123
```

Multiple coauthoring footers with references.

## Why It Matters

- Properly credits all contributors to a change
- Provides traceability for code reviews and approvals
- Recognizes collaborative effort
- Supports automated attribution and reporting

## Additional Context

Coauthoring footer tokens:
- `Co-authored-by:` - Credits co-authors who contributed to the commit
- `Reviewed-by:` - Credits reviewers who reviewed the change
- `Acked-by:` - Credits maintainers who acknowledged the change
- `Tested-by:` - Credits testers who verified the change

Format requirements:
- Token followed by `:` and space
- Format: `Name <email>`
- Name should be the contributor's full name or GitHub username
- Email should be the email associated with the contributor
- Each author/reviewer in their own footer
- Footers separated by blank lines

**When to use each token:**
- `Co-authored-by:` - When multiple people wrote the code together
- `Reviewed-by:` - When someone formally reviewed the PR/commit
- `Acked-by:` - When a maintainer acknowledged/approved the change
- `Tested-by:` - When someone tested the change before merge

**GitHub Integration:**
- GitHub automatically recognizes `Co-authored-by:` footers
- Shows multiple authors in commit UI
- Each co-author gets credit in contribution graphs
- Use the exact GitHub email for proper attribution

**Finding GitHub email:**
```bash
# For your own email
git config user.email

# Or check on GitHub: Profile → Emails
```

## References

- [Git Trailers](https://git-scm.com/docs/git-interpret-trailers)
- [GitHub - Creating a commit with multiple authors](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors)
- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
