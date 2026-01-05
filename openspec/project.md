# Project Context

## Purpose

Nimbus is a comprehensive design system providing React UI components, design tokens, icons, and documentation for building accessible, consistent user interfaces. The system prioritizes:

- **Accessibility**: WCAG 2.1 AA compliance using React Aria patterns
- **Consistency**: Token-based theming and standardized component APIs
- **Developer Experience**: TypeScript-first with comprehensive documentation
- **Internationalization**: Built-in i18n support with react-intl and Transifex integration
- **Flexibility**: Compound component patterns for complex, composable UIs

## Tech Stack

### Core Technologies
- **TypeScript**: Strict type checking for all code
- **React 18+**: Modern React with hooks and concurrent features
- **React Aria Components**: Accessibility primitives and interaction patterns
- **Chakra UI v3**: Styling system with recipes and design tokens
- **Vite**: Build tool and development server
- **pnpm**: Workspace package manager

### Development & Testing
- **Storybook 8**: Component development and visual testing
- **Vitest**: Unit testing and browser-based story tests with Playwright
- **react-testing-library**: Component testing utilities
- **Playwright**: Browser automation for Storybook tests

### Internationalization
- **react-intl**: Message formatting and localization
- **@formatjs/cli**: Translation file compilation
- **Transifex**: Professional translation management

### Documentation
- **Vite + React**: Documentation site (apps/docs)
- **react-docgen-typescript**: Automated API documentation extraction
- **MDX**: Component documentation with live examples

### Monorepo Structure

#### Workspace Configuration
- **pnpm workspaces**: Multi-package management with isolated node_modules
- **@changesets/cli**: Version management and changelog generation
- **Turborepo patterns**: Build orchestration and caching

#### Package Architecture

**Core Packages** (`packages/`)
- **@commercetools/nimbus**: Main UI component library
  - React components with React Aria integration
  - Chakra UI v3 recipes for styling
  - TypeScript with comprehensive type definitions
  - Exports: Components, hooks, utilities, types

- **@commercetools/nimbus-tokens**: Design token system
  - Semantic colors, spacing, typography, shadows, radii
  - Brand-specific color definitions
  - Foundation for all component styling
  - Consumed by: nimbus, docs

- **@commercetools/nimbus-icons**: Icon library
  - SVG icons wrapped as React components
  - Material Icons + custom commercetools icons
  - Optimized for tree-shaking
  - Consumed by: nimbus, docs

- **@commercetools/color-tokens**: Brand color definitions
  - ctviolet, ctteal, ctyellow palettes
  - Extends base token system
  - Consumed by: nimbus-tokens

- **@commercetools/nimbus-i18n**: Internationalization
  - Centralized translation messages
  - react-intl integration
  - Transifex sync support
  - Consumed by: nimbus, docs

**Applications** (`apps/`)
- **docs**: Documentation SPA
  - Component API documentation (auto-generated from TypeScript)
  - Interactive examples with jsx-live
  - Engineering guides and usage patterns
  - Vite + React application

#### Build Dependencies & Order

The monorepo has critical build order requirements:

```
1. @commercetools/color-tokens (foundational colors)
   ↓
2. @commercetools/nimbus-tokens (depends on color-tokens)
   ↓
3. @commercetools/nimbus (depends on tokens)
   @commercetools/nimbus-icons (independent)
   @commercetools/nimbus-i18n (independent)
   ↓
4. apps/docs (depends on all packages)
```

**Key Dependency Rules:**
- **Design tokens MUST build first**: Components import compiled token artifacts
- **Package isolation**: Each package has independent TypeScript config and build output
- **Storybook testing**: Tests run against built bundle (`dist/`), not source files
- **Documentation generation**: Requires built packages for API extraction
- **i18n compilation**: Translation data must be compiled before runtime use

#### Cross-Package Imports

**Internal Package Imports:**
- Use package name: `import { Button } from '@commercetools/nimbus'`
- Never use relative paths between packages
- All packages properly configured in workspace tsconfig

**Within Nimbus Package:**
- **Same component**: Relative imports (`./button.slots`)
- **Cross-component**: Direct file imports (`@/components/icon/icon.tsx`)
- **CRITICAL**: Never import from barrel exports (`index.ts`) across components to avoid circular chunk dependencies
- **Utilities/Hooks**: Barrel exports allowed (`@/utils`, `@/hooks`)

#### Workspace Scripts

Build orchestration follows dependency order:
- `pnpm build`: Builds tokens → packages → docs (sequential)
- `pnpm build:packages`: All packages in dependency order
- `pnpm build:tokens`: Design token generation only
- `pnpm --filter <package>`: Target specific package

Testing is workspace-aware:
- `pnpm test`: Runs all tests across workspace
- `pnpm test:unit`: Fast JSDOM-based tests
- `pnpm test:storybook`: Browser-based component tests (requires build first)

## Project Conventions

### Code Style

