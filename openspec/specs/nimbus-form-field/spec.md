# Specification: FormField Component

## Overview

The FormField component provides an accessible form field wrapper container that coordinates label, input, description, and error message elements. It implements a compound component pattern using React Context to manage associations between field elements and provides comprehensive ARIA labeling and description management.

**Component:** `FormField`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot compound component (form wrapper)
**React Aria:** Uses `useField` hook from react-aria
**Pattern:** Context-based compound component with slot composition

## Purpose

Provide a flexible, accessible form field container that wraps any input component with coordinated label, helper text, and error message display. Manages ARIA associations (aria-labelledby, aria-describedby, aria-errormessage) automatically and provides consistent form field layout patterns while maintaining WCAG 2.1 AA compliance.

## Requirements

### Requirement: Compound Component Structure
The component SHALL use namespace compound pattern with context-based state management.

#### Scenario: Root component
- **WHEN** FormField.Root renders
- **THEN** SHALL provide FormFieldContext to all child components
- **AND** SHALL use React Aria's useField hook for accessibility
- **AND** SHALL manage field state (isRequired, isInvalid, isDisabled, isReadOnly)
- **AND** SHALL coordinate rendering of label, input, description, and error slots
- **AND** SHALL forward style props to root slot element

#### Scenario: Child components coordination
- **WHEN** FormField child components render
- **THEN** SHALL register content with FormFieldContext via useEffect
- **AND** child components SHALL return null (not render directly)
- **AND** Root component SHALL render registered content in appropriate slots
- **AND** SHALL cleanup content on component unmount

#### Scenario: Component composition
- **WHEN** FormField components are composed
- **THEN** SHALL support any order of child components
- **AND** SHALL allow optional components (label, description, error, info can be omitted)
- **AND** SHALL require at least FormField.Input with input element
- **AND** SHALL support arbitrary React children in Root

### Requirement: Label Rendering and Association
The component SHALL provide accessible label rendering with automatic ARIA association.

#### Scenario: Label element rendering
- **WHEN** FormField.Label contains children
- **THEN** Root component SHALL render label element with labelProps from useField
- **AND** SHALL display label text in label slot
- **AND** SHALL associate label with input via aria-labelledby
- **AND** SHALL forward style props from FormField.Label to label slot

#### Scenario: Required field indicator
- **WHEN** isRequired={true} is set on FormField.Root
- **THEN** label SHALL display asterisk (*) as superscript
- **AND** asterisk SHALL have aria-hidden="true" (decorative)
- **AND** SHALL set data-required="true" on label element
- **AND** SHALL maintain top-right alignment of asterisk via flexbox
- **AND** input SHALL have aria-required="true"

#### Scenario: Label without text
- **WHEN** FormField.Label is not provided
- **THEN** useField SHALL receive stub aria-label and aria-labelledby
- **AND** SHALL not render label slot in DOM
- **AND** input element SHOULD provide its own aria-label
- **AND** accessibility SHALL depend on input's labeling strategy

### Requirement: Input Wrapper and Cloning
The component SHALL wrap and enhance input elements with field props.

#### Scenario: Input element wrapping
- **WHEN** FormField.Input wraps an input component
- **THEN** SHALL register input children with FormFieldContext
- **AND** Root SHALL render input in input slot
- **AND** SHALL clone React element children with additional props
- **AND** SHALL pass fieldProps from useField to cloned input
- **AND** SHALL forward isRequired, isInvalid, isDisabled, isReadOnly to input

#### Scenario: Props merging
- **WHEN** Root clones input element
- **THEN** SHALL merge fieldProps with input's existing props
- **AND** SHALL include: id, aria-labelledby, aria-describedby, aria-errormessage
- **AND** SHALL include state props: data-invalid, data-required, data-disabled, data-readonly
- **AND** SHALL preserve input's original props (no overwriting)

#### Scenario: Non-React children handling
- **WHEN** FormField.Input contains non-element children (text, null, undefined)
- **THEN** SHALL return children as-is without cloning
- **AND** SHALL not throw error on text nodes
- **AND** SHALL gracefully handle empty children

### Requirement: Description Text Support
The component SHALL support helper text with automatic ARIA association.

