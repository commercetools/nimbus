# Specification: SearchInput Component

## Overview

The SearchInput component provides an accessible search input field with built-in search icon, clear functionality, and search submission handling. Built on React Aria's SearchField for comprehensive keyboard support and accessibility compliance.

**Component:** `SearchInput`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `SearchField` from react-aria-components
**Purpose:** Dedicated text input for search queries with instant feedback and clear functionality

## Purpose

Provide a specialized search input field that enables users to discover and filter content by entering keywords or phrases. Optimized for live search, autocomplete, and instant filtering scenarios with clear visual feedback and intuitive controls.

## Requirements

### Requirement: Search Field Type
The component SHALL use the HTML search input type for semantic search functionality.

#### Scenario: Search input rendering
- **WHEN** component renders
- **THEN** SHALL render input with type="search"
- **AND** SHALL expose role="searchbox" for accessibility
- **AND** SHALL use React Aria's SearchField for keyboard patterns
- **AND** SHALL apply search-specific browser behaviors

#### Scenario: Search-specific autocomplete
- **WHEN** browser or search engines detect search field
- **THEN** SHALL support autocomplete="off" to disable suggestions
- **AND** SHALL hide native browser search decorations
- **AND** SHALL hide native browser clear button (using custom clear)

### Requirement: Search Icon
The component SHALL display a search icon as a visual indicator.

#### Scenario: Icon rendering
- **WHEN** component renders
- **THEN** SHALL display Search icon in leadingElement slot
- **AND** SHALL position icon at the left side of input
- **AND** SHALL scale icon according to size variant (md: 20px, sm: 16px)
- **AND** SHALL apply neutral.11 color to icon
- **AND** SHALL make icon non-interactive (pointerEvents: none)

#### Scenario: Icon with disabled state
- **WHEN** isDisabled={true} is set
- **THEN** SHALL maintain search icon visibility
- **AND** SHALL apply disabled styling to icon
- **AND** SHALL keep icon in disabled color palette

### Requirement: Clear Button
The component SHALL provide a clear button to remove search text.

#### Scenario: Clear button rendering
- **WHEN** input has value
- **THEN** SHALL display clear button with Close icon
- **AND** SHALL render IconButton with size="2xs"
- **AND** SHALL use ghost variant with primary colorPalette
- **AND** SHALL position button at the right side of input
- **AND** SHALL set aria-label to localized "Clear search input" message

#### Scenario: Clear button visibility
- **WHEN** input is empty
- **THEN** SHALL render button with opacity=0 and pointerEvents="none"
- **AND** SHALL keep button in DOM (not conditionally rendered)
- **WHEN** input has value
- **THEN** SHALL render button with opacity=1 and pointerEvents="auto"
- **AND** SHALL smoothly transition opacity on value change

#### Scenario: Clear button interaction
- **WHEN** user clicks clear button
- **THEN** SHALL set input value to empty string
- **AND** SHALL call onChange with empty string
- **AND** SHALL call onClear callback if provided
- **AND** SHALL maintain focus on input field
- **AND** SHALL hide clear button after clearing

#### Scenario: Clear button with disabled input
- **WHEN** isDisabled={true} is set
- **THEN** SHALL disable clear button
- **AND** SHALL apply disabled styling to button
- **AND** SHALL prevent button interactions

#### Scenario: Clear button with readonly input
- **WHEN** isReadOnly={true} is set
- **THEN** SHALL disable clear button
- **AND** SHALL prevent button interactions
- **AND** SHALL keep button visible if value exists

#### Scenario: Clear button tab order
- **WHEN** user navigates with Tab key
- **THEN** clear button SHALL have tabindex="-1"
- **AND** SHALL NOT be focusable via keyboard navigation
- **AND** SHALL only be clickable with mouse/pointer

### Requirement: Search Submission
The component SHALL support search submission via Enter key.

#### Scenario: Enter key submission
- **WHEN** user presses Enter key while focused
- **THEN** SHALL call onSubmit callback with current value
- **AND** SHALL NOT clear the input value
- **AND** SHALL NOT submit parent form by default
- **AND** SHALL maintain focus on input

