# Specification: Avatar Component

## Overview

The Avatar component displays user profile images or initials in a visually distinct, circular or square container. It provides automatic fallback from image to initials, supports multiple sizes, and integrates with the Nimbus design token system for consistent styling across the design system.

**Component:** `Avatar`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 1)
**React Aria:** Not used (non-interactive display component)

## Purpose

Avatar provides a visual representation of users or entities within the interface. It displays profile images when available, automatically falls back to generated initials from names, and supports optional icon fallbacks. This enables users to quickly identify and associate actions, content, or data with specific users or entities throughout the application.

## Requirements

### Requirement: Image Display
The component SHALL display user profile images from provided URLs.

#### Scenario: Image loading
- **WHEN** src prop contains valid image URL
- **THEN** SHALL load and display the image
- **AND** SHALL handle image load events internally
- **AND** SHALL maintain aspect ratio and fill container

#### Scenario: Image visibility
- **WHEN** image successfully loads
- **THEN** SHALL display image with block display style
- **AND** SHALL hide initials fallback
- **AND** SHALL fill entire avatar container

#### Scenario: No image provided
- **WHEN** src prop is not provided
- **THEN** SHALL skip image rendering
- **AND** SHALL display initials fallback immediately

### Requirement: Initials Fallback
The component SHALL generate and display initials when image is unavailable.

#### Scenario: Initials generation
- **WHEN** firstName and lastName props are provided
- **THEN** SHALL extract first character from firstName
- **AND** SHALL extract first character from lastName
- **AND** SHALL convert both characters to uppercase
- **AND** SHALL concatenate into two-character initials (e.g., "JD" from "John Doe")

#### Scenario: Initials display priority
- **WHEN** no src provided, image loading, or image failed
- **THEN** SHALL display generated initials
- **AND** SHALL center initials in container
- **AND** SHALL use appropriate text styling from recipe

#### Scenario: Required name props
- **WHEN** component renders
- **THEN** firstName prop SHALL be required
- **AND** lastName prop SHALL be required
- **AND** SHALL use both to generate consistent initials

### Requirement: Image Error Handling
The component SHALL handle image loading failures gracefully.

#### Scenario: Image load failure
- **WHEN** image fails to load (404, network error, invalid format)
- **THEN** SHALL trigger onError handler
- **AND** SHALL set internal error state
- **AND** SHALL hide image element (display: none)
- **AND** SHALL display initials fallback

#### Scenario: Automatic retry prevention
- **WHEN** image error occurs
- **THEN** SHALL not automatically retry loading
- **AND** SHALL persist error state until src changes
- **AND** SHALL maintain initials display

#### Scenario: Error state persistence
- **WHEN** image error state is set
- **THEN** SHALL maintain error state even if onLoad fires
- **AND** SHALL prioritize error state over loading state
- **AND** SHALL only reset if src prop changes

### Requirement: Loading States
The component SHALL manage image loading states internally.

#### Scenario: Initial state
- **WHEN** component mounts with src prop
- **THEN** SHALL initialize imageLoaded state as false
- **AND** SHALL initialize imageError state as false
- **AND** SHALL display initials while image loads

#### Scenario: Successful load
- **WHEN** image successfully loads
- **THEN** SHALL set imageLoaded to true
- **AND** SHALL set imageError to false
- **AND** SHALL transition from initials to image display

#### Scenario: Loading indicator absence
- **WHEN** image is loading
- **THEN** SHALL display initials (not a loading spinner)
- **AND** SHALL provide seamless visual experience
- **AND** SHALL not show loading state to user

### Requirement: Size Variants
The component SHALL support three size options.

#### Scenario: 2x-small size
- **WHEN** size="2xs" is set
- **THEN** SHALL render with width of 600 (design token)
- **AND** SHALL render with height of 600 (design token)
- **AND** SHALL use textStyle "xs" for initials
- **AND** SHALL be suitable for compact layouts and dense lists

