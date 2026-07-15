## ADDED Requirements

### Requirement: Compound API with Root, Content, and Action parts

The `FeedbackCard` pattern SHALL be exposed as a compound component with exactly
three dot-notation parts — `FeedbackCard.Root`, `FeedbackCard.Content`, and
`FeedbackCard.Action` — where `Root` is the first property of the namespace
object. Each part SHALL render a `div`, SHALL set a `displayName` of
`"FeedbackCard.Root"`, `"FeedbackCard.Content"`, and `"FeedbackCard.Action"`
respectively, and SHALL be usable in composition with consumer-provided
children.

#### Scenario: Rendering all three parts

- **WHEN** a consumer renders `FeedbackCard.Root` containing a
  `FeedbackCard.Content` and a `FeedbackCard.Action`
- **THEN** all three parts render as `div` elements, the content children and
  the action children appear in the document, and the action element follows
  the content element in DOM order

#### Scenario: Parts carry stable slot identity

- **WHEN** the three parts are rendered
- **THEN** each renders its corresponding recipe slot (`root`, `content`,
  `action`) so that slot layout styles from the `nimbusFeedbackCard` recipe are
  applied to the correct element

### Requirement: Layout-only styling with no variants

The `FeedbackCard` pattern SHALL provide layout only and SHALL NOT define any
recipe `variant` or `size` props. `FeedbackCard.Root` SHALL lay its children out
as a horizontal flex row that wraps (`flex-wrap`), aligns items centrally, uses
`justify-content: space-between`, and applies a design-token gap.
`FeedbackCard.Content` SHALL be a vertical stack that grows to fill available
space and permits wrapping. `FeedbackCard.Action` SHALL not shrink. All spacing
SHALL use design tokens, never hardcoded values.

#### Scenario: Responsive wrapping row

- **WHEN** the combined intrinsic width of the content and action exceeds the
  available width of `FeedbackCard.Root`
- **THEN** the action wraps onto a new line below the content rather than
  overflowing horizontally

#### Scenario: No variant or size API is offered

- **WHEN** a consumer inspects the `FeedbackCard.Root` prop types
- **THEN** there is no `variant` or `size` prop, and visual treatment is
  achievable only through forwarded style props

### Requirement: Visual treatment via forwarded Chakra style props

`FeedbackCard.Root` SHALL accept and forward standard Chakra style props —
including at minimum `bg`, `border`, `borderRadius`, and `padding` — onto its
rendered element so that approve, reject, and other contexts are expressed
entirely by the consumer through style props. `FeedbackCard.Content` and
`FeedbackCard.Action` SHALL likewise forward Chakra style props onto their
elements.

#### Scenario: Root forwards visual style props

- **WHEN** a consumer passes `bg`, `border`, `borderRadius`, and `padding` to
  `FeedbackCard.Root`
- **THEN** the rendered root element reflects those styles

#### Scenario: Approve and reject contexts differ only by style props

- **WHEN** the same `FeedbackCard` composition is rendered once with
  approve-context style props and once with reject-context style props
- **THEN** both render identical structure and differ only in the visual styles
  supplied by the consumer

### Requirement: Consumer-provided content and action

The `FeedbackCard` pattern SHALL render no text and no button of its own.
`FeedbackCard.Content` SHALL render arbitrary consumer children (e.g. a title
and subtitle composed from existing Nimbus primitives). `FeedbackCard.Action`
SHALL render a consumer-provided actionable element (e.g. a Nimbus `Button`) and
SHALL handle positioning only, without altering the element's behavior.

#### Scenario: Action button remains fully functional

- **WHEN** a consumer places a Nimbus `Button` with an `onPress` handler inside
  `FeedbackCard.Action` and activates it
- **THEN** the button exposes its own accessible name and its `onPress` handler
  fires, unmodified by the pattern

### Requirement: Accessibility of the layout container

`FeedbackCard.Root` SHALL be a neutral layout container with no implicit ARIA
role, so that it does not falsely announce as an alert or live region. It SHALL
forward `role`, `aria-*`, and other accessibility props so a consumer can opt
into grouping semantics (e.g. `role="group"` with an `aria-label`). Because the
pattern introduces no interactive elements of its own, WCAG 2.1 AA compliance
SHALL rest on the consumer-provided action (a React Aria `Button`) and the
consumer-provided text content.

#### Scenario: No implicit role by default

- **WHEN** `FeedbackCard.Root` is rendered without accessibility props
- **THEN** the root element has no implicit `role` attribute

#### Scenario: Consumer can opt into grouping semantics

- **WHEN** a consumer passes `role="group"` and `aria-label` to
  `FeedbackCard.Root`
- **THEN** those attributes are forwarded onto the rendered root element

### Requirement: Package integration under the patterns/feedback category

The `FeedbackCard` pattern SHALL live at
`packages/nimbus/src/patterns/feedback/feedback-card/`, SHALL be exported
through a new `patterns/feedback` category barrel wired into
`patterns/index.ts`, and SHALL be reachable from the package public API
(`@commercetools/nimbus`). Its slot recipe SHALL be registered under the key
`nimbusFeedbackCard` in the theme slot-recipes index.

#### Scenario: Public import resolves

- **WHEN** a consumer imports `{ FeedbackCard }` from `@commercetools/nimbus`
- **THEN** the compound component resolves with its `Root`, `Content`, and
  `Action` parts

#### Scenario: Recipe is registered

- **WHEN** the theme is assembled
- **THEN** the `nimbusFeedbackCard` slot recipe is present in the slot-recipes
  registry and its generated typings are available
