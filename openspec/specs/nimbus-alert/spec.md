# Specification: Alert Component

## Overview

The Alert component provides feedback to users about the status of an action or system event. It follows a compound component architecture for flexible composition and supports multiple semantic color palettes and visual variants to convey different levels of urgency and meaning.

**Component:** `Alert` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** None (presentational feedback component)
**i18n:** Yes (dismiss button label)

## Purpose

Alerts communicate important messages to users about system states, action outcomes, or conditions requiring attention. They use semantic color coding, optional icons, and flexible content areas to convey information hierarchy and urgency, helping users quickly understand context and take appropriate action when needed.

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace with coordinated parts.

#### Scenario: Component parts
- **WHEN** Alert is imported
- **THEN** SHALL provide Alert.Root as alert container
- **AND** SHALL provide Alert.Title for heading text
- **AND** SHALL provide Alert.Description for detailed message
- **AND** SHALL provide Alert.Actions for action buttons
- **AND** SHALL provide Alert.DismissButton for closing alert
- **AND** Root SHALL be first property in namespace

#### Scenario: Flexible composition
- **WHEN** consumer uses Alert components
- **THEN** SHALL allow Alert.Root with only Title
- **AND** SHALL allow Alert.Root with only Description
- **AND** SHALL allow Alert.Root with Title and Description
- **AND** SHALL allow any combination of parts
- **AND** SHALL support omitting optional parts (Actions, DismissButton)
- **AND** SHALL maintain layout consistency via multi-slot recipe


### Requirement: Root Container Component
The component SHALL provide root container with semantic color palette configuration.

#### Scenario: Root rendering
- **WHEN** Alert.Root renders
- **THEN** SHALL render as div element
- **AND** SHALL accept all Chakra style props
- **AND** SHALL apply multi-slot recipe variants
- **AND** SHALL provide context for child slot components
- **AND** SHALL set role="alert" for accessibility

#### Scenario: ARIA role attribute
- **WHEN** Alert.Root renders
- **THEN** SHALL apply role="alert" attribute
- **AND** SHALL announce to screen readers immediately on render
- **AND** SHALL be appropriate for time-sensitive, important messages
- **AND** SHALL not require user interaction to be announced

#### Scenario: Style prop forwarding
- **WHEN** style props are provided on Root
- **THEN** SHALL accept and apply all Chakra style props
- **AND** SHALL apply recipe variants first, then style overrides
- **AND** SHALL support width, margin, padding customization


### Requirement: Semantic Color Palettes
The component SHALL support semantic color palettes for different message types.

#### Scenario: Critical palette
- **WHEN** colorPalette="critical" is set on Root
- **THEN** SHALL apply critical semantic colors
- **AND** SHALL use colorPalette.11 for text and icon
- **AND** SHALL use colorPalette.5 for outlined border
- **AND** SHALL use colorPalette.2 for outlined background
- **AND** SHALL convey error or destructive states
- **AND** SHALL display ErrorOutline icon automatically

#### Scenario: Info palette
- **WHEN** colorPalette="info" is set on Root
- **THEN** SHALL apply info semantic colors
- **AND** SHALL use colorPalette.11 for text and icon
- **AND** SHALL convey informational messages
- **AND** SHALL display Info icon automatically

#### Scenario: Warning palette
- **WHEN** colorPalette="warning" is set on Root
- **THEN** SHALL apply warning semantic colors
- **AND** SHALL use colorPalette.11 for text and icon
- **AND** SHALL convey cautionary messages
- **AND** SHALL display WarningAmber icon automatically

#### Scenario: Positive palette
- **WHEN** colorPalette="positive" is set on Root
- **THEN** SHALL apply positive semantic colors
- **AND** SHALL use colorPalette.11 for text and icon
- **AND** SHALL convey success or confirmation states
- **AND** SHALL display CheckCircleOutline icon automatically