#### Scenario: X-small size
- **WHEN** size="xs" is set
- **THEN** SHALL render with width of 800 (design token)
- **AND** SHALL render with height of 800 (design token)
- **AND** SHALL use textStyle "xs" for initials
- **AND** SHALL be suitable for list items and secondary contexts

#### Scenario: Medium size
- **WHEN** size="md" is set (default)
- **THEN** SHALL render with width of 1000 (design token)
- **AND** SHALL render with height of 1000 (design token)
- **AND** SHALL use textStyle "sm" for initials
- **AND** SHALL be suitable for most UI contexts and primary user representations

### Requirement: Shape Variant
The component SHALL support circular shape design.

#### Scenario: Circular shape
- **WHEN** avatar renders
- **THEN** SHALL apply borderRadius "full" (design token for perfect circle)
- **AND** SHALL maintain circular appearance regardless of size
- **AND** SHALL clip image content to circular boundary

### Requirement: Color Palette Support
The component SHALL support all semantic and system color palettes for initials background.

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
- **THEN** SHALL use "primary" as default color palette
- **AND** SHALL maintain consistent appearance
- **AND** SHALL be specified in recipe defaultVariants

### Requirement: Alternative Text
The component SHALL provide accessible alternative text for images.

#### Scenario: Custom alt text
- **WHEN** alt prop is provided
- **THEN** SHALL use alt value for image alt attribute
- **AND** SHALL provide screen reader context for image
- **AND** SHALL override default full name alt text

#### Scenario: Default alt text
- **WHEN** alt prop is not provided but src exists
- **THEN** SHALL use full name (firstName + lastName) as alt text
- **AND** SHALL provide meaningful default description
- **AND** SHALL ensure image is accessible

#### Scenario: Alt text for initials
- **WHEN** displaying initials (no image)
- **THEN** alt attribute SHALL not apply (no image element)
- **AND** SHALL rely on aria-label for accessibility
- **AND** SHALL announce initials as text content

### Requirement: ARIA Labels
The component SHALL provide internationalized ARIA labels per nimbus-core standards.

#### Scenario: Automatic aria-label
- **WHEN** component renders
- **THEN** SHALL provide aria-label attribute on root element
- **AND** SHALL use react-intl formatMessage with messages.avatarLabel
- **AND** SHALL interpolate full name into message: "Avatar image for {fullName}"
- **AND** SHALL support all Nimbus locales (en, de, es, fr-FR, pt-BR)

#### Scenario: Custom aria-label override
- **WHEN** aria-label prop is explicitly provided
- **THEN** SHALL use provided aria-label value
- **AND** SHALL override default internationalized label
- **AND** SHALL maintain accessibility compliance

#### Scenario: Screen reader announcement
- **WHEN** screen reader encounters avatar
- **THEN** SHALL announce aria-label content
- **AND** SHALL provide context about user identity
- **AND** SHALL be meaningful without visual context

### Requirement: Semantic HTML Element
The component SHALL use appropriate semantic HTML element.

#### Scenario: Figure element
- **WHEN** avatar renders with default configuration
- **THEN** SHALL render as HTML figure element
- **AND** figure element SHALL be semantically appropriate for representing user image/initials
- **AND** SHALL provide appropriate document outline structure

#### Scenario: Element accessibility
- **WHEN** using figure element
- **THEN** SHALL be accessible to screen readers
- **AND** SHALL announce as figure with aria-label
- **AND** SHALL not require additional role attribute

### Requirement: Internationalization Support
The component SHALL support message localization per nimbus-core standards.

#### Scenario: Message definition
- **WHEN** component defines translatable messages
- **THEN** SHALL define messages in avatar.i18n.ts file
- **AND** SHALL use react-intl's defineMessages API
- **AND** SHALL follow naming: `Nimbus.Avatar.{messageKey}`
- **AND** message ID SHALL be "Nimbus.Avatar.avatarLabel"

