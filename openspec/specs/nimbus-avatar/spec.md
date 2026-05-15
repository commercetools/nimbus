# Specification: Avatar Component

## Overview

The Avatar component displays user profile images or initials in a visually
distinct, circular or square container. It provides automatic fallback from
image to initials, supports multiple sizes, and integrates with the Nimbus
design token system for consistent styling across the design system.
The Avatar component displays user profile images or initials in a visually
distinct, circular or square container. It provides automatic fallback from
image to initials, supports multiple sizes, and integrates with the Nimbus
design token system for consistent styling across the design system.

**Component:** `Avatar` **Package:** `@commercetools/nimbus` **Type:**
Single-slot component (Tier 1) **React Aria:** Not used (non-interactive display
component)

## Purpose

Avatar provides a visual representation of users or entities within the
interface. It displays profile images when available, automatically falls back
to generated initials from names, and supports optional icon fallbacks. This
enables users to quickly identify and associate actions, content, or data with
specific users or entities throughout the application.
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

The component SHALL generate and display initials when the image is
unavailable, deriving them defensively from the (possibly missing) name
inputs.

#### Scenario: Initials generation

- **WHEN** `firstName` and `lastName` are non-empty strings after trimming
- **THEN** SHALL extract the first Unicode codepoint of each trimmed
  string via `Array.from(name)[0]`
- **AND** SHALL convert each character to uppercase via locale-independent
  `toUpperCase()`
- **AND** SHALL concatenate into a two-character initials string (e.g.,
  `"JD"` from `" John "` and `"Doe"`)

#### Scenario: Initials display priority

- **WHEN** no `src` provided, image is loading, or image failed to load
- **THEN** SHALL display generated initials (or the `Person` icon if no
  initials are derivable — see "Person Icon Fallback")
- **AND** SHALL center content in container
- **AND** SHALL use appropriate text styling from recipe

#### Scenario: Optional name props

- **WHEN** the component renders
- **THEN** `firstName` prop SHALL be optional
- **AND** `lastName` prop SHALL be optional
- **AND** SHALL handle every combination of provided/missing/empty/
  whitespace inputs without throwing

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
- **AND** SHALL be suitable for most UI contexts and primary user
  representations

### Requirement: Shape Variant

The component SHALL support circular shape design.

#### Scenario: Circular shape

- **WHEN** avatar renders
- **THEN** SHALL apply borderRadius "full" (design token for perfect circle)
- **AND** SHALL maintain circular appearance regardless of size
- **AND** SHALL clip image content to circular boundary

### Requirement: Color Palette Support

The component SHALL support all semantic and system color palettes for initials
background.

#### Scenario: Semantic colors

- **WHEN** colorPalette prop is set to semantic value
- **THEN** SHALL accept: primary, neutral, info, positive, warning, critical
- **AND** SHALL use color scale 3 for background (colorPalette.3)
- **AND** SHALL use color scale 11 for text (colorPalette.11)
- **AND** SHALL maintain WCAG AA contrast ratios (4.5:1 for normal text)
- **AND** SHALL support light and dark modes via semantic tokens

#### Scenario: System colors

- **WHEN** colorPalette prop is set to system color
- **THEN** SHALL accept all Radix color scales (grass, tomato, blue, amber,
  mint, pink, teal, etc.)
- **AND** SHALL apply same color formula (scale 3 for background, scale 11 for
  text)
- **AND** SHALL maintain consistent visual weight across colors

#### Scenario: Default color

- **WHEN** colorPalette prop is not provided
- **THEN** SHALL use "primary" as default color palette
- **AND** SHALL maintain consistent appearance
- **AND** SHALL be specified in recipe defaultVariants

### Requirement: Alternative Text

The component SHALL provide accessible alternative text for images,
gracefully handling missing names.

#### Scenario: Custom alt text

