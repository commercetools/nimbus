# Specification: MultilineTextInput Component

## Overview

The MultilineTextInput component provides an accessible multi-line text input field (textarea) with comprehensive height management, resizing capabilities, and validation support. It enables users to enter longer text content across multiple lines with flexible sizing options and auto-grow functionality.

**Component:** `MultilineTextInput`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `TextField` with `TextArea` from react-aria-components
**Purpose:** Multiline text entry for paragraphs, descriptions, comments, or any content requiring multiple lines

## Purpose

Provide an accessible, multiline text input field that accommodates longer text entries with flexible height management, including fixed rows, user resizing, and automatic content-based growth. Supports all standard input validation, states, and form integration while maintaining WCAG 2.1 AA compliance.

## Requirements

### Requirement: Textarea Element
The component SHALL use a textarea HTML element for multiline text entry.

#### Scenario: Textarea rendering
- **WHEN** component renders
- **THEN** SHALL render textarea element (not input)
- **AND** SHALL support multiline text entry with line breaks
- **AND** SHALL display entered text across multiple lines
- **AND** SHALL wrap text based on container width

#### Scenario: Line breaks
- **WHEN** user presses Enter key
- **THEN** SHALL insert newline character in value
- **AND** SHALL move cursor to next line
- **AND** SHALL NOT submit parent form
- **AND** SHALL increase visible content height if needed

### Requirement: Rows Configuration
The component SHALL support configurable visible row height.

#### Scenario: Default rows
- **WHEN** no rows prop is specified
- **THEN** SHALL render with rows={1}
- **AND** SHALL display single line of text
- **AND** SHALL expand if more content is added
- **AND** SHALL override browser default of 2 rows

#### Scenario: Fixed rows
- **WHEN** rows prop is provided (e.g., rows={5})
- **THEN** SHALL render with specified number of visible rows
- **AND** SHALL set initial height to accommodate rows
- **AND** SHALL make content scrollable if exceeds rows
- **AND** SHALL maintain fixed height unless resized by user

#### Scenario: Large row count
- **WHEN** rows={8} or higher is set
- **THEN** SHALL render with appropriate initial height
- **AND** SHALL accommodate long-form content
- **AND** SHALL provide adequate visible text area
- **AND** SHALL scroll when content exceeds height

### Requirement: Height Management
The component SHALL support multiple height management strategies.

#### Scenario: Minimum height constraint
- **WHEN** minH or minHeight Chakra style prop is set
- **THEN** SHALL enforce minimum height on root container
- **AND** SHALL NOT shrink below minimum height
- **AND** SHALL allow growth beyond minimum
- **AND** SHALL support token values (e.g., minH={1600})

#### Scenario: Maximum height constraint
- **WHEN** maxH or maxHeight Chakra style prop is set
- **THEN** SHALL enforce maximum height on root container
- **AND** SHALL NOT grow beyond maximum height
- **AND** SHALL make content scrollable when exceeding maximum
- **AND** SHALL support token values (e.g., maxH={3200})

#### Scenario: Min and max height combination
- **WHEN** both minH and maxH are set
- **THEN** SHALL start at minimum height
- **AND** SHALL grow up to maximum height
- **AND** SHALL scroll content when maximum is reached
- **AND** SHALL enforce constraints consistently

#### Scenario: Height with rows
- **WHEN** rows and minH/maxH are both specified
- **THEN** rows SHALL determine initial visible lines
- **AND** minH/maxH SHALL constrain overall container height
- **AND** SHALL allow scrolling when content exceeds constraints

### Requirement: Auto-Grow Functionality
The component SHALL support automatic height adjustment based on content.

#### Scenario: Auto-grow enabled
- **WHEN** autoGrow={true} is set
- **THEN** SHALL automatically adjust height to fit content
- **AND** SHALL expand as user types and adds lines
- **AND** SHALL use useAutogrow hook for height calculation
- **AND** textarea style.height SHALL be set dynamically

