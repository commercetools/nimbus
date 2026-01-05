# Specification: @commercetools/color-tokens

## Overview

The @commercetools/color-tokens package is a build-time generator that combines Radix UI system colors with commercetools brand colors to produce structured color token definitions in DTCG format. It generates 2,000+ color tokens consumed by @commercetools/nimbus-tokens.

**Package:** `@commercetools/color-tokens`
**Type:** Script-based generator (not a runtime import)
**Output:** dist/color-tokens.json (6,575 lines, 144KB)
**Sources:** @radix-ui/colors v3.0.0 + custom brand colors

## Color Generation System

### Requirement: Radix UI Integration
The system SHALL import and process Radix UI color palettes.

#### Scenario: System palette import
- **WHEN** generator script runs
- **THEN** SHALL import all palettes from @radix-ui/colors
- **AND** SHALL filter out mauve, sage, olive, sand palettes (intentionally excluded)
- **AND** SHALL categorize by light/dark and standard/alpha variants
- **AND** SHALL include 54 total system palettes (27 colors × 2 variants)

### Requirement: Brand Color Definition
The system SHALL provide commercetools brand color palettes.

#### Scenario: Brand color structure
- **WHEN** generator processes brand colors
- **THEN** SHALL define ctviolet, ctyellow, ctteal palettes in brand-colors.ts
- **AND** SHALL provide light and dark mode variants
- **AND** SHALL provide alpha transparency variants
- **AND** SHALL follow 12-step scale structure matching Radix patterns

## Palette Structure

### Requirement: 12-Step Color Scale
The system SHALL generate 12-step color scales for all palettes.

#### Scenario: Color step distribution
- **WHEN** a color palette is generated
- **THEN** steps 1-6 SHALL provide progressively darker backgrounds and borders
- **AND** steps 7-8 SHALL provide interactive state colors (hover, active)
- **AND** step 9 SHALL be designated DEFAULT solid color
- **AND** step 10 SHALL be high-contrast solid (hover on step 9)
- **AND** steps 11-12 SHALL provide text colors with varying contrast

### Requirement: Special Token Generation
The system SHALL generate special reference tokens.

#### Scenario: DEFAULT token
- **WHEN** palette is created
- **THEN** DEFAULT token SHALL alias to step 9
- **AND** SHALL be designated primary usage color

#### Scenario: Contrast token
- **WHEN** palette is created
- **THEN** contrast token SHALL be auto-calculated using chroma-js
- **AND** SHALL determine black or white based on 2.9 WCAG threshold
- **AND** SHALL ensure accessible text contrast on DEFAULT color

## Semantic Palette Mapping

### Requirement: Semantic Color References
The system SHALL create semantic color aliases using DTCG reference syntax.

#### Scenario: Semantic mapping
- **WHEN** generating semantic palettes
- **THEN** neutral SHALL reference `{color.system-palettes.gray.*}`
- **AND** primary SHALL reference `{color.brand-palettes.ctviolet.*}`
- **AND** info SHALL reference `{color.system-palettes.blue.*}`
- **AND** critical SHALL reference `{color.system-palettes.red.*}`
- **AND** warning SHALL reference `{color.system-palettes.amber.*}`
- **AND** positive SHALL reference `{color.system-palettes.grass.*}`

## Theme Mode Support

### Requirement: Light and Dark Modes
The system SHALL generate paired light/dark mode colors.

#### Scenario: Dual theme generation
- **WHEN** palettes are created
- **THEN** each palette SHALL have light theme variant
- **AND** SHALL have dark theme variant
- **AND** both SHALL follow same 12-step + DEFAULT + contrast structure
- **AND** values SHALL be optimized for respective backgrounds

## Output Format

### Requirement: DTCG-Compliant JSON
The system SHALL generate W3C DTCG standard format.

#### Scenario: JSON structure
- **WHEN** generator writes output
- **THEN** SHALL use `$type: "color"` property
- **AND** SHALL use `$value` property for color hex values
- **AND** SHALL organize into hierarchical structure: color.{category}.{palette}.{theme}.{step}
- **AND** SHALL output to dist/color-tokens.json

