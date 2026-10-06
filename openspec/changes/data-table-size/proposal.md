## Why

Teams need denser DataTables to show more data on one screen. Today
DataTable offers only `density: "default" | "condensed"`, and `condensed`
changes vertical cell padding only (16px to 12px), while horizontal padding
stays 24px. `Table` already uses a `size` prop (`sm` | `md` | `lg`), so
Nimbus has two different ways to express table spacing, with values that
match nowhere.

We want one axis, `size`, on both table components, with the same names
meaning the same values. Now is the right time: nimbus-pulse scan 27
(6 October 2026) finds only two DataTable usages that pass `density`, both
`"condensed"` (`commerce-agents` and `search-config`), so the migration cost is
small. Nobody uses `DataTable.Manager`, `onSettingsChange` or `customSettings`.

Evidence from scan 20:

- 4 of 10 DataTables set `textStyle="sm"` on `<Text>` inside cell renderers
  by hand, because DataTable cells set no text style and inherit the host
  app's font size.
- `Table` sets `size` in 6 of 20 instances: `sm` five times, `lg` once, `md`
  never explicitly.

## What Changes

- Add a `size` prop to DataTable: `"sm" | "md" | "lg" | "xl"`.
  - `sm`, `md`, `lg` use exactly the values of `Table`'s sizes (cell
    padding and text style).
  - `xl` reproduces today's DataTable appearance (24/16px cell padding,
    fixed-height header) and is the **default**, so no existing DataTable
    changes its cell padding, header height or text.
  - `xl` is **deprecated from the start**: it exists only to keep today's
    look as the default. Consumers are told not to choose it (JSDoc, left
    out of documented sizes, development warning when passed explicitly).
- The internal columns (drag, selection, expand, pin) scale with the size:
  their controls stay 24×24px, and the padding around them follows the cell
  padding of the chosen size.
- The header follows the size: `sm`–`lg` use the same padding as the cells;
  `xl` keeps today's fixed 40px header.
- Deprecate `density`. It keeps working unchanged until the next major
  release. The deprecation note points to `size`, which sets the default text size and the density.
- `Table` is **not** changed. It does not get `xl`.
- The layout settings panel replaces its "Row density" toggle with a "Row
  density" select that sets the size. Each option has an icon and a label:
  Spacious (`xl`, `HorizontalRule`), Comfortable (`lg`, `DensityLarge`),
  Standard (`md`, `DensityMedium`) and Compact (`sm`, `DensitySmall`). The
  select is not clearable, and the text visibility control is a plain
  `ToggleButtonGroup`. Both controls are 32px tall.
  - A table that has had `xl` as its size at any render (no `size`, or
    `size="xl"`) offers `xl`, `lg`, `md` and `sm`, and keeps offering `xl`
    after another size is picked. A table that has always had `sm`, `md` or
    `lg` offers only `lg`, `md` and `sm`.
  - `onSettingsChange` receives the action `"changeSize"` and the chosen
    `DataTableSize` as a second argument. The `"toggleRowDensity"` action is no
    longer sent.
  - The labels reuse the existing Comfortable and Compact messages (which
    already have translations). Spacious and Standard are new and have
    placeholder translations until Transifex provides the final ones.
- Passing `density` logs a development warning (once per mount) that it is
  deprecated.
- Two cell alignment fixes apply to every table, with or without `size`
  (`.changeset/data-table-cell-bottom-gap.md`): body cell text is centered
  between the top and bottom padding (rows are about 6px shorter), and the
  expand arrow is centered in its cell (about 2px lower).

One accepted break: `UPDATE_ACTIONS.TOGGLE_ROW_DENSITY` is removed from the
public `UPDATE_ACTIONS` constant and replaced by `CHANGE_SIZE`. A consumer that
references it gets a compile error; a consumer that only compares against the
string `"toggleRowDensity"` stops receiving it. The changeset says so. Removing
`density` and moving the default away from `xl` are planned for a later major
release and are not part of this change.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `nimbus-data-table`: the "Display Density" requirement is replaced by a
  "Display Size" requirement; the "Multi-Slot Recipe" requirement refers to
  size variants instead of density variants; new requirements cover the
  deprecated `density` prop and internal column scaling.

## Impact

- **Code**: `packages/nimbus/src/components/data-table/` — recipe (size
  variants, header, sticky offsets, CSS variables), types (`size`,
  `onSettingsChange`, deprecation JSDoc), root (default size, warnings, the
  `hasBeenXl` flag), header (internal column widths), `utils/sizes.utils.ts`
  (size maps), `constants.ts` (`CHANGE_SIZE`), layout settings panel, i18n
  messages, row (cell alignment).
- **Public API**: additive `size` prop; `density` deprecated;
  `onSettingsChange` gets a second argument; `UPDATE_ACTIONS.TOGGLE_ROW_DENSITY`
  replaced by `CHANGE_SIZE`.
- **Visual**: none for the default cell padding, header height and text.
  The two cell alignment fixes change the height of rows and the position of
  the expand arrow in every table, so existing Chromatic stories with rows show
  diffs.
- **Docs**: `data-table.dev.mdx`, `data-table.mdx`, stories (about 89
  mentions of `density`/`condensed` to review).
- **Sequencing**: based on `main`, which already contains PR #1996 (row
  identity), PR #2015 (FEC-1346) and PR #2026 (FEC-1347, recipe cleanup).
- **Consumers**: scan 27 shows two usages that pass `density`; they keep
  working and should move to `size` before the next major release. Handlers of
  `onSettingsChange` must handle `"changeSize"` (no known usage). Teams that
  set `textStyle="sm"` in cells can remove it once they choose `sm`–`lg`.
