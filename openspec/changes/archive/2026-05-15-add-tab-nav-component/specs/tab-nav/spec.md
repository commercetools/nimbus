## ADDED Requirements

### Requirement: Namespace Structure

The component SHALL export as a compound component namespace.

#### Scenario: Component parts

- **WHEN** TabNav is imported
- **THEN** SHALL provide `TabNav.Root` as the navigation container
- **AND** SHALL provide `TabNav.Item` for individual navigation links
- **AND** `Root` SHALL be the first property in the namespace

#### Scenario: Basic usage

- **WHEN** consumer renders `<TabNav.Root>` with `<TabNav.Item>` children
- **THEN** SHALL render a `<nav>` landmark containing `<a>` elements
- **AND** SHALL apply tab-strip underline styling

### Requirement: Semantic HTML

The component SHALL use proper navigation semantics.

#### Scenario: Root element

- **WHEN** `TabNav.Root` is rendered
- **THEN** SHALL render a `<nav>` HTML element (navigation landmark)
- **AND** SHALL NOT use `role="tablist"` or any ARIA tab role

#### Scenario: Item element

- **WHEN** `TabNav.Item` is rendered
- **THEN** SHALL render an `<a>` HTML element
- **AND** SHALL NOT use `role="tab"` or any ARIA tab role

### Requirement: Active Item State

The component SHALL mark the active item with the correct ARIA attribute.

#### Scenario: Current item

- **WHEN** `TabNav.Item` is rendered with `isCurrent={true}`
- **THEN** SHALL set `aria-current="page"` on the `<a>` element
- **AND** SHALL apply the active visual style (primary underline indicator)

#### Scenario: Inactive items

- **WHEN** `TabNav.Item` is rendered without `isCurrent` or with `isCurrent={false}`
- **THEN** SHALL NOT set `aria-current` on the `<a>` element
- **AND** SHALL NOT use `aria-selected` anywhere in the component

### Requirement: Keyboard Navigation

The component SHALL use sequential Tab key navigation.

#### Scenario: Tab key advances focus

- **WHEN** a user presses Tab with focus on a `TabNav.Item`
- **THEN** SHALL move focus to the next focusable element (sequential)
- **AND** SHALL follow normal browser tab order

#### Scenario: Arrow keys do not move focus

- **WHEN** a user presses ArrowRight or ArrowLeft with focus on a `TabNav.Item`
- **THEN** SHALL NOT move focus to another `TabNav.Item`
- **AND** browser default behavior for links applies (no roving tabindex)

#### Scenario: No roving tabindex

- **WHEN** the component renders
- **THEN** SHALL NOT manage `tabIndex` programmatically on items
- **AND** all items SHALL be naturally focusable via Tab key

### Requirement: Visual Styling

The component SHALL visually match the Tabs `line` variant (horizontal underline style).

#### Scenario: Tabs variant (default)

- **WHEN** `variant="tabs"` is set or no variant is specified
- **THEN** SHALL render a bottom border line on the root container
- **AND** SHALL render an underline indicator on the active item
- **AND** Inactive items SHALL have a transparent underline indicator

#### Scenario: Hover state

- **WHEN** a user hovers over a `TabNav.Item`
- **THEN** SHALL change the item text color to `primary.11`

### Requirement: Props API

The component SHALL accept a documented set of props.

#### Scenario: TabNav.Root props

- **WHEN** `TabNav.Root` is rendered
- **THEN** SHALL accept `variant` prop (default: `"tabs"`)
- **AND** SHALL accept all Chakra style props
- **AND** SHALL accept `data-*` attributes

#### Scenario: TabNav.Item props

- **WHEN** `TabNav.Item` is rendered
- **THEN** SHALL accept required `href` string prop
- **AND** SHALL accept optional `isCurrent` boolean prop (default: `false`)
- **AND** SHALL accept `children` for label content
- **AND** SHALL accept all Chakra style props

### Requirement: React Aria Link Integration

`TabNav.Item` SHALL use `useLink` from `react-aria` for interaction handling,
consistent with the Nimbus `Link` component convention.

#### Scenario: useLink hook usage

- **WHEN** `TabNav.Item` is rendered
- **THEN** SHALL call `useLink` from `react-aria` with `elementType: "a"`
- **AND** SHALL merge `linkProps` via `mergeProps` onto the slot element
- **AND** SHALL use `useObjectRef` + `mergeRefs` for ref forwarding

#### Scenario: Event handler types

- **WHEN** consumer provides event handlers to `TabNav.Item`
- **THEN** `onFocus`, `onBlur`, and `onClick` SHALL be typed from `AriaLinkOptions`
- **AND** SHALL NOT expose raw HTML event handler types for those three props
