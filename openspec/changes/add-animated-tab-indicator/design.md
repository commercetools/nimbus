## Context

`Tabs` is built on React Aria Components (`Tabs` / `TabList` / `Tab` / `TabPanel`).
`Tabs.Root` renders `<TabsRootSlot asChild><RATabs>…</RATabs></TabsRootSlot>`, and
already normalizes the responsive `orientation` prop to a concrete value via
`sysCtx.normalizeValue` because RAC cannot consume responsive values.

The active marker today is static, defined in the recipe:

- `line` markers are `boxShadow` declarations in `compoundVariants`, one per
  `orientation`/`placement` combination (bottom / right / left edge).
- `pills` selected state is `backgroundColor: primary.3` in the `pills` variant.

## Goals / Non-Goals

- Goal: an opt-in, variant-aware sliding indicator for `Tabs` that reuses one
  shared implementation with `TabNav`.
- Goal: correctness across `orientation` × `placement` × `variant`, including
  runtime-resolved (responsive) `orientation`.
- Non-Goal: changing the static (non-animated) appearance or any a11y/keyboard
  behavior.
- Non-Goal: refactoring `TabNav` onto the hook in this change (follow-up).

## Decisions

### Indicator lives in the root, not the list

The indicator is rendered as the first child of `RATabs` (the root element, made
`position: relative` when animated) rather than inside `TabList`. Two reasons:

1. React Aria's `TabList` renders a **collection**; injecting an arbitrary
   non-`Tab` child is unsupported. The root element has no such restriction.
2. Absolute positioning against the root works for **every** layout — in
   vertical / `placement="end"` the root is a flex `row` / `row-reverse` holding
   list + panels, and measuring `activeTabRect − rootRect` is correct regardless.

The active tab is found with `[role="tab"][aria-selected="true"]`; the container
is the indicator's positioned parent (`indicator.parentElement`), so no extra
root ref is required.

### Paint order

An absolutely-positioned element paints above static siblings. To keep the
indicator **behind** tab labels (needed for the `pills` fill), the recipe gives
tabs `position: relative; zIndex: 1` while `[data-animated="true"]`, and the
indicator uses `zIndex: 0`. The indicator is geometrically over the tab strip
only, never the panels, and is `pointer-events: none`.

### Geometry callback, not flags

`useSlidingIndicator` is generic: the caller passes `getGeometry({ container,
active }) => { x, y, width?, height? }`. `Tabs` computes geometry from the
**normalized** `variant` / `orientation` / `placement`:

- `pills` → `{ x, y, width: active.w, height: active.h }` (full box, radius full).
- `line` horizontal → bottom bar `{ x, y: y + h − T, width: active.w, height: T }`.
- `line` vertical `start` → right bar `{ x: x + w − T, y, width: T, height: h }`.
- `line` vertical `end` → left bar `{ x, y, width: T, height: h }`.

where `T` is the 2px bar thickness. This keeps the hook agnostic and lets
`TabNav` pass its own geometry later.

### Suppressing the static marker

Suppression rules are added **inside the same recipe blocks** that define the
static markers (the `line` `compoundVariants` and the `pills` variant), so they
inherit the same base specificity and only add a `[data-animated="true"]`
ancestor — guaranteeing they win without `!important`:

```ts
'[data-animated="true"] &[data-selected]': { boxShadow: "… transparent" } // line
'[data-animated="true"] &[data-selected]': { backgroundColor: "transparent" } // pills
```

### Reduced motion

The indicator element carries the transform/size transition, disabled via
`@media (prefers-reduced-motion: reduce)` — the highlight snaps into place.

## Risks / Trade-offs

- **Responsive orientation:** mitigated by reusing `sysCtx.normalizeValue` (the
  same mechanism `Tabs.Root` already uses for RAC) and re-running the effect when
  the normalized values change.
- **Extra DOM node** (the indicator) only renders when `animated` is set, and is
  `aria-hidden` + non-focusable, so the a11y tree is unchanged.
- **Specificity of suppression:** addressed by co-locating suppression with the
  static markers (see above).
