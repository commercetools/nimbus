## 1. Confirm RAC behavior (spike)

- [x] 1.1 Verify whether RAC `Breadcrumbs` emits `role="list"` on its `<ol>` in 1.19.0; decide if an explicit `role="list"` is needed (design D5)
- [x] 1.2 Confirm the RAC `items` + render-function collection shape and how `onAction(key)` keys are derived, to fix the declarative API surface (design D3, Open Questions)
- [x] 1.3 Confirm how a decorative separator can be injected once and shared by both the compound and `items` paths (design D4)

## 2. Types (public API)

- [x] 2.1 Rewrite `breadcrumbs.types.ts`: remove `isCurrent`; keep `separator` (default `›`) and `size` on Root; keep `href`/`target`/`rel`/`isDisabled` on Item
- [x] 2.2 Add declarative `items` (+ render function) typing to the Root props
- [x] 2.3 Add typed `onAction` on Root and `routerOptions` on Item (parity with `Tabs`/`Link`); type link handlers against RAC link options, not raw anchor `onClick`
- [x] 2.4 JSDoc every prop; correct `@default` and `@example` (default separator `›`)

## 3. Failing tests first (TDD — stories)

- [x] 3.1 Base: nav landmark + `aria-label`, `<ol>` with `role="list"`, listitem count, non-final items are links to `href`
- [x] 3.2 Automatic current: last item has `aria-current="page"`, is non-interactive, exposes no `link` role, and is skipped by Tab
- [x] 3.3 Separator: assert the separator renders between items, has the expected text/node, carries `aria-hidden="true"`, and no leading separator before the first item
- [x] 3.4 Sizes: assert a real `sm`-vs-`md` difference (e.g. differing computed font-size / gap), not just that two navs render
- [x] 3.5 Disabled item: `aria-disabled="true"`, no `href`, and NOT focusable across a full Tab sweep
- [x] 3.6 Declarative `items` API renders an equivalent trail with the same last-is-current semantics
- [x] 3.7 Edge cases: single-item trail (that item is current); empty items/children render nav+ol without throwing
- [x] 3.8 Router: `onAction` fires with the item key on press; `routerOptions` is forwarded

## 4. Implementation

- [x] 4.1 Implement `components/breadcrumbs.root.tsx` on `RaBreadcrumbs` (root/list slots via `withProvider`), supporting compound children and `items` render function; wire `aria-label`, `onAction`, `size`
- [x] 4.2 Implement `components/breadcrumbs.item.tsx` on `RaBreadcrumb` composing `RaLink` (link slot via `asChild`); forward `href`/`target`/`rel`/`isDisabled`/`routerOptions`; use `Ra`-prefixed import aliases
- [x] 4.3 Render the decorative `aria-hidden` separator between items via the separator slot, shared by both authoring paths
- [x] 4.4 Apply explicit `role="list"` on the list slot if step 1.1 showed RAC does not guarantee it
- [x] 4.5 Add a dev-time warning when `Breadcrumbs.Root` is rendered without `aria-label` (no hardcoded default string)
- [x] 4.6 Author `breadcrumbs.slots.tsx` and `breadcrumbs.recipe.ts`: namespaced `--breadcrumbs-*` vars, `:first-of-type` separator hiding, and current/disabled styling targeting RAC-managed `data-current`/`data-disabled`
- [x] 4.7 Author `breadcrumbs.tsx` namespace exports + JSDoc examples, including the `_`-prefixed docgen exports pattern
- [x] 4.8 Register the recipe in the theme slot-recipe config and export `Breadcrumbs` from the package barrel

## 5. Docs

- [x] 5.1 Author `breadcrumbs.mdx`, `breadcrumbs.dev.mdx`, `breadcrumbs.a11y.mdx` and `breadcrumbs.docs.spec.tsx` (compound + `items` examples, no `isCurrent`); ensure examples compile against the real API
- [x] 5.2 Add a "when to use / when NOT to use" guidelines block (do's and don'ts)
- [x] 5.3 Document the RAC rationale (why the component is built on `Breadcrumbs`/`Breadcrumb`) in the engineering doc
- [x] 5.4 Note the out-of-scope follow-ups (overflow/collapse, RTL separator glyph) in the docs

## 6. Verify

- [x] 6.1 `pnpm --filter @commercetools/nimbus typecheck:dev` clean
- [x] 6.2 Build the package, then run `pnpm test packages/nimbus/src/components/breadcrumbs/breadcrumbs.stories.tsx` against `dist` — all play functions green
- [x] 6.3 `pnpm lint` clean for the touched files
- [x] 6.4 Add a changeset describing the new Breadcrumbs component (consumer-facing)

## 7. Chromatic visual regression (added after FCT-1100 landed)

- [x] 7.1 Instrument `breadcrumbs.stories.tsx` for Chromatic per `docs/chromatic-visual-testing.md`: opt visual-state stories in via `tags: ["vrt"]` + `chromatic: { disableSnapshot: false }` (Sizes, CustomSeparator, Focused, Disabled, SmokeTest); explicitly opt behaviour-only stories out (`disableSnapshot: true`)
- [x] 7.2 Add a render-only `Disabled` visual story (dimmed item, no focus) and a `Focused` story that ends focused to capture the focus-visible ring — keeping the tab-skipping behaviour assertions in `WithDisabledItem`/`KeyboardNavigation` snapshot-off (no stray focus rings in visual baselines)
- [ ] 7.3 Accept the initial Breadcrumbs snapshots as baselines on the Chromatic `UI Tests` build once the PR runs (out-of-band, in the Chromatic UI)