#### Scenario: Message usage
- **WHEN** component renders with localized text
- **THEN** SHALL use useIntl hook from react-intl
- **AND** SHALL call intl.formatMessage(messages.avatarLabel, { fullName })
- **AND** SHALL support variable interpolation for fullName parameter

#### Scenario: Message format
- **WHEN** defining avatarLabel message
- **THEN** defaultMessage SHALL be "Avatar image for {fullName}"
- **AND** description SHALL explain message purpose for translators
- **AND** SHALL support interpolation of fullName variable

### Requirement: Overflow Handling
The component SHALL clip content to container boundaries.

#### Scenario: Content clipping
- **WHEN** avatar renders with image or initials
- **THEN** SHALL apply overflow: hidden to container
- **AND** SHALL clip image content at circular border
- **AND** SHALL prevent content from extending beyond avatar boundaries

#### Scenario: Image sizing
- **WHEN** image is larger than avatar container
- **THEN** SHALL maintain image aspect ratio
- **AND** SHALL fill container while clipping overflow
- **AND** SHALL center image within circular boundary

### Requirement: Display Characteristics
The component SHALL provide consistent layout behavior.

#### Scenario: Inline-flex display
- **WHEN** avatar renders
- **THEN** SHALL use inline-flex display
- **AND** SHALL align vertically in middle (vertical-align: middle)
- **AND** SHALL fit naturally within text or flex layouts

#### Scenario: Content centering
- **WHEN** avatar contains initials
- **THEN** SHALL center-align items horizontally (justify-content: center)
- **AND** SHALL center-align items vertically (align-items: center)
- **AND** SHALL maintain centered appearance for all sizes

#### Scenario: Fixed dimensions
- **WHEN** avatar renders
- **THEN** SHALL use fixed width and height from recipe variant
- **AND** SHALL prevent shrinking (flexShrink: 0)
- **AND** SHALL maintain square dimensions before border-radius

### Requirement: User Selection Prevention
The component SHALL prevent unintended text selection.

#### Scenario: Text selection prevention
- **WHEN** user attempts to select initials text
- **THEN** SHALL prevent text selection (user-select: none)
- **AND** SHALL maintain visual polish
- **AND** SHALL not interfere with surrounding text selection

### Requirement: Disabled State Support
The component SHALL support disabled visual state.

#### Scenario: Disabled styling
- **WHEN** isDisabled prop is set to true
- **THEN** SHALL apply layerStyle "disabled" from theme
- **AND** SHALL reduce opacity and visual prominence
- **AND** SHALL indicate non-interactive state
- **AND** SHALL apply to both image and initials display

#### Scenario: Button context
- **WHEN** avatar is wrapped in button element
- **THEN** SHALL apply cursor "button" style
- **AND** recipe rule `"button&"` SHALL add button cursor
- **AND** SHALL indicate interactive capability

### Requirement: Focus Styling
The component SHALL provide focus indicators when interactive.

#### Scenario: Focus visible ring
- **WHEN** avatar is focusable (e.g., wrapped in button or link)
- **THEN** recipe SHALL include focusVisibleRing "outside" style
- **AND** SHALL display visible focus indicator when focused via keyboard
- **AND** SHALL meet 3:1 contrast ratio for focus indicator
- **AND** SHALL position ring outside avatar boundary

#### Scenario: Non-interactive focus
- **WHEN** avatar is non-interactive (default figure element)
- **THEN** SHALL not be focusable
- **AND** focus ring styles SHALL not apply
- **AND** SHALL not participate in tab order

### Requirement: Children Prop Override
The component SHALL support custom content via children prop.

#### Scenario: Custom children rendering
- **WHEN** children prop is provided
- **THEN** SHALL allow custom content override
- **AND** MAY be used for custom fallback icons or content
- **AND** SHALL not interfere with default image/initials logic

