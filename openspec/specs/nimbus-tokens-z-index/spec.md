# Specification: nimbus-tokens-z-index

## Overview

Z-index tokens provide semantic layering values that establish consistent stacking order for UI elements throughout the Nimbus design system.

**Parent Spec:** `../nimbus-tokens/spec.md`
**Token Category:** zIndex
**Range:** -1 (hide) to 2147483647 (max)
**Layering Levels:** 13 semantic values

## Purpose

This specification defines z-index tokens used to control element stacking order and create predictable layering hierarchies for overlays, dropdowns, modals, and other positioned elements.

## Requirements

### Requirement: Layering Tokens
The system SHALL provide semantic z-index values for UI layering.

#### Scenario: Z-index hierarchy
- **WHEN** components use z-index
- **THEN** SHALL provide semantic values: hide (-1), base (0), docked (10), dropdown (1000), sticky (1100), banner (1200), overlay (1300), modal (1400), popover (1500), skipNav (1600), toast (1700), tooltip (1800), max (2147483647)

#### Scenario: Z-index naming
- **WHEN** tokens are generated
- **THEN** SHALL use semantic naming: zIndex.hide, zIndex.base, zIndex.docked, zIndex.dropdown, zIndex.sticky, zIndex.banner, zIndex.overlay, zIndex.modal, zIndex.popover, zIndex.skipNav, zIndex.toast, zIndex.tooltip, zIndex.max
- **AND** CSS variables SHALL use kebab-case: --z-index-hide, --z-index-base, --z-index-dropdown, etc.
- **AND** TypeScript exports SHALL use PascalCase category: ZIndex.hide, ZIndex.base, ZIndex.dropdown, etc.

#### Scenario: Z-index outputs
- **WHEN** tokens are output
- **THEN** CSS format SHALL use unitless integer values (-1, 0, 10, 1000, etc.)
- **AND** TypeScript format SHALL use string integer values ("-1", "0", "10", "1000", etc.)
- **AND** Chakra format SHALL wrap values in { value: "-1" } syntax

#### Scenario: Hide layer
- **WHEN** zIndex.hide is applied
- **THEN** SHALL use value -1
- **AND** SHALL place element below base layer
- **AND** SHALL be used for visually hidden but accessible elements

#### Scenario: Base layer
- **WHEN** zIndex.base is applied
- **THEN** SHALL use value 0
- **AND** SHALL represent default stacking context
- **AND** SHALL be used for standard page content

#### Scenario: Docked layer
- **WHEN** zIndex.docked is applied
- **THEN** SHALL use value 10
- **AND** SHALL be used for docked elements (persistent headers, footers)
- **AND** SHALL appear above base content

#### Scenario: Dropdown layer
- **WHEN** zIndex.dropdown is applied
- **THEN** SHALL use value 1000
- **AND** SHALL be used for dropdown menus and select options
- **AND** SHALL appear above docked elements

#### Scenario: Sticky layer
- **WHEN** zIndex.sticky is applied
- **THEN** SHALL use value 1100
- **AND** SHALL be used for sticky positioned elements
- **AND** SHALL appear above dropdowns

#### Scenario: Banner layer
- **WHEN** zIndex.banner is applied
- **THEN** SHALL use value 1200
- **AND** SHALL be used for notification banners and alerts
- **AND** SHALL appear above sticky elements

#### Scenario: Overlay layer
- **WHEN** zIndex.overlay is applied
- **THEN** SHALL use value 1300
- **AND** SHALL be used for backdrop overlays
- **AND** SHALL appear below modals but above standard content

#### Scenario: Modal layer
- **WHEN** zIndex.modal is applied
- **THEN** SHALL use value 1400
- **AND** SHALL be used for modal dialogs
- **AND** SHALL appear above overlay layer

#### Scenario: Popover layer
- **WHEN** zIndex.popover is applied
- **THEN** SHALL use value 1500
- **AND** SHALL be used for popover menus and floating panels
- **AND** SHALL appear above modals

#### Scenario: SkipNav layer
- **WHEN** zIndex.skipNav is applied
- **THEN** SHALL use value 1600
- **AND** SHALL be used for skip navigation links
- **AND** SHALL appear above popovers for accessibility

#### Scenario: Toast layer
- **WHEN** zIndex.toast is applied
- **THEN** SHALL use value 1700
- **AND** SHALL be used for toast notifications
- **AND** SHALL appear above most UI elements

#### Scenario: Tooltip layer
- **WHEN** zIndex.tooltip is applied
- **THEN** SHALL use value 1800
- **AND** SHALL be used for tooltips
- **AND** SHALL appear above toasts as highest priority informational element

#### Scenario: Max layer
- **WHEN** zIndex.max is applied
- **THEN** SHALL use value 2147483647 (JavaScript max safe integer for z-index)
- **AND** SHALL be used for critical elements that must appear above everything
- **AND** SHALL be used sparingly for emergency overlays or debugging

#### Scenario: Layering consistency
- **WHEN** multiple components use z-index tokens
- **THEN** SHALL maintain predictable stacking order
- **AND** SHALL prevent z-index conflicts between components
- **AND** SHALL support nested stacking contexts
- **AND** SHALL document which components use which layers
