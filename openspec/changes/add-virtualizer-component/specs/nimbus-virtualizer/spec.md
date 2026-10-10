# Virtualizer

## Overview

`Virtualizer` is an internal component that renders only the visible items of a
Nimbus collection. Nimbus collections render it themselves when a consumer sets
`isVirtualized`; consumers never use it directly. It is a Nimbus layer over
React Aria's `Virtualizer`: it takes Nimbus option names and spacing tokens, and
hides React Aria's layout classes.

## Purpose

Keep large collections fast with one prop on the collection, without consumers
learning React Aria's layout classes, their changing option names, or the style
workarounds virtualization needs.

## ADDED Requirements

### Requirement: Collection Virtualization Contract

Every Nimbus collection that supports virtualization SHALL expose the same two
optional props on its root: `isVirtualized` (boolean, default `false`) and
`virtualizerOptions` (layout options for the collection's layout). The
collection SHALL render the `Virtualizer` itself, supply its own default layout
options, and own its scroll container.

#### Scenario: Turning virtualization on

- **WHEN** a consumer sets `isVirtualized` on a supporting collection root
- **THEN** the collection SHALL render only visible items
- **AND** the consumer SHALL NOT need to import or place any other component

#### Scenario: Consumer options override collection defaults

- **WHEN** the collection's default is `estimatedRowHeight: 38` and the consumer
  passes `virtualizerOptions={{ estimatedRowHeight: 56 }}`
- **THEN** unrendered rows SHALL count as 56px

#### Scenario: Options without virtualization

- **WHEN** a consumer passes `virtualizerOptions` without `isVirtualized`
- **THEN** the collection SHALL NOT be virtualized
- **AND** a development warning SHALL explain that `isVirtualized` is missing

### Requirement: Layouts

The component SHALL support list, grid and table layouts through a `layout` prop
that defaults to `"list"`, so that ListBox, GridList and DataTable use the same
contract. The layouts SHALL keep the options React Aria Components derives from
context.

#### Scenario: Default layout

- **WHEN** a `Virtualizer` is rendered without a `layout` prop
- **THEN** it SHALL lay items out in a single vertical list

#### Scenario: Grid layout

- **WHEN** the grid layout wraps a grid collection
- **THEN** it SHALL lay items out in rows and columns and render only visible
  cells

#### Scenario: Grid layout in a right-to-left locale

- **WHEN** the grid layout is used in a right-to-left locale
- **THEN** item order and drop target positions SHALL follow the locale
  direction

#### Scenario: Table layout

- **WHEN** the table layout wraps a table collection
- **THEN** it SHALL lay out header and body rows and render only visible body
  rows

#### Scenario: Table column resizing

- **WHEN** the table layout wraps a table inside a resizable table container and
  the user resizes a column
- **THEN** the virtualized cells SHALL use the new column width

### Requirement: Typed List Layout Options

The list layout options SHALL use Nimbus option names: `rowHeight`,
`estimatedRowHeight`, `headingHeight`, `estimatedHeadingHeight`, `loaderHeight`,
`gap` and `padding`. The same type SHALL be used for the `Virtualizer`'s
`layoutOptions` and for list collections' `virtualizerOptions`, and SHALL be
exported as `VirtualizerListLayoutOptions`.

#### Scenario: Unknown option

- **WHEN** a consumer passes an option that the list layout does not support,
  such as `maxColumns`
- **THEN** TypeScript SHALL report a type error

### Requirement: Option Mapping

The component SHALL translate Nimbus option names to the option names of the
installed React Aria layout, so that a React Aria rename does not change the
Nimbus API.

#### Scenario: Fixed row height

- **WHEN** `rowHeight` is `36`
- **THEN** every row SHALL be 36px tall and SHALL NOT be measured

#### Scenario: Estimated row height

- **WHEN** `estimatedRowHeight` is `36` and no `rowHeight` is set
- **THEN** rows that are not yet rendered SHALL count as 36px for the scroll
  size
- **AND** each rendered row SHALL take its measured height

### Requirement: Spacing Tokens

`gap` and `padding` SHALL accept a Nimbus spacing token or a number of pixels.

#### Scenario: Token value

- **WHEN** `gap` is `"100"`
- **THEN** the space between rows SHALL equal the pixel value of spacing token
  `100`

#### Scenario: Pixel value

- **WHEN** `padding` is `8`
- **THEN** the list SHALL have 8px of space before the first and after the last
  row

### Requirement: Measured Row Heights

Unless a fixed `rowHeight` is set, the component SHALL measure each rendered row
and SHALL measure it again when its size changes, so that rows never overlap or
clip.

#### Scenario: No height options

- **WHEN** a `Virtualizer` is rendered without height options
- **THEN** rows SHALL be estimated and measured

#### Scenario: Browser zoom

- **WHEN** the page is zoomed to 200%
- **THEN** rows SHALL NOT overlap and no row content SHALL be clipped

#### Scenario: Text spacing override (WCAG 1.4.12)

- **WHEN** a user style sets line height to 1.5 times the font size, letter
  spacing to 0.12 times, and word spacing to 0.16 times
- **THEN** rows SHALL NOT overlap and no row content SHALL be clipped

#### Scenario: Size change after render

- **WHEN** a rendered row grows after its first measurement, for example because
  a user style is applied later
- **THEN** the row SHALL be measured again and the rows below it SHALL move

#### Scenario: Container width change

- **WHEN** the container becomes narrower and labels wrap to more lines
- **THEN** rows SHALL be measured again and SHALL NOT overlap

### Requirement: Scroll Container

The component SHALL render only the items that intersect both the collection's
scroll area and the browser window. A collection with a bounded height SHALL
scroll itself; a collection without one SHALL grow to its full height and scroll
with its scrolling parent or the page.

#### Scenario: Bounded height

- **WHEN** the collection root has a maximum height and more items than fit
- **THEN** the collection root SHALL scroll and only visible items SHALL render

#### Scenario: No bounded height

- **WHEN** a collection with 10,000 items has no element that bounds its height
- **THEN** the collection SHALL grow to the full height of all items
- **AND** only the items inside the browser window SHALL be in the DOM

#### Scenario: Documentation shows a bounded height first

- **WHEN** the documentation shows how to virtualize a collection
- **THEN** the first example SHALL bound the collection's height
- **AND** the documentation SHALL explain that an unbounded collection scrolls
  with its parent or the page

### Requirement: Rendering Only Visible Items

The component SHALL render to the DOM only the items inside the visible area
plus a small overscan, and SHALL size the scroll content for the full
collection.

#### Scenario: Large collection

- **WHEN** a collection of 10,000 items is virtualized in a container that shows
  about 10 rows
- **THEN** fewer than 100 items SHALL be in the DOM
- **AND** the scroll height SHALL account for all 10,000 items

#### Scenario: Scrolling

- **WHEN** the user scrolls to the middle of the collection
- **THEN** the items at that position SHALL be rendered

### Requirement: No Rendered Element

The component SHALL NOT render a DOM element of its own. The collection SHALL
remain the scroll container.

#### Scenario: DOM structure

- **WHEN** a collection is virtualized
- **THEN** the collection's root element SHALL be the outermost element in the
  DOM output

### Requirement: Accessibility Preserved

Virtualization SHALL NOT change the accessibility semantics or keyboard
behaviour of the collection, including for items that are not rendered.

#### Scenario: Keyboard navigation to an unrendered item

- **WHEN** focus is on the first item of a 10,000-item collection and the user
  presses End
- **THEN** focus SHALL move to the last item
- **AND** the last item SHALL be rendered and scrolled into view

#### Scenario: Page navigation

- **WHEN** the user presses PageDown or PageUp
- **THEN** focus SHALL move by about one visible page
- **AND** the focused item SHALL be rendered and scrolled into view

#### Scenario: Typeahead to an unrendered item

- **WHEN** the user types the start of a label that belongs to an item that is
  not rendered
- **THEN** focus SHALL move to that item
- **AND** the item SHALL be rendered and scrolled into view

#### Scenario: Focused item scrolled out of view

- **WHEN** an item has focus and the user scrolls it out of view with the mouse
  wheel
- **THEN** the focused item SHALL stay in the DOM
- **AND** `document.activeElement` SHALL stay on that item
- **AND** ArrowDown SHALL move focus to the next item

#### Scenario: Position and size for assistive technology

- **WHEN** a list is virtualized
- **THEN** each rendered option SHALL have `aria-posinset` equal to its position
  and `aria-setsize` equal to the total number of options

#### Scenario: Table row count

- **WHEN** a table with 10,000 body rows and one header row is virtualized with
  the table layout
- **THEN** the table SHALL have `aria-rowcount` 10001
- **AND** each rendered row SHALL have the matching `aria-rowindex`

#### Scenario: Selection of an off-screen item

- **WHEN** an item is selected and then scrolled out of view
- **THEN** it SHALL stay selected when it is rendered again

#### Scenario: Loading more items

- **WHEN** the collection shows its loader row while more items load
- **THEN** assistive technology SHALL be able to tell that the collection is
  loading

#### Scenario: Finding off-screen items

- **WHEN** the documentation describes when to virtualize
- **THEN** it SHALL state that browser find cannot reach items that are not
  rendered
- **AND** it SHALL recommend a search or filter field for long collections

### Requirement: Internal Component

The `Virtualizer` component SHALL NOT be exported from `@commercetools/nimbus`.
Consumers SHALL virtualize only through a Nimbus collection's `isVirtualized`
prop. Of the Virtualizer's types, only `VirtualizerListLayoutOptions` SHALL be
exported.

#### Scenario: Component is not exported

- **WHEN** a consumer imports from `@commercetools/nimbus`
- **THEN** `Virtualizer`, its props type, its helpers, and React Aria's
  `ListLayout`, `GridLayout` and `TableLayout` SHALL NOT be exported

#### Scenario: Options type is exported

- **WHEN** a consumer imports the type `VirtualizerListLayoutOptions` from
  `@commercetools/nimbus`
- **THEN** the import SHALL resolve and SHALL type `virtualizerOptions`

#### Scenario: Documentation status

- **WHEN** a collection documents `isVirtualized`
- **THEN** it SHALL mark the prop as experimental
- **AND** no documentation page SHALL describe the `Virtualizer` component
  itself
