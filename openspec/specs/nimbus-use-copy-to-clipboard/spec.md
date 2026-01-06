# Specification: useCopyToClipboard Hook

## Overview

The useCopyToClipboard hook provides clipboard copy functionality with state tracking for React components. It wraps the react-use library's useCopyToClipboard hook to enable copying text to the user's clipboard with built-in error handling, success state management, and cross-browser compatibility.

**Hook:** `useCopyToClipboard`
**Package:** `@commercetools/nimbus`
**Type:** React hook (re-export)
**Library Integration:** react-use v17.5.1

## Purpose

The useCopyToClipboard hook enables components to copy text to the clipboard with built-in state management for tracking copied values, handling errors, and detecting user interaction requirements. It provides cross-browser clipboard functionality through progressive enhancement with fallback mechanisms while following React hook rules and nimbus-core standards.

## Requirements

### Requirement: Hook Signature and Return Value
The hook SHALL return a tuple with state object and copy function.

#### Scenario: Return value structure
- **WHEN** useCopyToClipboard is called
- **THEN** SHALL return array tuple with two elements
- **AND** first element SHALL be state object with value, error, and noUserInteraction properties
- **AND** second element SHALL be copyToClipboard function

#### Scenario: TypeScript return type
- **WHEN** hook is used in TypeScript
- **THEN** SHALL return type [CopyToClipboardState, (value: string) => void]
- **AND** CopyToClipboardState SHALL include value, error, and noUserInteraction properties
- **AND** SHALL provide full type safety for consumers

#### Scenario: Array destructuring pattern
- **WHEN** hook result is destructured
- **THEN** SHALL support array destructuring syntax
- **AND** SHALL follow [state, action] tuple pattern
- **AND** SHALL enable naming flexibility for consumers

### Requirement: State Object - Value Property
The hook SHALL track the most recently copied value in state.

#### Scenario: Initial value state
- **WHEN** hook is first called before any copy operation
- **THEN** value property SHALL be undefined
- **AND** SHALL indicate no text has been copied yet
- **AND** SHALL not have stale value from previous operations

#### Scenario: Successful copy updates value
- **WHEN** copyToClipboard function succeeds
- **THEN** value property SHALL be updated to copied text
- **AND** SHALL store exact string that was copied to clipboard
- **AND** SHALL persist until next copy operation

#### Scenario: Failed copy does not update value
- **WHEN** copyToClipboard function fails with error
- **THEN** value property SHALL remain at previous value or undefined
- **AND** SHALL NOT update to attempted text that failed to copy
- **AND** SHALL only reflect successfully copied values

#### Scenario: Value persistence across re-renders
- **WHEN** component re-renders after successful copy
- **THEN** value property SHALL persist
- **AND** SHALL remain available until next copy operation or unmount
- **AND** SHALL maintain reference to copied text

### Requirement: State Object - Error Property
The hook SHALL track errors that occur during copy operations.

#### Scenario: Initial error state
- **WHEN** hook is first called before any copy operation
- **THEN** error property SHALL be undefined
- **AND** SHALL indicate no errors have occurred
- **AND** SHALL not have stale errors from previous operations

#### Scenario: Copy operation fails with error
- **WHEN** copyToClipboard function encounters error
- **THEN** error property SHALL be populated with Error object
- **AND** error SHALL contain message property describing failure
- **AND** SHALL provide debugging information

#### Scenario: Successful copy clears error
- **WHEN** copyToClipboard succeeds after previous error
- **THEN** error property SHALL be cleared to undefined
- **AND** SHALL not retain previous error state
- **AND** SHALL indicate current operation succeeded

#### Scenario: Error types and causes
- **WHEN** copy operation fails
- **THEN** error MAY be due to lack of user interaction context
- **AND** error MAY be due to browser security restrictions
- **AND** error MAY be due to unsupported browser environment
- **AND** error message SHALL describe specific failure reason

### Requirement: State Object - NoUserInteraction Property
The hook SHALL indicate whether clipboard access required user interaction.

#### Scenario: Copy without user interaction
- **WHEN** copyToClipboard uses execCommand or clipboardData successfully
- **THEN** noUserInteraction property SHALL be true
- **AND** SHALL indicate copy succeeded without requiring user action
- **AND** SHALL reflect seamless clipboard operation

#### Scenario: Copy requires user interaction
- **WHEN** copyToClipboard falls back to prompt dialog
- **THEN** noUserInteraction property SHALL be false
- **AND** SHALL indicate user had to manually copy text
- **AND** SHALL reflect fallback mechanism was used

