# Specification: Code Component

## Overview

The Code component provides a styled container for displaying inline or block code snippets with monospace typography. It supports multiple visual variants, sizes, color palettes, and overflow behaviors for syntax highlighting and code presentation following the nimbus-core standards.

**Component:** `Code`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 1)
**React Aria:** Not used (non-interactive display component)

## Purpose

Code provides a visually distinct container for displaying programming code, configuration snippets, command-line examples, or technical identifiers. It enables users to quickly identify code content within text flow using monospace typography, syntax highlighting support, and configurable visual treatments for enhanced readability and context.

## Requirements

### Requirement: Text Content Display
The component SHALL display code text content with monospace font.

#### Scenario: Inline code content
- **WHEN** children prop contains code text
- **THEN** SHALL render text inside code element
- **AND** SHALL apply monospace font family (fontFamily: "mono")
- **AND** SHALL maintain inline display (display: inline-flex)
- **AND** SHALL fit naturally within text flow

#### Scenario: Block code content
- **WHEN** component is used as block element
- **THEN** SHALL render as standalone code block
- **AND** SHALL apply monospace font family
- **AND** SHALL preserve whitespace and line breaks
- **AND** SHALL support multi-line code display

#### Scenario: Empty content
- **WHEN** children prop is empty or not provided
- **THEN** SHALL render as empty code element
- **AND** SHALL maintain minimum dimensions based on size variant

### Requirement: Size Variants
The component SHALL support four size options.

#### Scenario: Extra-small size
- **WHEN** size="xs" is set
- **THEN** SHALL render with minimal padding (px: 100)
- **AND** SHALL use 2xs text style (textStyle: "2xs")
- **AND** SHALL have minimum height of 400 (design token)
- **AND** SHALL be suitable for inline code within small text

#### Scenario: Small size
- **WHEN** size="sm" is set
- **THEN** SHALL render with compact padding (px: 150)
- **AND** SHALL use xs text style (textStyle: "xs")
- **AND** SHALL have minimum height of 500 (design token)
- **AND** SHALL be suitable for inline code within body text

#### Scenario: Medium size
- **WHEN** size="md" is set (default)
- **THEN** SHALL render with standard padding (px: 200)
- **AND** SHALL use sm text style (textStyle: "sm")
- **AND** SHALL have minimum height of 600 (design token)
- **AND** SHALL be suitable for most code display contexts

#### Scenario: Large size
- **WHEN** size="lg" is set
- **THEN** SHALL render with generous padding (px: 250)
- **AND** SHALL use sm text style (textStyle: "sm")
- **AND** SHALL have minimum height of 700 (design token)
- **AND** SHALL be suitable for emphasized code examples

### Requirement: Visual Variants
The component SHALL support five visual style options.

#### Scenario: Solid variant
- **WHEN** variant="solid" is set (default)
- **THEN** SHALL use color scale 4 for background (colorPalette.4)
- **AND** SHALL use color scale 11 for text (colorPalette.11)
- **AND** SHALL provide high visual prominence
- **AND** SHALL maintain WCAG AA contrast ratios

#### Scenario: Subtle variant
- **WHEN** variant="subtle" is set
- **THEN** SHALL use color scale 3 for background (colorPalette.3)
- **AND** SHALL use color scale 11 for text (colorPalette.11)
- **AND** SHALL provide softer visual treatment
- **AND** SHALL maintain WCAG AA contrast ratios

#### Scenario: Outline variant
- **WHEN** variant="outline" is set
- **THEN** SHALL use foreground color for text (colorPalette.fg)
- **AND** SHALL apply 1px inset border via shadow (shadow: "inset 0 0 0px 1px")
- **AND** SHALL use muted color for border (shadowColor: colorPalette.muted)
- **AND** SHALL have no background fill

#### Scenario: Surface variant
- **WHEN** variant="surface" is set
- **THEN** SHALL use subtle background (bg: colorPalette.subtle)
- **AND** SHALL use foreground color for text (colorPalette.fg)
- **AND** SHALL apply 1px inset border via shadow
- **AND** SHALL use muted color for border (shadowColor: colorPalette.muted)

#### Scenario: Plain variant
- **WHEN** variant="plain" is set
- **THEN** SHALL use foreground color only (colorPalette.fg)
- **AND** SHALL have no background or border
- **AND** SHALL rely on monospace font for visual distinction

### Requirement: Color Palette Support
The component SHALL support all semantic and system color palettes.

