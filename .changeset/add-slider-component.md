---
"@commercetools/nimbus": minor
---

**Slider / RangeSlider**: new components for selecting numeric values by
dragging a handle, built on React Aria with full keyboard, pointer, touch, and
RTL support (WCAG 2.1 AA).

- `Slider` selects a single `number`; `RangeSlider` selects a `[number, number]`
  min–max pair with two handles that can't cross. Both support controlled and
  uncontrolled use via `value` / `defaultValue` with `onChange` and
  `onChangeEnd`.
- Each handle shows its current value in a tooltip while hovered, focused, or
  dragged (dismissible with Escape); format it with `formatOptions`.
- `size`: `sm` and `md` (default `md`). `orientation`: `horizontal` (default)
  and `vertical`.
- `variant`: `plain` (default, a thin filled track with a knob) and `enclosed`
  (a thick, contained iOS-style bar with the knob inset inside it).
- Opt-in tick marks via `showTicks` / `tickStep`.
- Integrates with `FormField` for label association, description, and invalid
  state; usable standalone with an `aria-label`.
- `RangeSlider` names each handle via `thumbLabels`, falling back to localized
  "Minimum" / "Maximum" labels.
