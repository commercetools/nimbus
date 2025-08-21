# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Common Commands

### Development

- `pnpm start` - Start both documentation site and Storybook in parallel
- `pnpm start:docs` - Start only the documentation app (http://localhost:5173/)
- `pnpm start:storybook` - Start only Storybook (http://localhost:6006/)

(Check if the required app is already running before trying to start it.)

### Building

- `pnpm build` - Build all packages and applications (tokens → packages → docs)
- `pnpm build:packages` - Build only packages (not docs)
- `pnpm build:docs` - Build only documentation application
- `pnpm build:tokens` - Build only design tokens

### Testing and Quality

- `pnpm test` - Run all tests via Vitest
- `pnpm test:storybook` - Run Storybook-specific tests
- `pnpm lint` - Run ESLint across the codebase

### Project Management

- `pnpm nimbus:init` - Full reset, reinstall, and rebuild (recommended after
  branch switches)
- `pnpm nimbus:reset` - Remove all node_modules and dist folders
- `pnpm generate:tokens` - Process and generate design tokens

### Package-specific Commands

Run these with `pnpm --filter @commercetools/nimbus [command]`:

- `build` - Build the component library
- `dev` - Watch mode for development
- `storybook` - Start Storybook
- `test` - Run component tests

## Repository Architecture

This is a monorepo containing a design system with multiple packages:

### Core Structure

```
/packages/
├── nimbus/              # Main UI component library (@commercetools/nimbus)
├── nimbus-icons/        # Icon library (@commercetools/nimbus-icons)
├── tokens/              # Design tokens (@commercetools/nimbus-tokens)
└── color-tokens/        # Brand-specific color definitions

/apps/
└── docs/               # Documentation site (React SPA)
```

### Component Library (`packages/nimbus/`)

- **Components**: React components with accessibility built-in
- **Built on**: React Aria Components + Chakra UI v3 styling system
- **Architecture**: Single-element- or compound-components (depends)
- **TypeScript**: Strict typing with exported prop interfaces

### Component Structure Pattern

Each component follows this consistent structure:

```
component-name/
├── component-name.tsx           # Main implementation or compound export
├── component-name.types.ts      # TypeScript interfaces
├── component-name.slots.tsx     # Slot-based styled components
├── component-name.recipe.ts     # Chakra UI styling recipes
├── component-name.stories.tsx   # Storybook stories + tests
├── component-name.mdx          # Documentation
├── components/                 # Compound component parts
└── index.ts                   # Exports
```

### Design System Approach

- **Accessibility**: React Aria Components provide ARIA semantics and keyboard
  navigation
- **Theming**: Chakra UI v3 with slot recipes for component styling
- **Tokens**: Design tokens for colors, spacing, typography, animation
- **Compound Components**: Many components use the compound pattern with shared
  context
- **Controlled/Uncontrolled**: Components support both modes where applicable

### Key Dependencies

- React Aria Components for accessibility primitives
- Chakra UI v3 for styling system
- Storybook for component development and testing
- Vitest for testing
- TypeScript for type safety

### Development Workflow

1. Scaffold the descibed component structure
2. Components must include Storybook stories (mandatory)
3. If possible, component should forward the ref
4. Recipes must be registered in theme files
5. Document the usage in the corresponding mdx-file

### Testing Strategy

- Unit tests written as part of Storybook stories
- Accessibility testing included in component stories
- Visual testing via Storybook
- All variants and states should be tested

### Build Pipeline

The build process follows this order:

1. **Tokens** → Design tokens are processed first
2. **Packages** → Component library and icons are built
3. **Documentation** → Docs site uses built packages

This dependency order is critical - always build tokens before packages, and
packages before docs.
