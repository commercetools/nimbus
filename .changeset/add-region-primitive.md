---
"@commercetools/nimbus": minor
---

`Region`: new headless primitive for **named regions** — render content into a
slot somewhere else in the layout while it stays in your component's React tree
(so context like routing, intl, data clients, and permissions is preserved), and
optionally let that slot's host publish a `value` (e.g. control callbacks +
state) for consumers to read.

- `<Region name="…" />` — the **target**: marks where a named region renders.
  It's layout-transparent (`display: contents`), so projected content lays out
  as a direct child of the target's parent — no extra wrapper box. Backed by a
  `chakra.div`, so it accepts style props. Can publish a `value`.
- `useRegion(name)` — returns a stable `Region` portal component to **fill** the
  target, plus the published `value`. Addressed by name (not tree position), so
  it works across any nesting and resolves safely before a target mounts.
- `Region.Provider` — the scope. **Mounted ambiently inside `NimbusProvider`**,
  so in a Nimbus app you place targets and call `useRegion` without wrapping
  anything yourself.

Backed by an external store, so publishing a node or value never re-renders the
provider — filling a region (or toggling a panel through a published callback)
updates only that region's consumers, not the app the provider wraps.

This composes with `Splitter` (no Splitter API change needed) to build a
shell-owned, remotely-controlled side panel: mount the splitter once, put a
`<Region name>` in the aside that publishes the collapse controls, and let a
consumer anywhere fill the pane and open/close it via `useRegion`.
