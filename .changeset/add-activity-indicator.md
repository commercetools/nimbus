---
"@commercetools/nimbus": minor
---

**ActivityIndicator**: new component — an animated three-dot indicator that
signals ongoing agent or system activity ("thinking", "processing", "typing") in
chat and AI surfaces.

- Scales with the surrounding `font-size` by default (`size="inherit"`), so it
  sits inline next to a status label. Fixed sizes (`2xs`–`lg`) reserve a square
  icon-box footprint — the same scale points as `LoadingSpinner` — for placement
  in input start/end icon slots.
- `colorPalette` accepts any Nimbus color palette (default `primary`); the dots
  are filled from the palette's `11` shade.
- `variant` switches the dot color treatment: `plain` (default) for neutral
  backgrounds, and `contrast` for sitting on a solid colored surface (the dots
  take the palette's contrast color — black or white — automatically).
- Decorative by default (`aria-hidden`) — when adjacent visible text conveys the
  state — and upgrades to a polite live region (`role="status"`,
  `aria-live="polite"`) when given an `aria-label`.
- Respects `prefers-reduced-motion` by replacing the bounce with a gentle pulse.

For indeterminate progress where the user must wait, use `LoadingSpinner`
instead.
