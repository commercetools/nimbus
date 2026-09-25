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
  containers with `py: "100"` / `px: "600"`. The header block exists twice in
  the recipe (FEC-1347 §4).
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
- Zero visual change for tables that do not pass `size` (Chromatic clean).
- One source of truth for internal column widths, shared by React Aria
  (JavaScript numbers) and the sticky offsets (CSS).

**Non-Goals:**

- Changing `Table`.
- Changing the layout settings panel (follow-up, see Open Questions).
- Scaling the interactive controls themselves. They stay 24px at every size
  (WCAG 2.5.8 minimum).
- Removing `density` or changing the default away from `xl` (next major).
- Merging the duplicated header blocks (FEC-1347 §4). This change edits both
  copies consistently so that FEC-1347 can merge them later without a behavior
  question.

## Decisions

### 1. `size` is a recipe variant; `xl` holds today's values

`size` becomes a variant of the DataTable slot recipe with
`defaultVariants: { size: "xl" }`. Padding moves out of the base `cell` slot
into the variants, so each size owns its padding completely:

| Size | Cell px / py  | Header                                                       | Text (cell + header)    |
| ---- | ------------- | ------------------------------------------------------------ | ----------------------- |
| `sm` | `200` / `200` | padding as cells, no fixed height                            | `sm`                    |
| `md` | `300` / `300` | padding as cells, no fixed height                            | `sm`                    |
| `lg` | `400` / `300` | padding as cells, no fixed height                            | `md`                    |
| `xl` | `600` / `400` | today: `height: "1000"`, container `py: "100"` / `px: "600"` | header `sm`, cell unset |

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
variant `{ size: "xl", density: "condensed" }` → `py: "300"`. The root passes
`density` to the recipe only when the consumer did not pass `size`. So:

- no `size`, `density="condensed"` → today's condensed look
- explicit `size` + `density` → `size` wins, `density` ignored, one development
  warning

_Alternative considered_: map `condensed` to a size. Rejected: `condensed`
changes vertical padding only and matches no size (24/12px).

### 3. Deprecated `xl` default

The root destructures `size` without a default and resolves `size ?? "xl"`. That
makes an explicit `xl` detectable: when `size === "xl"` is passed, a
`process.env.NODE_ENV !== "production"` check logs one warning per mount,
following the pattern in `breadcrumbs.root.tsx` and `splitter.root.tsx`.
TypeScript cannot mark one literal of a union deprecated, so the JSDoc on `size`
states it, and stories and docs list only `sm`/`md`/`lg`.

### 4. Internal column widths from one map

A constant maps each size to the internal column widths:

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
- The root writes the same numbers as CSS variables on the root element (for
  example `--data-table-drag-column-width`,
  `--data-table-selection-column-width`).
- The recipe's sticky offsets use those variables
  (`left: var(--data-table-drag-column-width)`, `calc(...)` for the sum) instead
  of `"600"`, `"1800"` and `"2400"`.
- The selection and pin cell padding is `(padded − 24) / 2`, which equals the
  cell padding of the size. The recipe takes it from the size variant, so no
  extra variable is needed.

_Alternative considered_: repeat the widths per size in the recipe. Rejected: it
keeps two copies (TSX and CSS) that must match in every combination, which is
the problem this change should remove.

_Alternative considered_: shrink the controls at small sizes. Rejected: 24px is
the WCAG 2.5.8 minimum target size; the expand column already sits exactly there
(FEC-1346 §7).

## Risks / Trade-offs

- [Header without fixed height looks different from the rows] → Try it out in
  stories for `sm`–`lg` before merge; the fixed-height question is open (see
  below). `xl` is unaffected.
- [Consumers' own `<Text textStyle="sm">` in cells overrides the size] →
  Document it: remove the own text style when choosing `sm`–`lg`. 4 of 10
  current DataTables do this (nimbus-pulse scan #20).
- [Sticky offsets break at a size] → A story per size with drag, selection,
  expand and pin columns and horizontal scroll; play function asserts the sticky
  columns touch without gap or overlap.
- [Value drift between Table and DataTable] → Cross-reference comments in both
  recipes; a unit test compares the resolved padding tokens.
- [Merge conflicts with FEC-1347] → This change lands first; FEC-1347 §4 and §5
  rebase on it.
- [Deprecated default feels odd] → Accepted on purpose: it keeps today's look
  without inviting new uses. Documented in the JSDoc and the changeset.

## Migration Plan

1. Ship as a **minor** release (additive `size`, deprecations only).
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
- **Rows are ~7px taller than padding plus line height** at every size,
  including `xl` (for example `xl`: 63px = 32px padding + 24px line + 7px).
  Cause: the cell content wrapper is `inline-block`, so its baseline adds
  space. It exists on `main` too, so it is not introduced by this change,
  but it costs density; worth a follow-up.
- **Drag-and-drop with `renderNestedContent`** logs React Aria's "Draggable
  items in a Table must contain a `<Button slot="drag">`" once per nested
  row (the `SizeInternalColumns` story shows it). Not related to `size`;
  existing behavior worth a follow-up.

## Open Questions

- **Layout settings panel**: it still toggles the deprecated `density` and
  cannot select a size. A follow-up must add a control (for example a dropdown
  or a segmented control) to pick the desired size, and decide the labels,
  whether `xl` is offered, and what the `onSettingsChange` payload carries.
  Decide together with FEC-1346 §6 and design.
- **Design sign-off** on the four sizes.
- **When the default moves away from `xl`**: which major release, and to which
  size.
