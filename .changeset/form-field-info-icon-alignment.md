---
"@commercetools/nimbus": patch
---

**Fixed:** the info ("?") icon button beside a field label is now vertically
centered against the label text.

- `LocalizedField`: the label row stretched its items, so the 24px icon button
  set the row height while the label text stayed at the top of its 20px line
  box - the icon read about 2px low. The row is the same height as before, so
  nothing below the label moves.
- `FormField`: `FormField.InfoBox`'s icon is now anchored to the label text's
  optical center instead of to the text baseline. The rendered position is
  effectively unchanged for the current font; the icon just no longer drifts
  when the label's font changes.
