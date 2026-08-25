# Tasks

## 1. Specify the clear button

- [x] 1.1 Add a `Clear Button` requirement to `openspec/specs/nimbus-select/spec.md`, positioned after `Trigger Control` so the field's controls read in DOM order
- [x] 1.2 Cover: the `isClearable` prop and its implemented `true` default; rendering conditional on a selection; the localized accessible name; tab-order membership; clearing without opening the listbox; the disabled and loading states
- [x] 1.3 Confirm no scenario contradicts the clear-button clause already in `Interactive States`
- [x] 1.4 `openspec validate spec-select-clear-button --strict`

## 2. Confirm the spec matches the implementation

- [x] 2.1 Re-check each scenario against `select.clear-button.tsx`, `select.root.tsx` and `select.i18n.ts`
- [x] 2.2 Confirm existing story coverage for the specified behaviour, and note any scenario that has none

### Coverage of the specified scenarios

| Scenario | Covered by |
| --- | --- |
| Clear button rendering | `Clearable` |
| No selection | `Clearable` — asserts the button disappears after use |
| Clearing disabled | `Clearable` (not rendered) and `FieldChromeNonClearable` (no space reserved) |
| Accessible name | every clear-button query resolves it by `[aria-label="Clear selection"]` |
| Clearing the selection | `Clearable`, **except** "SHALL NOT open the options listbox" |
| Keyboard operability | `Clearable` activates with Enter, **except** the tab-order position |
| Disabled and loading | `DisabledClearButton` covers `isDisabled`; **`isLoading` is uncovered** |

Three assertions in this requirement therefore rest on one-off browser
verification rather than on a test that would fail if they regressed:

1. activating the clear button does not open the listbox
2. the clear button follows the trigger in tab order
3. `isLoading` disables the clear button

That is the same exposure that let the 56px reserve drift for eleven months, so
it is worth closing — but it is test work rather than spec work, and adding it
belongs in its own task rather than being smuggled into a spec-only change.

## Notes

Written from verified behaviour, not from reading intent. Facts established in a
browser before the requirement was drafted:

- `tabIndex` 0, tab order `trigger` → `clear`
- pressing the clear button leaves the listbox closed and restores the
  placeholder ("Select an item")
- with the clear button focused, the field's outline becomes
  `solid 2px rgb(173, 186, 255)` — the field-level focus ring introduced by
  `input-trailing-element-slot`, already specified there under `Trigger Control`
  → `Focus indication`, so it is not restated here