#### Scenario: Auto-grow with typing
- **WHEN** autoGrow is enabled and user types multiline content
- **THEN** SHALL recalculate height on input event
- **AND** SHALL expand height to show all content without scrolling
- **AND** SHALL adjust height in real-time as content changes
- **AND** SHALL maintain smooth visual experience

#### Scenario: Auto-grow with deletion
- **WHEN** autoGrow is enabled and user deletes content
- **THEN** SHALL recalculate height on input event
- **AND** SHALL shrink height to match remaining content
- **AND** SHALL NOT leave excessive empty space
- **AND** SHALL adjust smoothly as content is removed

#### Scenario: Auto-grow with max height
- **WHEN** autoGrow={true} and maxH/maxHeight is set
- **THEN** SHALL grow automatically up to maximum height
- **AND** SHALL make content scrollable when maximum is reached
- **AND** SHALL respect maxHeight constraint from CSS
- **AND** SHALL calculate: min(contentHeight, maxHeightPx)

#### Scenario: Auto-grow initialization
- **WHEN** autoGrow is enabled and component mounts with content
- **THEN** SHALL adjust height on initial render
- **AND** SHALL calculate correct height for existing value
- **AND** SHALL not require user interaction to trigger sizing

#### Scenario: Auto-grow cleanup
- **WHEN** autoGrow is enabled and component unmounts
- **THEN** SHALL remove input event listeners
- **AND** SHALL clean up resize logic
- **AND** SHALL prevent memory leaks

### Requirement: User Resizing
The component SHALL support manual resizing by users.

#### Scenario: Vertical resize handle
- **WHEN** component renders
- **THEN** root container SHALL have resize: vertical
- **AND** SHALL display resize handle in bottom-right corner
- **AND** resize handle SHALL show custom SVG icon with primary color
- **AND** SHALL allow user to drag handle vertically

#### Scenario: Resizing behavior
- **WHEN** user drags resize handle
- **THEN** SHALL change textarea height
- **AND** SHALL maintain new height after resizing
- **AND** SHALL work independently of rows prop
- **AND** SHALL allow both expansion and contraction

#### Scenario: Resize with auto-grow
- **WHEN** autoGrow={true} and user manually resizes
- **THEN** SHALL allow manual resizing via handle
- **AND** SHALL resume auto-grow behavior when typing
- **AND** manual resize SHALL set base height
- **AND** auto-grow SHALL adjust from manually set height

#### Scenario: Resize handle styling
- **WHEN** resize handle renders
- **THEN** SHALL use custom SVG icon (8x8px)
- **AND** SHALL apply primary.light[9] color via design token
- **AND** SHALL position at bottom-right corner
- **AND** SHALL have consistent appearance across variants

#### Scenario: Disable resizing
- **WHEN** component wants to prevent manual resize
- **THEN** consumer SHALL set resize="none" via Chakra style prop
- **AND** SHALL hide resize handle
- **AND** SHALL prevent user resizing via drag

### Requirement: Value Management
The component SHALL support both controlled and uncontrolled state management per nimbus-core standards.

#### Scenario: Controlled mode
- **WHEN** value and onChange props are provided
- **THEN** SHALL render with provided value
- **AND** SHALL call onChange on every keystroke with string value
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
- **AND** SHALL allow typing new content
- **AND** SHALL maintain empty state until user types

#### Scenario: Multiline value
- **WHEN** value contains newline characters
- **THEN** SHALL display text across multiple lines
- **AND** SHALL preserve line breaks
- **AND** SHALL wrap long lines based on width
- **AND** SHALL maintain cursor position correctly

### Requirement: Leading Element Support
The component SHALL support optional leading element for icons or decorations.

#### Scenario: Leading element rendering
- **WHEN** leadingElement prop is provided
- **THEN** SHALL render element in leadingElement slot
- **AND** SHALL position element at start of textarea (left in LTR)
- **AND** SHALL align element to top of textarea
- **AND** SHALL apply appropriate spacing between element and textarea

#### Scenario: Leading icon
- **WHEN** leadingElement contains an icon component
- **THEN** SHALL display icon before textarea
- **AND** SHALL size icon according to size variant (md: 20px, sm: 16px)
- **AND** SHALL apply neutral.11 color to icon
- **AND** SHALL align icon to top with padding

