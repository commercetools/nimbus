# Comprehensive ComboBox Testing Plan

## Implementation Status Legend

- ✅ **Implemented**: Has corresponding Storybook story with play function tests
- ⚠️ **Partial**: Story exists but incomplete test coverage
- ❌ **Not Implemented**: No test coverage yet

---

## 1. Visual & Layout Behavior

### Layout Structure ✅

**Status**: ✅ Implemented - 6 focused stories

**Stories:**

- `LayoutLeadingElement` - Leading element (icon) displays correctly
- `LayoutInputField` - Input field visibility and focus behavior
- `LayoutToggleButton` - Toggle button display and menu open/close
- `LayoutClearButton` - Clear button visibility with selection and clearing
  behavior
- `LayoutClearButtonHidden` - Clear button hidden without selection
  (display:none)
- `LayoutFullWidth` - Component width matches container
- `LayoutResponsive` - Layout integrity across container sizes (smoke test)

**Test Coverage:**

- ✅ Leading element displays correctly when provided
- ✅ Input field is visible and functional
- ✅ Toggle button displays and is clickable
- ✅ Clear button displays when selection exists
- ✅ Clear button hides when selection is cleared
- ✅ Clear button has display:none when no selection
- ✅ Component takes full width of container
- ✅ Layout adapts to different viewport sizes

### Multi-Select Tag Display ✅

**Status**: ✅ Implemented - 5 focused stories

**Stories:**

- `MultiSelectTagsDisplay` - Selected items display as tags
- `MultiSelectTagsInline` - Tags appear inline with input field
- `MultiSelectTagsWrapping` - Tags wrap to new lines when space is limited
- `MultiSelectTagRemoval` - Each tag shows remove button and can be removed
- `MultiSelectInputAccessible` - Input remains accessible after adding tags

**Test Coverage:**

- ✅ Selected items display as removable tags
- ✅ Tags appear inline with input field
- ✅ Tags wrap to new lines when space is limited (6 tags in 300px container)
- ✅ Each tag shows a remove button
- ✅ Remove buttons are visible and functional
- ✅ Clicking remove button removes the tag
- ✅ Other tags remain after one is removed
- ✅ Input remains accessible after adding tags
- ✅ Can focus input with tags present
- ✅ Can type in input with tags present
- ✅ Can select additional items with tags present

### Input Field Behavior ✅

**Status**: ✅ Implemented - 5 focused stories

**Stories:**

- `InputFieldGrows` - Input width increases as text is typed (pixel measurement)
- `InputFieldShrinks` - Input width decreases when text is deleted (pixel
  measurement)
- `InputAlwaysVisible` - Input visible and focusable in empty and with-tags
  states
- `InputWrapsToNewLine` - Input accessible when tags wrap (trigger
  height >100px)
- `InputPlaceholder` - Placeholder displays when empty, hidden when typing

**Test Coverage:**

- ✅ Input field grows as user types (width measurement)
- ✅ Input field shrinks when text is deleted (width measurement)
- ✅ Input field is always visible and focusable
- ✅ Input wraps to new line when content area is full
- ✅ Placeholder text displays when input is empty

### Button Visibility & Behavior ✅

**Status**: ✅ Implemented - 2 new stories (+ 2 covered in Layout section)

**Stories:**

- `ButtonsAccessibleWhenWrapping` - Buttons remain functional when tags wrap
- `ButtonsClickAreas` - Button dimensions measured for clickability

**Coverage from Layout Section:**

- ✅ Toggle button always visible (covered in `LayoutToggleButton`)
- ✅ Clear button only visible when selection exists (covered in
  `LayoutClearButton` and `LayoutClearButtonHidden`)

**New Test Coverage:**

- ✅ Buttons remain accessible when content wraps (6 tags, trigger
  height >100px)
- ✅ Toggle button clickable when wrapping
- ✅ Clear button clickable when wrapping
- ✅ Button click areas sufficiently large (width & height >20px)

---

## 2. User Interaction Testing

### Focus Behavior ✅

