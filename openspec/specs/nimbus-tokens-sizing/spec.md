# Specification: nimbus-tokens-sizing

## Overview

Sizing tokens provide standardized dimension values for component widths, heights, and other size-based properties, offering both numeric and semantic named scales.

**Parent Spec:** `../nimbus-tokens/spec.md`
**Token Category:** sizing
**Numeric Range:** 25 (4px) to 8000 (1280px)
**Named Sizes:** 2xs through 4xl

## Purpose

This specification defines the sizing scale used for component dimensions, icon sizes, and other fixed-dimension use cases.

## Requirements

### Requirement: Size Tokens
The system SHALL provide size tokens for component dimensions.

#### Scenario: Numeric size scale
- **WHEN** requesting numeric size tokens
- **THEN** SHALL provide scale from 25 through 8000
- **AND** SHALL include: 25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 900, 1000, 1200, 1400, 1600, 2000, 2400, 3200, 4000, 4800, 6400, 8000

#### Scenario: Named size scale
- **WHEN** requesting named size tokens
- **THEN** SHALL provide semantic sizes: 2xs, xs, sm, md, lg, xl, 2xl, 3xl, 4xl
- **AND** SHALL map to appropriate numeric values
- **AND** SHALL use consistent naming with component size variants

#### Scenario: Token naming
- **WHEN** tokens are generated
- **THEN** numeric tokens SHALL use sizing.25, sizing.50, etc.
- **AND** named tokens SHALL use sizing.2xs, sizing.xs, etc.
- **AND** CSS variables SHALL use kebab-case: --sizing-25, --sizing-xs, etc.
- **AND** TypeScript exports SHALL use PascalCase category: Sizing.25, Sizing.xs, etc.

#### Scenario: Token values
- **WHEN** tokens are output
- **THEN** CSS format SHALL use pixel units (4px, 8px, etc.)
- **AND** TypeScript format SHALL use pixel string values ("4px", "8px", etc.)
- **AND** Chakra format SHALL wrap values in { value: "4px" } syntax

#### Scenario: Named size mappings
- **WHEN** named sizes are resolved
- **THEN** 2xs SHALL map to a smaller numeric value
- **AND** xs SHALL map to a small numeric value
- **AND** sm SHALL map to a small-medium numeric value
- **AND** md SHALL map to a medium numeric value
- **AND** lg SHALL map to a large numeric value
- **AND** xl SHALL map to an extra-large numeric value
- **AND** 2xl, 3xl, 4xl SHALL map to progressively larger numeric values
- **AND** mappings SHALL remain consistent across component implementations

#### Scenario: Component dimension usage
- **WHEN** components use sizing tokens
- **THEN** SHALL reference tokens using curly brace syntax: `{sizing.md}`
- **AND** SHALL support both numeric and named token references
- **AND** SHALL resolve to actual values during build
