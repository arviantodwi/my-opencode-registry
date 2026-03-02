# Use Feature Prefix for Feature Branches

Use the `feature/` prefix for branches that introduce new functionality to your application.

## When to Use

Use this pattern when:
- Adding new features or capabilities
- Implementing user stories or requirements
- Creating new components, modules, or functionality

## Pattern Format

```
feature/<descriptive-name>
```

## Examples

**Good Examples:**
- `feature/user-authentication` - Adding user authentication system
- `feature/dark-mode-toggle` - Adding dark mode functionality
- `feature/api-integration` - Integrating with external API
- `feature/dashboard-widgets` - Creating dashboard widgets

**Bad Examples:**
- `user-auth` (missing prefix)
- `feature-auth` (missing slash)
- `new-feature` (too vague)
- `auth` (too short and missing prefix)

## Why This Matters

- **Clear intent**: Prefix immediately indicates this is a feature branch
- **Easy filtering**: Can filter by `feature/` to see all feature work
- **Team communication**: Consistent naming helps team collaboration
- **Automation friendly**: CI/CD tools can easily identify feature branches

## Integration with Commands

**Note:** The `/gh/pr-create` command generates PR titles from commit messages, not branch names. However, consistent branch naming still helps with organization.

When using `/gh/pr-create`, PR titles are generated from commit messages like:
```
feat: add user authentication
feat: implement dark mode toggle
feat: integrate with external API
```

Branch names are used for organization but do not affect PR title generation. Better commit messages lead to better PR titles.

## Related Rules

- Use `fix/` prefix for bug fixes
- Use `hotfix/` prefix for urgent production fixes
- Use `refactor/` prefix for code refactoring

## Anti-Patterns

- ❌ Don't use `feature/` for bug fixes → use `fix/` instead
- ❌ Don't make feature names too long → keep under 50 characters
- ❌ Don't use spaces or underscores → use hyphens
- ❌ Don't create vague names like `feature/update`

## Best Practices

1. **Be specific**: Use descriptive names that clearly explain the feature
2. **Use kebab-case**: Separate words with hyphens (e.g., `user-authentication`)
3. **Keep it short**: Aim for 20-40 characters total
4. **Avoid jargon**: Use terms familiar to the team
5. **Link to issues**: Consider including issue number if applicable (e.g., `feature/auth-123`)

## Example Workflow

```bash
# Create feature branch
git checkout -b feature/user-authentication

# Make changes
git add .
git commit -m "feat: add OAuth2 authentication support"

# Push and create PR
git push -u origin feature/user-authentication
/gh/pr-create base:main
```

## Additional Resources

- [Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)
- [GitFlow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