**Status**: ✅ Implemented - 5 focused stories

**Stories:**

- `FocusClickTriggerArea` - Clicking trigger area focuses input (tests empty
  space and near leading element)
- `FocusTabKey` - Tabbing focuses input (tests sequential focus navigation)
- `FocusRemainsOnInputDuringSelection` - Virtual focus pattern during
  multi-select
- `FocusLosesOnOutsideClick` - Focus lost when clicking outside component
- `FocusIndicatorsVisible` - Focus ring and aria-activedescendant during
  keyboard navigation

**Test Coverage:**

- ✅ Clicking anywhere in the trigger area focuses the input
- ✅ Clicking near leading element focuses input
- ✅ Input receives focus when component is tabbed to
- ✅ Tab navigates between multiple comboboxes
- ✅ Focus remains on input during option selection (virtual focus)
- ✅ Focus remains on input after multiple selections
- ✅ Component loses focus when user clicks outside
- ✅ Focus indicators visible during keyboard navigation (aria-activedescendant)
- ✅ Virtual focus updates when navigating options with arrow keys

### Keyboard Navigation ✅

**Status**: ✅ Implemented - 6 focused stories

**Stories:**

- `KeyboardArrowDownOpensMenu` - Arrow Down opens menu and focuses first option
- `KeyboardArrowKeysNavigate` - Arrow Up/Down navigation through options
- `KeyboardEnterSelects` - Enter key selects focused option
- `KeyboardEscapeCloses` - Escape key closes menu
- `KeyboardBackspaceRemovesTag` - Backspace removes last tag (multi-select)
- `KeyboardOnlyWorkflow` - Complete keyboard-only workflow (no mouse)

**Test Coverage:**

- ✅ Tab key focuses the input field (covered in `FocusTabKey`)
- ✅ Arrow Down opens menu and focuses first option
- ✅ Arrow Down moves to next option (aria-activedescendant changes)
- ✅ Arrow Up moves to previous option (aria-activedescendant changes)
- ✅ Enter key selects the focused option (single-select)
- ✅ Escape key closes the menu
- ✅ Input retains focus after Escape
- ✅ Backspace removes last tag when input empty (multi-select)
- ✅ Multiple Backspace presses remove tags sequentially
- ✅ Complete keyboard-only workflow (Tab → Arrow → Enter → Escape)

### Menu Opening & Closing ✅

**Status**: ✅ Implemented - 8 focused stories

**Stories:**

- `MenuOpensOnTyping` - Menu opens when typing (menuTrigger="input", default)
- `MenuOpensOnFocus` - Menu opens on focus (menuTrigger="focus")
- `MenuOpensManual` - Menu only opens via button (menuTrigger="manual")
- `MenuToggleButton` - Toggle button opens and closes menu
- `MenuClosesAfterSelectionSingle` - Menu auto-closes after single-select
- `MenuStaysOpenAfterSelectionMulti` - Menu stays open in multi-select mode
- `MenuClosesOnOutsideClick` - Menu closes when clicking outside
- `MenuClosesOnEscape` - Escape key closes menu

**Test Coverage:**

- ✅ Menu opens when user starts typing (menuTrigger="input")
- ✅ Menu does NOT open on focus when menuTrigger="input"
- ✅ Menu opens when input receives focus (menuTrigger="focus")
- ✅ Menu opens only on button click (menuTrigger="manual")
- ✅ Focus and typing do NOT open menu in manual mode
- ✅ Toggle button opens the menu
- ✅ Toggle button closes the menu
- ✅ Menu closes automatically after selection (single-select)
- ✅ Menu stays open after selection (multi-select)
- ✅ Can select multiple items without menu closing
- ✅ Menu closes when clicking outside component
- ✅ Menu closes when Escape key is pressed

### Option Selection ✅

**Status**: ✅ Implemented - 5 focused stories

**Stories:**

- `OptionClickingSelects` - Mouse click selects option
- `OptionHoverFeedback` - Hover interaction and clickability
- `OptionSelectedVisuallyDistinguished` - aria-selected attributes for
  selected/unselected
