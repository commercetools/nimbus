# Specification: nimbus-tokens-typography

## Overview

Typography tokens provide font families, font sizes, line heights, and pre-composed text styles that establish the typographic system for the Nimbus design system.

**Parent Spec:** `../nimbus-tokens/spec.md`
**Token Categories:** fontFamilies, fontSizes, lineHeights, textStyles
**Text Styles:** 16 pre-composed combinations
**Primary Font:** Inter with system fallbacks

## Purpose

This specification defines the typography scale and text style presets used throughout the design system for consistent text rendering and hierarchy.

## Requirements

### Requirement: Font Families
The system SHALL define font family stacks.

#### Scenario: Font definitions
- **WHEN** components use font tokens
- **THEN** heading and body SHALL use Inter with system fallbacks
- **AND** mono SHALL use SFMono-Regular, Menlo, Monaco, Consolas with fallbacks
- **AND** SHALL include complete fallback stacks for cross-platform support

#### Scenario: Font family values
- **WHEN** font family tokens are output
- **THEN** heading SHALL resolve to: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
- **AND** body SHALL resolve to same stack as heading
- **AND** mono SHALL resolve to: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"

#### Scenario: Font loading
- **WHEN** fonts are referenced in generated CSS
- **THEN** SHALL assume Inter is loaded via external stylesheet or font provider
- **AND** SHALL degrade gracefully to system fonts if Inter unavailable
- **AND** SHALL maintain readable typography with fallback fonts

### Requirement: Font Sizes
The system SHALL provide font size scale.

#### Scenario: Font size values
- **WHEN** requesting font sizes
- **THEN** SHALL provide scale from 250 (10px) to 1600 (64px)
- **AND** SHALL include: 250, 300, 350, 400, 450, 500, 600, 750, 900, 1200, 1600

#### Scenario: Font size naming
- **WHEN** tokens are generated
- **THEN** SHALL use numeric naming: fontSizes.250, fontSizes.300, etc.
- **AND** CSS variables SHALL use kebab-case: --font-sizes-250, --font-sizes-300, etc.
- **AND** TypeScript exports SHALL use PascalCase category: FontSizes.250, FontSizes.300, etc.

#### Scenario: Font size outputs
- **WHEN** tokens are output
- **THEN** CSS format SHALL use pixel units (10px, 12px, etc.)
- **AND** TypeScript format SHALL use pixel string values ("10px", "12px", etc.)
- **AND** Chakra format SHALL wrap values in { value: "10px" } syntax

### Requirement: Line Heights
The system SHALL provide line height values paired with font sizes.

#### Scenario: Line height scale
- **WHEN** requesting line heights
- **THEN** SHALL provide values corresponding to each font size
- **AND** SHALL maintain optimal readability ratios
- **AND** SHALL use unitless values or pixel values as appropriate

### Requirement: Text Styles
The system SHALL provide pre-composed typography combinations.

#### Scenario: Text style composition
- **WHEN** requesting a text style
- **THEN** SHALL combine fontSize and lineHeight tokens
- **AND** SHALL provide 16 styles: body, caption, detail, 2xs, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl

#### Scenario: Text style structure
- **WHEN** a text style is accessed
- **THEN** SHALL include fontSize property referencing fontSizes token
- **AND** SHALL include lineHeight property referencing lineHeights token
- **AND** SHALL resolve token references during build transformation

#### Scenario: Text style naming
- **WHEN** text styles are generated
- **THEN** SHALL use semantic names: textStyles.body, textStyles.caption, etc.
- **AND** SHALL use size-based names: textStyles.xs, textStyles.md, textStyles.2xl, etc.
- **AND** CSS variables SHALL use kebab-case: --text-styles-body-font-size, --text-styles-body-line-height
- **AND** TypeScript/Chakra SHALL group properties: TextStyles.body.fontSize, TextStyles.body.lineHeight

#### Scenario: Text style usage
- **WHEN** components apply text styles
- **THEN** SHALL reference complete text style tokens: `{textStyles.body}`
- **AND** SHALL support referencing individual properties: `{textStyles.body.fontSize}`
- **AND** SHALL maintain consistent typography across component implementations
