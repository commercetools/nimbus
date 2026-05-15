# Change: Fix Select clear button remaining active when Select is disabled

## Why
When a Select component is disabled, the clear button (`SelectClearButton`) remains interactive and can still clear the selected value. The clear button explicitly sets `pointerEvents="all"` which overrides the parent's `pointerEvents="none"`, and it never checks the Select's disabled state.

## What Changes
- `SelectRoot` passes the computed `isDisabled` state as a prop to `SelectClearButton`
- `SelectClearButton` forwards `isDisabled` to its underlying `IconButton`, disabling interaction while keeping the button visible

## Impact
- Affected specs: nimbus-select
- Affected code: `packages/nimbus/src/components/select/components/select.clear-button.tsx`
