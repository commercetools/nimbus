# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Nimbus is a multi-package design system monorepo containing React UI components,
design tokens, icons, and documentation. It uses pnpm workspaces and is built
with TypeScript, React Aria Components, and Chakra UI v3.

**Key Architecture:**

- **Monorepo Structure**: Uses pnpm workspaces with packages and apps
  directories
- **Component Library**: React components with WCAG 2.1 AA compliant
  implementation using React Aria patterns
- **Design System**: Design token-based theming system with Chakra UI v3 recipes
- **Internationalization**: Centralized i18n package with react-intl integration
  and Transifex support
- **Documentation**: JSDoc-extracted API documentation site and Storybook for
  component development

## Development Commands

### Setup and Installation

```bash
# Full initialization (clean install + build + playwright setup)
pnpm nimbus:init

# Reset project (remove node_modules and dist folders)
pnpm nimbus:reset

# Install dependencies only
pnpm install

# Install Playwright browsers (one-time setup)
pnpm playwright:install
```

### Development Server

```bash
# Start both docs site and Storybook
pnpm start

# Start documentation site only (http://localhost:5173)
pnpm start:docs

# Start Storybook only (http://localhost:6006)
pnpm start:storybook
```

### Build Commands

```bash
# Full build (tokens -> packages -> docs)
pnpm build

# Build packages only
pnpm build:packages

# Build documentation site only
pnpm build:docs

# Build/Generate design tokens
pnpm build:tokens
# or
pnpm generate:tokens
```

### Internationalization (i18n)

```bash
# Compile translation files for runtime
cd packages/i18n
pnpm build

# Or from root
pnpm --filter @commercetools-nimbus/i18n build

# Or use the formatjs CLI directly from root
pnpm dlx @formatjs/cli compile-folder --format=transifex --ast packages/i18n/data packages/i18n/compiled-data
```

### Testing

```bash
# Run all tests
pnpm test

# Run Storybook tests (interactive components)
pnpm test:storybook

# Run tests for specific component (from nimbus package)
pnpm --filter @commercetools/nimbus test component-name.stories.tsx --reporter=basic

# Run tests with different reporters
pnpm --filter @commercetools/nimbus test component-name.stories.tsx --reporter=verbose
pnpm --filter @commercetools/nimbus test component-name.stories.tsx --silent

# Run specific test pattern
pnpm --filter @commercetools/nimbus test --testNamePattern="Component.*TestName"
```

### Code Quality

```bash
# Lint all files
pnpm lint

# TypeScript type checking
pnpm typecheck

# Strict type checking (fails on errors)
pnpm typecheck:strict

# Package-specific commands
pnpm --filter @commercetools/nimbus typecheck
pnpm --filter @commercetools/nimbus build
pnpm --filter @commercetools/nimbus-tokens build
```

### Workspace-Specific Development

```bash
# Work with specific packages using --filter
pnpm --filter @commercetools/nimbus [command]
pnpm --filter @commercetools/nimbus-tokens [command]
pnpm --filter @commercetools/nimbus-icons [command]

# Common patterns for nimbus package development
pnpm --filter @commercetools/nimbus build
pnpm --filter @commercetools/nimbus typecheck
pnpm --filter @commercetools/nimbus storybook
pnpm --filter @commercetools/nimbus build-theme-typings

# Run commands for all packages
pnpm -r --filter './packages/*' build
pnpm -r --filter './packages/*' typecheck

# Component-specific testing patterns
pnpm --filter @commercetools/nimbus test button.stories.tsx --reporter=basic
pnpm --filter @commercetools/nimbus test menu.stories.tsx --silent
pnpm --filter @commercetools/nimbus test pagination.stories.tsx --reporter=verbose
```

### Release Management

```bash
# Create a changeset
pnpm changeset

# Version packages and format
pnpm changeset:version-and-format

# Check changeset status
pnpm changeset:status
```

## Code Architecture

### Package Structure

- **packages/nimbus**: Core UI component library with React Aria Components
- **packages/tokens**: Design tokens (colors, spacing, typography, animations)
- **packages/nimbus-icons**: SVG icons wrapped as React components (Material
  Icons + custom)
- **packages/color-tokens**: Brand-specific color definitions
- **packages/i18n**: Translation messages and internationalization support
- **apps/docs**: Documentation SPA with interactive examples and auto-generated
  content

### Component File Structure

For detailed component file organization and structure patterns, see:
@docs/component-guidelines.md

### Component Development Guidelines

**For comprehensive component creation instructions, implementation patterns,
file structure guidelines, and architectural decisions, see:**

- **Documentation Overview** - Main documentation hub and navigation
  @docs/readme.md