#### Scenario: Leading icon button
- **WHEN** leadingElement contains IconButton
- **THEN** SHALL render interactive button before textarea
- **AND** SHALL allow button interactions
- **AND** SHALL maintain consistent spacing
- **AND** button size SHALL match input size (md: xs, sm: 2xs)

#### Scenario: Leading element with states
- **WHEN** component is disabled or invalid
- **THEN** leadingElement SHALL remain visible
- **AND** SHALL apply appropriate state styling
- **AND** SHALL reflect component state visually

### Requirement: Placeholder Text
The component SHALL support placeholder text for empty states.

#### Scenario: Placeholder display
- **WHEN** placeholder prop is provided and input is empty
- **THEN** SHALL display placeholder text inside textarea
- **AND** placeholder SHALL have 0.5 opacity
- **AND** SHALL inherit color from textarea (currentColor)
- **AND** SHALL hide placeholder when textarea has value

#### Scenario: Placeholder with line breaks
- **WHEN** placeholder contains newline characters
- **THEN** SHALL display placeholder across multiple lines
- **AND** SHALL respect line breaks in placeholder text
- **AND** SHALL provide visual hint for multiline input

#### Scenario: Placeholder accessibility
- **WHEN** placeholder is set
- **THEN** SHALL use placeholder attribute on textarea
- **AND** SHALL NOT replace visible label
- **AND** screen readers SHALL announce placeholder when appropriate

### Requirement: Size Variants
The component SHALL support multiple size options per nimbus-core standards.

#### Scenario: Medium size (default)
- **WHEN** size="md" or no size specified
- **THEN** root minH SHALL be 40px (token: 1000)
- **AND** horizontal padding SHALL be 16px left (token: 400)
- **AND** textarea padding SHALL be 8px vertical, 16px right (token: 200, 400)
- **AND** gap between elements SHALL be 8px (token: 200)
- **AND** text style SHALL be "md"
- **AND** leading icon SHALL be 20px (token: 500) with margin-top: 2px (token: 50)

#### Scenario: Small size
- **WHEN** size="sm" is set
- **THEN** root minH SHALL be 32px (token: 800)
- **AND** horizontal padding SHALL be 12px left (token: 300)
- **AND** textarea padding SHALL be 4px vertical, 12px right (token: 100, 300)
- **AND** gap between elements SHALL be 4px (token: 100)
- **AND** text style SHALL be "sm"
- **AND** leading icon SHALL be 16px (token: 400)

### Requirement: Visual Variants
The component SHALL support multiple appearance variants per nimbus-core standards.

#### Scenario: Solid variant (default)
- **WHEN** variant="solid" or no variant specified
- **THEN** SHALL display border with 1px width (token: 25)
- **AND** border color SHALL be neutral.7
- **AND** background color SHALL be neutral.1
- **AND** SHALL apply inset box-shadow for border appearance
- **AND** SHALL show primary.2 background on hover

#### Scenario: Ghost variant
- **WHEN** variant="ghost" is set
- **THEN** SHALL display no visible border (no --border-width)
- **AND** background SHALL be transparent
- **AND** SHALL show primary.2 background on hover
- **AND** SHALL provide subtle visual feedback

#### Scenario: Hover state
- **WHEN** mouse hovers over textarea container
- **THEN** background color SHALL change to primary.2
- **AND** SHALL apply to both solid and ghost variants
- **AND** SHALL provide interactive feedback
- **AND** SHALL NOT apply when disabled

#### Scenario: Focus state
- **WHEN** textarea receives focus
- **THEN** container SHALL apply focusRing layer style
- **AND** focus ring SHALL be outside (focusVisibleRing: outside)
- **AND** SHALL meet 3:1 contrast ratio requirement
- **AND** SHALL be clearly visible against background
- **AND** SHALL follow Nimbus focus ring pattern

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** isDisabled={true} is set
- **THEN** SHALL apply disabled layer style to root
- **AND** background SHALL be neutral.3
- **AND** cursor SHALL be not-allowed on textarea
- **AND** SHALL prevent all interactions (typing, resizing)
- **AND** SHALL set disabled attribute on textarea
- **AND** SHALL set data-disabled="true" on root

