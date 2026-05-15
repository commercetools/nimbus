# Spec Delta: nimbus-avatar — Harden Against Missing/Edge-Case Names

## ADDED Requirements

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

## MODIFIED Requirements

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