### Requirement: Hierarchical Organization
The system SHALL organize colors into three tiers.

#### Scenario: Color tier structure
- **WHEN** accessing color tokens
- **THEN** SHALL provide blacks-and-whites tier (black, white, blackAlpha, whiteAlpha)
- **AND** SHALL provide system-palettes tier (54 Radix palettes)
- **AND** SHALL provide brand-palettes tier (6 commercetools palettes)
- **AND** SHALL provide semantic-palettes tier (12 aliased palettes)

## Build Integration

### Requirement: Manual Copy Workflow
The system SHALL require manual integration with nimbus-tokens.

#### Scenario: Generation and integration
- **WHEN** color tokens need updating
- **THEN** developer SHALL run `cd packages/color-tokens && pnpm tsx ./index.ts`
- **AND** SHALL manually copy colors object from dist/color-tokens.json
- **AND** SHALL paste into packages/tokens/src/base/tokens.json
- **AND** reason SHALL be: automated merge proved too complex for 2,000+ tokens

### Requirement: Style Dictionary Consumption
The system SHALL generate output consumable by Style Dictionary.

#### Scenario: Downstream processing
- **WHEN** nimbus-tokens processes base tokens
- **THEN** SHALL read color tokens from tokens.json
- **AND** SHALL transform via Style Dictionary to CSS/TS/Chakra formats
- **AND** SHALL resolve token references to actual values

## Accessibility

### Requirement: Contrast Calculation
The system SHALL ensure accessible color combinations.

#### Scenario: Contrast computation
- **WHEN** contrast token is calculated
- **THEN** SHALL use chroma-js.contrast() function
- **AND** SHALL test white text contrast ratio
- **AND** SHALL use white if ratio > 2.9, else black
- **AND** SHALL ensure WCAG AA compliance for text on DEFAULT color

## Package Configuration

### Requirement: Private Package Status
The system SHALL NOT be published to NPM registry.

#### Scenario: Package privacy
- **WHEN** package.json is configured
- **THEN** SHALL mark as private (not published)
- **AND** SHALL be used only as workspace build tool
- **AND** output SHALL be consumed by nimbus-tokens, not imported at runtime

## Dependencies

### Requirement: Color Processing Libraries
The system SHALL use specialized color manipulation tools.

#### Scenario: Required dependencies
- **WHEN** generator runs
- **THEN** SHALL use @radix-ui/colors v3.0.0 for system palette source
- **AND** SHALL use chroma-js v3.1.2 for contrast calculations
- **AND** SHALL use lodash v4.17.21 for utility functions

## Token Count Statistics

### Requirement: Comprehensive Color Coverage
The system SHALL generate thousands of color tokens.

#### Scenario: Token volume
- **WHEN** generator completes
- **THEN** output file SHALL be 6,575 lines
- **AND** SHALL be 144KB in size
- **AND** SHALL contain ~2,000+ individual color tokens
- **AND** SHALL support 54 system + 6 brand + 12 semantic palettes

## Brand Color Specifications

### Requirement: commercetools Brand Identity
The system SHALL accurately represent brand colors.

#### Scenario: ctviolet (primary brand)
- **WHEN** ctviolet palette is accessed
- **THEN** light mode DEFAULT SHALL be #4E4ED8 (primary brand violet)
- **AND** light mode contrast SHALL be #ffffff (white text)

#### Scenario: ctyellow (secondary brand)
- **WHEN** ctyellow palette is accessed
- **THEN** light mode DEFAULT SHALL be #ffcc16 (golden yellow)
- **AND** light mode contrast SHALL be #000000 (black text)

#### Scenario: ctteal (tertiary brand)
- **WHEN** ctteal palette is accessed
- **THEN** light mode DEFAULT SHALL be #0bbfbf (vibrant teal)
- **AND** light mode contrast SHALL be #000000 (black text)
