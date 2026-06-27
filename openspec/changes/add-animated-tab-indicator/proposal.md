## Why

`Tabs` and `TabNav` are visual twins but had diverged: different variant sets
(`Tabs` = `line`|`pills`; `TabNav` = `tabs`|`filled`|`pill`), a static active
marker, and — in an earlier iteration — an opt-in `animated` prop. In use, the
sliding active indicator is strictly better than the static marker, the two
components should expose the SAME variants, and `Tabs`' `pills` variant was
flawed (hardcoded `primary`, an outline-box container, no hover, not themeable).

## What Changes

- **One shared variant set for both components**: `underline` (default),
  `rounded` (soft rounded-rect highlight), `pill` (capsule highlight). The
  `rounded`/`pill` highlights are themeable via `colorPalette`. (`Tabs`
  additionally layers `orientation`/`placement` onto `underline`.)
- **The sliding indicator is the default** (no `animated` prop). The active
  marker is a single element that slides between items/tabs as the selection
  changes — an underline bar for `underline`, a filled highlight for
  `rounded`/`pill`. It is `aria-hidden`/non-focusable and respects
  `prefers-reduced-motion: reduce` (snaps). The only "off" switch is the OS-level
  reduced-motion preference (the only motion lever Nimbus has).
- **Shared `useSlidingIndicator` hook** drives both components. It sets
  `data-animated` on the container on mount, so the recipe's static marker is the
  SSR / pre-hydration / no-JS fallback and the measured slide takes over before
  paint (no flash).
- **`Tabs` `pills` is reimplemented** to match `TabNav`'s themeable highlight
  (drop the outline-box container and the `primary.3` hardcode).
- **Deprecated aliases (non-breaking)**: `Tabs` accepts `line` (→ `underline`)
  and `pills` (→ `pill`); `TabNav` accepts `tabs` (→ `underline`). Resolved at
  runtime in the component and typed as `@deprecated`, so existing consumers keep
  working with no edits.

## Impact

- Affected specs: `nimbus-use-sliding-indicator` (new), `nimbus-tabs` (added
  requirement).
- Affected code: `hooks/use-sliding-indicator/*`; for both `tabs` and `tab-nav`:
  `*.recipe.ts`, `*.types.ts`, `components/*.root.tsx`, `*.stories.tsx`,
  `*.mdx`/`*.dev.mdx` (+ `tab-nav.tsx` JSDoc).
- Default variant changes (`line`/`tabs` → `underline`) are transparent because
  consumers that omit `variant` are unaffected and the old names remain valid
  aliases.
- The two docs-app `Tabs` usages with `variant="pills"` keep working via the
  alias (no edits required).
- The `Tabs` ↔ `TabNav` VISUAL TWIN contract now covers all three variants.
