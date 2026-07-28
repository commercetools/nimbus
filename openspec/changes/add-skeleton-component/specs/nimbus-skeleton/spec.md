## ADDED Requirements

### Requirement: Base skeleton placeholder

The `Skeleton` component SHALL render a single block-level placeholder element
sized by `width`/`height` (and `borderRadius`) so it can hold space for content
that is loading.

#### Scenario: Renders a sized placeholder

- **WHEN** `Skeleton` is rendered with a `width` and `height`
- **THEN** a block element is rendered with those dimensions applied

#### Scenario: Default rectangle shape

- **WHEN** `Skeleton` is rendered with no `shape`
- **THEN** it uses the rectangle shape with a small (non-circular) border radius

### Requirement: Shape variants

`Skeleton` SHALL support a `rectangle` shape (default) and a `circle` shape; the
`circle` shape applies a fully-rounded radius and a 1:1 aspect ratio.

#### Scenario: Circle shape

- **WHEN** `Skeleton` is rendered with `shape="circle"` (or via `SkeletonCircle`)
- **THEN** it renders with a fully-rounded border radius and equal width/height

### Requirement: Animation variants

`Skeleton` SHALL support `animation` values `"pulse"` (default), `"wave"`, and
`"none"`. The animation is purely visual and conveys that loading is active.

#### Scenario: Default pulse animation

- **WHEN** `Skeleton` is rendered with no `animation`
- **THEN** the pulse animation is applied

#### Scenario: No animation

- **WHEN** `Skeleton` is rendered with `animation="none"`
- **THEN** no animation is applied to the element

### Requirement: Decorative by default

`Skeleton`, `SkeletonText`, and `SkeletonCircle` SHALL render with
`aria-hidden="true"` by default so the placeholder shapes are not exposed to
assistive technology. Consumers communicate loading state on the surrounding
container (e.g. `aria-busy`).

#### Scenario: Hidden from assistive tech

- **WHEN** any skeleton component is rendered with default props
- **THEN** its root element has `aria-hidden="true"`

### Requirement: Reduced motion

When the user prefers reduced motion, `Skeleton` SHALL NOT animate, regardless
of the `animation` prop value.

#### Scenario: Reduced-motion disables animation

- **WHEN** the `prefers-reduced-motion: reduce` media condition is active
- **THEN** the skeleton element applies no animation

### Requirement: Multi-line text skeleton

`SkeletonText` SHALL render a configurable number of placeholder lines (`lines`,
default 3) stacked vertically with spacing between them, where the last line is
narrower (`lastLineWidth`) to approximate a paragraph of text.

#### Scenario: Renders N lines

- **WHEN** `SkeletonText` is rendered with `lines={4}`
- **THEN** four placeholder line elements are rendered

#### Scenario: Last line is shorter

- **WHEN** `SkeletonText` is rendered with more than one line
- **THEN** the last line is rendered narrower than the preceding lines

#### Scenario: Single line spans full width

- **WHEN** `SkeletonText` is rendered with exactly one line
- **THEN** that line spans the full width (the shorter-last-line treatment does
  not apply to the first line)

### Requirement: Text skeleton matches a text style

`SkeletonText` SHALL accept a `textStyle` prop (default `body`) that sizes the
placeholder line height and inter-line spacing to match the corresponding Nimbus
text style, so the placeholder occupies a vertical rhythm comparable to real
text of that style. Explicit `lineHeight` (bar height) and `spacing` (gap) props
SHALL override the derived values.

#### Scenario: Default body sizing

- **WHEN** `SkeletonText` is rendered with no `textStyle`
- **THEN** the line pitch matches the `body` text style's line-height

#### Scenario: Sizing scales with the chosen text style

- **WHEN** `SkeletonText` is rendered with `textStyle="3xl"`
- **THEN** the bar height and line pitch scale to the `3xl` text style's
  font-size and line-height

### Requirement: Circle skeleton convenience

`SkeletonCircle` SHALL render a circular placeholder with equal width and height.
It SHALL accept an avatar-aligned `size` prop (`2xs`/`xs`/`md`, matching the
`Avatar` size scale) and a `boxSize` prop for custom dimensions; when neither is
provided it SHALL default to a `1em` circle.

#### Scenario: Avatar-aligned size

- **WHEN** `SkeletonCircle` is rendered with `size="md"`
- **THEN** it renders a circle whose width and height equal the Avatar `md`
  dimension (40px)

#### Scenario: Custom size

- **WHEN** `SkeletonCircle` is rendered with a `boxSize`
- **THEN** it renders a circle with equal width and height equal to that
  `boxSize`

#### Scenario: Default size

- **WHEN** `SkeletonCircle` is rendered with neither `size` nor `boxSize`
- **THEN** it renders a `1em` circle

### Requirement: Style and ref passthrough

`Skeleton` SHALL forward standard HTML div attributes and a `ref` to its root
element, and accept Nimbus style props, so consumers can position and size it
within layouts.

#### Scenario: Ref forwarded

- **WHEN** a `ref` is passed to `Skeleton`
- **THEN** the ref resolves to the rendered root element
