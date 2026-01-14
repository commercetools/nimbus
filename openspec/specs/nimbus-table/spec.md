# Specification: Table Component

## Overview

The Table component provides a semantic HTML table structure with accessible, consistent styling for displaying tabular data. It is a simpler alternative to DataTable focused on basic data presentation without advanced features like sorting, filtering, or virtualization.

**Component:** `Table` (Chakra UI Table re-export)
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Leverages Chakra UI's Table which provides basic ARIA table semantics
**i18n:** Not required (no built-in user-facing text)

## Purpose

The Table component enables developers to display structured tabular data with semantic HTML and consistent styling. Unlike DataTable, Table focuses on simple data presentation without built-in sorting, filtering, pagination, or virtualization. It provides a flexible foundation for basic tables where consumers implement any advanced features they need.

## Requirements

### Requirement: HTML Table Elements
The component SHALL provide semantic HTML table structure.

#### Scenario: Table element structure
- **WHEN** table renders
- **THEN** SHALL use semantic HTML `<table>` element
- **AND** SHALL support `<thead>` for header rows
- **AND** SHALL support `<tbody>` for data rows
- **AND** SHALL support `<tfoot>` for footer rows (optional)
- **AND** SHALL support `<tr>` for table rows
- **AND** SHALL support `<th>` for header cells
- **AND** SHALL support `<td>` for data cells

#### Scenario: Caption support
- **WHEN** caption is provided
- **THEN** SHALL render `<caption>` element
- **AND** caption SHALL be first child of table
- **AND** SHALL provide accessible table description

### Requirement: Column Headers
The component SHALL support column header definition.

#### Scenario: Header row
- **WHEN** thead contains header cells
- **THEN** SHALL render `<th>` elements with appropriate scope
- **AND** SHALL apply header styling from recipe
- **AND** SHALL use scope="col" for column headers
- **AND** SHALL support multi-line header text

#### Scenario: Header alignment
- **WHEN** header cells render
- **THEN** SHALL support text alignment: left (default), center, right
- **AND** SHALL apply textAlign style prop
- **AND** SHALL inherit alignment to body cells in same column

### Requirement: Data Rows
The component SHALL render data rows in table body.

#### Scenario: Body rows
- **WHEN** tbody contains data rows
- **THEN** SHALL render `<tr>` elements for each row
- **AND** SHALL render `<td>` elements for each cell
- **AND** SHALL apply body row styling from recipe
- **AND** SHALL support any number of rows

#### Scenario: Cell content
- **WHEN** cells render
- **THEN** SHALL support text content
- **AND** SHALL support React elements as children
- **AND** SHALL support numbers with proper alignment
- **AND** SHALL handle empty cells gracefully

### Requirement: Summary Footer
The component SHALL support optional footer for summaries.

#### Scenario: Footer rows
- **WHEN** tfoot is provided
- **THEN** SHALL render footer rows at table bottom
- **AND** SHALL apply footer styling from recipe
- **AND** SHALL support aggregated data (totals, averages)
- **AND** SHALL support multi-row footers

### Requirement: Text Alignment
The component SHALL support column text alignment.

#### Scenario: Left alignment
- **WHEN** textAlign="start" or textAlign="left" (default)
- **THEN** SHALL align cell content to the left
- **AND** SHALL be default for text columns

#### Scenario: Center alignment
- **WHEN** textAlign="center" is set
- **THEN** SHALL center cell content
- **AND** SHALL be appropriate for status indicators

#### Scenario: Right alignment
- **WHEN** textAlign="end" or textAlign="right" is set
- **THEN** SHALL align cell content to the right
- **AND** SHALL be appropriate for numeric columns

### Requirement: Zebra Pattern
The component SHALL support row striping for readability.

#### Scenario: Striped rows
- **WHEN** striped={true} is set
- **THEN** SHALL apply alternating row background colors
- **AND** SHALL use muted background from design tokens
- **AND** SHALL apply to odd or even rows consistently
- **AND** SHALL maintain readability in both light and dark modes

#### Scenario: Non-striped rows
- **WHEN** striped={false} or not provided (default)
- **THEN** SHALL render all rows with same background
- **AND** SHALL use standard background color

### Requirement: Interactive Feedback
The component SHALL support row hover states.

#### Scenario: Hoverable rows
- **WHEN** interactive={true} is set
- **THEN** SHALL apply hover background color on mouse over
- **AND** SHALL use subtle hover color from design tokens
- **AND** SHALL provide visual feedback for clickable rows
- **AND** SHALL not apply hover to header or footer rows

#### Scenario: Non-interactive rows
- **WHEN** interactive={false} or not provided (default)
- **THEN** SHALL not apply hover effects
- **AND** SHALL render as static table

