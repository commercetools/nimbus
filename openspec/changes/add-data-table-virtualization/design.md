## Context

FEC-1141 (`add-virtualizer-component`, PR #2039) added an internal `Virtualizer`
with list, grid and table layouts. ListBox uses it through `isVirtualized`.
The FEC-1141 design names DataTable as the next collection to adopt the same
contract. It says DataTable's styling (sticky columns, recipe selectors for
`table`, `tr` and `td`) is FEC-1145 work (Decision 9).

Installed versions: `react-aria-components` 1.21.1, `react-stately` 3.50.0,
`react-aria` 3.52.1.

**What React Aria does when a table is virtualized** (read in source):

- **Element types.** Every table element renders as a `div`. Example from
  `Table.mjs:351-361`:
  `if (isVirtualized) return createElement(dom.div, …); return createElement(dom.table, …)`.
  Header, body, row and cell follow the same pattern.
- **Wrappers.** Each header, body, row and cell is wrapped in
  `<div role="presentation">`. The wrapper is positioned `absolute` (`sticky`
  for sticky items) and sets `contain: size layout style`
  (`react-aria/.../VirtualizerItem.mjs:49-73`). Cells are therefore no longer
  siblings, and they are no longer direct children of the row element.
- **Header.** The header is sticky (`react-stately/.../TableLayout.mjs:126`).
- **Columns.** Columns are virtualized horizontally. The layout keeps only
  sticky columns and row-header columns, and builds a row's cells only up to the
  visible width (`buildRow`, "if (x > this.requestedRect.maxX) … break").
- **Sticky columns.** `isStickyColumn()` returns `false`, with the comment
  "For subclasses" (`TableLayout.mjs:230-234`).
- **Scroll container.** The scroll container is the `ResizableTableContainer`'s
  `scrollRef` (`Table.mjs:557`). In DataTable that is the root element, which
  already has `overflow: auto` and `maxH`.

## Spike findings

A temporary story (`data-table.virtualizer-spike.stories.tsx`) rendered the real
DataTable with 1,000 rows. A temporary context in `data-table.table.tsx` turns
the Virtualizer on. Each story ran three ways:
- not virtualized (`...Plain`);
- virtualized with no changes;
- virtualized with candidate CSS and a sticky-column layout (`...Fixed`).

Each play function measured the DOM and logged it. The results were also checked
visually in Storybook. `pnpm test:storybook:dev`, headless Chromium, source
files. Both files stay in the draft PR so reviewers can reproduce the findings,
and are deleted when the implementation starts (task 1.1).

| Feature | Virtualized, no changes | Cause | Fix tried in the spike | Cost |
| --- | --- | --- | --- | --- |
| Rows in DOM | 9 of 1,000; `aria-rowcount="1001"` | — | — | — |
| Row and header size | Rows 0 px tall; header measured at 16 px (cells 1 px) | Recipe `height: "1px"` cell trick (`recipe.ts` cell and column) and rows that do not fill their wrapper | Rows fill the wrapper; cells `height: 100%` | Small |
| Row separators | Missing | The row's bottom border is covered by the cell wrappers | Border on the cells instead | Small |
| Vertical alignment | Content at the top of the cell | `div` cells have no `vertical-align` | Cells as a flex column, centered | Small |
| Row background (selected, custom `bg` on `DataTable.Row`) | Not visible behind most cells | Cells inherit from the React Aria wrapper, not the row | Wrappers inside a row inherit the background | Small |
| Sticky header | Stays at the top | — | — | — |
| Sorting | Works | — | — | — |
| Selection, after scrolling away and back | Works | — | — | — |
| Keyboard PageDown | Moves focus a page down and scrolls | — | — | — |
| Row click (`onRowAction`) | Does nothing | `row.tsx` stops its search where `element.parentElement === rowElement`; under a wrapper the cell itself counts as interactive | Stop at the cell element (not tried; three call sites) | Small |
| Frozen columns on the left (drag, selection, expand) | Removed from the DOM after scrolling sideways | Horizontal virtualization; `isStickyColumn` returns `false` | Layout subclass marks the built-in columns sticky; the body wrapper's inline `overflow: hidden` is overridden with `overflow: visible` | Medium |
| Frozen pin column (right edge) | Not rendered until scrolled into view; does not stick | `buildRow` does not build cells past the visible width; React Aria's sticky columns stick at their left offset | Not tried: needs an override of `buildRow` and of the wrapper's inline `left` | High |
| Nested content (`renderNestedContent`) | Renders; height correct after the size fix (88 px, plain 89 px) | React Aria's layout honours `colSpan` (`TableLayout.mjs:180-190`) | — | — |
| Pinned rows | Move to the top; outline shows | — | — | — |
| Drag and drop (keyboard) | Row moves three places down | — | — | — |
| Empty state | Shown | — | — | — |
| Footer | Rendered after the last row | — | — | — |
| Truncation, condensed density | Same cell width as plain | — | — | — |
| Compound API with custom rows and cells | Works; custom `bg` needs the background fix | — | — | — |

