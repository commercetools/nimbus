# Specification: useHotkeys Hook

## Overview

The useHotkeys hook provides declarative keyboard shortcut handling for React components. It wraps the react-hotkeys-hook library to enable listening to hotkeys and executing callbacks when users press specified key combinations.

**Hook:** `useHotkeys`
**Package:** `@commercetools/nimbus`
**Type:** React hook (re-export)
**Library Integration:** react-hotkeys-hook v5.2.1

## Purpose

The useHotkeys hook enables components to bind keyboard shortcuts declaratively and execute callback functions when users press hotkeys. It provides cross-platform key mapping, modifier key support, scope management, and configurable behavior for form elements and content-editable areas while following React hook rules.

## Requirements

### Requirement: Hook Signature and Parameters
The hook SHALL accept keys, callback, optional options, and optional dependencies parameters.

#### Scenario: Basic hook call with keys and callback
- **WHEN** useHotkeys is called with keys string and callback function
- **THEN** SHALL register keyboard event listeners for specified keys
- **AND** SHALL execute callback when hotkey is pressed
- **AND** SHALL return React ref object for optional element attachment

#### Scenario: Hook call with options object
- **WHEN** useHotkeys is called with keys, callback, and options object
- **THEN** SHALL apply configuration from options parameter
- **AND** SHALL use default React dependency array behavior
- **AND** SHALL return React ref object

#### Scenario: Hook call with dependency array as third parameter
- **WHEN** useHotkeys is called with keys, callback, and dependency array as third parameter
- **THEN** SHALL treat third parameter as React dependency array
- **AND** SHALL use default options
- **AND** SHALL re-register hotkey when dependencies change

#### Scenario: Hook call with options and separate dependencies
- **WHEN** useHotkeys is called with keys, callback, options, and dependencies as fourth parameter
- **THEN** SHALL apply options configuration
- **AND** SHALL use provided dependency array for effect re-execution
- **AND** SHALL re-register hotkey when dependencies change

### Requirement: Keys Parameter Format
The hook SHALL accept keys in string or array formats following KeyboardEvent.code naming.

#### Scenario: Single key string
- **WHEN** keys parameter is a single key string like "Escape"
- **THEN** SHALL register listener for that single key
- **AND** SHALL match KeyboardEvent.code value (case-insensitive)
- **AND** SHALL trigger callback when key is pressed

#### Scenario: Key combination with modifier
- **WHEN** keys parameter includes modifier like "Ctrl+k" or "Meta+Shift+p"
- **THEN** SHALL register listener for modifier combination
- **AND** SHALL require all modifiers to be pressed simultaneously
- **AND** SHALL trigger callback only when complete combination matches

#### Scenario: Multiple key combinations array
- **WHEN** keys parameter is array of strings like ["Escape", "Ctrl+k"]
- **THEN** SHALL register listeners for all key combinations in array
- **AND** SHALL trigger callback when any combination matches
- **AND** SHALL treat array as logical OR of hotkeys

#### Scenario: Case-insensitive key names
- **WHEN** keys use different casing like "escape", "Escape", or "ESCAPE"
- **THEN** SHALL match KeyboardEvent.code case-insensitively
- **AND** SHALL register listener successfully regardless of case
- **AND** SHALL trigger callback when key is pressed

### Requirement: Callback Function Execution
The hook SHALL execute callback with keyboard event and hotkey event parameters.

#### Scenario: Callback invocation with events
- **WHEN** registered hotkey is pressed
- **THEN** SHALL call callback function with two parameters
- **AND** first parameter SHALL be native KeyboardEvent object
- **AND** second parameter SHALL be HotkeysEvent object with hotkey metadata

#### Scenario: HotkeysEvent structure
- **WHEN** callback receives HotkeysEvent parameter
- **THEN** SHALL include hotkey string that matched
- **AND** SHALL include keys array of pressed keys
- **AND** SHALL include modifier booleans (alt, ctrl, meta, shift, mod)
- **AND** SHALL include scopes array if scopes are active
- **AND** SHALL include description string if provided in options

#### Scenario: Callback return value handling
- **WHEN** callback function executes
- **THEN** return value SHALL be ignored
- **AND** callback SHALL be treated as void function
- **AND** SHALL not affect event propagation based on return value

### Requirement: Modifier Key Support
The hook SHALL support standard keyboard modifiers across platforms.

