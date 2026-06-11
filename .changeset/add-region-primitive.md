---
"@commercetools/nimbus": minor
---

`Region`: new headless primitive for **named regions** — render content into a
slot somewhere else in the layout while it stays in your component's React tree
(so context like routing, intl, data clients, and permissions is preserved), and
optionally let that slot's host publish a `value` (e.g. control callbacks +
state) for consumers to read.

- `Region.Provider` — establishes a named-region scope; reuses an ancestor scope
  when nested, so the namespace is shared.
- `Region.Outlet name="…"` — marks where a named region renders; registers its
  DOM node and can publish a `value` for that region.
- `useRegion(name)` — returns a stable `Region` portal component to project into
  the outlet, plus the outlet's live `node` and published `value`. Targets are
  addressed by name (not tree position), so it works across any nesting, and it
  resolves to `null` safely before an outlet mounts.

Backed by an external store, so publishing a node or value never re-renders the
provider — projecting into a region (or toggling a panel through a published
callback) updates only that region's consumers, not the subtree the provider
wraps.

This composes with `Splitter` (no Splitter API change needed) to build a
shell-owned, remotely-controlled side panel: mount the splitter once, put a
`Region.Outlet` in the aside that publishes the collapse controls, and let a
consumer anywhere project content into the pane and open/close it via
`useRegion`.
