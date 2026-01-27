# Specification: Pagination Component

## Overview

The Pagination component provides accessible navigation controls for paginated data. It displays page information, navigation buttons (previous/next), and optional page size selection. The component uses controlled state management and integrates with the nimbus-core standards for accessibility and internationalization.

**Component:** `Pagination`
**Package:** `@commercetools/nimbus`
**Type:** Composite component (uses Button, IconButton, Select, NumberInput)
**React Aria:** Uses Button and NumberInput from react-aria-components

## Purpose

The Pagination capability provides navigation controls for browsing paginated data sets. It offers page number display, previous/next navigation, optional page size selection, and optional direct page input for efficient data exploration. The component supports both controlled and uncontrolled modes and implements ARIA navigation patterns for keyboard accessibility.

## Requirements

### Requirement: Page Navigation Controls
Pagination SHALL provide previous and next page navigation buttons.

#### Scenario: Previous page button
- **WHEN** currentPage is greater than 1
- **THEN** SHALL render enabled previous page IconButton with ChevronLeft icon
- **AND** SHALL call onPageChange with currentPage - 1 when clicked
- **AND** SHALL have aria-label from i18n message "goToPreviousPage"

#### Scenario: Previous page button disabled
- **WHEN** currentPage equals 1
- **THEN** SHALL render disabled previous page IconButton
- **AND** SHALL set isDisabled={true} on IconButton
- **AND** SHALL prevent click interaction

#### Scenario: Next page button
- **WHEN** currentPage is less than totalPages
- **THEN** SHALL render enabled next page IconButton with ChevronRight icon
- **AND** SHALL call onPageChange with currentPage + 1 when clicked
- **AND** SHALL have aria-label from i18n message "goToNextPage"

#### Scenario: Next page button disabled
- **WHEN** currentPage equals totalPages
- **THEN** SHALL render disabled next page IconButton
- **AND** SHALL set isDisabled={true} on IconButton
- **AND** SHALL prevent click interaction

### Requirement: Page Number Display
Pagination SHALL display current page and total pages information.

#### Scenario: Page information text
- **WHEN** component renders
- **THEN** SHALL display "Page" label from i18n message
- **AND** SHALL display current page number
- **AND** SHALL display "of {totalPages}" text from i18n message with formatted total
- **AND** SHALL use neutral.12 color for text

#### Scenario: Current page indication
- **WHEN** enablePageInput is false
- **THEN** SHALL display current page as bold Text with fontWeight="semibold"
- **AND** SHALL set aria-current="page" on current page text
- **AND** SHALL use neutral.12 color for visibility

### Requirement: Controlled Page State
Pagination SHALL support controlled page state management.

#### Scenario: Controlled mode
- **WHEN** currentPage prop is provided
- **THEN** usePagination hook SHALL use controlled currentPage value
- **AND** SHALL call onPageChange callback when page changes
- **AND** SHALL NOT manage internal page state
- **AND** parent component SHALL control page value

#### Scenario: Uncontrolled mode with default
- **WHEN** currentPage prop is undefined
- **THEN** usePagination hook SHALL manage internal page state
- **AND** SHALL initialize to page 1
- **AND** SHALL call onPageChange callback when page changes
- **AND** SHALL update internal state on navigation

### Requirement: Page Size Selection
Pagination SHALL support optional page size selection dropdown.

#### Scenario: Page size selector enabled
- **WHEN** enablePageSizeSelector is true
- **THEN** SHALL render Select component with page size options
- **AND** SHALL display pageSizeOptions as selectable values
- **AND** SHALL set aria-label from i18n message "itemsPerPage"
- **AND** SHALL render "items per page" text label from i18n message

#### Scenario: Page size selector disabled
- **WHEN** enablePageSizeSelector is false (default)
- **THEN** SHALL NOT render Select component
- **AND** SHALL NOT display page size options
- **AND** SHALL use default pageSize value

#### Scenario: Page size change
- **WHEN** user selects new page size from Select
- **THEN** SHALL call usePagination setPageSize function
- **AND** SHALL call onPageSizeChange callback with new size
- **AND** SHALL adjust currentPage if needed to stay within new totalPages
- **AND** SHALL call onPageChange if page adjustment occurs

### Requirement: Page Size Options
Pagination SHALL accept configurable page size options.

#### Scenario: Default page size options
- **WHEN** pageSizeOptions prop is not provided
- **THEN** SHALL use default options: [10, 20, 50, 100]
- **AND** SHALL display these values in Select dropdown

