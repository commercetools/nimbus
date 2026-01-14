# Specification: LoadingSpinner Component

## Overview

The LoadingSpinner component provides an accessible, animated circular spinner that indicates ongoing loading processes or operations with unknown duration. It follows indeterminate progress patterns and adheres to nimbus-core accessibility standards.

**Component:** `LoadingSpinner`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component
**React Aria:** Uses `useProgressBar` hook from react-aria
**i18n:** Yes (default loading message)

## Purpose

LoadingSpinner communicates to users that a process is ongoing and they need to wait. It provides visual feedback through a continuously rotating circular animation, reducing uncertainty about system responsiveness and improving perceived performance during data fetching, background operations, or any task with indeterminate duration.

## Requirements

### Requirement: Indeterminate Progress Indication
The component SHALL display indeterminate loading state with continuous animation.

#### Scenario: Indeterminate mode activation
- **WHEN** LoadingSpinner renders
- **THEN** SHALL call useProgressBar with isIndeterminate={true}
- **AND** SHALL display circular rotating animation
- **AND** SHALL not display progress percentage or value
- **AND** SHALL indicate unknown duration loading

#### Scenario: Circular spinner structure
- **WHEN** component renders
- **THEN** SHALL render SVG with viewBox="0 0 24 24"
- **AND** SHALL include circle path for background track
- **AND** SHALL include pointer path for rotating indicator
- **AND** circle path SHALL have data-svg-path="spinner-circle"
- **AND** pointer path SHALL have data-svg-path="spinner-pointer"

#### Scenario: Continuous rotation animation
- **WHEN** spinner animates
- **THEN** pointer path SHALL apply spin animation
- **AND** animationDuration SHALL be 0.5s
- **AND** animationTimingFunction SHALL be linear
- **AND** animationIterationCount SHALL be infinite
- **AND** transformOrigin SHALL be "center center 0"

### Requirement: Size Variants
The component SHALL support five size options per nimbus-core standards.

#### Scenario: 2xs size
- **WHEN** size="2xs" is set
- **THEN** width SHALL be token size.350
- **AND** height SHALL be token size.350
- **AND** SHALL maintain aspect ratio 1:1

#### Scenario: xs size
- **WHEN** size="xs" is set
- **THEN** width SHALL be token size.500
- **AND** height SHALL be token size.500
- **AND** SHALL maintain aspect ratio 1:1

#### Scenario: sm size (default)
- **WHEN** size="sm" is set or no size specified
- **THEN** width SHALL be token size.600
- **AND** height SHALL be token size.600
- **AND** SHALL maintain aspect ratio 1:1

#### Scenario: md size
- **WHEN** size="md" is set
- **THEN** width SHALL be token size.800
- **AND** height SHALL be token size.800
- **AND** SHALL maintain aspect ratio 1:1

#### Scenario: lg size
- **WHEN** size="lg" is set
- **THEN** width SHALL be token size.1000
- **AND** height SHALL be token size.1000
- **AND** SHALL maintain aspect ratio 1:1

### Requirement: Color Palette Support
The component SHALL support semantic color palettes for different contexts.

#### Scenario: Primary color palette (default)
- **WHEN** colorPalette="primary" is set or no colorPalette specified
- **THEN** SHALL apply ctvioletAlpha palette
- **AND** pointer stroke SHALL use colorPalette.10
- **AND** circle stroke SHALL use colorPalette.5
- **AND** SHALL be suitable for light backgrounds

#### Scenario: White color palette
- **WHEN** colorPalette="white" is set
- **THEN** SHALL apply whiteAlpha palette
- **AND** pointer stroke SHALL use colorPalette.10
- **AND** circle stroke SHALL use colorPalette.5
- **AND** SHALL be suitable for dark backgrounds

#### Scenario: Color palette restrictions
- **WHEN** colorPalette prop is set
- **THEN** SHALL accept: "primary", "white"
- **AND** type SHALL be: colorPalette?: "primary" | "white"
- **AND** SHALL not support other semantic palettes

### Requirement: SVG Rendering and Scaling
The component SHALL render scalable vector graphics with proper sizing.