#### Naming Conventions
- **Files**: kebab-case (`button.tsx`, `menu.types.ts`)
- **Components**: PascalCase (`Button`, `MenuRoot`)
- **Props Types**: `{ComponentName}Props` (`ButtonProps`, `MenuRootProps`)
- **Recipe Props**: `{Component}RecipeProps` (`ButtonRecipeProps`)
- **Slot Props**: `{Component}RootSlotProps`, `{Component}{Part}SlotProps`
- **React Aria imports**: Always prefix with `Ra` (`import { Button as RaButton }`)
- **Hooks**: `use{Functionality}` (`useButton`, `usePagination`)
- **i18n messages**: `Nimbus.{Component}.{messageKey}` (`Nimbus.Alert.dismiss`)

#### File Extensions
- `.ts` - Pure TypeScript (types, utilities, constants)
- `.tsx` - TypeScript with JSX (components, stories)
- `.mdx` - Markdown with JSX (documentation)

#### Import Patterns
- **Relative imports**: Within same component (`./button.slots`)
- **Direct file imports**: Across components (`@/components/icon/icon.tsx`, NOT `@/components/icon`)
- **Barrel exports**: For utilities (`@/utils`, `@/hooks`)

**CRITICAL**: Never import from barrel exports (`index.ts`) when importing across component directories to avoid circular chunk dependencies.

### Architecture Patterns

#### Component Tiers
1. **Tier 1 - Simple**: Single component, basic recipe (Button, Badge)
2. **Tier 2 - Slot-Based**: Multiple slots, React Aria integration (TextInput, NumberInput)
3. **Tier 3 - Compound**: Multiple coordinated parts with `.Root` (Menu, Dialog, Tabs)
4. **Tier 4 - Complex**: All of above plus generics, context, helpers (DataTable, DatePicker)

#### Four-Layer Type Architecture
Every component type follows this pattern:
1. **Recipe Props**: Styling variants from Chakra recipes
2. **Slot Props**: HTMLChakraProps with recipe props
3. **Helper Types**: Conflict resolution and utility types (Tier 3/4 only)
4. **Main Props**: Public API with comprehensive JSDoc

#### Compound Component Pattern
```typescript
export const Component = {
  Root: ComponentRoot,     // MUST be first - provides configuration
  Trigger: ComponentTrigger,
  Content: ComponentContent,
  Item: ComponentItem,
};
```

#### Prop Handling Pattern (Sequential)
1. **Root components**: Split recipe variants → Extract style props → Forward both
2. **Sub-components**: Extract style props → Forward to slots
3. Always use `extractStyleProps` utility
4. Forward style props to slot components, functional props to React Aria

#### Recipe Registration
- **Standard recipes**: `packages/nimbus/src/theme/recipes/index.ts`
- **Slot recipes**: `packages/nimbus/src/theme/slot-recipes/index.ts`
- **CRITICAL**: No automated validation - missing registration = no styles

### Testing Strategy

#### Two Test Types
1. **Storybook Stories with Play Functions** (Browser-based)
   - ALL component behavior, interactions, and visual states
   - Required for ALL interactive components
   - Runs in headless Chromium via Playwright
   - Tests against built bundle (`dist/`), NOT source

2. **Unit Tests** (JSDOM-based)
   - Utilities, hooks, and pure functions ONLY
   - Fast, isolated tests
   - No component testing in unit tests

#### Testing Workflow
```bash
# Development: Edit components with HMR
pnpm start:storybook

# Testing: Build first, then test
pnpm --filter @commercetools/nimbus build
pnpm test:storybook

# Unit tests (no build required)
pnpm test:unit
```

#### Test Requirements
- Interactive components MUST have play functions testing user interactions
- Use `userEvent` for interactions, `within` for queries
- Use `waitFor` for async assertions
- Test keyboard navigation, focus management, and accessibility
- Query by accessible attributes (roles, labels), NOT test IDs

### Git Workflow

#### Branching Strategy
- **main**: Primary development branch
- **Feature branches**: Created from main
- **PR target**: main

#### Commit Guidelines
- Use descriptive commit messages
- Focus on "why" rather than "what"
- Follow repository's commit style (see `git log` for patterns)

#### Changesets
```bash
# Create a changeset for your changes
pnpm changeset

# Version and format (maintainers only)
pnpm changeset:version-and-format
```

#### Release Process
- Changesets track version bumps and generate changelogs
- CI/CD handles publishing
- Semantic versioning (major.minor.patch)

## Domain Context

### Design System Principles
- **Accessibility First**: All components meet WCAG 2.1 AA standards
- **Composition Over Configuration**: Prefer flexible compound components
- **Token-Based Design**: All styling uses design tokens (no hardcoded values)
- **Progressive Enhancement**: Support both controlled and uncontrolled patterns
- **Internationalization**: All user-facing text is translatable

### Component Development Philosophy
- **Avoid Over-Engineering**: Only build what's needed for current requirements
- **No Premature Abstraction**: Three instances before creating a helper
- **Accessibility Non-Negotiable**: React Aria integration when needed
- **Documentation is Code**: Stories serve as both docs and tests
- **Type Safety**: Comprehensive TypeScript with no `any` types