#### Scenario: Children with image
- **WHEN** both children and src are provided
- **THEN** SHALL render both children and image
- **AND** image display logic SHALL still apply
- **AND** children SHALL be visible based on image load state

### Requirement: Ref Forwarding
The component SHALL forward refs to the root element per nimbus-core standards.

#### Scenario: Ref forwarding
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to underlying figure element (AvatarRoot)
- **AND** SHALL support React.Ref<HTMLDivElement> type
- **AND** SHALL allow parent components to access DOM node

#### Scenario: Ref usage
- **WHEN** parent component uses ref
- **THEN** SHALL provide access to root avatar element
- **AND** SHALL support imperative operations (focus, measurement, scrolling)
- **AND** SHALL maintain ref stability across re-renders

### Requirement: Recipe-Based Styling
The component SHALL use Chakra UI single-slot recipe per nimbus-core standards.

#### Scenario: Recipe application
- **WHEN** component renders
- **THEN** SHALL apply avatar recipe from theme/recipes/avatar.ts
- **AND** recipe SHALL be registered in theme configuration (theme/recipes/index.ts)
- **AND** SHALL support recipe props: size, colorPalette
- **AND** SHALL use createRecipeContext for Chakra integration

#### Scenario: Base styles
- **WHEN** recipe applies
- **THEN** SHALL apply consistent base styles (display, alignment, border-radius, font-weight, overflow, userSelect)
- **AND** SHALL use design tokens for all values
- **AND** SHALL not use hardcoded colors, spacing, or sizing
- **AND** SHALL apply backgroundColor: "colorPalette.3" and color: "colorPalette.11"

#### Scenario: Recipe variants
- **WHEN** recipe defines variants
- **THEN** SHALL define size variant with 2xs, xs, md options
- **AND** SHALL include width, height, and textStyle for each size
- **AND** SHALL use design token values (600, 800, 1000)

#### Scenario: Default variants
- **WHEN** no variant props provided
- **THEN** SHALL use defaultVariants from recipe
- **AND** size SHALL default to "md"
- **AND** colorPalette SHALL default to "primary"

### Requirement: Slot Component Integration
The component SHALL use Chakra slot components for styling.

#### Scenario: AvatarRoot slot
- **WHEN** component renders
- **THEN** SHALL use AvatarRoot slot component (defined in avatar.slots.tsx)
- **AND** AvatarRoot SHALL be created with createRecipeContext
- **AND** SHALL render as figure element via withContext<HTMLElement, AvatarRootSlotProps>("figure")

#### Scenario: Slot props forwarding
- **WHEN** component receives props
- **THEN** SHALL forward recipe props to AvatarRoot (size, colorPalette, unstyled)
- **AND** SHALL forward style props to AvatarRoot (margin, padding, etc.)
- **AND** SHALL forward HTML attributes to underlying figure element

### Requirement: Custom Styling
The component SHALL accept Chakra style props per nimbus-core standards.

#### Scenario: Style prop override
- **WHEN** style props are provided (margin, padding, width, etc.)
- **THEN** SHALL accept all Chakra style props via HTMLChakraProps
- **AND** SHALL apply responsive style values (arrays and objects)
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL merge with recipe styles correctly

#### Scenario: Common style props
- **WHEN** layout props are needed
- **THEN** SHALL support margin props (m, mt, mr, mb, ml, mx, my)
- **AND** SHALL support display and positioning props
- **AND** SHALL support color overrides (bg, color) that override recipe
- **AND** SHALL maintain design system consistency

### Requirement: Image Component Integration
The component SHALL use Nimbus Image component internally.

#### Scenario: Image usage
- **WHEN** src prop is provided
- **THEN** SHALL render Nimbus Image component from @/components
- **AND** SHALL pass src prop to Image component
- **AND** SHALL pass alt text to Image component
- **AND** SHALL attach onLoad and onError handlers to Image