#### Scenario: Empty submission
- **WHEN** user presses Enter with empty value
- **THEN** SHALL call onSubmit with empty string
- **AND** SHALL allow consumer to handle empty searches

#### Scenario: Form integration
- **WHEN** component is in a form element
- **THEN** SHALL prevent default form submission on Enter
- **AND** SHALL trigger onSubmit callback instead
- **AND** consumer SHALL handle form submission explicitly

### Requirement: Value Management
The component SHALL support both controlled and uncontrolled state management per nimbus-core standards.

#### Scenario: Controlled mode
- **WHEN** value and onChange props are provided
- **THEN** SHALL render with provided value
- **AND** SHALL call onChange on every keystroke with string value (not event)
- **AND** SHALL NOT update internal state
- **AND** onChange SHALL receive string, never event object

#### Scenario: Uncontrolled mode
- **WHEN** defaultValue prop is provided without value
- **THEN** SHALL initialize with defaultValue
- **AND** SHALL manage state internally via React Aria
- **AND** optional onChange SHALL receive updates

#### Scenario: Empty value handling
- **WHEN** value is empty string or undefined
- **THEN** SHALL display placeholder text
- **AND** SHALL hide clear button
- **AND** SHALL allow typing new search query

### Requirement: Event Handlers
The component SHALL provide search-specific event callbacks.

#### Scenario: onChange event
- **WHEN** user types in input
- **THEN** SHALL call onChange with string value on every keystroke
- **AND** SHALL provide debounced search opportunity
- **AND** SHALL NOT pass event object (React Aria pattern)

#### Scenario: onSubmit event
- **WHEN** user presses Enter key
- **THEN** SHALL call onSubmit with current value string
- **AND** SHALL support search query submission
- **AND** SHALL enable form submission handling

#### Scenario: onClear event
- **WHEN** user clicks clear button
- **THEN** SHALL call onClear callback if provided
- **AND** SHALL fire after value is cleared
- **AND** SHALL allow consumer to handle clear action (e.g., reset filters)

#### Scenario: Combined event flow
- **WHEN** user types "test" and clicks clear
- **THEN** SHALL call onChange("t"), onChange("te"), onChange("tes"), onChange("test")
- **AND** SHALL call onClear()
- **AND** SHALL call onChange("")
- **AND** SHALL maintain consistent event ordering

### Requirement: Keyboard Interaction
The component SHALL support comprehensive keyboard interactions per nimbus-core standards.

#### Scenario: Standard text input keys
- **WHEN** input is focused
- **THEN** typing SHALL insert characters
- **AND** Backspace/Delete SHALL remove characters
- **AND** Arrow keys SHALL move cursor within input
- **AND** Home/End SHALL move to start/end
- **AND** Ctrl/Cmd+A SHALL select all text
- **AND** standard copy/paste shortcuts SHALL work

#### Scenario: Escape key to clear
- **WHEN** Escape is pressed with non-empty value
- **THEN** SHALL clear input value to empty string
- **AND** SHALL call onChange with empty string
- **AND** SHALL call onClear if provided
- **AND** SHALL maintain focus on input

#### Scenario: Enter key submission
- **WHEN** Enter is pressed
- **THEN** SHALL trigger onSubmit callback
- **AND** SHALL NOT blur input
- **AND** SHALL NOT submit parent form by default

#### Scenario: Tab navigation
- **WHEN** Tab is pressed from input
- **THEN** SHALL move focus to next focusable element
- **AND** clear button SHALL NOT be in tab order (tabindex="-1")
- **AND** SHALL follow standard form field tab order

### Requirement: Size Variants
The component SHALL support multiple size options per nimbus-core standards.

#### Scenario: Medium size (default)
- **WHEN** size="md" or no size specified
- **THEN** input height SHALL be 40px (token: 1000)
- **AND** horizontal padding SHALL be 16px (token: 400)
- **AND** gap between elements SHALL be 8px (token: 200)
- **AND** text style SHALL be "md"
- **AND** search icon SHALL be 20px (token: 500)
- **AND** clear button SHALL be size "2xs"

