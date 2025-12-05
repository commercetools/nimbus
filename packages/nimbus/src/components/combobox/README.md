# ComboBox Architecture

## Overview

The ComboBox component is a searchable, filterable selection component built on
React Aria Components. It supports single and multi-select modes, custom option
creation, async data loading, custom filtering, sections, and follows WCAG 2.1
AA accessibility guidelines.

## Key Features

### Core Features

- **Single & Multi-Select**: Toggle between modes via `selectionMode` prop
  ("single" | "multiple")
- **Smart Filtering**: Built-in text filtering with customizable filter
  functions and utilities
- **Custom Options**: Allow users to create new options on-the-fly
  (`allowsCustomOptions`)
- **Async Loading**: Built-in support for async data loading with `useAsyncList`
  integration
- **Sections**: Group related options with headers (optgroups)
- **Keyboard Navigation**: Full keyboard support (arrows, Enter, Escape,
  Home/End, Backspace)
- **Accessible**: WCAG 2.1 AA compliant with proper ARIA attributes and virtual
  focus
- **Controlled/Uncontrolled**: Supports both patterns for selection, input
  value, and open state
- **Form Integration**: Hidden input for native form submission
- **Leading Elements**: Support for icons or custom elements before the input
  field

### Visual Features

- **Size Variants**: Small, medium (default), and large sizes
- **Visual Variants**: Default styling with variant support
- **States**: Support for `isDisabled`, `isReadOnly`, `isRequired`, `isInvalid`
- **Loading State**: Built-in loading indicators for async operations
- **Empty State**: Customizable empty state when no options match

### Filter Utilities

The component exports a comprehensive set of filter utilities via
`ComboBox.filters`:

- **Basic Filters**: `filterByText`, `filterByStartsWith`,
  `filterByCaseSensitive`, `filterByWordBoundary`
- **Advanced Filters**: `filterByFuzzy`, `createRankedFilter`
- **Multi-Property**: `createMultiPropertyFilter` - search across multiple
  object properties
- **Multi-Term**: `createMultiTermFilter` - OR logic for multiple search terms
- **Section-Aware**: `createSectionAwareFilter` - preserves section structure
  while filtering

## Architecture

### Component Structure

```
ComboBox (compound component)
├── ComboBox.Root          # Root container - provides state and context
│   ├── ComboBoxRootInner  # Internal: Core logic and state management
│   └── React Aria Provider # Internal: React Aria integration
├── ComboBox.Trigger       # Trigger container
│   ├── Leading Element    # Optional: Icon or custom element
│   ├── Tag Group          # Internal: Selected tags (multi-select only)
│   ├── Input              # Internal: Text input field
│   ├── Toggle Button      # Internal: Open/close dropdown button
│   ├── Clear Button       # Internal: Clear selection (visible when has selection)
│   └── Hidden Input       # Internal: Form submission
├── ComboBox.Popover       # Dropdown container (portal)
│   └── ComboBox.ListBox   # Options list container
│       ├── ComboBox.Section   # Optional: Group with heading
│       │   └── ComboBox.Option # Individual option
│       └── ComboBox.Option     # Individual option
└── ComboBox.filters       # Filter utility functions
```

**Note**: Most child components (Input, Buttons, TagGroup, HiddenInput) are
internal and render automatically. Users only need to compose Root, Trigger,
Popover, ListBox, and Option.

### State Management

The component manages three independent pieces of state, each supporting
controlled/uncontrolled patterns:

#### 1. Selection State

- **Controlled**: `selectedKeys` + `onSelectionChange`
- **Uncontrolled**: `defaultSelectedKeys` + internal state
- **Storage**: Normalized as `Set<Key>` internally, exposed as `Key[]` or
  `"all"`
- **Behavior**:
  - Single-select: Replaces selection on click, menu closes after selection
  - Multi-select: Toggles selection on click, menu stays open, shows removable
    tags

#### 2. Input Value State

- **Controlled**: `inputValue` + `onInputChange`
- **Uncontrolled**: `defaultInputValue` + internal state
- **Sync**: In single-select, input auto-syncs with selected item text
- **Behavior**: Used for filtering the options list

#### 3. Open State

- **Controlled**: `isOpen` + `onOpenChange`
- **Uncontrolled**: `defaultOpen` + internal state
- **Triggers**: Manual toggle button, input focus, typing, keyboard shortcuts

### Data Flow

