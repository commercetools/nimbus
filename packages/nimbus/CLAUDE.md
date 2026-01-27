# Nimbus Component Library

## Package Overview

The `@commercetools/nimbus` package is the core component library providing:

- WCAG 2.1 AA compliant React components
- React Aria Components integration for accessibility
- Chakra UI v3 styling system with design tokens
- Comprehensive Storybook documentation and testing
- Internationalization support via @internationalized/string

## Development Commands

### Building

```bash
# Build with theme typings generation
pnpm --filter @commercetools/nimbus build

# Watch mode for development
pnpm --filter @commercetools/nimbus dev

# Generate Chakra theme typings
pnpm --filter @commercetools/nimbus build-theme-typings
```

### Testing

```bash
# Run all tests for this package
pnpm --filter @commercetools/nimbus test

# Run specific component tests
pnpm test packages/nimbus/src/components/button/button.stories.tsx
pnpm test packages/nimbus/src/components/button/button.spec.tsx

# Run tests in watch mode
pnpm test --watch

# Run with coverage
pnpm test --coverage
```

### Storybook

```bash
# Start Storybook development server
pnpm --filter @commercetools/nimbus storybook

# Build Storybook
pnpm --filter @commercetools/nimbus build-storybook
```

### Type Checking

```bash
# Type check this package
pnpm --filter @commercetools/nimbus typecheck

# Strict type checking
pnpm --filter @commercetools/nimbus typecheck:strict
```

## Component Development Guidelines

### Component File Structure

For detailed component file organization and structure patterns, see:
`./docs/component-guidelines.md` (from repo root)

### Implementation Patterns

**For comprehensive component creation instructions, implementation patterns,
file structure guidelines, and architectural decisions, see:**

- **Documentation Overview**: `./docs/readme.md`
- **Component Guidelines**: `./docs/component-guidelines.md`
- **Architecture Decisions**:
  `./docs/file-type-guidelines/architecture-decisions.md`
- **Component Templates**: `./docs/component-templates/`

**IMPORTANT: All file reviews MUST follow the File Review Protocol. Never
provide feedback without first validating against the appropriate guidelines.**

### Development Standards

This project follows strict development standards detailed in the documentation:

- **Styling**: Chakra UI v3 with design token-based recipes
  `./docs/file-type-guidelines/recipes.md`
- **Testing**:
  - Storybook interaction tests (browser-based, required for interactive
    components) `./docs/file-type-guidelines/stories.md`
  - Unit tests (JSDOM-based, fast isolated tests)
    `./docs/file-type-guidelines/unit-testing.md`
- **TypeScript**: Strict typing with comprehensive interfaces
  `./docs/file-type-guidelines/types.md`
- **Documentation**: JSDoc comments required for all code
  `./docs/file-type-guidelines/documentation.md`
- **Accessibility**: WCAG 2.1 AA compliance using React Aria
  `./docs/file-type-guidelines/architecture-decisions.md`
- **Internationalization**: @internationalized/string integration for
  translatable UI text `./docs/file-type-guidelines/i18n.md`

### File Review Protocol

For comprehensive file review procedures, see `./docs/file-review-protocol.md`

**Quick Reference:**

1. Identify file type by extension/location
2. Load corresponding guidelines document
3. Run validation checklist systematically
4. Report compliance status before content feedback

### Key Architectural Patterns

For comprehensive architectural patterns, component decision matrices, React
Aria integration strategies, and styling system architecture, see:

- **Multi-layered Architecture & React Aria Integration**:
  `./docs/file-type-guidelines/architecture-decisions.md`
- **Component Structure Patterns**: `./docs/component-guidelines.md`
- **Styling System Details**: `./docs/file-type-guidelines/recipes.md`

### Critical Development Rules

For complete development rules, patterns, and requirements, see:

- **Recipe Registration & Styling Rules**:
  `./docs/file-type-guidelines/recipes.md`
- **Testing Requirements**: `./docs/file-type-guidelines/stories.md`
- **Compound Component Patterns**:
  `./docs/file-type-guidelines/compound-components.md`
- **Type Safety Guidelines**: `./docs/file-type-guidelines/types.md`
- **Internationalization**: `./docs/file-type-guidelines/i18n.md`
- **Cross-Chunk Imports (CRITICAL)**: When importing components or types across
  different component directories, import directly from implementation files
  (e.g., `button.tsx`, `button.types.ts`) rather than barrel exports
  (`index.ts`) to avoid circular chunk dependencies. See
  `./docs/file-type-guidelines/main-component.md` "Cross-Component Imports" for
  details.

