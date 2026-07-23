---
"@commercetools/nimbus": minor
---

`Breadcrumbs`: new component for showing the hierarchical path to the current
page as an ordered list of links.

- Build trails from compound `Breadcrumbs.Item` children or a declarative
  `items` array, with an optional `onAction(id)` handler for client-side
  routing.
- The last item is automatically the current page (`aria-current="page"`,
  non-interactive, removed from the tab order) — there is no `isCurrent` prop.
- `Breadcrumbs.Item` supports `href`, `target`, `rel`, `routerOptions`, and
  `isDisabled`; set the `separator` (default `›`) and `size` (`sm`/`md`) on the
  root.
