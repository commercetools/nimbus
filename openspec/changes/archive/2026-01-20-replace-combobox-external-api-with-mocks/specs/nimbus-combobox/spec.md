# ComboBox Spec Delta

## ADDED Requirements

### Requirement: Mock Data for Async Testing

The component test utilities SHALL provide mock data structures for testing
async functionality without external dependencies.

#### Scenario: Mock Pokemon data

- **WHEN** tests require async data loading examples
- **THEN** SHALL provide MOCK_POKEMON array with sample Pokemon objects
- **AND** SHALL include name and mock URL properties
- **AND** SHALL provide sufficient variety for filtering tests (minimum 8 items)

#### Scenario: Mock Pokemon details

- **WHEN** tests require detailed option rendering
- **THEN** SHALL provide MOCK_POKEMON_DETAILS object with Pokemon details
- **AND** SHALL include id, name, sprites, types, height, weight,
  base_experience
- **AND** SHALL support PokemonOption component rendering without HTTP requests

### Requirement: Mock Async Load Function

The component test utilities SHALL provide helper function for simulating async
data loading.

#### Scenario: createMockAsyncLoad helper

- **WHEN** tests require async loading behavior
- **THEN** SHALL provide createMockAsyncLoad(data?, delay?) function
- **AND** SHALL return async function with (filterText, signal) signature
- **AND** SHALL simulate network latency using setTimeout with configurable
  delay (default 100ms)
- **AND** SHALL respect AbortSignal for request cancellation
- **AND** SHALL filter data based on filterText using case-insensitive matching
- **AND** SHALL throw error when signal is aborted

#### Scenario: Configurable delay

- **WHEN** createMockAsyncLoad is called with delay parameter
- **THEN** SHALL use specified delay in milliseconds
- **WHEN** no delay parameter is provided
- **THEN** SHALL use default 100ms delay

#### Scenario: Abort signal handling

- **WHEN** AbortSignal is aborted during simulated delay
- **THEN** SHALL throw "AbortError" error
- **AND** SHALL not return filtered results

### Requirement: Mock URL Handling in PokemonOption

The PokemonOption component SHALL handle mock URLs gracefully without making
HTTP requests.

#### Scenario: Non-HTTP URLs

- **WHEN** pokemon.url does not start with "http"
- **THEN** SHALL check MOCK_POKEMON_DETAILS for details
- **AND** SHALL use mock details if available
- **AND** SHALL not make HTTP fetch request
- **AND** SHALL render option with mock data

#### Scenario: HTTP URLs

- **WHEN** pokemon.url starts with "http"
- **THEN** SHALL make HTTP fetch request
- **AND** SHALL handle response as before

## MODIFIED Requirements

### Requirement: Async Data Loading

The component SHALL support async option loading.

#### Scenario: Loading indication

- **WHEN** loading={true} is set
- **THEN** SHALL show loading spinner in dropdown
- **AND** SHALL show loading message
- **AND** SHALL use i18n message "Loading suggestions"
- **AND** SHALL disable option selection while loading

#### Scenario: Mock data in stories

- **WHEN** Storybook stories demonstrate async loading
- **THEN** SHALL use createMockAsyncLoad() helper for data
- **AND** SHALL not make external HTTP requests
- **AND** AsyncLoading story SHALL use mock data
- **AND** AsyncMultiSelectPersistence story SHALL use mock data
- **AND** AsyncMultiSelectCustomOptions story SHALL use mock data
- **AND** AsyncLoadingWithError story SHALL continue using mock error simulation
