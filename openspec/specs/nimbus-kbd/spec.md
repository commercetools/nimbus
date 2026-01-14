# Specification: Kbd Component

## Overview

The Kbd component provides a styled container for displaying keyboard keys and shortcuts with button-like visual styling. It supports monospace typography and visual distinction to represent keyboard input within instructional or technical content following the nimbus-core standards.

**Component:** `Kbd`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 1)
**React Aria:** Not used (non-interactive display component)

## Purpose

Kbd provides semantic and visual representation of keyboard input such as shortcuts, key presses, or key combinations. It enables users to quickly identify keyboard-related instructions within text using monospace typography and distinctive button-like styling with borders for enhanced clarity and recognizability.

## Requirements

### Requirement: Text Content Display
The component SHALL display keyboard key text content with monospace font.

#### Scenario: Single key display
- **WHEN** children prop contains single key text
- **THEN** SHALL render text inside kbd element
- **AND** SHALL apply monospace font family (fontFamily: "mono")
- **AND** SHALL maintain inline display (display: inline-flex)
- **AND** SHALL fit naturally within text flow

#### Scenario: Key combination display
- **WHEN** children prop contains multiple keys with separators
- **THEN** SHALL render each key segment with consistent styling
- **AND** SHALL preserve separator characters (e.g., "+", "-")
- **AND** SHALL maintain monospace font for all text content
- **AND** SHALL display inline with proper spacing

#### Scenario: Empty content
- **WHEN** children prop is empty or not provided
- **THEN** SHALL render as empty kbd element
- **AND** SHALL maintain minimum dimensions based on styling

### Requirement: Monospace Typography
The component SHALL use monospace font for all keyboard key content.

#### Scenario: Font family application
- **WHEN** component renders
- **THEN** SHALL apply monospace font family token (fontFamily: "mono")
- **AND** SHALL use relative font size (.875em) for inline scaling
- **AND** SHALL use line-height of 1 for compact rendering
- **AND** SHALL use medium font weight (500) for visual emphasis

#### Scenario: Text rendering
- **WHEN** keyboard keys are displayed
- **THEN** SHALL render characters with monospace spacing
- **AND** SHALL maintain consistent character width
- **AND** SHALL prevent text wrapping (whiteSpace: nowrap)
- **AND** SHALL ensure legibility at inline text sizes

### Requirement: Visual Styling
The component SHALL provide button-like visual styling with borders.

#### Scenario: Border treatment
- **WHEN** component renders
- **THEN** SHALL apply solid border on all sides (border: "solid-25")
- **AND** SHALL apply thicker bottom border (borderBottom: "solid-50")
- **AND** SHALL use currentColor for border color
- **AND** SHALL create button-like depth appearance

#### Scenario: Border radius
- **WHEN** component renders
- **THEN** SHALL apply border-radius 100 (design token)
- **AND** SHALL provide subtle rounded corners
- **AND** SHALL maintain consistent corner treatment

#### Scenario: Color inheritance
- **WHEN** component renders
- **THEN** SHALL inherit text color from parent (color: "inherit")
- **AND** SHALL use inherited color for border
- **AND** SHALL adapt to surrounding text color
- **AND** SHALL support light and dark modes via color inheritance

### Requirement: Spacing and Padding
The component SHALL apply consistent internal spacing.

#### Scenario: Horizontal padding
- **WHEN** component renders
- **THEN** SHALL apply horizontal padding of 150 (design token)
- **AND** SHALL provide adequate space around key text
- **AND** SHALL maintain button-like appearance

#### Scenario: Vertical padding
- **WHEN** component renders
- **THEN** SHALL apply vertical padding of 100 (design token)
- **AND** SHALL balance height with inline text
- **AND** SHALL create compact vertical footprint

### Requirement: Display Characteristics
The component SHALL provide consistent layout behavior.

#### Scenario: Inline display
- **WHEN** component renders
- **THEN** SHALL use inline-flex display
- **AND** SHALL align items center (align-items: center)
- **AND** SHALL fit naturally within text flow
- **AND** SHALL support vertical alignment with surrounding text