#### Scenario: Color palette restrictions
- **WHEN** colorPalette prop is set
- **THEN** SHALL accept: critical, info, warning, positive
- **AND** SHALL exclude neutral and primary from semantic palettes
- **AND** SHALL type as: Exclude<SemanticPalettesOnly, "neutral" | "primary">


### Requirement: Automatic Icon Display
The component SHALL automatically display appropriate icon based on color palette.

#### Scenario: Icon selection by palette
- **WHEN** Alert.Root renders with colorPalette
- **THEN** SHALL render icon in dedicated icon slot
- **AND** critical SHALL display ErrorOutline icon
- **AND** info SHALL display Info icon
- **AND** warning SHALL display WarningAmber icon
- **AND** positive SHALL display CheckCircleOutline icon

#### Scenario: Icon styling
- **WHEN** icon renders
- **THEN** SHALL position in grid column 1
- **AND** SHALL apply icon slot styles from recipe
- **AND** SHALL set icon color to colorPalette.11
- **AND** SHALL set icon size to 500x500 (design token)
- **AND** SHALL align to flex-start (top) with marginTop 50
- **AND** SHALL not shrink (flexShrink: 0)

#### Scenario: Icon source
- **WHEN** icons render
- **THEN** SHALL import from @commercetools/nimbus-icons
- **AND** SHALL use: ErrorOutline, Info, WarningAmber, CheckCircleOutline
- **AND** SHALL render as SVG elements


### Requirement: Visual Variant Styles
The component SHALL support flat and outlined visual variants.

#### Scenario: Flat variant
- **WHEN** variant="flat" is set on Root
- **THEN** SHALL render without border or background
- **AND** SHALL display minimal visual weight
- **AND** SHALL rely on icon and color for distinction
- **AND** SHALL not apply padding, border, or borderRadius

#### Scenario: Outlined variant
- **WHEN** variant="outlined" is set on Root (default)
- **THEN** SHALL render with visible border
- **AND** SHALL use solid-25 border width
- **AND** SHALL use colorPalette.5 border color
- **AND** SHALL use colorPalette.2 background color
- **AND** SHALL apply padding 200 (design token)
- **AND** SHALL apply borderRadius 200 (design token)
- **AND** SHALL provide contained, card-like appearance


### Requirement: Grid Layout System
The component SHALL use CSS Grid for flexible multi-column layout.

#### Scenario: Grid structure
- **WHEN** Alert.Root renders
- **THEN** SHALL use display: grid
- **AND** SHALL define gridTemplateColumns: "auto 1fr auto"
- **AND** SHALL define gap 200 (design token)
- **AND** SHALL set width 100%
- **AND** SHALL align items to start

#### Scenario: Column allocation
- **WHEN** alert parts render
- **THEN** icon SHALL occupy column 1 (auto width)
- **AND** Title, Description, Actions SHALL occupy column 2 (flexible 1fr)
- **AND** DismissButton SHALL occupy column 3 (auto width)
- **AND** SHALL maintain consistent spacing via gap


### Requirement: Title Section
The component SHALL provide title component for heading text.

#### Scenario: Title rendering
- **WHEN** Alert.Title renders
- **THEN** SHALL render as div element
- **AND** SHALL register with root context via withContext("title")
- **AND** SHALL accept all Chakra style props
- **AND** SHALL set displayName="Alert.Title"

#### Scenario: Title positioning
- **WHEN** Alert.Title is included
- **THEN** SHALL position in grid column 2
- **AND** SHALL apply order: 1 for vertical sequencing
- **AND** SHALL appear before Description and Actions
- **AND** SHALL apply color: colorPalette.11

#### Scenario: Title typography
- **WHEN** Title renders
- **THEN** SHALL apply fontWeight 600 (semibold)
- **AND** SHALL inherit text color from slot recipe
- **AND** SHALL support style prop overrides


### Requirement: Description Section
The component SHALL provide description component for detailed message text.

#### Scenario: Description rendering
- **WHEN** Alert.Description renders
- **THEN** SHALL render as div element
- **AND** SHALL register with root context via withContext("description")
- **AND** SHALL accept all Chakra style props
- **AND** SHALL set displayName="Alert.Description"

