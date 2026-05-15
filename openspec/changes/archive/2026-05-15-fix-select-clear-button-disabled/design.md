## Context

When a `Select` component was set to a disabled state, its clear button (the small "x" rendered next to the selected value) remained interactive and would still clear the selection on press. This was a defect in the disabled-state contract: a disabled Select should not allow any user action that mutates its value.

The root cause was twofold: `SelectClearButton` had no awareness of the parent Select's disabled state, and it explicitly set `pointerEvents="all"` on its underlying `IconButton` — which overrode any `pointerEvents="none"` that the parent might apply to gate interaction.

Scope is narrow: a single internal component (`SelectClearButton`) and the place where `SelectRoot` renders it.

## Approach

- `SelectClearButton` accepts an `isDisabled?: boolean` prop and forwards it to its underlying `IconButton` via `isDisabled`.
- The hard-coded `pointerEvents="all"` is replaced with `pointerEvents={isDisabled ? "none" : "all"}` so the override no longer defeats the parent's disabled gating.
- `SelectRoot` passes the computed disabled state to the clear button as `<SelectClearButton isDisabled={isLoading || isDisabled} />`, reusing the same condition that already governs the trigger. `isLoading` is treated as disabled for this purpose, matching the trigger's existing behavior.
- The clear button remains rendered (and visible) when a value is selected even in the disabled state — only its interactivity is suppressed. This preserves layout and the user's view of the current selection.

## Alternatives Considered

- Hiding the clear button entirely when disabled: rejected because it would cause layout shift and remove a useful visual affordance ("this select has a value") when toggling between enabled/disabled states.
- Reading the disabled state from `SelectStateContext` inside `SelectClearButton`: rejected because the disabled state is owned by the parent component props, not by React Aria's select state, and passing it as a prop keeps the data flow explicit and avoids reaching for context that doesn't carry it.

## Risks / Trade-offs

- None — the behavior change is strictly narrowing: it removes a code path that allowed mutation of a disabled component's value. No public API changes.