- **WHEN** `alt` prop is provided
- **THEN** SHALL use `alt` value for the image's `alt` attribute
- **AND** SHALL provide screen reader context for the image
- **AND** SHALL override default name-derived alt text

#### Scenario: Default alt text with names

- **WHEN** `alt` prop is not provided AND `src` exists
- **AND** at least one of `firstName`/`lastName` is usable after trimming
- **THEN** SHALL use the trimmed, space-joined non-empty name parts as
  the alt text (e.g., `"John Doe"`, `"John"`, or `"Doe"`)
- **AND** SHALL NOT include leading, trailing, or doubled spaces

#### Scenario: Default alt text without names

- **WHEN** `alt` prop is not provided AND `src` exists
- **AND** neither `firstName` nor `lastName` is usable
- **THEN** SHALL use the localized `avatarLabelGeneric` value as the
  alt text

#### Scenario: Alt text for initials and icon

- **WHEN** displaying initials or the `Person` icon (no image)
- **THEN** the `alt` attribute SHALL not apply (no image element
  rendered)
- **AND** SHALL rely on `aria-label` for accessibility

### Requirement: ARIA Labels

The component SHALL provide internationalized ARIA labels per
nimbus-core standards, gracefully handling missing names.

#### Scenario: Automatic aria-label with names

- **WHEN** the component renders AND at least one of
  `firstName`/`lastName` is usable after trimming
- **THEN** SHALL provide an `aria-label` attribute on the root element
- **AND** SHALL use `useLocalizedStringFormatter` to format
  `messages.avatarLabel`
- **AND** SHALL interpolate the trimmed, space-joined non-empty name
  parts into `{fullName}` (no leading/trailing/doubled spaces)

#### Scenario: Automatic aria-label without names

- **WHEN** the component renders AND neither `firstName` nor `lastName`
  is usable after trimming
- **THEN** SHALL provide an `aria-label` attribute equal to the
  localized `avatarLabelGeneric` value
- **AND** SHALL NOT use `avatarLabel` with an empty `{fullName}`
  interpolation

#### Scenario: Custom aria-label override

- **WHEN** `aria-label` prop is explicitly provided
- **THEN** SHALL use the provided `aria-label` value
- **AND** SHALL override the default internationalized label
- **AND** SHALL maintain accessibility compliance

#### Scenario: Screen reader announcement

- **WHEN** a screen reader encounters the avatar
- **THEN** SHALL announce the `aria-label` content
- **AND** SHALL provide context about user identity (or generic context
  when no identity is available)

### Requirement: Semantic HTML Element

The component SHALL use appropriate semantic HTML element.

#### Scenario: Figure element

- **WHEN** avatar renders with default configuration
- **THEN** SHALL render as HTML figure element
- **AND** figure element SHALL be semantically appropriate for representing user
  image/initials
- **AND** SHALL provide appropriate document outline structure

#### Scenario: Element accessibility

- **WHEN** using figure element
- **THEN** SHALL be accessible to screen readers
- **AND** SHALL announce as figure with aria-label
- **AND** SHALL not require additional role attribute

### Requirement: Internationalization Support

The component SHALL support message localization per nimbus-core
standards.

#### Scenario: Message definitions

- **WHEN** the component defines translatable messages
- **THEN** SHALL define messages in `avatar.i18n.ts` as plain TypeScript
  objects
- **AND** SHALL define `avatarLabel` with id
  `Nimbus.Avatar.avatarLabel` and default `"Avatar image for {fullName}"`
- **AND** SHALL define `avatarLabelGeneric` with id
  `Nimbus.Avatar.avatarLabelGeneric` and default `"User avatar"`

#### Scenario: Message usage

- **WHEN** the component renders with localized text
- **THEN** SHALL use `useLocalizedStringFormatter` from `@/hooks`
- **AND** SHALL call `msg.format("avatarLabel", { fullName })` when at
  least one name is usable
- **AND** SHALL call `msg.format("avatarLabelGeneric")` when both names
  are unusable

#### Scenario: Message format