**IMPORTANT: All file reviews MUST follow the File Review Protocol. Never
provide feedback without first validating against the appropriate guidelines.**

## Testing Strategy & Workflow

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

### Testing Workflow

**CRITICAL: Storybook tests run against the built bundle, NOT source files.**

#### Development vs Testing Mode

The Storybook configuration has two distinct modes:

- **Development mode** (`pnpm start:storybook`): Uses source alias for HMR
  - Alias: `@commercetools/nimbus` → `packages/nimbus/src`
  - Enables instant feedback while editing components
  - Changes reflect immediately without rebuilding

- **Testing mode** (`pnpm test:storybook`): Uses built bundle
  - Alias: None - imports from `packages/nimbus/dist`
  - Tests run against production-like code
  - Ensures tests validate actual published behavior

#### Testing Your Changes

To test component changes in Storybook tests, follow this workflow:

```bash
# 1. Make your changes to component source files
# 2. Build the package to update the dist folder
pnpm --filter @commercetools/nimbus build

# 3. Run Storybook tests
pnpm test:storybook

# Or run specific test file
pnpm test packages/nimbus/src/components/button/button.stories.tsx
```

**Why build is required:**

- Tests import from `@commercetools/nimbus` which resolves to `dist/` during
  testing
- Without building, tests run against stale code from previous build
- This matches how consumers use the package (from `node_modules`)

#### Detection Logic

The system detects test mode via environment variables:

- **`VITEST_WORKER_ID`**: Automatically set by Vitest when running tests
- **`VITEST=true`**: Manual override for forcing test mode

**Manual Override Example:**

```bash
# Force test mode (use built bundle) even in development
VITEST=true pnpm start:storybook

# Normal development mode (use source files with HMR)
pnpm start:storybook
```

#### Developer Visibility

Storybook logs which mode is active on startup:

- `[Storybook] Running in DEVELOPMENT (HMR enabled, using source files)` -
  Development mode with live reload
- `[Storybook] Running in PRODUCTION/TEST (using built bundle)` - Testing or
  production mode

This helps confirm whether your changes require a build before testing.

#### Common Pitfalls

- ❌ **Making changes and immediately running tests** - Tests will use old code
- ❌ **Expecting HMR in test mode** - Tests intentionally use built bundle
- ✅ **Build first, then test** - Ensures tests validate actual changes
- ✅ **Use `pnpm start:storybook` for rapid iteration** - Live preview with HMR

## Package Architecture

### Directory Structure

```
packages/nimbus/
├── src/
│   ├── components/          # All React components
│   │   ├── button/
│   │   │   ├── button.tsx           # Main component
│   │   │   ├── button.types.ts      # TypeScript types
│   │   │   ├── button.stories.tsx   # Storybook stories + tests
│   │   │   ├── button.spec.tsx      # Unit tests (if needed)
│   │   │   ├── button.recipe.ts     # Chakra UI recipe
│   │   │   ├── button.i18n.ts       # i18n messages
│   │   │   ├── button.mdx           # Documentation
│   │   │   └── index.ts             # Barrel export
│   │   └── ...
│   ├── theme/               # Chakra UI theme configuration
│   │   ├── recipes/         # Recipe registrations
│   │   └── index.ts         # Theme assembly
│   ├── utils/               # Shared utility functions
│   ├── hooks/               # Shared React hooks
│   └── constants/           # Shared constants
├── dist/                    # Build output
└── package.json
```

### Dependencies

This package depends on:

- `@commercetools/nimbus-tokens` - Design tokens (must build first)
- `@commercetools/nimbus-icons` - Icon components
- `@commercetools/nimbus-i18n` - Translation messages

### Component Registration

When adding a new component:

1. Create component directory in `src/components/`
2. Implement all required files (see component templates)
3. Register recipe in `src/theme/recipes/index.ts`
4. Export component from `src/index.ts`
5. Add Storybook stories with play functions
6. Document in `.mdx` file

### Recipe Registration

All components using Chakra UI styling must register their recipes:

```typescript
// src/theme/recipes/index.ts
import { buttonRecipe } from "../components/button/button.recipe";

export const recipes = {
  button: buttonRecipe,
  // Add new component recipes here
};
```

## Detailed Documentation

For comprehensive guidelines, see:

- Component Guidelines: `./docs/component-guidelines.md` (from repo root)
- Architecture Decisions:
  `./docs/file-type-guidelines/architecture-decisions.md`
- All File Type Guidelines: `./docs/file-type-guidelines/`
- Component Templates: `./docs/component-templates/`
