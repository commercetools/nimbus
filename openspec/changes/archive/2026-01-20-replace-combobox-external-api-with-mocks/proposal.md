# Change: Replace ComboBox External API Dependency with Mock Data

## Why

Multiple ComboBox Storybook stories make real HTTP requests to the external
Pokemon API (pokeapi.co) during test execution. This creates reliability,
performance, and maintainability issues:

1. **Test Flakiness**: Network failures or API downtime cause random test
   failures
2. **Slow Execution**: External API calls add 300ms+ latency per request
3. **Rate Limiting**: Pokemon API limits could block CI pipeline runs
4. **Offline Development**: Tests fail when developing without internet
   connection
5. **CI Dependency**: Build pipeline depends on third-party service availability

Tests should be fast, reliable, and deterministic. External API dependencies
violate these principles.

## What Changes

- Add mock Pokemon data structures to `test-utils.tsx` (MOCK_POKEMON,
  MOCK_POKEMON_DETAILS)
- Create `createMockAsyncLoad()` helper function with simulated latency and
  abort signal support
- Update `PokemonOption` component to handle non-HTTP URLs gracefully
- Replace real Pokemon API calls in three stories:
  - `AsyncLoading`
  - `AsyncMultiSelectPersistence`
  - `AsyncMultiSelectCustomOptions`
- All test behavior remains identical, only the data source changes

**Note**: `AsyncLoadingWithError` story already uses mock error simulation and
requires no changes.

## Impact

### Affected Specs

- `nimbus-combobox` - Test implementation requirements

### Affected Files

- `packages/nimbus/src/components/combobox/utils/test-utils.tsx` - Add mock data
  and helpers
- `packages/nimbus/src/components/combobox/combobox.stories.tsx` - Update three
  stories to use mocks

### Benefits

- Faster test execution (100ms mock delay vs 300ms+ network latency)
- Deterministic test results (same data every time)
- No network dependency (works offline)
- No rate limiting concerns
- More reliable CI pipeline
