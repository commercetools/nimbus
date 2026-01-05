# Specification: @commercetools/nimbus-tokens

## Overview

The @commercetools/nimbus-tokens package is the single source of truth for all design tokens in the Nimbus design system. It transforms W3C Design Token Community Group (DTCG) standard tokens into multiple platform-specific formats using Style Dictionary, providing 24 token categories with 2000+ individual tokens.

**Package:** `@commercetools/nimbus-tokens`
**Version:** 2.1.0
**Build Tool:** Style Dictionary v4.3.0
**Source:** `src/base/tokens.json` (7,403 lines, DTCG format)

## Token Generation

### Requirement: DTCG-Compliant Token Source
The system SHALL maintain design tokens in W3C DTCG standard format.

#### Scenario: Token definition
- **WHEN** a token is defined in src/base/tokens.json
- **THEN** SHALL use `$type` property for token type declaration
- **AND** SHALL use `$value` property for token value
- **AND** SHALL support token references with curly brace syntax `{category.subcategory.token}`

#### Scenario: Token composition
- **WHEN** a token references another token
- **THEN** SHALL resolve references during build transformation
- **AND** SHALL support multi-level reference chains
- **AND** SHALL detect and report circular references

### Requirement: Multi-Platform Output Generation
The system SHALL generate platform-specific token outputs.

#### Scenario: CSS variable generation
- **WHEN** Style Dictionary build runs
- **THEN** SHALL output design-tokens.css with 2,290+ CSS custom properties
- **AND** SHALL use kebab-case naming (`--category-subcategory-token-name`)
- **AND** SHALL convert colors to HSL format
- **AND** SHALL generate shadow shorthand notation

#### Scenario: TypeScript token generation
- **WHEN** Style Dictionary build runs
- **THEN** SHALL output design-tokens.ts with typed object literals
- **AND** SHALL use PascalCase for category names
- **AND** SHALL mark exports as `as const` for type inference
- **AND** SHALL provide IDE autocompletion with value visibility

#### Scenario: Chakra UI format generation
- **WHEN** Style Dictionary build runs
- **THEN** SHALL output theme-tokens.ts with Chakra-specific `{ value }` wrapper syntax
- **AND** SHALL merge light/dark mode values into `{ _light, _dark }` objects
- **AND** SHALL be compatible with `defineTokens()` function

## Color Tokens

### Requirement: System Color Palettes
The system SHALL provide 54 system color palettes from Radix UI.

#### Scenario: Color palette structure
- **WHEN** a system palette is accessed
- **THEN** SHALL provide 12-step scale (1-12) for both light and dark modes
- **AND** SHALL include DEFAULT token (alias to step 9)
- **AND** SHALL include contrast token (auto-calculated accessible color)
- **AND** SHALL provide alpha variant with same structure

#### Scenario: Available system palettes
- **WHEN** requesting system palettes
- **THEN** SHALL include: amber, blue, bronze, brown, crimson, cyan, gold, grass, gray, green, indigo, iris, jade, lime, mint, orange, pink, plum, purple, red, ruby, sky, slate, teal, tomato, violet, yellow
- **AND** SHALL exclude: mauve, sage, olive, sand (intentionally filtered)

### Requirement: Brand Color Palettes
The system SHALL provide commercetools brand color palettes.

#### Scenario: Brand palette structure
- **WHEN** a brand palette is accessed
- **THEN** SHALL provide ctviolet, ctyellow, ctteal palettes
- **AND** SHALL follow same 12-step scale structure as system palettes
- **AND** SHALL provide alpha variants

### Requirement: Semantic Color Palettes
The system SHALL provide semantic color mappings.

#### Scenario: Semantic color resolution
- **WHEN** a semantic color is referenced
- **THEN** SHALL map to appropriate system or brand palette
- **AND** neutral SHALL reference gray
- **AND** primary SHALL reference ctviolet
- **AND** info SHALL reference blue
- **AND** critical SHALL reference red
- **AND** warning SHALL reference amber
- **AND** positive SHALL reference grass

## Spacing and Sizing Tokens

### Requirement: Spacing Scale
The system SHALL provide comprehensive spacing values based on 8px grid.

#### Scenario: Spacing values
- **WHEN** requesting spacing tokens
- **THEN** SHALL provide scale from 25 (4px) to 6400 (1024px)
- **AND** SHALL follow pattern: 25, 50, 100, 150, 200, 250... up to 6400

### Requirement: Size Tokens
The system SHALL provide size tokens for component dimensions.

#### Scenario: Size scale
- **WHEN** requesting size tokens
- **THEN** SHALL provide numeric scale (25 through 8000)
- **AND** SHALL provide named sizes: 2xs, xs, sm, md, lg, xl, 2xl, 3xl, 4xl

## Typography Tokens

### Requirement: Font Families
The system SHALL define font family stacks.

#### Scenario: Font definitions
- **WHEN** components use font tokens
- **THEN** heading and body SHALL use Inter with system fallbacks
- **AND** mono SHALL use SFMono-Regular, Menlo, Monaco, Consolas with fallbacks

### Requirement: Font Sizes
The system SHALL provide font size scale.

#### Scenario: Font size values
- **WHEN** requesting font sizes
- **THEN** SHALL provide scale from 250 (10px) to 1600 (64px)
- **AND** SHALL include: 250, 300, 350, 400, 450, 500, 600, 750, 900, 1200, 1600

### Requirement: Text Styles
The system SHALL provide pre-composed typography combinations.

#### Scenario: Text style composition
- **WHEN** requesting a text style
- **THEN** SHALL combine fontSize and lineHeight tokens
- **AND** SHALL provide 16 styles: body, caption, detail, 2xs, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl

## Border and Radius Tokens

### Requirement: Border Radius Scale
The system SHALL provide border radius values.

#### Scenario: Radius values
- **WHEN** requesting border radius
- **THEN** SHALL provide scale from 50 (2px) through 600 (24px)
- **AND** SHALL include `full` value (900px) for pill shapes

### Requirement: Border Width Scale
The system SHALL provide border width values.

#### Scenario: Border widths
- **WHEN** requesting border width
- **THEN** SHALL provide: 25 (1px), 50 (2px), 75 (3px), 100 (4px)

### Requirement: Pre-Composed Borders
The system SHALL provide complete border definitions.

#### Scenario: Border tokens
- **WHEN** requesting pre-composed border
- **THEN** SHALL combine borderWidth with "solid" style
- **AND** SHALL provide: solid-25, solid-50, solid-75, solid-100

## Shadow and Elevation Tokens

### Requirement: Shadow System
The system SHALL provide 6-level elevation system.

#### Scenario: Shadow composition
- **WHEN** requesting a shadow token
- **THEN** SHALL provide composite shadow with x, y, blur, spread, and color properties
- **AND** SHALL reference other tokens (spacing for offsets, blur tokens, blackAlpha colors)
- **AND** SHALL support levels 1 through 6

## Animation Tokens

### Requirement: Duration Values
The system SHALL provide animation duration tokens.

#### Scenario: Duration scale
- **WHEN** requesting duration
- **THEN** SHALL provide named values: fastest (50ms), faster (100ms), fast (150ms), moderate (200ms), slow (300ms), slower (400ms), slowest (500ms), 1s, 2s

### Requirement: Easing Functions
The system SHALL provide easing curve definitions.

#### Scenario: Easing values
- **WHEN** requesting easing function
- **THEN** SHALL provide cubic-bezier arrays for: linear, ease-in, ease-out, ease-in-out, ease-in-smooth

### Requirement: Pre-Composed Animations
The system SHALL provide complete animation definitions.

#### Scenario: Animation presets
- **WHEN** requesting animation
- **THEN** SHALL provide: spin, ping, pulse, bounce
- **AND** SHALL compose duration and easing tokens into complete animation strings

## Responsive Design Tokens

### Requirement: Breakpoints
The system SHALL define responsive breakpoints.

#### Scenario: Breakpoint values
- **WHEN** requesting breakpoints
- **THEN** SHALL provide: sm (480px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

### Requirement: Aspect Ratios
The system SHALL provide aspect ratio presets.

#### Scenario: Aspect ratio values
- **WHEN** requesting aspect ratios
- **THEN** SHALL provide: square (1), landscape (1.3333), portrait (0.75), wide (1.7777), ultrawide (3.6), golden (1.618)

## Z-Index System

### Requirement: Layering Tokens
The system SHALL provide semantic z-index values for UI layering.

#### Scenario: Z-index hierarchy
- **WHEN** components use z-index
- **THEN** SHALL provide semantic values: hide (-1), base (0), docked (10), dropdown (1000), sticky (1100), banner (1200), overlay (1300), modal (1400), popover (1500), skipNav (1600), toast (1700), tooltip (1800), max (2147483647)

## Build Process

### Requirement: Style Dictionary Configuration
The system SHALL use Style Dictionary for token transformation.

#### Scenario: Build execution
- **WHEN** `pnpm build` is run
- **THEN** SHALL read src/base/tokens.json as source
- **AND** SHALL apply tokens-studio preprocessor for DTCG compatibility
- **AND** SHALL transform tokens using custom transform groups
- **AND** SHALL output to css/, src/generated/ts/, and src/generated/chakra/ directories

### Requirement: Custom Transformers
The system SHALL provide custom transformers for platform-specific formats.

#### Scenario: Chakra transformer
- **WHEN** generating Chakra format
- **THEN** SHALL convert `$value` to `value` property
- **AND** SHALL merge light/dark color pairs into `{ _light, _dark }` objects
- **AND** SHALL recursively process nested token objects
- **AND** SHALL remove Style Dictionary metadata

## Package Exports

### Requirement: Multiple Entry Points
The system SHALL provide separate exports for different consumers.

#### Scenario: Main package export
- **WHEN** importing from "@commercetools/nimbus-tokens"
- **THEN** SHALL export `themeTokens` (Chakra format)
- **AND** SHALL export `designTokens` (TypeScript format)

#### Scenario: Direct format imports
- **WHEN** importing from "@commercetools/nimbus-tokens/generated/ts"
- **THEN** SHALL provide designTokens object
- **WHEN** importing from "@commercetools/nimbus-tokens/generated/chakra"
- **THEN** SHALL provide themeTokens object

## Integration with Color-Tokens

### Requirement: Color Token Source
The system SHALL accept colors from @commercetools/color-tokens package.

#### Scenario: Color import
- **WHEN** tokens.json is updated
- **THEN** SHALL reference colors generated by color-tokens package
- **AND** SHALL include system palettes (Radix UI)
- **AND** SHALL include brand palettes (commercetools)
- **AND** SHALL include semantic palette mappings

## Consumers

### Requirement: Nimbus Package Integration
The system SHALL be consumed by @commercetools/nimbus package.

#### Scenario: Token consumption
- **WHEN** Nimbus components reference tokens
- **THEN** SHALL import themeTokens for Chakra theme configuration
- **AND** SHALL wrap with defineTokens() function
- **AND** SHALL extend with semantic token layer
- **AND** SHALL use in component recipes via token references