#### Scenario: Description rendering
- **WHEN** FormField.Description contains children
- **THEN** Root component SHALL render description in description slot
- **AND** SHALL apply descriptionProps from useField
- **AND** SHALL associate with input via aria-describedby
- **AND** SHALL forward style props from FormField.Description to description slot

#### Scenario: Description and error coordination
- **WHEN** both description and error are present
- **THEN** input aria-describedby SHALL reference both elements (space-separated IDs)
- **AND** SHALL maintain description visibility when field is invalid
- **AND** error message SHALL be appended to aria-describedby list

#### Scenario: Description styling
- **WHEN** description renders
- **THEN** SHALL use color: neutral.11 from design tokens
- **AND** SHALL use font size from CSS variable --form-field-font-size
- **AND** SHALL use line height from CSS variable --form-field-line-height
- **AND** SHALL apply spacing based on direction variant

### Requirement: Error Message Display
The component SHALL display validation errors with ARIA association and icon.

#### Scenario: Error message rendering
- **WHEN** isInvalid={true} and FormField.Error contains children
- **THEN** Root component SHALL render error in error slot
- **AND** SHALL apply errorMessageProps from useField
- **AND** SHALL associate with input via aria-describedby
- **AND** SHALL forward style props from FormField.Error to error slot

#### Scenario: Error visibility control
- **WHEN** isInvalid={false}
- **THEN** error message SHALL NOT render in DOM
- **WHEN** isInvalid={true} but FormField.Error not provided
- **THEN** SHALL not render error slot
- **WHEN** isInvalid={true} and FormField.Error provided
- **THEN** SHALL render error message with icon

#### Scenario: Error icon display
- **WHEN** error message renders
- **THEN** SHALL display ErrorOutline icon before text
- **AND** icon SHALL use color: critical.11 from design tokens
- **AND** icon SHALL have boxSize="400" (16px)
- **AND** icon SHALL have display: inline-flex with vertical-align: text-bottom
- **AND** SHALL apply mr="100" (4px spacing) between icon and text

#### Scenario: Error styling
- **WHEN** error renders
- **THEN** SHALL use color: critical.11 for text
- **AND** SHALL use font size from CSS variable --form-field-font-size
- **AND** SHALL use line height from CSS variable --form-field-line-height
- **AND** SHALL display as flex with gap="100"
- **AND** SHALL apply spacing based on direction variant

### Requirement: Info Box Support
The component SHALL provide contextual help via popover with trigger button.

#### Scenario: Info box trigger rendering
- **WHEN** FormField.InfoBox contains children
- **THEN** SHALL render IconButton next to label text
- **AND** button SHALL display HelpOutline icon
- **AND** button SHALL use size="2xs", variant="link", colorPalette="info"
- **AND** button SHALL have aria-label "__MORE INFO" (placeholder)
- **AND** SHALL apply ml="200" (8px spacing) from label text

#### Scenario: Info box popover display
- **WHEN** user clicks info button
- **THEN** SHALL open React Aria DialogTrigger popover
- **AND** popover SHALL display FormField.InfoBox children
- **AND** SHALL apply popover slot styling from recipe
- **AND** popover SHALL have padding p="300"

#### Scenario: Info box popover styling
- **WHEN** popover renders
- **THEN** SHALL use bg: neutral.1, borderRadius: 200, boxShadow: 6
- **AND** SHALL have border: solid-25, borderColor: neutral.8
- **AND** SHALL set maxWidth: xl, maxHeight: 40svh
- **AND** SHALL enable scrolling with overflow: auto
- **AND** SHALL apply custom scrollbar colors (--scrollbar-color, --scrollbar-bg)
- **AND** SHALL have focusRing: outside for keyboard navigation

#### Scenario: Info box trigger positioning
- **WHEN** info button renders
- **THEN** SHALL use inline-block wrapper with width: 1ch, height: 1ch
- **AND** button SHALL be absolutely positioned via transform: translate(50%, -50%)
- **AND** SHALL align vertically with label baseline
- **AND** SHALL not disrupt label text flow

#### Scenario: Info box keyboard interaction
- **WHEN** user presses Tab to info button and activates with Enter/Space
- **THEN** SHALL open popover
- **WHEN** user presses Escape
- **THEN** SHALL close popover
- **AND** SHALL return focus to trigger button