#### Scenario: Invalid state
- **WHEN** isInvalid={true} is set
- **THEN** border color SHALL be critical.7
- **AND** border width SHALL be 2px (token: 50)
- **AND** text color SHALL be critical.11
- **AND** SHALL set data-invalid="true" on root
- **AND** SHALL still allow user input
- **AND** SHALL remain focusable

#### Scenario: Read-only state
- **WHEN** isReadOnly={true} is set
- **THEN** SHALL set readonly attribute on textarea
- **AND** SHALL prevent value changes via typing
- **AND** SHALL allow focus and text selection
- **AND** SHALL display value without edit capability
- **AND** SHALL NOT set disabled styling

### Requirement: Validation Support
The component SHALL support validation capabilities per nimbus-text-input spec.

#### Scenario: Required validation
- **WHEN** isRequired={true} is set
- **THEN** SHALL mark field as required
- **AND** SHALL set aria-required="true" on textarea
- **AND** SHALL validate on blur
- **AND** FormField SHALL show required indicator (*) in label

#### Scenario: Length validation
- **WHEN** minLength or maxLength props are set
- **THEN** SHALL enforce character length constraints
- **AND** SHALL validate against limits
- **AND** SHALL provide error messages for violations
- **AND** maxLength SHALL prevent typing beyond limit

#### Scenario: Custom validation
- **WHEN** validate function prop is provided
- **THEN** SHALL call function with current value
- **AND** SHALL display returned error message
- **AND** SHALL mark field as invalid if validation fails

### Requirement: Keyboard Interaction
The component SHALL support comprehensive keyboard interactions per nimbus-core standards.

#### Scenario: Text entry keys
- **WHEN** textarea is focused
- **THEN** typing SHALL insert characters
- **AND** Enter SHALL insert newline and move to next line
- **AND** Shift+Enter SHALL insert newline (same as Enter)
- **AND** Backspace/Delete SHALL remove characters
- **AND** Arrow keys SHALL move cursor within text
- **AND** Home/End SHALL move to start/end of current line

#### Scenario: Navigation keys
- **WHEN** textarea is focused
- **THEN** Tab SHALL move focus to next focusable element
- **AND** Shift+Tab SHALL move focus to previous element
- **AND** Ctrl/Cmd+Home SHALL move to start of all text
- **AND** Ctrl/Cmd+End SHALL move to end of all text

#### Scenario: Selection keys
- **WHEN** textarea is focused
- **THEN** Ctrl/Cmd+A SHALL select all text
- **AND** Shift+Arrow SHALL extend selection
- **AND** Ctrl/Cmd+C SHALL copy selected text
- **AND** Ctrl/Cmd+V SHALL paste text
- **AND** Ctrl/Cmd+X SHALL cut selected text

#### Scenario: Tab behavior
- **WHEN** Tab is pressed while textarea is focused
- **THEN** SHALL move focus out of textarea to next element
- **AND** SHALL NOT insert tab character by default
- **AND** SHALL follow standard form field tab order

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply multilineTextInput slot recipe from theme/slot-recipes/multiline-text-input.ts
- **AND** SHALL style slots: root, leadingElement, textarea
- **AND** root slot SHALL be container with flex layout and overflow-y: auto
- **AND** leadingElement slot SHALL display flex with neutral.11 color
- **AND** textarea slot SHALL flex-grow with transparent background

#### Scenario: Recipe registration
- **WHEN** package builds
- **THEN** multilineTextInputSlotRecipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL be manual (no auto-discovery)
- **AND** recipe className SHALL be "nimbus-multiline-text-input"