```
User Types → Input Change → Filter Collection → Update Menu
User Clicks Option → Selection Change → Update Input (single) / Add Tag (multi)
User Presses Arrow → Focus Next/Prev → Scroll Into View
User Presses Enter → Select Focused / Create Custom → Close Menu (single)
User Clicks Clear → Clear Selection → Clear Input (single) / Remove All Tags (multi)
```

### Collection System

React Aria's `CollectionBuilder` parses JSX children into a `Collection` object:

```tsx
<ComboBox.Root items={items}>
  {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
</ComboBox.Root>
```

The Collection provides:

- Navigation methods (`getFirstKey`, `getLastKey`, `getKeyAfter`,
  `getKeyBefore`)
- Item lookup (`getItem(key)`)
- Filtering (`nodes.filter()`) - preserves navigation structure
- Metadata extraction (textValue, disabled state, etc.)

**Why persist the collection?** The collection is built when the menu is open
and persisted to avoid rebuilding when the menu closes. This ensures consistent
behavior and prevents flickering.

### React Aria Integration

The component delegates complex behaviors to React Aria:

#### useListState

- **Purpose**: Handles keyboard navigation, focus tracking, and selection
  management
- **Provides**: `state.collection` (navigation) + `state.selectionManager`
  (selection/focus)

#### Virtual Focus (aria-activedescendant)

- **Purpose**: Keeps browser focus on input while visually focusing options
- **Benefit**:
  - Screen readers announce focused options without losing input focus
  - Typing works immediately without refocusing the input
  - Keyboard navigation feels natural

#### Context Distribution (Providers)

- **Purpose**: Distributes props to child components without prop drilling
- **Implementation**: Each context (InputContext, ListBoxContext, etc.)
  configures a specific child component

## File Structure

### Core Files

```
combobox/
├── combobox.tsx                        # Main export with compound component API
├── combobox.types.ts                   # TypeScript interfaces (400+ lines)
├── combobox.recipe.ts                  # Chakra UI styling (slot recipe)
├── combobox.slots.tsx                  # Styled slot components
├── combobox.i18n.ts                    # Internationalization messages
├── combobox.stories.tsx                # Storybook stories with interaction tests
├── combobox.mdx                        # Component documentation
└── TESTING_PLAN.md                     # Comprehensive testing checklist
```

### Implementation Files

```
components/
├── combobox.root.tsx                   # Root component with state management (900+ lines)
├── combobox.trigger.tsx                # Trigger container
├── combobox.input.tsx                  # Text input field (internal)
├── combobox.leading-element.tsx        # Leading icon/element container (internal)
├── combobox.tag-group.tsx              # Selected tags for multi-select (internal)
├── combobox.popover.tsx                # Dropdown popover container
├── combobox.listbox.tsx                # Options list
├── combobox.option.tsx                 # Individual option
├── combobox.hidden-input.tsx           # Form submission (internal)
└── index.ts                            # Component barrel export
```

### Utility Files

```
utils/
├── collection.ts                       # Collection utilities
├── collection.spec.ts                  # Collection tests
├── filters.ts                          # Filter functions and factories
├── filters.spec.ts                     # Filter tests
├── selection.ts                        # Selection utilities
├── selection.spec.ts                   # Selection tests
└── test-data.ts                        # Shared test data
```

## Usage Patterns

### Basic Single-Select

```tsx
<ComboBox.Root items={items}>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <ComboBox.ListBox>
      {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
    </ComboBox.ListBox>
  </ComboBox.Popover>
</ComboBox.Root>
```

### Multi-Select with Tags

```tsx
<ComboBox.Root items={items} selectionMode="multiple">
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <ComboBox.ListBox>
      {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
    </ComboBox.ListBox>
  </ComboBox.Popover>
</ComboBox.Root>
```

### With Sections

```tsx
<ComboBox.Root>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <ComboBox.ListBox>
      <ComboBox.Section label="Mammals">
        <ComboBox.Option id="lion">Lion</ComboBox.Option>
        <ComboBox.Option id="tiger">Tiger</ComboBox.Option>
      </ComboBox.Section>
      <ComboBox.Section label="Birds">
        <ComboBox.Option id="eagle">Eagle</ComboBox.Option>
        <ComboBox.Option id="hawk">Hawk</ComboBox.Option>
      </ComboBox.Section>
    </ComboBox.ListBox>
  </ComboBox.Popover>
</ComboBox.Root>
```

### Custom Filtering

