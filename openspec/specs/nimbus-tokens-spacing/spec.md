# Specification: nimbus-tokens-spacing

## Overview

Spacing tokens provide a comprehensive scale based on an 8px grid system, enabling consistent spatial relationships throughout the Nimbus design system.

**Parent Spec:** `../nimbus-tokens/spec.md`
**Token Category:** spacing
**Scale Range:** 25 (4px) to 6400 (1024px)
**Grid Base:** 8px

## Purpose

This specification defines the spacing scale used for margins, padding, gaps, and other spatial properties in component layouts.

## Requirements

### Requirement: Spacing Scale
The system SHALL provide comprehensive spacing values based on 8px grid.

#### Scenario: Spacing values
- **WHEN** requesting spacing tokens
- **THEN** SHALL provide scale from 25 (4px) to 6400 (1024px)
- **AND** SHALL follow pattern: 25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 900, 1000, 1200, 1400, 1600, 2000, 2400, 3200, 4000, 4800, 6400

#### Scenario: Token naming
- **WHEN** tokens are generated
- **THEN** SHALL use numeric naming: spacing.25, spacing.50, etc.
- **AND** CSS variables SHALL use kebab-case: --spacing-25, --spacing-50, etc.
- **AND** TypeScript exports SHALL use PascalCase category: Spacing.25, Spacing.50, etc.

#### Scenario: Token values
- **WHEN** tokens are output
- **THEN** CSS format SHALL use pixel units (4px, 8px, etc.)
- **AND** TypeScript format SHALL use pixel string values ("4px", "8px", etc.)
- **AND** Chakra format SHALL wrap values in { value: "4px" } syntax

#### Scenario: Grid alignment
- **WHEN** spacing values are used
- **THEN** SHALL align to 8px grid for values 50 and above
- **AND** 25 (4px) SHALL be the only half-grid value for fine-tuned spacing
- **AND** SHALL maintain consistent visual rhythm across components

#### Scenario: Spacing composition
- **WHEN** components use spacing tokens
- **THEN** SHALL reference tokens using curly brace syntax in source: `{spacing.100}`
- **AND** SHALL resolve to actual values during build
- **AND** SHALL support token references in composite tokens (shadows, layouts, etc.)
