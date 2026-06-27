## 1. Shared hook

- [x] 1.1 `useSlidingIndicator` positions an absolute indicator over the active
      item via a caller-supplied `getGeometry`, re-measuring on active-item
      (`MutationObserver`) and layout (`ResizeObserver`) changes, in
      `useLayoutEffect`. No-op when `enabled` is false.
- [x] 1.2 On activation the hook sets `data-animated="true"` on the container
      (removed on cleanup), so the recipe's static marker stays the no-JS /
      pre-hydration fallback.

## 2. Recipes — unified variants

- [x] 2.1 Both `tabs.recipe.ts` and `tab-nav.recipe.ts` expose `underline`
      (default), `rounded`, `pill`. `rounded`/`pill` share a `highlight*Base`
      fragment (themeable `colorPalette`); `tab-nav` and `tabs` mirror each
      other. `base.root` is `position: relative`.
- [x] 2.2 `Tabs` `underline` keeps the orientation/placement `compoundVariants`;
      the flawed `pills` outline-box implementation is removed.
- [x] 2.3 `[data-animated="true"]` rules: tabs get `position/zIndex` and the
      static marker is suppressed (underline `boxShadow`, rounded/pill
      background). VISUAL TWIN comments updated to cover all three variants.

## 3. Components — always animate + aliases

- [x] 3.1 Remove the `animated` prop from both. Always render the indicator and
      call `useSlidingIndicator`.
- [x] 3.2 Normalize deprecated aliases before the recipe sees them
      (`line`/`tabs` → `underline`, `pills` → `pill`).
- [x] 3.3 Indicator appearance keyed off the resolved variant (bar vs filled;
      `Tabs` keeps the orientation/placement `getGeometry`).

## 4. Types, stories, docs

- [x] 4.1 `variant` types add the deprecated alias literals with `@deprecated`
      JSDoc; `animated` removed.
- [x] 4.2 Stories: argTypes → `underline/rounded/pill`, `animated` control
      removed, stories retargeted, deprecated-alias smoke tests added.
- [x] 4.3 `*.mdx` / `*.dev.mdx` + `tab-nav.tsx` JSDoc updated (new names,
      animation-by-default, reduced-motion, aliases).

## 5. Verify

- [x] 5.1 `build-theme-typings` → `typecheck` (clean).
- [x] 5.2 `build` → `pnpm test` for both story files (green, incl. alias smoke
      tests).
- [ ] 5.3 `pnpm exec eslint` on changed files; manual reduced-motion / vertical
      check; push to PR #1686.