#### Scenario: Custom page size options
- **WHEN** pageSizeOptions prop is provided
- **THEN** SHALL use provided array values
- **AND** SHALL display custom options in Select dropdown
- **AND** SHALL format each option as "{size}" string

### Requirement: Direct Page Input
Pagination SHALL support optional direct page number input.

#### Scenario: Page input enabled
- **WHEN** enablePageInput is true
- **THEN** SHALL render NumberInput component for current page
- **AND** SHALL set value to currentPage
- **AND** SHALL set minValue to 1
- **AND** SHALL set maxValue to totalPages
- **AND** SHALL have aria-label from i18n message "currentPage"
- **AND** SHALL set aria-current="page" for screen readers

#### Scenario: Page input disabled
- **WHEN** enablePageInput is false (default)
- **THEN** SHALL render current page as Text component
- **AND** SHALL NOT allow direct page input
- **AND** SHALL display page number with aria-current="page"

#### Scenario: Page input change
- **WHEN** user enters new page number in NumberInput
- **THEN** SHALL call usePagination goToPage function
- **AND** SHALL clamp value between 1 and totalPages
- **AND** SHALL call onPageChange callback with clamped page
- **AND** SHALL handle undefined value by defaulting to 1

### Requirement: Total Items Calculation
Pagination SHALL calculate total pages from total items and page size.

#### Scenario: Total pages calculation
- **WHEN** totalItems and pageSize are provided
- **THEN** usePagination SHALL calculate totalPages as Math.ceil(totalItems / pageSize)
- **AND** SHALL ensure minimum totalPages of 1
- **AND** SHALL update totalPages when pageSize changes

#### Scenario: Item range calculation
- **WHEN** pagination state updates
- **THEN** usePagination SHALL calculate startItem as (currentPage - 1) * pageSize + 1
- **AND** SHALL calculate endItem as Math.min(currentPage * pageSize, totalItems)
- **AND** SHALL ensure startItem does not exceed totalItems
- **AND** SHALL provide hasPreviousPage as currentPage > 1
- **AND** SHALL provide hasNextPage as currentPage < totalPages

### Requirement: Keyboard Navigation
Pagination SHALL support keyboard navigation per nimbus-core standards.

#### Scenario: Tab navigation
- **WHEN** user presses Tab key
- **THEN** SHALL move focus through: page size selector (if enabled), previous button, page input (if enabled), next button
- **AND** SHALL follow logical left-to-right order
- **AND** SHALL skip disabled buttons in tab order

#### Scenario: Button activation
- **WHEN** navigation button is focused and user presses Enter or Space
- **THEN** SHALL trigger button onClick handler
- **AND** SHALL navigate to previous/next page
- **AND** SHALL follow Button component keyboard patterns

#### Scenario: Number input interaction
- **WHEN** page input is focused
- **THEN** SHALL allow arrow keys to increment/decrement page
- **AND** SHALL allow direct number entry
- **AND** SHALL allow Enter key to confirm input
- **AND** SHALL follow NumberInput component keyboard patterns

### Requirement: Responsive Layout
Pagination SHALL support responsive layout per nimbus-core standards.

#### Scenario: Mobile layout
- **WHEN** viewport is base or extra small (< sm breakpoint)
- **THEN** SHALL render as column Stack with direction="column"
- **AND** SHALL stack page size selector above page navigator
- **AND** SHALL center-align items with align="center"

#### Scenario: Desktop layout
- **WHEN** viewport is small or larger (>= sm breakpoint)
- **THEN** SHALL render as row Stack with direction="row"
- **AND** SHALL place page size selector on left
- **AND** SHALL place page navigator on right
- **AND** SHALL use Flex with flexGrow="1" for spacing between sections

### Requirement: Accessible Labeling
Pagination SHALL provide accessible labels per nimbus-core standards.

#### Scenario: Navigation region
- **WHEN** pagination renders
- **THEN** page navigator Flex SHALL have role="navigation"
- **AND** SHALL have aria-label from prop or i18n message "pagination"
- **AND** SHALL announce navigation region to screen readers

#### Scenario: Button labels
- **WHEN** navigation buttons render
- **THEN** previous button SHALL have aria-label "Go to previous page"
- **AND** next button SHALL have aria-label "Go to next page"
- **AND** labels SHALL be localized via i18n messages
- **AND** labels SHALL clearly describe button action

#### Scenario: Current page indication
- **WHEN** current page displays
- **THEN** page number SHALL have aria-current="page"
- **AND** page input SHALL have aria-label "Current page"
- **AND** screen readers SHALL announce current page status

### Requirement: Internationalization
Pagination SHALL support internationalization per nimbus-core standards.

