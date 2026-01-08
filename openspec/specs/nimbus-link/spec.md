# Specification: Link Component

## Overview

The Link component provides an accessible, styled anchor element for navigation that follows WCAG 2.1 AA accessibility guidelines and nimbus-core standards. It supports both internal and external links with appropriate security defaults and keyboard interactions.

**Component:** `Link`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component
**React Aria:** Uses `useLink` hook from react-aria

## Purpose

To provide an accessible, styled hyperlink component that enables users to navigate to different pages, sections, or resources while maintaining WCAG 2.1 AA compliance, security best practices, and consistent visual design across the Nimbus design system.

## Requirements

### Requirement: Basic Link Navigation
The component SHALL provide clickable navigation to different pages or resources.

#### Scenario: Internal navigation
- **WHEN** href prop is provided without target
- **THEN** SHALL render as anchor element with href attribute
- **AND** SHALL navigate within the same context (SPA or page)
- **AND** SHALL preserve default browser navigation (middle-click, right-click)

#### Scenario: External navigation
- **WHEN** href starts with http:// or https:// and differs from current origin
- **THEN** SHALL navigate to external URL
- **AND** SHALL automatically apply rel="noopener noreferrer" for security
- **AND** SHALL support target="_blank" for new tab navigation

#### Scenario: Download links
- **WHEN** download attribute is provided
- **THEN** SHALL trigger file download instead of navigation
- **AND** SHALL accept download filename as value
- **AND** SHALL work with both same-origin and cross-origin resources

### Requirement: External Link Security
The component SHALL provide security defaults for external links.

#### Scenario: Noopener noreferrer
- **WHEN** link opens in new window/tab (target="_blank")
- **THEN** SHALL automatically set rel="noopener noreferrer"
- **AND** SHALL prevent window.opener access from target page
- **AND** SHALL prevent Referer header leakage
- **AND** SHALL allow manual rel override if needed

### Requirement: Link Styling
The component SHALL provide visual styling to distinguish links from text.

#### Scenario: Default appearance
- **WHEN** link renders
- **THEN** SHALL display with underline by default
- **AND** SHALL use color from colorPalette token system
- **AND** SHALL show increased underline thickness on hover
- **AND** SHALL maintain inline-flex display for icon support

#### Scenario: Font color variants
- **WHEN** fontColor prop is set
- **THEN** SHALL support: primary, inherit
- **AND** primary SHALL use primary brand color
- **AND** inherit SHALL use parent text color for contextual styling
- **AND** SHALL maintain sufficient color contrast per WCAG AA

### Requirement: Link Sizes
The component SHALL support multiple size options per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set
- **THEN** SHALL support: xs, sm, md
- **AND** SHALL adjust font size and line height accordingly
- **AND** xs SHALL use 300/450 tokens
- **AND** sm SHALL use 350/500 tokens
- **AND** md SHALL use 400/600 tokens (default)

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Hover state
- **WHEN** user hovers over link
- **THEN** SHALL increase text decoration thickness
- **AND** SHALL maintain color and accessibility
- **AND** SHALL show pointer cursor

#### Scenario: Focus state
- **WHEN** link receives keyboard focus
- **THEN** SHALL display visible focus ring per nimbus-core standards
- **AND** focus ring SHALL be positioned outside element
- **AND** SHALL meet 3:1 contrast ratio requirement
- **AND** SHALL clear focus ring on mouse click

#### Scenario: Active state
- **WHEN** link is being clicked or activated
- **THEN** SHALL provide visual feedback
- **AND** SHALL maintain accessibility during activation

#### Scenario: Visited state
- **WHEN** link has been previously visited
- **THEN** MAY apply browser default visited styling
- **AND** SHALL maintain sufficient contrast
- **AND** SHALL respect browser privacy features

#### Scenario: Disabled state
- **WHEN** aria-disabled="true" is set
- **THEN** SHALL apply reduced opacity styling
- **AND** SHALL prevent navigation via onClick override
- **AND** SHALL show not-allowed cursor
- **AND** SHALL set aria-disabled="true" for screen readers
- **AND** SHALL remain focusable per ARIA best practices