#### Scenario: Description positioning
- **WHEN** Alert.Description is included
- **THEN** SHALL position in grid column 2
- **AND** SHALL apply order: 2 for vertical sequencing
- **AND** SHALL appear after Title, before Actions
- **AND** SHALL apply color: colorPalette.11

#### Scenario: Description typography
- **WHEN** Description renders
- **THEN** SHALL use default font weight (not bold)
- **AND** SHALL inherit text color from slot recipe
- **AND** SHALL support multi-line text content


### Requirement: Actions Section
The component SHALL provide actions container for button elements.

#### Scenario: Actions rendering
- **WHEN** Alert.Actions renders
- **THEN** SHALL render as div element
- **AND** SHALL register with root context via withContext("actions")
- **AND** SHALL accept all Chakra style props
- **AND** SHALL set displayName="Alert.Actions"

#### Scenario: Actions positioning
- **WHEN** Alert.Actions is included
- **THEN** SHALL position in grid column 2
- **AND** SHALL apply order: 3 for vertical sequencing
- **AND** SHALL appear after Title and Description
- **AND** SHALL not apply intrinsic color (buttons style themselves)

#### Scenario: Actions content flexibility
- **WHEN** Actions contains button elements
- **THEN** SHALL support any button components
- **AND** SHALL support Stack for button layout
- **AND** SHALL support single or multiple buttons
- **AND** consumer SHALL manage button spacing and arrangement


### Requirement: Dismiss Button Component
The component SHALL provide dismiss button for closing alert.

#### Scenario: Dismiss button rendering
- **WHEN** Alert.DismissButton renders
- **THEN** SHALL render as div wrapper containing IconButton
- **AND** wrapper SHALL register with root context via withContext("dismissButton")
- **AND** IconButton SHALL render Clear icon
- **AND** SHALL set displayName="Alert.DismissButton"

#### Scenario: Dismiss button positioning
- **WHEN** Alert.DismissButton is included
- **THEN** SHALL position in grid column 3
- **AND** SHALL apply gridRow: 1
- **AND** SHALL align with Title in first row
- **AND** SHALL appear on right side of alert

#### Scenario: Dismiss button styling
- **WHEN** DismissButton renders
- **THEN** IconButton SHALL use variant="ghost"
- **AND** IconButton SHALL use size="2xs"
- **AND** Clear icon SHALL have role="img"
- **AND** SHALL inherit color from parent context

#### Scenario: Dismiss button interaction
- **WHEN** user clicks DismissButton
- **THEN** SHALL call onPress handler
- **AND** SHALL forward all ButtonProps to IconButton
- **AND** SHALL support keyboard activation (Enter, Space)
- **AND** SHALL be focusable and keyboard accessible


### Requirement: Internationalization Support
The component SHALL provide localized labels for dismiss button.

#### Scenario: Default dismiss label
- **WHEN** Alert.DismissButton renders
- **THEN** SHALL use useLocalizedStringFormatter hook from @/hooks
- **AND** SHALL format message from alert.i18n.ts
- **AND** SHALL apply formatted message as aria-label
- **AND** message id SHALL be "Nimbus.Alert.dismiss"
- **AND** defaultMessage SHALL be "Dismiss"

#### Scenario: i18n message definition
- **WHEN** i18n messages are defined
- **THEN** SHALL define messages as plain TypeScript objects
- **AND** SHALL include id, description, defaultMessage fields
- **AND** messages SHALL be extractable for translation
- **AND** SHALL integrate with Transifex workflow


### Requirement: Multi-Slot Recipe System
The component SHALL use multi-slot recipe for coordinated styling per nimbus-core standards.

#### Scenario: Recipe definition
- **WHEN** alertRecipe is defined
- **THEN** SHALL use defineSlotRecipe from Chakra
- **AND** SHALL define slots: root, title, description, icon, actions, dismissButton
- **AND** SHALL set className: "nimbus-alert"
- **AND** SHALL define variant property with flat and outlined options

