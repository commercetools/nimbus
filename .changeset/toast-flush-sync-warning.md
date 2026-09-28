---
"@commercetools/nimbus": minor
---

`Toast`: calling `toast()`, `toast.update()`, `toast.dismiss()`, or
`toast.remove()` from inside `useEffect` no longer logs the
`flushSync was called from inside a lifecycle method` warning, so the
`queueMicrotask` workaround is no longer needed.

Toasts now render on the next microtask after `toast()` is called. The returned
ID is still valid immediately. Tests that query a toast synchronously right
after calling `toast()` should use `findBy*` queries or `waitFor` instead of
`getBy*`.
