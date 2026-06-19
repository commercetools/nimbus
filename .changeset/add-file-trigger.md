---
"@commercetools/nimbus": minor
---

`FileTrigger`: new component — connects a pressable child (such as a `Button` or
`IconButton`) to the native file picker, opening it when the child is activated.

- Behavior-only: it renders no styling of its own, so the trigger looks exactly
  like the child you provide.
- `onSelect` reports the user's selection as a native `FileList` (or `null`).
  Use `Array.from(files)` to iterate.
- Restrict what can be chosen with `acceptedFileTypes`, allow picking more than
  one file with `allowsMultiple`, pick a whole folder with `acceptDirectory`,
  and hint a mobile camera with `defaultCamera`.
- The trigger's accessible name comes from the child, and disabling is done by
  disabling the child — there is no `isDisabled` on `FileTrigger` itself.

To reset and allow re-selecting the same file, remount the component with a
changing `key`.