#### Scenario: Small size
- **WHEN** size="sm" is set
- **THEN** input height SHALL be 32px (token: 800)
- **AND** horizontal padding SHALL be 12px (token: 300)
- **AND** gap between elements SHALL be 4px (token: 100)
- **AND** text style SHALL be "sm"
- **AND** search icon SHALL be 16px (token: 400)
- **AND** clear button SHALL be size "2xs"

### Requirement: Visual Variants
The component SHALL support multiple appearance variants per nimbus-core standards.

#### Scenario: Solid variant (default)
- **WHEN** variant="solid" or no variant specified
- **THEN** SHALL display border with 1px width (token: 25)
- **AND** border color SHALL be neutral.7
- **AND** background color SHALL be primary.1
- **AND** SHALL apply inset box-shadow for border appearance

#### Scenario: Ghost variant
- **WHEN** variant="ghost" is set
- **THEN** SHALL display no visible border
- **AND** background SHALL be transparent
- **AND** SHALL show subtle background on hover

#### Scenario: Hover state
- **WHEN** mouse hovers over input
- **THEN** background color SHALL change to primary.2
- **AND** SHALL apply to both solid and ghost variants
- **AND** SHALL provide interactive feedback

#### Scenario: Focus state
- **WHEN** input receives focus
- **THEN** SHALL apply focusRing layer style
- **AND** focus ring SHALL meet 3:1 contrast ratio
- **AND** SHALL be clearly visible against background
- **AND** SHALL follow Nimbus focus ring pattern

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** isDisabled={true} is set
- **THEN** SHALL apply disabled styling to input
- **AND** background SHALL be neutral.3
- **AND** SHALL apply disabled layer style
- **AND** SHALL prevent all interactions (typing, clicking)
- **AND** SHALL set disabled attribute on input
- **AND** clear button SHALL be disabled
- **AND** SHALL set data-disabled="true"

#### Scenario: Invalid state
- **WHEN** isInvalid={true} is set
- **THEN** border color SHALL be critical.7
- **AND** border width SHALL be 2px (token: 50)
- **AND** text color SHALL be critical.11
- **AND** SHALL set data-invalid="true"
- **AND** SHALL still allow user input
- **AND** SHALL remain focusable

#### Scenario: Read-only state
- **WHEN** isReadOnly={true} is set
- **THEN** SHALL set readonly attribute on input
- **AND** SHALL prevent value changes via typing
- **AND** SHALL allow focus and text selection
- **AND** clear button SHALL be disabled
- **AND** SHALL display value without edit capability

### Requirement: Placeholder Text
The component SHALL support placeholder text for empty states.

#### Scenario: Placeholder display
- **WHEN** placeholder prop is provided and input is empty
- **THEN** SHALL display placeholder text inside input
- **AND** placeholder SHALL have 0.5 opacity
- **AND** SHALL inherit color from input (currentColor)
- **AND** SHALL hide placeholder when input has value

#### Scenario: Placeholder best practices
- **WHEN** placeholder is set
- **THEN** placeholder text SHOULD be concise (e.g., "Search...")
- **AND** SHOULD indicate what can be searched
- **AND** SHOULD NOT be used as a replacement for label

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply searchInput slot recipe from theme/slot-recipes/search-input.ts
- **AND** SHALL style slots: root, leadingElement, input
- **AND** root slot SHALL be container with flex layout
- **AND** leadingElement slot SHALL contain search icon
- **AND** input slot SHALL be the text input element

#### Scenario: Recipe registration
- **WHEN** package builds
- **THEN** searchInputSlotRecipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL be manual (no auto-discovery)
- **AND** recipe className SHALL be "nimbus-search-input"

#### Scenario: State-based styling
- **WHEN** component state changes
- **THEN** SHALL apply data attributes: data-disabled, data-invalid
- **AND** recipe SHALL respond to these data attributes
- **AND** SHALL use CSS selectors: _focusWithin, _hover, _disabled
- **AND** SHALL support pseudo-selectors for interactive states

### Requirement: Accessibility Compliance
The component SHALL meet WCAG 2.1 AA standards per nimbus-core standards.

