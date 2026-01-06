# Specification: nimbus-tokens-colors

## Overview

Color tokens provide system color palettes from Radix UI, commercetools brand colors, and semantic color mappings. These tokens are sourced from the @commercetools/color-tokens package and integrated into the nimbus-tokens build pipeline.

**Parent Spec:** `../nimbus-tokens/spec.md`
**Token Categories:** colors.system, colors.brand, colors.semantic
**Total Palettes:** 57 (54 system + 3 brand)
**Structure:** 12-step scales with DEFAULT and contrast tokens

## Purpose

This specification defines the color token structure, palette organization, and semantic mappings that provide the visual language for the Nimbus design system.

## Requirements

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

#### Scenario: Light mode color values
- **WHEN** accessing a color in light mode
- **THEN** SHALL provide HSL color value
- **AND** SHALL maintain WCAG 2.1 AA contrast ratios
- **AND** SHALL reference colors.system.{palette}.light.{step}

#### Scenario: Dark mode color values
- **WHEN** accessing a color in dark mode
- **THEN** SHALL provide HSL color value
- **AND** SHALL maintain WCAG 2.1 AA contrast ratios
- **AND** SHALL reference colors.system.{palette}.dark.{step}

### Requirement: Brand Color Palettes
The system SHALL provide commercetools brand color palettes.

#### Scenario: Brand palette structure
- **WHEN** a brand palette is accessed
- **THEN** SHALL provide ctviolet, ctyellow, ctteal palettes
- **AND** SHALL follow same 12-step scale structure as system palettes
- **AND** SHALL provide alpha variants
- **AND** SHALL include DEFAULT and contrast tokens

#### Scenario: Brand color accessibility
- **WHEN** brand colors are used in UI
- **THEN** SHALL maintain WCAG 2.1 AA contrast requirements
- **AND** SHALL provide contrast token for text on brand backgrounds
- **AND** SHALL support both light and dark mode variations

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

#### Scenario: Semantic color inheritance
- **WHEN** components use semantic colors
- **THEN** SHALL inherit all properties from mapped palette (12-step scale, DEFAULT, contrast, alpha)
- **AND** SHALL support light/dark mode switching
- **AND** SHALL maintain consistent naming regardless of underlying palette

#### Scenario: Color token references
- **WHEN** semantic tokens are defined in tokens.json
- **THEN** SHALL use token reference syntax: `{colors.system.{palette}}`
- **AND** SHALL resolve references during Style Dictionary build
- **AND** SHALL output resolved values in all platform formats (CSS, TS, Chakra)