#### Scenario: i18n messages
- **WHEN** component renders
- **THEN** SHALL use plain TypeScript objects useIntl hook
- **AND** SHALL format messages from pagination.i18n.ts
- **AND** SHALL support message keys: pagination, itemsPerPage, itemsPerPageText, goToPreviousPage, currentPage, page, ofTotalPages, goToNextPage
- **AND** SHALL format numbers with intl.formatNumber for totalPages

#### Scenario: Message formatting
- **WHEN** displaying "of {totalPages}" text
- **THEN** SHALL use intl.formatMessage with ofTotalPages message
- **AND** SHALL pass totalPages as formatted number using intl.formatNumber
- **AND** SHALL support locale-specific number formatting

### Requirement: Visual Styling
Pagination SHALL use nimbus-core design tokens for styling.

#### Scenario: Layout spacing
- **WHEN** component renders
- **THEN** SHALL use gap="400" (16px) for main Stack spacing
- **AND** SHALL use gap="200" (8px) for internal Flex spacing
- **AND** SHALL use design tokens for all spacing values

#### Scenario: Button variants
- **WHEN** navigation buttons render
- **THEN** SHALL use variant="ghost" for IconButton components
- **AND** SHALL use colorPalette="primary" for brand color
- **AND** SHALL apply disabled styles when isDisabled={true}

#### Scenario: Text colors
- **WHEN** text elements render
- **THEN** SHALL use color="neutral.12" for high contrast text
- **AND** SHALL use fontWeight="semibold" for current page number
- **AND** SHALL ensure WCAG AA contrast ratios

### Requirement: State Management Hook
Pagination SHALL use usePagination hook for state logic.

#### Scenario: Hook initialization
- **WHEN** Pagination component initializes
- **THEN** SHALL call usePagination with totalItems, currentPage, pageSize, callbacks
- **AND** usePagination SHALL return state object with: totalItems, currentPage, pageSize, totalPages, startItem, endItem, hasPreviousPage, hasNextPage
- **AND** usePagination SHALL return functions: goToPage, goToPreviousPage, goToNextPage, setPageSize

#### Scenario: Navigation functions
- **WHEN** usePagination navigation functions are called
- **THEN** goToPage SHALL clamp page to [1, totalPages] range
- **AND** goToPreviousPage SHALL check hasPreviousPage before calling goToPage
- **AND** goToNextPage SHALL check hasNextPage before calling goToPage
- **AND** setPageSize SHALL recalculate totalPages and adjust currentPage if needed

### Requirement: TypeScript Type Safety
Pagination SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: PaginationProps type
- **WHEN** PaginationProps is defined
- **THEN** SHALL include totalItems: number (required)
- **AND** SHALL include currentPage?: number (optional, 1-based indexing)
- **AND** SHALL include pageSize?: number (optional, default 10)
- **AND** SHALL include pageSizeOptions?: number[] (optional, default [10, 20, 50, 100])
- **AND** SHALL include onPageChange?: (page: number) => void (optional)
- **AND** SHALL include onPageSizeChange?: (pageSize: number) => void (optional)
- **AND** SHALL include "aria-label"?: string (optional)
- **AND** SHALL include enablePageInput?: boolean (optional, default true)
- **AND** SHALL include enablePageSizeSelector?: boolean (optional, default true)

#### Scenario: Hook types
- **WHEN** usePagination types are defined
- **THEN** SHALL export UsePaginationProps for hook parameters
- **AND** SHALL export PaginationState for state object
- **AND** SHALL export UsePaginationReturn combining state and functions
- **AND** SHALL provide comprehensive JSDoc for all types

### Requirement: Component Composition
Pagination SHALL compose nimbus components for consistent design.

#### Scenario: Component usage
- **WHEN** Pagination renders
- **THEN** SHALL use Stack for responsive layout container
- **AND** SHALL use Flex for section grouping
- **AND** SHALL use IconButton from nimbus for navigation buttons
- **AND** SHALL use Select.Root and Select.Options for page size selector
- **AND** SHALL use NumberInput for page input field
- **AND** SHALL use Text for static labels

#### Scenario: Icon usage
- **WHEN** navigation buttons render
- **THEN** SHALL use ChevronLeft icon from @commercetools/nimbus-icons for previous
- **AND** SHALL use ChevronRight icon from @commercetools/nimbus-icons for next
- **AND** icons SHALL be imported from nimbus-icons package

### Requirement: Disabled State Handling
Pagination SHALL properly handle disabled states per nimbus-core standards.