### Requirement: Field State Management
The component SHALL manage and propagate field state to input elements.

#### Scenario: Required state
- **WHEN** isRequired={true} is set on FormField.Root
- **THEN** SHALL pass isRequired to input via props cloning
- **AND** SHALL display required indicator (*) in label
- **AND** input SHALL receive aria-required="true"
- **AND** SHALL set data-required="true" on label element

#### Scenario: Invalid state
- **WHEN** isInvalid={true} is set on FormField.Root
- **THEN** SHALL pass isInvalid to input via props cloning
- **AND** SHALL display error message if FormField.Error provided
- **AND** input SHALL receive aria-invalid="true" (via fieldProps)
- **AND** SHALL render error slot with error styling

#### Scenario: Disabled state
- **WHEN** isDisabled={true} is set on FormField.Root
- **THEN** SHALL pass isDisabled to input via props cloning
- **AND** input SHALL receive aria-disabled="true"
- **AND** SHALL apply disabled styling through input component
- **AND** SHALL prevent all interactions with input

#### Scenario: Read-only state
- **WHEN** isReadOnly={true} is set on FormField.Root
- **THEN** SHALL pass isReadOnly to input via props cloning
- **AND** input SHALL receive aria-readonly="true"
- **AND** SHALL prevent value changes while allowing focus
- **AND** SHALL apply read-only styling through input component

#### Scenario: State updates
- **WHEN** FormField.Root state props change
- **THEN** SHALL update FormFieldContext via useEffect
- **AND** SHALL propagate state to input on next render
- **AND** SHALL maintain state consistency across all child components

### Requirement: Layout Direction Options
The component SHALL support vertical and horizontal layout variants per nimbus-core standards.

#### Scenario: Column layout (default)
- **WHEN** direction="column" or no direction specified
- **THEN** SHALL use CSS Grid with grid-template-areas: "label", "input", "description", "error"
- **AND** SHALL stack elements vertically with consistent spacing
- **AND** input SHALL have mt="var(--grid-gap)" from label
- **AND** description and error SHALL have mt="var(--grid-gap)" from previous element

#### Scenario: Row layout
- **WHEN** direction="row" is set
- **THEN** SHALL use CSS Grid with grid-template-areas: "label input", "label description", "label error"
- **AND** SHALL position label in left column, input/description/error in right column
- **AND** SHALL set gridTemplateColumns: "auto 1fr" (label auto-width, input takes remaining)
- **AND** SHALL apply gridColumnGap: 200 (8px) between columns
- **AND** description and error SHALL have mt="var(--grid-gap)" for vertical spacing

#### Scenario: Responsive layout
- **WHEN** direction prop uses responsive syntax
- **THEN** SHALL support direction={{ base: "column", md: "row" }}
- **AND** SHALL apply appropriate grid layout at each breakpoint
- **AND** SHALL maintain ARIA associations across layout changes

### Requirement: Size Variants
The component SHALL support size variants that affect typography per nimbus-core standards.

#### Scenario: Medium size (default)
- **WHEN** size="md" or no size specified
- **THEN** SHALL set --form-field-font-size: fontSizes.350 (14px)
- **AND** SHALL set --form-field-line-height: lineHeights.500 (20px)
- **AND** label, description, and error SHALL use these CSS variables

#### Scenario: Small size
- **WHEN** size="sm" is set
- **THEN** SHALL set --form-field-font-size: fontSizes.300 (13px)
- **AND** SHALL set --form-field-line-height: lineHeights.450 (18px)
- **AND** label, description, and error SHALL use these CSS variables

#### Scenario: Size propagation
- **WHEN** size is set on FormField.Root
- **THEN** size variant SHALL affect typography of label, description, error
- **AND** SHALL NOT directly control input size (input manages own size)
- **AND** input component MAY independently accept size prop

### Requirement: Multi-Slot Recipe Styling
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot recipe registration
- **WHEN** component renders
- **THEN** SHALL use formField slot recipe from theme/slot-recipes/form-field.ts
- **AND** recipe SHALL be manually registered in theme config
- **AND** SHALL style: root, label, input, description, error, popover slots

#### Scenario: Root slot styling
- **WHEN** root slot renders
- **THEN** SHALL apply display: grid, width: auto
- **AND** SHALL define --grid-gap: spacing.100 (4px) as CSS variable
- **AND** SHALL apply appropriate grid-template-areas based on direction variant