#### Scenario: Control modifier (Ctrl)
- **WHEN** keys include "Ctrl+" prefix
- **THEN** SHALL require Control key to be pressed on Windows/Linux
- **AND** SHALL register listener for Ctrl combination
- **AND** SHALL trigger callback only when Ctrl is held during key press

#### Scenario: Meta modifier (Command on Mac, Windows key on PC)
- **WHEN** keys include "Meta+" prefix
- **THEN** SHALL require Meta/Command key to be pressed
- **AND** SHALL map to Command key on macOS
- **AND** SHALL map to Windows key on Windows/Linux

#### Scenario: Alt modifier (Option on Mac)
- **WHEN** keys include "Alt+" prefix
- **THEN** SHALL require Alt/Option key to be pressed
- **AND** SHALL register listener for Alt combination
- **AND** SHALL trigger callback only when Alt is held during key press

#### Scenario: Shift modifier
- **WHEN** keys include "Shift+" prefix
- **THEN** SHALL require Shift key to be pressed
- **AND** SHALL register listener for Shift combination
- **AND** SHALL trigger callback only when Shift is held during key press

#### Scenario: Cross-platform modifier (Mod)
- **WHEN** keys include "Mod+" prefix
- **THEN** SHALL map to Meta (Command) on macOS
- **AND** SHALL map to Ctrl on Windows/Linux
- **AND** SHALL provide cross-platform consistent keyboard shortcuts

#### Scenario: Multiple modifiers combination
- **WHEN** keys include multiple modifiers like "Ctrl+Shift+k"
- **THEN** SHALL require all specified modifiers to be pressed
- **AND** SHALL check modifiers in any order
- **AND** SHALL trigger callback only when all modifiers and key match

### Requirement: Special Keys Support
The hook SHALL support special keyboard keys beyond alphanumeric characters.

#### Scenario: Escape key
- **WHEN** keys parameter is "Escape" or "escape"
- **THEN** SHALL register listener for Escape key
- **AND** SHALL trigger callback when Escape is pressed
- **AND** SHALL commonly be used for closing dialogs and canceling actions

#### Scenario: Enter key
- **WHEN** keys parameter is "Enter"
- **THEN** SHALL register listener for Enter key
- **AND** SHALL trigger callback when Enter is pressed
- **AND** SHALL commonly be used for form submission and confirmation

#### Scenario: Space key
- **WHEN** keys parameter is "Space"
- **THEN** SHALL register listener for Space bar
- **AND** SHALL trigger callback when Space is pressed
- **AND** SHALL follow KeyboardEvent.code naming convention

#### Scenario: Tab key
- **WHEN** keys parameter is "Tab"
- **THEN** SHALL register listener for Tab key
- **AND** SHALL trigger callback when Tab is pressed
- **AND** SHALL respect preventDefault option for preventing focus change

#### Scenario: Arrow keys
- **WHEN** keys parameter includes "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"
- **THEN** SHALL register listeners for arrow navigation keys
- **AND** SHALL trigger callback for respective arrow key press
- **AND** SHALL commonly be used for keyboard navigation

#### Scenario: Function keys
- **WHEN** keys parameter includes "F1" through "F12"
- **THEN** SHALL register listeners for function keys
- **AND** SHALL trigger callback for respective function key press
- **AND** SHALL respect preventDefault to avoid browser default behavior

#### Scenario: Home, End, PageUp, PageDown keys
- **WHEN** keys parameter includes "Home", "End", "PageUp", "PageDown"
- **THEN** SHALL register listeners for navigation keys
- **AND** SHALL trigger callback for respective key press
- **AND** SHALL commonly be used for list and document navigation

### Requirement: Options - Enabled
The hook SHALL support conditional hotkey activation via enabled option.

#### Scenario: Enabled set to true (default)
- **WHEN** enabled option is true or undefined
- **THEN** SHALL register hotkey listeners
- **AND** SHALL trigger callback when hotkey is pressed
- **AND** SHALL activate hotkey functionality

#### Scenario: Enabled set to false
- **WHEN** enabled option is false
- **THEN** SHALL NOT register hotkey listeners
- **AND** SHALL NOT trigger callback when keys are pressed
- **AND** SHALL effectively disable hotkey

#### Scenario: Enabled as function returning boolean
- **WHEN** enabled option is function receiving KeyboardEvent and HotkeysEvent
- **THEN** SHALL call function on each potential hotkey press
- **AND** SHALL trigger callback only if function returns true
- **AND** SHALL provide dynamic conditional hotkey activation

