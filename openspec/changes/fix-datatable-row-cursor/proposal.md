# Change: Restore DataTable clickable row cursor and text selection

## Why

CRAFT-1711 migrated DataTable styling from class-based selectors in the root
slot to proper Chakra slot recipes. During that migration, a couple of values
from CRAFT-1691 (which had just landed) weren't carried over into the new
`row` slot:

1. **No `cursor: pointer` on clickable rows** -- the recipe has a
   `&[data-clickable='true']` CSS rule ready to go, but the corresponding
   `data-clickable` attribute is never set on the row element (the inline
   `cursor` style it replaced was removed per CRAFT-1711's goal of eliminating
   `style` props, but the attribute to activate the CSS rule wasn't added).
2. **Text selection not working** -- CRAFT-1691 set `userSelect: "text"` on row
   cells so users could select and copy text. The new `row` slot was written
   with `userSelect: "none"`, while the old class-based rule in the root slot
   still says `"text"` -- creating a contradiction where the slot wins.
3. **Misleading cursor on cells** -- cell content shows `cursor: text`
   (suggesting text is selectable), but `userSelect: "none"` prevents actual
   selection.

GitHub issue: commercetools/nimbus#1319

## What Changes

- Wire up `data-clickable` attribute on the row element when `onRowClick` is
  provided, activating the existing recipe CSS rule
- Change `userSelect: "none"` to `"text"` in the row slot, aligning with
  CRAFT-1691's intended behavior and the existing root-level class rule
- Remove the unused `isRowClickable` prop from types (it is defined but not
  consumed by any component; `onRowClick` already serves as the clickability
  indicator)
- Remove explicit `cursor: "text"` from cell content `<Box>` -- let the
  browser's natural text cursor apply over text, and let the row's
  `cursor: pointer` take effect over non-text areas

## Impact

- Affected specs: `nimbus-data-table`
- Affected code:
  - `packages/nimbus/src/components/data-table/components/data-table.row.tsx` --
    add `data-clickable` attribute, remove explicit cell cursor
  - `packages/nimbus/src/components/data-table/data-table.recipe.ts` -- change
    `userSelect: "none"` back to `"text"` in row slot
  - `packages/nimbus/src/components/data-table/data-table.types.ts` -- remove
    dead `isRowClickable` prop
