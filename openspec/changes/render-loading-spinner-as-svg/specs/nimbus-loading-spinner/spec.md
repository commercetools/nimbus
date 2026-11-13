# Spec Delta

## MODIFIED Requirements

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
- **THEN** SHALL render a single svg element as the root, with viewBox="0 0 24 24"
- **AND** SHALL include a circle element for the background track
- **AND** SHALL include pointer path for rotating indicator
- **AND** circle element SHALL have data-svg-path="spinner-circle"
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
- **WHEN** size="sm" is set
- **THEN** width SHALL be token size.600
- **AND** height SHALL be token size.600
- **AND** SHALL maintain aspect ratio 1:1
- **AND** this size equals the fallback size used when no size is specified (see "No size specified")

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

#### Scenario: No size specified
- **WHEN** no size is specified and no rule of a parent or style prop sets the size
- **THEN** width and height SHALL be 24px, set as width and height attributes
- **AND** any CSS rule for width or height SHALL override these attributes
- **AND** the recipe SHALL NOT define a default size variant

### Requirement: SVG Rendering and Scaling
The component SHALL render scalable vector graphics with proper sizing.

#### Scenario: SVG structure
- **WHEN** SVG renders
- **THEN** xmlns SHALL be "http://www.w3.org/2000/svg"
- **AND** viewBox SHALL be "0 0 24 24"
- **AND** fill SHALL be "none"
- **AND** focusable SHALL be "false"
- **AND** width and height attributes SHALL be 24
- **AND** the element SHALL render at its requested size in every supported browser, including Safari

#### Scenario: SVG scaling transformation
- **WHEN** the spinner is rendered at a size other than 24px
- **THEN** the drawing SHALL scale with the svg box through its viewBox
- **AND** no scaling transform SHALL be applied to the svg

#### Scenario: Ring geometry on the icon grid
- **WHEN** the ring renders
- **THEN** the circle SHALL be centered at 12,12 with radius 9
- **AND** the stroke width of the circle and of the pointer path SHALL be 2
- **AND** the outer edge of the ring SHALL be 2 units inside the viewBox, like the live area of an icon
- **AND** both edges of the stroke SHALL be whole numbers at 24px (outer 2 and 22, inner 4 and 20)

#### Scenario: Path stroke styling
- **WHEN** paths render
- **THEN** strokeWidth SHALL be "2" for both paths
- **AND** pointer strokeLinecap SHALL be "round"
- **AND** SHALL provide smooth, rounded appearance

### Requirement: Recipe-Based Styling
The component SHALL use Chakra UI single-slot recipe per nimbus-core standards.

#### Scenario: Recipe definition
- **WHEN** loadingSpinnerRecipe is defined
- **THEN** SHALL use defineRecipe from Chakra
- **AND** SHALL set className: "nimbus-loading-spinner"
- **AND** SHALL define variants: size, colorPalette
- **AND** SHALL NOT set a default size variant

#### Scenario: Recipe registration
- **WHEN** LoadingSpinner component is used
- **THEN** loadingSpinnerRecipe SHALL be registered in theme/recipes/index.ts
- **AND** registration SHALL use "loadingSpinner" key
- **AND** CRITICAL: registration SHALL be manual (no auto-discovery)

#### Scenario: Base styles application
- **WHEN** recipe applies base styles
- **THEN** flexShrink SHALL be "0"
- **AND** the recipe SHALL NOT set display, alignItems or justifyContent
- **AND** pointer and circle stroke colors SHALL apply to the path and circle elements directly

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
- **AND** LoadingSpinnerRoot SHALL be withContext<SVGSVGElement, LoadingSpinnerRootSlotProps>("svg")

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
- **THEN** SHALL extend HTMLChakraProps<"svg", LoadingSpinnerRecipeProps>
- **AND** SHALL omit: "as", "asChild", "css"
- **AND** SHALL include colorPalette?: "primary" | "white"
- **AND** SHALL support all Chakra style props

#### Scenario: Main props type
- **WHEN** LoadingSpinnerProps type is defined
- **THEN** SHALL extend LoadingSpinnerVariantProps
- **AND** SHALL support data-* attributes via [key: `data-${string}`]: string
- **AND** SHALL include ref?: React.Ref<SVGSVGElement>
- **AND** SHALL include all props with JSDoc documentation

#### Scenario: Exported types
- **WHEN** component is imported
- **THEN** SHALL export LoadingSpinnerProps
- **AND** SHALL export LoadingSpinnerRecipeProps
- **AND** SHALL export LoadingSpinnerRootSlotProps
- **AND** types SHALL be accessible from package index

### Requirement: Ref Forwarding
The component SHALL support ref forwarding per nimbus-core standards.

#### Scenario: Ref forwarding to root element
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to LoadingSpinnerRoot svg element
- **AND** SHALL support React.Ref<SVGSVGElement> type
- **AND** SHALL provide access to DOM element
- **AND** ref SHALL be usable for measurements or focus management

### Requirement: Component Composition Support
The component SHALL support composition within other components.

#### Scenario: Usage in Button loading state
- **WHEN** LoadingSpinner is used inside Button without a size
- **THEN** SHALL render at the size the button gives to its icons, for every button size
- **AND** colorPalette="white" SHALL be used on solid buttons
- **AND** SHALL align with button text via flex layout
- **AND** SHALL maintain button dimensions (no layout shift)

#### Scenario: Usage in container elements
- **WHEN** LoadingSpinner is used in Box, Stack, or Flex
- **THEN** SHALL behave like an icon in the layout context
- **AND** SHALL respect parent alignment and justification
- **AND** SHALL be positionable via parent layout props

#### Scenario: Standalone usage
- **WHEN** LoadingSpinner is used independently
- **THEN** SHALL be self-contained and render at 24px
- **AND** SHALL not require wrapper for basic usage
- **AND** SHALL be positionable via style props

### Requirement: Testing Support
The component SHALL provide comprehensive Storybook stories with interaction tests per nimbus-core standards.

#### Scenario: Base story with accessibility tests
- **WHEN** Base story runs play function
- **THEN** SHALL verify element tagName is "svg"
- **AND** SHALL verify role="progressbar" attribute
- **AND** SHALL verify aria-label is present and correct
- **AND** SHALL use data-testid for element queries

#### Scenario: Size variants story
- **WHEN** Sizes story renders
- **THEN** SHALL render all size variants: 2xs, xs, sm, md, lg
- **AND** SHALL display in horizontal Stack for visual comparison
- **AND** SHALL apply consistent gap and alignment
- **AND** SHALL serve as visual documentation

#### Scenario: Requested size story
- **WHEN** RendersAtRequestedSize story runs its play function
- **THEN** SHALL verify every size renders at 14, 20, 24, 32 and 40px for 2xs, xs, sm, md and lg
- **AND** SHALL verify a spinner without size is 24px
- **AND** SHALL verify a size set through style props is adopted
- **AND** SHALL verify a spinner without size inside buttons takes the icon size of each button

#### Scenario: Icon comparison story
- **WHEN** NextToIconsInButtons story runs its play function
- **THEN** SHALL verify that in buttons of every size, the spinner is as large as an icon

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
