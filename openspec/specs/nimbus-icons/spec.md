# Specification: @commercetools/nimbus-icons

## Overview

The @commercetools/nimbus-icons package provides 2,126 SVG icons as tree-shakeable React components (2,122 Material Design + 4 custom commercetools icons). Icons are generated from source SVGs using SVGR with sensible defaults for accessibility, sizing, and color.

**Package:** `@commercetools/nimbus-icons`
**Version:** 2.1.0
**Total Icons:** 2,126 (Material + Custom)
**Source:** @material-design-icons/svg v0.14.15 (outlined variant)

## Purpose

This specification defines the cross-cutting concerns for icon generation, transformation, and distribution. Icon components are generated from Material Design and custom SVG sources using SVGR.

## Requirements

### Requirement: SVG Component Generation
The system SHALL generate React components from SVG sources.

#### Scenario: Material icon generation
- **WHEN** SVGR processes Material Design SVGs
- **THEN** SHALL generate TypeScript React components
- **AND** SHALL use forwardRef for ref forwarding
- **AND** SHALL accept SVGProps<SVGSVGElement> as props
- **AND** SHALL name components with Svg prefix in PascalCase (e.g., SvgAdd, SvgArrowBack)

#### Scenario: Custom icon generation
- **WHEN** custom icons are authored
- **THEN** SHALL follow same SVGProps<SVGSVGElement> interface
- **AND** SHALL export as named exports (not default)
- **AND** SHALL maintain original viewBox dimensions

### Requirement: Default SVG Attributes
The system SHALL inject standard attributes via SVGR configuration.

#### Scenario: Accessibility defaults
- **WHEN** an icon component renders
- **THEN** SHALL include `aria-hidden="true"` by default (decorative)
- **AND** SHALL allow override via props for semantic icons

#### Scenario: Sizing defaults
- **WHEN** an icon component renders
- **THEN** SHALL set width="1em" and height="1em" for text-relative scaling
- **AND** SHALL set viewBox="0 0 24 24" for Material icons
- **AND** SHALL allow override via props

#### Scenario: Color defaults
- **WHEN** an icon component renders
- **THEN** SHALL set fill="currentColor" to inherit text color
- **AND** SHALL allow override via props

### Requirement: Comprehensive Icon Library
The system SHALL provide 2,122 Material Design outlined icons.

#### Scenario: Icon categories
- **WHEN** requesting icons
- **THEN** SHALL include navigation icons (arrow-back, chevron-left, expand-more)
- **AND** SHALL include action icons (add, delete, edit, save, search, settings)
- **AND** SHALL include content icons (file-upload, folder-open, attach-file)
- **AND** SHALL include communication icons (mail, send, chat, phone, notifications)
- **AND** SHALL include user icons (person, people, account-circle, manage-accounts)
- **AND** SHALL include status icons (check-circle, error, warning, info)
- **AND** SHALL include media icons (play-arrow, pause, volume-up, camera)
- **AND** SHALL include hardware icons (computer, phone-android, keyboard, mouse)
- **AND** SHALL include commerce icons (shopping-cart, store, payment, attach-money)
- **AND** SHALL include date/time icons (calendar-today, schedule, access-time)

### Requirement: Commercetools Brand Icons
The system SHALL provide custom commercetools-specific icons.

#### Scenario: Custom icon availability
- **WHEN** requesting custom icons
- **THEN** SHALL provide Figma icon (Figma logo with stroke styling)
- **AND** SHALL provide Github icon (GitHub logo)
- **AND** SHALL provide CommercetoolsCube icon (commercetools brand cube logo)
- **AND** SHALL provide HighPrecision icon (16x16 viewBox, for MoneyInput component)

### Requirement: SVG-to-React Transformation
The system SHALL use SVGR CLI to generate icon components.

#### Scenario: Build process
- **WHEN** `pnpm build:icons` runs
- **THEN** SHALL process SVGs from node_modules/@material-design-icons/svg/outlined/
- **AND** SHALL output to src/material-icons/ directory
- **AND** SHALL use kebab-case filenames
- **AND** SHALL generate TypeScript (.tsx) files
- **AND** SHALL use automatic JSX runtime

### Requirement: Module Compilation
The system SHALL compile TypeScript to dual module formats.

#### Scenario: Build outputs
- **WHEN** `pnpm build` runs
- **THEN** SHALL compile to ESM format in dist/esm/
- **AND** SHALL compile to CommonJS format in dist/cjs/
- **AND** SHALL generate TypeScript declarations for both formats
- **AND** SHALL create barrel export index files

### Requirement: Tree-Shakeable Exports
The system SHALL support tree-shaking for optimal bundle sizes.

#### Scenario: Named exports
- **WHEN** importing specific icons
- **THEN** SHALL support named imports: `import { SvgAdd, SvgDelete } from '@commercetools/nimbus-icons'`
- **AND** SHALL enable bundlers to include only imported icons
- **AND** SHALL mark package as side-effect-free

#### Scenario: Barrel exports
- **WHEN** importing from package root
- **THEN** SHALL re-export all Material icons from ./material-icons
- **AND** SHALL export custom icons by name

### Requirement: Searchable Icon Browser
The system SHALL integrate with documentation site for icon discovery.

#### Scenario: Icon search component
- **WHEN** documentation site renders icon search
- **THEN** SHALL display all 2,126 icons in searchable grid
- **AND** SHALL support name-based filtering
- **AND** SHALL provide copy-to-clipboard for import statements
- **AND** SHALL show icon names and preview

### Requirement: Component Integration
The system SHALL be used by @commercetools/nimbus components.

#### Scenario: Icon usage
- **WHEN** Nimbus components need icons
- **THEN** SHALL import from @commercetools/nimbus-icons
- **AND** examples SHALL include: KeyboardArrowDown (SplitButton), Close (Drawer/Dialog), DragIndicator (DraggableList), Save/Edit/Share (examples)

### Requirement: Optimized Bundle Size
The system SHALL optimize for production bundle sizes.

#### Scenario: Tree-shaking support
- **WHEN** consumer app uses specific icons
- **THEN** SHALL include only imported icons in final bundle
- **AND** SHALL not include unused icons
- **AND** total package size SHALL be ~34MB (all icons) but tree-shakeable

#### Scenario: Runtime performance
- **WHEN** icons render
- **THEN** SHALL use inline SVG (no network requests)
- **AND** SHALL scale without quality loss (vector graphics)
- **AND** SHALL inherit text size via 1em sizing
