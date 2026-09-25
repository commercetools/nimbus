## ADDED Requirements

### Requirement: Display Size

The component SHALL accept a `size` prop with the values `sm`, `md`, `lg`
and `xl`, which controls cell padding, header padding and cell text style.
The values `sm`, `md` and `lg` SHALL match the corresponding sizes of the
`Table` component. The default SHALL be `xl`, which reproduces the
DataTable appearance from before this prop existed.

#### Scenario: Default size

- **WHEN** a DataTable renders without a `size` prop
- **THEN** cells SHALL have 24px horizontal and 16px vertical padding
- **AND** the header row SHALL be 40px high
- **AND** cells SHALL NOT set a text style (text inherits from the page)
- **AND** the rendered output SHALL be visually identical to the output
  before this change

#### Scenario: Sizes shared with Table

- **WHEN** `size` is `sm`
- **THEN** cells and column headers SHALL have 8px horizontal and 8px
  vertical padding
- **AND** cell and header text SHALL use text style `sm` (14px)
- **WHEN** `size` is `md`
- **THEN** cells and column headers SHALL have 12px horizontal and 12px
  vertical padding
- **AND** cell and header text SHALL use text style `sm` (14px)
- **WHEN** `size` is `lg`
- **THEN** cells and column headers SHALL have 16px horizontal and 12px
  vertical padding
- **AND** cell and header text SHALL use text style `md` (16px)

#### Scenario: Header height follows padding for sm to lg

- **WHEN** `size` is `sm`, `md` or `lg`
- **THEN** the header row height SHALL come from its padding and content
- **AND** the header row SHALL NOT have a fixed height

#### Scenario: Cell content inherits the size

- **WHEN** a cell renders content without its own text style
- **THEN** the content SHALL use the text style of the chosen size

### Requirement: Deprecated Extra-Large Size

The `xl` size SHALL exist only to keep the previous appearance as the
default. Consumers SHALL be discouraged from selecting it.

#### Scenario: Explicit xl in development

- **WHEN** a consumer passes `size="xl"` explicitly
- **AND** the build is not a production build
- **THEN** the component SHALL log one console warning that names `xl` as
  deprecated and suggests `lg`

#### Scenario: Default xl does not warn

- **WHEN** a DataTable renders without a `size` prop
- **THEN** the component SHALL NOT log a warning about `xl`

#### Scenario: Documentation

- **WHEN** a consumer reads the `size` prop documentation
- **THEN** it SHALL list `sm`, `md` and `lg` as the supported values
- **AND** it SHALL state that `xl` is the deprecated default

### Requirement: Deprecated Density Prop

The `density` prop SHALL remain accepted and keep its previous behavior
until the next major release, and SHALL be marked deprecated in favor of
`size`.

#### Scenario: Condensed density without size

- **WHEN** `density` is `condensed`
- **AND** no `size` prop is passed
- **THEN** cells SHALL have 24px horizontal and 12px vertical padding, as
  before this change

#### Scenario: Size wins over density

- **WHEN** both `size` and `density` are passed
- **THEN** `size` SHALL control cell padding
- **AND** `density` SHALL be ignored
- **AND** in a non-production build the component SHALL log one console
  warning that `density` is deprecated and ignored when `size` is set

#### Scenario: Type deprecation

- **WHEN** a consumer uses `density` in TypeScript
- **THEN** the editor SHALL show the prop as deprecated, with a note that
  points to `size`

### Requirement: Internal Column Scaling

The drag, selection, expand and pin columns SHALL scale with the size while
their interactive controls keep a target size of at least 24×24 CSS pixels
(WCAG 2.2 SC 2.5.8).

#### Scenario: Padded internal column width

- **WHEN** the table shows the selection column, the pin column, or the
  expand column without a selection column
- **THEN** that column SHALL be 24px plus twice the horizontal cell padding
  of the chosen size wide: 40px for `sm`, 48px for `md`, 56px for `lg`,
  72px for `xl`

#### Scenario: Drag and expand column width

- **WHEN** the table shows the drag column, or the expand column next to a
  selection column
- **THEN** that column SHALL be 24px wide at every size

#### Scenario: Control target size

- **WHEN** the table renders at any size
- **THEN** the checkbox, drag handle, expand button and pin button SHALL
  each have a target area of at least 24×24 CSS pixels

#### Scenario: Sticky offsets follow the widths

- **WHEN** internal columns are sticky during horizontal scrolling
- **THEN** each sticky column SHALL sit directly next to the previous
  sticky column at every size, with no gap and no overlap

## MODIFIED Requirements

### Requirement: Multi-Slot Recipe
The component SHALL use extensive multi-slot recipe per nimbus-core standards.

#### Scenario: Slot configuration
- **WHEN** table renders
- **THEN** SHALL apply dataTable slot recipe from theme/slot-recipes/data-table.ts
- **AND** SHALL style slots: root, table, thead, tbody, tr, th, td, cell, headerCell, sortIcon, filterInput, checkbox, expandIcon, emptyState, loadingOverlay
- **AND** SHALL support size variants in recipe
- **AND** SHALL keep the deprecated density variants until the next major release

## REMOVED Requirements

### Requirement: Display Density

**Reason**: The requirement described density levels (`compact`, `normal`,
`comfortable`) and a persisted density menu that the component never
implemented; the actual prop was `density: "default" | "condensed"`.
Spacing is now controlled by the `size` prop, so tables share one scale
with `Table`.

**Migration**: Replace `density="condensed"` with `size="lg"` or
`size="md"`. `density` keeps working until the next major release; see
"Deprecated Density Prop".
