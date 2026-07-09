---
"@commercetools/nimbus": minor
---

**Breadcrumbs**: new component for showing the hierarchical path to the current
page as an ordered list of links. Built on React Aria Components'
`Breadcrumbs`/`Breadcrumb`.

- `Breadcrumbs.Root` renders a `<nav>` landmark wrapping an ordered list; give
  it an `aria-label` (e.g. `"Breadcrumb"`) and an optional `separator` (any
  node, defaults to `›`). It accepts either compound `Breadcrumbs.Item` children
  or a declarative `items` array, and an `onAction(id)` handler for client-side
  routing.
- The **last** item is the current page automatically — it renders as
  non-interactive text with `aria-current="page"` and is removed from the tab
  order. There is no `isCurrent` prop.
- `Breadcrumbs.Item` renders a link and supports `href`, `target`, `rel`,
  `routerOptions`, and `isDisabled`. `size` (`sm`/`md`) is set on the root.

```tsx
// Compound API
<Breadcrumbs.Root aria-label="Breadcrumb">
  <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
  <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
  <Breadcrumbs.Item>Order #123</Breadcrumbs.Item>
</Breadcrumbs.Root>

// Data-driven API — the last entry is the current page
<Breadcrumbs.Root
  aria-label="Breadcrumb"
  items={[
    { id: "home", label: "Home", href: "/" },
    { id: "orders", label: "Orders", href: "/orders" },
    { id: "detail", label: "Order #123" },
  ]}
/>
```
