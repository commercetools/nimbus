# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Nimbus is a comprehensive design system monorepo containing React UI components,
design tokens, icons, and documentation. It uses pnpm workspaces and is built
with TypeScript, React Aria Components, and Chakra UI v3.

**Key Architecture:**

- **Monorepo Structure**: Uses pnpm workspaces with packages and apps
  directories
- **Component Library**: React components with accessibility-first approach
  using React Aria
- **Design System**: Token-driven styling system with Chakra UI v3 recipes
- **Documentation**: Auto-generated docs site and Storybook for component
  development

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

### Component Development Pattern

**File Structure per Component:**

```
component-name/
├── component-name.tsx              # Main component implementation
├── component-name.types.ts         # TypeScript interfaces
├── component-name.slots.tsx        # Slot components (ComponentNameSlot)
├── component-name.recipe.ts        # Chakra UI styling recipes
├── component-name.stories.tsx      # Storybook stories + tests (mandatory)
├── component-name.mdx             # Documentation
├── index.ts                       # Exports
├── components/                    # Compound component parts
└── utils/                         # Component-specific utilities
```

**Key Conventions:**

- Components accept ref as a regular prop (React 19 - no forwardRef needed, ref is part of props)
- Slot components end with 'Slot' suffix (e.g., `ButtonSlot`, `DialogTitleSlot`)
- Props interfaces follow `ComponentNameProps` / `ComponentNameSlotProps`
  patterns
- Recipes must be imported in `packages/nimbus/src/theme/recipes/index.ts` or
  `packages/nimbus/src/theme/slot-recipes/index.ts` (depending on the ocmponent
  type)
- React Aria Components imported with `Ra` prefix (e.g., `RaButton`)
- Components support both controlled and uncontrolled modes when stateful

### Styling System

- **Chakra UI v3** with slot recipes for component styling
- **Design tokens** drive all visual properties
- **Recipe-based** styling with variants and responsive support
- Tokens available in CSS custom properties and TypeScript definitions

### Testing Strategy

- **Vitest** for unit tests configured per package
- **Storybook** stories serve as visual tests and documentation
- **Playwright** for end-to-end testing
- All components require Storybook stories with accessibility testing

## Important Development Notes

### React Aria Integration

- Use React Aria Components for accessibility primitives
- Import with `Ra` prefix to distinguish from custom components
- Forward necessary props to ensure accessibility features work
- usually needs a slot in the recipe & slot-component wrapping the
  implementation (e.g. <MenuTriggerSlot asChild><RaButton/></MenuTriggerSlot>)

### TypeScript Usage

- Strict typing required for all components and functions
- Use named exports whenever possible
- Import types with `import { type FooBar }` annotation
- Interface definitions should include JSDoc documentation

### Documentation

- JSDoc comments required for all components and compound components
- Document props, variants, accessibility features
- Include related patterns and standards references
- MDX files auto-generate documentation site content

### Code Quality Requirements

- All components must have Storybook stories
- ESLint and Prettier configured for consistent formatting
- TypeScript strict mode enabled
- Accessibility compliance is mandatory

## MCP Server Tools

This project includes powerful MCP (Model Context Protocol) servers that enhance development capabilities. Use these tools proactively:

### Available MCP Servers

- **context7**: Essential for finding and understanding documentation. Use `mcp__context7__resolve-library-id` to search for React Aria, Chakra UI, and other library documentation before implementing features.
  
- **playwright**: Browser automation for visual testing and web interaction. Use `mcp__playwright__browser_navigate`, `mcp__playwright__browser_wait_for`, and `mcp__playwright__browser_take_screenshot` to verify UI changes and test user flows.

- **sequential-thinking**: For complex planning and multi-step reasoning. Use `mcp__sequential-thinking__sequentialthinking` when tackling large features or architectural decisions that require careful consideration.

### Usage Guidelines

- **Always** use context7 to find relevant documentation before implementing new components or patterns
- **Proactively** use playwright to visually verify UI changes and capture screenshots for documentation
- **Leverage** sequential-thinking for breaking down complex tasks into manageable steps
- These tools are pre-configured and ready to use - no additional setup required
