---
"@commercetools/nimbus": minor
---

**Breadcrumbs**: new component for showing the hierarchical path to the current
page as an ordered list of links.

- `Breadcrumbs.Root` renders a `<nav>` landmark wrapping an ordered list; give
  it an `aria-label` (e.g. `"Breadcrumb"`) and an optional `separator` (any
  node, defaults to `/`).
- `Breadcrumbs.Item` renders a link. Set `isCurrent` on the last item to mark
  the current page — it renders as non-interactive text with
  `aria-current="page"` and is removed from the tab order. Items also support
  `isDisabled`, `target`, and `rel`.

```tsx
<Breadcrumbs.Root aria-label="Breadcrumb">
  <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
  <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
  <Breadcrumbs.Item isCurrent>Order #123</Breadcrumbs.Item>
</Breadcrumbs.Root>
```
