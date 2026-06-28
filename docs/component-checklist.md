# Well-Shaped Component Checklist

A single go/no-go gate to verify a component is ready — shape, accessibility,
files, styling, types, tests, docs, and (critically) that it can evolve without
breaking consumers. Each item links the canonical doc; this page is the index,
not the source of truth. Use it in `/review` and before opening a PR.

[← Back to Component Guidelines](./component-guidelines.md)

## 1. API shape & public contract

- [ ] This is genuinely a **component**, not a layout pattern — decided per
      [component-vs-pattern](./file-type-guidelines/component-vs-pattern.md).
- [ ] Public props follow the
      [Public API naming contract](./naming-conventions.md#public-api-prop-naming-consumer-contract):
      `is*` booleans, React Aria handler names kept (`onPress`, `on…Change`),
      controlled/uncontrolled `value`/`defaultValue`/`on…Change` triad.
- [ ] React Aria prop types are **spread/inherited**, not re-typed by hand, so
      consumers get accurate, complete types.
- [ ] No DOM attribute (`disabled`, `onClick`, `tabIndex`) is promoted as the
      API; if accepted for compat, it's `@deprecated` toward the RA equivalent.
- [ ] Public surface is intentional — nothing internal leaked into exports
      ([API surface](./api-evolution.md#the-public-api-surface-what-consumers-depend-on)).

## 2. Accessibility (WCAG 2.1 AA)

- [ ] Built on React Aria for interaction/focus/ARIA; keyboard operable.
- [ ] Has a `{component}.a11y.mdx` documenting the a11y behavior.
- [ ] A11y is exercised by a story play function (see §6).

## 3. Files present

- [ ] Matches the real set in
      [Component File Structure](./component-guidelines.md#component-file-structure-reference):
      `index.ts`, `{c}.tsx`, `{c}.types.ts`, `{c}.recipe.ts`, `{c}.slots.tsx`,
      `{c}.stories.tsx`, `{c}.mdx`, `{c}.dev.mdx`, `{c}.guidelines.mdx`,
      `{c}.a11y.mdx`, `{c}.docs.spec.tsx`, `{c}.figma.tsx` (Figma-designed).
- [ ] Files are **flat** (no `recipes/` subfolder); extensions correct
      (`.recipe.ts`, `.slots.tsx`, `.types.ts` unless it contains JSX).

## 4. Styling & recipe

- [ ] Recipe uses `defineRecipe` / `defineSlotRecipe` with `className`, `base`,
      variants, `defaultVariants`
      ([recipes](./file-type-guidelines/recipes.md)).
- [ ] **Registered in the correct registry under a `nimbus`-prefixed key** —
      standard → `theme/recipes/index.ts`, slot → `theme/slot-recipes/index.ts`
      ([registration](./file-type-guidelines/recipes.md#recipe-registration-is-required)).
- [ ] Tokens used instead of hard-coded values.

## 5. Slots & types

- [ ] Slots use `SlotComponent` from `@/type-utils`; each slot sets `data-slot`
      and the slot file exports both component and its props type
      ([slots](./file-type-guidelines/slots.md)).
- [ ] Types are layered (recipe → slot → public) with the nimbus-prefixed key in
      `RecipeProps`/`SlotRecipeProps`
      ([types](./file-type-guidelines/types.md)).
- [ ] Every public prop has JSDoc ([jsdoc-standards](./jsdoc-standards.md)).

## 6. Tests & stories

- [ ] Stories cover all states + interactions with **play functions**, including
      keyboard and disabled paths ([stories](./file-type-guidelines/stories.md),
      [testing-strategy](./file-type-guidelines/testing-strategy.md)).
- [ ] Story queries match what the component renders (e.g. `data-slot` selectors
      only if the component sets them).
- [ ] `{c}.docs.spec.tsx` provides copyable consumer examples.

## 7. Docs

- [ ] `{c}.mdx` (designer), `{c}.dev.mdx` (engineering), `{c}.guidelines.mdx`
      present and accurate
      ([documentation](./file-type-guidelines/documentation.md)).

## 8. Exports & build

- [ ] `index.ts` exports the component and its `{Component}Props`.
- [ ] Cross-component imports go to implementation files, not barrels
      ([cross-chunk rule](./component-guidelines.md#cross-chunk-import-pattern-critical)).
- [ ] `pnpm typecheck` and `pnpm lint` pass; stories pass with `pnpm test:dev`.

## 9. Evolution safety (don't break consumers)

- [ ] The PR has a **changeset** with the correct bump
      ([bump-type](./changeset-conventions.md#bump-type)).
- [ ] If anything changed on an existing component, it was done **additively**;
      any replaced prop is kept + `@deprecated`, not removed
      ([API Evolution](./api-evolution.md#additive-first-the-default-that-keeps-you-fast)).
- [ ] Any genuine breaking change is a `major` with a migration note
      ([breaking changes](./api-evolution.md#breaking-changes-major--the-last-resort)).
