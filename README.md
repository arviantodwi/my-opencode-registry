# My OpenCode Registry

A curated collection of AI skills and commands for software development, integrated with the OpenCode AI assistant.

## Usage

Import these skills and commands in OpenCode to leverage best practices for your development workflow.

### Skills

- **agent-md-refactor**: Refactor bloated AGENTS.md, CLAUDE.md, or similar agent instruction files following progressive disclosure principles
- **changelog-generator**: Automatically creates user-facing changelogs from git commits by analyzing commit history, categorizing changes, and transforming technical commits into clear, customer-friendly release notes.
- **expo-app-design**: Productively build robust apps with Expo. Comprehensive guide covering UI components, navigation, styling, API routes, data fetching, development builds, Tailwind CSS, and web code integration.
- **fastify-best-practices**: Comprehensive best practices for Fastify development
- **git-conventional-commits**: Conventional Commits specification guide for commit messages, changelogs, and semantic versioning
- **next-best-practices**: Next.js best practices - file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling
- **react-best-practices**: Vercel Engineering's comprehensive React performance optimization guidelines (57 rules across 8 categories)
- **react-composition-patterns**: React composition patterns for scaling components, preventing prop proliferation, and building flexible component libraries
- **react-native-best-practices**: React Native best practices for building performant mobile apps. Use when building React Native components, optimizing list performance, implementing animations, or working with native modules.
- **typescript-magician**: TypeScript wizard specializing in advanced type systems, complex generics, and eliminating `any` types

### Commands

- **commit**: Commit staged or unstaged changes using Conventional Commits
- **gh/pr-create**: Create GitHub pull request with generated title and body, automatically analyzing commit history and providing comprehensive PR documentation
- **proceed**: Proceed with execution using the build agent
- **update-context**: Update context for AI agents

## Configuration

The registry includes MCP servers for:

- Context7 (library documentation)
- Figma (design tool)
- Z.AI API (AI services)
- Zod (validation library)

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