#### Scenario: Flex shrink behavior
- **WHEN** component is in flex container
- **THEN** SHALL not shrink (flexShrink: 0)
- **AND** SHALL maintain minimum dimensions
- **AND** SHALL prevent key text truncation

#### Scenario: Text wrapping prevention
- **WHEN** component contains key text
- **THEN** SHALL prevent wrapping (whiteSpace: nowrap)
- **AND** SHALL keep key labels intact
- **AND** SHALL maintain single-line display

### Requirement: User Interaction Prevention
The component SHALL prevent unintended user interactions.

#### Scenario: Text selection prevention
- **WHEN** user attempts to select key text
- **THEN** SHALL prevent text selection (userSelect: none)
- **AND** SHALL maintain clean visual appearance
- **AND** SHALL avoid highlighting during click events
- **AND** SHALL not interfere with surrounding text selection

### Requirement: Platform-Specific Key Display
The component SHALL support platform-specific key representation.

#### Scenario: Cross-platform key names
- **WHEN** keyboard shortcuts are displayed
- **THEN** consumers MAY render platform-specific labels (Cmd vs Ctrl, Option vs Alt)
- **AND** SHALL maintain consistent styling regardless of key name
- **AND** SHALL preserve monospace rendering for all variations

#### Scenario: Special key symbols
- **WHEN** special keys are represented (arrows, modifiers)
- **THEN** SHALL support Unicode symbols and text labels
- **AND** SHALL render symbols with monospace font
- **AND** SHALL maintain visual consistency with text keys

### Requirement: Key Combination Patterns
The component SHALL support various keyboard combination display patterns.

#### Scenario: Separator rendering
- **WHEN** multiple keys form a combination
- **THEN** consumers MAY use plain text separators between Kbd components
- **AND** SHALL maintain consistent spacing around separators
- **AND** common separators include: "+", "then", "or"

#### Scenario: Sequential key display
- **WHEN** multiple Kbd components appear in sequence
- **THEN** SHALL maintain consistent spacing between instances
- **AND** SHALL preserve inline flow
- **AND** SHALL support composition patterns (e.g., <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>)

### Requirement: Element Type Flexibility
The component SHALL support rendering as different HTML elements.

#### Scenario: Default element
- **WHEN** as prop is not provided
- **THEN** SHALL render as kbd element
- **AND** SHALL be semantically correct for keyboard input
- **AND** SHALL be suitable for inline use

#### Scenario: Custom element
- **WHEN** as prop is provided (e.g., as="span", as="code")
- **THEN** SHALL render as specified element
- **AND** SHALL maintain kbd styling
- **AND** SHALL forward appropriate HTML attributes
- **AND** SHALL preserve visual appearance

### Requirement: Ref Support
The component SHALL forward refs to the root element.

#### Scenario: Ref forwarding
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to underlying kbd element
- **AND** SHALL merge with internal refs using mergeRefs
- **AND** SHALL support React.Ref<HTMLElement> type
- **AND** SHALL enable direct DOM manipulation when needed

### Requirement: React Aria Context Integration
The component SHALL integrate with React Aria keyboard context.

#### Scenario: KeyboardContext integration
- **WHEN** component is used within React Aria components
- **THEN** SHALL use useContextProps to extract keyboard context
- **AND** SHALL merge context props with component props
- **AND** SHALL support React Aria slot prop for component composition
- **AND** SHALL maintain compatibility with React Aria keyboard patterns

### Requirement: Recipe-Based Styling
The component SHALL use Chakra UI single-slot recipe per nimbus-core standards.

#### Scenario: Recipe application
- **WHEN** component renders
- **THEN** SHALL apply kbd recipe from theme/recipes/kbd.ts
- **AND** recipe SHALL be registered in theme configuration
- **AND** SHALL use Chakra defineRecipe for recipe definition
- **AND** SHALL use createRecipeContext for Chakra integration

#### Scenario: Base styles
- **WHEN** recipe applies
- **THEN** SHALL apply consistent base styles (fontFamily, display, alignItems, borders, spacing)
- **AND** SHALL use design tokens for all values
- **AND** SHALL not use hardcoded colors or spacing

