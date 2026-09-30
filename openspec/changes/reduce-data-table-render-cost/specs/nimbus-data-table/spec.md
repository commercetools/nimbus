## ADDED Requirements

### Requirement: Render Isolation

The component SHALL render again only the parts of the table that an
interaction or a prop change affects.

#### Scenario: Expanding a row

- **WHEN** the user expands or collapses a row
- **THEN** SHALL render that row again
- **AND** SHALL NOT render the other rows, the header, the column headers or
  `DataTable.Manager` again

#### Scenario: Pinning a row

- **WHEN** the user pins or unpins a row
- **THEN** SHALL render that row again
- **AND** SHALL NOT render the other rows, the header, the column headers or
  `DataTable.Manager` again

#### Scenario: New arrays with the same items

- **WHEN** the parent renders again and passes new `rows`, `columns` or
  `visibleColumns` arrays that hold the same items in the same order
- **THEN** SHALL NOT render any row again

#### Scenario: Pinned position of rows that are not pinned

- **WHEN** a custom `DataTable.Body` renders a row that is not pinned
- **THEN** SHALL pass `isFirstPinned`, `isLastPinned` and `isSinglePinned` as
  `false`

### Requirement: Pinned Row Outline

The component SHALL outline the group of pinned rows that are on screen.

#### Scenario: Search hides a pinned row

- **WHEN** rows are pinned and the search hides some of them
- **THEN** SHALL draw the top edge of the outline on the first pinned row on
  screen and the bottom edge on the last pinned row on screen
