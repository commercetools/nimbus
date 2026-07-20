---
"@commercetools/nimbus": minor
---

`Avatar`: new `variant` prop — `subtle` (default, the existing look) and
`solid`, which fills the avatar with the palette's solid color and contrast text
to match a same-palette `Button`.

- **Visual change:** the default color palette is no longer pinned to `primary`
  in the recipe; an `Avatar` with no explicit `colorPalette` now inherits the
  ambient palette (the global default is `neutral`), aligning `Avatar` with how
  `Button` resolves its palette. Avatars that already pass a `colorPalette` (or
  live inside a component that sets one, such as `ChatMessage.Avatar`) are
  unaffected; a bare `<Avatar>` shifts from the primary tint to neutral. Pass
  `colorPalette="primary"` to keep the previous look.
- Custom `children` are now rendered — an icon or other node shows in place of
  the initials / image / Person fallback (the documented prop was previously
  ignored).
- The fallback icon renders crisper, sized on the same scale as a `Button` icon.