- `OptionKeyboardSelection` - Enter key selects focused option
- `OptionMultipleSelections` - Sequential multi-select workflow

**Test Coverage:**

- ✅ Clicking an option selects it (single-select)
- ✅ Hovering over options (verified via click after hover)
- ✅ Selected options have aria-selected="true" (multi-select)
- ✅ Unselected options do not have aria-selected
- ✅ Selection works via keyboard (Enter key)
- ✅ Multiple selections work (multi-select mode)
- ✅ Sequential selection of 3 items verified
- ✅ Tags appear for all selected items

### Clear Functionality ✅

**Status**: ✅ Implemented - 4 focused stories

**Stories:**

- `ClearRemovesSelectionSingle` - Clear button removes selection in
  single-select
- `ClearRemovesAllSelectionsMulti` - Clear button removes all tags in
  multi-select
- `ClearDoesNotCloseMenu` - Menu stays open after clearing (multi-select)
- `ClearAccessibleViaKeyboard` - Backspace key clears selections

**Test Coverage:**

- ✅ Clear button removes current selection (single-select)
- ✅ Input value becomes empty after clearing
- ✅ Clear button removes all selections (multi-select)
- ✅ All tags disappear after clearing
- ✅ Clear button does not close the menu
- ✅ Menu remains open after clearing in multi-select
- ✅ Clear button is accessible via keyboard (Backspace)
- ✅ Multiple Backspace presses clear tags sequentially

---

## 3. Selection Modes

### Single Select Mode ✅

**Status**: ✅ Implemented - 6 focused stories

**Stories:**

- `SingleSelectOneAtATime` - Only one option selectable, second replaces first
- `SingleSelectReplacesPrevious` - New selection replaces previous via click
- `SingleSelectTextInInput` - Selected text syncs to input field
- `SingleSelectClearRemoves` - Clear button empties input value
- `SingleSelectMenuCloses` - Menu auto-closes after selection
- `SingleSelectInputDisplaysValue` - Input displays full selected text (even
  long names)

**Test Coverage:**

- ✅ User can select one option at a time
- ✅ Selecting a new option replaces previous selection (keyboard)
- ✅ Selecting a new option replaces previous selection (mouse click)
- ✅ Selected option text appears in input field
- ✅ Clear button removes the selection
- ✅ Menu closes after selection (default behavior)
- ✅ Input displays correct value after selection
- ✅ Long text values display correctly

### Multi Select Mode ✅

**Status**: ✅ Implemented - 7 focused stories

**Stories:**

- `MultiSelectMultipleOptions` - Sequential selection of 3 items
- `MultiSelectOptionsAppearAsTags` - Selected items render as tags with remove
  buttons
- `MultiSelectTagRemoveDeselects` - Tag remove button deselects item
- `MultiSelectBackspaceRemoves` - Backspace key removes last tag
- `MultiSelectInputClearsAfterSelection` - Input empties after each selection
- `MultiSelectMenuStaysOpen` - Menu remains open after selections
- `MultiSelectClearRemovesAll` - Clear button removes all tags at once

**Test Coverage:**

- ✅ User can select multiple options
- ✅ Sequential selection of 3 items verified
- ✅ Selected options appear as tags
- ✅ Tags have remove buttons visible
- ✅ Clicking tag remove button deselects the item
- ✅ Remaining tags persist after one removed
- ✅ Backspace key removes last selected tag
- ✅ Input clears after each selection (verified 2x)
- ✅ Menu stays open after selections
- ✅ Clear button removes all selections
- ✅ All tags removed after clear button click

### Selection Persistence ✅

**Status**: ✅ Implemented - 3 focused stories

**Stories:**

- `PersistenceItemsPersistWhenFilteringChanges` - Tags persist across filter
  changes
- `PersistenceItemsRemainVisibleAsTags` - Tags visible regardless of filter text
- `PersistenceSelectedExcludedFromList` - Selected items excluded from dropdown
  options

**Test Coverage:**

