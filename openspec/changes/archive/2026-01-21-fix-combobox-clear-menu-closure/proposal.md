# Fix ComboBox Clear Button Menu Closure

## Problem

The ComboBox component's clear button currently closes the menu/popover after
clearing selections in multi-select mode. This behavior is incorrect and creates
a poor user experience:

1. **Test Failure**: The `ClearDoesNotCloseMenu` test expects the menu to remain
   open after clicking the clear button, but the actual rendered component
   closes the menu (test passes due to timing issue/false positive)

2. **UX Inconsistency**: The menu closure interrupts the selection workflow,
   forcing users to reopen the menu to continue selecting items after clearing

3. **Contradicts Design System Patterns**: Major design systems (Carbon Design
   System, Material UI, Chakra UI) keep menus open after clearing in
   multi-select contexts to reduce interaction cost

## Current Behavior

**Multi-select mode:**

- User enters text in search box → menu opens with filtered results
- User selects items → tags appear, menu stays open
- User clicks clear button → **menu closes** (incorrect)
- User must manually reopen menu to continue selecting

**Impact:**

- Disrupts user workflow
- Increases interaction cost (extra click to reopen)
- Test suite has false positive (timing-dependent assertion passes despite
  incorrect behavior)

## Desired Behavior

**Multi-select mode:**

- User enters text in search box → menu opens with filtered results
- User selects items → tags appear, menu stays open
- User clicks clear button → selections and input text are cleared, **menu
  remains open**
- All options become available again (filter is reset)
- Focus stays on input field
- User can immediately continue selecting without reopening

**Single-select mode:**

- Clear button clears selection and input text
- Menu **remains open** if input is focused
- Menu closes only on blur or explicit user action (Escape, Tab, clicking
  outside)

## Root Cause

Analysis of `combobox.root.tsx` reveals several potential causes:

1. **Focus Loss** (lines 798-809): The `clearSelection` function doesn't
   explicitly manage menu state or ensure focus remains on input after clearing

2. **Blur Handler** (lines 1112-1128): The `handleBlur` function closes the menu
   when focus leaves the combobox. If the clear button click causes focus loss,
   this triggers menu closure

3. **Auto-Close Effect** (lines 1230-1257): The effect that auto-closes the menu
   when the collection becomes empty might be triggering incorrectly

4. **Missing State Management**: No explicit logic to keep menu open after clear
   button press in multi-select mode

## Proposed Solution

### Code Changes

**File**: `packages/nimbus/src/components/combobox/components/combobox.root.tsx`

1. **Update `clearSelection` function** (lines 798-809):
   - Add logic to keep menu open after clearing in multi-select mode
   - Ensure focus returns/stays on input field
   - Reset input value to empty string to show all options

2. **Update clear button handler** (lines 1355-1365 in ButtonContext):
   - Prevent focus loss during clear button press
   - Explicitly maintain menu open state for multi-select

3. **Refine blur handler** (lines 1112-1128):
   - Add check to prevent closing if clear button triggered the blur
   - Ensure menu only closes on genuine focus loss (not button clicks within
     component)

### Test Updates

**File**: `packages/nimbus/src/components/combobox/combobox.stories.tsx`

1. **Fix `ClearDoesNotCloseMenu` test** (line 3001):
   - Add explicit wait/delay before final assertion to avoid timing-dependent
     false positive
   - Add assertion to verify input is focused after clear
   - Add assertion to verify input value is cleared

## Success Criteria

1. **Visual Testing**: In Storybook, clicking clear button in multi-select mode
   keeps menu open
2. **Test Suite**: `ClearDoesNotCloseMenu` test passes with explicit timing
   controls
3. **Focus Management**: Input field retains focus after clear button click
4. **Input State**: Input value is cleared, showing all available options
5. **Keyboard Navigation**: Menu remains keyboard-navigable immediately after
   clearing
6. **Accessibility**: Screen readers announce cleared state without announcing
   menu closure/reopening

## Alternatives Considered

1. **Always close menu after clear**: Rejected because it contradicts design
   system patterns and increases interaction cost

2. **Context-dependent behavior** (close if no text, open if text present):
   Rejected as overly complex; simpler to always keep open in multi-select

3. **User preference prop** (`closeOnClear`): Rejected as unnecessary
   configuration surface; standard behavior should be correct by default

## Risks & Mitigations

**Risk**: Breaking change for users who expect menu to close **Mitigation**:
This is a bug fix restoring correct behavior, not a breaking API change. Users
can still close menu via Escape, Tab, or clicking outside

**Risk**: Focus management edge cases in different browsers **Mitigation**: Test
across browsers (Chrome, Firefox, Safari) and ensure blur handler correctly
identifies clear button clicks

**Risk**: Test timing issues persist **Mitigation**: Add explicit waits and
assertions for focus state and menu visibility

## References

### Design System Research

- **Carbon Design System**: Multi-select dropdowns keep menu open while options
  are being selected
  ([source](https://carbondesignsystem.com/components/dropdown/usage/))
- **Material UI Autocomplete**: Clear button clears value but doesn't close menu
  in multi-select ([source](https://mui.com/material-ui/api/autocomplete/))
- **Chakra UI**: Clear trigger maintains menu state
  ([source](https://chakra-ui.com/docs/components/combobox))

### ARIA Specifications

- **W3C ARIA Authoring Practices**: Combobox pattern doesn't specify clear
  button behavior, leaving it to UX discretion
  ([source](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/))

### Related Files

- `packages/nimbus/src/components/combobox/components/combobox.root.tsx` - Main
  state management
- `packages/nimbus/src/components/combobox/components/combobox.trigger.tsx` -
  Clear button rendering
- `packages/nimbus/src/components/combobox/combobox.stories.tsx` - Tests and
  documentation
- `packages/nimbus/src/components/combobox/combobox.types.ts` - Type definitions

## Timeline

- **Proposal Review**: 1 day
- **Implementation**: 2-3 days (including browser testing)
- **Test Validation**: 1 day
- **Total**: 4-5 days
