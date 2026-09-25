## Why

Teams need denser DataTables to show more data on one screen. Today
DataTable offers only `density: "default" | "condensed"`, and `condensed`
changes vertical cell padding only (16px to 12px), while horizontal padding
stays 24px. `Table` already uses a `size` prop (`sm` | `md` | `lg`), so
Nimbus has two different ways to express table spacing, with values that
match nowhere.

We want one axis, `size`, on both table components, with the same names
meaning the same values. Now is the right time: no consumer passes
`density` today (nimbus-pulse scan #20, 10 DataTable files in
`merchant-center-frontend` and `commerce-agents`), so the migration cost is
close to zero.

Evidence from the same scan:

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
    changes appearance.
  - `xl` is **deprecated from the start**: it exists only to keep today's
    look as the default. Consumers are told not to choose it (JSDoc, left
    out of documented sizes, development warning when passed explicitly).
- The internal columns (drag, selection, expand, pin) scale with the size:
  their controls stay 24×24px, and the padding around them follows the cell
  padding of the chosen size.
- The header follows the size: `sm`–`lg` use the same padding as the cells;
  `xl` keeps today's fixed 40px header.
- Deprecate `density`. It keeps working unchanged until the next major
  release. The deprecation note points to `size="lg"` or `size="md"`.
- `Table` is **not** changed. It does not get `xl`.
- The layout settings panel is **not** changed. Its "Row density" control
  keeps reading and toggling the deprecated `density` prop. How it should
  offer sizes is decided together with FEC-1346 §6, with design input.

No breaking changes. Removing `density` and moving the default away from
`xl` are planned for a later major release and are not part of this change.

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
  variants, header, sticky offsets), types (`size`, deprecation JSDoc),
  root (default, warning, CSS variables), header (internal column widths),
  constants.
- **Public API**: additive `size` prop; `density` deprecated.
- **Visual**: none for the default. Chromatic must show no diff for
  existing stories.
- **Docs**: `data-table.dev.mdx`, `data-table.mdx`, stories (about 89
  mentions of `density`/`condensed` to review).
- **Sequencing**: lands after PR #1996 (row identity), before FEC-1346 and
  FEC-1347. FEC-1347 §4 (duplicated header styles) and §5 (density variant
  cleanup) touch the same recipe code and must rebase on this change.
- **Consumers**: none need to change. Teams that set `textStyle="sm"` in
  cells can remove it once they choose `sm`–`lg`.
