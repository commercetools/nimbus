## Context

See proposal.md → Why for the motivation. Paths below are relative to
`packages/nimbus/src/components/data-table/`.

Current state that shapes the approach:

- **Cell padding** is fixed in the `cell` slot (`data-table.recipe.ts`,
  `paddingTop/Bottom: "400"`, `paddingLeft/Right: "600"`). The `density` variant
  repeats or overrides only the vertical padding (`default`: 400, `condensed`:
  300).
- **Header** has a fixed `height: "1000"` (40px), `textStyle: "sm"` overridden
  by `fontSize: "300"` (so the header text is 12px, not 14px), and column
  containers with `py: "100"` / `px: "600"`. The recipe has one `header` slot
  (FEC-1347 merged the duplicate header blocks).
- **Cells set no text style.** `theme/global-css.ts` sets no font size either,
  so cell text follows the host app.
- **Internal column widths** are hardcoded numbers in
  `components/data-table.header.tsx` (drag 24, selection 72, expand 24 or 72,
  pin 72). The sticky offsets in the recipe repeat them as tokens (`left: "600"`
  = 24px, `"1800"` = 72px, `"2400"` = 96px), synchronized by hand.
- React Aria `Column` width props "accept pixels, percentages, or fractional
  values (the fr unit)" (React Aria Table docs, "Column resizing"). CSS
  variables cannot be passed there, so widths must be numbers in JavaScript.
- The row controls are `IconButton size="2xs"` (24px) and the header icons use
  `boxSize="400"`.

## Goals / Non-Goals

**Goals:**

- One `size` axis whose `sm`/`md`/`lg` values are identical to `Table`.
- No change to cell padding, header height or text for tables that do not pass
  `size`. (The two cell alignment fixes in Decision 6 do change row height.)
- Internal column widths that React Aria (JavaScript numbers) and the sticky
  offsets (CSS) compute with the same formula from the same horizontal padding.

**Non-Goals:**

- Changing `Table`.
- Scaling the interactive controls themselves. They stay 24px at every size
  (WCAG 2.5.8 minimum).
- Removing `density` or changing the default away from `xl` (next major).

## Decisions

### 1. `size` is a recipe variant; `xl` holds today's values

`size` becomes a variant of the DataTable slot recipe with
`defaultVariants: { size: "xl" }`. Each size owns its padding, header and text
values completely; the base styles hold no size values:

| Size | Cell px / py  | Header                                                       | Text (cell + header)    |
| ---- | ------------- | ------------------------------------------------------------ | ----------------------- |
| `sm` | `200` / `200` | padding as cells, no fixed height                            | `sm`                    |
| `md` | `300` / `300` | padding as cells, no fixed height                            | `sm`                    |
| `lg` | `400` / `300` | padding as cells, no fixed height                            | `md`                    |
| `xl` | `600` / `400` | today: `height: "1000"`, container `py: "100"` / `px: "600"` | header `fontSize: "300"`, cell unset |

Each size sets its padding as CSS variables on the root slot:
`--data-table-padding-x` (cells and column headers), `--data-table-cell-padding-y`
and `--data-table-header-padding-y`. The base styles read each variable, so the
padding rules are written once and every size, `xl` included, is a short entry
of values.

The text style is set on the cell and header slots, not on the root. The root
also contains the footer and pagination, which must not change.

_Alternative considered_: pass `size` down to Nimbus `Table`. Rejected:
DataTable is built directly on React Aria, not on `Table`, and sharing a recipe
would force DataTable's many extra slots onto `Table`.

_Alternative considered_: copy the Table values by referencing
`table.recipe.ts`. Rejected for now: the recipes are separate and the values are
four tokens each. A comment in both recipes points to the other so the values
stay aligned.

### 2. `density` keeps working through a compound variant

The `density` variant stays, but the `condensed` padding becomes a compound
variant `{ size: "xl", density: "condensed" }` → `--data-table-cell-padding-y: 300`. The root passes
`density` to the recipe only when the consumer did not pass `size`. So:

