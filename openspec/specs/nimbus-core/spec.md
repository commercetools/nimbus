# Specification: @commercetools/nimbus - Core Package Standards

**Package:** `@commercetools/nimbus`
**Version:** 2.1.0

## Purpose

Establish cross-cutting requirements and standards that ALL components in the @commercetools/nimbus package MUST adhere to, ensuring consistency, accessibility, type safety, and maintainability across the entire design system. Individual component capabilities are documented in separate component-specific specs.

## Requirements

### Requirement: WCAG 2.1 AA Compliance
All components SHALL meet WCAG 2.1 AA accessibility standards.

#### Scenario: Keyboard navigation
- **WHEN** a user navigates with keyboard
- **THEN** all interactive elements SHALL be focusable with Tab key
- **AND** SHALL provide visible focus indicators meeting 3:1 contrast ratio
- **AND** SHALL support logical tab order

#### Scenario: Keyboard interaction patterns
- **WHEN** a user interacts with keyboard
- **THEN** components SHALL implement appropriate ARIA keyboard patterns
- **AND** SHALL support component-specific keys (Arrow keys, Enter, Escape, Space, Home, End)
- **AND** SHALL prevent default browser behavior when appropriate

#### Scenario: Screen reader support
- **WHEN** a user uses assistive technology
- **THEN** components SHALL provide appropriate ARIA attributes (role, aria-label, aria-describedby, etc.)
- **AND** SHALL announce state changes (selection, expansion, loading, errors)
- **AND** SHALL provide accessible names and descriptions
- **AND** SHALL use semantic HTML elements where appropriate

#### Scenario: Color contrast
- **WHEN** components render with colors
- **THEN** normal text SHALL meet 4.5:1 contrast ratio
- **AND** large text (18pt+ or 14pt+ bold) SHALL meet 3:1 contrast ratio
- **AND** interactive elements SHALL be distinguishable without relying on color alone

#### Scenario: Touch targets
- **WHEN** components render interactive elements
- **THEN** touch targets SHALL be minimum 44x44px for mobile accessibility
- **AND** SHALL provide adequate spacing between adjacent targets

### Requirement: React Aria Integration
All interactive components SHALL use React Aria Components for accessibility primitives.

#### Scenario: React Aria usage
- **WHEN** a component needs accessible interaction patterns
- **THEN** SHALL use React Aria hooks and components
- **AND** SHALL wrap with Chakra's withContext for styling
- **AND** SHALL follow multi-layered architecture: RAC → Chakra → Nimbus

### Requirement: Strict Type Safety
All components SHALL use strict TypeScript with comprehensive type definitions.

#### Scenario: Component props types
- **WHEN** a component is exported
- **THEN** SHALL export {Component}Props interface
- **AND** SHALL include JSDoc comments for all props
- **AND** SHALL support generic types for polymorphic components

#### Scenario: Recipe and slot types
- **WHEN** a component uses Chakra recipes
- **THEN** SHALL export {Component}RecipeProps (single-slot) or {Component}SlotRecipeProps (multi-slot)
- **AND** types SHALL be auto-generated via Chakra CLI
- **AND** SHALL provide autocomplete for variant values

#### Scenario: Type exports
- **WHEN** component types are defined
- **THEN** SHALL export from {component}.types.ts file
- **AND** SHALL be re-exported from package index
- **AND** SHALL not use `any` or loose types without justification

### Requirement: JSDoc Documentation
All components SHALL provide comprehensive JSDoc documentation.

#### Scenario: Component documentation
- **WHEN** a component is authored
- **THEN** SHALL include JSDoc block with description
- **AND** SHALL document all props with @param tags
- **AND** SHALL include usage examples where helpful
- **AND** SHALL link to online docs with @see tag

### Requirement: Chakra UI v3 Integration
All components SHALL use Chakra UI v3 for styling with design tokens.

#### Scenario: Recipe usage
- **WHEN** a component needs styling
- **THEN** SHALL define recipe in {component}.recipe.ts
- **AND** SHALL register recipe in theme/recipes/ or theme/slot-recipes/
- **AND** CRITICAL: registration SHALL be manual (no auto-discovery)

#### Scenario: Design token usage
- **WHEN** component styles reference values
- **THEN** SHALL use design tokens from @commercetools/nimbus-tokens
- **AND** SHALL NOT use hardcoded colors, spacing, or other values
- **AND** SHALL support light and dark mode via semantic tokens

#### Scenario: Slot components
- **WHEN** component has multiple styled parts
- **THEN** SHALL define slots in {component}.slots.tsx using withContext
- **AND** SHALL follow slot naming: {Component}RootSlot, {Component}PartSlot

### Requirement: Responsive Design
All components SHALL support responsive design patterns.

#### Scenario: Responsive props
- **WHEN** component accepts style props
- **THEN** SHALL support Chakra responsive arrays: `[base, sm, md, lg]`
- **AND** SHALL support responsive objects: `{ base, sm, md, lg, xl, 2xl }`
- **AND** SHALL use breakpoints from design tokens

### Requirement: Storybook Testing
All components SHALL have Storybook stories with interaction tests.

#### Scenario: Story file requirements
- **WHEN** a component is created
- **THEN** SHALL have {component}.stories.tsx file
- **AND** stories SHALL serve as visual documentation AND tests
- **AND** SHALL include play functions for interactive behavior testing

