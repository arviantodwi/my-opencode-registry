# My OpenCode Registry

A curated collection of AI skills and commands for software development, integrated with the OpenCode AI assistant.

## Skills

- **next-best-practices**: Next.js best practices - file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling
- **react-best-practices**: Vercel Engineering's comprehensive React performance optimization guidelines (57 rules across 8 categories)
- **react-composition-patterns**: React composition patterns for scaling components, preventing prop proliferation, and building flexible component libraries
- **typescript-magician**: TypeScript wizard specializing in advanced type systems, complex generics, and eliminating `any` types
- **fastify-best-practices**: Comprehensive best practices for Fastify development
- **git-conventional-commits**: Conventional Commits specification guide for commit messages, changelogs, and semantic versioning
- **agent-md-refactor**: Refactor bloated AGENTS.md, CLAUDE.md, or similar agent instruction files following progressive disclosure principles
- **github-pr-automation**: Best practices for creating pull requests, branch naming conventions, and PR workflow guidelines

## Commands

- **commit**: Commit staged or unstaged changes using Conventional Commits
- **proceed**: Proceed with execution using the build agent
- **update-context**: Update context for AI agents
- **gh/pr-create**: Create GitHub pull request with target branch argument
- **gh/get-branches**: List available branches in repository

## Configuration

The registry includes MCP servers for:
- Zod (validation library)
- Context7 (library documentation)
- Figma (design tool)
- Z.AI API (AI services)

## Usage

Import these skills and commands in OpenCode to leverage best practices for your development workflow.

## GitHub Authentication

To use the GitHub automation commands:

1. **Install GitHub CLI**:
   - macOS: `brew install gh`
   - Windows: `winget install --id GitHub.cli`
   - Linux: See [GitHub CLI documentation](https://cli.github.com/)

2. **Authenticate**:
   ```bash
   # SSH authentication (recommended)
   gh auth login --ssh

   # Or HTTPS authentication
   gh auth login
   ```

3. **Verify authentication**:
   ```bash
   gh auth status
   ```

4. **Create pull requests**:
    ```bash
    # List available branches
    /gh/get-branches

    # Create PR to default branch
    /gh/pr-create

    # Create PR to specific branch
    /gh/pr-create to dev

    # Create PR to specific branch with specific reviewer
    /gh/pr-create to dev as username
    ```
