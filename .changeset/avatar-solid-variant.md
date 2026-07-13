---
"@commercetools/nimbus": minor
---

`Avatar`: new `variant` prop — `subtle` (default, the existing look) and
`solid`, which fills the avatar with the palette's solid color and contrast text
to match a same-palette `Button`. Avatars that don't set `variant` are
unchanged.

- Custom `children` are now rendered — an icon or other node shows in place of
  the initials / image / Person fallback (the documented prop was previously
  ignored).
- The fallback icon renders crisper, sized on the same scale as a `Button` icon.
