## Why

`TabNav` recently gained an opt-in `animated` mode: a single active-highlight
indicator that slides between items as the active item changes (an underline bar
for the `tabs` variant, a filled highlight for `filled`/`pill`), gated behind
`prefers-reduced-motion`. The same motion is a natural fit for the `Tabs`
component — but `Tabs` is more involved: it supports `orientation`
(`horizontal` | `vertical`), `placement` (`start` | `end`), and a `pills`
variant, each of which puts the active marker on a different edge (bottom / right
/ left) or turns it into a filled background. `orientation` is also resolved at
runtime (React Aria can't take responsive values, so `Tabs.Root` already
normalizes it), so a literal read of the prop is not enough.

Rather than copy `TabNav`'s inline measure-and-slide logic into `Tabs` (and have
it drift), this change extracts that logic into a small, reusable hook and uses
it to drive a variant-aware sliding indicator on `Tabs`.

## What Changes

- Add `useSlidingIndicator`, a reusable hook in `packages/nimbus/src/hooks` that
  positions an absolutely-placed indicator element over the active item inside a
  container and keeps it in sync. It is DOM-driven (measures via
  `getBoundingClientRect`), re-measures on active-item changes
  (`MutationObserver`) and layout changes (`ResizeObserver`), measures
  synchronously before paint (`useLayoutEffect`, no first-frame flash), and is a
  no-op when disabled. The caller supplies how to find the active item
  (`activeSelector`), which attributes to watch, and a `getGeometry` callback
  that maps the container + active rects to indicator geometry — so the same
  hook serves an underline bar, a side bar, or a filled highlight.
- Add an opt-in `animated?: boolean` prop to `Tabs.Root`. When `true`, `Tabs`
  renders a single `aria-hidden`, non-focusable indicator inside the root and
  drives it with `useSlidingIndicator`. The indicator adapts to the resolved
  `variant` / `orientation` / `placement`:
  - `line` + horizontal → a thin bar on the active tab's bottom edge.
  - `line` + vertical + `start` → a thin bar on the active tab's right edge.
  - `line` + vertical + `end` → a thin bar on the active tab's left edge.
  - `pills` → a filled, fully-rounded highlight behind the active tab.
- Suppress the static selected marker (the `boxShadow` underline / `pills`
  background) while `animated` is active so the sliding indicator owns the
  highlight — no double marker. The static marker remains the fallback when
  `animated` is off.
- The slide transition is disabled under `prefers-reduced-motion: reduce` (the
  highlight snaps), and `aria-selected` / focus rings / keyboard (roving
  tabindex) are unaffected — the indicator is purely decorative.
- `animated` defaults to `false`, so the default `Tabs` look and behavior are
  unchanged. No changes to `Tabs.Tab` / `Tabs.Panel` semantics.

## Impact

- Affected specs: `nimbus-use-sliding-indicator` (new), `nimbus-tabs` (added
  requirement).
- Affected code: `packages/nimbus/src/hooks/use-sliding-indicator/*` (new),
  `tabs.types.ts`, `tabs.recipe.ts`, `components/tabs.root.tsx`,
  `tabs.stories.tsx`, `tabs.dev.mdx` / `tabs.mdx`.
- `TabNav.Root` adopts `useSlidingIndicator` too: its animated indicator (an
  underline bar for `tabs`, a filled highlight for `filled`/`pill`) is refactored
  off its inline measure-and-slide logic onto the shared hook, so both
  components share one implementation.
- The `tabs` ↔ `TabNav` VISUAL TWIN contract is preserved: the static look is
  unchanged, and the animation is additive and opt-in.
