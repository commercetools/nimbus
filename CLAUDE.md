<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `./openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big
  performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `./openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## OpenSpec Proposal Guidance

For non-fix changes (new features, breaking changes, architecture shifts),
suggest creating an OpenSpec proposal via `/openspec:proposal` before
implementing. Proceed directly only for bug fixes, typos, config changes, and
tests for existing behavior.

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
pnpm --filter @commercetools/nimbus-i18n build

# Or use the formatjs CLI directly from root
pnpm dlx @formatjs/cli compile-folder --format=transifex --ast packages/i18n/data packages/i18n/compiled-data
```

### Testing

```bash
# Run all tests (both unit and Storybook tests)
pnpm test

# Run only unit tests (JSDOM-based, fast)
pnpm test:unit

# Run only Storybook tests (browser-based, slower)
pnpm test:storybook

# Run specific test file
pnpm test packages/nimbus/src/components/button/button.spec.tsx
pnpm test packages/nimbus/src/components/button/button.stories.tsx

# Run tests with minimal console output
pnpm test --silent

# Run specific test pattern
pnpm test --testNamePattern="Component.*TestName"

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
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
pnpm test packages/nimbus/src/components/button/button.stories.tsx
pnpm test packages/nimbus/src/components/menu/menu.stories.tsx
pnpm test packages/nimbus/src/components/pagination/pagination.stories.tsx
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

### Component Development

For comprehensive component development guidance, see:

- Component Guidelines: `./docs/component-guidelines.md`
- Architecture Decisions:
  `./docs/file-type-guidelines/architecture-decisions.md`
- File Review Protocol: `./docs/file-review-protocol.md`

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

**Use specialized agents proactively in an iterative cycle for all component
development:**

1. **Research Phase** (nimbus-researcher): Gather requirements, patterns,
   library documentation, and architectural guidance before writing any code
2. **Implementation Phase** (nimbus-coder): Write code strictly according to the
   guidelines and patterns identified in research
3. **Review Phase** (nimbus-reviewer): Validate code compliance against Nimbus
   standards and guidelines
4. **Iteration**: If review identifies non-compliance or improvement areas,
   return to implementation phase and repeat until all standards are met

Invoke agents autonomously when task complexity warrants it - don't wait for
explicit user requests. The goal is to leverage automation intelligently by
recognizing when a task's scope or requirements align with an agent's
capabilities.

## Development Workflow Best Practices

### Testing Strategy

The testing system uses Vitest with two distinct test types:

**Component Testing (Storybook stories with play functions):**

- Stories serve as both maintainer documentation AND tests via play functions
- Browser testing runs in headless Chromium with Playwright
- **ALL component behavior, interactions, and visual states are tested in
  Storybook**
- **Critical**: Interactive components MUST have play functions that test user
  interactions

**Unit Testing (utilities and hooks only):**

- Fast JSDOM-based tests for utilities, hooks, and non-component logic
- All component testing happens in Storybook stories with play functions
- Unit tests focus exclusively on pure functions, custom hooks, and business
  logic

### Build Dependencies

Understanding build order is crucial:

1. **Design tokens** (`packages/tokens`) - Must build first
2. **Packages** (`packages/*`) - Depend on tokens
3. **Documentation** (`apps/docs`) - Depends on packages
4. **i18n compilation** - Translation data for runtime
