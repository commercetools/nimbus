# Specification: nimbus-tokens-responsive

## Overview

Responsive tokens provide breakpoint definitions and aspect ratio presets that enable adaptive layouts and media-specific styling throughout the Nimbus design system.

**Parent Spec:** `../nimbus-tokens/spec.md`
**Token Categories:** breakpoints, aspectRatios
**Breakpoints:** 5 sizes (sm through 2xl)
**Aspect Ratios:** 6 presets (square through golden)

## Purpose

This specification defines responsive design tokens used for media queries, responsive layouts, and aspect ratio constraints.

## Requirements

### Requirement: Breakpoints
The system SHALL define responsive breakpoints.

#### Scenario: Breakpoint values
- **WHEN** requesting breakpoints
- **THEN** SHALL provide: sm (480px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

#### Scenario: Breakpoint naming
- **WHEN** tokens are generated
- **THEN** SHALL use semantic naming: breakpoints.sm, breakpoints.md, breakpoints.lg, breakpoints.xl, breakpoints.2xl
- **AND** CSS variables SHALL use kebab-case: --breakpoints-sm, --breakpoints-md, etc.
- **AND** TypeScript exports SHALL use PascalCase category: Breakpoints.sm, Breakpoints.md, etc.

#### Scenario: Breakpoint outputs
- **WHEN** tokens are output
- **THEN** CSS format SHALL use pixel units (480px, 768px, 1024px, 1280px, 1536px)
- **AND** TypeScript format SHALL use pixel string values ("480px", "768px", etc.)
- **AND** Chakra format SHALL wrap values in { value: "480px" } syntax

#### Scenario: Breakpoint usage
- **WHEN** components use breakpoints
- **THEN** SHALL apply mobile-first approach (min-width media queries)
- **AND** sm SHALL target small tablets and large phones
- **AND** md SHALL target tablets
- **AND** lg SHALL target small desktops and large tablets
- **AND** xl SHALL target standard desktops
- **AND** 2xl SHALL target large desktops and wide screens

#### Scenario: Breakpoint integration with Chakra
- **WHEN** breakpoints are used in Chakra theme
- **THEN** SHALL be compatible with Chakra's responsive prop syntax
- **AND** SHALL support responsive array syntax: [base, sm, md, lg, xl, 2xl]
- **AND** SHALL support responsive object syntax: { base: value, md: value, lg: value }

### Requirement: Aspect Ratios
The system SHALL provide aspect ratio presets.

#### Scenario: Aspect ratio values
- **WHEN** requesting aspect ratios
- **THEN** SHALL provide: square (1), landscape (1.3333), portrait (0.75), wide (1.7777), ultrawide (3.6), golden (1.618)

#### Scenario: Aspect ratio naming
- **WHEN** tokens are generated
- **THEN** SHALL use semantic naming: aspectRatios.square, aspectRatios.landscape, aspectRatios.portrait, aspectRatios.wide, aspectRatios.ultrawide, aspectRatios.golden
- **AND** CSS variables SHALL use kebab-case: --aspect-ratios-square, --aspect-ratios-landscape, etc.
- **AND** TypeScript exports SHALL use PascalCase category: AspectRatios.square, AspectRatios.landscape, etc.

#### Scenario: Aspect ratio outputs
- **WHEN** tokens are output
- **THEN** CSS format SHALL use unitless decimal values (1, 1.3333, 0.75, 1.7777, 3.6, 1.618)
- **AND** TypeScript format SHALL use string decimal values ("1", "1.3333", "0.75", etc.)
- **AND** Chakra format SHALL wrap values in { value: "1" } syntax

#### Scenario: Aspect ratio definitions
- **WHEN** aspect ratios are defined
- **THEN** square SHALL be 1:1 ratio (1)
- **AND** landscape SHALL be 4:3 ratio (1.3333)
- **AND** portrait SHALL be 3:4 ratio (0.75)
- **AND** wide SHALL be 16:9 ratio (1.7777)
- **AND** ultrawide SHALL be 18:5 ratio (3.6)
- **AND** golden SHALL be golden ratio (1.618)

#### Scenario: Aspect ratio usage
- **WHEN** components apply aspect ratios
- **THEN** SHALL use CSS aspect-ratio property
- **AND** SHALL support aspect ratio boxes/containers
- **AND** SHALL maintain proportions across different viewport sizes
- **AND** SHALL work with responsive images and video embeds

#### Scenario: Aspect ratio responsive behavior
- **WHEN** aspect ratios are used responsively
- **THEN** SHALL support different ratios at different breakpoints
- **AND** SHALL maintain content proportions during ratio changes
- **AND** SHALL integrate with Chakra responsive syntax
