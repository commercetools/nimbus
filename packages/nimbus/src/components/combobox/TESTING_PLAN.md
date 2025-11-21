Comprehensive ComboBox Testing Plan

1. Visual & Layout Testing

Grid Layout Structure

- Trigger uses CSS Grid with named areas: leadingElement content toggle clear
- Grid template columns: auto 1fr auto auto
- Leading element occupies leadingElement grid area
- Content area (tags + input) occupies content grid area
- Toggle button occupies toggle grid area
- Clear button occupies clear grid area
- Trigger takes full width of root container
- Grid maintains structure across all viewport sizes

Leading Element Layout

- Leading element left-justified
- Leading element vertically centered
- Leading element renders with display: contents
- Icon within leading element sized correctly (min 600 height/width)
- Leading element color matches neutral.11

Content Area (Tags + Input)

- Content area uses flexbox with wrap
- Content area has gap: 100 between items
- Content area fills available space (1fr)
- Content area respects minWidth: 0

Tag Layout

- TagGroup uses display: contents (tags become direct flex children)
- Tags flow inline with input
- Tags wrap to new lines when exceeding available width
- Last tag and input on same line when space available
- Gap maintained between tags

Input Sizing & Wrapping

- Input dynamically sized via size attribute
- Input size calculated from: Math.max(currentValue.length || placeholder.length
  || 1, 1)
