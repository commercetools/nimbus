## 1. Shared hook

- [x] 1.1 `useSlidingIndicator` positions an absolute indicator over the active
      item via a caller-supplied `getGeometry`, re-measuring on active-item
      (`MutationObserver`) and layout (`ResizeObserver`) changes, in
      `useLayoutEffect`. No-op when `enabled` is false.
- [x] 1.2 On activation the hook sets `data-animated="true"` on the container
      (removed on cleanup), so the recipe's static marker stays the no-JS /
      pre-hydration fallback.
- [x] 1.3 The first placement snaps (transition suppressed, jump committed with
      a synchronous reflow, transition restored), so the indicator appears over
      the active item on first paint instead of sliding in from the corner;
      subsequent selection changes slide.

## 2. Recipes — unified variants

- [x] 2.1 Both `tabs.recipe.ts` and `tab-nav.recipe.ts` expose `line` (default),
      `rounded`, `pill`. `rounded`/`pill` share a `highlight*Base` fragment
      (themeable `colorPalette`); `tab-nav` and `tabs` mirror each other.
      `base.root` is `position: relative`.
- [x] 2.2 `Tabs` `line` layers the orientation/placement `compoundVariants`
      (bottom / inner-edge bar); `rounded`/`pill` are a themeable filled
      highlight (no outline-box container).
- [x] 2.3 `[data-animated="true"]` rules: items get `position/zIndex` and the
      static marker is suppressed (line `boxShadow`, rounded/pill background).
      VISUAL TWIN comments cover all three variants.

## 3. Components — sliding indicator + aliases

- [x] 3.1 Both roots render the indicator and call `useSlidingIndicator`; the
      slide is always on, with no per-instance toggle.
- [x] 3.2 Deprecated aliases are resolved before the recipe sees them
      (`tabs` → `line`, `pills` → `pill`).
- [x] 3.3 Indicator appearance is keyed off the resolved variant (bar vs filled;
      `Tabs` adds the orientation/placement `getGeometry`).

## 4. Types, stories, docs

- [x] 4.1 `variant` types are `line | rounded | pill` plus the deprecated alias
      literals, documented with `@deprecated` JSDoc.
- [x] 4.2 Stories: argTypes → `line/rounded/pill`; play functions are
      interactive (clicking an item moves the active marker and slides the
      indicator), with deprecated-alias smoke tests.
- [x] 4.3 `*.mdx` / `*.dev.mdx` + `tab-nav.tsx` JSDoc cover the variant names,
      animation-by-default, reduced-motion, and aliases.

## 5. Verify

- [x] 5.1 `build-theme-typings` → `typecheck` (clean).
- [x] 5.2 `build` → `pnpm test` for both story files (green, incl. the slide and
      deprecated-alias assertions).
- [x] 5.3 `pnpm exec eslint` on changed files (clean); reduced-motion handled via
      the `prefers-reduced-motion` media query.