#### Scenario: State-based styling
- **WHEN** component state changes
- **THEN** SHALL apply data attributes: data-disabled, data-invalid
- **AND** recipe SHALL respond to these data attributes via selectors
- **AND** SHALL use CSS selectors: &[data-disabled="true"], &[data-invalid="true"]
- **AND** SHALL use pseudo-selectors: _focusWithin, _hover, _placeholder

#### Scenario: Resize handle styling
- **WHEN** root container has resize: vertical
- **THEN** SHALL style &::-webkit-resizer pseudo-element
- **AND** SHALL use custom SVG background image
- **AND** SHALL apply primary.light[9] color to SVG
- **AND** resize handle SHALL be 16x16px (token: 400)

### Requirement: Accessibility Compliance
The component SHALL meet WCAG 2.1 AA standards per nimbus-core standards.

#### Scenario: Semantic HTML
- **WHEN** component renders
- **THEN** SHALL use textarea element
- **AND** SHALL expose implicit textarea role
- **AND** SHALL be announced as multiline text input by screen readers

#### Scenario: Label association
- **WHEN** used with FormField.Label
- **THEN** SHALL associate label via aria-labelledby
- **AND** SHALL link label ID to textarea
- **AND** screen readers SHALL announce label
- **WHEN** aria-label prop is provided
- **THEN** SHALL set aria-label attribute on textarea
- **AND** SHALL provide accessible name without visible label

#### Scenario: Description association
- **WHEN** used with FormField.Description
- **THEN** SHALL associate description via aria-describedby
- **AND** screen readers SHALL announce description
- **WHEN** used with FormField.Error
- **THEN** error SHALL be associated via aria-describedby
- **AND** error and description SHALL both be announced

#### Scenario: Required state
- **WHEN** isRequired={true} is set
- **THEN** SHALL set aria-required="true" on textarea
- **AND** screen readers SHALL announce required state
- **AND** FormField.Label SHALL display asterisk (*)

#### Scenario: Invalid state
- **WHEN** isInvalid={true} is set
- **THEN** SHALL set data-invalid="true" on root
- **AND** error message SHALL be associated via aria-describedby
- **AND** screen readers SHALL announce error
- **AND** SHALL apply error styling (critical.7 border, critical.11 text)

#### Scenario: Keyboard navigation
- **WHEN** user navigates with keyboard
- **THEN** textarea SHALL be focusable with Tab key
- **AND** SHALL provide visible focus indicator
- **AND** focus ring SHALL meet 3:1 contrast ratio
- **AND** SHALL support all standard textarea keyboard shortcuts

#### Scenario: Screen reader announcements
- **WHEN** screen reader user interacts with component
- **THEN** SHALL announce field as "textarea" or "multiline text input"
- **AND** SHALL announce label and description
- **AND** SHALL announce placeholder when empty
- **AND** SHALL announce value changes while typing
- **AND** SHALL announce required and invalid states

#### Scenario: Color contrast
- **WHEN** component renders
- **THEN** text SHALL meet 4.5:1 contrast ratio
- **AND** placeholder SHALL meet 4.5:1 contrast ratio (with 0.5 opacity)
- **AND** leading icons SHALL meet 3:1 contrast ratio
- **AND** focus indicator SHALL meet 3:1 contrast ratio
- **AND** error text SHALL meet 4.5:1 contrast ratio
- **AND** SHALL support both light and dark modes

#### Scenario: Touch targets
- **WHEN** component renders on touch device
- **THEN** textarea SHALL meet minimum 44x44px touch target
- **AND** leading IconButton SHALL meet minimum 44x44px touch target
- **AND** resize handle SHALL be easily grabbable

### Requirement: Form Field Integration
The component SHALL integrate with FormField component per nimbus-core standards.

#### Scenario: FormField wrapper
- **WHEN** MultilineTextInput is wrapped in FormField.Input
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
- **AND** MultilineTextInput SHALL receive required state
- **AND** SHALL set aria-required="true"
- **AND** validation SHALL enforce non-empty value

#### Scenario: Invalid field
- **WHEN** FormField.Root has isInvalid={true}
- **THEN** MultilineTextInput SHALL receive isInvalid prop
- **AND** SHALL display error styling
- **AND** FormField.Error SHALL display below textarea
- **AND** error message SHALL be associated via aria-describedby