#### Scenario: Label slot styling
- **WHEN** label slot renders
- **THEN** SHALL apply gridArea: label, fontWeight: 500, color: neutral.11
- **AND** SHALL use CSS variables for font-size and line-height
- **AND** required indicator SHALL use inline-flex with top-aligned superscript

#### Scenario: Input slot styling
- **WHEN** input slot renders
- **THEN** SHALL apply gridArea: input
- **AND** SHALL apply spacing based on direction variant
- **AND** SHALL NOT apply intrinsic styling (input component handles own styles)

#### Scenario: Design token usage
- **WHEN** any slot renders
- **THEN** SHALL use design tokens from @commercetools/nimbus-tokens
- **AND** SHALL NOT use hardcoded colors, spacing, or typography values
- **AND** SHALL support light and dark mode via semantic tokens

### Requirement: ARIA Associations
The component SHALL automatically manage ARIA relationships between elements per nimbus-core standards.

#### Scenario: Label association
- **WHEN** label is provided
- **THEN** useField SHALL generate unique label ID
- **AND** input SHALL receive aria-labelledby referencing label ID
- **AND** label SHALL have htmlFor attribute matching input ID (via labelProps)
- **AND** clicking label SHALL focus input

#### Scenario: Description association
- **WHEN** description is provided
- **THEN** useField SHALL generate unique description ID
- **AND** input SHALL receive aria-describedby referencing description ID
- **AND** screen readers SHALL announce description when input is focused

#### Scenario: Error message association
- **WHEN** isInvalid and error message provided
- **THEN** useField SHALL generate unique error ID
- **AND** input SHALL receive aria-describedby referencing error ID
- **AND** SHALL append error ID to existing aria-describedby if description exists
- **AND** screen readers SHALL announce error when input is focused or validated

#### Scenario: Multiple descriptions
- **WHEN** both description and error are present and field is invalid
- **THEN** input aria-describedby SHALL contain both description ID and error ID
- **AND** IDs SHALL be space-separated in single attribute
- **AND** screen readers SHALL announce both messages in order

### Requirement: Input Component Compatibility
The component SHALL support wrapping any input component.

#### Scenario: TextInput integration
- **WHEN** FormField wraps TextInput
- **THEN** SHALL pass all field props to TextInput
- **AND** TextInput SHALL inherit isRequired, isInvalid, isDisabled, isReadOnly
- **AND** SHALL maintain TextInput's internal validation and state management
- **AND** ARIA associations SHALL work correctly

#### Scenario: Select integration
- **WHEN** FormField wraps Select.Root
- **THEN** SHALL pass field props to Select.Root
- **AND** Select trigger SHALL receive aria-labelledby and aria-describedby
- **AND** Select SHALL function with FormField validation states
- **AND** error messages SHALL display appropriately for Select

#### Scenario: Custom input integration
- **WHEN** FormField wraps custom input component
- **THEN** custom component SHOULD accept fieldProps from React Aria
- **AND** custom component SHOULD accept isRequired, isInvalid, isDisabled, isReadOnly
- **AND** custom component SHOULD handle ARIA attributes appropriately
- **AND** FormField SHALL not break if custom component ignores props

#### Scenario: Multiple input elements
- **WHEN** FormField.Input contains multiple children
- **THEN** SHALL attempt to clone all valid React elements
- **AND** SHALL pass field props to each child element
- **AND** ARIA associations MAY only apply to first focusable element
- **AND** use case is discouraged (one input per FormField)

### Requirement: Context-Based State Management
The component SHALL use React Context for coordinating child components.

#### Scenario: Context provider
- **WHEN** FormField.Root renders
- **THEN** SHALL create FormFieldContext.Provider
- **AND** context SHALL contain: label, description, error, info, input content
- **AND** context SHALL contain: labelSlotProps, descriptionSlotProps, errorSlotProps, inputSlotProps
- **AND** context SHALL contain: isInvalid, isRequired, isDisabled, isReadOnly state

#### Scenario: Context registration
- **WHEN** FormField.Label, Description, Error, InfoBox, or Input mounts
- **THEN** SHALL call setContext with content and slot props
- **AND** SHALL trigger re-render of FormField.Root
- **AND** Root SHALL render registered content in appropriate slots

