---
"@commercetools/nimbus": minor
---

`Avatar`: add a `variant` prop with `subtle` (default) and `solid`.

- `subtle` (default) is the existing soft tinted look — no change for avatars
  that don't set `variant`.
- `solid` fills the avatar with the palette's solid color and contrast text,
  matching the equivalent `Button` variant, so an avatar reads as consistent
  with a same-palette button.

The fallback icon also renders crisper: it now sizes on the same scale as a
`Button` icon of the equivalent footprint (16/20/24px for `2xs`/`xs`/`md`),
producing whole, even pixel sizes instead of the previous fractional value.