Not run in the spike, covered by the implementation's tests:
- `nestedKey` rows;
- column resizing in DataTable. React Aria resizing under the Virtualizer is
  proven by the `TableLayoutResizable` Virtualizer story;
- `keepResizedEdgeInView`, which queries `table` and `th`
  (`data-table.root.tsx:150-156`);
- the column divider rule `& tr th:last-of-type`;
- disabled rows;
- search highlighting.

## Goals / Non-Goals

**Goals:**

- `isVirtualized` and `virtualizerOptions` on DataTable, same contract as
  ListBox.
- With `isVirtualized`, the DataTable looks and behaves the same as without it,
  for every feature in the table above except the documented limitations.
- Compound API story with 1,000+ rows; timing results that show the difference.

**Non-Goals:**

- A frozen pin column at the right edge when virtualized (follow-up ticket).
- Exporting the `Virtualizer` (FEC-1141 Decision 10).
- Virtualizing tables without a bounded height differently from ListBox. The
  page scrolls, as in FEC-1141 Decision 11.
- Changing anything for tables without `isVirtualized`.

## Decisions

### Decision 1 — Props on the Root; the Table renders the Virtualizer

`isVirtualized` and `virtualizerOptions` are props of `DataTable.Root` (and
therefore `DataTable`).
- The Root keeps both props in the stable context and sets `data-virtualized`.
- `DataTable.Table` reads them and wraps its slot and React Aria `Table` in
  `<Virtualizer layout="table">`.
- The Root stays the scroll container, unchanged.

- **Alternative: the Root renders the Virtualizer.** Rejected: the Root's
  children include the Footer and the Manager. The Virtualizer only affects the
  collection inside it, but React Aria needs it to be an ancestor of `Table`
  only. Rendering it in the Table keeps it next to the element it serves, and
  custom compositions that render `DataTable.Table` get it automatically.