### Requirement: Custom Styling
The component SHALL accept Chakra style props.

#### Scenario: Style prop override
- **WHEN** style props are provided
- **THEN** SHALL accept all Chakra style props (margin, padding, width, etc.)
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL support color overrides via style props

### Requirement: Semantic HTML
The component SHALL use appropriate semantic elements per nimbus-core standards.

#### Scenario: Non-interactive keyboard display
- **WHEN** kbd is display-only (default)
- **THEN** SHALL render as kbd element
- **AND** SHALL be announced by screen readers as keyboard input
- **AND** SHALL provide semantic meaning for assistive technology
- **AND** SHALL not require ARIA attributes for semantic clarity

#### Scenario: Accessible content
- **WHEN** screen readers encounter kbd element
- **THEN** SHALL announce content as keyboard input semantically
- **AND** SHALL read key names character-by-character when appropriate
- **AND** SHALL support navigation by semantic elements

### Requirement: Accessibility Considerations
The component SHALL meet WCAG AA requirements per nimbus-core standards.

#### Scenario: Text contrast
- **WHEN** component renders with inherited colors
- **THEN** SHALL maintain 4.5:1 contrast ratio for text (normal size)
- **AND** SHALL use currentColor for borders to inherit contrast-safe colors
- **AND** SHALL meet contrast requirements in both light and dark modes
- **AND** consumers SHALL ensure parent text color meets contrast standards

#### Scenario: Screen reader support
- **WHEN** assistive technology encounters kbd element
- **THEN** SHALL announce as keyboard input semantically
- **AND** SHALL read content as provided in children
- **AND** SHALL support navigation by keyboard input elements

#### Scenario: Focus behavior
- **WHEN** component is non-interactive (default)
- **THEN** SHALL not be focusable via keyboard
- **AND** SHALL not receive focus indicators
- **AND** SHALL not interfere with focus flow

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
- **THEN** SHALL export KbdProps interface
- **AND** SHALL include JSDoc comments for all props
- **AND** SHALL extend Omit<ChakraKbdProps, "slot"> with custom slot type
- **AND** SHALL support ref type React.Ref<HTMLElement>

#### Scenario: Slot integration types
- **WHEN** component uses slots
- **THEN** SHALL export KbdRootSlotProps type
- **AND** SHALL extend HTMLChakraProps<"kbd", KbdRecipeProps>
- **AND** SHALL support Chakra's slot component typing via SlotComponent
- **AND** SHALL enable proper TypeScript autocomplete

#### Scenario: Recipe props
- **WHEN** component uses recipe
- **THEN** SHALL export KbdRecipeProps type from slots file
- **AND** SHALL combine RecipeProps<"kbd"> with UnstyledProp
- **AND** SHALL support unstyled prop for recipe bypass

### Requirement: Theme Registration
The component recipe SHALL be registered in theme configuration per nimbus-core standards.

#### Scenario: Recipe registration
- **WHEN** component is added to package
- **THEN** recipe SHALL be manually registered in theme/recipes/index.ts
- **AND** SHALL be included in recipes object export
- **AND** CRITICAL: registration SHALL not be automatic (no auto-discovery)
- **AND** SHALL validate recipe is registered before component usage

### Requirement: Contextual Usage Guidance
The component SHALL be used appropriately for keyboard input representation.

#### Scenario: Appropriate usage
- **WHEN** documenting keyboard shortcuts
- **THEN** SHALL be used for literal keyboard keys
- **AND** SHALL represent individual keys or combinations
- **AND** SHALL be used in instructional or help text
- **AND** SHALL maintain brevity (1-2 words or symbols per instance)

#### Scenario: Inappropriate usage
- **WHEN** displaying non-keyboard content
- **THEN** SHALL NOT be used for general UI buttons
- **AND** SHALL NOT be used for long code snippets (use Code component)
- **AND** SHALL NOT be used for decorative purposes
- **AND** SHALL NOT be used without explanatory context