#### Scenario: Navigation button states
- **WHEN** hasPreviousPage is false
- **THEN** previous button SHALL have isDisabled={true}
- **AND** SHALL apply disabled styling
- **AND** SHALL prevent click interaction
- **WHEN** hasNextPage is false
- **THEN** next button SHALL have isDisabled={true}
- **AND** SHALL apply disabled styling
- **AND** SHALL prevent click interaction

#### Scenario: Page input constraints
- **WHEN** NumberInput renders
- **THEN** SHALL set minValue={1} to prevent values below 1
- **AND** SHALL set maxValue={totalPages} to prevent exceeding max
- **AND** SHALL clamp input values automatically
- **AND** isDisabled prop SHALL be explicitly set to false (always enabled when shown)

### Requirement: Default Values
Pagination SHALL provide sensible default values per nimbus-core standards.

#### Scenario: Prop defaults
- **WHEN** optional props are not provided
- **THEN** currentPage SHALL default to 1 (via usePagination)
- **AND** pageSize SHALL default to 10 (via usePagination)
- **AND** pageSizeOptions SHALL default to [10, 20, 50, 100]
- **AND** enablePageInput SHALL default to true
- **AND** enablePageSizeSelector SHALL default to true
- **AND** aria-label SHALL default to "Pagination" from i18n

### Requirement: Focus Management
Pagination SHALL manage focus appropriately per nimbus-core standards.

#### Scenario: Initial focus
- **WHEN** pagination renders
- **THEN** SHALL NOT auto-focus any element
- **AND** SHALL allow natural tab order entry
- **AND** first focusable element SHALL be page size selector (if enabled) or previous button

#### Scenario: Focus indicators
- **WHEN** elements receive keyboard focus
- **THEN** SHALL display visible focus indicators meeting 3:1 contrast ratio
- **AND** focus indicators SHALL be provided by composed components (Button, NumberInput, Select)
- **AND** SHALL follow nimbus-core focus indicator standards

### Requirement: Number Input Width
Pagination SHALL size page input appropriately for readability.

#### Scenario: Page input sizing
- **WHEN** enablePageInput is true and NumberInput renders
- **THEN** SHALL set width="9ch" to accommodate page numbers
- **AND** width SHALL fit typical 1-3 digit page numbers
- **AND** SHALL prevent unnecessary horizontal space

### Requirement: Select Configuration
Pagination SHALL configure Select component for page size selection.

#### Scenario: Select clearability
- **WHEN** Select.Root renders
- **THEN** SHALL set isClearable={false} to prevent clearing selection
- **AND** SHALL always maintain a selected page size
- **AND** SHALL set selectedKey to current pageSize as string

#### Scenario: Select options
- **WHEN** Select.Options renders
- **THEN** SHALL map pageSizeOptions to Select.Option components
- **AND** SHALL use size.toString() as both id and display name
- **AND** SHALL format each option with consistent naming

### Requirement: Display Name
Pagination SHALL set display name for debugging per nimbus-core standards.

#### Scenario: Component display name
- **WHEN** Pagination component is defined
- **THEN** SHALL manually assign displayName as "Pagination"
- **AND** displayName SHALL appear in React DevTools
- **AND** SHALL aid debugging and component identification

### Requirement: Memoization and Performance
UsePagination hook SHALL optimize performance with proper memoization.

#### Scenario: Callback memoization
- **WHEN** usePagination defines navigation functions
- **THEN** SHALL use useCallback for goToPage, goToPreviousPage, goToNextPage, setPageSize
- **AND** SHALL include proper dependency arrays
- **AND** SHALL prevent unnecessary re-renders of consuming components

#### Scenario: State memoization
- **WHEN** usePagination returns state object
- **THEN** SHALL use useMemo for return value
- **AND** SHALL include all state values and functions in dependencies
- **AND** SHALL return stable reference when dependencies unchanged

### Requirement: Boundary Validation
UsePagination hook SHALL validate and clamp values to safe boundaries.

#### Scenario: Page boundary clamping
- **WHEN** goToPage is called with any page value
- **THEN** SHALL clamp to Math.max(1, Math.min(page, totalPages))
- **AND** SHALL ensure validCurrentPage is always within [1, totalPages]
- **AND** SHALL never set page outside valid range

#### Scenario: Page size change boundary adjustment
- **WHEN** setPageSize is called with new page size
- **THEN** SHALL calculate newTotalPages = Math.ceil(totalItems / newPageSize)
- **AND** SHALL adjust currentPage to Math.min(validCurrentPage, newTotalPages)
- **AND** SHALL call onPageChange if page adjustment occurs
- **AND** SHALL ensure user stays on valid page after size change