### Design Token System
- **Semantic Colors**: `primary`, `neutral`, `info`, `positive`, `warning`, `critical`
- **Brand Colors**: `ctviolet`, `ctteal`, `ctyellow`
- **System Colors**: 25 color scales (red, blue, green, etc.)
- **Spacing**: 100, 200, 300, 400, 500, 600 (incremental scale)
- **Typography**: Font sizes, weights, and line heights
- **Radii**: Border radius tokens (50-600, full)
- **Shadows**: Elevation system (1-6)

### Accessibility Requirements
- Keyboard navigation for all interactive elements
- Proper ARIA attributes via React Aria
- Focus management and trap patterns
- Screen reader announcements
- Color contrast compliance (WCAG AA)
- Touch target sizes (44x44px minimum)

## Important Constraints

### Technical Constraints
1. **Recipe Registration Required**: All recipes must be manually registered in theme config
2. **No Storybook in MDX**: Documentation must use `jsx-live` blocks, not Storybook imports
3. **Build Before Testing**: Storybook tests run against built bundle, not source
4. **Cross-Chunk Imports**: Must import from implementation files across components
5. **Compound Component Structure**: `.Root` must be first property in namespace object
6. **Hook Location**: Hooks must be in `hooks/` folder, never in root

### Code Quality Constraints
- **Strict TypeScript**: No `any`, `@ts-ignore`, or loose types
- **Recipe Variants**: Never explicitly declare variants that inherit from slot props
- **No Backward Compatibility Hacks**: Delete unused code completely
- **JSDoc Required**: All props in type definitions need JSDoc
- **Display Names**: All components need `displayName` set

### Styling Constraints
- **No Inline Styles**: Use recipes and design tokens only
- **No CSS Modules**: Chakra UI recipes and slot components only
- **CSS Variables**: Must namespace with component name (e.g., `--accordion-font-size`)
- **Token Usage**: Always use tokens, never hardcoded colors/spacing

### Testing Constraints
- **Component Tests**: Only in Storybook stories (browser-based)
- **Unit Tests**: Only for utilities and hooks (JSDOM-based)
- **No Snapshots**: Use specific assertions instead
- **Accessibility Testing**: Required for all interactive components

## External Dependencies

### Core Dependencies
- **React Aria Components**: Accessibility primitives and patterns
  - Provides hooks and components for ARIA compliance
  - Used for keyboard navigation, focus management, and ARIA attributes

- **Chakra UI v3**: Styling system
  - Recipe-based styling with design tokens
  - Slot recipes for multi-element components
  - Style props system

### Development Tools
- **context7 MCP Server**: Documentation lookup for React Aria, Chakra UI
- **playwright MCP Server**: Browser automation for visual testing
- **Transifex**: Professional translation management (5 locales supported)

### Build Dependencies
- **Vite**: Component bundling and development server
- **Rollup**: Library packaging
- **TypeScript**: Type checking and compilation
- **react-docgen-typescript**: API documentation extraction

### Documentation Generation
- **PropsTable Component**: Auto-generated from TypeScript definitions
- **MDX Processor**: Markdown with live React components
- **jsx-live**: Interactive code examples in documentation

### CI/CD Dependencies
- **GitHub Actions**: Automated testing and publishing
- **Changesets**: Version management and changelog generation
- **npm Registry**: Package distribution

## Key File Locations

### Configuration Files
- `vitest.config.ts`: Root test configuration orchestrator
- `vitest.unit.config.ts`: Unit test configuration (JSDOM)
- `vitest.storybook.config.ts`: Storybook test configuration (Playwright)
- `packages/nimbus/src/theme/`: Recipe registration and theme config

### Component Structure
```
packages/nimbus/src/components/{component-name}/
├── {component-name}.tsx          # Main export (implementation or facade)
├── {component-name}.types.ts     # Public API types
├── {component-name}.recipe.ts    # Styling variants (if needed)
├── {component-name}.slots.tsx    # Slot components (if needed)
├── {component-name}.i18n.ts      # Translations (if needed)
├── {component-name}.stories.tsx  # Storybook stories (required)
├── {component-name}.mdx          # Documentation (required)
├── {component-name}.dev.mdx      # Engineering guide (optional)
├── {component-name}.docs.spec.tsx # Doc test examples (optional)
├── components/                   # Compound component parts (if compound)
│   ├── {component-name}.root.tsx
│   ├── {component-name}.part.tsx
│   └── index.ts
├── hooks/                        # Component-specific hooks (if needed)
├── utils/                        # Component utilities (if needed)
└── index.ts                      # Public API barrel export
```

### Documentation
- `docs/component-guidelines.md`: Main component development hub
- `docs/file-type-guidelines/`: Detailed guidelines for each file type
- `docs/component-templates/`: Boilerplate templates
- `CLAUDE.md`: AI assistant instructions and quick reference
- `openspec/AGENTS.md`: OpenSpec change proposal workflow
