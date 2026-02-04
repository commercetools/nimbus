# Implementation Tasks: Add Steps Component

## Task Checklist

### Phase 1: Component Scaffolding (Day 1)

- [x] **Task 1.1: Create component directory structure**
  - Create `/packages/nimbus/src/components/steps/` directory
  - Create shell files: `index.ts`, `steps.tsx`, `steps.types.ts`,
    `steps.recipe.ts`, `steps.slots.tsx`, `steps.stories.tsx`
  - Validation: Directory structure matches Nimbus conventions

- [x] **Task 1.2: Define TypeScript types**
  - Implement four-layer type architecture in `steps.types.ts`
  - Define recipe props (size, orientation, state variants)
  - Define slot props for all 8 slots (root, list, item, indicator, separator,
    content, label, description)
  - Define main props with comprehensive JSDoc
  - Export all types
  - Validation: `pnpm --filter @commercetools/nimbus typecheck` passes

- [x] **Task 1.3: Create Chakra UI v3 slot recipe**
  - Implement recipe in `steps.recipe.ts` with all 8 slots
  - Define base styles for each slot
  - Implement size variants (xs, sm, md) with correct token values
  - Implement orientation variants (horizontal, vertical)
  - Implement state variants (incomplete, current, complete)
  - Set default variants: size="sm", orientation="horizontal",
    state="incomplete"
  - Validation: Recipe compiles without errors

### Phase 2: Core Implementation (Day 2)

- [x] **Task 2.1: Implement slot components**
  - Create slot components in `steps.slots.tsx`
  - Implement: StepsRootSlot, StepsListSlot, StepsItemSlot, StepsIndicatorSlot,
    StepsSeparatorSlot, StepsContentSlot, StepsLabelSlot, StepsDescriptionSlot
  - Apply `createSlotRecipeContext` pattern
  - Validation: All slots render without errors

- [x] **Task 2.2: Implement context and core components**
  - Create StepsContext with step, count, size, orientation
  - Implement useStepsContext hook with error handling
  - Implement Steps.Root with context provider
  - Implement Steps.List with role="list"
  - Implement Steps.Item with state derivation logic and role="listitem"
  - Implement Steps.Indicator with numeric/icon type handling
  - Implement Steps.Separator with orientation-aware rendering
  - Validation: Components render and context flows correctly

- [x] **Task 2.3: Implement content components**
  - Implement Steps.Content wrapper
  - Implement Steps.Label with typography
  - Implement Steps.Description with conditional rendering
  - Validation: Content components render with correct styling

- [x] **Task 2.4: Implement compound component namespace**
  - Export namespace object in `steps.tsx`
  - Ensure Root is first property
  - Add displayName to all components
  - Validation: Import and usage works:
    `<Steps.Root><Steps.List>...</Steps.List></Steps.Root>`

- [x] **Task 2.5: Register recipe in theme config**
  - Add recipe to `/packages/nimbus/src/theme/slot-recipes/index.ts`
  - Export as "nimbusSteps"
  - Validation: `pnpm --filter @commercetools/nimbus build-theme-typings`
    succeeds

- [x] **Task 2.6: Export from package**
  - Add Steps export to `/packages/nimbus/src/components/index.ts`
  - Validation: Can import Steps from `@commercetools/nimbus`

### Phase 3: Testing Implementation (Day 3)

- [x] **Task 3.1: Create basic Storybook stories**
  - Create `steps.stories.tsx` with Default story
  - Implement stories for all size variants (xs, sm, md)
  - Implement stories for both orientations
  - Implement stories for both indicator types (numeric, icon)
  - Validation: Stories render in Storybook

- [x] **Task 3.2: Implement play functions for interaction testing**
  - Add play function to Default story testing:
    - List has role="list"
    - Items have role="listitem"
    - Current step has aria-current="step"
    - State data attributes (data-state="incomplete|current|complete")
  - Add StateTransitions story with dynamic step changes
  - Add play function testing state updates
  - Validation: Play functions pass in Storybook

- [x] **Task 3.3: Implement variant coverage stories**
  - Create AllSizes story displaying xs, sm, md side by side
  - Create BothOrientations story displaying horizontal and vertical
  - Create NumericVsIcon story comparing both indicator types
  - Create CompactNoDescription story (labels only)
  - Validation: All variants display correctly

- [x] **Task 3.4: Implement accessibility tests**
  - Create AccessibilityCompliance story
  - Add play function with axe accessibility tests
  - Test semantic HTML structure
  - Test ARIA attributes
  - Test keyboard navigation (if applicable)
  - Validation: No accessibility violations

