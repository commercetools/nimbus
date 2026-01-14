# Specification: Badge Component

## Overview

The Badge component provides a small, visually distinct label for displaying status, category, counts, or metadata. It supports multiple visual variants, sizes, color palettes, and icon integration following the nimbus-core standards.

**Component:** `Badge`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 1)
**React Aria:** Not used (non-interactive display component)

## Purpose

Badge provides a concise visual indicator to highlight status, category, counts, or metadata associated with UI elements. It enables users to quickly identify important attributes without reading detailed text, using color-coded styling and compact formatting for at-a-glance comprehension.

## Requirements

### Requirement: Text and Number Content
The component SHALL display text or numeric content.

#### Scenario: Text content
- **WHEN** children prop contains text
- **THEN** SHALL render text inside badge
- **AND** SHALL apply appropriate typography styles
- **AND** SHALL maintain single-line display with no wrapping

#### Scenario: Number content
- **WHEN** children prop contains numeric value
- **THEN** SHALL render number with consistent formatting
- **AND** SHALL maintain alignment and spacing

#### Scenario: Empty content
- **WHEN** children prop is empty or not provided
- **THEN** SHALL render as empty badge (typically for dot-only indicators)
- **AND** SHALL maintain minimum dimensions for visibility

### Requirement: Size Variants
The component SHALL support three size options.

#### Scenario: 2x-small size
- **WHEN** size="2xs" is set
- **THEN** SHALL render with minimal padding and smallest font (300)
- **AND** SHALL have height of 600 (design token)
- **AND** icon size SHALL be 400x400 (design token)
- **AND** SHALL be suitable for dense layouts with multiple badges

#### Scenario: X-small size
- **WHEN** size="xs" is set
- **THEN** SHALL render with compact padding and small font (350)
- **AND** SHALL have height of 800 (design token)
- **AND** icon size SHALL be 500x500 (design token)
- **AND** SHALL be suitable for list items and tables

#### Scenario: Medium size
- **WHEN** size="md" is set (default)
- **THEN** SHALL render with standard padding and font (400)
- **AND** SHALL have height of 1000 (design token)
- **AND** icon size SHALL be 600x600 (design token)
- **AND** SHALL be suitable for most UI contexts

### Requirement: Color Palette Support
The component SHALL support all semantic and system color palettes.

#### Scenario: Semantic colors
- **WHEN** colorPalette prop is set to semantic value
- **THEN** SHALL accept: primary, neutral, info, positive, warning, critical
- **AND** SHALL use color scale 3 for background (colorPalette.3)
- **AND** SHALL use color scale 11 for text (colorPalette.11)
- **AND** SHALL maintain WCAG AA contrast ratios (4.5:1 for normal text)
- **AND** SHALL support light and dark modes via semantic tokens

#### Scenario: System colors
- **WHEN** colorPalette prop is set to system color
- **THEN** SHALL accept all Radix color scales (grass, tomato, blue, amber, mint, pink, teal, etc.)
- **AND** SHALL apply same color formula (scale 3 for background, scale 11 for text)
- **AND** SHALL maintain consistent visual weight across colors

#### Scenario: Default color
- **WHEN** colorPalette prop is not provided
- **THEN** SHALL use a sensible default color palette
- **AND** SHALL maintain consistent appearance

### Requirement: Shape Variants
The component SHALL support pill-shaped design.

#### Scenario: Pill shape
- **WHEN** badge renders
- **THEN** SHALL apply pill shape with border-radius 200 (design token)
- **AND** SHALL maintain circular ends regardless of content length
- **AND** SHALL provide smooth, rounded appearance

### Requirement: Icon Integration
The component SHALL support icons from @commercetools/nimbus-icons.

#### Scenario: Leading icon
- **WHEN** icon is placed before text in children
- **THEN** SHALL render icon before badge text
- **AND** SHALL apply appropriate gap spacing (100-200 based on size)
- **AND** icon SHALL use fixed dimensions based on size variant
- **AND** icon SHALL not shrink (flexShrink: 0)

#### Scenario: Trailing icon
- **WHEN** icon is placed after text in children
- **THEN** SHALL render icon after badge text
- **AND** SHALL apply appropriate gap spacing
- **AND** SHALL maintain consistent alignment with text

#### Scenario: Both leading and trailing icons
- **WHEN** icons are placed on both sides of text
- **THEN** SHALL render icons on both sides with proper spacing
- **AND** SHALL maintain center alignment of text content
- **AND** SHALL distribute spacing evenly

#### Scenario: Icon-only badge
- **WHEN** children contains only icon with no text
- **THEN** SHALL render as icon-only badge
- **AND** SHALL maintain square-like proportions
- **AND** SHALL require aria-label for accessibility
- **AND** SHOULD provide tooltip for context

### Requirement: Display Characteristics
The component SHALL provide consistent layout behavior.

#### Scenario: Inline display
- **WHEN** badge renders
- **THEN** SHALL use inline-flex display
- **AND** SHALL align vertically in middle (vertical-align: middle)
- **AND** SHALL fit naturally within text flow

#### Scenario: Content alignment
- **WHEN** badge contains content
- **THEN** SHALL center-align items horizontally (justify-content: center)
- **AND** SHALL center-align items vertically (align-items: center)
- **AND** SHALL prevent text wrapping (white-space: nowrap)