### Requirement: Keyboard Navigation
The component SHALL support keyboard interactions per nimbus-core standards.

#### Scenario: Tab navigation
- **WHEN** user presses Tab key
- **THEN** SHALL receive focus in logical tab order
- **AND** SHALL show visible focus indicator
- **AND** SHALL be discoverable by keyboard-only users

#### Scenario: Enter key activation
- **WHEN** link is focused and user presses Enter
- **THEN** SHALL navigate to href destination
- **AND** SHALL trigger onClick handler if provided
- **AND** SHALL follow browser navigation behavior

#### Scenario: Space key (React Aria behavior)
- **WHEN** link is focused and user presses Space
- **THEN** SHALL activate link via React Aria useLink hook
- **AND** SHALL navigate to href destination
- **AND** SHALL prevent page scroll

### Requirement: Icon Integration
The component SHALL support icons from @commercetools/nimbus-icons.

#### Scenario: Leading icon
- **WHEN** icon is placed before link text as child
- **THEN** SHALL render icon with appropriate spacing
- **AND** SHALL align icon vertically with text
- **AND** SHALL support inline-flex alignment

#### Scenario: Trailing icon
- **WHEN** icon is placed after link text as child
- **THEN** SHALL render icon with appropriate spacing
- **AND** SHALL commonly indicate external links
- **AND** SHALL align icon vertically with text

#### Scenario: Icon-only link
- **WHEN** children contains only icon without text
- **THEN** SHALL render as icon-only link
- **AND** SHALL require aria-label for accessibility
- **AND** SHALL maintain minimum touch target size

### Requirement: ARIA Link Pattern
The component SHALL implement ARIA link pattern per nimbus-core standards.

#### Scenario: Accessible name
- **WHEN** link renders
- **THEN** SHALL have accessible name from children text content
- **OR** SHALL use aria-label if provided
- **AND** icon-only links SHALL require aria-label
- **AND** SHALL be announced by screen readers as "link"

#### Scenario: ARIA attributes
- **WHEN** link renders with special states
- **THEN** SHALL set aria-disabled="true" for disabled state
- **AND** SHALL use aria-current for current page indication
- **AND** SHALL support aria-describedby for additional context
- **AND** SHALL support aria-label for custom accessible names

#### Scenario: Screen reader announcements
- **WHEN** screen reader encounters link
- **THEN** SHALL announce link text
- **AND** SHALL announce role as "link"
- **AND** SHALL announce disabled state if applicable
- **AND** external links SHOULD be indicated to users

#### Scenario: Focus management
- **WHEN** link receives focus
- **THEN** SHALL show visible focus indicator meeting WCAG AA
- **AND** SHALL be operable via keyboard
- **AND** SHALL announce focused state to screen readers

### Requirement: Polymorphic as Prop
The component SHALL support rendering as different elements per nimbus-core standards.

#### Scenario: Custom element via as prop
- **WHEN** as prop is provided
- **THEN** SHALL render as specified element type
- **AND** SHALL maintain link styling
- **AND** SHALL forward appropriate HTML attributes
- **AND** SHALL preserve accessibility features

#### Scenario: Router integration via asChild
- **WHEN** asChild={true} is set
- **THEN** SHALL use Chakra's asChild pattern for composition
- **AND** SHALL allow wrapping router link components (React Router Link, Next.js Link)
- **AND** SHALL transfer props to child element
- **AND** SHALL maintain link styling and behavior
- **AND** SHALL preserve ref forwarding

### Requirement: Recipe-Based Styling
The component SHALL use Chakra UI recipe per nimbus-core standards.

#### Scenario: Recipe application
- **WHEN** component renders
- **THEN** SHALL apply link recipe from theme/recipes/link.ts
- **AND** recipe SHALL be registered in theme configuration
- **AND** SHALL support recipe props: size, fontColor
- **AND** SHALL use single-slot recipe pattern