- ✅ Selected items persist when filtering changes (filter: K → P → B)
- ✅ Multiple selections persist across filter changes
- ✅ Selected items remain visible as tags
- ✅ Tags visible when filter doesn't match their text
- ✅ Tags visible with empty filter

---

## 4. Search & Filtering

### Basic Text Filtering ✅

**Status**: ✅ Implemented - 6 focused stories

**Stories:**
- `FilteringTypingFiltersOptions` - Typing filters options (6→2→1 progression)
- `FilteringCaseInsensitive` - Case-insensitive matching (k, K, Ko all match)
- `FilteringPartialMatches` - Substring matching (ala, ng)
- `FilteringClearingShowsAll` - Clear input restores all options (2→6)
- `FilteringResetsOnMenuClose` - Filter state maintained on menu close/reopen
- `FilteringNoResultsState` - Empty state with no matches

**Test Coverage:**
- ✅ Typing filters the options list (progressive filtering verified)
- ✅ Options count decreases as filter narrows (6→2→1)
- ✅ Filtering is case-insensitive by default
- ✅ Lowercase, uppercase, and mixed case produce same results
- ✅ Partial text matches are shown (substring matching)
- ✅ Multiple partial match patterns tested
- ✅ Clearing input shows all options (restores full list)
- ✅ Filter state persists when menu closes and reopens
- ✅ No results state handled appropriately
- ✅ Empty state message displays when no matches
- ✅ Typing valid text after no matches restores options

### Section-Aware Filtering ✅

**Status**: ✅ Implemented - 1 comprehensive story

**Story:**
- `FilteringWithSections` - Section structure maintenance during filtering

**Test Coverage:**
- ✅ Sections appear with their header labels (Mammals, Birds, Other)
- ✅ Items are grouped under correct sections
- ✅ Filtering maintains section structure (empty sections hidden)
- ✅ Filter "eagle" → Only Birds section visible with Bald Eagle
- ✅ Filter "ko" → Only Mammals section visible with Koala
- ✅ Clear filter → All 3 sections visible again
- ✅ Filter "a" → Multiple sections have matches simultaneously
- ✅ Section headers queried from portal (document.body)

### Custom Filter Functions ✅

**Status**: ✅ Implemented - 7 focused stories

**Stories:**
- `CustomFilterStartsWith` - Prefix matching (filterByStartsWith)
- `CustomFilterCaseSensitive` - Exact case matching (filterByCaseSensitive)
- `CustomFilterWordBoundary` - Whole word matching (filterByWordBoundary)
- `CustomFilterFuzzy` - Characters in order matching (filterByFuzzy)
- `CustomFilterMultiProperty` - Multi-property search (createMultiPropertyFilter)
- `CustomFilterRanked` - Custom scoring/ranking with order verification (createRankedFilter)
- `CustomFilterMultiTerm` - Multi-term OR logic (createMultiTermFilter)