- **WHEN** defining `avatarLabel`
- **THEN** `defaultMessage` SHALL be `"Avatar image for {fullName}"`
- **AND** `description` SHALL explain the message purpose for
  translators
- **AND** SHALL support interpolation of the `fullName` variable

#### Scenario: Generic message format

- **WHEN** defining `avatarLabelGeneric`
- **THEN** `defaultMessage` SHALL be `"User avatar"`
- **AND** `description` SHALL explain that the message is used when no
  user name is available
- **AND** SHALL NOT take any interpolation parameters

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
- **AND** recipe SHALL be registered in theme configuration
  (theme/recipes/index.ts)
- **AND** SHALL support recipe props: size, colorPalette
- **AND** SHALL use createRecipeContext for Chakra integration

#### Scenario: Base styles

- **WHEN** recipe applies
- **THEN** SHALL apply consistent base styles (display, alignment,
  border-radius, font-weight, overflow, userSelect)
- **AND** SHALL use design tokens for all values
- **AND** SHALL not use hardcoded colors, spacing, or sizing
- **AND** SHALL apply backgroundColor: "colorPalette.3" and color:
  "colorPalette.11"

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
- **AND** SHALL render as figure element via withContext<HTMLElement,
  AvatarRootSlotProps>("figure")

#### Scenario: Slot props forwarding

- **WHEN** component receives props
- **THEN** SHALL forward recipe props to AvatarRoot (size, colorPalette,
  unstyled)
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

- **WHEN** data-\* attributes are provided
- **THEN** SHALL forward all data attributes to root figure element
- **AND** SHALL support testing attributes (data-testid)
- **AND** SHALL support custom metadata attributes

#### Scenario: Test queries

- **WHEN** component is tested
- **THEN** SHOULD be queried by aria-label attribute
- **AND** SHOULD be queried by role or semantic element
- **AND** SHALL not require data-testid for basic testing

### Requirement: Type Safety

The component SHALL provide comprehensive TypeScript types per
nimbus-core standards.

#### Scenario: Required vs optional props

- **WHEN** defining component props
- **THEN** `firstName` SHALL be `string | undefined` (optional)
- **AND** `lastName` SHALL be `string | undefined` (optional)
- **AND** `src` SHALL be optional string
- **AND** `alt` SHALL be optional string
- **AND** `size` SHALL be optional with type from recipe

**Change:** `firstName` and `lastName` were previously required strings;
they are now optional to align the type contract with the component's
defensive runtime behavior. Consumer code that already passes both still
type-checks; new call sites can omit either or both.

### Requirement: Theme Registration

The component recipe SHALL be registered in theme configuration per nimbus-core
standards.

#### Scenario: Recipe registration

- **WHEN** component is added to package
- **THEN** recipe SHALL be manually registered in theme/recipes/index.ts
- **AND** SHALL be included in recipes object export: `avatar: avatarRecipe`
- **AND** CRITICAL: registration SHALL not be automatic (no auto-discovery)
- **AND** missing registration SHALL result in unstyled component

#### Scenario: Recipe export

- **WHEN** recipe is defined
- **THEN** SHALL be exported from avatar.recipe.ts as named export
  `avatarRecipe`
- **AND** SHALL be importable by theme configuration
- **AND** SHALL use defineRecipe from Chakra styled-system

### Requirement: Component Export

The component SHALL be exported from package per nimbus-core standards.

#### Scenario: Component export

- **WHEN** component is added
- **THEN** SHALL be exported from component index.ts: `export { Avatar }`
- **AND** SHALL be re-exported from package root index.ts
- **AND** SHALL be importable via
  `import { Avatar } from "@commercetools/nimbus"`

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

The component SHALL meet WCAG AA contrast requirements per nimbus-core
standards.

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

The component SHALL compose the full name from non-empty trimmed parts.

#### Scenario: Both names provided

