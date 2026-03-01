---
name: git-conventional-commits
description: >-
  Comprehensive guide to Conventional Commits specification. Use when writing git
  commit messages, generating changelogs, determining semantic version bumps, or
  implementing commit linting/validation.
metadata:
  tags: git, versioning, changelog, semver, commit-messages, ci/cd
  version: "1.0.0"
---

# Git Conventional Commits

A specification for adding human and machine readable meaning to commit messages.
This guide helps you write structured commit messages that enable automated
changelog generation, semantic versioning, and better project communication.

## When to Apply

Reference these guidelines when:

- Writing git commit messages in any project
- Contributing to projects that use Conventional Commits
- Generating changelogs automatically
- Determining semantic version bumps (MAJOR, MINOR, PATCH)
- Implementing commit linting/validation tools
- Setting up CI/CD pipelines that respond to commit types

## Core Principles

The commit message structure:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Key Elements:**

1. **Type** - Required noun indicating the nature of the change
2. **Scope** - Optional noun in parentheses providing context
3. **Description** - Required short summary of changes
4. **Body** - Optional detailed explanation of changes
5. **Footer(s)** - Optional metadata (BREAKING CHANGE, Refs, etc.)

## Rule Categories by Priority

| Priority | Category         | Impact | Prefix       |
| -------- | ---------------- | ------ | ------------ |
| 1        | Core Types       | HIGH   | `core-`      |
| 2        | Breaking Changes | HIGH   | `breaking-`  |
| 3        | Extended Types   | MEDIUM | `extended-`  |
| 4        | Format           | MEDIUM | `format-`    |
| 5        | Footers          | MEDIUM | `footers-`   |
| 6        | Advanced         | LOW    | `advanced-`  |

## Quick Reference

### 1. Core Types (HIGH)

- `core-feat-type` - Use `feat:` for new features (MINOR version)
- `core-fix-type` - Use `fix:` for bug fixes (PATCH version)

### 2. Breaking Changes (HIGH)

- `breaking-exclamation` - Use `!` after type/scope to indicate breaking change
- `breaking-footer` - Use `BREAKING CHANGE:` footer for detailed explanation
- `breaking-major` - Breaking changes trigger MAJOR version

### 3. Extended Types (MEDIUM)

- `extended-docs-type` - `docs:` for documentation only
- `extended-style-type` - `style:` for code style/formatting
- `extended-refactor-type` - `refactor:` for code refactoring
- `extended-perf-type` - `perf:` for performance improvements
- `extended-test-type` - `test:` for adding or updating tests
- `extended-build-type` - `build:` for build system/dependencies
- `extended-ci-type` - `ci:` for CI configuration
- `extended-chore-type` - `chore:` for maintenance tasks

### 4. Format (MEDIUM)

- `format-scope` - Use scope in parentheses for context: `feat(api):`
- `format-description` - Use lowercase, imperative mood, no period at end
- `format-body` - Use blank line between description and body
- `format-body-multiline` - Use multiple paragraphs separated by blank lines

### 5. Footers (MEDIUM)

- `footers-breaking-change` - `BREAKING CHANGE:` footer format
- `footers-references` - `Refs:`, `Closes:`, `Fixes:` for issue tracking
- `footers-coauthoring` - `Co-authored-by:`, `Reviewed-by:`, `Acked-by:`

### 6. Advanced (LOW)

- `advanced-revert` - `revert:` type for reverting commits
- `advanced-custom-types` - Define custom types for your project
- `advanced-semver-mapping` - Type to semantic version mapping
- `advanced-case-sensitivity` - Case sensitivity rules (BREAKING CHANGE must be uppercase)

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/core-feat-type.md
rules/core-fix-type.md
rules/breaking-exclamation.md
rules/breaking-footer.md
rules/extended-docs-type.md
rules/extended-style-type.md
rules/extended-refactor-type.md
rules/extended-perf-type.md
rules/extended-test-type.md
rules/extended-build-type.md
rules/extended-ci-type.md
rules/extended-chore-type.md
rules/format-scope.md
rules/format-description.md
rules/format-body.md
rules/format-body-multiline.md
rules/footers-breaking-change.md
rules/footers-references.md
rules/footers-coauthoring.md
rules/advanced-revert.md
rules/advanced-custom-types.md
rules/advanced-semver-mapping.md
rules/advanced-case-sensitivity.md
```

Each rule file contains:

- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## SemVer Correlation

| Commit Type                     | Version Bump |
| -------------------------------- | ------------ |
| `feat:`                          | MINOR        |
| `fix:`                           | PATCH        |
| Any type with `!` or BREAKING CHANGE | MAJOR        |

## Benefits

- **Automated CHANGELOG generation** - Tools can parse commit history
- **Semantic versioning** - Automatically determine version bumps
- **Clear communication** - Convey change nature to team and stakeholders
- **CI/CD integration** - Trigger builds/publishes based on commit types
- **Easier contributions** - Structured history helps contributors explore codebase
