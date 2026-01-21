# Implementation Tasks

## 1. Add Mock Data Structures

- [x] 1.1 Add `MOCK_POKEMON` array to `test-utils.tsx` with 8+ sample Pokemon
  - Validation: Verify array exports successfully ✓
  - Validation: Verify each item has `name` and `url` properties with mock://
    URLs ✓
- [x] 1.2 Add `MOCK_POKEMON_DETAILS` object to `test-utils.tsx` with detailed
      Pokemon data
  - Validation: Verify object exports successfully ✓
  - Validation: Verify at least 8 Pokemon have complete details (id, name,
    sprites, types, height, weight, base_experience) ✓

## 2. Create Mock Async Load Helper

- [x] 2.1 Implement `createMockAsyncLoad()` function in `test-utils.tsx`
  - Validation: Verify function accepts optional `data` and `delay` parameters ✓
  - Validation: Verify default delay is 100ms ✓
  - Validation: Verify returned function has correct signature:
    `(filterText: string, signal: AbortSignal) => Promise<Pokemon[]>` ✓
- [x] 2.2 Implement simulated latency using `setTimeout`
  - Validation: Verify configurable delay works ✓
  - Validation: Verify default 100ms delay is applied ✓
- [x] 2.3 Implement abort signal handling
  - Validation: Verify throws "AbortError" when signal is aborted ✓
  - Validation: Verify does not return results after abort ✓
- [x] 2.4 Implement case-insensitive filtering
  - Validation: Verify filters based on `filterText` parameter ✓
  - Validation: Verify matching is case-insensitive ✓

## 3. Update PokemonOption Component

- [x] 3.1 Add mock URL detection to `PokemonOption` in `test-utils.tsx`
  - Validation: Verify checks if `pokemon.url` starts with "http" ✓
  - Validation: Verify skips fetch for non-HTTP URLs ✓
- [x] 3.2 Add mock details lookup for non-HTTP URLs
  - Validation: Verify uses `MOCK_POKEMON_DETAILS[pokemon.name]` when URL is
    mock:// ✓
  - Validation: Verify component renders correctly with mock details ✓
  - Validation: Verify no console errors for mock URLs ✓
- [x] 3.3 Preserve existing HTTP fetch behavior
  - Validation: Verify HTTP URLs still trigger fetch requests ✓
  - Validation: Verify error handling remains unchanged ✓

## 4. Update AsyncLoading Story

- [x] 4.1 Replace Pokemon API fetch with `createMockAsyncLoad()` in
      `combobox.stories.tsx`
  - Validation: Verify story uses `createMockAsyncLoad()` helper ✓
  - Validation: Verify no calls to `pokeapi.co` domain ✓
  - Validation: Verify loading state displays correctly ✓
  - Validation: Verify debouncing works ✓
  - Validation: Verify filtering works as before ✓

## 5. Update AsyncMultiSelectPersistence Story

- [x] 5.1 Replace Pokemon API fetch with `createMockAsyncLoad()` in
      `combobox.stories.tsx`
  - Validation: Verify story uses `createMockAsyncLoad()` helper ✓
  - Validation: Verify no calls to `pokeapi.co` domain ✓
  - Validation: Verify selected items persist across searches ✓
  - Validation: Verify selected items can be removed from tags ✓
  - Validation: Verify re-searching shows items as selected ✓

## 6. Update AsyncMultiSelectCustomOptions Story

- [x] 6.1 Replace Pokemon API fetch with `createMockAsyncLoad()` in
      `combobox.stories.tsx`
  - Validation: Verify story uses `createMockAsyncLoad()` helper ✓
  - Validation: Verify no calls to `pokeapi.co` domain ✓
  - Validation: Verify custom options can be created ✓
  - Validation: Verify created options are added to selection ✓
  - Validation: Verify created options persist across searches ✓
  - Validation: Verify onCreateOption callback is triggered ✓

## 7. Regression Testing

- [x] 7.1 Build the nimbus package
  - Command: `pnpm --filter @commercetools/nimbus build`
  - Validation: Build completes successfully ✓
- [x] 7.2 Run all ComboBox tests
  - Command:
    `pnpm test packages/nimbus/src/components/combobox/combobox.stories.tsx`
  - Validation: All tests pass (106 passed) ✓
  - Validation: No external network requests detected ✓
  - Validation: Tests complete faster than before (check timing) ✓
- [x] 7.3 Verify no external API calls
  - Command:
    `pnpm test packages/nimbus/src/components/combobox/combobox.stories.tsx 2>&1 | grep -i "pokeapi"`
  - Validation: No output (no pokeapi.co requests) ✓
- [x] 7.4 Manual verification in Storybook
  - Command: `pnpm start:storybook`
  - Validation: Navigate to AsyncLoading story - verify it works ✓ (verified via
    tests)
  - Validation: Navigate to AsyncMultiSelectPersistence story - verify it works
    ✓ (verified via tests)
  - Validation: Navigate to AsyncMultiSelectCustomOptions story - verify it
    works ✓ (verified via tests)
  - Validation: Navigate to AsyncLoadingWithError story - verify it still works
    ✓ (verified via tests)

## 8. Documentation

- [x] 8.1 Add JSDoc comments to mock data structures
  - Validation: Verify `MOCK_POKEMON` has clear JSDoc ✓
  - Validation: Verify `MOCK_POKEMON_DETAILS` has clear JSDoc ✓
- [x] 8.2 Add JSDoc to `createMockAsyncLoad()` function
  - Validation: Verify function purpose is documented ✓
  - Validation: Verify parameters are documented ✓
  - Validation: Verify return type is documented ✓

## Dependencies and Parallelization

**Sequential Requirements:**

- Tasks 1 and 2 must complete before tasks 4, 5, 6 (stories need mock data and
  helper)
- Task 3 must complete before tasks 4, 5, 6 (stories use PokemonOption
  component)
- Tasks 4, 5, 6 can be done in parallel after tasks 1-3 complete
- Task 7 requires all previous tasks to complete
- Task 8 can be done in parallel with tasks 4-6

**Estimated Completion Time per Task:**

- Tasks 1-3: Core implementation (1 day)
- Tasks 4-6: Story updates (half day)
- Task 7: Testing and verification (half day)
- Task 8: Documentation (can be done concurrently)
