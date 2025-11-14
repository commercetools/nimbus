# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## RFC 2119 Compliance

**All documentation in this repository (CLAUDE.md files and .md/.mdx files) MUST be interpreted according to [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).**

Key words used in this documentation:
- **MUST** / **REQUIRED** / **SHALL**: Absolute requirement
- **MUST NOT** / **SHALL NOT**: Absolute prohibition
- **SHOULD** / **RECOMMENDED**: May be ignored in particular circumstances, but full implications must be understood
- **SHOULD NOT** / **NOT RECOMMENDED**: May be acceptable in particular circumstances, but full implications must be understood
- **MAY** / **OPTIONAL**: Truly optional, discretionary

## Project Overview

Nimbus is a multi-package design system monorepo containing React UI components, design tokens, icons, and documentation. It uses pnpm workspaces and is built with TypeScript, React Aria Components, and Chakra UI v3.

**Key Architecture:**

- **Monorepo Structure**: Uses pnpm workspaces with packages and apps directories
- **Component Library**: React components with WCAG 2.1 AA compliant implementation using React Aria patterns
- **Design System**: Design token-based theming system with Chakra UI v3 recipes
- **Internationalization**: Centralized i18n package with react-intl integration and Transifex support
- **Documentation**: JSDoc-extracted API documentation site and Storybook for component development

## Package & App-Specific Guidelines

For detailed development guidelines, see the CLAUDE.md file in each package or app:

### Packages

- **[Nimbus Components](packages/nimbus/CLAUDE.md)** - React component library development
  - Component architecture and file structure
  - React Aria integration patterns
  - Storybook development workflow
  - Recipe registration and styling
  - Testing strategy (stories vs unit tests)
  - Cross-chunk imports and build modes

- **[Design Tokens](packages/tokens/CLAUDE.md)** - Token system development
  - Style Dictionary configuration
  - DTCG format and token definitions
  - Figma sync workflow
  - Token generation process

- **[Icons](packages/nimbus-icons/CLAUDE.md)** - Icon generation
  - SVG to React component transformation
  - Adding Material Design icons
  - Custom icon requirements
  - Build process

- **[Internationalization](packages/i18n/CLAUDE.md)** - Translation workflow
  - Message extraction from Nimbus
  - Transifex integration
  - Compilation for runtime
  - Adding new locales

### Apps

- **[Documentation Site](apps/docs/CLAUDE.md)** - Docs app development
  - MDX documentation format
  - Build system integration
  - PropsTable component
  - jsx-live code blocks

### Detailed Technical Documentation

For comprehensive technical guidelines organized by topic:

- **[docs/nimbus/](docs/nimbus/)** - Component development deep dive (32 guideline files)
  - [Component Guidelines](docs/nimbus/component-guidelines.md) - Main navigation hub
  - [File Type Guidelines](docs/nimbus/file-type-guidelines/) - Detailed patterns per file type
  - [Component Templates](docs/nimbus/component-templates/) - Boilerplate code
  - [File Review Protocol](docs/nimbus/file-review-protocol.md) - Review checklist

- **[docs/docs-app/](docs/docs-app/)** - Documentation site patterns
  - [MDX Format](docs/docs-app/mdx-format.md) - Writing component docs
  - [Build System](docs/docs-app/build-system.md) - How MDX processing works
  - [PropsTable](docs/docs-app/props-table.md) - TypeScript prop extraction
  - [jsx-live Blocks](docs/docs-app/jsx-live-blocks.md) - Interactive examples

- **[docs/README.md](docs/README.md)** - Documentation navigation hub

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
# Full build (tokens → packages → docs)
pnpm build

# Build packages only
pnpm build:packages

# Build documentation site only
pnpm build:docs

# Build/Generate design tokens
pnpm build:tokens
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
```

### Workspace-Specific Development

```bash
# Work with specific packages using --filter
pnpm --filter @commercetools/nimbus [command]
pnpm --filter @commercetools/nimbus-tokens [command]
pnpm --filter @commercetools/nimbus-icons [command]
pnpm --filter @commercetools/nimbus-i18n [command]
pnpm --filter docs [command]

# Run commands for all packages
pnpm -r --filter './packages/*' build
pnpm -r --filter './packages/*' typecheck

# Common package-specific patterns
pnpm --filter @commercetools/nimbus build
pnpm --filter @commercetools/nimbus-tokens build
pnpm --filter @commercetools/nimbus-icons build
pnpm --filter @commercetools/nimbus-i18n build
pnpm --filter docs build
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

## Monorepo Architecture

### Package Structure