#### Scenario: Initial noUserInteraction state
- **WHEN** hook is first called before any copy operation
- **THEN** noUserInteraction property SHALL be false or undefined
- **AND** SHALL update after first copy operation
- **AND** SHALL reflect actual interaction requirement

### Requirement: Copy Function Parameter
The copyToClipboard function SHALL accept a string parameter to copy.

#### Scenario: Copy string to clipboard
- **WHEN** copyToClipboard is called with string argument
- **THEN** SHALL attempt to copy text to clipboard
- **AND** SHALL use underlying copy-to-clipboard library
- **AND** SHALL update state based on operation result

#### Scenario: String parameter required
- **WHEN** copyToClipboard is called
- **THEN** SHALL require string parameter
- **AND** SHALL not accept undefined or null
- **AND** parameter SHALL be the text to copy

#### Scenario: Empty string handling
- **WHEN** copyToClipboard is called with empty string ""
- **THEN** SHALL attempt to copy empty string to clipboard
- **AND** SHALL update value to empty string on success
- **AND** SHALL treat as valid copy operation

#### Scenario: Multi-line string support
- **WHEN** copyToClipboard is called with string containing newlines
- **THEN** SHALL preserve line breaks in copied text
- **AND** SHALL copy complete multi-line string to clipboard
- **AND** SHALL maintain text formatting

#### Scenario: Special character handling
- **WHEN** copyToClipboard is called with special characters
- **THEN** SHALL copy Unicode characters correctly
- **AND** SHALL preserve emoji, symbols, and non-ASCII characters
- **AND** SHALL maintain character encoding

### Requirement: Copy Function Return Value
The copyToClipboard function SHALL not return a value.

#### Scenario: Void return type
- **WHEN** copyToClipboard is called
- **THEN** SHALL have void return type
- **AND** SHALL not return boolean or promise
- **AND** operation result SHALL be tracked via state object

#### Scenario: Async nature not exposed
- **WHEN** copyToClipboard executes
- **THEN** SHALL not expose promise or async behavior to caller
- **AND** state updates SHALL occur through React state mechanism
- **AND** SHALL follow fire-and-forget pattern

### Requirement: Browser API - ExecCommand Method
The hook SHALL attempt clipboard copy using document.execCommand as primary method.

#### Scenario: ExecCommand copy success
- **WHEN** browser supports document.execCommand('copy')
- **THEN** SHALL create temporary textarea element
- **AND** SHALL select text in textarea
- **AND** SHALL execute document.execCommand('copy') command
- **AND** SHALL remove temporary element after copy

#### Scenario: ExecCommand available
- **WHEN** copyToClipboard is called in modern browser
- **THEN** SHALL prefer execCommand method over fallbacks
- **AND** SHALL complete without user interaction
- **AND** noUserInteraction SHALL be true on success

#### Scenario: ExecCommand unavailable
- **WHEN** browser does not support execCommand
- **THEN** SHALL fall back to alternative methods
- **AND** SHALL not throw error from execCommand attempt
- **AND** SHALL try next fallback method

### Requirement: Browser API - ClipboardData Fallback
The hook SHALL support IE-specific clipboardData interface as fallback.

#### Scenario: ClipboardData available
- **WHEN** copyToClipboard is called in Internet Explorer
- **THEN** SHALL detect window.clipboardData existence
- **AND** SHALL use clipboardData.setData method
- **AND** SHALL complete copy without user interaction

#### Scenario: ClipboardData success
- **WHEN** clipboardData.setData succeeds
- **THEN** SHALL update value to copied text
- **AND** SHALL clear any previous errors
- **AND** noUserInteraction SHALL be true

#### Scenario: ClipboardData unavailable
- **WHEN** browser does not support clipboardData
- **THEN** SHALL fall back to prompt method
- **AND** SHALL not throw error from clipboardData attempt
- **AND** SHALL try final fallback

### Requirement: Browser API - Prompt Fallback
The hook SHALL use JavaScript prompt as final fallback mechanism.

#### Scenario: Prompt fallback activation
- **WHEN** execCommand and clipboardData both unavailable or fail
- **THEN** SHALL display JavaScript prompt with text to copy
- **AND** SHALL show message instructing user to copy manually
- **AND** SHALL use window.prompt function

#### Scenario: Prompt requires user interaction
- **WHEN** prompt fallback is used
- **THEN** noUserInteraction property SHALL be false
- **AND** SHALL indicate user had to manually copy
- **AND** SHALL still update value to copied text

