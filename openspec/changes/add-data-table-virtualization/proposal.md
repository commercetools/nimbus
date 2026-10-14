## Why

A DataTable with 1,000 rows puts 1,000 rows in the DOM. Each row also carries
cells, a checkbox and buttons. FEC-1145 asks for DataTable virtualization so that
large datasets render quickly. FEC-1141 built the internal `Virtualizer` and the
`isVirtualized` contract that DataTable now adopts (FEC-1141 design Decision 2:
`<DataTable isVirtualized />`).

## What Changes

- `DataTable` and `DataTable.Root` get two props:
  - `isVirtualized`: turns virtualization on.
  - `virtualizerOptions`: tunes it (`estimatedRowHeight`, `rowHeight`,
    `headingHeight`, `estimatedHeadingHeight`, `padding`).

  Both are marked experimental, like the ListBox props.
- When `isVirtualized` is set, `DataTable.Table` renders the internal
  `Virtualizer` with the table layout around the React Aria `Table`. Only the
  rows in view are in the DOM. The compound API (`DataTable.Root`, `.Table`,
  `.Header`, `.Body`, `.Row`, `.Cell`) works unchanged, because the prop sits on
  the Root.
- Estimated row and header heights follow the table's `size` (PR #2007), so
  single-line rows do not shift the scrollbar.
- The root element gets `data-virtualized`. The recipe uses this attribute to
  style the `div` elements React Aria renders in a virtualized table.
- The built-in columns on the left (drag, selection, expand) stay frozen while
  the table scrolls sideways. A Nimbus table layout keeps them in the DOM as
  sticky columns.
- Row click and Enter activation (`onRowAction`) work in both modes. Today the
  row handler expects a cell's parent element to be the row, and a virtualized
  row wraps each cell.
- The package exports the type `VirtualizerTableLayoutOptions`, which types
  `virtualizerOptions`. This was planned in FEC-1141 Decision 3.
- New stories with play functions, among them a compound story with 1,000+ rows,
  and a timing story comparing virtualized and non-virtualized rendering.
- New docs section in `data-table.dev.mdx`, notes in the a11y and guidelines
  docs, and a changeset.

**Replaces the ticket wording.** FEC-1145 says consumers wrap the body with
`Virtualizer(TableLayout)`. This change does not do that:

- The `Virtualizer` stays internal (FEC-1141 Decision 10).
- React Aria's `Table` reads the virtualizer context itself
  (`react-aria-components/dist/private/Table.mjs:398`, `:555`), so the Virtualizer
  has to wrap the whole `Table`, not the body.

The compound API still works with virtualization, which is what the acceptance
criterion asks for.

**Limitations when virtualized** (documented; follow-up ticket for the first):

- The pin column does not stay at the right edge while the table scrolls
  sideways. It scrolls with the other columns. Pinning rows still works.
- Browser find (Ctrl+F) cannot reach rows that are not rendered.
- Tests in JSDOM render every row.
- Row heights are estimated, then measured. The scrollbar corrects itself while
  rows are measured, also after the `size` changes at runtime.
- CSS written against table elements (`tr`, `td`, `:last-of-type`, sibling
  combinators between cells) does not apply, because React Aria renders `div`
  elements and wraps each row and cell.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-data-table`: adds opt-in virtualization (`isVirtualized`,
  `virtualizerOptions`, `data-virtualized`), the features that keep working when
  virtualized, and the documented limitations. It replaces the aspirational
  "Performance Optimization" and "Optimized Rendering" requirements, which
  virtualize automatically, with testable ones.
- `nimbus-virtualizer` (introduced by `add-virtualizer-component`, so it must be
  archived first):
  - also exports `VirtualizerTableLayoutOptions`;
  - its table layout keeps the columns a collection marks as sticky.

## Impact

- **Code:** `packages/nimbus/src/components/data-table/`
  - `data-table.types.ts`
  - `components/data-table.root.tsx`, `data-table.table.tsx`, `data-table.row.tsx`
  - `data-table.recipe.ts`
  - new `constants/`
  - stories, docs, docs spec
- **Code:** `packages/nimbus/src/components/virtualizer/`
  - table layout with sticky columns
  - type export
- **Public API:** additive. New optional props on `DataTable` and
  `DataTable.Root`, and one new type export. Nothing changes without
  `isVirtualized`.
- **Bundle:** the DataTable chunk imports the internal `Virtualizer`. Measure it
  with `pnpm check:bundle-size`.
- **Depends on, in merge order:**
  1. `data-table-size` (PR #2007): adds `size` (`sm` | `md` | `lg` | `xl`,
     default `xl`) and deprecates `density`. It merges to `main` first.
     Virtualized row heights, the header and the frozen column widths all depend
     on it.
  2. `add-virtualizer-component` (PR #2039). This branch is stacked on it.

  After #2007 is on `main`, #2039 is rebased onto `main` (it changes no
  DataTable file), and this branch is rebased onto #2039. Implementation starts
  on that base, because it changes the same DataTable files as #2007.