#### Scenario: Design tokens
- **WHEN** component applies styles
- **THEN** SHALL use design tokens from @commercetools/nimbus-tokens
- **AND** SHALL NOT use hardcoded color or spacing values
- **AND** SHALL support light and dark mode via colorPalette tokens
- **AND** SHALL use semantic color tokens (primary, neutral)

### Requirement: Custom Styling
The component SHALL accept Chakra style props per nimbus-core standards.

#### Scenario: Style prop override
- **WHEN** Chakra style props are provided
- **THEN** SHALL accept all Chakra style props (padding, margin, color, etc.)
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL maintain component functionality

### Requirement: Click Events
The component SHALL support click event handling.

#### Scenario: onClick handler
- **WHEN** onClick prop is provided
- **THEN** SHALL call handler before navigation
- **AND** SHALL receive React MouseEvent
- **AND** SHALL allow preventDefault() to cancel navigation
- **AND** SHALL work with keyboard activation (Enter/Space)

#### Scenario: Navigation prevention
- **WHEN** onClick calls event.preventDefault()
- **THEN** SHALL prevent default link navigation
- **AND** SHALL not follow href
- **AND** SHALL allow custom behavior implementation

### Requirement: Focus Events
The component SHALL support focus event handling per React Aria patterns.

#### Scenario: Focus handlers
- **WHEN** onFocus or onBlur props are provided
- **THEN** SHALL call handlers on focus/blur events
- **AND** SHALL use React Aria's FocusEvent type
- **AND** SHALL work with keyboard and mouse interactions

### Requirement: Ref Support
The component SHALL support ref forwarding per nimbus-core standards.

#### Scenario: Ref forwarding
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to underlying anchor element
- **AND** SHALL support React.RefObject<HTMLAnchorElement>
- **AND** SHALL allow imperative DOM access
- **AND** SHALL merge multiple refs if needed

### Requirement: Type Safety
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** component is used in TypeScript
- **THEN** SHALL export LinkProps interface
- **AND** SHALL include all prop definitions with JSDoc comments
- **AND** SHALL extend HTMLChakraProps<"a"> for anchor attributes
- **AND** SHALL include React Aria's AriaLinkOptions for accessibility props

#### Scenario: Recipe props
- **WHEN** component uses recipe variants
- **THEN** SHALL define LinkRecipeProps with size and fontColor
- **AND** SHALL type-check recipe variant values
- **AND** SHALL provide autocomplete for variant options

#### Scenario: Slot props
- **WHEN** component uses slot system
- **THEN** SHALL define LinkRootSlotProps
- **AND** SHALL combine HTMLChakraProps with LinkRecipeProps
- **AND** SHALL support all anchor HTML attributes

### Requirement: React Aria useLink Hook
The component SHALL use React Aria's useLink hook for accessibility.

#### Scenario: useLink integration
- **WHEN** component renders
- **THEN** SHALL call useLink hook with AriaLinkOptions
- **AND** SHALL apply linkProps to anchor element
- **AND** SHALL support keyboard interactions (Enter, Space)
- **AND** SHALL provide proper ARIA attributes
- **AND** SHALL handle focus management

#### Scenario: Element type handling
- **WHEN** component uses polymorphic rendering
- **THEN** SHALL pass elementType to useLink hook
- **AND** SHALL support as prop for custom elements
- **AND** SHALL support asChild pattern for composition
- **AND** SHALL default to "a" element when neither provided

### Requirement: Inline Usage
The component SHALL support inline usage within text content.

#### Scenario: Inline text link
- **WHEN** link is used within text flow
- **THEN** SHALL use inline-flex display
- **AND** SHALL align with surrounding text baseline
- **AND** SHALL wrap naturally with text
- **AND** SHALL maintain text color consistency with fontColor="inherit"

#### Scenario: Standalone link
- **WHEN** link is used as standalone element
- **THEN** SHALL maintain inline-flex display
- **AND** SHALL support icon alignment
- **AND** SHALL work with flexbox/grid layouts
- **AND** SHALL respect parent layout constraints