#### Scenario: Disabled field
- **WHEN** FormField.Root has isDisabled={true}
- **THEN** MultilineTextInput SHALL receive isDisabled prop
- **AND** SHALL apply disabled styling
- **AND** SHALL prevent all interactions

#### Scenario: Read-only field
- **WHEN** FormField.Root has isReadOnly={true}
- **THEN** MultilineTextInput SHALL receive isReadOnly prop
- **AND** SHALL set readonly attribute
- **AND** SHALL allow focus and selection but prevent editing

### Requirement: Form Integration
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** component is in a form element
- **THEN** SHALL include value in form data
- **AND** SHALL use name prop as field name
- **AND** Enter key SHALL NOT submit form (inserts newline instead)
- **AND** SHALL support form validation via required attribute

#### Scenario: Form validation
- **WHEN** form validation occurs
- **THEN** SHALL validate required constraint
- **AND** SHALL validate minLength/maxLength constraints
- **AND** SHALL prevent form submission if invalid
- **AND** SHALL display validation errors

#### Scenario: Form reset
- **WHEN** form is reset
- **THEN** SHALL return to defaultValue or empty
- **AND** SHALL clear any validation errors
- **AND** SHALL reset to initial state

### Requirement: Design Token Usage
The component SHALL use design tokens for all styling per nimbus-core standards.

#### Scenario: Color tokens
- **WHEN** component renders
- **THEN** SHALL use neutral.1 for background (solid variant)
- **AND** SHALL use primary.2 for hover background
- **AND** SHALL use neutral.7 for border (solid variant)
- **AND** SHALL use neutral.11 for leading element color
- **AND** SHALL use critical.7 for invalid border
- **AND** SHALL use critical.11 for invalid text
- **AND** SHALL use neutral.3 for disabled background

#### Scenario: Spacing tokens
- **WHEN** component renders
- **THEN** SHALL use token 400 (16px) for root left padding (md)
- **AND** SHALL use token 300 (12px) for root left padding (sm)
- **AND** SHALL use token 200 (8px) for gap between elements (md)
- **AND** SHALL use token 100 (4px) for gap between elements (sm)
- **AND** SHALL use token 200 (8px) for textarea vertical padding (md)
- **AND** SHALL use token 100 (4px) for textarea vertical padding (sm)

#### Scenario: Size tokens
- **WHEN** component renders
- **THEN** SHALL use token 1000 (40px) for minH (md)
- **AND** SHALL use token 800 (32px) for minH (sm)
- **AND** SHALL use token 500 (20px) for leading icon (md)
- **AND** SHALL use token 400 (16px) for leading icon (sm)
- **AND** SHALL use token 200 for border radius

#### Scenario: Border tokens
- **WHEN** component renders
- **THEN** SHALL use token 200 for border radius (borderRadius: 200)
- **AND** SHALL use token 25 for border width (solid variant)
- **AND** SHALL use token 50 for invalid border width

### Requirement: React Aria Integration
The component SHALL use React Aria's TextField for accessibility per nimbus-core standards.

#### Scenario: TextField with TextArea
- **WHEN** component renders
- **THEN** SHALL use useTextField hook from react-aria
- **AND** SHALL pass textarea element type to useTextField<"textarea">
- **AND** React Aria SHALL provide inputProps for textarea
- **AND** React Aria SHALL manage ARIA attributes

#### Scenario: ARIA attribute management
- **WHEN** useTextField processes props
- **THEN** SHALL set aria-labelledby for label association
- **AND** SHALL set aria-describedby for description association
- **AND** SHALL set aria-required for required fields
- **AND** SHALL set aria-invalid for invalid fields
- **AND** SHALL provide proper textarea semantics

#### Scenario: State management
- **WHEN** React Aria manages state
- **THEN** SHALL handle controlled vs uncontrolled mode
- **AND** SHALL provide proper onChange callbacks
- **AND** SHALL maintain cursor position correctly
- **AND** SHALL support multiline text handling

