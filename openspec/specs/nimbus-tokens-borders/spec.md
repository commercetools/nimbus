# Specification: nimbus-tokens-borders

## Overview

Border tokens provide border radius scales, border width scales, and pre-composed border definitions that establish consistent edge treatments throughout the Nimbus design system.

**Parent Spec:** `../nimbus-tokens/spec.md`
**Token Categories:** radii, borderWidths, borders
**Radius Range:** 50 (2px) to 600 (24px) + full (900px)
**Width Range:** 25 (1px) to 100 (4px)

## Purpose

This specification defines border-related tokens used for component shapes, outlines, and decorative treatments.

## Requirements

### Requirement: Border Radius Scale
The system SHALL provide border radius values.

#### Scenario: Radius values
- **WHEN** requesting border radius
- **THEN** SHALL provide scale from 50 (2px) through 600 (24px)
- **AND** SHALL include: 50, 100, 150, 200, 300, 400, 500, 600
- **AND** SHALL include `full` value (900px) for pill shapes

#### Scenario: Radius naming
- **WHEN** tokens are generated
- **THEN** SHALL use numeric naming: radii.50, radii.100, radii.full
- **AND** CSS variables SHALL use kebab-case: --radii-50, --radii-100, --radii-full
- **AND** TypeScript exports SHALL use PascalCase category: Radii.50, Radii.100, Radii.full

#### Scenario: Radius outputs
- **WHEN** tokens are output
- **THEN** CSS format SHALL use pixel units (2px, 4px, etc.) or 900px for full
- **AND** TypeScript format SHALL use pixel string values ("2px", "4px", "900px")
- **AND** Chakra format SHALL wrap values in { value: "2px" } syntax

#### Scenario: Full radius behavior
- **WHEN** radii.full is applied
- **THEN** SHALL use 900px value (large enough to create circular/pill shapes)
- **AND** SHALL create fully rounded ends on rectangular elements
- **AND** SHALL create perfect circles on square elements

### Requirement: Border Width Scale
The system SHALL provide border width values.

#### Scenario: Border widths
- **WHEN** requesting border width
- **THEN** SHALL provide: 25 (1px), 50 (2px), 75 (3px), 100 (4px)

#### Scenario: Width naming
- **WHEN** tokens are generated
- **THEN** SHALL use numeric naming: borderWidths.25, borderWidths.50, etc.
- **AND** CSS variables SHALL use kebab-case: --border-widths-25, --border-widths-50, etc.
- **AND** TypeScript exports SHALL use PascalCase category: BorderWidths.25, BorderWidths.50, etc.

#### Scenario: Width outputs
- **WHEN** tokens are output
- **THEN** CSS format SHALL use pixel units (1px, 2px, 3px, 4px)
- **AND** TypeScript format SHALL use pixel string values ("1px", "2px", "3px", "4px")
- **AND** Chakra format SHALL wrap values in { value: "1px" } syntax

### Requirement: Pre-Composed Borders
The system SHALL provide complete border definitions.

#### Scenario: Border tokens
- **WHEN** requesting pre-composed border
- **THEN** SHALL combine borderWidth with "solid" style
- **AND** SHALL provide: solid-25, solid-50, solid-75, solid-100

#### Scenario: Border composition
- **WHEN** a pre-composed border is accessed
- **THEN** SHALL reference borderWidths token: `{borderWidths.25}`
- **AND** SHALL append "solid" keyword
- **AND** SHALL resolve to complete border shorthand value (e.g., "1px solid")

#### Scenario: Border naming
- **WHEN** pre-composed borders are generated
- **THEN** SHALL use naming: borders.solid-25, borders.solid-50, etc.
- **AND** CSS variables SHALL use kebab-case: --borders-solid-25, --borders-solid-50, etc.
- **AND** TypeScript exports SHALL use PascalCase category: Borders["solid-25"], Borders["solid-50"], etc.

#### Scenario: Border outputs
- **WHEN** tokens are output
- **THEN** CSS format SHALL use border shorthand syntax: "1px solid", "2px solid", etc.
- **AND** TypeScript format SHALL use string values: "1px solid", "2px solid", etc.
- **AND** Chakra format SHALL wrap values in { value: "1px solid" } syntax

#### Scenario: Border color application
- **WHEN** components use pre-composed borders
- **THEN** SHALL only define width and style (not color)
- **AND** SHALL allow border-color to be set separately
- **AND** SHALL support color application via component styles or semantic tokens