### Requirement: Density Control
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Small size
- **WHEN** size="sm" is set
- **THEN** SHALL apply compact padding to cells
- **AND** SHALL use small text style from design tokens
- **AND** SHALL be suitable for dense data displays

#### Scenario: Medium size
- **WHEN** size="md" is set (default)
- **THEN** SHALL apply standard padding to cells
- **AND** SHALL use medium text style from design tokens
- **AND** SHALL provide comfortable reading experience

#### Scenario: Large size
- **WHEN** size="lg" is set
- **THEN** SHALL apply generous padding to cells
- **AND** SHALL use large text style from design tokens
- **AND** SHALL be suitable for emphasized tables

### Requirement: Styling Options
The component SHALL support multiple visual variants.

#### Scenario: Simple variant
- **WHEN** variant="simple" is set
- **THEN** SHALL render without borders
- **AND** SHALL use minimal styling
- **AND** SHALL rely on striping or spacing for row separation

#### Scenario: Line variant
- **WHEN** variant="line" is set (default)
- **THEN** SHALL render horizontal borders between rows
- **AND** SHALL apply border to header bottom
- **AND** SHALL apply border to cell bottoms
- **AND** SHALL use border color from design tokens

#### Scenario: Outline variant
- **WHEN** variant="outline" is set
- **THEN** SHALL render outer border around entire table
- **AND** SHALL apply horizontal borders between rows
- **AND** SHALL apply header background color
- **AND** SHALL create boxed appearance

### Requirement: Fixed Header During Scroll
The component SHALL support sticky header positioning.

#### Scenario: Sticky header enabled
- **WHEN** stickyHeader={true} is set
- **THEN** SHALL fix header row position during vertical scroll
- **AND** SHALL apply z-index to keep header above body rows
- **AND** SHALL maintain header visibility when body scrolls
- **AND** SHALL use --table-sticky-offset CSS variable for offset positioning

#### Scenario: Normal header
- **WHEN** stickyHeader={false} or not provided (default)
- **THEN** SHALL render header in normal flow
- **AND** header SHALL scroll with table content

### Requirement: Column Sizing
The component SHALL support column width configuration.

#### Scenario: Auto width
- **WHEN** no width is specified (default)
- **THEN** columns SHALL size based on content
- **AND** SHALL distribute available space automatically
- **AND** SHALL allow browser to determine optimal widths

#### Scenario: Fixed width
- **WHEN** width style prop is applied to th or col
- **THEN** SHALL fix column to specified width
- **AND** SHALL maintain width across all rows
- **AND** SHALL support absolute (px) and relative (%, fr) units

#### Scenario: Column groups
- **WHEN** colgroup with col elements is provided
- **THEN** SHALL apply column properties via col elements
- **AND** SHALL support span attribute for multi-column groups
- **AND** SHALL apply width to entire column group

### Requirement: Vertical Borders
The component SHALL support vertical column borders.

#### Scenario: Column borders enabled
- **WHEN** showColumnBorder={true} is set
- **THEN** SHALL apply vertical borders between columns
- **AND** SHALL not apply border to last column
- **AND** SHALL apply to both header and body cells
- **AND** SHALL use border color from design tokens

#### Scenario: No column borders
- **WHEN** showColumnBorder={false} or not provided (default)
- **THEN** SHALL not render vertical borders
- **AND** SHALL rely on spacing for column separation

### Requirement: No Data Display
The component SHALL handle empty data gracefully.

#### Scenario: Empty table body
- **WHEN** tbody contains no rows
- **THEN** SHALL render empty tbody element
- **AND** MAY display custom empty state message
- **AND** SHALL maintain table structure with header
- **AND** SHALL not break table layout

#### Scenario: Custom empty message
- **WHEN** empty state content is provided
- **THEN** SHALL render custom message in tbody
- **AND** SHALL span all columns with colspan
- **AND** SHALL center message appropriately

### Requirement: Loading Indication
The component SHALL support loading state display.

#### Scenario: Loading overlay
- **WHEN** loading state is indicated
- **THEN** MAY display LoadingSpinner or skeleton rows
- **AND** SHALL maintain table dimensions
- **AND** SHALL overlay existing content or replace rows
- **AND** SHALL be implemented by consumer (not built-in)

### Requirement: Table Traversal
The component SHALL support basic keyboard navigation per nimbus-core standards.

#### Scenario: Tab navigation
- **WHEN** table contains interactive elements
- **THEN** user SHALL navigate through focusable elements with Tab
- **AND** SHALL follow logical reading order (left-to-right, top-to-bottom)
- **AND** SHALL provide visible focus indicators
- **AND** SHALL skip non-interactive cells