#### Scenario: Semantic colors
- **WHEN** colorPalette prop is set to semantic value
- **THEN** SHALL accept: primary, neutral, info, positive, warning, critical
- **AND** SHALL use appropriate color scales per variant definition
- **AND** SHALL maintain WCAG AA contrast ratios (4.5:1 for normal text)
- **AND** SHALL support light and dark modes via semantic tokens

#### Scenario: System colors
- **WHEN** colorPalette prop is set to system color
- **THEN** SHALL accept all Radix color scales (grass, tomato, blue, amber, mint, pink, teal, etc.)
- **AND** SHALL apply same color formula per variant
- **AND** SHALL maintain consistent visual weight across colors

#### Scenario: Default color
- **WHEN** colorPalette prop is not provided
- **THEN** SHALL use a sensible default color palette
- **AND** SHALL maintain consistent appearance with default variant

### Requirement: Shape and Borders
The component SHALL provide consistent border radius.

#### Scenario: Border radius
- **WHEN** component renders
- **THEN** SHALL apply border-radius 100 (design token)
- **AND** SHALL provide subtle rounded corners
- **AND** SHALL maintain consistent corner treatment across sizes

### Requirement: Whitespace Handling
The component SHALL preserve code formatting and whitespace.

#### Scenario: Whitespace preservation
- **WHEN** code content includes spaces, tabs, or line breaks
- **THEN** SHALL preserve whitespace formatting
- **AND** SHALL maintain code indentation
- **AND** SHALL support pre-formatted text display
- **AND** SHALL not collapse multiple spaces

#### Scenario: Line break handling
- **WHEN** code content includes multiple lines
- **THEN** SHALL preserve line breaks
- **AND** SHALL display multi-line code correctly
- **AND** SHALL maintain vertical spacing between lines

### Requirement: Overflow Behavior
The component SHALL handle content overflow appropriately.

#### Scenario: Horizontal overflow
- **WHEN** code content exceeds container width
- **THEN** SHALL support overflow scrolling when configured
- **AND** SHALL wrap text when appropriate
- **AND** SHALL maintain readability of long code lines
- **AND** consumers MAY apply overflow styles via style props

#### Scenario: Vertical overflow
- **WHEN** code content exceeds container height
- **THEN** SHALL support vertical scrolling when configured
- **AND** SHALL maintain consistent height behavior
- **AND** consumers MAY apply maxHeight via style props

### Requirement: Element Type Flexibility
The component SHALL support rendering as different HTML elements.

#### Scenario: Default element
- **WHEN** as prop is not provided
- **THEN** SHALL render as code element
- **AND** SHALL be semantically correct for code content
- **AND** SHALL be suitable for inline use

#### Scenario: Custom element
- **WHEN** as prop is provided (e.g., as="pre", as="div")
- **THEN** SHALL render as specified element
- **AND** SHALL maintain code styling
- **AND** SHALL forward appropriate HTML attributes
- **AND** SHALL preserve semantic meaning

### Requirement: Syntax Highlighting Support
The component SHALL enable syntax highlighting integration.

#### Scenario: Consumer-provided highlighting
- **WHEN** consumer wraps component with syntax highlighter
- **THEN** SHALL support nested highlighting elements
- **AND** SHALL maintain base code styling
- **AND** SHALL not interfere with highlighter styling
- **AND** SHALL preserve monospace font and spacing

#### Scenario: Language indication
- **WHEN** component is used with language-specific code
- **THEN** MAY accept custom attributes for language metadata
- **AND** consumers MAY add data-language or className for highlighters
- **AND** SHALL forward all data-* attributes

### Requirement: Copy Button Integration
The component SHALL support integration with copy functionality.

#### Scenario: Copy button placement
- **WHEN** consumer adds copy button
- **THEN** SHALL accept children composition with buttons
- **AND** SHALL maintain code content layout
- **AND** copy button MAY be positioned via consumer styling
- **AND** SHALL not constrain copy button patterns

### Requirement: Line Numbers Support
The component SHALL enable line number display.

#### Scenario: Line number integration
- **WHEN** consumer adds line numbers
- **THEN** SHALL support composition with line number elements
- **AND** SHALL maintain code alignment
- **AND** line numbers MAY be implemented via consumer composition
- **AND** SHALL preserve code formatting with line numbers

### Requirement: Display Characteristics
The component SHALL provide consistent layout behavior.

#### Scenario: Inline display
- **WHEN** component renders as inline code
- **THEN** SHALL use inline-flex display
- **AND** SHALL align vertically in middle (vertical-align: middle)
- **AND** SHALL align items center (align-items: center)
- **AND** SHALL fit naturally within text flow