#### Scenario: Recipe registration
- **WHEN** Alert component is used
- **THEN** alertRecipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL use "alert" key
- **AND** CRITICAL: registration SHALL be manual (no auto-discovery)

#### Scenario: Base slot styles
- **WHEN** recipe applies base styles
- **THEN** root SHALL define grid layout properties
- **AND** icon SHALL define positioning and sizing
- **AND** title SHALL define order and color
- **AND** description SHALL define order and color
- **AND** actions SHALL define order
- **AND** dismissButton SHALL define positioning


### Requirement: Context-Based Slot Coordination
The component SHALL use Chakra slot recipe context for part coordination.

#### Scenario: Context creation
- **WHEN** alertRecipe context is created
- **THEN** SHALL use createSlotRecipeContext with key "alert"
- **AND** SHALL extract withProvider and withContext utilities
- **AND** SHALL provide recipe configuration to all slots

#### Scenario: Provider component
- **WHEN** AlertRoot is created
- **THEN** SHALL use withProvider<HTMLDivElement, AlertRootSlotProps>("div", "root")
- **AND** SHALL wrap children with recipe context
- **AND** SHALL forward colorPalette and variant props to context

#### Scenario: Slot components
- **WHEN** slot components are created
- **THEN** AlertTitle SHALL use withContext<HTMLDivElement, AlertTitleProps>("div", "title")
- **AND** AlertDescription SHALL use withContext<HTMLDivElement, AlertDescriptionProps>("div", "description")
- **AND** AlertIcon SHALL use withContext<HTMLDivElement, AlertIconSlotProps>("div", "icon")
- **AND** AlertActions SHALL use withContext<HTMLDivElement, AlertActionsSlotProps>("div", "actions")
- **AND** AlertDismissButton SHALL use withContext<HTMLDivElement, AlertDismissButtonProps>("div", "dismissButton")


### Requirement: Chakra Style Props Support
The component SHALL accept and apply Chakra style props per nimbus-core standards.

#### Scenario: Style prop acceptance
- **WHEN** Chakra style props are provided on any Alert part
- **THEN** SHALL accept width, height, margin, padding, etc.
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL support base, sm, md, lg, xl, 2xl breakpoints

#### Scenario: Style prop composition
- **WHEN** multiple style sources are present
- **THEN** recipe base styles SHALL apply first
- **AND** variant styles SHALL apply second
- **AND** prop styles SHALL apply last (highest priority)
- **AND** SHALL support responsive value arrays and objects


### Requirement: Type Definitions
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Recipe props type
- **WHEN** AlertRecipeProps type is defined
- **THEN** SHALL include variant?: SlotRecipeProps<"alert">["variant"]
- **AND** SHALL support autocomplete for variant values

#### Scenario: Slot props types
- **WHEN** slot props types are defined
- **THEN** SHALL export AlertRootSlotProps extending HTMLChakraProps<"div", AlertRecipeProps>
- **AND** SHALL include colorPalette restriction: Exclude<SemanticPalettesOnly, "neutral" | "primary">
- **AND** SHALL export AlertIconSlotProps extending HTMLChakraProps<"div">
- **AND** SHALL export AlertActionsSlotProps extending HTMLChakraProps<"div">

#### Scenario: Main props types
- **WHEN** main component props types are defined
- **THEN** SHALL export AlertProps with children, ref, data-* attributes
- **AND** SHALL export AlertTitleProps extending TextProps with ref override
- **AND** SHALL export AlertDescriptionProps extending TextProps with ref override
- **AND** SHALL export AlertActionsProps using OmitInternalProps
- **AND** SHALL export AlertDismissButtonProps using OmitInternalProps with ButtonProps
- **AND** all props SHALL have JSDoc documentation


### Requirement: DOM Reference Access
The component SHALL forward refs to DOM elements per nimbus-core standards.

