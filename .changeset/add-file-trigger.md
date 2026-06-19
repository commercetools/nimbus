---
"@commercetools/nimbus": minor
---

`FileTrigger`: new component. Wraps a pressable child (such as a `Button` or
`IconButton`) and opens the native file picker when it's activated; it renders
no styling of its own, so the trigger looks like the child you provide.

`onSelect` reports the selection as a native `FileList` (or `null`) — use
`Array.from(files)` to iterate. Configure the picker with `acceptedFileTypes`,
`allowsMultiple`, `acceptDirectory`, and `defaultCamera`.