#### Scenario: Browser-based testing
- **WHEN** Storybook tests run
- **THEN** SHALL execute in headless Chromium via Playwright
- **AND** SHALL test against built bundle (dist/), not source files
- **AND** SHALL test user interactions with userEvent
- **AND** SHALL query by accessible attributes (roles, labels), not test IDs

### Requirement: Unit Testing (Where Applicable)
Utilities and hooks SHALL have unit tests.

#### Scenario: Unit test usage
- **WHEN** component has utilities or hooks
- **THEN** utility/hook tests SHALL use JSDOM environment ({component}.spec.tsx)
- **AND** SHALL be fast and isolated
- **AND** component behavior SHALL be tested in Storybook, NOT unit tests

### Requirement: react-intl Integration
Components with user-facing text SHALL support internationalization.

#### Scenario: Message definition
- **WHEN** component needs translatable text
- **THEN** SHALL define messages in {component}.i18n.ts file
- **AND** SHALL use react-intl's defineMessages API
- **AND** SHALL follow naming: `Nimbus.{ComponentName}.{messageKey}`

#### Scenario: Message usage
- **WHEN** component renders localized text
- **THEN** SHALL use useIntl hook
- **AND** SHALL call intl.formatMessage(messages.key)
- **AND** SHALL support variable interpolation

#### Scenario: Message extraction
- **WHEN** new messages are added
- **THEN** SHALL run `pnpm extract-intl` to update @commercetools/nimbus-i18n
- **AND** messages SHALL be compiled to AST format for runtime
- **AND** SHALL support 5 locales (en, de, es, fr-FR, pt-BR)

### Requirement: Optimized Build Output
The package SHALL produce tree-shakeable bundles.

#### Scenario: Module formats
- **WHEN** package is built
- **THEN** SHALL output ESM (index.es.js) and CommonJS (index.cjs) bundles
- **AND** SHALL include TypeScript declarations (dist/index.d.ts)
- **AND** SHALL externalize peer dependencies (React, Chakra, Slate, react-intl)
- **AND** SHALL bundle React Aria for version stability

#### Scenario: Tree-shaking support
- **WHEN** consumer imports specific components
- **THEN** SHALL support tree-shaking to include only used code
- **AND** SHALL use separate entry points per component directory
- **AND** SHALL mark package as side-effect-free

### Requirement: Peer Dependencies
The package SHALL declare appropriate peer dependencies.

#### Scenario: Required peers
- **WHEN** package is installed
- **THEN** SHALL require React 19.x as peer dependency
- **AND** SHALL require @chakra-ui/react (workspace version)
- **AND** SHALL require @commercetools/nimbus-icons and @commercetools/nimbus-tokens
- **AND** SHALL require react-intl 7.x for components with i18n
- **AND** SHALL require slate 0.75.x for RichTextInput component

### Requirement: Consistent Prop Patterns
All components SHALL follow consistent API patterns.

#### Scenario: Props structure
- **WHEN** component accepts props
- **THEN** SHALL support `children` where semantically appropriate
- **AND** SHALL support `ref` forwarding via forwardRef
- **AND** SHALL support polymorphic `as` prop where appropriate
- **AND** SHALL accept Chakra style props (spacing, layout, color)

#### Scenario: Controlled and uncontrolled modes
- **WHEN** component manages state
- **THEN** SHALL support controlled mode (value + onChange)
- **AND** SHALL support uncontrolled mode (defaultValue + optional onChange)
- **AND** SHALL follow React patterns for state management

### Requirement: Compound Component Pattern
Multi-part components SHALL use namespace compound pattern.

#### Scenario: Compound component structure
- **WHEN** component has multiple coordinated parts
- **THEN** SHALL export as namespace object (e.g., Menu.Root, Menu.Trigger, Menu.Item)
- **AND** Root component SHALL be first property
- **AND** SHALL organize parts in components/ subdirectory

### Requirement: MDX Documentation
All components SHALL have MDX documentation files.

#### Scenario: Documentation files
- **WHEN** component is created
- **THEN** SHALL have {component}.mdx for user-facing docs
- **AND** MAY have {component}.dev.mdx for engineering documentation
- **AND** SHALL include frontmatter with menu, title, description
- **AND** SHALL include usage examples with live code blocks

### Requirement: Consistent File Structure
All components SHALL follow standardized file organization.

#### Scenario: Component directory structure
- **WHEN** component is created
- **THEN** SHALL have directory: src/components/{component-name}/
- **AND** SHALL include: index.ts (exports), {component}.tsx (implementation), {component}.types.ts (types), {component}.stories.tsx (tests)
- **AND** MAY include: {component}.recipe.ts, {component}.slots.tsx, {component}.i18n.ts, {component}.mdx
- **AND** Compound components SHALL have components/ subdirectory

### Requirement: Cross-Component Imports
Components SHALL follow safe import patterns.

#### Scenario: Import patterns
- **WHEN** component imports from another component
- **THEN** SHALL import from implementation file: `from '@/components/icon/icon'`
- **AND** SHALL NOT import from barrel export (index.ts) to avoid circular chunk dependencies
- **AND** SHALL import utilities from barrel exports: `from '@/utils'`

### Requirement: NimbusProvider Configuration
Applications SHALL use NimbusProvider for theme and i18n setup.

#### Scenario: Provider setup
- **WHEN** application renders Nimbus components
- **THEN** SHALL wrap with NimbusProvider
- **AND** NimbusProvider SHALL configure ChakraProvider with Nimbus theme
- **AND** SHALL configure IntlProvider for i18n
- **AND** SHALL configure NimbusI18nProvider for React Aria i18n