- no `size`, `density="condensed"` → today's condensed look
- explicit `size` + `density` → `size` wins, `density` ignored, one development
  warning
- `density` alone → works as before, with one development warning that it is
  deprecated

_Alternative considered_: map `condensed` to a size. Rejected: `condensed`
changes vertical padding only and matches no size (24/12px).

### 3. Deprecated `xl` default

The root destructures `size` without a default and resolves `size ?? "xl"`. That
makes an explicit `xl` detectable: when `size === "xl"` is passed, a
`process.env.NODE_ENV !== "production"` check logs one warning per mount,
following the pattern in `breadcrumbs.root.tsx` and `splitter.root.tsx`.
TypeScript cannot mark one literal of a union deprecated, so the JSDoc on `size`
states it, and stories and docs list only `sm`/`md`/`lg`.

### 4. Internal column widths from one formula

`utils/sizes.utils.ts` maps each size to its horizontal cell padding
(`DATA_TABLE_CELL_PADDING_X`) and to the internal column widths:

```ts
// width = 24 (control) + 2 × horizontal cell padding
DATA_TABLE_INTERNAL_COLUMN_WIDTHS = {
  sm: { padded: 40, bare: 24 },
  md: { padded: 48, bare: 24 },
  lg: { padded: 56, bare: 24 },
  xl: { padded: 72, bare: 24 },
};
```

- `data-table.header.tsx` reads it for `minWidth`/`maxWidth` (replacing the
  hardcoded 24/72).
- The recipe computes the same widths in CSS on the root slot, from the same
  formula: `--data-table-drag-column-width` is `{sizes.600}` (24px), and
  `--data-table-selection-column-width` is
  `calc({sizes.600} + 2 * var(--data-table-padding-x))`.
- The recipe's sticky offsets use those variables
  (`left: var(--data-table-drag-column-width)`, `calc(...)` for the sum) instead
  of `"600"`, `"1800"` and `"2400"`.
- A unit test checks that each size's `--data-table-padding-x` token resolves to
  the px value in `DATA_TABLE_CELL_PADDING_X`, so both widths use the same
  padding. The 24px control size is in both places too: `{sizes.600}` in the
  recipe, `DATA_TABLE_CONTROL_SIZE` in TSX.

_Alternative considered_: repeat the widths per size in the recipe by hand. Rejected: it
keeps two copies (TSX and CSS) that must match in every combination, which is
the problem this change should remove.

_Alternative considered_: write the numbers from the TSX map into CSS variables
for each size, so the CSS has no formula of its own. Rejected after a first
implementation: it needs a helper that builds every size variant in code, and
the recipe became hard to read and edit. Computing the widths in CSS keeps each
size a plain list of values.

_Alternative considered_: shrink the controls at small sizes. Rejected: 24px is
the WCAG 2.5.8 minimum target size; the expand column already sits exactly there
(FEC-1346 §7).

### 5. Layout settings panel

The "Row density" control in `DataTable.Manager` keeps its place and becomes a
select that sets the size.

- Options: Spacious (`xl`), Comfortable (`lg`), Standard (`md`), Compact (`sm`),
  each with an icon (`HorizontalRule`, `DensityLarge`, `DensityMedium`,
  `DensitySmall`: fewer lines mean more space between rows). The select is not
  clearable.
- `xl` is deprecated, so it is offered only to a table that has had it. The
  root keeps a flag, `hasBeenXl`, that latches on the first render where the
  size is `xl` (no `size`, or `size="xl"`) and stays set. A table that is later
  given `xl` (for example restored settings) therefore shows `xl` in the
  select, and `xl` never disappears once it was current. A table that was never
  on `xl` never offers it.
- The panel calls `onSettingsChange("changeSize", size)`. The second argument is
  typed `DataTableSize`. `UPDATE_ACTIONS.CHANGE_SIZE` replaces
  `TOGGLE_ROW_DENSITY`, which is removed.