#### Scenario: Semantic HTML
- **WHEN** component renders
- **THEN** SHALL use input element with type="search"
- **AND** SHALL expose role="searchbox" automatically
- **AND** SHALL be announced as search field by screen readers

#### Scenario: Aria labeling
- **WHEN** aria-label prop is provided
- **THEN** SHALL set aria-label attribute on input
- **AND** screen readers SHALL announce label
- **WHEN** used with FormField.Label
- **THEN** SHALL associate label via aria-labelledby
- **AND** SHALL announce visible label to screen readers

#### Scenario: Clear button accessibility
- **WHEN** clear button renders
- **THEN** SHALL have localized aria-label from search-input.i18n.ts
- **AND** SHALL announce "Clear search input" (or translated equivalent)
- **AND** SHALL be announced as button by screen readers
- **AND** SHALL be clickable but NOT in tab order

#### Scenario: Keyboard navigation
- **WHEN** user navigates with keyboard
- **THEN** input SHALL be focusable with Tab key
- **AND** SHALL provide visible focus indicator
- **AND** SHALL support all standard input keyboard shortcuts
- **AND** Escape SHALL clear input
- **AND** Enter SHALL submit search

#### Scenario: Screen reader announcements
- **WHEN** screen reader user interacts with component
- **THEN** SHALL announce field as "search"
- **AND** SHALL announce placeholder when empty
- **AND** SHALL announce value changes while typing
- **AND** SHALL announce clear button when value exists

#### Scenario: Color contrast
- **WHEN** component renders
- **THEN** text SHALL meet 4.5:1 contrast ratio
- **AND** placeholder SHALL meet 4.5:1 contrast ratio (with 0.5 opacity)
- **AND** search icon SHALL meet 3:1 contrast ratio
- **AND** clear button icon SHALL meet 3:1 contrast ratio
- **AND** focus indicator SHALL meet 3:1 contrast ratio
- **AND** SHALL support both light and dark modes

#### Scenario: Touch targets
- **WHEN** component renders on touch device
- **THEN** input SHALL meet minimum 44x44px touch target
- **AND** clear button SHALL meet minimum 44x44px touch target
- **AND** SHALL provide adequate spacing between icon and input

### Requirement: Internationalization
The component SHALL support localization per nimbus-core standards.

#### Scenario: Clear button label
- **WHEN** clear button renders
- **THEN** aria-label SHALL use message "Nimbus.SearchInput.clearInput"
- **AND** SHALL translate to:
  - en: "Clear search input"
  - de: "Sucheingabe löschen"
  - es: "Borrar entrada de búsqueda"
  - fr-FR: "Effacer la saisie de recherche"
  - pt-BR: "Limpar entrada de pesquisa"

#### Scenario: Message integration
- **WHEN** component renders
- **THEN** SHALL use messages from search-input.i18n.ts
- **AND** SHALL format messages via plain TypeScript objects useIntl hook
- **AND** SHALL support all 5 Nimbus locales
- **AND** messages SHALL be extracted to @commercetools/nimbus-i18n

#### Scenario: RTL support
- **WHEN** locale uses right-to-left layout
- **THEN** search icon SHOULD appear on the right
- **AND** clear button SHOULD appear on the left
- **AND** text input direction SHALL follow HTML dir attribute

### Requirement: Form Field Integration
The component SHALL integrate with FormField component per nimbus-core standards.

#### Scenario: FormField wrapper
- **WHEN** SearchInput is wrapped in FormField.Input
- **THEN** SHALL receive isDisabled from FormField.Root
- **AND** SHALL receive isInvalid from FormField.Root
- **AND** SHALL receive isReadOnly from FormField.Root
- **AND** SHALL receive isRequired from FormField.Root
- **AND** SHALL associate with FormField.Label via aria-labelledby
- **AND** SHALL associate with FormField.Error via aria-describedby
- **AND** SHALL associate with FormField.Description via aria-describedby

#### Scenario: Required field
- **WHEN** FormField.Root has isRequired={true}
- **THEN** FormField.Label SHALL display asterisk (*)
- **AND** SearchInput SHALL receive required state
- **AND** validation SHALL enforce non-empty value