#### Scenario: Root ref
- **WHEN** ref prop is provided on Alert.Root
- **THEN** SHALL forward ref to root div element
- **AND** SHALL provide access to HTMLDivElement
- **AND** SHALL support React.Ref<HTMLDivElement> type

#### Scenario: Slot refs
- **WHEN** ref prop is provided on Alert.Title or Alert.Description
- **THEN** SHALL forward ref to respective slot div element
- **AND** SHALL provide access to HTMLDivElement
- **AND** SHALL support React.Ref<HTMLDivElement> type


### Requirement: Component Display Names
The component SHALL provide display names for debugging per nimbus-core standards.

#### Scenario: Display name setting
- **WHEN** Alert components are defined
- **THEN** Alert.Root SHALL set displayName="Alert.Root"
- **AND** Alert.Title SHALL set displayName="Alert.Title"
- **AND** Alert.Description SHALL set displayName="Alert.Description"
- **AND** Alert.Actions SHALL set displayName="Alert.Actions"
- **AND** Alert.DismissButton SHALL set displayName="Alert.DismissButton"
- **AND** names SHALL appear in React DevTools


### Requirement: Test and Integration Hooks
The component SHALL support data attributes for testing.

#### Scenario: Custom data attributes
- **WHEN** data-* props are provided on Alert parts
- **THEN** SHALL forward all data attributes to respective elements
- **AND** SHALL support data-testid for testing
- **AND** SHALL support any custom data-* attributes
- **AND** SHALL preserve attribute values


### Requirement: Screen Reader Announcements
The component SHALL provide appropriate accessibility semantics.

#### Scenario: Alert role announcement
- **WHEN** Alert.Root renders
- **THEN** role="alert" SHALL announce immediately to screen readers
- **AND** SHALL be appropriate for important, time-sensitive messages
- **AND** SHALL not require focus to be announced
- **AND** SHALL interrupt current screen reader activity

#### Scenario: Alert content structure
- **WHEN** Alert contains Title and Description
- **THEN** screen reader SHALL announce both in sequence
- **AND** Title SHALL provide context as heading
- **AND** Description SHALL provide detail
- **AND** user SHALL understand message without visual cues

#### Scenario: Dismiss button accessibility
- **WHEN** Alert.DismissButton is present
- **THEN** SHALL provide accessible name via aria-label
- **AND** SHALL be keyboard accessible (Tab, Enter, Space)
- **AND** SHALL announce action and state to screen readers
- **AND** SHALL meet interactive element requirements


### Requirement: Color Contrast Compliance
The component SHALL meet WCAG AA contrast requirements per nimbus-core standards.

#### Scenario: Text contrast
- **WHEN** alert renders with any color palette
- **THEN** SHALL maintain 4.5:1 contrast ratio for text
- **AND** SHALL use color scale 11 for text against scale 2/3 backgrounds
- **AND** SHALL meet contrast requirements in light and dark modes

#### Scenario: Icon contrast
- **WHEN** icon renders
- **THEN** SHALL use colorPalette.11 for icon color
- **AND** SHALL maintain 3:1 contrast ratio for non-text elements
- **AND** SHALL be visually distinguishable in all color palettes


### Requirement: Focus Management
The component SHALL provide visible focus indicators for interactive elements.

#### Scenario: Dismiss button focus
- **WHEN** DismissButton receives keyboard focus
- **THEN** SHALL show visible focus ring
- **AND** SHALL meet 3:1 contrast ratio for focus indicator
- **AND** SHALL only show ring for keyboard focus (not mouse clicks)
- **AND** SHALL use IconButton focus handling


### Requirement: Content Flexibility
The component SHALL support flexible content composition.

#### Scenario: Title only
- **WHEN** Alert.Root contains only Alert.Title
- **THEN** SHALL render title in grid layout
- **AND** SHALL maintain proper spacing and alignment
- **AND** SHALL apply all styling correctly

#### Scenario: Description only
- **WHEN** Alert.Root contains only Alert.Description
- **THEN** SHALL render description in grid layout
- **AND** SHALL maintain proper spacing and alignment
- **AND** SHALL apply all styling correctly