- [x] **Task 3.5: Build and run tests**
  - Run `pnpm --filter @commercetools/nimbus build`
  - Run `pnpm test:storybook` for Steps stories
  - Fix any test failures
  - Validation: All Storybook tests pass

### Phase 4: Documentation (Day 4)

- [x] **Task 4.1: Create developer documentation**
  - Create `steps.dev.mdx` file
  - Document component purpose and features
  - Include basic usage example
  - Document all variants (sizes, orientations, indicator types)
  - Include integration example with form navigation
  - Document accessibility features
  - Include API reference section (auto-generated from JSDoc)
  - Validation: Documentation renders in docs site

- [x] **Task 4.2: Create designer guidelines**
  - Create `steps.guidelines.mdx` file
  - Document "When to Use" and "When NOT to Use"
  - Provide size selection guidance
  - Provide orientation selection guidance
  - Include content writing guidelines
  - Document indicator type selection criteria
  - Include visual examples
  - Validation: Guidelines render in docs site

- [x] **Task 4.3: Verify JSDoc completeness**
  - Review all prop types have JSDoc descriptions
  - Ensure all components have JSDoc summaries
  - Add @example blocks to main components
  - Add @default tags for default values
  - Validation: API docs generate correctly

### Phase 5: Final Validation (Day 5)

- [x] **Task 5.1: Run full test suite**
  - Run `pnpm build` (full monorepo build)
  - Run `pnpm test` (all tests)
  - Run `pnpm lint`
  - Run `pnpm typecheck:strict`
  - Validation: All checks pass

- [x] **Task 5.2: Manual testing**
  - Test in Storybook with different content lengths
  - Test with long labels and descriptions
  - Test edge cases (single step, all complete)
  - Test with custom icons
  - Test responsive behavior
  - Validation: Component behaves correctly in all scenarios

- [x] **Task 5.3: OpenSpec validation**
  - Run `pnpm openspec validate add-steps-component --strict`
  - Fix any validation errors
  - Validation: OpenSpec validation passes

- [x] **Task 5.4: Documentation review**
  - Build docs site: `pnpm build:docs`
  - Start docs site: `pnpm start:docs`
  - Review Steps documentation pages
  - Verify all examples work
  - Verify API reference is complete
  - Validation: Documentation is complete and accurate

## Task Dependencies

```
Phase 1 (Scaffolding)
  ├─ 1.1 → 1.2 → 1.3 (sequential)

Phase 2 (Implementation)
  ├─ 2.1 (depends on 1.2, 1.3)
  ├─ 2.2 (depends on 2.1)
  ├─ 2.3 (depends on 2.1)
  ├─ 2.4 (depends on 2.2, 2.3)
  ├─ 2.5 (depends on 1.3)
  └─ 2.6 (depends on 2.4)

Phase 3 (Testing)
  ├─ 3.1 (depends on 2.6)
  ├─ 3.2 (depends on 3.1)
  ├─ 3.3 (depends on 3.1)
  ├─ 3.4 (depends on 3.1)
  └─ 3.5 (depends on 3.2, 3.3, 3.4)

Phase 4 (Documentation)
  ├─ 4.1 (depends on 2.6)
  ├─ 4.2 (depends on 2.6)
  └─ 4.3 (depends on 2.6, 4.1)

Phase 5 (Validation)
  ├─ 5.1 (depends on Phase 3, Phase 4)
  ├─ 5.2 (depends on 5.1)
  ├─ 5.3 (depends on 5.1)
  └─ 5.4 (depends on Phase 4, 5.1)
```

## Parallelization Opportunities

- Tasks 2.5 and 2.1-2.4 can run in parallel (recipe registration is independent)
- Tasks 4.1, 4.2 can run in parallel (documentation files are independent)
- Tasks 5.2, 5.3, 5.4 can run in parallel after 5.1 completes

## Estimated Timeline

- **Phase 1**: 4-6 hours (scaffolding and types)
- **Phase 2**: 6-8 hours (implementation)
- **Phase 3**: 4-6 hours (testing)
- **Phase 4**: 3-4 hours (documentation)
- **Phase 5**: 2-3 hours (validation)

**Total**: 2-3 days of focused work

## Notes

- Build nimbus package before running Storybook tests (tests run against dist/)
- Run `pnpm build-theme-typings` after recipe registration to generate types
- Use `pnpm --filter @commercetools/nimbus build` for faster iteration
- Reference existing compound components (Accordion, Menu) for implementation
  patterns