### Requirement: Type Safety
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** MultilineTextInput is used
- **THEN** SHALL export MultilineTextInputProps interface
- **AND** SHALL extend RaTextFieldProps from react-aria-components
- **AND** SHALL extend MultilineTextInputRootSlotProps for styling
- **AND** SHALL include JSDoc for all props

#### Scenario: Recipe props
- **WHEN** styling variants are used
- **THEN** SHALL export MultilineTextInputRecipeProps type
- **AND** SHALL include size: "sm" | "md" with default "md"
- **AND** SHALL include variant: "solid" | "ghost" with default "solid"
- **AND** SHALL provide autocomplete for variant values

#### Scenario: Slot props
- **WHEN** slots are styled
- **THEN** SHALL export MultilineTextInputRootSlotProps
- **AND** SHALL export MultilineTextInputLeadingElementSlotProps
- **AND** SHALL export MultilineTextInputTextAreaSlotProps
- **AND** all slot props SHALL extend HTMLChakraProps

#### Scenario: Additional props
- **WHEN** component-specific props are used
- **THEN** autoGrow SHALL be typed as boolean with default false
- **AND** rows SHALL be typed as number with default 1
- **AND** leadingElement SHALL be typed as React.ReactNode
- **AND** placeholder SHALL be typed as string
- **AND** ref SHALL be typed as React.Ref<HTMLTextAreaElement>

### Requirement: Auto-grow Hook Implementation
The component SHALL implement useAutogrow hook for height management.

#### Scenario: Hook interface
- **WHEN** useAutogrow hook is called
- **THEN** SHALL accept ref: RefObject<HTMLTextAreaElement | null>
- **AND** SHALL accept options: { enabled?: boolean }
- **AND** SHALL return void (no return value)

#### Scenario: Height calculation
- **WHEN** auto-grow adjusts height
- **THEN** SHALL reset textarea height to "auto" to get scrollHeight
- **AND** SHALL calculate contentHeight from textarea.scrollHeight
- **AND** SHALL read computed maxHeight style from CSS
- **AND** SHALL calculate finalHeight as min(contentHeight, maxHeightPx)
- **AND** SHALL set textarea.style.height = `${finalHeight}px`

#### Scenario: Event listener management
- **WHEN** hook is active (enabled=true)
- **THEN** SHALL add "input" event listener to textarea
- **AND** SHALL call adjustHeight() on input events
- **AND** SHALL call adjustHeight() on initial mount
- **AND** SHALL remove event listener on cleanup

#### Scenario: Hook disabled
- **WHEN** enabled=false or undefined
- **THEN** SHALL NOT add event listeners
- **AND** SHALL NOT adjust height
- **AND** SHALL NOT interfere with static sizing

### Requirement: Responsive Design
The component SHALL support responsive design patterns per nimbus-core standards.

#### Scenario: Responsive size prop
- **WHEN** size prop uses responsive values
- **THEN** SHALL support array syntax: size={["sm", "md"]}
- **AND** SHALL support object syntax: size={{ base: "sm", md: "md" }}
- **AND** SHALL apply breakpoint-specific styling
- **AND** SHALL use Chakra responsive breakpoints

#### Scenario: Responsive height
- **WHEN** minH/maxH use responsive values
- **THEN** SHALL support responsive height constraints
- **AND** SHALL adjust height based on viewport size
- **AND** SHALL maintain auto-grow behavior at each breakpoint

### Requirement: Performance Optimization
The component SHALL be optimized for text entry performance.

#### Scenario: Controlled value updates
- **WHEN** value changes frequently
- **THEN** component SHALL re-render efficiently
- **AND** SHALL NOT cause unnecessary re-renders
- **AND** SHALL maintain cursor position correctly

#### Scenario: Auto-grow performance
- **WHEN** autoGrow is enabled and user types rapidly
- **THEN** height adjustments SHALL be smooth
- **AND** SHALL NOT cause visible jank
- **AND** SHALL use requestAnimationFrame if needed for smoothness