- **WHEN** `firstName` and `lastName` are both non-empty after trimming
- **THEN** SHALL produce `"<trimmedFirstName> <trimmedLastName>"`
  (single space)
- **AND** SHALL use the result for default alt text and `aria-label`
  interpolation

#### Scenario: One name provided

- **WHEN** exactly one of `firstName`/`lastName` is non-empty after
  trimming
- **THEN** SHALL produce just that trimmed name as the full name
- **AND** SHALL NOT include any leading/trailing whitespace

#### Scenario: Neither name usable

- **WHEN** neither `firstName` nor `lastName` is non-empty after
  trimming
- **THEN** SHALL NOT produce a `fullName` for `avatarLabel`
  interpolation
- **AND** SHALL fall back to `avatarLabelGeneric` for both `aria-label`
  and default `alt`

### Requirement: State Management Pattern

The component SHALL manage image loading state with React hooks.

#### Scenario: State hooks

- **WHEN** component initializes
- **THEN** SHALL use useState for imageLoaded (initialized to false)
- **AND** SHALL use useState for imageError (initialized to false)
- **AND** SHALL update states via onLoad and onError callbacks

#### Scenario: State transitions

- **WHEN** image loading progresses
- **THEN** initial state SHALL be: imageLoaded=false, imageError=false (show
  initials)
- **AND** successful load SHALL set: imageLoaded=true, imageError=false (show
  image)
- **AND** error state SHALL set: imageLoaded=false, imageError=true (show
  initials)
- **AND** SHALL not have intermediate loading indicator

### Requirement: Conditional Rendering Logic

The component SHALL determine display mode based on image state and
initial availability.

#### Scenario: Should show fallback calculation

- **WHEN** the component renders
- **THEN** SHALL calculate
  `shouldShowFallback = !src || !imageLoaded || imageError`
- **AND** SHALL show the fallback (initials or icon) when `src` is
  falsy
- **AND** SHALL show the fallback while the image hasn't loaded yet
- **AND** SHALL show the fallback when the image failed to load

#### Scenario: Fallback selection

- **WHEN** `shouldShowFallback` is `true`
- **AND** at least one of `firstName`/`lastName` yields a usable
  trimmed character
- **THEN** SHALL render the initials text
- **AND** SHALL NOT render the `Person` icon

#### Scenario: Icon fallback selection

- **WHEN** `shouldShowFallback` is `true`
- **AND** neither `firstName` nor `lastName` yields a usable trimmed
  character
- **THEN** SHALL render the `Person` icon
- **AND** SHALL NOT render any initials text

#### Scenario: Image rendering condition

- **WHEN** rendering the image element
- **THEN** SHALL only render the `Image` component if `src` is truthy
- **AND** SHALL always render `Image` when `src` exists (even if hidden)
- **AND** SHALL control visibility via the `display` style property

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

### Requirement: Person Icon Fallback

The component SHALL render a `Person` icon from
`@commercetools/nimbus-icons` when neither `firstName` nor `lastName`
yields a usable initial after trimming.

#### Scenario: Both names missing

- **WHEN** `firstName` and `lastName` are both `undefined`
- **AND** no usable image is being displayed
- **THEN** SHALL render the `Person` icon centered in the avatar slot
- **AND** SHALL NOT render any text content
- **AND** the icon SHALL inherit `currentColor` so it picks up
  `colorPalette.11`

#### Scenario: Both names empty string

- **WHEN** `firstName=""` and `lastName=""`
- **AND** no usable image is being displayed
- **THEN** SHALL render the `Person` icon centered in the avatar slot
- **AND** SHALL NOT render any text content

#### Scenario: Both names whitespace only

- **WHEN** `firstName="  "` and `lastName="\t"`
- **AND** no usable image is being displayed
- **THEN** SHALL render the `Person` icon (whitespace trims to empty)
- **AND** SHALL NOT render any text content

#### Scenario: Image fails AND names missing