#### Scenario: Prompt cancelled
- **WHEN** user cancels prompt dialog
- **THEN** SHALL treat as copy failure
- **AND** MAY set error state
- **AND** SHALL not update value property

### Requirement: Cross-Browser Compatibility
The hook SHALL work across all modern browsers with progressive enhancement.

#### Scenario: Chrome and Firefox support
- **WHEN** copyToClipboard is used in Chrome or Firefox
- **THEN** SHALL use execCommand method successfully
- **AND** SHALL copy without user interaction
- **AND** SHALL not require fallbacks

#### Scenario: Safari support
- **WHEN** copyToClipboard is used in Safari 10+
- **THEN** SHALL use execCommand method successfully
- **AND** SHALL handle Safari-specific security restrictions
- **AND** SHALL complete copy operation

#### Scenario: Internet Explorer support
- **WHEN** copyToClipboard is used in IE or Edge Legacy
- **THEN** SHALL use clipboardData interface
- **AND** SHALL complete copy without user interaction
- **AND** SHALL provide full functionality

#### Scenario: Unsupported browser fallback
- **WHEN** copyToClipboard is used in browser without any copy support
- **THEN** SHALL fall back to prompt method
- **AND** SHALL provide degraded but functional experience
- **AND** SHALL enable manual copy by user

### Requirement: Security Context Restrictions
The hook SHALL respect browser security restrictions for clipboard access.

#### Scenario: Secure context requirement
- **WHEN** copyToClipboard is used on HTTPS site
- **THEN** SHALL have full clipboard API access
- **AND** SHALL use optimal copy method
- **AND** SHALL complete without security errors

#### Scenario: Insecure context limitations
- **WHEN** copyToClipboard is used on HTTP site
- **THEN** MAY have limited clipboard access
- **AND** MAY require fallback methods
- **AND** SHALL handle restrictions gracefully

#### Scenario: User gesture requirement
- **WHEN** copyToClipboard is called outside user gesture context
- **THEN** MAY fail with security error in some browsers
- **AND** error property SHALL indicate security restriction
- **AND** SHALL recommend calling within user interaction

### Requirement: Error Handling and Recovery
The hook SHALL handle errors gracefully and provide error information.

#### Scenario: Copy operation error
- **WHEN** copy attempt fails
- **THEN** SHALL catch error and populate error property
- **AND** SHALL not crash or throw uncaught exception
- **AND** SHALL allow retry on next copyToClipboard call

#### Scenario: Error message information
- **WHEN** error occurs during copy
- **THEN** error.message SHALL describe failure reason
- **AND** SHALL help developers debug issue
- **AND** MAY include details like "document.execCommand failed"

#### Scenario: Error recovery
- **WHEN** error occurs followed by successful copy
- **THEN** SHALL clear error property
- **AND** SHALL update value to new copied text
- **AND** SHALL not retain previous error state

### Requirement: React Hook Rules Compliance
The hook SHALL follow React hook rules per nimbus-core standards.

#### Scenario: Hook naming convention
- **WHEN** hook is defined
- **THEN** SHALL be named with 'use' prefix
- **AND** SHALL follow camelCase naming (useCopyToClipboard)
- **AND** name SHALL clearly indicate clipboard copy functionality

#### Scenario: Top-level only usage
- **WHEN** useCopyToClipboard is called
- **THEN** SHALL only be called at top level of component or custom hook
- **AND** SHALL NOT be called conditionally
- **AND** SHALL NOT be called in loops or nested functions

#### Scenario: React component or hook context
- **WHEN** useCopyToClipboard is used
- **THEN** SHALL only be called from React function components or custom hooks
- **AND** SHALL NOT be called from regular JavaScript functions
- **AND** SHALL follow all Rules of Hooks

### Requirement: State Management and Re-renders
The hook SHALL manage state updates and trigger re-renders appropriately.

#### Scenario: State update triggers re-render
- **WHEN** copyToClipboard succeeds and updates value
- **THEN** SHALL trigger component re-render
- **AND** SHALL provide updated state object with new value
- **AND** component SHALL receive latest state

#### Scenario: Error state triggers re-render
- **WHEN** copyToClipboard fails and sets error
- **THEN** SHALL trigger component re-render
- **AND** component SHALL receive updated error state
- **AND** SHALL enable error display in UI