- Input grows as user types
- Input shrinks when text deleted
- Input minimum size of 1 character when empty
- Input width 1px (25 token) when data-empty="true"
- Input wraps to new line when width would exceed 100% of content area
- Input takes full content width when on its own line
- Input: flex: 0 0 auto (doesn't grow beyond size attribute)
- Input: maxWidth: 100% (can't exceed container)
- Input maintains proper cursor and styling

Button Layout

- Toggle and clear buttons right-justified
- Toggle and clear buttons vertically centered
- Toggle button slot: toggle
- Clear button slot: clear
- Buttons maintain position when content wraps
- Buttons size: 2xs
- Toggle button variant: ghost
- Clear button variant: ghost with colorPalette: primary

Responsive Behavior

- Layout adapts to narrow viewports
- Content wraps appropriately on mobile
- Touch targets remain accessible (min 44x44px)
- Grid maintains structure on all screen sizes

2. Interaction Testing

Click-to-Focus

- Clicking trigger area focuses input
- Clicking tags area focuses input
- Clicking empty space in content focuses input
- Clicking toggle button does NOT focus input
- Clicking clear button does NOT focus input
- Click-to-focus disabled when isDisabled={true}
- Click handler checks e.target.closest("button") to exclude buttons

Keyboard Navigation

- Tab focuses input
- Arrow Down opens menu when closed
- Arrow Down/Up navigates options when open
- aria-activedescendant updates as user navigates with arrow keys
- aria-activedescendant points to currently focused option ID
- aria-activedescendant matches focusedKey from state.selectionManager
- aria-activedescendant is undefined when no option is focused
- aria-activedescendant value matches actual DOM id attribute of focused
  ListBoxItem
- Enter selects focused option
- Focused option priority: Enter key selects focused option instead of creating
  custom option
- Escape closes menu
- Backspace removes last tag (multi-select)
- Tab closes menu and moves focus to next element
- Keyboard-only navigation works without mouse
- Focus indicators visible during keyboard navigation
- Focus stays on input during keyboard navigation

Menu Open/Close Behavior

- menuTrigger="focus": Menu opens when input receives focus
- menuTrigger="input" (default): Menu opens when user types
- menuTrigger="manual": Menu only opens via button or ArrowDown key
- Toggle button opens/closes menu
- Clear button clears selection without affecting menu state
- shouldCloseOnBlur=true (default): Menu closes when focus leaves combobox
- shouldCloseOnBlur=false: Menu stays open when clicking outside
- shouldCloseOnSelect=true (default, single-select): Menu closes after selecting
  option
- shouldCloseOnSelect=false (single-select): Menu stays open after selecting
  option
- Blur delay: 150ms delay allows click events before closing menu
- ArrowDown key: Opens menu when closed
- Escape key: Closes menu when open
- Escape key returns focus to input
- Controlled open state: isOpen prop controls menu visibility
- Uncontrolled open state: defaultOpen prop sets initial state
- onOpenChange callback: Called when menu open state changes

Mouse/Touch Interactions

- Clicking option selects it
- Clicking clear button clears selection
- Clicking toggle button toggles menu
- Hovering option shows hover state
- Touch targets meet minimum size (44x44px)

3. Selection Behavior

Single Select Mode

- Single item selection works
- Single-select input sync: Input value updates to match selected item's text
- Single-select clear: Input value clears when selection is removed
- Single-select controlled: onInputChange called with selected item's text in
  controlled mode
- Previously selected item replaced on new selection
- Clear button removes selection
- Input displays selected item text
- Menu closes after selection (default behavior)
- selectedKeys accepts single Key value
- onSelectionChange receives single Key
- defaultSelectedKey sets initial selection

Multi Select Mode

- Multiple items can be selected
- Multi-select input clear: Input value clears after selecting an option
  (controlled and uncontrolled)
- Selected items displayed as tags
- Tags show remove button
- Clicking tag remove button deselects item
- Backspace removes last tag
- Multi-select: Menu always stays open after selection (ignores
  shouldCloseOnSelect)
- Input remains visible after adding tags
- selectedKeys accepts Key array
- onSelectionChange receives Key array
- defaultSelectedKeys sets initial selections
- Clear button removes all selections

Selection with getKey

- Custom getKey function used for unique identification
- Selection works with complex objects
- Default getKey (item.id) works automatically
- getKey integrates with new custom options

Selection with getTextValue

- Custom getTextValue function used for display
- Input displays correct text value after selection
- Default getTextValue (item.name) works automatically
- getTextValue integrates with new custom options

4. Filtering & Search

Basic Filtering

- Typing filters options
- Filter is case-insensitive
- Partial matches shown
- No matches shows empty state or closes menu
- allowsEmptyMenu=false (default): Menu closes when filtered results are empty
- allowsEmptyMenu=true: Menu stays open even when filtered results are empty
- renderEmptyState: Custom empty state message displays when
  allowsEmptyMenu=true and no results
- renderEmptyState: Empty state NOT shown when allowsEmptyMenu=false (menu
  closes instead)
- Clearing input shows all options
- Filter state resets when menu closes
- Filtered list maintains correct ARIA attributes

Custom Filter Function

- Custom filter prop function used when provided
- Default filter works without custom function
- Filter integrates with custom options

Controlled Input

- inputValue prop controls input text
- onInputChange callback fires on input changes
- Controlled input works with filtering
- Uncontrolled input works with defaultInputValue

5. Custom Options (allowsCustomOptions)

Basic Creation

- allowsCustomOptions=true enables feature
- Without allowsCustomOptions: Enter key does NOT create options
- Enter key on non-matching input creates new option
- Item addition: New item added to internal items array
- getNewOptionData required: Must provide transform function
- Missing getNewOptionData: Does not create options even if
  allowsCustomOptions=true

Single-Select Custom Options

- Single-select behavior: New item selected
- Single-select behavior: Input updated to item text
- Single-select behavior: Menu closes after creation

Multi-Select Custom Options

- Multi-select behavior: New item added as tag
- Multi-select behavior: Input cleared after creation
- Multi-select behavior: Menu stays open after creation

Validation & Transformation

- isValidNewOption validation: Only creates option when validation returns true
- isValidNewOption rejection: Does not create option when validation returns
  false
- getNewOptionData transform: Input value correctly transformed to item object
- Empty input: Enter on empty/whitespace-only input does NOT create option
- Duplicate prevention: Enter on matching existing option text does NOT create
  duplicate
- Case-insensitive matching: "apple" matches existing "Apple" (no duplicate)

Integration

- onCreateOption callback: Called with input value when option created
- No callback: Works without onCreateOption (optional callback)
- getKey integration: New items use getKey function to extract unique keys
- getTextValue integration: New items use getTextValue for display and matching
- External items sync: When items prop changes, internal items update

6. State Management

Controlled vs Uncontrolled

- Controlled mode: selectedKeys + onSelectionChange
- Uncontrolled mode: defaultSelectedKeys
- Controlled input: inputValue + onInputChange
- Uncontrolled input: defaultInputValue
- Controlled open state: isOpen + onOpenChange
- Uncontrolled open state: defaultOpen
- Mixed controlled/uncontrolled states work together

State Synchronization

- Selection changes trigger onSelectionChange
- Input changes trigger onInputChange
- Menu state changes trigger onOpenChange
- External state updates reflected in component
- State updates don't cause unnecessary re-renders

7. Accessibility (WCAG 2.1 AA)

ARIA Attributes

- Input has role="combobox"
- Input has aria-autocomplete="list"
- Input has aria-controls referencing listbox ID
- Input has aria-expanded tracking popup state
- Listbox has role="listbox"
- Listbox has stable ID
- Options have role="option"
- Options have unique IDs
- Options have aria-selected attribute
- Buttons have tabindex="-1"
- Label relationship established via aria-labelledby
- Input without aria-label or aria-labelledby should warn (console)

Screen Reader Support

- Screen reader announces combobox role
- Screen reader announces popup state (expanded/collapsed)
- Screen reader announces active option
- Screen reader announces selection changes
- Screen reader announces number of options available
- Screen reader announces when creating custom option
- Loading states announced
- Error states announced

Focus Management

- Focus visible at all times
- Focus indicator meets contrast requirements (3:1)
- Focus moves logically through component
- Focus trapped appropriately when menu open
- Focus returns to input after closing menu

Keyboard Support

- All functionality available via keyboard
- Keyboard shortcuts documented
- No keyboard traps

8. Form Integration

Form Submission

- Selected value(s) submitted with form
- Hidden input created for form integration
- Name prop sets form field name
- Value prop compatible with form libraries

Validation

- isRequired prop enforces selection
- isInvalid prop shows error state
- isDisabled prop disables interaction
- isReadOnly prop prevents changes
- Validation messages accessible
- Error styling applied correctly

React Hook Form / Formik Integration

- Works with controlled form libraries
- Validation integrates properly
- Form reset works correctly
- Error states sync with form state

9. Edge Cases & Error Handling

Empty States

- No options provided
- All options filtered out
- Custom empty state rendering
- Empty state accessible

Loading States

- Loading indicator shown
- Options disabled during load
- Loading message announced

Error States

- Error boundary catches errors
- Error messages displayed
- Component remains functional after error

Data Edge Cases

- Very long option text
- Very long input value
- Special characters in text
- Duplicate option values
- Large number of options (100+)
- Empty strings as options
- Null/undefined handling

Sizing Edge Cases

- Placeholder longer than input width
- Value longer than container width
- Multiple long tags wrapping
- Single character input
- Empty input (no value, no placeholder)

10. Performance Testing

Rendering Performance

- Large option lists (1000+ items) render smoothly
- Virtualization works correctly (if implemented)
- Re-renders minimized on input changes
- Tag addition/removal performant

Memory Management

- No memory leaks on mount/unmount
- Event listeners cleaned up
- No stale closures

11. Positioning & Portal Tests

Basic Positioning

- Vertical Positioning: Popover positioned below combobox with correct gutter
  spacing
- Horizontal Alignment: Popover left-aligned with combobox trigger
- Popover width matches trigger width (default)
- Popover respects maxHeight
- Popover flips to above trigger when no space below
- Popover maintains horizontal alignment with trigger

Container Context Tests

- ComboBox in Modal: Popover positioned correctly when opened in modal
- ComboBox in Modal with Scroll: Popover stays positioned when scrolling modal
  content
- ComboBox in Drawer: Popover positioned correctly when opened in drawer
- ComboBox in Drawer with Scroll: Popover follows combobox when scrolling drawer
- Scroll Container Detection: Works correctly in nested scroll containers
- Position Updates: Popover updates position when trigger element moves
- Fixed Positioning Strategy: Popover uses fixed positioning in portals
- Visual Relationship: Clear visual connection between trigger and popover
  maintained

12. Regression Testing

Previous Bugs

- Input resizing regression (size attribute)
- Click-to-focus with buttons regression
- Tag wrapping regression (display: contents)
- Trigger width regression (100% width)
- Modal/Drawer positioning bugs fixed

Visual Regression

- Screenshots match expected states
- Layout doesn't break on updates
- Styling consistent across variants

---

Testing Implementation Priority

Phase 1: Critical Path (P0)

1. Grid layout structure verification
2. Input sizing and wrapping
3. Single/multi select core functionality
4. Keyboard navigation and ARIA compliance
5. Click-to-focus interaction

Phase 2: Core Features (P1)

1. Filtering and search
2. Custom options creation
3. Form integration and validation
4. Menu open/close behavior variations
5. Positioning in portals (Modal/Drawer)

Phase 3: Polish & Edge Cases (P2)

1. Loading and error states
2. Edge case data handling
3. Performance with large datasets
4. Visual regression tests

Phase 4: Advanced (P3)

1. Assistive technology testing
2. Memory leak detection
3. Complex state synchronization scenarios
4. Custom render functions
5. Integration with form libraries

---

Storybook Story Structure

Each test category should have corresponding Storybook stories with play
functions:

// Example structure export const GridLayoutStructure: Story = { play: async ({
canvasElement, step }) => { // Test grid layout... } };

export const InputSizingAndWrapping: Story = { play: async ({ canvasElement,
step }) => { // Test input size attribute updates... } };

export const SingleSelectBehavior: Story = { play: async ({ canvasElement, step
}) => { // Test single selection... } };
