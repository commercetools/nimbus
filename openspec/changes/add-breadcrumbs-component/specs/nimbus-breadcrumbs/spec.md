## ADDED Requirements

### Requirement: Namespace Structure

The component SHALL export as a compound component namespace built on React Aria
Components' `Breadcrumbs` and `Breadcrumb` primitives.

#### Scenario: Component parts

- **WHEN** Breadcrumbs is imported
- **THEN** SHALL provide `Breadcrumbs.Root` as the navigation container
- **AND** SHALL provide `Breadcrumbs.Item` for individual breadcrumb entries
- **AND** `Root` SHALL be the first property in the namespace

#### Scenario: Basic compound usage

- **WHEN** consumer renders `<Breadcrumbs.Root>` with `<Breadcrumbs.Item>` children
- **THEN** SHALL render a `<nav>` landmark containing an ordered list of items
- **AND** SHALL render each non-current item as a navigable link

### Requirement: React Aria Foundation

The component SHALL be built on React Aria Components' `Breadcrumbs`/`Breadcrumb`
primitives, per Nimbus architecture decisions.

#### Scenario: Uses RAC primitives

- **WHEN** the component is implemented
- **THEN** `Breadcrumbs.Root` SHALL render via RAC `Breadcrumbs`
- **AND** `Breadcrumbs.Item` SHALL render via RAC `Breadcrumb` composing a RAC `Link`
- **AND** current-item and disabled handling SHALL be delegated to the RAC primitives

#### Scenario: React Aria import convention

- **WHEN** React Aria Components are imported
- **THEN** imports SHALL use the `Ra` prefix alias convention (e.g. `RaBreadcrumbs`, `RaLink`)

### Requirement: Semantic HTML

The component SHALL use proper navigation and list semantics that survive
`list-style: none` styling in all supported browsers.

#### Scenario: Landmark and list structure

- **WHEN** `Breadcrumbs.Root` is rendered
- **THEN** SHALL render a `<nav>` landmark element
- **AND** SHALL render an ordered list (`<ol>`) of breadcrumb items
- **AND** each item SHALL be a list item (`<li>`)

#### Scenario: List role preserved under list-style none

- **WHEN** the ordered list is styled with `list-style: none`
- **THEN** the list SHALL still expose list semantics to assistive technology (an explicit `role="list"` SHALL be applied if the underlying primitive does not already guarantee it in WebKit)

### Requirement: Accessible Labeling

The navigation landmark SHALL be identifiable to assistive technology.

#### Scenario: Consumer-supplied label

- **WHEN** consumer passes `aria-label` to `Breadcrumbs.Root`
- **THEN** SHALL apply it to the `<nav>` landmark

#### Scenario: Missing label guidance

- **WHEN** `Breadcrumbs.Root` is rendered without an `aria-label`
- **THEN** the component SHALL emit a development-time warning advising a label
- **AND** SHALL NOT ship a hardcoded untranslated default label

### Requirement: Automatic Current Page

The last breadcrumb SHALL represent the current page automatically. The component
SHALL NOT expose a per-item `isCurrent` prop.

#### Scenario: Last item is current

- **WHEN** a breadcrumb trail is rendered
- **THEN** the final item SHALL carry `aria-current="page"`
- **AND** SHALL render as non-interactive (not a navigable link)
- **AND** SHALL be removed from the tab sequence

#### Scenario: Non-final items are links

- **WHEN** a breadcrumb trail is rendered
- **THEN** every item except the last SHALL render as a focusable link pointing to its `href`
- **AND** SHALL NOT carry `aria-current`

#### Scenario: No isCurrent prop

- **WHEN** consumer inspects the public API of `Breadcrumbs.Item`
- **THEN** there SHALL be no `isCurrent` prop
- **AND** currentness SHALL be derived solely from position (last item)

#### Scenario: Single item trail

- **WHEN** a trail contains exactly one item
- **THEN** that item SHALL be treated as current (non-interactive, `aria-current="page"`)

### Requirement: Declarative Items API

The component SHALL support a declarative, data-driven authoring API in addition
to the compound children API.

#### Scenario: Items with render function

- **WHEN** consumer passes an `items` array and a render function to `Breadcrumbs.Root`
- **THEN** SHALL render one breadcrumb per item in order
- **AND** SHALL apply the same automatic last-is-current semantics as the compound API

#### Scenario: Empty items

- **WHEN** `items` is an empty array (or no children are provided)
- **THEN** SHALL render the `<nav>`/`<ol>` structure with no breadcrumb items and SHALL NOT throw

### Requirement: Disabled Items

Individual non-current items SHALL be disable-able.

#### Scenario: Disabled item is non-interactive

- **WHEN** an item is rendered with `isDisabled`
- **THEN** SHALL expose `aria-disabled="true"`
- **AND** SHALL NOT expose an `href`
- **AND** SHALL be removed from the tab sequence

### Requirement: Configurable Separator

The component SHALL render a decorative separator between items, configurable on
the root.

#### Scenario: Default separator

- **WHEN** `Breadcrumbs.Root` is rendered without a `separator` prop
- **THEN** SHALL render `›` between adjacent items
- **AND** SHALL NOT render a leading separator before the first item

#### Scenario: Custom separator

- **WHEN** consumer passes a `separator` node to `Breadcrumbs.Root`
- **THEN** SHALL render that node between adjacent items

#### Scenario: Separator is decorative

- **WHEN** any separator is rendered
- **THEN** SHALL be hidden from assistive technology via `aria-hidden="true"`

### Requirement: Sizing

The component SHALL support size variants driven by the recipe.

#### Scenario: Size variants

- **WHEN** `Breadcrumbs.Root` is rendered with `size="sm"` or `size="md"`
- **THEN** SHALL apply the corresponding font-size and gap from the recipe
- **AND** `md` SHALL be the default when `size` is omitted

### Requirement: Link Navigation Props

Item links SHALL support standard anchor navigation and client-router integration.

#### Scenario: Anchor attributes

- **WHEN** an item is rendered with `href`, `target`, and/or `rel`
- **THEN** SHALL forward them to the rendered link

#### Scenario: Router integration

- **WHEN** consumer provides `routerOptions` on an item and/or `onAction` on the root
- **THEN** SHALL forward `routerOptions` to the underlying React Aria link
- **AND** SHALL invoke `onAction` with the activated item's key on press

### Requirement: WCAG 2.1 AA Keyboard Access

The component SHALL be fully operable by keyboard.

#### Scenario: Tab traverses links in order

- **WHEN** the user presses Tab repeatedly
- **THEN** focus SHALL move through the non-current, non-disabled links in document order

#### Scenario: Current and disabled items skipped

- **WHEN** the user tabs through the trail
- **THEN** the current (last) item SHALL NOT receive focus
- **AND** any disabled item SHALL NOT receive focus
