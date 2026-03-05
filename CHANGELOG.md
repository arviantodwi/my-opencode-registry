# Changelog

All notable changes to this project will be documented in this file.

## [Released] - March 5, 2026

### 📝 Documentation
- Updated GitHub commands documentation to v1.0.1

## [Released] - March 4, 2026

### ✨ New Features
- **GitHub PR Automation**: Automated pull request title and body generation with comprehensive best practices skill for branch naming, conventions, and workflow guidelines
- **React Native Support**: Added specialized skill for React Native performance optimization, mobile app patterns, and best practices

### 🔧 Improvements
- Updated to use Gemini 1.5-flash-8b for smaller, more efficient model operations
- Added .env to AI ignore list for better security

### 🐛 Fixes
- Fixed Expo app design skill configuration and structure

## [Released] - March 2, 2026

### 🔧 Improvements
- Added default agent and watcher configuration to opencode.json for streamlined setup

## [Released] - March 1, 2026

### ✨ New Features
- **Smart Commits**: New `/commit` command that creates git commits using Conventional Commits specification with automatic message formatting
- **Git Conventional Commits**: Added comprehensive skill for following commit message conventions and best practices
- **Agent Documentation Refactor**: New skill for restructuring monolithic agent instruction files into organized, linked documentation
- **Framework Skills**: Added comprehensive best practices for Fastify, React, Next.js, and TypeScript

### 🧹 Internal
- Removed macOS system files (.DS_Store) from repository

## [Released] - February 28, 2026

### 🔧 Improvements
- Improved secret handling using environment variables
- Updated opencode configuration
- Promoted fix-grammar command into agent system

### 🐛 Fixes
- Corrected multiple agent location path issues for proper skill loading

### 🧹 Internal
- Removed standalone `/fix-grammar` command

## [Released] - February 25, 2026

### ✨ New Features
- **Context Management**: New `/update-context` command for dynamically managing AI context during sessions

## [Released] - February 23, 2026

### ✨ New Features
- **Workflow Continuation**: New `/proceed` command to resume and continue interrupted tasks

## [Released] - February 22, 2026

### 📝 Documentation
- Added comprehensive README with complete skills and commands overview

### 🧹 Internal
- Initial project setup and configuration