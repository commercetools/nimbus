---
"@commercetools/nimbus": minor
---

**Slider / RangeSlider**: new components for selecting a numeric value — or a
min–max range — by dragging a handle. Fully operable by keyboard, pointer, and
touch, and correct under right-to-left layouts.

- `Slider` selects a single `number`; `RangeSlider` selects a `[number, number]`
  range whose two handles can't cross.
- Each handle shows its current value in a tooltip while it's hovered, focused,
  or dragged.
- Pick a `plain` (default) or `enclosed` look, in two sizes and either
  orientation, with optional tick marks.
- Works inside `FormField` or standalone.
