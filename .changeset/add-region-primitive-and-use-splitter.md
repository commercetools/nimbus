---
"@commercetools/nimbus": minor
---

`Region`: new headless primitive for **named regions** — render content into a
slot somewhere else in the layout while it stays in your component's React tree
(so context like routing, intl, data clients, and permissions is preserved).
Wrap a subtree in `Region.Provider`, mark render targets with `Region.Outlet`
(by `name`), and project into them from anywhere inside with `useRegion(name)` —
which returns a stable `Region` portal component plus the outlet's live `node`.
Targets are addressed by name, not tree position, so projection works across any
nesting. `useRegion` resolves to `null`/empty safely before an outlet mounts.

`Splitter`: now consumes `Region`, adding two capabilities:

- An `id` on `Splitter.Root` names the splitter instance. A pane left without
  children becomes a projection target automatically.
- `useSplitter(id?)` returns a handle to a splitter — its aside collapse
  controls (`isCollapsed` / `expand` / `collapse` / `toggle`) and its
  `MainRegion` / `AsideRegion` portal components — so a consumer that does not
  own the splitter markup can project content into a pane and open/close the
  aside. Pass an `id` to reach a specific (e.g. shell-level) splitter from
  anywhere; omit it to use the nearest one. Returns `null` until that splitter
  mounts, so it is safe to call early.
