## ADDED Requirements

### Requirement: Virtualization Support

`ListBox.Root` SHALL accept `isVirtualized` and `virtualizerOptions`, following
the Nimbus collection virtualization contract. When `isVirtualized` is set, it
SHALL render the list virtually with defaults for its `size` and `variant`.

#### Scenario: Turning virtualization on

- **WHEN** a consumer renders `<ListBox.Root isVirtualized items={items}>` with
  10,000 items
- **THEN** only the visible options SHALL be in the DOM

#### Scenario: Default estimated heights per size

- **WHEN** a virtualized `ListBox.Root` with `size="sm"` or `size="md"` has no
  `virtualizerOptions`
- **THEN** the layout SHALL use estimated row, section header and loader heights
  derived from the ListBox recipe tokens for that size
- **AND** every rendered row SHALL take its measured height

#### Scenario: Estimate matches a single-line row

- **WHEN** a single-line, single-select item renders at the default browser
  settings
- **THEN** its measured height SHALL be within 1px of the default estimate for
  its size

#### Scenario: Custom options

- **WHEN** a consumer passes `virtualizerOptions={{ estimatedRowHeight: 56 }}`
- **THEN** that value SHALL replace the ListBox default

#### Scenario: Long labels wrap

- **WHEN** a virtualized ListBox has items whose labels wrap to several lines
- **THEN** items SHALL NOT overlap and no label text SHALL be clipped

#### Scenario: Items with a description

- **WHEN** virtualized items render a label and a description
- **THEN** items SHALL NOT overlap and no text SHALL be clipped

#### Scenario: Spacing preserved

- **WHEN** a ListBox is virtualized
- **THEN** the space between items and around the list SHALL match the
  non-virtualized ListBox of the same `variant` and `size`

#### Scenario: Focus ring visible

- **WHEN** a virtualized item receives keyboard focus, including the first and
  the last item
- **THEN** its focus ring SHALL be fully visible and not clipped by the scroll
  container

#### Scenario: Card variant scrolls

- **WHEN** a virtualized ListBox uses `variant="card"`
- **THEN** the ListBox root SHALL be the scroll container with a bounded height

#### Scenario: Plain variant scrolls with its parent

- **WHEN** a virtualized ListBox uses `variant="plain"` inside a scrolling
  parent such as `ScrollArea`
- **THEN** the parent SHALL scroll and only the visible items SHALL render

#### Scenario: Positions inside sections

- **WHEN** a virtualized ListBox groups options in sections
- **THEN** each rendered option SHALL expose `aria-posinset` and `aria-setsize`
  as React Aria computes them, and the documentation SHALL state whether the
  size counts the section or the whole list

#### Scenario: Not virtualized

- **WHEN** a ListBox is rendered without `isVirtualized`
- **THEN** its rendering and styles SHALL be unchanged