#### Scenario: SVG structure
- **WHEN** SVG renders
- **THEN** xmlns SHALL be "http://www.w3.org/2000/svg"
- **AND** viewBox SHALL be "0 0 24 24"
- **AND** fill SHALL be "none"
- **AND** overflow SHALL be "visible"

#### Scenario: SVG scaling transformation
- **WHEN** SVG applies scaling
- **THEN** SHALL apply transform: scale(calc(1 - 2/12))
- **AND** SHALL proportionally scale spinner to fit container
- **AND** scaling formula SHALL account for padding and visual balance

#### Scenario: Path stroke styling
- **WHEN** paths render
- **THEN** strokeWidth SHALL be "3" for both paths
- **AND** strokeLinecap SHALL be "round"
- **AND** strokeLinejoin SHALL be "round"
- **AND** SHALL provide smooth, rounded appearance

### Requirement: Accessible Label
The component SHALL provide accessible label for screen readers per nimbus-core standards.

#### Scenario: Default internationalized label
- **WHEN** aria-label is not provided
- **THEN** SHALL use useIntl hook to format default message
- **AND** SHALL read from messages.defaultLoadingMessage
- **AND** message id SHALL be "Nimbus.LoadingSpinner.default"
- **AND** defaultMessage SHALL be "Loading data"
- **AND** SHALL be translatable via @commercetools/nimbus-i18n

#### Scenario: Custom aria-label
- **WHEN** aria-label prop is provided
- **THEN** SHALL use provided aria-label value
- **AND** SHALL override default internationalized message
- **AND** SHALL forward to useProgressBar hook
- **AND** SHALL provide context-specific loading announcement

#### Scenario: Aria-label application
- **WHEN** component renders with aria-label
- **THEN** SHALL apply aria-label to root element
- **AND** SHALL merge with progressBarProps
- **AND** SHALL be announced to screen readers
- **AND** SHALL describe what is loading

### Requirement: ARIA Progressbar Pattern
The component SHALL implement ARIA progressbar pattern for indeterminate state per nimbus-core standards.

#### Scenario: Progressbar role
- **WHEN** useProgressBar hook is called
- **THEN** SHALL set role="progressbar" on root element
- **AND** SHALL be recognized by assistive technologies
- **AND** SHALL announce as loading indicator

#### Scenario: Indeterminate ARIA attributes
- **WHEN** isIndeterminate={true} is set
- **THEN** SHALL not set aria-valuenow
- **AND** SHALL not set aria-valuemin or aria-valuemax
- **AND** SHALL indicate indeterminate progress to screen readers
- **AND** React Aria SHALL handle ARIA attribute management

#### Scenario: Screen reader announcement
- **WHEN** LoadingSpinner renders
- **THEN** screen reader SHALL announce accessible label
- **AND** SHALL announce progressbar role
- **AND** SHALL indicate loading state
- **AND** user SHALL understand process is ongoing

### Requirement: Animation Keyframes
The component SHALL define spin animation for rotation effect.

#### Scenario: Spin animation definition
- **WHEN** spin animation is referenced
- **THEN** SHALL use Chakra UI animation: "spin"
- **AND** animation SHALL rotate from 0deg to 360deg
- **AND** rotation SHALL be continuous and smooth
- **AND** SHALL apply to pointer path only

#### Scenario: Animation performance
- **WHEN** animation runs
- **THEN** SHALL use GPU acceleration via transform
- **AND** SHALL apply to transform property (not left/top)
- **AND** SHALL be performant across devices
- **AND** SHALL not cause layout reflow

### Requirement: Reduced Motion Support
The component SHALL respect user motion preferences per nimbus-core standards.

#### Scenario: Prefers-reduced-motion detection
- **WHEN** user has prefers-reduced-motion: reduce enabled
- **THEN** animation SHOULD be paused or simplified
- **AND** spinner SHOULD remain visible
- **AND** accessibility SHALL be maintained
- **AND** SHOULD follow system accessibility settings

### Requirement: Recipe-Based Styling
The component SHALL use Chakra UI single-slot recipe per nimbus-core standards.

#### Scenario: Recipe definition
- **WHEN** loadingSpinnerRecipe is defined
- **THEN** SHALL use defineRecipe from Chakra
- **AND** SHALL set className: "nimbus-loading-spinner"
- **AND** SHALL define variants: size, colorPalette
- **AND** SHALL set defaultVariants: { size: "sm" }