#### Scenario: Image styling
- **WHEN** image renders successfully
- **THEN** SHALL set display="block" on Image component
- **AND** SHALL fill avatar container
- **AND** SHALL respect avatar's circular clipping

#### Scenario: Image hiding
- **WHEN** image hasn't loaded or failed
- **THEN** SHALL set display="none" on Image component
- **AND** SHALL hide image element while maintaining initials
- **AND** condition SHALL be: `imageLoaded && !imageError ? "block" : "none"`

### Requirement: Testing and Metadata Support
The component SHALL accept data attributes per nimbus-core standards.

#### Scenario: Data attributes
- **WHEN** data-* attributes are provided
- **THEN** SHALL forward all data attributes to root figure element
- **AND** SHALL support testing attributes (data-testid)
- **AND** SHALL support custom metadata attributes

#### Scenario: Test queries
- **WHEN** component is tested
- **THEN** SHOULD be queried by aria-label attribute
- **AND** SHOULD be queried by role or semantic element
- **AND** SHALL not require data-testid for basic testing

### Requirement: Type Safety
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** component is imported
- **THEN** SHALL export AvatarProps interface from avatar.types.ts
- **AND** SHALL include JSDoc comments for all props
- **AND** SHALL extend OmitInternalProps<AvatarRootSlotProps>
- **AND** SHALL include HTMLAttributes<HTMLDivElement>

#### Scenario: Recipe props
- **WHEN** component uses recipe
- **THEN** SHALL define AvatarRecipeProps type
- **AND** SHALL include size variant with autocomplete (RecipeProps<"avatar">["size"])
- **AND** SHALL include UnstyledProp for unstyled variant support

#### Scenario: Slot props
- **WHEN** component defines slots
- **THEN** SHALL export AvatarRootSlotProps type
- **AND** SHALL be defined as HTMLChakraProps<"div", AvatarRecipeProps>
- **AND** SHALL provide type safety for slot component

#### Scenario: Required vs optional props
- **WHEN** defining component props
- **THEN** firstName SHALL be required string
- **AND** lastName SHALL be required string
- **AND** src SHALL be optional string
- **AND** alt SHALL be optional string
- **AND** size SHALL be optional with type from recipe
- **AND** isDisabled SHALL be optional boolean with default false

### Requirement: Theme Registration
The component recipe SHALL be registered in theme configuration per nimbus-core standards.

#### Scenario: Recipe registration
- **WHEN** component is added to package
- **THEN** recipe SHALL be manually registered in theme/recipes/index.ts
- **AND** SHALL be included in recipes object export: `avatar: avatarRecipe`
- **AND** CRITICAL: registration SHALL not be automatic (no auto-discovery)
- **AND** missing registration SHALL result in unstyled component

#### Scenario: Recipe export
- **WHEN** recipe is defined
- **THEN** SHALL be exported from avatar.recipe.ts as named export `avatarRecipe`
- **AND** SHALL be importable by theme configuration
- **AND** SHALL use defineRecipe from Chakra styled-system

### Requirement: Component Export
The component SHALL be exported from package per nimbus-core standards.

#### Scenario: Component export
- **WHEN** component is added
- **THEN** SHALL be exported from component index.ts: `export { Avatar }`
- **AND** SHALL be re-exported from package root index.ts
- **AND** SHALL be importable via `import { Avatar } from "@commercetools/nimbus"`

#### Scenario: Type exports
- **WHEN** component types are defined
- **THEN** SHALL export AvatarProps from avatar.types.ts
- **AND** SHALL re-export from component index.ts: `export type { AvatarProps }`
- **AND** SHALL be available for consumer TypeScript usage

### Requirement: Display Name
The component SHALL define a display name per nimbus-core standards.

#### Scenario: Component display name
- **WHEN** component is defined
- **THEN** SHALL set Avatar.displayName = "Avatar"
- **AND** SHALL aid debugging and React DevTools inspection
- **AND** SHALL be set immediately after component definition