#### Scenario: Multiple rapid copies
- **WHEN** copyToClipboard is called multiple times quickly
- **THEN** SHALL update state for each operation
- **AND** most recent copy SHALL be reflected in state
- **AND** SHALL handle concurrent copies appropriately

### Requirement: Memory Management and Cleanup
The hook SHALL properly clean up resources and prevent memory leaks.

#### Scenario: Component unmount cleanup
- **WHEN** component using hook unmounts
- **THEN** SHALL clean up internal state
- **AND** SHALL not attempt to update state after unmount
- **AND** SHALL prevent memory leaks

#### Scenario: No persistent clipboard listeners
- **WHEN** hook is active
- **THEN** SHALL NOT add persistent event listeners
- **AND** SHALL NOT monitor clipboard changes
- **AND** SHALL only interact with clipboard during copyToClipboard calls

### Requirement: TypeScript Type Safety
The hook SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: CopyToClipboardState type
- **WHEN** state object type is examined
- **THEN** SHALL define interface with value, error, noUserInteraction
- **AND** value SHALL be typed as string | undefined
- **AND** error SHALL be typed as Error | undefined
- **AND** noUserInteraction SHALL be typed as boolean

#### Scenario: Copy function type
- **WHEN** copyToClipboard function type is examined
- **THEN** SHALL be typed as (text: string) => void
- **AND** SHALL require string parameter
- **AND** SHALL indicate void return

#### Scenario: Hook return type
- **WHEN** hook return type is examined
- **THEN** SHALL be tuple type [CopyToClipboardState, CopyToClipboardFn]
- **AND** SHALL provide full type inference
- **AND** SHALL enable autocomplete for state properties

#### Scenario: Type exports
- **WHEN** types are imported from package
- **THEN** SHALL export CopyToClipboardState type
- **AND** types SHALL be re-exported from react-use
- **AND** SHALL provide full type support to consumers

### Requirement: Integration with react-use Library
The hook SHALL be direct re-export from react-use library.

#### Scenario: Re-export implementation
- **WHEN** useCopyToClipboard implementation is examined
- **THEN** SHALL be exported directly from react-use package
- **AND** SHALL NOT add custom wrapper logic
- **AND** implementation SHALL be `export { useCopyToClipboard } from "react-use"`

#### Scenario: Version dependency
- **WHEN** package.json dependencies are examined
- **THEN** SHALL depend on react-use version 17.5.1 or compatible
- **AND** SHALL declare as direct dependency not peer dependency
- **AND** version SHALL be pinned to ensure API stability

#### Scenario: Library capability passthrough
- **WHEN** react-use capabilities are used
- **THEN** Nimbus useCopyToClipboard SHALL support all library features
- **AND** SHALL NOT limit or filter functionality
- **AND** consumers SHALL access full react-use API

### Requirement: Integration with copy-to-clipboard Library
The hook SHALL leverage copy-to-clipboard library for clipboard operations.

#### Scenario: Underlying library dependency
- **WHEN** copyToClipboard function executes
- **THEN** SHALL use copy-to-clipboard library internally via react-use
- **AND** SHALL benefit from library's progressive enhancement
- **AND** SHALL inherit fallback mechanisms

#### Scenario: Copy-to-clipboard options
- **WHEN** copy operation executes
- **THEN** copy-to-clipboard SHALL use default text/plain format
- **AND** SHALL not expose format configuration to consumers
- **AND** SHALL use standard copy behavior

#### Scenario: Library browser support
- **WHEN** copyToClipboard runs in any browser
- **THEN** SHALL leverage copy-to-clipboard's wide compatibility
- **AND** SHALL work where prompt is available
- **AND** SHALL provide consistent experience across platforms

### Requirement: SSR Compatibility
The hook SHALL work correctly in server-side rendering environments.

#### Scenario: Server-side rendering
- **WHEN** hook is called during SSR
- **THEN** SHALL NOT throw errors on server
- **AND** SHALL NOT access browser APIs (window, document) on server
- **AND** react-use SHALL handle SSR internally

#### Scenario: Client-side hydration
- **WHEN** component hydrates on client after SSR
- **THEN** SHALL initialize state after hydration
- **AND** copyToClipboard SHALL function normally after client initialization
- **AND** SHALL match server-rendered HTML

#### Scenario: Server-side initial state
- **WHEN** hook is called on server
- **THEN** state object SHALL have undefined value
- **AND** SHALL have undefined error
- **AND** SHALL not attempt clipboard operations on server

### Requirement: Common Use Cases Support
The hook SHALL support common clipboard copy scenarios.

