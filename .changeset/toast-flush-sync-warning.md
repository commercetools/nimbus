---
'@commercetools/nimbus': patch
---

Fix `flushSync was called from inside a lifecycle method` warning when calling `toast()`, `toast.update()`, `toast.dismiss()`, or `toast.remove()` from inside `useEffect`. Toast changes are now applied in a microtask, so `toast()` is safe to call from React lifecycles without a `queueMicrotask` workaround.