**Test Coverage:**
- ✅ Start-with matching (Ko matches Koala, al doesn't)
- ✅ Case-sensitive matching (Ko matches, ko doesn't)
- ✅ Word boundary matching (Eagle matches, ala doesn't)
- ✅ Fuzzy matching (koa, kng match via character order)
- ✅ Multi-property search (search by name OR category)
- ✅ Ranked/scored results with **order verification** (starts-with ranked higher than contains)
- ✅ Multi-term search (Koala Bison matches both via OR logic)

**Bug Fixed:**
- ✅ Added `filter` prop to destructuring in combobox.root.tsx (line 107)

### Empty State Handling ✅

**Status**: ✅ Implemented - 4 focused stories

**Stories:**
- `EmptyStateMenuClosesDefault` - Menu auto-closes when no matches (allowsEmptyMenu=false)
- `EmptyStateMenuStaysOpen` - Menu stays open with empty state (allowsEmptyMenu=true)
- `EmptyStateCustomMessage` - Custom renderEmptyState with multiple elements
- `EmptyStateRecoverByClearingSearch` - Clear search restores options (0→6)

**Test Coverage:**
- ✅ Menu closes when no matches found (default behavior)
- ✅ Menu stays open showing empty state (when allowsEmptyMenu=true)
- ✅ Empty state message displays correctly
- ✅ Options count is 0 during empty state
- ✅ Custom empty state message displays (multi-element render)
- ✅ Custom messages rendered in portal (document.body)
- ✅ User can recover by clearing search (0→6 options)
- ✅ User can type valid search after empty state

---

## 5. Custom Option Creation

### Basic Creation ✅

**Status**: ✅ Implemented - 5 focused stories

**Stories:**
- `CreationUserCanCreateOptions` - Basic custom option creation flow
- `CreationEnterOnNonMatchingText` - Sequential creation of multiple custom options
- `CreationEmptyInputDoesNotCreate` - Empty and whitespace-only validation
- `CreationDuplicatesPrevented` - Case-insensitive duplicate prevention
- `CreationCustomValidationRespected` - isValidNewOption custom rules

**Test Coverage:**
- ✅ User can create new options when allowsCustomOptions=true
- ✅ Press Enter on non-matching text creates option
- ✅ Created option appears as tag
- ✅ Multiple custom options can be created sequentially
- ✅ Empty input does not create option (Enter does nothing)
- ✅ Whitespace-only input does not create option
- ✅ Duplicate options are prevented (case-insensitive)
- ✅ Case variations don't create duplicates (Koala vs koala)
- ✅ Custom validation rules are respected (isValidNewOption)
- ✅ Invalid options rejected, valid options created

### Single-Select Custom Options ✅

**Status**: ✅ Implemented - 3 focused stories

**Stories:**
- `SingleSelectCreationAutoSelected` - Auto-selection after creation
- `SingleSelectCreationInputUpdates` - Input value sync and replacement
- `SingleSelectCreationMenuCloses` - Menu auto-closes after creation

**Test Coverage:**
- ✅ New option is automatically selected (input.value updates)
- ✅ Input updates to show new option text
- ✅ Second custom option replaces first (single-select behavior)
- ✅ Menu closes after creation

**Bugs Fixed:**
- ✅ Input value sync for custom options in single-select (combobox.root.tsx:881-885)
- ✅ Effect guard to prevent overwriting custom option input (combobox.root.tsx:1159-1165)

### Multi-Select Custom Options ✅

**Status**: Implemented in `MultiSelectCustomOptions` and
`AsyncMultiSelectCustomOptions`

- New option appears as a tag
- Input clears after creation
- Menu stays open after creation
- User can create multiple custom options

### Validation ✅

**Status**: Implemented in `MultiSelectCustomOptions`

- Validation function prevents invalid options
- Duplicate detection works (case-insensitive)
- Transform function properly formats new options
- Callback notifies parent component of creation

---

## 6. Async Data Loading

### Basic Async Loading ✅

**Status**: Implemented in `AsyncLoading` story

- Loading indicator appears while fetching
- Options populate after data loads
- Search input triggers new requests
- Debouncing prevents excessive API calls
- Minimum character requirement can be configured

### Error Handling ✅

**Status**: Implemented in `AsyncLoadingWithError` story

- Error message displays when load fails
- Component remains functional after error
- User can retry by typing again
- Custom error messages are shown

### Async with Multi-Select ✅

**Status**: Implemented in `AsyncMultiSelectPersistence` and
`AsyncMultiSelectCustomOptions`

- Selected items persist during new searches
- Tags remain visible while loading new results
- Already-selected items can be excluded from results
- Custom options work with async loading

### Request Management ⚠️

**Status**: Implicitly tested but not explicit

- Previous requests are cancelled when new search starts
- Component handles rapid typing appropriately
- No race conditions with overlapping requests

---

## 7. State Management

### Controlled Mode ⚠️

**Status**: Implicitly tested but not systematic

- Parent controls selection via props
- Parent controls input value via props
- Parent controls menu open state via props
- Changes notify parent via callbacks

### Uncontrolled Mode ⚠️

**Status**: Implicitly tested

- Component manages selection internally
- Component manages input value internally
- Component manages menu state internally
- Default values are respected

### State Synchronization ⚠️

**Status**: Implicitly tested

- Selection changes trigger callbacks
- Input changes trigger callbacks
- Menu state changes trigger callbacks
- External prop changes update component

---

## 8. Accessibility

### Keyboard Accessibility ✅

**Status**: ✅ Implemented - 5 focused stories

**Stories:**
- `A11yKeyboardAllFunctionalityAvailable` - Complete keyboard-only workflow
- `A11yKeyboardNoTraps` - Tab navigation exits component
- `A11yKeyboardFocusManagement` - Focus maintained throughout interactions
- `A11yKeyboardShortcuts` - All shortcuts tested
- `A11yKeyboardFocusIndicators` - aria-activedescendant verification

**Test Coverage:**
- ✅ All functionality available via keyboard (Arrow, Enter, Backspace, Escape)
- ✅ No keyboard traps (can Tab to next component)
- ✅ Focus management works correctly (virtual focus pattern)
- ✅ Keyboard shortcuts work as expected (5 shortcuts tested)
- ✅ Focus indicators are visible (aria-activedescendant)

### ARIA Relationships ✅

**Status**: ✅ Implemented - 5 focused stories (2 with minor issues)

**Stories:**
- `A11yAriaInputListboxRelationship` - aria-controls verification
- `A11yAriaLabelsAssociated` - aria-label and aria-labelledby ⚠️
- `A11yAriaDescriptionsAssociated` - aria-describedby for descriptions
- `A11yAriaErrorMessagesAssociated` - aria-describedby for errors ⚠️
- `A11yAriaFocusedOptionIdentified` - aria-activedescendant verification

**Test Coverage:**
- ✅ Input properly associated with listbox (aria-controls)
- ✅ Listbox ID matches aria-controls value
- ⚠️ Labels association (React Aria auto-generates IDs)
- ✅ Descriptions properly associated with input
- ⚠️ Error messages (FormField.ErrorMessage integration issue)
- ✅ Currently focused option is properly identified (aria-activedescendant)
- ✅ Activedescendant updates when navigating

**Note**: 98/100 tests passing - 2 failures related to FormField integration details

---

## 9. Visual States

### Size Variants ✅

**Status**: ✅ Implemented - 3 focused stories

**Stories:**
- `SizeSmallVariant` - Small size root container (32px height)
- `SizeMediumVariant` - Medium size root container (40px height)
- `SizeAffectsRootHeight` - Height comparison between sizes

**Test Coverage:**
- ✅ Small (sm) size renders correctly (32px height)
- ✅ Medium (md) size renders correctly (40px height, default)
- ✅ Size affects root container height (40px > 32px)
- ✅ Specific pixel measurements verified

**Note**: Only sm and md sizes supported (no lg)

### Visual Variants ✅

**Status**: ✅ Implemented - 3 focused stories

**Stories:**
- `VariantSolid` - Solid variant root container (288px fixed width)
- `VariantGhost` - Ghost variant root container (≤288px max width)
- `VariantStylingPreservedDuringInteractions` - Width maintained after interaction

**Test Coverage:**
- ✅ Solid variant displays correctly (288px fixed width)
- ✅ Ghost variant displays correctly (≤288px max width)
- ✅ Variant styling preserved during interactions
- ✅ Width maintained after selection

**Note**: Only solid and ghost variants (no outline or filled)

### State: isRequired ❌

**Status**: Not tested

- Required indicator displays (visual marker like asterisk)
- Required state is announced to screen readers
- Label includes required indicator
- Form validation enforces required state
- Required field prevents form submission when empty
- Error message displays when required field is empty

### State: isReadOnly ❌

**Status**: Not tested

- Input displays current value but prevents editing
- Input field is visually distinguishable as read-only
- Typing in input has no effect
- Clear button is hidden
- Toggle button is hidden or disabled
- Menu does not open when clicked
- Menu does not open when typing
- Selected values remain visible
- Component is focusable but not editable
- Screen readers announce read-only state

### State: isDisabled ❌

**Status**: Not tested

- Component appears visually disabled (reduced opacity/contrast)
- Input field is not editable
- Input field is not focusable
- Toggle button does not respond to clicks
- Clear button does not respond to clicks
- Menu does not open
- All interactive elements are disabled
- Component cannot receive focus via keyboard
- Screen readers announce disabled state
- Cursor shows not-allowed when hovering

### State: isInvalid ❌

**Status**: Not tested

- Component displays error styling (red border or error color)
- Error message displays below component
- Error icon appears (if configured)
- Input field shows invalid state visually
- Error state is announced to screen readers
- aria-invalid attribute is set correctly
- Error message is associated with input via aria-describedby
- Error state is visible during interaction
- Error state persists until resolved
- Error styling applies to all relevant parts (input, border, etc.)

### Combined State Testing ❌

**Status**: Not tested

- `isRequired + isInvalid` - Shows both required indicator and error state
- `isReadOnly + value` - Displays value but prevents editing
- `isDisabled + isInvalid` - Disabled takes precedence over invalid styling
- `isDisabled + value` - Shows value but is completely non-interactive
- `size + variant` - All size/variant combinations render correctly
- `isRequired + isEmpty` - Required indicator visible on empty field

### Focus States ❌

**Status**: Not tested

- Focus ring appears when input receives focus
- Focus ring is clearly visible across all color schemes
- Focus ring meets WCAG contrast requirements
- Focus ring respects variant styling
- Focus state is different from hover state
- Focus state works with keyboard navigation
- Focus state does not appear on mouse click (focus-visible)

### Hover States ❌

**Status**: Not tested

- Input shows hover styling when cursor is over trigger area
- Toggle button shows hover styling
- Clear button shows hover styling
- Menu items show hover styling
- Tags show hover styling on remove button
- Hover states are visually distinct from default state
- Hover states work consistently across variants
- Disabled elements do not show hover effects

## 10. Form Integration

### Form Submission ❌

**Status**: Not tested

- Selected values submit with form
- Form name attribute works correctly
- Works with native form submission
- Hidden input created for form integration

### Validation States ❌

**Status**: Not tested (covered above in Visual States section)

- Required validation works
- Invalid state displays correctly
- Disabled state prevents interaction
- Read-only state prevents changes
- Validation messages are accessible

### Form Library Integration ❌

**Status**: Not tested

- Works with React Hook Form
- Works with Formik
- Validation integrates properly
- Form reset works correctly

---

## 11. Edge Cases & Robustness

### Data Edge Cases ❌

**Status**: Not tested

- Handles very long option text gracefully
- Handles very long input values
- Handles special characters in text
- Handles duplicate option values
- Handles large option lists (100+)
- Handles empty string options
- Handles null/undefined values appropriately

### User Input Edge Cases ❌

**Status**: Not tested

- Rapid typing handled correctly
- Quick selection/deselection handled
- Simultaneous keyboard and mouse input
- Copy/paste into input field
- Very fast keyboard navigation

### Component Lifecycle ❌

**Status**: Not tested

- Component mounts correctly
- Component updates correctly
- Component unmounts cleanly
- No memory leaks
- Event listeners cleaned up

---

## 12. Portal & Positioning

### Menu Positioning ❌

**Status**: Visual only, not tested

- Menu appears below trigger by default
- Menu flips above trigger when no space below
- Menu aligns with trigger horizontally
- Menu width matches trigger width
- Menu respects viewport boundaries

### Portal Contexts ❌

**Status**: Not tested

- Works correctly inside Modal
- Works correctly inside Drawer
- Works correctly in scrollable containers
- Position updates when container scrolls
- Position updates when window resizes

---

## 13. Regression Prevention

### Known Fixed Bugs ❌

**Status**: Not systematically tested

Document any previously fixed bugs here with regression tests to ensure they
don't return.

### Visual Consistency ❌

**Status**: Not implemented

- Component appearance matches design
- Variants render correctly
- States (disabled, error, etc.) display correctly
- Responsive behavior works as expected