- **WHEN** `src` is provided AND image load fails (`onError` fires)
- **AND** neither name yields a usable initial
- **THEN** SHALL render the `Person` icon as the fallback
- **AND** SHALL hide the `<img>` element via `display: none`

#### Scenario: Icon sizing across avatar sizes

- **WHEN** the `Person` icon is rendered at size `2xs`, `xs`, or `md`
- **THEN** SHALL scale proportionally to the avatar slot
- **AND** SHALL NOT exceed the slot's bounds (overflow stays hidden)
- **AND** SHALL maintain visual centering

### Requirement: Codepoint-Safe Initials Extraction

The component SHALL extract initials using Unicode codepoint iteration so
that astral-plane characters (e.g., emoji surrogate pairs) are not split
mid-surrogate.

#### Scenario: Emoji firstName

- **WHEN** `firstName="👨"` and `lastName="Doe"`
- **THEN** the rendered initials SHALL contain the full `👨` codepoint
  followed by `D`
- **AND** SHALL NOT contain a lone surrogate code unit

#### Scenario: Astral character lastName

- **WHEN** `firstName="John"` and `lastName="𝓢mith"` (math script S)
- **THEN** the rendered initials SHALL contain `J` followed by the full
  `𝓢` codepoint (uppercased to `𝓢` since the script-S is already
  outside ASCII case mapping)
- **AND** SHALL NOT contain a lone surrogate code unit

### Requirement: Whitespace-Trimming Initials Extraction

The component SHALL trim leading and trailing whitespace from each name
before extracting the first character.

#### Scenario: Leading whitespace

- **WHEN** `firstName=" John"` and `lastName="Doe"`
- **THEN** the rendered initials SHALL be `JD`
- **AND** SHALL NOT include a leading space character

#### Scenario: Trailing whitespace

- **WHEN** `firstName="John "` and `lastName="Doe "`
- **THEN** the rendered initials SHALL be `JD`

#### Scenario: Mixed whitespace types

- **WHEN** `firstName="\tJohn\n"` and `lastName="Doe"`
- **THEN** the rendered initials SHALL be `JD`

### Requirement: Single-Initial Output

The component SHALL render a single initial when only one of `firstName`
or `lastName` yields a usable character.

#### Scenario: Only firstName provided

- **WHEN** `firstName="John"` and `lastName` is `undefined`
- **THEN** the rendered initials SHALL be `J`
- **AND** SHALL render exactly one character

#### Scenario: Only lastName provided

- **WHEN** `firstName` is `""` and `lastName="Doe"`
- **THEN** the rendered initials SHALL be `D`
- **AND** SHALL render exactly one character

#### Scenario: Only lastName usable after trim

- **WHEN** `firstName=" "` and `lastName="Doe"`
- **THEN** the rendered initials SHALL be `D`

### Requirement: Generic Avatar Label

The component SHALL provide a localized generic `aria-label` (and default
`alt`) when no name is present to interpolate.

#### Scenario: Generic label key exists

- **WHEN** the component bundle is built
- **THEN** an `avatarLabelGeneric` message SHALL be defined in
  `avatar.i18n.ts` with default English `"User avatar"`
- **AND** the message ID SHALL be `Nimbus.Avatar.avatarLabelGeneric`
- **AND** SHALL be available in all Nimbus locales (en baseline; de, es,
  fr-FR, pt-BR populated via Transifex)

#### Scenario: Generic label applied when both names missing

- **WHEN** `firstName` and `lastName` are both unusable (undefined,
  empty, or whitespace-only)
- **AND** no explicit `aria-label` prop is provided
- **THEN** the avatar's `aria-label` SHALL equal the localized
  `avatarLabelGeneric` value

#### Scenario: Default alt for missing names with image

- **WHEN** `src` is provided AND both names are unusable
- **AND** no explicit `alt` prop is provided
- **THEN** the rendered `<img>` `alt` attribute SHALL equal the localized
  `avatarLabelGeneric` value