```tsx
<ComboBox.Root items={items} filter={ComboBox.filters.filterByStartsWith}>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <ComboBox.ListBox>
      {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
    </ComboBox.ListBox>
  </ComboBox.Popover>
</ComboBox.Root>
```

### Multi-Property Search

```tsx
const productFilter = ComboBox.filters.createMultiPropertyFilter<Product>([
  "name",
  "category",
  "description",
]);

<ComboBox.Root items={products} filter={productFilter}>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <ComboBox.ListBox>
      {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
    </ComboBox.ListBox>
  </ComboBox.Popover>
</ComboBox.Root>;
```

### Section-Aware Filtering

```tsx
const sectionFilter = ComboBox.filters.createSectionAwareFilter(
  ComboBox.filters.filterByFuzzy
);

<ComboBox.Root items={sectionsWithItems} filter={sectionFilter}>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <ComboBox.ListBox>
      {(section) => (
        <ComboBox.Section>
          {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
        </ComboBox.Section>
      )}
    </ComboBox.ListBox>
  </ComboBox.Popover>
</ComboBox.Root>;
```

### Custom Options

```tsx
<ComboBox.Root
  items={items}
  allowsCustomOptions
  getNewOptionData={(textValue) => ({
    id: generateId(),
    name: textValue,
  })}
  onCreateOption={(item) => {
    // Save to backend or update parent state
    api.createItem(item);
  }}
>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <ComboBox.ListBox>
      {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
    </ComboBox.ListBox>
  </ComboBox.Popover>
</ComboBox.Root>
```

### Async Loading

```tsx
const [error, setError] = useState<string | null>(null);

<ComboBox.Root
  items={items}
  async={{
    load: async (filterText, signal) => {
      setError(null);

      if (!filterText || filterText.length < 2) {
        return [];
      }

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(filterText)}`,
          { signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        if (err.name === "AbortError") throw err;
        setError(err.message);
        return [];
      }
    },
    minSearchLength: 2,
    debounce: 300,
    onError: (err) => setError(err.message),
  }}
  renderEmptyState={({ isLoading }) =>
    isLoading ? (
      <Text>Loading...</Text>
    ) : error ? (
      <Text color="critical.11">{error}</Text>
    ) : (
      <Text>Start typing to search...</Text>
    )
  }
