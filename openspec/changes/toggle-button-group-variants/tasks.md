## 1. Recipe — add variant dimension

- [ ] 1.1 Refactor `toggle-button-group.recipe.tsx`: move hardcoded outline/solid button base styles into a `variant.outline` entry under `variants`
- [ ] 1.2 Add `variant.ghost` — no border, gap between buttons, individual radius; selected state with tinted background
- [ ] 1.3 Add `variant.solid` — solid fill always, joined layout; stronger fill when selected
- [ ] 1.4 Add `variant.subtle` — light tinted background, gap between buttons, individual radius; stronger tint when selected
- [ ] 1.5 Add `variant.segmented` — root gets background track, buttons have no border, selected button gets elevation/shadow
- [ ] 1.6 Set `defaultVariants.variant` to `"outline"` to preserve backward compatibility

## 2. Types — add variant prop

- [ ] 2.1 Add `variant` to `ToggleButtonGroupRecipeVariantProps` in `toggle-button-group.types.tsx` with JSDoc, typed from `SlotRecipeProps<"nimbusToggleButtonGroup">["variant"]`

## 3. Stories — demonstrate variants

- [ ] 3.1 Add a `Variants` story to `toggle-button-group.stories.tsx` showing all five variants side by side with selected state
- [ ] 3.2 Add play function to `Variants` story testing that each variant renders and selection toggles correctly
- [ ] 3.3 Update `ColorPalettes` story to include variant dimension if not already covered

## 4. Verification

- [ ] 4.1 Run `pnpm --filter @commercetools/nimbus typecheck:dev` to verify type correctness
- [ ] 4.2 Run `pnpm test:dev` on toggle-button-group stories to verify tests pass
- [ ] 4.3 Visually verify all variants in Storybook render correctly in both light and dark mode