- The select (`size="sm"`) and the text visibility `ToggleButtonGroup`
  (`size="xs"`) are both 32px tall. `Select` has no size that matches the
  Button scale at 36px, so the two smallest common heights were used.
- Labels: Comfortable and Compact reuse existing messages. Spacious and
  Standard are new, with placeholder translations until Transifex.

_Alternative considered_: always offer all four sizes. Rejected: it advertises
the deprecated `xl` to tables that never used it.

_Alternative considered_: a toggle button group with icons, or a slider with
four stops. Rejected: the labels did not fit the toggles, and the slider tooltip
can only show the stop number.

_Alternative considered_: keep sending `toggleRowDensity` as well. Rejected: a
size does not map to the two `density` values.

### 6. Cell alignment fixes

Two fixes apply to every table, with or without `size`:

- The body cell content wrapper is `inline-block` with `overflow: hidden`, so
  the wrapper's baseline sat on its bottom edge and the font's descender space
  was added below the text. Aligning the wrapper to the top removes it. Rows
  are about 6px shorter and the text is centered between the padding.
- The expand button was inline-level on the text baseline, so the arrow sat
  about 2px above the cell center. It is now a flex box that centers its icon.

They are the reason the default is not pixel-identical to before. Cell
padding, header height and text are unchanged for `xl`.

## Risks / Trade-offs

- [Header without fixed height looks different from the rows] → Try it out in
  stories for `sm`–`lg` before merge; decided: padding only, no fixed height, because cells can need two or
  more lines. `xl` is unaffected.
- [Consumers' own `<Text textStyle="sm">` in cells overrides the size] →
  Document it: remove the own text style when choosing `sm`–`lg`. 4 of 10
  current DataTables do this (nimbus-pulse scan 20).
- [Sticky offsets break at a size] → A story per size with drag, selection,
  expand and pin columns and horizontal scroll; play function asserts the sticky
  columns touch without gap or overlap.
- [Value drift between Table and DataTable] → Cross-reference comments in both
  recipes; a unit test compares the resolved padding tokens.
- [Consumers' `onSettingsChange` handlers miss `"changeSize"`] → The removed
  `UPDATE_ACTIONS.TOGGLE_ROW_DENSITY` gives a compile error to code that
  references it; code that compares the string stops receiving it. Accepted:
  scan 27 shows no usage of `onSettingsChange`, and the changeset documents it.
- [Deprecated default feels odd] → Accepted on purpose: it keeps today's look
  without inviting new uses. Documented in the JSDoc and the changeset.

## Migration Plan

1. Ship as a **minor** release (additive `size`, deprecations, and the one
   accepted break of the removed action constant).
2. Consumers who want denser tables pass `size="md"` or `size="sm"` and may
   remove their own cell text styles.
3. Next major release (separate change): remove `density`, remove `xl`, and
   change the default to a documented size. That is a visible change for every
   DataTable without `size` and needs its own changeset.

Rollback: revert the PR. No data or storage is involved.

## Findings During Implementation

- **Header without fixed height (`sm`–`lg`)**: tried in the `Sizes` story;
  the header looks balanced with padding alone (35px for `sm`, 43px for
  `md`/`lg`). Kept without a fixed height.
- **Header text grows from 12px to 14px at `sm`/`md`**: the shared sizes use
  Table's header text (14px, 16px for `lg`), while `xl` keeps today's 12px.
- **Rows were ~7px taller than padding plus line height** at every size,
  including `xl` (for example `xl`: 63px = 32px padding + 24px line + 7px).
  Cause: the cell content wrapper is `inline-block`, so its baseline added
  space. It existed on `main` too. It is fixed in this change (Decision 6), so
  rows are now padding plus line height.
- **Drag-and-drop with `renderNestedContent`** logs React Aria's "Draggable
  items in a Table must contain a `<Button slot="drag">`" once per nested
  row (the `SizeInternalColumns` story shows it). Not related to `size`;
  existing behavior worth a follow-up.