#### Scenario: Enabled changes during component lifecycle
- **WHEN** enabled option changes from true to false
- **THEN** SHALL unregister hotkey listeners
- **AND** SHALL NOT trigger callback until enabled becomes true again
- **AND** SHALL re-register listeners when enabled becomes true

### Requirement: Options - EnableOnFormTags
The hook SHALL control hotkey behavior in form elements via enableOnFormTags option.

#### Scenario: EnableOnFormTags false (default)
- **WHEN** enableOnFormTags is false or undefined
- **THEN** SHALL NOT trigger callback when focus is in input, textarea, or select elements
- **AND** SHALL prevent accidental hotkey triggers during typing
- **AND** SHALL check focused element tag name before triggering

#### Scenario: EnableOnFormTags true
- **WHEN** enableOnFormTags is true
- **THEN** SHALL trigger callback even when focus is in form elements
- **AND** SHALL allow hotkeys to work in input, textarea, select elements
- **AND** SHALL enable form-aware keyboard shortcuts

#### Scenario: EnableOnFormTags with specific tag array
- **WHEN** enableOnFormTags is array like ["input", "textarea"]
- **THEN** SHALL trigger callback only when focus is in specified form tag types
- **AND** SHALL NOT trigger for form tags not in array
- **AND** SHALL provide fine-grained form element control

#### Scenario: EnableOnFormTags with ARIA roles
- **WHEN** enableOnFormTags includes ARIA roles like "textbox", "searchbox", "spinbutton"
- **THEN** SHALL check focused element role attribute
- **AND** SHALL trigger callback when focus matches specified roles
- **AND** SHALL support accessible custom form controls

### Requirement: Options - EnableOnContentEditable
The hook SHALL control hotkey behavior in content-editable elements.

#### Scenario: EnableOnContentEditable false (default)
- **WHEN** enableOnContentEditable is false or undefined
- **THEN** SHALL NOT trigger callback when focus is in contentEditable element
- **AND** SHALL prevent hotkey conflicts during rich text editing
- **AND** SHALL check contentEditable attribute before triggering

#### Scenario: EnableOnContentEditable true
- **WHEN** enableOnContentEditable is true
- **THEN** SHALL trigger callback even when focus is in contentEditable element
- **AND** SHALL allow hotkeys to work in rich text editors
- **AND** SHALL enable editor-specific keyboard shortcuts

### Requirement: Options - PreventDefault
The hook SHALL support preventing default browser behavior via preventDefault option.

#### Scenario: PreventDefault false (default)
- **WHEN** preventDefault is false or undefined
- **THEN** SHALL NOT call event.preventDefault()
- **AND** SHALL allow browser default behavior to execute
- **AND** SHALL let event propagate normally

#### Scenario: PreventDefault true
- **WHEN** preventDefault is true
- **THEN** SHALL call event.preventDefault() before callback execution
- **AND** SHALL prevent browser default behavior for hotkey
- **AND** SHALL commonly be used with function keys and Ctrl+key combinations

#### Scenario: PreventDefault as function returning boolean
- **WHEN** preventDefault is function receiving KeyboardEvent and HotkeysEvent
- **THEN** SHALL call function on each hotkey press
- **AND** SHALL call event.preventDefault() only if function returns true
- **AND** SHALL provide conditional preventDefault logic

#### Scenario: PreventDefault with Tab key
- **WHEN** preventDefault is true and hotkey is "Tab"
- **THEN** SHALL prevent focus change behavior
- **AND** SHALL allow custom Tab key handling
- **AND** SHALL execute callback without focus moving

### Requirement: Options - Description
The hook SHALL support hotkey description metadata via description option.

#### Scenario: Description string provided
- **WHEN** description option is set to string like "Open search dialog"
- **THEN** SHALL include description in HotkeysEvent passed to callback
- **AND** description SHALL be available for documentation generation
- **AND** SHALL help developers document hotkey purpose

#### Scenario: Description undefined
- **WHEN** description option is not provided
- **THEN** HotkeysEvent description SHALL be undefined
- **AND** SHALL not affect hotkey functionality
- **AND** description SHALL be optional metadata

### Requirement: Options - Scopes
The hook SHALL support hotkey scoping to prevent collisions via scopes option.

