## Context

Several input-style components (Combobox, Select, SearchInput) lack a `trailingElement` slot, while others (TextInput, DateInput, TimeInput) already have one. The existing pattern is well-established: a `trailingElement` ReactNode prop, a corresponding slot in the recipe, a slot component, and conditional rendering in the component's layout.

The three target components each have built-in trailing controls (clear buttons, toggle/chevron icons) that occupy the trailing area. The new `trailingElement` renders _after_ these built-in controls, at the far trailing edge.

## Goals / Non-Goals

**Goals:**

- Add `trailingElement` to Combobox, Select, and SearchInput following the TextInput pattern
- Render the trailing element after built-in controls (clear, toggle, dropdown indicator)
- Maintain consistent styling (flex alignment, icon sizing by size variant) across all components
- Keep the slot conditionally rendered (only present in DOM when prop is provided)

**Non-Goals:**

- Not adding `leadingElement` to SearchInput (it hardcodes a search icon — different concern)
- Not changing the behavior or position of existing built-in controls
- Not adding custom content to the trailing element by default — it's a consumer-provided slot

## Decisions

### 1. Rendering position: after built-in controls

The `trailingElement` renders after all built-in trailing controls (clear button, toggle button, dropdown icon). This is consistent with the user's expectation: built-in controls are part of the component's core behavior, while the trailing element is supplementary content the consumer adds.

**Alternative considered:** Rendering _before_ built-in controls. Rejected because it would visually separate the input content from the consumer's custom element with built-in chrome, which is unexpected.

### 2. Follow TextInput's slot pattern exactly

Each component gets:
- A `trailingElement` slot in its recipe with the same base styles as TextInput (`display: flex`, `alignItems: center`, `color: neutral.11`)
- Size-variant-specific icon sizing matching the component's existing `leadingElement` slot (or TextInput's sizes for SearchInput)
- A slot component exported from the slots file
- Conditional rendering: `{trailingElement && <TrailingElementSlot>...</TrailingElementSlot>}`

**Rationale:** Consistency. Consumers who already use `trailingElement` on TextInput should find identical behavior on these components.

### 3. Combobox: extend the trigger's grid layout

The Combobox trigger uses CSS grid with named areas (`"leadingElement content clear toggle"`). The trailing element adds a new grid area: `"leadingElement content clear toggle trailingElement"`. This keeps the layout explicit and avoids z-index or positioning hacks.

### 4. Select: add trailing element inside the trigger's flex container

The Select trigger uses flexbox with absolutely-positioned clear/dropdown controls. The trailing element is appended as the last flex child after the absolutely-positioned controls wrapper.

### 5. SearchInput: append after clear button

SearchInput is the simplest case — the root is an inline-flex container. The trailing element slot is added after the clear button, at the far end of the layout.

## Risks / Trade-offs

- **[Layout shift risk]** → Adding a trailing element changes the available width for the input/content area. Mitigated by the same flex/grid shrink behavior used for `leadingElement` — the input content area shrinks to accommodate.
- **[Combobox multi-select tag overflow]** → In multi-select mode, tags may overflow when a trailing element reduces available space. This is the same tradeoff that exists with `leadingElement` — the tag group already handles overflow via scrolling/wrapping.
- **[No breaking changes]** → All additions are optional. Components render identically when `trailingElement` is not provided.
