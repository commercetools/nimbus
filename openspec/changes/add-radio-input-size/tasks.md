## 1. Recipe and types

- [x] 1.1 Add `size` variant (`sm`, `md`, default `md`) to `radio-input.recipe.ts` with text style and indicator size
- [x] 1.2 Set the gaps: row 16px, stacked 8px (`sm`) and 12px (`md`)
- [x] 1.3 Remove the fixed `fontSize` and `lineHeight` from the base option styles
- [x] 1.4 Add the `size` prop with JSDoc to `radio-input.types.ts`

## 2. Tests and docs

- [x] 2.1 Add a `Sizes` story with play function that checks font size and indicator size for `sm`, `md` and the default
- [x] 2.2 Add a "Sizes" section to `radio-input.dev.mdx`
- [x] 2.3 Check `radio-input.mdx` and `radio-input.guidelines.mdx` for size guidance that needs an update

## 3. Release

- [x] 3.1 Replace the patch changeset with a minor changeset for the `size` prop
- [x] 3.2 Run lint, `typecheck:dev` and the RadioInput story tests
- [ ] 3.3 Update the PR description
