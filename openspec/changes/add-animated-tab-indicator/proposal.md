## Why

`Tabs` and `TabNav` are visual twins, but they expose different variant sets and
render a **static** active marker that snaps between items. `Tabs`' `pills`
variant is also flawed: a hardcoded `primary` color, an outline-box container, no
hover, and not themeable. This change gives both components one shared variant
set and replaces the static marker with a single indicator that slides between
items.

## What Changes

- **One shared variant set for both components**: `line` (default), `rounded`
  (soft rounded-rect highlight), `pill` (capsule highlight). `line` is a bar on
  the active item — an underline when horizontal, an inner side bar when
  vertical. The `rounded`/`pill` highlights are themeable via `colorPalette`.
  (`Tabs` additionally layers `orientation`/`placement` onto `line`.)
- **The active marker is a single sliding indicator.** It slides between
  items/tabs as the selection changes — a bar for `line`, a filled highlight for
  `rounded`/`pill`. It is `aria-hidden`/non-focusable and
  respects `prefers-reduced-motion: reduce` (snaps). There is no per-instance
  toggle; the only "off" switch is the OS-level reduced-motion preference (the
  only motion lever Nimbus has).
- **Shared `useSlidingIndicator` hook** drives both components. It sets
  `data-animated` on the container on mount, so the recipe's static marker is the
  SSR / pre-hydration / no-JS fallback and the measured slide takes over before
  paint (no flash). The first placement snaps into position; only subsequent
  selection changes slide.
- **`Tabs` `pills` is reimplemented** to match `TabNav`'s themeable highlight
  (drop the outline-box container and the `primary.3` hardcode).
- **Deprecated aliases (non-breaking)**: `Tabs` accepts `pills` (→ `pill`);
  `TabNav` accepts `tabs` (→ `line`). Resolved at runtime in the component and
  typed as `@deprecated`, so existing consumers keep working with no edits.

## Impact

- Affected specs: `nimbus-use-sliding-indicator` (new), `nimbus-tabs` (added
  requirement).
- Affected code: `hooks/use-sliding-indicator/*`; for both `tabs` and `tab-nav`:
  `*.recipe.ts`, `*.types.ts`, `components/*.root.tsx`, `*.stories.tsx`,
  `*.mdx`/`*.dev.mdx` (+ `tab-nav.tsx` JSDoc).
- The `TabNav` default changes from `tabs` to `line` (`Tabs` stays `line`); both
  are transparent because consumers that omit `variant` are unaffected and `tabs`
  remains a valid alias.
- The two docs-app `Tabs` usages with `variant="pills"` keep working via the
  alias (no edits required).
- The `Tabs` ↔ `TabNav` VISUAL TWIN contract now covers all three variants.