### Requirement: Color Accessibility
The component SHALL meet WCAG AA contrast requirements per nimbus-core standards.

#### Scenario: Initials text contrast
- **WHEN** avatar displays initials with any color palette
- **THEN** SHALL maintain 4.5:1 contrast ratio for text
- **AND** SHALL use color scale 11 for text against scale 3 background
- **AND** SHALL meet contrast requirements in both light and dark modes

#### Scenario: Focus indicator contrast
- **WHEN** avatar is focused (in interactive context)
- **THEN** focus ring SHALL meet 3:1 contrast ratio
- **AND** SHALL be visible against background and avatar colors
- **AND** focusVisibleRing "outside" SHALL ensure adequate contrast

### Requirement: Name Composition
The component SHALL compose full name from first and last names.

#### Scenario: Full name calculation
- **WHEN** firstName and lastName props are provided
- **THEN** SHALL concatenate with space: `${firstName} ${lastName}`
- **AND** SHALL use full name for default alt text
- **AND** SHALL use full name for aria-label interpolation

#### Scenario: Full name consistency
- **WHEN** full name is calculated
- **THEN** SHALL use same composition for all text contexts
- **AND** SHALL maintain consistent user identity representation
- **AND** SHALL not include middle names or additional name parts

### Requirement: State Management Pattern
The component SHALL manage image loading state with React hooks.

#### Scenario: State hooks
- **WHEN** component initializes
- **THEN** SHALL use useState for imageLoaded (initialized to false)
- **AND** SHALL use useState for imageError (initialized to false)
- **AND** SHALL update states via onLoad and onError callbacks

#### Scenario: State transitions
- **WHEN** image loading progresses
- **THEN** initial state SHALL be: imageLoaded=false, imageError=false (show initials)
- **AND** successful load SHALL set: imageLoaded=true, imageError=false (show image)
- **AND** error state SHALL set: imageLoaded=false, imageError=true (show initials)
- **AND** SHALL not have intermediate loading indicator

### Requirement: Conditional Rendering Logic
The component SHALL determine display mode based on image state.

#### Scenario: Should show initials calculation
- **WHEN** component renders
- **THEN** SHALL calculate: `shouldShowInitials = !src || !imageLoaded || imageError`
- **AND** SHALL show initials when src is falsy (no image provided)
- **AND** SHALL show initials when image hasn't loaded yet
- **AND** SHALL show initials when image failed to load

#### Scenario: Image rendering condition
- **WHEN** rendering image element
- **THEN** SHALL only render Image component if src is truthy
- **AND** SHALL always render Image when src exists (even if hidden)
- **AND** SHALL control visibility via display style property

### Requirement: Event Handlers
The component SHALL handle image loading events.

#### Scenario: onLoad handler
- **WHEN** image successfully loads
- **THEN** SHALL define onLoad function
- **AND** SHALL set imageLoaded state to true
- **AND** SHALL set imageError state to false
- **AND** SHALL trigger image display

#### Scenario: onError handler
- **WHEN** image fails to load
- **THEN** SHALL define onError function
- **AND** SHALL set imageLoaded state to false
- **AND** SHALL set imageError state to true
- **AND** SHALL trigger initials fallback display

### Requirement: Props Destructuring Pattern
The component SHALL follow consistent props handling pattern.

#### Scenario: Props extraction
- **WHEN** component receives props
- **THEN** SHALL destructure: ref, firstName, lastName, src, alt from props
- **AND** SHALL collect remaining props with rest operator: ...rest
- **AND** SHALL forward rest props to AvatarRoot via sharedProps

#### Scenario: Shared props composition
- **WHEN** forwarding props to AvatarRoot
- **THEN** SHALL create sharedProps object with aria-label, ref, and ...rest
- **AND** SHALL spread sharedProps onto AvatarRoot component
- **AND** SHALL ensure all relevant props reach root element