>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <ComboBox.ListBox>
      {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
    </ComboBox.ListBox>
  </ComboBox.Popover>
</ComboBox.Root>;
```

### Controlled State

```tsx
const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
const [inputValue, setInputValue] = useState("");
const [isOpen, setIsOpen] = useState(false);

<ComboBox.Root
  items={items}
  selectedKeys={selectedKeys}
  onSelectionChange={setSelectedKeys}
  inputValue={inputValue}
  onInputChange={setInputValue}
  isOpen={isOpen}
  onOpenChange={setIsOpen}
>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <ComboBox.ListBox>
      {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
    </ComboBox.ListBox>
  </ComboBox.Popover>
</ComboBox.Root>;
```

## Behavior Details

### Single-Select Mode

**Selection**:

- Clicking an option **replaces** the selection
- Input value syncs with selected item text
- Menu closes after selection (configurable via `shouldCloseOnSelect`)
- Clear button removes the selection

**Filtering**:

- Typing filters the option list
- If input exactly matches selected item, shows full list (UX: clicking input
  shows all options)

**Keyboard**:

- `Enter`: Select focused option and close
- `Backspace` (empty input): Clear selection

### Multi-Select Mode

**Selection**:

- Clicking an option **toggles** it in/out of selection
- Selected items shown as removable tags
- Menu stays open after selection
- Clear button removes all selections

**Filtering**:

- Typing filters options independently of selection
- Input value independent of selected items
- Input clears after each selection

**Keyboard**:

- `Enter`: Toggle focused option
- `Backspace` (empty input): Remove last tag

### Custom Options

When `allowsCustomOptions=true`:

1. User types text not matching any option
2. User presses `Enter` (with no option focused)
3. Validation: Check `isValidNewOption` if provided
4. Creation: Call `getNewOptionData` to create item object
5. Add to internal items array
6. Select the new item
7. Notify via `onCreateOption` callback

**Duplicate Prevention**: Custom validation can prevent duplicate options
(case-insensitive check)

## Accessibility

### ARIA Attributes

**Input**:

- `role="combobox"` - Identifies as autocomplete input
- `aria-autocomplete="list"` - Suggestions in a list
- `aria-controls="listbox-id"` - References controlled elements
- `aria-expanded` - Announces menu open/closed
- `aria-activedescendant` - Announces focused option (virtual focus)
- `aria-invalid` - Announces invalid state
- `aria-required` - Announces required state
- `aria-disabled` - Announces disabled state
- `aria-readonly` - Announces read-only state

**ListBox**:

- `role="listbox"` - Identifies as option list
- `id="listbox-id"` - Referenced by input's aria-controls

**Options**:

- `role="option"` - Identifies as selectable option
- `aria-selected` - Selection state
- `id="listbox-id-option-{key}"` - Referenced by aria-activedescendant

**Sections**:

- `role="group"` - Identifies as option group
- `aria-labelledby` - References section heading

### Keyboard Navigation

| Key         | Action                                                     |
| ----------- | ---------------------------------------------------------- |
| `Tab`       | Focus input / Move to next focusable element               |
| `ArrowDown` | Open menu (focus first) or move to next option             |
| `ArrowUp`   | Open menu (focus last) or move to previous option          |
| `Enter`     | Select focused option / create custom option / submit form |
| `Escape`    | Close menu                                                 |
| `Home`      | Focus first option                                         |
| `End`       | Focus last option                                          |
| `Backspace` | Clear/remove selection (when input empty)                  |
| `Space`     | Type space character (not used for selection)              |

### Screen Reader Support

- Input announces role, state, and value
- Focused options announced via `aria-activedescendant`
- Selection changes announced
- Loading states announced
- Empty states announced
- Error states announced

### Focus Management

- **Virtual Focus**: Browser focus stays on input, options receive visual focus
  via `aria-activedescendant`
- **Focus Ring**: Visible focus indicators on input and focused options
- **Focus Trap**: No keyboard traps - user can always Tab out
- **Focus Restoration**: Focus returns to trigger when menu closes

## Performance Considerations

### Memoization

- **filteredCollection**: Memoized with `useMemo` to avoid re-filtering on every
  render
- **selectedItemsFromState**: Memoized to avoid re-extracting selected items
- **Context Values**: Individual contexts use object literals (React handles
  efficiently)

### Collection Filtering

Uses `Collection.filter()` instead of array filtering:

- **Why**: Preserves navigation methods (getFirstKey, getLastKey, etc.)
- **Benefit**: React Aria can navigate filtered collection without re-parsing
  JSX

### ResizeObserver

Watches trigger width to keep popover width in sync:

- **Why**: Ensures popover aligns with trigger when container resizes
- **How**: CSS custom property `--nimbus-combobox-trigger-width` set via effect
- **Cleanup**: Observer cleaned up on unmount

### Virtual Scrolling

Not currently implemented, but can be added for very large datasets (1000+
items):

- Use React Aria's
  [virtualizer](https://react-spectrum.adobe.com/react-aria/Virtualizer.html#virtualizer)
  as the parent of `ComboBox.ListBox`

## Testing

### Test Coverage

The component has comprehensive test coverage across utilities and integration:

**Unit Tests** (utilities):

- `utils/collection.spec.ts` - Collection utilities
- `utils/filters.spec.ts` - All filter functions
- `utils/selection.spec.ts` - Selection utilities

**Integration Tests** (Storybook stories with play functions):

- Single-select interaction
- Multi-select interaction with tags
- Keyboard navigation
- Custom option creation
- Filtering behavior (sections, custom filters)
- Async loading (with success and error states)
- Form submission
- Leading elements
- Empty states
- All visual states (size, variant, disabled, readonly, invalid, required)

### Running Tests

```bash
# Run all tests (unit + Storybook)
pnpm test

# Run only unit tests
pnpm test:unit

# Run only Storybook tests
pnpm test:storybook

# Run specific test file
pnpm test combobox.stories.tsx
pnpm test filters.spec.ts
```

### Test Documentation

See `TESTING_PLAN.md` for a comprehensive testing checklist covering:

- Visual & layout behavior
- User interaction testing
- Selection modes
- Search & filtering
- Custom option creation
- Async data loading
- State management
- Accessibility
- Form integration
- Visual states (size, variant, disabled, readonly, invalid, required)
- Edge cases & robustness
- Portal & positioning
- Regression prevention

## Future Enhancements

- [ ] Infinite scroll/virtualization for very large datasets (1000+ items)
- [ ] Virtual scrolling with React Aria's `Virtualizer`
- [ ] Drag-and-drop reordering of selected tags
- [ ] Copy/paste multiple values
- [ ] Directly access selected values via callback