#### Scenario: Block display
- **WHEN** component renders as block code
- **THEN** SHALL support block-level display via style props
- **AND** SHALL maintain full-width when configured
- **AND** SHALL support margin and padding customization

### Requirement: Ref Support
The component SHALL forward refs to the root element.

#### Scenario: Ref forwarding
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to underlying code element
- **AND** SHALL support React.Ref<HTMLElement> type
- **AND** SHALL enable direct DOM manipulation when needed

### Requirement: Recipe-Based Styling
The component SHALL use Chakra UI single-slot recipe per nimbus-core standards.

#### Scenario: Recipe application
- **WHEN** component renders
- **THEN** SHALL apply code recipe from theme/recipes/code.ts
- **AND** recipe SHALL be registered in theme configuration
- **AND** SHALL support recipe props: size, variant, colorPalette
- **AND** SHALL use Chakra defineRecipe for recipe definition

#### Scenario: Base styles
- **WHEN** recipe applies
- **THEN** SHALL apply consistent base styles (fontFamily, display, alignItems, borderRadius)
- **AND** SHALL use design tokens for all values
- **AND** SHALL not use hardcoded colors or spacing

### Requirement: Custom Styling
The component SHALL accept Chakra style props.

#### Scenario: Style prop override
- **WHEN** style props are provided
- **THEN** SHALL accept all Chakra style props (margin, padding, width, maxWidth, etc.)
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL support overflow and whitespace control

### Requirement: Semantic HTML
The component SHALL use appropriate semantic elements per nimbus-core standards.

#### Scenario: Non-interactive code
- **WHEN** code is display-only (default)
- **THEN** SHALL render as code element
- **AND** SHALL be announced by screen readers as code content
- **AND** SHALL provide semantic meaning for assistive technology
- **AND** MAY include aria-label for additional context

#### Scenario: Interactive code
- **WHEN** code is wrapped in interactive element
- **THEN** SHALL maintain code semantics
- **AND** SHALL support keyboard navigation of wrapper
- **AND** SHALL provide accessible names for interactions

### Requirement: Accessibility Considerations
The component SHALL meet WCAG AA requirements per nimbus-core standards.

#### Scenario: Text contrast
- **WHEN** component renders with any color palette
- **THEN** SHALL maintain 4.5:1 contrast ratio for text (normal size)
- **AND** SHALL use appropriate color scales per variant
- **AND** SHALL meet contrast requirements in both light and dark modes

#### Scenario: Screen reader support
- **WHEN** assistive technology encounters code element
- **THEN** SHALL announce as code content semantically
- **AND** SHALL read content character-by-character when appropriate
- **AND** SHALL support navigation by code blocks

### Requirement: Testing and Metadata Support
The component SHALL accept data attributes.

#### Scenario: Data attributes
- **WHEN** data-* attributes are provided
- **THEN** SHALL forward all data attributes to root element
- **AND** SHALL support testing attributes (data-testid)
- **AND** SHALL support custom metadata attributes (data-language, data-filename)

### Requirement: Type Safety
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** component is imported
- **THEN** SHALL export CodeProps interface
- **AND** SHALL include JSDoc comments for all props
- **AND** SHALL extend HTMLChakraProps<"code", CodeRecipeProps>
- **AND** SHALL support ref type React.Ref<HTMLElement>

#### Scenario: Recipe props
- **WHEN** component uses recipe
- **THEN** SHALL export CodeRecipeProps type
- **AND** SHALL include size variant autocomplete (xs, sm, md, lg)
- **AND** SHALL include variant autocomplete (solid, subtle, outline, surface, plain)
- **AND** SHALL support colorPalette autocomplete

### Requirement: Theme Registration
The component recipe SHALL be registered in theme configuration per nimbus-core standards.

#### Scenario: Recipe registration
- **WHEN** component is added to package
- **THEN** recipe SHALL be manually registered in theme/recipes/index.ts
- **AND** SHALL be included in recipes object export
- **AND** CRITICAL: registration SHALL not be automatic (no auto-discovery)
- **AND** SHALL validate recipe is registered before component usage

### Requirement: Experimental Status
The component SHALL indicate experimental status in documentation.

#### Scenario: Experimental marking
- **WHEN** component is documented
- **THEN** SHALL include @experimental JSDoc tag
- **AND** SHALL warn that component may change or be removed
- **AND** SHALL communicate stability expectations to consumers