### Requirement: Focus Indicators
The component SHALL provide focus indicators per nimbus-core standards.

#### Scenario: Cell focus
- **WHEN** cell or cell content receives focus
- **THEN** SHALL display visible focus outline
- **AND** SHALL meet 3:1 contrast ratio requirement
- **AND** SHALL use focus ring from design tokens

### Requirement: ARIA Table Pattern
The component SHALL implement ARIA table pattern per nimbus-core standards.

#### Scenario: Table roles
- **WHEN** table renders with semantic HTML
- **THEN** SHALL use implicit role="table" from `<table>` element
- **AND** rows SHALL use implicit role="row" from `<tr>` element
- **AND** cells SHALL use implicit role="cell" from `<td>` element
- **AND** headers SHALL use implicit role="columnheader" from `<th>` element

#### Scenario: Header association
- **WHEN** data cells relate to headers
- **THEN** headers SHALL use scope="col" for column headers
- **OR** scope="row" for row headers
- **AND** complex tables MAY use headers and id attributes for association
- **AND** SHALL provide clear header-to-cell relationships for screen readers

#### Scenario: Screen reader announcements
- **WHEN** screen reader navigates table
- **THEN** SHALL announce table caption if provided
- **AND** SHALL announce column headers when reading cells
- **AND** SHALL announce row and column positions
- **AND** SHALL provide table summary information

### Requirement: Sort Visual Indicators
The component SHALL support visual sort indicators (visual only, no built-in sorting logic).

#### Scenario: Sort icon display
- **WHEN** column header is sortable (implemented by consumer)
- **THEN** consumer MAY add sort icon to header
- **AND** icon SHALL indicate sort direction (ascending, descending, none)
- **AND** SHALL use accessible icon with aria-label
- **AND** sorting logic SHALL be implemented by consumer

### Requirement: Responsive Layout
The component SHALL support responsive table display.

#### Scenario: Horizontal scroll
- **WHEN** table width exceeds container
- **THEN** SHALL allow horizontal scrolling
- **AND** container SHALL handle overflow-x: auto
- **AND** SHALL maintain sticky header during horizontal scroll if enabled
- **AND** consumer SHALL wrap table in scrollable container

#### Scenario: Responsive size
- **WHEN** size prop uses responsive array or object
- **THEN** SHALL apply different sizes at different breakpoints
- **AND** SHALL support: { base: 'sm', md: 'md', lg: 'lg' }
- **AND** SHALL use breakpoints from design tokens

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot configuration
- **WHEN** table renders
- **THEN** SHALL apply table slot recipe from theme/slot-recipes/table.ts
- **AND** SHALL style slots: root, header, body, row, columnHeader, cell, footer, caption
- **AND** SHALL support variant, size, striped, interactive, stickyHeader, showColumnBorder options
- **AND** recipe SHALL be registered in theme configuration

#### Scenario: Design token usage
- **WHEN** recipe applies styles
- **THEN** SHALL use design tokens for all values
- **AND** SHALL support semantic color tokens for theming
- **AND** SHALL use spacing tokens for padding
- **AND** SHALL use border tokens for borders
- **AND** SHALL use typography tokens for text

### Requirement: Optimized Rendering
The component SHALL optimize for performance.

#### Scenario: Large table rendering
- **WHEN** table contains many rows
- **THEN** SHALL render efficiently with minimal re-renders
- **AND** consumer SHALL implement pagination or virtualization for very large datasets
- **AND** Table component itself SHALL not include virtualization (use DataTable for that)
- **AND** SHALL maintain 60fps scrolling for reasonably-sized tables

### Requirement: Row Selection (Consumer-Implemented)
The component SHALL support row selection when implemented by consumer.

#### Scenario: Selectable rows
- **WHEN** consumer implements row selection
- **THEN** rows MAY include checkbox cells
- **AND** consumer SHALL manage selection state
- **AND** consumer SHALL provide accessible selection announcements
- **AND** SHALL use aria-selected on selected rows

### Requirement: Theme Integration
The component SHALL support color palette customization.

#### Scenario: Color palette
- **WHEN** colorPalette prop is provided
- **THEN** SHALL apply semantic colors: primary, neutral, info, positive, warning, critical
- **AND** SHALL use for row hover states, striping, and borders
- **AND** SHALL maintain WCAG AA contrast requirements
- **AND** SHALL support light and dark modes

### Requirement: Style Props
The component SHALL accept Chakra style props per nimbus-core standards.

#### Scenario: Style prop override
- **WHEN** style props are provided on table or cells
- **THEN** SHALL accept all Chakra style props (padding, margin, width, etc.)
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL maintain type safety with HTMLChakraProps