#### Scenario: No scopes defined (default global scope)
- **WHEN** scopes option is undefined
- **THEN** hotkey SHALL be active in global scope
- **AND** SHALL trigger regardless of active scope
- **AND** SHALL use default global behavior

#### Scenario: Single scope string
- **WHEN** scopes option is string like "dialog"
- **THEN** hotkey SHALL only be active when "dialog" scope is active
- **AND** SHALL NOT trigger when different scope is active
- **AND** SHALL enable context-specific hotkeys

#### Scenario: Multiple scopes array
- **WHEN** scopes option is array like ["dialog", "modal"]
- **THEN** hotkey SHALL be active when any listed scope is active
- **AND** SHALL trigger in "dialog" OR "modal" scope
- **AND** SHALL provide scope flexibility

#### Scenario: Scope activation and deactivation
- **WHEN** component with scoped hotkey mounts
- **THEN** SHALL activate hotkey when scope becomes active
- **AND** SHALL deactivate hotkey when scope becomes inactive
- **AND** SHALL manage scope lifecycle automatically

### Requirement: Options - Keydown and Keyup
The hook SHALL support triggering on keydown or keyup events.

#### Scenario: Keydown true (default)
- **WHEN** keydown option is true or undefined
- **THEN** SHALL register keydown event listener
- **AND** SHALL trigger callback on key press down
- **AND** SHALL use browser keydown event

#### Scenario: Keydown false, keyup true
- **WHEN** keydown is false and keyup is true
- **THEN** SHALL register keyup event listener instead
- **AND** SHALL trigger callback on key release
- **AND** SHALL use browser keyup event

#### Scenario: Both keydown and keyup true
- **WHEN** both keydown and keyup options are true
- **THEN** SHALL register both event listeners
- **AND** SHALL trigger callback on both key press and release
- **AND** callback SHALL execute twice per key action

### Requirement: Options - SplitKey
The hook SHALL support custom key combination separator via splitKey option.

#### Scenario: Default splitKey (plus sign)
- **WHEN** splitKey option is undefined
- **THEN** SHALL use "+" as modifier separator
- **AND** SHALL parse "Ctrl+k" as Ctrl modifier with k key
- **AND** SHALL follow standard hotkey notation

#### Scenario: Custom splitKey
- **WHEN** splitKey option is set to custom string like "-"
- **THEN** SHALL use custom separator for parsing key combinations
- **AND** SHALL parse "Ctrl-k" as Ctrl modifier with k key
- **AND** SHALL allow alternative notation preferences

### Requirement: Options - IgnoreModifiers
The hook SHALL support ignoring modifier keys via ignoreModifiers option.

#### Scenario: IgnoreModifiers false (default)
- **WHEN** ignoreModifiers is false or undefined
- **THEN** SHALL require exact modifier match for hotkey trigger
- **AND** "k" hotkey SHALL NOT trigger when "Ctrl+k" is pressed
- **AND** SHALL enforce strict key combination matching

#### Scenario: IgnoreModifiers true
- **WHEN** ignoreModifiers is true
- **THEN** SHALL trigger callback regardless of pressed modifiers
- **AND** "k" hotkey SHALL trigger even when Ctrl, Alt, or Shift are held
- **AND** SHALL provide flexible modifier-agnostic matching

### Requirement: Options - IgnoreEventWhen
The hook SHALL support custom event filtering via ignoreEventWhen option.

#### Scenario: IgnoreEventWhen function provided
- **WHEN** ignoreEventWhen option is function receiving KeyboardEvent
- **THEN** SHALL call function on each potential hotkey press
- **AND** SHALL NOT trigger callback if function returns true
- **AND** SHALL provide custom logic for ignoring events

#### Scenario: IgnoreEventWhen returns true
- **WHEN** ignoreEventWhen function returns true for event
- **THEN** SHALL skip callback execution
- **AND** SHALL NOT call preventDefault even if configured
- **AND** SHALL effectively filter out unwanted events

#### Scenario: IgnoreEventWhen returns false
- **WHEN** ignoreEventWhen function returns false for event
- **THEN** SHALL proceed with normal hotkey handling
- **AND** SHALL trigger callback if other conditions are met
- **AND** SHALL allow event to be processed

### Requirement: Options - Document
The hook SHALL support custom document context via document option.

#### Scenario: Default document (window.document)
- **WHEN** document option is undefined
- **THEN** SHALL attach listeners to window.document
- **AND** SHALL listen to events from main document
- **AND** SHALL use global document context

