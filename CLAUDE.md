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

### Testing

```bash
# Run all tests
pnpm test

# Run Storybook tests
pnpm test:storybook
```

### Code Quality

```bash
# Lint all files
pnpm lint
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
- **apps/docs**: Documentation SPA with interactive examples and auto-generated
  content

### Component Development Guidelines

**For comprehensive component creation instructions, implementation patterns,
file structure guidelines, and architectural decisions, see:**

- **[Documentation Overview](./docs/readme.md)** - Main documentation hub and
  navigation
- **[Component Guidelines](./docs/component-guidelines.md)** - Main hub for all
  component development
- **[Architecture Decisions](./docs/file-type-guidelines/architecture-decisions.md)** -
  Decision matrix for component design
- **[Component Templates](./docs/component-templates/)** - Ready-to-use
  boilerplate code

**IMPORTANT: All file reviews MUST follow the File Review Protocol below. Never
provide feedback without first validating against the appropriate guidelines.**

### Development Standards

This project follows strict development standards detailed in the documentation:

- **Styling**: Chakra UI v3 with design token-based recipes - see
  [Recipes Guide](./docs/file-type-guidelines/recipes.md)
- **Testing**: Storybook interaction testing required - see
  [Stories Guide](./docs/file-type-guidelines/stories.md)
- **TypeScript**: Strict typing with comprehensive interfaces - see
  [Types Guide](./docs/file-type-guidelines/types.md)
- **Documentation**: JSDoc comments required for all code - see
  [Documentation Guide](./docs/file-type-guidelines/documentation.md)
- **Accessibility**: WCAG 2.1 AA compliance using React Aria - see
  [Architecture Decisions](./docs/file-type-guidelines/architecture-decisions.md)

## File Review Protocol

For comprehensive file review procedures, see @docs/file-review-protocol.md

**Quick Reference:**
1. Identify file type by extension/location
2. Load corresponding guidelines document
3. Run validation checklist systematically  
4. Report compliance status before content feedback

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
- proactively use available agents