#### Scenario: Title and description
- **WHEN** Alert.Root contains both Title and Description
- **THEN** SHALL render in vertical sequence (order: 1, 2)
- **AND** SHALL maintain consistent spacing
- **AND** SHALL apply typography hierarchy

#### Scenario: With actions
- **WHEN** Alert.Root includes Alert.Actions
- **THEN** SHALL render actions after Title and Description
- **AND** SHALL position in same column (grid column 2)
- **AND** SHALL maintain vertical flow with order: 3

#### Scenario: With dismiss button
- **WHEN** Alert.Root includes Alert.DismissButton
- **THEN** SHALL position in grid column 3
- **AND** SHALL align with first row (title level)
- **AND** SHALL not interfere with content column layout


### Requirement: Semantic HTML Structure
The component SHALL use appropriate semantic elements per nimbus-core standards.

#### Scenario: Non-interactive structure
- **WHEN** alert is display-only (no DismissButton)
- **THEN** SHALL use div elements for structure
- **AND** SHALL rely on role="alert" for semantics
- **AND** SHALL not require additional ARIA attributes
- **AND** SHALL be announced by screen readers

#### Scenario: Interactive structure
- **WHEN** alert includes DismissButton
- **THEN** SHALL use appropriate button semantics via IconButton
- **AND** SHALL provide accessible name via aria-label
- **AND** SHALL be keyboard navigable
- **AND** SHALL support standard button interaction patterns


### Requirement: Design Token Usage
The component SHALL use design tokens for all values per nimbus-core standards.

#### Scenario: Spacing tokens
- **WHEN** recipe applies spacing
- **THEN** SHALL use 50 for icon marginTop
- **AND** SHALL use 200 for gap and padding
- **AND** SHALL not use hardcoded pixel values

#### Scenario: Border tokens
- **WHEN** outlined variant applies borders
- **THEN** SHALL use solid-25 for border width
- **AND** SHALL use 200 for borderRadius
- **AND** SHALL reference design token system

#### Scenario: Size tokens
- **WHEN** icon renders
- **THEN** SHALL use 500 for icon width and height
- **AND** SHALL reference consistent size tokens
- **AND** SHALL not use hardcoded dimensions

#### Scenario: Color tokens
- **WHEN** color styles apply
- **THEN** SHALL use colorPalette.2, .5, .11 scales
- **AND** SHALL reference semantic token system
- **AND** SHALL support theme switching


### Requirement: Icon Library Integration
The component SHALL use icons from @commercetools/nimbus-icons package.

#### Scenario: Icon imports
- **WHEN** Alert.Root imports icons
- **THEN** SHALL import from @commercetools/nimbus-icons
- **AND** SHALL use: ErrorOutline, Info, WarningAmber, CheckCircleOutline, Clear
- **AND** SHALL not duplicate icon definitions
- **AND** SHALL benefit from icon package optimizations


### Requirement: Cross-Component Dependencies
The component SHALL handle cross-component imports per nimbus-core standards.

#### Scenario: IconButton import
- **WHEN** Alert.DismissButton imports IconButton
- **THEN** SHALL import from direct file path
- **AND** SHALL use: from "../../icon-button"
- **AND** SHALL avoid barrel export (index.ts) to prevent circular chunks
- **AND** SHALL maintain build performance


### Requirement: Recipe Variant Independence
The component SHALL support all valid combinations of variants.

#### Scenario: Variant combinations
- **WHEN** multiple variant and palette props are set
- **THEN** SHALL apply all variants independently
- **AND** variant SHALL not conflict with colorPalette
- **AND** flat and outlined SHALL produce distinct visual outputs
- **AND** all semantic palettes SHALL work with both variants

#### Scenario: Default variant values
- **WHEN** no variant prop is provided
- **THEN** SHALL apply variant="outlined" as default
- **AND** SHALL require explicit variant="flat" for flat style