#### Scenario: Custom document object
- **WHEN** document option is set to custom Document object
- **THEN** SHALL attach listeners to provided document
- **AND** SHALL listen to events from custom document context
- **AND** SHALL support iframe or shadow DOM scenarios

### Requirement: Return Value - React Ref
The hook SHALL return a React ref object for optional element attachment.

#### Scenario: Ref return type
- **WHEN** useHotkeys is called
- **THEN** SHALL return React.RefObject<T | null>
- **AND** T SHALL be HTMLElement type by default
- **AND** SHALL support generic type parameter for specific element types

#### Scenario: Ref usage with element
- **WHEN** returned ref is attached to element via ref prop
- **THEN** hotkey SHALL be scoped to that element and its descendants
- **AND** SHALL only trigger when element or descendants have focus
- **AND** SHALL provide component-scoped hotkey behavior

#### Scenario: Ref not used
- **WHEN** returned ref is not attached to any element
- **THEN** hotkey SHALL be document-wide
- **AND** SHALL trigger regardless of focus location
- **AND** SHALL provide global hotkey behavior

### Requirement: Event Listener Registration and Cleanup
The hook SHALL properly register and clean up event listeners following React lifecycle.

#### Scenario: Listener registration on mount
- **WHEN** component using useHotkeys mounts
- **THEN** SHALL register keyboard event listeners on document or specified element
- **AND** SHALL listen for keydown events by default
- **AND** SHALL apply options configuration to listeners

#### Scenario: Listener cleanup on unmount
- **WHEN** component using useHotkeys unmounts
- **THEN** SHALL remove all registered keyboard event listeners
- **AND** SHALL prevent memory leaks
- **AND** SHALL follow React cleanup pattern

#### Scenario: Listener re-registration on dependency change
- **WHEN** dependencies array values change
- **THEN** SHALL clean up previous event listeners
- **AND** SHALL register new event listeners with updated closure
- **AND** SHALL use latest callback and options

#### Scenario: Listener re-registration on keys change
- **WHEN** keys parameter changes
- **THEN** SHALL unregister previous key combinations
- **AND** SHALL register new key combinations
- **AND** SHALL update hotkey binding dynamically

### Requirement: Multiple Hotkey Bindings in Single Call
The hook SHALL support multiple hotkey combinations via array parameter.

#### Scenario: Array of key combinations
- **WHEN** keys parameter is array like ["Escape", "Ctrl+w", "Cmd+w"]
- **THEN** SHALL register all combinations
- **AND** SHALL trigger callback when any combination is pressed
- **AND** HotkeysEvent SHALL indicate which combination matched

#### Scenario: Cross-platform alternative bindings
- **WHEN** keys array includes both "Ctrl+k" and "Meta+k"
- **THEN** SHALL support same action on Windows/Linux and macOS
- **AND** SHALL trigger callback for platform-appropriate combination
- **AND** SHALL provide cross-platform UX consistency

### Requirement: Key Combination Parsing
The hook SHALL parse key combination strings following established format.

#### Scenario: Single key parsing
- **WHEN** keys is "k"
- **THEN** SHALL parse as single key without modifiers
- **AND** SHALL register listener for "k" key press
- **AND** SHALL match KeyboardEvent.code

#### Scenario: Modifier plus key parsing
- **WHEN** keys is "Ctrl+Shift+k"
- **THEN** SHALL parse Ctrl and Shift as required modifiers
- **AND** SHALL parse k as primary key
- **AND** SHALL require all components for match

#### Scenario: Whitespace handling
- **WHEN** keys includes whitespace like "Ctrl + k" or " Escape "
- **THEN** SHALL trim and normalize whitespace
- **AND** SHALL parse correctly regardless of spacing
- **AND** SHALL be tolerant of formatting variations

### Requirement: React Hook Rules Compliance
The hook SHALL follow React hook rules per nimbus-core standards.

#### Scenario: Hook naming convention
- **WHEN** hook is defined
- **THEN** SHALL be named with 'use' prefix
- **AND** SHALL follow camelCase naming (useHotkeys)
- **AND** name SHALL clearly indicate keyboard shortcut functionality

#### Scenario: Top-level only usage
- **WHEN** useHotkeys is called
- **THEN** SHALL only be called at top level of component or custom hook
- **AND** SHALL NOT be called conditionally
- **AND** SHALL NOT be called in loops or nested functions

