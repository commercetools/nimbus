## Context

`Tabs` is built on React Aria Components (`Tabs` / `TabList` / `Tab` /
`TabPanel`). `Tabs.Root` renders `<TabsRootSlot asChild><RATabs>…</RATabs>` and
normalizes the responsive `variant` / `orientation` / `placement` props to
concrete values via `sysCtx.normalizeValue`, because RAC cannot consume
responsive values.

`TabNav` renders a `<nav>` landmark containing `<a>` items (`TabNav.Item`), with
the active item marked `aria-current="page"`.

Both recipes mark the active item with a **static** marker — an underline
`boxShadow` for `line`, a filled `backgroundColor` for `rounded`/`pill`. The
sliding indicator replaces that marker at runtime.

## Decisions

### The indicator lives in the positioned root, not the item list

Both components render the indicator as the first child of a `position: relative`
root — `RATabs` for `Tabs`, the `<nav>` slot for `TabNav`. For `Tabs` this is
required: RAC's `TabList` renders a **collection** and rejects arbitrary
non-`Tab` children, whereas the root has no such restriction. Measuring
`activeRect − rootRect` against the root is also correct for **every** layout —
in vertical / `placement="end"` the root is a flex `row` / `row-reverse` holding
list + panels.

The active element is found with a CSS selector
(`[role="tab"][aria-selected="true"]` for `Tabs`, `[aria-current="page"]` for
`TabNav`); the container is the indicator's positioned parent
(`indicator.parentElement`), so no extra root ref is required.

### Shared hook with a geometry callback, not flags

`useSlidingIndicator` is generic: callers pass `indicatorRef`, `activeSelector`,
`watchAttributes`, and `getGeometry({ container, active }) => { x, y, width?,
height? }`. The hook measures with `getBoundingClientRect` in `useLayoutEffect`
and re-measures on active-item changes (a `MutationObserver` on
`watchAttributes`) and layout changes (a `ResizeObserver`). Each component
supplies geometry for its own variants (`T` = 2px bar thickness):

- `rounded` / `pill` → full-box fill `{ x, y, width: active.w, height: active.h }`.
- `line` horizontal → bottom bar `{ x, y: y + h − T, width: active.w, height: T }`.
- `line` vertical `start` → inner (right) bar `{ x: x + w − T, y, width: T, height: h }`.
- `line` vertical `end` → inner (left) bar `{ x, y, width: T, height: h }`.

This keeps the hook agnostic so both components share one implementation.

### `data-animated` marks the JS-enhanced state; the static marker is the fallback

The hook sets `data-animated="true"` on the container on mount (removed on
cleanup). The recipe's static marker renders server-side / pre-hydration; once
the hook activates, recipe rules under `[data-animated="true"]` suppress the
static marker and the measured indicator takes over before paint.

Suppression rules live **inside the same variant slot objects** that define the
static markers, so they share base specificity and win simply by adding the
`[data-animated="true"]` ancestor — no `!important`:

```ts
'[data-animated="true"] &[data-selected]': { boxShadow: "… transparent" }       // line
'[data-animated="true"] &[data-selected]': { backgroundColor: "transparent" }   // rounded / pill
```

(Co-location is also required by the type system: arbitrary selectors are
accepted in `variants.*` slot objects but not in `base.*` or
`compoundVariants[].css`.)

### Snap on first paint, slide thereafter

The indicator is authored at the container's top-left (`top/left: 0`, no
transform) and carries a `transition`. The **first** placement is applied with
the transition momentarily suppressed — the jump is committed with a synchronous
reflow, then the transition is restored — so the indicator appears over the
active item on initial render instead of animating in from the corner.
Subsequent selection changes slide. Re-running the effect (e.g. a
variant/orientation change) also snaps rather than sliding from a stale position.

### Paint order

An absolutely-positioned element paints above static siblings. To keep the
filled highlight **behind** item labels, the recipe gives items `position:
relative; zIndex: 1` under `[data-animated="true"]`, and the indicator uses
`zIndex: 0`. The indicator covers the item strip only (never the panels) and is
`pointer-events: none`.

### Reduced motion

The indicator's transform/size transition is disabled under `@media
(prefers-reduced-motion: reduce)` — the highlight snaps. This is the only motion
control; there is no per-instance prop.

### Deprecated variant aliases

The components accept the previous variant names and resolve them to the current
ones before the recipe sees them — `Tabs` `pills` → `pill`; `TabNav` `tabs` →
`line` — typed `@deprecated`. The recipes define only `line` / `rounded` /
`pill`.

## Risks / Trade-offs

- **Responsive `orientation` / `variant`:** reuse `sysCtx.normalizeValue` (the
  same mechanism `Tabs.Root` already uses for RAC) and re-run the effect when
  the normalized values change (via `deps`).
- **Extra DOM node:** the indicator is `aria-hidden` + non-focusable, so the
  a11y tree is unchanged.
- **Suppression specificity:** addressed by co-locating suppression with the
  static markers (see above).
