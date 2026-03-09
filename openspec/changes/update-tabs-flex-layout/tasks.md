## 1. Implementation

- [x] 1.1 Add `flex: "1"` and `minHeight: "0"` to the `root` base styles in
      `packages/nimbus/src/components/tabs/tabs.recipe.ts`

## 2. Validation

- [ ] 2.1 Verify Tabs still renders correctly in isolation (non-flex parent)
- [ ] 2.2 Verify Tabs scrolls correctly inside DetailPage (flex-column parent)
- [ ] 2.3 Run existing Tabs storybook tests (`pnpm test packages/nimbus/src/components/tabs/tabs.stories.tsx`)
- [ ] 2.4 Run DetailPage storybook tests (`pnpm test packages/nimbus/src/components/detail-page/detail-page.stories.tsx`)