#### Scenario: Recipe registration
- **WHEN** LoadingSpinner component is used
- **THEN** loadingSpinnerRecipe SHALL be registered in theme/recipes/index.ts
- **AND** registration SHALL use "loadingSpinner" key
- **AND** CRITICAL: registration SHALL be manual (no auto-discovery)

#### Scenario: Base styles application
- **WHEN** recipe applies base styles
- **THEN** display SHALL be "inline-flex"
- **AND** alignItems SHALL be "center"
- **AND** justifyContent SHALL be "center"
- **AND** SVG SHALL have overflow: "visible"
- **AND** SVG SHALL apply scaling transform

#### Scenario: Variant styles inheritance
- **WHEN** size and colorPalette variants are applied
- **THEN** size SHALL set width and height tokens
- **AND** colorPalette SHALL set CSS colorPalette variable
- **AND** stroke colors SHALL reference colorPalette tokens
- **AND** variants SHALL compose independently

### Requirement: Slot Component Architecture
The component SHALL use single-slot recipe context per nimbus-core standards.

#### Scenario: Slot component creation
- **WHEN** LoadingSpinnerRoot is created
- **THEN** SHALL use createRecipeContext with key: "loadingSpinner"
- **AND** SHALL extract withContext utility
- **AND** LoadingSpinnerRoot SHALL be withContext<HTMLDivElement, LoadingSpinnerRootSlotProps>("div")

#### Scenario: Context-based styling
- **WHEN** LoadingSpinnerRoot renders
- **THEN** SHALL apply recipe styles from context
- **AND** SHALL accept size and colorPalette props
- **AND** SHALL forward props to recipe system
- **AND** SHALL provide typed slot props interface

### Requirement: TypeScript Type Definitions
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Recipe props type
- **WHEN** LoadingSpinnerRecipeProps type is defined
- **THEN** SHALL include size?: RecipeProps<"loadingSpinner">["size"]
- **AND** SHALL include UnstyledProp
- **AND** type SHALL be generated by Chakra CLI
- **AND** SHALL provide autocomplete for size values

#### Scenario: Slot props type
- **WHEN** LoadingSpinnerRootSlotProps type is defined
- **THEN** SHALL extend HTMLChakraProps<"div", LoadingSpinnerRecipeProps>
- **AND** SHALL omit: "as", "asChild", "css"
- **AND** SHALL include colorPalette?: "primary" | "white"
- **AND** SHALL support all Chakra style props

#### Scenario: Main props type
- **WHEN** LoadingSpinnerProps type is defined
- **THEN** SHALL extend LoadingSpinnerVariantProps
- **AND** SHALL support data-* attributes via [key: `data-${string}`]: string
- **AND** SHALL include ref?: React.Ref<HTMLDivElement>
- **AND** SHALL include all props with JSDoc documentation

#### Scenario: Exported types
- **WHEN** component is imported
- **THEN** SHALL export LoadingSpinnerProps
- **AND** SHALL export LoadingSpinnerRecipeProps
- **AND** SHALL export LoadingSpinnerRootSlotProps
- **AND** types SHALL be accessible from package index

### Requirement: React Aria Integration
The component SHALL use React Aria for accessibility primitives per nimbus-core standards.

#### Scenario: useProgressBar hook usage
- **WHEN** LoadingSpinner renders
- **THEN** SHALL call useProgressBar from react-aria
- **AND** SHALL pass isIndeterminate: true
- **AND** SHALL pass aria-label
- **AND** SHALL receive progressBarProps object

#### Scenario: Props merging
- **WHEN** progressBarProps are returned
- **THEN** SHALL use mergeProps to combine restProps and progressBarProps
- **AND** SHALL forward merged props to LoadingSpinnerRoot
- **AND** aria-label SHALL be explicitly set on root element
- **AND** React Aria SHALL handle ARIA attribute management

### Requirement: Props Forwarding
The component SHALL forward native HTML attributes and React Aria props per nimbus-core standards.

#### Scenario: Data attributes
- **WHEN** data-* attributes are provided
- **THEN** SHALL forward to root element
- **AND** SHALL support data-testid for testing
- **AND** SHALL support any custom data-* attributes
- **AND** attributes SHALL be accessible via DOM queries