#### Scenario: Copy code snippet
- **WHEN** copyToClipboard is used with code block text
- **THEN** SHALL preserve indentation and formatting
- **AND** SHALL copy complete code including newlines
- **AND** SHALL enable "Copy Code" button functionality

#### Scenario: Copy share link
- **WHEN** copyToClipboard is used with URL
- **THEN** SHALL copy complete URL string
- **AND** SHALL enable "Copy Link" functionality
- **AND** SHALL provide user feedback via value state

#### Scenario: Copy API key or token
- **WHEN** copyToClipboard is used with sensitive string
- **THEN** SHALL copy exact string without modification
- **AND** SHALL enable "Copy API Key" functionality
- **AND** SHALL not persist copied value longer than necessary

#### Scenario: Copy form field value
- **WHEN** copyToClipboard is used with input value
- **THEN** SHALL copy current field value
- **AND** SHALL enable "Copy to Clipboard" button near input
- **AND** value state SHALL confirm what was copied

### Requirement: UI Feedback Integration
The hook SHALL provide state for building user feedback UI.

#### Scenario: Success feedback display
- **WHEN** copy succeeds and value is updated
- **THEN** component SHALL display success message like "Copied!"
- **AND** SHALL access copied text from value property
- **AND** SHALL show confirmation to user

#### Scenario: Error feedback display
- **WHEN** copy fails and error is set
- **THEN** component SHALL display error message
- **AND** SHALL access error.message for details
- **AND** SHALL inform user of failure reason

#### Scenario: Temporary feedback pattern
- **WHEN** success feedback is shown after copy
- **THEN** component MAY use timer to hide message
- **AND** value property SHALL remain available
- **AND** SHALL enable "Copied!" → "Copy" button text toggle

### Requirement: Documentation Requirements
The hook SHALL be documented per nimbus-core standards.

#### Scenario: JSDoc comments
- **WHEN** hook source file is viewed
- **THEN** SHALL have comprehensive JSDoc block (even if re-export)
- **AND** SHALL document return value structure
- **AND** SHALL include usage @example
- **AND** SHALL document state properties and copy function

#### Scenario: MDX documentation file
- **WHEN** hook documentation is accessed
- **THEN** SHALL have use-copy-to-clipboard.mdx file
- **AND** SHALL include basic usage examples
- **AND** SHALL document state properties (value, error, noUserInteraction)
- **AND** SHALL link to react-use documentation for details

#### Scenario: Example code in documentation
- **WHEN** documentation examples are viewed
- **THEN** SHALL show state destructuring pattern
- **AND** SHALL demonstrate error handling
- **AND** SHALL show UI feedback integration
- **AND** SHALL serve as copy-paste ready code

### Requirement: Storybook Demonstration
The hook SHALL have Storybook stories demonstrating usage patterns.

#### Scenario: Story file existence
- **WHEN** hook is demonstrated in Storybook
- **THEN** MAY have use-copy-to-clipboard.stories.tsx file
- **AND** stories SHALL demonstrate copy functionality
- **AND** SHALL show success and error states

#### Scenario: Interactive demo story
- **WHEN** Storybook story renders
- **THEN** SHALL provide text input and copy button
- **AND** SHALL display current state (value, error)
- **AND** SHALL enable manual testing of copy functionality

#### Scenario: Play function testing
- **WHEN** story includes play function
- **THEN** SHALL simulate user clicking copy button
- **AND** SHALL verify value state updates
- **AND** SHALL verify copied text matches input

### Requirement: Related Hook Consistency
The hook SHALL be consistent with other Nimbus hooks.

#### Scenario: Export pattern consistency
- **WHEN** useCopyToClipboard is compared to other Nimbus hooks
- **THEN** SHALL follow same export pattern as useColorMode, useHotkeys
- **AND** SHALL be exported from package index
- **AND** SHALL be available as named export from @commercetools/nimbus

#### Scenario: File structure consistency
- **WHEN** use-copy-to-clipboard directory is compared to other hooks
- **THEN** SHALL follow structure: index.ts, use-copy-to-clipboard.ts, use-copy-to-clipboard.mdx
- **AND** SHALL maintain consistent naming conventions
- **AND** SHALL include same file types as other documented hooks

#### Scenario: Re-export pattern consistency
- **WHEN** implementation approach is compared to useHotkeys
- **THEN** SHALL follow same re-export pattern from external library
- **AND** SHALL NOT add unnecessary abstraction
- **AND** SHALL expose library API directly to consumers