#### Scenario: Invalid field
- **WHEN** FormField.Root has isInvalid={true}
- **THEN** SearchInput SHALL receive isInvalid prop
- **AND** SHALL display error styling
- **AND** FormField.Error SHALL display below input
- **AND** error message SHALL be associated via aria-describedby

#### Scenario: Disabled field
- **WHEN** FormField.Root has isDisabled={true}
- **THEN** SearchInput SHALL receive isDisabled prop
- **AND** SHALL apply disabled styling
- **AND** SHALL prevent all interactions

### Requirement: Design Token Usage
The component SHALL use design tokens for all styling per nimbus-core standards.

#### Scenario: Color tokens
- **WHEN** component renders
- **THEN** SHALL use primary.1 for background (solid variant)
- **AND** SHALL use primary.2 for hover background
- **AND** SHALL use neutral.7 for border (solid variant)
- **AND** SHALL use neutral.11 for icon color
- **AND** SHALL use critical.7 for invalid border
- **AND** SHALL use critical.11 for invalid text
- **AND** SHALL use neutral.3 for disabled background

#### Scenario: Spacing tokens
- **WHEN** component renders
- **THEN** SHALL use token 400 (16px) for horizontal padding (md)
- **AND** SHALL use token 300 (12px) for horizontal padding (sm)
- **AND** SHALL use token 200 (8px) for gap between elements (md)
- **AND** SHALL use token 100 (4px) for gap between elements (sm)

#### Scenario: Size tokens
- **WHEN** component renders
- **THEN** SHALL use token 1000 (40px) for height (md)
- **AND** SHALL use token 800 (32px) for height (sm)
- **AND** SHALL use token 500 (20px) for icon size (md)
- **AND** SHALL use token 400 (16px) for icon size (sm)

#### Scenario: Border tokens
- **WHEN** component renders
- **THEN** SHALL use token 200 for border radius (borderRadius: 200)
- **AND** SHALL use token 25 for border width (solid variant)
- **AND** SHALL use token 50 for invalid border width

### Requirement: React Aria Integration
The component SHALL use React Aria's SearchField for accessibility per nimbus-core standards.

#### Scenario: SearchField usage
- **WHEN** component renders
- **THEN** SHALL wrap with RaSearchField from react-aria-components
- **AND** SHALL use RaInput for input element
- **AND** React Aria SHALL provide keyboard interaction patterns
- **AND** React Aria SHALL manage focus and accessibility attributes

#### Scenario: State management
- **WHEN** RaSearchField renders
- **THEN** SHALL provide state object via render prop
- **AND** state.value SHALL contain current input value
- **AND** state.setValue SHALL update value
- **AND** clear button SHALL use state.setValue("")

#### Scenario: Escape key handling
- **WHEN** user presses Escape
- **THEN** React Aria SHALL automatically clear the input
- **AND** SHALL call onChange with empty string
- **AND** SHALL trigger onClear callback if provided

### Requirement: Type Safety
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** SearchInput is used
- **THEN** SHALL export SearchInputProps interface
- **AND** SHALL extend RaSearchFieldProps from react-aria-components
- **AND** SHALL extend SearchInputRootSlotProps for styling
- **AND** SHALL include JSDoc for all props

#### Scenario: Recipe props
- **WHEN** styling variants are used
- **THEN** SHALL export SearchInputRecipeProps type
- **AND** SHALL include size: "sm" | "md"
- **AND** SHALL include variant: "solid" | "ghost"
- **AND** SHALL provide autocomplete for variant values

#### Scenario: Slot props
- **WHEN** slots are styled
- **THEN** SHALL export SearchInputRootSlotProps
- **AND** SHALL export SearchInputLeadingElementSlotProps
- **AND** SHALL export SearchInputInputSlotProps
- **AND** all slot props SHALL extend HTMLChakraProps

#### Scenario: Event handler types
- **WHEN** event handlers are used
- **THEN** onChange SHALL accept (value: string) => void
- **AND** onSubmit SHALL accept (value: string) => void
- **AND** onClear SHALL accept () => void
- **AND** SHALL NOT pass Event objects (React Aria pattern)