#### Scenario: ARIA attributes
- **WHEN** additional aria-* attributes are provided
- **THEN** SHALL forward to root element
- **AND** SHALL merge with React Aria progressBarProps
- **AND** SHALL not conflict with useProgressBar attributes
- **AND** SHALL maintain accessibility compliance

#### Scenario: Event handlers
- **WHEN** event handler props are provided
- **THEN** SHALL forward to root element
- **AND** SHALL support onClick, onMouseEnter, etc.
- **AND** SHALL not interfere with component functionality

### Requirement: Ref Forwarding
The component SHALL support ref forwarding per nimbus-core standards.

#### Scenario: Ref forwarding to root element
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to LoadingSpinnerRoot div element
- **AND** SHALL support React.Ref<HTMLDivElement> type
- **AND** SHALL provide access to DOM element
- **AND** ref SHALL be usable for measurements or focus management

### Requirement: Custom Styling Support
The component SHALL accept Chakra style props per nimbus-core standards.

#### Scenario: Style prop override
- **WHEN** Chakra style props are provided
- **THEN** SHALL accept all Chakra style props (margin, padding, width, height, etc.)
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL support base, sm, md, lg, xl, 2xl breakpoints

#### Scenario: Responsive size values
- **WHEN** responsive style props are provided
- **THEN** SHALL support array syntax: [base, sm, md, lg]
- **AND** SHALL support object syntax: { base, sm, md, lg }
- **AND** SHALL apply breakpoints from design tokens
- **AND** responsive values SHALL override size variant

### Requirement: Display Name
The component SHALL provide display name for debugging per nimbus-core standards.

#### Scenario: Display name setting
- **WHEN** LoadingSpinner is defined
- **THEN** SHALL set displayName="LoadingSpinner"
- **AND** name SHALL appear in React DevTools
- **AND** SHALL aid in debugging and component identification

### Requirement: Internationalization Support
The component SHALL define translatable messages per nimbus-core standards.

#### Scenario: Message definition file
- **WHEN** i18n messages are defined
- **THEN** SHALL create loading-spinner.i18n.ts file
- **AND** SHALL use defineMessages from react-intl
- **AND** SHALL export messages object

#### Scenario: Default loading message structure
- **WHEN** messages.defaultLoadingMessage is defined
- **THEN** id SHALL be "Nimbus.LoadingSpinner.default"
- **AND** description SHALL be "Default loading message for loading spinners"
- **AND** defaultMessage SHALL be "Loading data"
- **AND** SHALL follow Nimbus i18n naming convention

#### Scenario: Message extraction and compilation
- **WHEN** messages are added or changed
- **THEN** SHALL run `pnpm extract-intl` to update @commercetools/nimbus-i18n
- **AND** messages SHALL be compiled to AST format
- **AND** SHALL support 5 locales (en, de, es, fr-FR, pt-BR)
- **AND** translations SHALL be managed via Transifex

### Requirement: Component Composition Support
The component SHALL support composition within other components.

#### Scenario: Usage in Button loading state
- **WHEN** LoadingSpinner is used inside Button
- **THEN** SHALL render with appropriate size for button
- **AND** colorPalette="white" SHALL be used on solid buttons
- **AND** SHALL align with button text via flex layout
- **AND** SHALL maintain button dimensions (no layout shift)

#### Scenario: Usage in container elements
- **WHEN** LoadingSpinner is used in Box, Stack, or Flex
- **THEN** inline-flex display SHALL integrate with layout context
- **AND** SHALL respect parent alignment and justification
- **AND** SHALL be positionable via parent layout props

#### Scenario: Standalone usage
- **WHEN** LoadingSpinner is used independently
- **THEN** SHALL be self-contained with inline-flex display
- **AND** SHALL not require wrapper for basic usage
- **AND** SHALL be positionable via style props

### Requirement: Design Token Integration
The component SHALL use design tokens for all values per nimbus-core standards.

#### Scenario: Size tokens
- **WHEN** recipe applies size variants
- **THEN** SHALL reference tokens: size.350, size.500, size.600, size.800, size.1000
- **AND** SHALL not use hardcoded pixel values
- **AND** tokens SHALL be from @commercetools/nimbus-tokens
- **AND** SHALL support theme-wide size consistency