- **Component Guidelines** - Main hub for all component development
  @docs/component-guidelines.md
- **Architecture Decisions** - Decision matrix for component design
  @docs/file-type-guidelines/architecture-decisions.md
- **Component Templates** - Ready-to-use boilerplate code
  @docs/component-templates/

**IMPORTANT: All file reviews MUST follow the File Review Protocol below. Never
provide feedback without first validating against the appropriate guidelines.**

### Development Standards

This project follows strict development standards detailed in the documentation:

- **Styling**: Chakra UI v3 with design token-based recipes
  @docs/file-type-guidelines/recipes.md
- **Testing**: Storybook interaction testing required
  @docs/file-type-guidelines/stories.md
- **TypeScript**: Strict typing with comprehensive interfaces
  @docs/file-type-guidelines/types.md
- **Documentation**: JSDoc comments required for all code
  @docs/file-type-guidelines/documentation.md
- **Accessibility**: WCAG 2.1 AA compliance using React Aria
  @docs/file-type-guidelines/architecture-decisions.md
- **Internationalization**: react-intl integration for translatable UI text
  @docs/file-type-guidelines/i18n.md

## File Review Protocol

For comprehensive file review procedures, see @docs/file-review-protocol.md

**Quick Reference:**

1. Identify file type by extension/location
2. Load corresponding guidelines document
3. Run validation checklist systematically
4. Report compliance status before content feedback

### Key Architectural Patterns

For comprehensive architectural patterns, component decision matrices, React Aria integration strategies, and styling system architecture, see:

- **Multi-layered Architecture & React Aria Integration**:
  @docs/file-type-guidelines/architecture-decisions.md
- **Component Structure Patterns**: @docs/component-guidelines.md
- **Styling System Details**: @docs/file-type-guidelines/recipes.md

### Critical Development Rules

For complete development rules, patterns, and requirements, see:

- **Recipe Registration & Styling Rules**: @docs/file-type-guidelines/recipes.md
- **Testing Requirements**: @docs/file-type-guidelines/stories.md
- **Compound Component Patterns**: @docs/file-type-guidelines/compound-components.md
- **Type Safety Guidelines**: @docs/file-type-guidelines/types.md
- **Internationalization**: @docs/file-type-guidelines/i18n.md

**IMPORTANT: All file reviews MUST follow the File Review Protocol. Never
provide feedback without first validating against the appropriate guidelines.**

## MCP Server Tools

This project includes integrated MCP (Model Context Protocol) tooling that
provides automated development workflows. Leverage these tools for automated
tasks:

### Available MCP Servers

- **context7**: Primary interface for querying library documentation for React
  Aria, Chakra UI, and other libraries before implementing features.
- **playwright**: Browser automation for visual testing and web interaction to
  verify UI changes and test user flows.
- **sequential-thinking**: For complex planning and multi-step reasoning when
  tackling large features or architecture design decisions that require
  systematic analysis.

### Usage Guidelines

- **Always** use context7 to find relevant documentation before implementing new
  components or patterns
- **Proactively** use playwright to visually verify UI changes and capture
  screenshots for documentation
- **Leverage** sequential-thinking for breaking down complex tasks into
  manageable steps
- These tools are pre-configured and ready to use - no additional setup required

### Agent-Driven Development Workflow

**Use specialized agents proactively in an iterative cycle for all component development:**

1. **Research Phase** (nimbus-researcher): Gather requirements, patterns, library documentation, and architectural guidance before writing any code
2. **Implementation Phase** (nimbus-coder): Write code strictly according to the guidelines and patterns identified in research
3. **Review Phase** (nimbus-reviewer): Validate code compliance against Nimbus standards and guidelines
4. **Iteration**: If review identifies non-compliance or improvement areas, return to implementation phase and repeat until all standards are met

Invoke agents autonomously when task complexity warrants it - don't wait for explicit user requests. The goal is to leverage automation intelligently by recognizing when a task's scope or requirements align with an agent's capabilities.

## Development Workflow Best Practices

### Testing Strategy

The testing system uses Vitest with Storybook integration and browser-based
testing:

- Stories serve as both documentation AND tests via play functions
- Browser testing runs in headless Chromium with Playwright
- Component tests are story-based, not unit tests
- **Critical**: Interactive components MUST have play functions that test user
  interactions

### Build Dependencies

Understanding build order is crucial:

1. **Design tokens** (`packages/tokens`) - Must build first
2. **Packages** (`packages/*`) - Depend on tokens
3. **Documentation** (`apps/docs`) - Depends on packages
4. **i18n compilation** - Translation data for runtime

### Component Development Workflow

For detailed development workflows, implementation steps, and common pitfalls, see:
@docs/component-guidelines.md
