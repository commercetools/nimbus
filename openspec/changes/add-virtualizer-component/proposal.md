# Proposal: Add Virtualizer component

## Why

Nimbus collections render every item to the DOM. A ComboBox with 500 options is
slow, and lists of that size are real: the Merchant Center AI usage page loads
up to 500 projects and 500 organizations into a Nimbus `ComboBox`
(`use-organization-projects.ts`, `limit: 500`), and search-config loads up to
500 attribute definitions into one (`attributeDefinitions(limit: 500)`). 500 is
the commercetools API page maximum, and paging through results reaches the
10,000 maximum offset (docs.commercetools.com/api/limits). No consumer
virtualizes today (nimbus-pulse scan 33, all 35 Nimbus repositories).

React Aria's `Virtualizer` solves the rendering part, but it does not fit Nimbus
as-is:

- It removes CSS padding from the scroll container and positions items
  absolutely, so recipe `padding` and `gap` stop working.
- Its layouts take raw pixels and either fixed or estimated row sizes, while
  Nimbus row height depends on each collection's `size` variant, its content,
  and the user's text settings.
- Its option names change between versions: `ListLayout` deprecates `rowHeight`
  in favour of `rowSize`, while `TableLayout` still uses `rowHeight`.
- Wrapping a compound component in it requires knowing the component's inner
  structure (for example, where the list sits inside a ComboBox popover).

FEC-1141 asks for this building block. FEC-1145 (DataTable), FEC-1147 (ComboBox)
and FEC-1148 (Select) depend on it, and FEC-1140 (GridList) will use its grid
layout.

## Changes

- **Add an internal `Virtualizer` component** under
  `packages/nimbus/src/components/virtualizer/`. It is the virtualization engine
  for Nimbus collections and a Nimbus layer over React Aria's `Virtualizer`:
  - List, grid and table layouts with Nimbus-named `layoutOptions`. `gap` and
    `padding` accept spacing tokens or pixels. ListBox uses the list layout;
    GridList (FEC-1140) and DataTable (FEC-1145) will use the others.
  - Rows are measured after they render, and re-measured when their size
    changes, so rows never overlap or clip under browser zoom, text spacing
    overrides, larger fonts or wrapping labels.
  - It renders no DOM element, so it has no recipe and no slots.
- **Consumers turn virtualization on with a prop on the Nimbus collection**, the
  same pattern on every collection:
  `<ListBox.Root isVirtualized virtualizerOptions={…} />`. The collection
  renders the `Virtualizer` itself, supplies defaults for its `size` and
  `variant`, and owns its scroll container. ListBox gets these props in this
  change; ComboBox, Select, DataTable and GridList get them in their tickets.
- **Keep the `Virtualizer` internal for now.** Consumers only use Nimbus
  components, never React Aria directly. This change builds the component and
  uses it inside Nimbus, so `isVirtualized` is the only way to virtualize for
  now. The package exports one type, `VirtualizerListLayoutOptions`, which types
  `virtualizerOptions`. Exporting the `Virtualizer`, so consumers can compose it
  with Nimbus collections, is a later step (design Decision 10).
- **Stories and tests**: ListBox with 500 and 10,000 options, accessibility play
  tests, resilience stories (zoom, text spacing, long labels), internal grid and
  table stories, a timing story comparing virtualized and non-virtualized
  rendering, and a ComboBox-in-popover spike story that is not shipped.
- **Documentation**: virtualization sections in the ListBox docs
  (implementation with custom layout configuration, accessibility, guidelines,
  consumer test examples), with `isVirtualized` marked experimental.

Out of scope, each in its own ticket: styled GridList (FEC-1140), DataTable
virtualization (FEC-1145), ComboBox and Select virtualization (FEC-1147,
FEC-1148). They adopt the same `isVirtualized` / `virtualizerOptions` contract.

This replaces the ticket's acceptance line "Re-exports `Virtualizer`,
`ListLayout`, `TableLayout`, `GridLayout` from React Aria". The Virtualizer and
the React Aria layout classes stay internal.

## Capabilities

### New Capabilities

- `nimbus-virtualizer`: an internal virtualization component for Nimbus
  collections — list, grid and table layouts with Nimbus-named options and
  token support, measured row heights, and the `isVirtualized` /
  `virtualizerOptions` contract that Nimbus collections follow.

### Modified Capabilities

- `nimbus-list-box`: ListBox accepts `isVirtualized` and `virtualizerOptions`
  and renders correctly when virtualized. The spec lives in the not-yet-archived
  change `add-list-box-component`; the delta is written against it.

## Impact

- **New code**: `packages/nimbus/src/components/virtualizer/` (component, types,
  option mapping and merging, stories, unit tests).
- **Modified code**: `packages/nimbus/src/components/list-box/` (two new root
  props, the root renders the `Virtualizer` when virtualized, recipe gains
  virtualized styles, estimated-height defaults).
- **Public API**: new optional, experimental `ListBox.Root` props
  `isVirtualized` and `virtualizerOptions`, and the type
  `VirtualizerListLayoutOptions`. No breaking changes; non-virtualized
  ListBox behaviour is unchanged.
- **Dependencies**: none new. Uses `react-aria-components` 1.21.1 and
  `react-stately` 3.50.0, already installed.
- **Bundle size**: React Aria's virtualizer code is added to the Nimbus bundle:
  +2.8% dist, 62 KB minified in the chunk consumers load (see design).