#### Scenario: Color tokens
- **WHEN** recipe applies color palettes
- **THEN** SHALL reference colorPalette.5 and colorPalette.10
- **AND** ctvioletAlpha SHALL be primary palette
- **AND** whiteAlpha SHALL be white palette
- **AND** SHALL support light and dark mode

#### Scenario: Animation tokens
- **WHEN** animation applies
- **THEN** animationName SHALL reference Chakra "spin" animation
- **AND** animationDuration SHALL be consistent across design system
- **AND** animationTimingFunction SHALL use standard easing
- **AND** animation tokens SHALL be from Chakra theme

### Requirement: Barrel Export Pattern
The component SHALL follow barrel export pattern per nimbus-core standards.

#### Scenario: Component index file
- **WHEN** index.ts is created
- **THEN** SHALL export { LoadingSpinner } from "./loading-spinner"
- **AND** SHALL export type { LoadingSpinnerProps } from "./loading-spinner.types"
- **AND** SHALL provide clean import path for consumers

#### Scenario: Package-level export
- **WHEN** @commercetools/nimbus is imported
- **THEN** LoadingSpinner SHALL be exported from package index
- **AND** LoadingSpinnerProps SHALL be exported from package index
- **AND** SHALL be importable via: import { LoadingSpinner } from "@commercetools/nimbus"

### Requirement: Cross-Component Import Safety
The component SHALL follow safe import patterns per nimbus-core standards.

#### Scenario: Internal component imports
- **WHEN** LoadingSpinner is used by other components (e.g., Button)
- **THEN** importing component SHALL import from implementation file
- **AND** import path SHALL be: "../../loading-spinner/loading-spinner"
- **AND** SHALL NOT import from barrel export (index.ts)
- **AND** SHALL avoid circular chunk dependencies

### Requirement: Testing Support
The component SHALL provide comprehensive Storybook stories with interaction tests per nimbus-core standards.

#### Scenario: Base story with accessibility tests
- **WHEN** Base story runs play function
- **THEN** SHALL verify element tagName is "DIV"
- **AND** SHALL verify role="progressbar" attribute
- **AND** SHALL verify aria-label is present and correct
- **AND** SHALL use data-testid for element queries

#### Scenario: Size variants story
- **WHEN** Sizes story renders
- **THEN** SHALL render all size variants: 2xs, xs, sm, md, lg
- **AND** SHALL display in horizontal Stack for visual comparison
- **AND** SHALL apply consistent gap and alignment
- **AND** SHALL serve as visual documentation

#### Scenario: Color palette story
- **WHEN** ColorPalettes story renders
- **THEN** SHALL render primary and white palettes
- **AND** SHALL display on contrasting background (blackAlpha.5)
- **AND** SHALL verify custom aria-label forwarding
- **AND** SHALL demonstrate contextual usage

#### Scenario: Browser-based testing
- **WHEN** Storybook tests run
- **THEN** SHALL execute in headless Chromium via Playwright
- **AND** SHALL test against built bundle (dist/), not source files
- **AND** SHALL query by accessible attributes (role, aria-label)
- **AND** SHALL use within(canvasElement) for scoped queries

### Requirement: Documentation Files
The component SHALL provide comprehensive documentation per nimbus-core standards.

#### Scenario: MDX documentation file
- **WHEN** loading-spinner.mdx exists
- **THEN** SHALL include frontmatter with id, title, description
- **AND** SHALL include documentState, order, menu, tags
- **AND** SHALL include figmaLink to design library
- **AND** SHALL provide usage guidelines and best practices

#### Scenario: Live code examples
- **WHEN** MDX includes code examples
- **THEN** SHALL use ```jsx-live code blocks
- **AND** SHALL demonstrate size variants
- **AND** SHALL demonstrate color palettes on different backgrounds
- **AND** SHALL show composition within Button components

#### Scenario: Accessibility guidelines
- **WHEN** accessibility section is included
- **THEN** SHALL document aria-label requirement
- **AND** SHALL describe progressbar role
- **AND** SHALL explain screen reader behavior
- **AND** SHALL reference WCAG AA compliance
