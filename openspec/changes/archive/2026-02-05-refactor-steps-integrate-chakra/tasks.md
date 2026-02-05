# Tasks: Refactor Steps to Integrate Chakra UI

## 1. Research & Preparation

- [ ] 1.1 Analyze Chakra Steps source code to understand all available
      components and props
- [ ] 1.2 Document mapping between current Nimbus Steps API and Chakra Steps API
- [ ] 1.3 Identify any Nimbus-specific features that need custom implementation
      (e.g., our numeric/icon indicator types)

## 2. Core Component Implementation

- [ ] 2.1 Create new `steps.tsx` facade that imports from Chakra and exports
      Nimbus namespace
- [ ] 2.2 Implement `Steps.Root` wrapper with Nimbus recipe integration
  - Import Chakra's `Steps.Root`
  - Apply Nimbus slot recipe styling
  - Forward controlled/uncontrolled props (step, defaultStep, onStepChange)
  - Forward size/orientation variants
- [ ] 2.3 Implement `Steps.List` wrapper with slot styling
- [ ] 2.4 Implement `Steps.Item` wrapper (no index prop needed - Chakra handles
      automatically)
- [ ] 2.5 Implement `Steps.Trigger` (clickable step indicator with label)
- [ ] 2.6 Implement `Steps.Indicator` (visual indicator within Trigger)
- [ ] 2.7 Implement `Steps.Separator` with Nimbus styling
- [ ] 2.8 Implement `Steps.Content` (auto-visibility content container)
- [ ] 2.9 Implement `Steps.CompletedContent` (shown when all steps complete)
- [ ] 2.10 Implement `Steps.PrevTrigger` (navigate to previous step)
- [ ] 2.11 Implement `Steps.NextTrigger` (navigate to next step)

## 3. Type Definitions

- [ ] 3.1 Update `steps.types.ts` with new prop interfaces aligned to Chakra
- [ ] 3.2 Export all prop types for consumer use
- [ ] 3.3 Add comprehensive JSDoc comments with examples
- [ ] 3.4 Ensure responsive value support for size/orientation (per PR feedback)

## 4. Recipe Updates

- [ ] 4.1 Update `steps.recipe.ts` to support new slot structure
  - root, list, item, trigger, indicator, separator, content, completedContent,
    prevTrigger, nextTrigger
- [ ] 4.2 Maintain CSS variable pattern for indicator size and separator width
- [ ] 4.3 Ensure all size variants (xs, sm, md) work with new structure
- [ ] 4.4 Ensure both orientations (horizontal, vertical) work correctly

## 5. Slots Implementation

- [ ] 5.1 Update `steps.slots.tsx` for new component structure
- [ ] 5.2 Remove obsolete slots (Label, Description if not needed)
- [ ] 5.3 Add new slots (Trigger, CompletedContent, PrevTrigger, NextTrigger)

## 6. Testing

- [ ] 6.1 Rewrite `steps.stories.tsx` with new API examples
  - Basic usage (uncontrolled)
  - Controlled mode with external state
  - All size variants
  - Both orientations
  - With/without descriptions
  - Linear mode (forward-only)
  - Custom trigger content
  - With form content in steps
- [ ] 6.2 Add play functions testing:
  - Step navigation via triggers
  - PrevTrigger/NextTrigger behavior
  - Content visibility transitions
  - Keyboard navigation
  - Accessibility (aria attributes, screen reader support)
- [ ] 6.3 Update `steps.docs.spec.tsx` for documentation testing
- [ ] 6.4 Run full test suite: `pnpm test packages/nimbus/src/components/steps/`

## 7. Documentation

- [ ] 7.1 Update `steps.mdx` with new API and examples
  - Overview with key features
  - Basic usage (uncontrolled)
  - Controlled mode
  - Size variants
  - Orientation variants
  - Navigation triggers
  - Form integration example
  - Migration guide from old API
- [ ] 7.2 Update component JSDoc comments
- [ ] 7.3 Add inline code examples in type definitions

## 8. Cleanup

- [ ] 8.1 Remove obsolete component files:
  - `components/steps.indicator.tsx` (merged into Trigger)
  - `components/steps.label.tsx` (content goes in Trigger)
  - `components/steps.description.tsx` (content goes in Trigger)
  - `components/steps.context.tsx` (if Chakra provides context)
- [ ] 8.2 Update barrel exports in `index.ts`
- [ ] 8.3 Remove deprecated type exports

## 9. Validation

- [ ] 9.1 Run build: `pnpm --filter @commercetools/nimbus build`
- [ ] 9.2 Run typecheck: `pnpm --filter @commercetools/nimbus typecheck`
- [ ] 9.3 Run all tests: `pnpm test packages/nimbus/src/components/steps/`
- [ ] 9.4 Visual verification in Storybook for all variants
- [ ] 9.5 Verify accessibility with axe-core