#### Scenario: React component or hook context
- **WHEN** useHotkeys is used
- **THEN** SHALL only be called from React function components or custom hooks
- **AND** SHALL NOT be called from regular JavaScript functions
- **AND** SHALL follow all Rules of Hooks

### Requirement: TypeScript Type Safety
The hook SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Keys parameter type
- **WHEN** keys parameter is typed
- **THEN** SHALL accept string or readonly string[]
- **AND** Keys type SHALL be exported from package
- **AND** SHALL provide type safety for key combinations

#### Scenario: Callback parameter types
- **WHEN** callback parameter is typed
- **THEN** SHALL be HotkeyCallback type
- **AND** SHALL receive KeyboardEvent and HotkeysEvent parameters
- **AND** SHALL be typed as void return

#### Scenario: Options parameter type
- **WHEN** options parameter is typed
- **THEN** SHALL be Options interface from react-hotkeys-hook
- **AND** all option properties SHALL have proper types
- **AND** SHALL provide autocomplete for configuration

#### Scenario: Return type
- **WHEN** hook return value is typed
- **THEN** SHALL be React.RefObject<T | null>
- **AND** T SHALL be generic HTMLElement type parameter
- **AND** SHALL support specific element types like RefObject<HTMLDivElement>

#### Scenario: Type exports
- **WHEN** types are imported from package
- **THEN** SHALL export Keys, HotkeyCallback, Options, HotkeysEvent types
- **AND** types SHALL be re-exported from react-hotkeys-hook
- **AND** SHALL provide full type support to consumers

### Requirement: Integration with react-hotkeys-hook
The hook SHALL be direct re-export from react-hotkeys-hook library.

#### Scenario: Re-export implementation
- **WHEN** useHotkeys implementation is examined
- **THEN** SHALL be exported directly from react-hotkeys-hook package
- **AND** SHALL NOT add custom wrapper logic
- **AND** implementation SHALL be `export { useHotkeys } from "react-hotkeys-hook"`

#### Scenario: Version dependency
- **WHEN** package.json dependencies are examined
- **THEN** SHALL depend on react-hotkeys-hook version 5.2.1 or compatible
- **AND** SHALL declare as direct dependency not peer dependency
- **AND** version SHALL be pinned to ensure API stability

#### Scenario: Library capability passthrough
- **WHEN** react-hotkeys-hook capabilities are used
- **THEN** Nimbus useHotkeys SHALL support all library features
- **AND** SHALL NOT limit or filter functionality
- **AND** consumers SHALL access full react-hotkeys-hook API

### Requirement: SSR Compatibility
The hook SHALL work correctly in server-side rendering environments.

#### Scenario: Server-side rendering
- **WHEN** hook is called during SSR
- **THEN** SHALL NOT throw errors
- **AND** SHALL NOT access browser APIs (window, document) on server
- **AND** react-hotkeys-hook SHALL handle SSR internally

#### Scenario: Client-side hydration
- **WHEN** component hydrates on client after SSR
- **THEN** SHALL register event listeners after hydration
- **AND** SHALL function normally after client initialization
- **AND** SHALL match server-rendered HTML

### Requirement: Performance Characteristics
The hook SHALL provide efficient hotkey listening with minimal overhead.

#### Scenario: Single event listener per document
- **WHEN** multiple components use useHotkeys
- **THEN** react-hotkeys-hook SHALL optimize by using single document listener
- **AND** SHALL route events to appropriate callbacks internally
- **AND** SHALL NOT add N event listeners for N hook calls

#### Scenario: Callback stability
- **WHEN** component re-renders
- **THEN** SHALL use latest callback via closure
- **AND** dependencies array SHALL control callback updates
- **AND** SHALL not re-register listeners unnecessarily

#### Scenario: Memory management
- **WHEN** component with useHotkeys unmounts
- **THEN** SHALL clean up all associated resources
- **AND** SHALL remove callback from internal registry
- **AND** SHALL not leak memory with mount/unmount cycles

### Requirement: Error Handling
The hook SHALL handle edge cases and errors gracefully.

#### Scenario: Invalid keys format
- **WHEN** keys parameter has invalid format
- **THEN** react-hotkeys-hook SHALL handle gracefully
- **AND** SHALL not throw error that crashes application
- **AND** MAY log warning to console for debugging

