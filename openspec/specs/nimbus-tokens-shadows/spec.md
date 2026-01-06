# Specification: nimbus-tokens-shadows

## Overview

Shadow tokens provide a 6-level elevation system that creates depth hierarchy throughout the Nimbus design system. Each shadow is a composite token combining offset, blur, spread, and color properties.

**Parent Spec:** `../nimbus-tokens/spec.md`
**Token Category:** shadows
**Elevation Levels:** 1 through 6
**Composition:** Multi-property tokens referencing spacing, blur, and color tokens

## Purpose

This specification defines the shadow system used to establish visual hierarchy and depth relationships between UI elements.

## Requirements

### Requirement: Shadow System
The system SHALL provide 6-level elevation system.

#### Scenario: Shadow composition
- **WHEN** requesting a shadow token
- **THEN** SHALL provide composite shadow with x, y, blur, spread, and color properties
- **AND** SHALL reference other tokens (spacing for offsets, blur tokens, blackAlpha colors)
- **AND** SHALL support levels 1 through 6

#### Scenario: Shadow structure
- **WHEN** a shadow token is defined in tokens.json
- **THEN** SHALL use composite token format with nested properties
- **AND** SHALL include x offset property (references spacing or zero)
- **AND** SHALL include y offset property (references spacing tokens)
- **AND** SHALL include blur property (references blur tokens)
- **AND** SHALL include spread property (references spacing or zero)
- **AND** SHALL include color property (references blackAlpha color tokens)

#### Scenario: Shadow naming
- **WHEN** tokens are generated
- **THEN** SHALL use numeric naming: shadows.1, shadows.2, shadows.3, shadows.4, shadows.5, shadows.6
- **AND** CSS variables SHALL use kebab-case: --shadows-1, --shadows-2, etc.
- **AND** TypeScript exports SHALL use PascalCase category: Shadows[1], Shadows[2], etc.

#### Scenario: Shadow outputs
- **WHEN** tokens are output to CSS
- **THEN** SHALL generate box-shadow shorthand notation
- **AND** SHALL combine x, y, blur, spread, and color into single value
- **AND** SHALL resolve all token references to actual values
- **AND** SHALL format as: "0px 2px 4px 0px hsla(...)"

#### Scenario: Shadow outputs TypeScript
- **WHEN** tokens are output to TypeScript
- **THEN** SHALL generate box-shadow string value
- **AND** SHALL resolve all token references
- **AND** SHALL maintain same format as CSS output

#### Scenario: Shadow outputs Chakra
- **WHEN** tokens are output to Chakra format
- **THEN** SHALL wrap box-shadow value in { value: "..." } syntax
- **AND** SHALL resolve all token references
- **AND** SHALL be compatible with defineTokens() function

#### Scenario: Shadow elevation hierarchy
- **WHEN** shadows are applied to components
- **THEN** shadows.1 SHALL provide subtle elevation (cards at rest)
- **AND** shadows.2 SHALL provide low elevation (hovered cards)
- **AND** shadows.3 SHALL provide moderate elevation (dropdowns, menus)
- **AND** shadows.4 SHALL provide high elevation (modals, dialogs)
- **AND** shadows.5 SHALL provide very high elevation (tooltips, popovers)
- **AND** shadows.6 SHALL provide maximum elevation (critical alerts, highest priority overlays)

#### Scenario: Shadow token references
- **WHEN** shadow tokens reference other tokens
- **THEN** SHALL resolve spacing references: `{spacing.50}`, `{spacing.100}`, etc.
- **AND** SHALL resolve color references: `{colors.blackAlpha.300}`, `{colors.blackAlpha.500}`, etc.
- **AND** SHALL resolve blur references if defined as separate tokens
- **AND** SHALL maintain reference chain during build transformation

#### Scenario: Shadow color mode support
- **WHEN** shadows are used in light/dark modes
- **THEN** SHALL support mode-specific shadow definitions if needed
- **AND** SHALL reference appropriate alpha colors for mode
- **AND** SHALL maintain consistent visual hierarchy across modes