### Requirement: Live Search Support
The component SHALL enable live search and filtering scenarios.

#### Scenario: Debounced search
- **WHEN** consumer wants debounced search
- **THEN** consumer SHALL use debounce utility with onChange
- **AND** component SHALL fire onChange on every keystroke
- **AND** consumer SHALL control debounce timing
- **AND** component SHALL NOT implement debouncing internally

#### Scenario: Instant filtering
- **WHEN** consumer wants instant filtering
- **THEN** consumer SHALL use onChange directly without debounce
- **AND** component SHALL update on every keystroke
- **AND** consumer SHALL filter visible results in real-time

#### Scenario: Autocomplete integration
- **WHEN** consumer wants autocomplete suggestions
- **THEN** SearchInput SHALL work with separate Dropdown or Menu component
- **AND** onChange SHALL trigger suggestion updates
- **AND** consumer SHALL manage suggestion list
- **AND** SearchInput SHALL NOT include suggestions internally

### Requirement: Documentation
The component SHALL provide comprehensive documentation per nimbus-core standards.

#### Scenario: MDX documentation
- **WHEN** component is documented
- **THEN** SHALL have search-input.mdx file
- **AND** SHALL include overview, guidelines, best practices
- **AND** SHALL include usage examples with jsx-live blocks
- **AND** SHALL document when to use vs when not to use
- **AND** SHALL include do's and don'ts examples

#### Scenario: Engineering documentation
- **WHEN** component is documented
- **THEN** MAY have search-input.dev.mdx for internal engineering details
- **AND** SHALL document implementation patterns
- **AND** SHALL document React Aria integration approach

#### Scenario: API documentation
- **WHEN** component is documented
- **THEN** MDX SHALL include <PropsTable id="SearchInput" />
- **AND** props table SHALL auto-generate from TypeScript definitions
- **AND** ALL props SHALL have JSDoc descriptions

### Requirement: Testing Requirements
The component SHALL have comprehensive tests per nimbus-core standards.

#### Scenario: Storybook stories
- **WHEN** component is tested
- **THEN** SHALL have search-input.stories.tsx file
- **AND** SHALL include stories: Base, Sizes, Variants, Disabled, Invalid, ReadOnly
- **AND** SHALL include stories: Controlled, WithEventHandlers, ClearButton, KeyboardNavigation
- **AND** SHALL include story: DefaultValue, WithFormField

#### Scenario: Play functions
- **WHEN** interactive behavior is tested
- **THEN** stories SHALL include play functions using @storybook/test
- **AND** SHALL test typing, clearing, submitting
- **AND** SHALL test keyboard navigation (Tab, Escape, Enter)
- **AND** SHALL test event handlers (onChange, onSubmit, onClear)
- **AND** SHALL test disabled, readonly, invalid states
- **AND** SHALL test clear button visibility and interaction
- **AND** SHALL test FormField integration

#### Scenario: Accessibility testing
- **WHEN** accessibility is tested
- **THEN** SHALL verify role="searchbox" attribute
- **AND** SHALL verify aria-label and aria-labelledby association
- **AND** SHALL verify keyboard navigation works
- **AND** SHALL verify focus indicators are visible
- **AND** SHALL verify disabled and readonly states work correctly

### Requirement: Performance Considerations
The component SHALL be optimized for search scenarios.

#### Scenario: Controlled value updates
- **WHEN** value changes frequently (live search)
- **THEN** component SHALL re-render efficiently
- **AND** SHALL NOT cause unnecessary re-renders
- **AND** consumer SHALL memoize onChange handlers

#### Scenario: Large result sets
- **WHEN** search returns many results
- **THEN** component SHALL remain responsive
- **AND** consumer SHALL implement debouncing for API calls
- **AND** consumer SHALL implement virtualization for large lists

#### Scenario: Bundle size
- **WHEN** component is imported
- **THEN** SHALL include minimal dependencies
- **AND** SHALL support tree-shaking
- **AND** React Aria SearchField SHALL be bundled (internal)
- **AND** icons SHALL be imported from @commercetools/nimbus-icons (external)