- **packages/nimbus** - Core UI component library with React Aria Components
- **packages/tokens** - Design tokens (colors, spacing, typography, animations)
- **packages/nimbus-icons** - SVG icons wrapped as React components (Material Icons + custom)
- **packages/color-tokens** - Brand-specific color definitions
- **packages/i18n** - Translation messages and internationalization support
- **packages/nimbus-docs-build** - Documentation build system (MDX parsing, TypeScript extraction)
- **apps/docs** - Documentation SPA with interactive examples and auto-generated content

### Build Dependencies (CRITICAL)

⚠️ **YOU MUST follow this exact build order or builds will fail:**

1. **Design tokens** (`packages/tokens`) - **MUST build FIRST**
   ```bash
   pnpm --filter @commercetools/nimbus-tokens build
   ```
2. **Packages** (`packages/*`) - Depend on tokens
   ```bash
   pnpm build:packages
   ```
3. **Documentation build** (`packages/nimbus-docs-build`) - Extracts data from Nimbus
4. **Documentation app** (`apps/docs`) - Depends on packages and docs-build
   ```bash
   pnpm build:docs
   ```

**Why:** Components depend on tokens for styling. Breaking this order causes build failures.

## Testing Strategy

Vitest with two distinct test types:

### Component Tests (`*.stories.tsx`)
- **Environment:** Browser-based (Chromium + Playwright)
- **Tests:** ALL component behavior via play functions
- ⚠️ **CRITICAL:** Tests run against built bundle (`dist/`), not source
- **Workflow:** MUST build before testing
  ```bash
  pnpm --filter @commercetools/nimbus build && pnpm test:storybook
  ```

### Unit Tests (`*.spec.ts`)
- **Environment:** JSDOM-based (fast, no build required)
- **For:** Utilities and hooks only
- **NOT for components** - use stories instead
- **Workflow:** `pnpm test:unit`

### Development vs Testing Modes
- **Dev** (`pnpm start:storybook`): Uses source with HMR, changes reflect immediately
- **Test** (`pnpm test:storybook`): Uses built bundle, tests production behavior
- Auto-detects via `VITEST_WORKER_ID` environment variable

## MCP Server Tools

MCP (Model Context Protocol) tools are pre-configured and ready to use.

### Available Servers
- **context7** - Query library documentation (React Aria, Chakra UI, etc.)
- **playwright** - Browser automation for visual testing
- **sequential-thinking** - Complex planning and multi-step reasoning

### Usage Guidelines
- You MUST use context7 before implementing new components or patterns
- You SHOULD use playwright to verify UI changes visually
- You MAY use sequential-thinking for breaking down complex tasks

### Agent-Driven Development Workflow

You SHOULD use specialized agents proactively in this cycle:

1. **Research** (nimbus-researcher) - Gather requirements, patterns, library docs before writing code
2. **Implementation** (nimbus-coder) - Write code according to guidelines from research
3. **Review** (nimbus-reviewer) - Validate code compliance against Nimbus standards
4. **Iteration** - If non-compliant, return to implementation and repeat

Invoke agents autonomously when warranted - don't wait for explicit requests.

## Quick Decision Matrix

**Which command do I need?**
- First time setup? → `pnpm nimbus:init`
- Start developing? → `pnpm start` (docs + Storybook)
- Changed component code? → `pnpm --filter @commercetools/nimbus build && pnpm test:storybook`
- Changed tokens? → `pnpm --filter @commercetools/nimbus-tokens build && pnpm build:packages`
- Changed MDX docs? → `pnpm --filter @commercetools/nimbus-docs-build build && pnpm start:docs`
- Build failing? → `pnpm nimbus:reset && pnpm install && pnpm --filter @commercetools/nimbus-tokens build`

## Troubleshooting

### Build Failures
**Symptom:** Build fails with dependency errors

**You MUST:**
1. Verify build order: tokens → packages → docs
2. Try clean install: `pnpm nimbus:reset && pnpm install && pnpm --filter @commercetools/nimbus-tokens build`

### Tests Failing
**Symptom:** Storybook tests fail after changes

**You MUST:** Build first - tests run against `dist/`, not source
```bash
pnpm --filter @commercetools/nimbus build && pnpm test:storybook
```

### HMR Not Working
**Symptom:** Changes not reflecting in Storybook

**You SHOULD:**
1. Ensure using dev mode: `pnpm start:storybook`
2. Verify files are in `src/` directory
3. Restart dev server or clear browser cache

### Package Not Found
**Symptom:** Import errors for Nimbus packages

**You MUST:** Install and build
```bash
pnpm install && pnpm build:packages
```

## Additional Resources

- **[Nimbus Component Development](packages/nimbus/CLAUDE.md)** - Comprehensive component guidelines
- **[Detailed Technical Docs](docs/)** - In-depth development patterns
- **[Root Package README](./README.md)** - Project overview

---

For package-specific development patterns, build processes, and detailed technical guidelines, see the CLAUDE.md file in the respective package or app directory.
