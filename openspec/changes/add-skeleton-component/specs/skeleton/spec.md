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

### Requirement: Circle skeleton convenience

`SkeletonCircle` SHALL render a circular placeholder sized by a single `size`
prop applied equally to width and height.

#### Scenario: Sized circle

- **WHEN** `SkeletonCircle` is rendered with a `size`
- **THEN** it renders a circular element with equal width and height equal to
  that size

### Requirement: Style and ref passthrough

`Skeleton` SHALL forward standard HTML div attributes and a `ref` to its root
element, and accept Nimbus style props, so consumers can position and size it
within layouts.

#### Scenario: Ref forwarded

- **WHEN** a `ref` is passed to `Skeleton`
- **THEN** the ref resolves to the rendered root element