#### Scenario: Context cleanup
- **WHEN** FormField child component unmounts
- **THEN** SHALL return cleanup function from useEffect
- **AND** cleanup SHALL call setContext to set content to null
- **AND** SHALL remove slot props from context
- **AND** Root SHALL remove slot from rendered output

#### Scenario: Context updates
- **WHEN** child component content or props change
- **THEN** useEffect SHALL run again with new dependencies
- **AND** SHALL update context with new content/props
- **AND** Root SHALL re-render with updated content

### Requirement: TypeScript Type Safety
The component SHALL provide comprehensive type definitions per nimbus-core standards.

#### Scenario: Props types
- **WHEN** component is authored
- **THEN** SHALL export FormFieldProps for FormField.Root
- **AND** SHALL export FormFieldLabelSlotProps, FormFieldInputSlotProps, FormFieldDescriptionSlotProps, FormFieldErrorSlotProps
- **AND** SHALL export FormFieldPopoverSlotProps for info box popover
- **AND** all slot props SHALL extend HTMLChakraProps with appropriate element type

#### Scenario: Recipe props
- **WHEN** FormField.Root is used
- **THEN** SHALL accept size prop: "sm" | "md" with autocomplete
- **AND** SHALL accept direction prop: "column" | "row" with autocomplete
- **AND** SHALL support responsive syntax for both props
- **AND** types SHALL derive from SlotRecipeProps<"formField">

#### Scenario: State props
- **WHEN** FormField.Root is used
- **THEN** SHALL accept isRequired, isInvalid, isDisabled, isReadOnly as boolean props
- **AND** SHALL accept id prop as string for input element
- **AND** SHALL accept ref prop with React.Ref<HTMLDivElement>
- **AND** SHALL accept children prop as React.ReactNode

#### Scenario: Slot component props
- **WHEN** FormField.Label, Description, Error, InfoBox, Input are used
- **THEN** each SHALL accept children prop as React.ReactNode
- **AND** each SHALL accept style props via HTMLChakraProps
- **AND** SHALL support spreading additional HTML attributes

### Requirement: Keyboard Navigation
The component SHALL support keyboard interactions per nimbus-core standards.

#### Scenario: Tab navigation
- **WHEN** user presses Tab key
- **THEN** SHALL follow order: previous element → label (if focusable) → input → info button (if present) → next element
- **AND** SHALL maintain logical tab order in forms
- **AND** SHALL not trap focus within field

#### Scenario: Label click
- **WHEN** user clicks label element
- **THEN** SHALL focus associated input element
- **AND** SHALL work via htmlFor/id association from React Aria
- **AND** SHALL not trigger info button if present

#### Scenario: Info button interaction
- **WHEN** info button is focused and Enter/Space pressed
- **THEN** SHALL open info popover
- **AND** SHALL move focus into popover dialog
- **WHEN** Escape pressed in popover
- **THEN** SHALL close popover and return focus to info button

### Requirement: Form Integration
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** FormField is inside a form element
- **THEN** wrapped input SHALL participate in form submission
- **AND** SHALL include input value in form data using input's name attribute
- **AND** SHALL support form validation via isRequired and isInvalid
- **AND** SHALL prevent submission if input is required and empty

#### Scenario: Form validation trigger
- **WHEN** form validation runs
- **THEN** FormField SHALL respond to isInvalid state changes
- **AND** SHALL display error message if validation fails
- **AND** SHALL visually indicate invalid state via input styling
- **AND** SHALL announce error to screen readers via aria-describedby

### Requirement: Accessibility Compliance
The component SHALL meet WCAG 2.1 AA standards per nimbus-core standards.

#### Scenario: Screen reader support
- **WHEN** screen reader user navigates to field
- **THEN** SHALL announce label text
- **AND** SHALL announce required state if applicable
- **AND** SHALL announce description text if provided
- **AND** SHALL announce error message if invalid
- **AND** SHALL announce input type and current value

#### Scenario: Focus indicators
- **WHEN** input or info button receives focus
- **THEN** SHALL display visible focus indicator
- **AND** SHALL meet 3:1 contrast ratio requirement
- **AND** SHALL be clearly distinguishable from unfocused state
- **AND** focus ring SHALL be provided by input component or IconButton