- **Alternative: consumers wrap the Table or Body** (the ticket's wording).
  Rejected for the reasons in FEC-1141 Decisions 2 and 10. Also, React Aria
  needs the Virtualizer around the whole `Table`.

### Decision 2 — Sticky built-in columns through a table layout subclass

The Nimbus `Virtualizer` table layout becomes a small subclass of React Aria's
`TableLayout`. It overrides only `isStickyColumn`, the method React Aria marks
"For subclasses".
- A column counts as sticky when its key is in an internal `stickyColumns` prop
  of the `Virtualizer`.
- A body cell counts as sticky when its column does. React Aria asks for columns
  and for cells (`buildColumn` and `buildCell`).
- DataTable passes the keys of its drag, selection and expand columns. The
  expand column gets a fixed id for this.
- Sticky items keep React Aria's `left` offset, which equals the column's
  position, so the frozen columns stick where they are.

The body wrapper that React Aria renders sets `overflow: hidden` inline. That
stops sticky cells from sticking (upstream
https://github.com/adobe/react-spectrum/issues/10518). The virtualized recipe
overrides it with `overflow: visible !important`.

- **Not what FEC-1141 Decision 4 rejected.** That decision rejected subclasses
  that read collection defaults through `LayoutOptionsDelegate` and had to call
  `super` to keep `columnWidths`. This subclass overrides only
  `isStickyColumn` and inherits everything else.
- **Alternative: no frozen columns when virtualized.** Rejected: the selection
  checkbox would scroll out of view in wide tables. The spike showed the fix is
  small.

### Decision 3 — Recipe rules keyed on `data-virtualized`

The recipe gets `&[data-virtualized]` rules on the root slot (FEC-1141
Decision 7):

- **Rows** fill their wrapper (`width`/`height: 100%`). Their bottom border
  moves to the cells.
- **Cells and column headers** use `height: 100%` instead of the `1px` trick,
  and center their content with a flex column.
- **Wrappers.** React Aria's wrappers inside a row inherit the row background,
  so selected, hovered and custom row backgrounds show behind every cell.
- **Body wrapper** gets `overflow: visible` (Decision 2).
- **Tag selectors.** Rules that select by tag (`& tr th:last-of-type`,
  `& th:has(...)`, row `_last`) get class or attribute equivalents that work in
  both modes.

The wrapper selectors depend on React Aria's DOM (`[role=presentation]`
children). Upstream has an open request for styling wrappers
(https://github.com/adobe/react-spectrum/issues/10719). Until it lands, stories
assert the result (row height, background, sticky offsets), so a React Aria
change that breaks them fails the tests.

### Decision 4 — Estimated row heights from recipe tokens, per density

The approach follows ListBox (`list-box/constants/virtualization.constants.ts`)
and FEC-1141 Decision 8.
- **Defaults.** `estimatedRowHeight` and `estimatedHeadingHeight` come from the
  cell padding and text line height tokens, separately for each `density`.
- **Measurement.** Rows are measured after render, and `shouldObserveItemSize`
  re-measures them.
- **Fixed heights.** A consumer can set `rowHeight` for uniform single-line
  content.
- **Test.** A story asserts the estimates match the rendered single-line row and
  header within 1 px.

### Decision 5 — Row activation finds the cell, not the parent

The three checks in `data-table.row.tsx` that stop at
`element.parentElement === rowElement` stop at the cell element instead
(`[role=gridcell], [role=rowheader]`, or the row itself). This works in both
modes. Existing row interaction stories cover the non-virtualized path.

### Decision 6 — Tests and timing

The test rules follow FEC-1141 Decision 14:
- fixed width and height on every story;
- `waitFor` instead of fixed timeouts;
- scroll assertions on `scrollTop` and `scrollHeight`;
- Chromatic snapshots off for large stories, one small `vrt` story.

A timing story records mount time and time to first paint for 1,000 and 10,000
rows, with and without virtualization. It is tagged `!test`, as in FEC-1141
Decision 12, and its results are written into this document.

## Risks / Trade-offs

- **[Recipe depends on React Aria's wrapper DOM]** → Stories assert the
  visible result. Upstream issues #10719 and #10518 are linked in the recipe
  comments.
- **[`!important` override of an inline style]** → Limited to the body
  wrapper's `overflow`. Without it, frozen columns do not stick.
- **[Pin column not frozen when virtualized]** → Documented limitation. Pinning
  rows still works. Follow-up ticket.
- **[Estimated heights shift the scrollbar]** → Estimates come from tokens; a
  story asserts single-line rows do not shift.
- **[Bundle size]** → The DataTable chunk adds the internal Virtualizer. Measure
  with `pnpm check:bundle-size` and record the result here.

## Migration Plan

The change is additive; no migration is needed. This change must be archived
after `add-virtualizer-component`, because it modifies `nimbus-virtualizer`.

## Open Questions

- Approve the limitations list in `proposal.md`, and the follow-up ticket for a
  frozen pin column.