#### Scenario: Large text content
- **WHEN** textarea contains thousands of characters
- **THEN** component SHALL remain responsive
- **AND** typing SHALL not lag
- **AND** scrolling SHALL be smooth

### Requirement: Testing Requirements
The component SHALL have comprehensive tests per nimbus-core standards.

#### Scenario: Storybook stories
- **WHEN** component is tested
- **THEN** SHALL have multiline-text-input.stories.tsx file
- **AND** SHALL include stories: Base, Sizes, Variants, LeadingElements
- **AND** SHALL include stories: Required, Disabled, Invalid
- **AND** SHALL include stories: Controlled, WithRows, AutoGrow, AutoGrowVariants
- **AND** SHALL include stories: SmokeTest, WithFormField

#### Scenario: Play functions
- **WHEN** interactive behavior is tested
- **THEN** stories SHALL include play functions using @storybook/test
- **AND** SHALL test typing multiline text with Enter key
- **AND** SHALL test auto-grow expansion and shrinkage
- **AND** SHALL test controlled mode updates
- **AND** SHALL test disabled, readonly, invalid states
- **AND** SHALL test FormField integration with all states
- **AND** SHALL test keyboard navigation and text selection

#### Scenario: Auto-grow testing
- **WHEN** auto-grow behavior is tested
- **THEN** SHALL verify height increases when typing
- **AND** SHALL verify height decreases when deleting
- **AND** SHALL verify height respects maxHeight constraint
- **AND** SHALL verify resize handle remains functional
- **AND** SHALL verify smooth height transitions

#### Scenario: Accessibility testing
- **WHEN** accessibility is tested
- **THEN** SHALL verify textarea element is used
- **AND** SHALL verify aria-label and aria-labelledby association
- **AND** SHALL verify aria-required attribute when required
- **AND** SHALL verify aria-describedby for errors and descriptions
- **AND** SHALL verify keyboard navigation works
- **AND** SHALL verify focus indicators are visible
- **AND** SHALL verify disabled and readonly states work correctly

### Requirement: Documentation
The component SHALL provide comprehensive documentation per nimbus-core standards.

#### Scenario: MDX documentation
- **WHEN** component is documented
- **THEN** SHALL have multiline-text-input.mdx file
- **AND** SHALL include overview, guidelines, best practices
- **AND** SHALL include usage examples with jsx-live blocks
- **AND** SHALL document when to use vs when not to use
- **AND** SHALL include do's and don'ts examples
- **AND** SHALL document resizing, rows, and auto-grow features

#### Scenario: Engineering documentation
- **WHEN** component is documented
- **THEN** SHALL have multiline-text-input.dev.mdx for internal engineering details
- **AND** SHALL document React Aria integration approach
- **AND** SHALL document auto-grow implementation
- **AND** SHALL document height management strategies

#### Scenario: API documentation
- **WHEN** component is documented
- **THEN** MDX SHALL include <PropsTable id="MultilineTextInput" />
- **AND** props table SHALL auto-generate from TypeScript definitions
- **AND** ALL props SHALL have JSDoc descriptions

### Requirement: Bundle and Export
The component SHALL be properly exported and built per nimbus-core standards.

#### Scenario: Package exports
- **WHEN** component is imported
- **THEN** SHALL export from index.ts barrel file
- **AND** SHALL export MultilineTextInput component
- **AND** SHALL export MultilineTextInputProps type
- **AND** SHALL export MultilineTextInputRecipeProps type
- **AND** SHALL support tree-shaking

#### Scenario: Build output
- **WHEN** package is built
- **THEN** SHALL include component in ESM bundle
- **AND** SHALL include component in CommonJS bundle
- **AND** SHALL include TypeScript declarations
- **AND** SHALL externalize React, Chakra, React Aria as peer dependencies

#### Scenario: Import paths
- **WHEN** consumers import component
- **THEN** SHALL support: import { MultilineTextInput } from '@commercetools/nimbus'
- **AND** SHALL support: import { MultilineTextInputProps } from '@commercetools/nimbus'
- **AND** SHALL NOT require deep imports
