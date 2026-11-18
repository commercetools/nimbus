# Proposal

## Why

In Safari, every `LoadingSpinner` appeared in the same very large size, and a
resizable `DataTable` without a pin column showed a horizontal scrollbar even
when no column was wider than the table. The spinner was a `div` of the
requested `size` with a nested `svg`; Safari did not size the nested `svg` from
its wrapper. Fixing this needed a different structure, and that structure is
part of the specified contract of `LoadingSpinner` (root element, `ref` type,
default size, stroke), so the change must be recorded in the spec.

## What Changes

- `LoadingSpinner` renders one `svg` as its root. Before, it rendered a `div`
  with a nested `svg`.
- **BREAKING (types):** the `ref` of `LoadingSpinner` is typed `SVGSVGElement`
  (was `HTMLDivElement`). `LoadingSpinnerRootSlotProps` extends
  `HTMLChakraProps<"svg", ...>` (was `"div"`).
- The recipe has no default `size` variant. A spinner without `size` takes the
  size its parent gives to icons (for example a `Button`) and falls back to 24px
  from `width` and `height` attributes elsewhere. The size scale points
  (`2xs` 14px to `lg` 40px) are unchanged. The recipe no longer sets
  `display: inline-flex`.
- The ring is drawn on the 24x24 icon grid with whole-pixel edges: radius 8.5 and
  stroke 3, so the outer edge sits 2px inside the grid and both edges of the
  stroke are whole numbers at 24px. Before, it used a radius of 10.5 and a
  stroke of 3 under a `scale(calc(1 - 2/12))` transform (an effective stroke of
  2.5px at 24px). The outer diameter is the same. The ring is slightly thicker.
- `FormActionBar`, `ConfirmationDialog` and `FormDialog` render
  `<LoadingSpinner />` without `size` and without a margin. The spinner takes
  the icon size of the button and the button `gap` spaces it from the label.
- `DataTable`: with `isResizable` and `allowsPinning={false}`, the resize handle
  of the last column is as wide as the other handles (`right: 0`), so it stays
  inside the table and no horizontal scrollbar appears.
- The outdated `nimbus-loading-spinner` spec is brought in line with the
  implementation.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-loading-spinner`: root element is an `svg`; `ref` type; no default
  size variant and parent-sized behavior; ring geometry; base styles; slot
  component; story requirements.
- `nimbus-data-table`: the resize handle of the last column stays inside the
  table.
- `nimbus-form-dialog`: the save spinner is sized like a button icon.
- `nimbus-confirmation-dialog`: the confirm spinner is sized like a button icon.

## Impact

- **Code:** `loading-spinner.{tsx,recipe.ts,slots.tsx,types.ts,stories.tsx}`,
  `data-table.recipe.ts` and its story, `form-action-bar.tsx`,
  `confirmation-dialog.tsx`, `form-dialog.tsx`, and
  `.changeset/safari-spinner-table-overflow.md` (`patch`).
- **Public API:** the `ref` type and the rendered element change. No prop is
  added or removed.
- **Consumers (Nimbus Pulse, scan 89, `nimbus-pulse.sqlite`):**
  - 143 `LoadingSpinner` instances in 13 repositories. No instance uses `ref`,
    spread props or children.
  - 96 instances have an explicit `size`, 47 have none. None of the 47 sets
    width, height, `boxSize`, `css` or `style` on the spinner. Not checked: the
    parent of each of the 47. A spinner without `size` takes the size its parent
    gives to icons (for example a `Button`), and is 24px otherwise; its layout
    box in such a parent can therefore change.
  - 23 spinners with an explicit `size` sit inside a `Button` (18 `2xs`, 3 `xs`,
    2 `sm`). An explicit `size` wins over the icon size of the `Button`, so
    these spinners keep their requested size and box. On `main`, the visible
    ring in a `Button` followed the button icon size, not `size`; it now follows
    `size` (a `2xs` spinner in a `md` button: ring 20px to 14px).
  - No selector on `nimbus-loading-spinner`, `div[role="progressbar"]` or
    `HTMLDivElement` was found in the commercetools GitHub organization. Search
    covers only indexed default branches.
  - Not checked: consumer CSS or tests that select the old `div` or the inner
    `svg` by other means, and the final version in Safari (only Chromium was
    tested).