#### Scenario: Color contrast
- **WHEN** component renders
- **THEN** label SHALL meet 4.5:1 contrast ratio (neutral.11 on background)
- **AND** description SHALL meet 4.5:1 contrast ratio
- **AND** error SHALL meet 4.5:1 contrast ratio (critical.11 on background)
- **AND** info button icon SHALL meet 3:1 contrast ratio

#### Scenario: Touch targets
- **WHEN** component renders on touch device
- **THEN** info button SHALL meet minimum 44x44px touch target (via IconButton size="2xs")
- **AND** input element SHALL meet touch target requirements (via input component)

### Requirement: Responsive Design
The component SHALL support responsive design patterns per nimbus-core standards.

#### Scenario: Responsive direction
- **WHEN** direction prop uses responsive syntax
- **THEN** SHALL support: direction={{ base: "column", md: "row" }}
- **AND** SHALL apply column layout on mobile, row layout on desktop
- **AND** SHALL maintain ARIA associations across breakpoints
- **AND** SHALL adjust grid-template-areas at each breakpoint

#### Scenario: Responsive size
- **WHEN** size prop uses responsive syntax
- **THEN** SHALL support: size={{ base: "sm", md: "md" }}
- **AND** SHALL apply appropriate typography at each breakpoint
- **AND** SHALL update CSS variables at each breakpoint

### Requirement: Style Props Support
The component SHALL accept Chakra style props per nimbus-core standards.

#### Scenario: Root style props
- **WHEN** style props are passed to FormField.Root
- **THEN** SHALL forward to root slot element
- **AND** SHALL support spacing props (margin, padding)
- **AND** SHALL support layout props (width, maxWidth)
- **AND** SHALL support color props (bg, color)

#### Scenario: Slot style props
- **WHEN** style props are passed to FormField.Label, Description, Error
- **THEN** SHALL forward to respective slot elements
- **AND** SHALL merge with recipe styles
- **AND** SHALL allow style overrides when needed
- **AND** SHALL support responsive style prop syntax

### Requirement: JSDoc Documentation
The component SHALL provide comprehensive JSDoc per nimbus-core standards.

#### Scenario: Component documentation
- **WHEN** component is authored
- **THEN** each compound component SHALL have JSDoc block with description
- **AND** SHALL include @example tag with usage code
- **AND** SHALL document purpose and coordination with other parts
- **AND** Root component JSDoc SHALL explain state management and context

#### Scenario: Props documentation
- **WHEN** types are defined in form-field.types.ts
- **THEN** all props SHALL have JSDoc comments
- **AND** SHALL include @default tags for default values
- **AND** SHALL describe prop purpose and behavior
- **AND** SHALL document valid values for variant props

### Requirement: React Aria Integration
The component SHALL use React Aria for accessibility per nimbus-core standards.

#### Scenario: useField hook usage
- **WHEN** FormField.Root initializes
- **THEN** SHALL call useField hook with label, description, errorMessage, id
- **AND** SHALL receive labelProps, fieldProps, descriptionProps, errorMessageProps
- **AND** SHALL apply returned props to appropriate slot elements
- **AND** SHALL handle missing label gracefully with stub aria-label

#### Scenario: Props propagation
- **WHEN** useField returns props
- **THEN** labelProps SHALL be spread on label element
- **AND** fieldProps SHALL be spread on input element (via cloneElement)
- **AND** descriptionProps SHALL be spread on description element
- **AND** errorMessageProps SHALL be spread on error element

### Requirement: Display Names
The component SHALL set display names per nimbus-core standards.

#### Scenario: Component display names
- **WHEN** components are defined
- **THEN** FormFieldRoot SHALL have displayName: "FormField.Root"
- **AND** FormFieldLabel SHALL have displayName: "FormField.Label"
- **AND** FormFieldInput SHALL have displayName: "FormField.Input"
- **AND** FormFieldDescription SHALL have displayName: "FormField.Description"
- **AND** FormFieldError SHALL have displayName: "FormField.Error"
- **AND** FormFieldInfoBox SHALL have displayName: "FormField.InfoBox"
- **AND** display names SHALL aid debugging and React DevTools inspection