#### Scenario: Width behavior
- **WHEN** badge renders with content
- **THEN** SHALL auto-adjust width to content (width: auto)
- **AND** SHALL respect horizontal padding
- **AND** SHALL not expand beyond necessary dimensions

### Requirement: Element Type Flexibility
The component SHALL support rendering as different HTML elements.

#### Scenario: Default element
- **WHEN** as prop is not provided
- **THEN** SHALL render as span element
- **AND** SHALL be suitable for inline use

#### Scenario: Custom element
- **WHEN** as prop is provided (e.g., as="a", as="button")
- **THEN** SHALL render as specified element
- **AND** SHALL maintain badge styling
- **AND** SHALL forward appropriate HTML attributes
- **AND** SHALL preserve accessibility semantics

### Requirement: Clickable Badge Support
The component SHALL support interactive behavior when rendered as clickable element.

#### Scenario: Button-like badge
- **WHEN** rendered as button (as="button")
- **THEN** SHALL be fully interactive and focusable
- **AND** SHALL provide visible focus indicators meeting 3:1 contrast ratio
- **AND** SHALL support keyboard activation (Enter, Space)
- **AND** SHALL support onClick handler

#### Scenario: Link badge
- **WHEN** rendered as link (as="a")
- **THEN** SHALL accept href and other anchor attributes
- **AND** SHALL be keyboard navigable
- **AND** SHALL provide appropriate focus styles

### Requirement: Non-Interactive Behavior
The component SHALL prevent unintended text selection.

#### Scenario: Text selection prevention
- **WHEN** user attempts to select badge text
- **THEN** SHALL prevent text selection (user-select: none)
- **AND** SHALL maintain clickability when interactive
- **AND** SHALL not interfere with surrounding text selection

### Requirement: Ref Support
The component SHALL forward refs to the root element.

#### Scenario: Ref forwarding
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to underlying span element
- **AND** SHALL merge with internal ref using mergeRefs
- **AND** SHALL support React.Ref<HTMLSpanElement> type

### Requirement: Recipe-Based Styling
The component SHALL use Chakra UI single-slot recipe per nimbus-core standards.

#### Scenario: Recipe application
- **WHEN** component renders
- **THEN** SHALL apply badge recipe from theme/recipes/badge.ts
- **AND** recipe SHALL be registered in theme configuration
- **AND** SHALL support recipe props: size, colorPalette
- **AND** SHALL use createRecipeContext for Chakra integration

#### Scenario: Base styles
- **WHEN** recipe applies
- **THEN** SHALL apply consistent base styles (display, alignment, border-radius, font-weight)
- **AND** SHALL use design tokens for all values
- **AND** SHALL not use hardcoded colors or spacing

### Requirement: Custom Styling
The component SHALL accept Chakra style props.

#### Scenario: Style prop override
- **WHEN** style props are provided
- **THEN** SHALL accept all Chakra style props (margin, width, etc.)
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults

### Requirement: Semantic HTML
The component SHALL use appropriate semantic elements per nimbus-core standards.

#### Scenario: Non-interactive badge
- **WHEN** badge is display-only (default span)
- **THEN** SHALL not require ARIA role
- **AND** SHALL be announced by screen readers as text content
- **AND** MAY include aria-label for additional context

#### Scenario: Interactive badge
- **WHEN** badge is interactive (button or link)
- **THEN** SHALL provide accessible name from children or aria-label
- **AND** SHALL be keyboard navigable
- **AND** SHALL provide visible focus indicator

### Requirement: Color Accessibility
The component SHALL meet WCAG AA contrast requirements per nimbus-core standards.

#### Scenario: Text contrast
- **WHEN** badge renders with any color palette
- **THEN** SHALL maintain 4.5:1 contrast ratio for text (normal size)
- **AND** SHALL use color scale 11 for text against scale 3 background
- **AND** SHALL meet contrast requirements in both light and dark modes

### Requirement: Icon-Only Badges
The component SHALL provide accessible labels for icon-only usage.

#### Scenario: Icon without text
- **WHEN** badge contains only icon
- **THEN** SHALL require aria-label prop for screen reader context
- **AND** SHOULD provide tooltip for visual users
- **AND** SHALL announce meaningful description to assistive technology

### Requirement: Testing and Metadata Support
The component SHALL accept data attributes.

#### Scenario: Data attributes
- **WHEN** data-* attributes are provided
- **THEN** SHALL forward all data attributes to root element
- **AND** SHALL support testing attributes (data-testid)
- **AND** SHALL support custom metadata attributes

### Requirement: Type Safety
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** component is imported
- **THEN** SHALL export BadgeProps interface
- **AND** SHALL include JSDoc comments for all props
- **AND** SHALL extend HTMLChakraProps<"span", BadgeRecipeProps>
- **AND** SHALL support ref type React.Ref<HTMLSpanElement>

#### Scenario: Recipe props
- **WHEN** component uses recipe
- **THEN** SHALL export BadgeRecipeProps type
- **AND** SHALL include size variant autocomplete
- **AND** SHALL support colorPalette autocomplete

### Requirement: Theme Registration
The component recipe SHALL be registered in theme configuration per nimbus-core standards.

#### Scenario: Recipe registration
- **WHEN** component is added to package
- **THEN** recipe SHALL be manually registered in theme/recipes/index.ts
- **AND** SHALL be included in recipes object export
- **AND** CRITICAL: registration SHALL not be automatic (no auto-discovery)