#### Scenario: Callback throws error
- **WHEN** callback function throws error during execution
- **THEN** error SHALL propagate to React error boundary
- **AND** SHALL not prevent cleanup or affect other hotkeys
- **AND** SHALL follow standard React error handling

#### Scenario: Options with invalid types
- **WHEN** options contain invalid type values
- **THEN** react-hotkeys-hook SHALL handle gracefully
- **AND** SHALL use default values for invalid options
- **AND** SHALL not crash application

### Requirement: Documentation Requirements
The hook SHALL be documented per nimbus-core standards.

#### Scenario: JSDoc comments
- **WHEN** hook source file is viewed
- **THEN** SHALL have comprehensive JSDoc block (even if re-export)
- **AND** SHALL document keys, callback, options, and dependencies parameters
- **AND** SHALL include usage @example
- **AND** SHALL document return value RefObject

#### Scenario: MDX documentation file
- **WHEN** hook documentation is accessed
- **THEN** SHALL have use-hotkeys.mdx file
- **AND** SHALL include basic usage examples
- **AND** SHALL document key naming conventions
- **AND** SHALL link to react-hotkeys-hook documentation for advanced usage

#### Scenario: Storybook stories
- **WHEN** hook is demonstrated
- **THEN** SHALL have use-hotkeys.stories.tsx file
- **AND** stories SHALL demonstrate single key, key combinations, and lowercase keys
- **AND** stories SHALL include play functions testing hotkey behavior
- **AND** SHALL serve as executable documentation

### Requirement: Storybook Testing
The hook SHALL have comprehensive Storybook stories with play functions per nimbus-core standards.

#### Scenario: Story file structure
- **WHEN** use-hotkeys.stories.tsx is viewed
- **THEN** SHALL define meta with title "Hooks/UseHotkeys"
- **AND** SHALL create demo component using useHotkeys
- **AND** SHALL export multiple story variations

#### Scenario: Single key story with test
- **WHEN** SingleKey story executes
- **THEN** SHALL use simple key like "Escape"
- **AND** play function SHALL simulate key press with userEvent.keyboard
- **AND** SHALL verify callback was called with expect assertions

#### Scenario: Key combination story with test
- **WHEN** KeyCombo story executes
- **THEN** SHALL use modifier combination like "Ctrl+l"
- **AND** play function SHALL simulate modifier and key with userEvent.keyboard("{Control>}l{/Control}")
- **AND** SHALL verify callback was called exactly once

#### Scenario: Case-insensitive key story
- **WHEN** LowercaseEscapeKey story executes
- **THEN** SHALL use lowercase key like "escape"
- **AND** play function SHALL simulate Escape key press
- **AND** SHALL verify callback triggers for lowercase key definition

### Requirement: Related Hook Consistency
The hook SHALL be consistent with other Nimbus hooks.

#### Scenario: Export pattern consistency
- **WHEN** useHotkeys is compared to other Nimbus hooks
- **THEN** SHALL follow same export pattern as useColorMode, useColorModeValue
- **AND** SHALL be exported from package index
- **AND** SHALL be available as named export from @commercetools/nimbus

#### Scenario: File structure consistency
- **WHEN** use-hotkeys directory is compared to other hook directories
- **THEN** SHALL follow same structure: index.ts, use-hotkeys.ts, use-hotkeys.mdx, use-hotkeys.stories.tsx
- **AND** SHALL maintain consistent naming conventions
- **AND** SHALL include same file types as other documented hooks

### Requirement: Keyboard Event Sequence Support
The hook SHALL support keyboard event sequences (key combinations pressed in order).

#### Scenario: Sequence key combinations
- **WHEN** keys parameter includes sequence like "g i" or "Ctrl+k Ctrl+k"
- **THEN** SHALL register sequence listener
- **AND** SHALL trigger callback only when keys are pressed in specified order
- **AND** SHALL use configurable timeout between sequence keys

#### Scenario: Sequence timeout
- **WHEN** sequenceTimeoutMs option is set
- **THEN** SHALL wait specified milliseconds for next key in sequence
- **AND** SHALL reset sequence if timeout expires
- **AND** SHALL default to reasonable timeout if not specified

#### Scenario: Sequence split character
- **WHEN** sequenceSplitKey option is set
- **THEN** SHALL use specified character to split sequence steps
- **AND** SHALL parse key sequence according to custom delimiter
- **AND** SHALL default to space character for sequences
