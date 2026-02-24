## ADDED Requirements

### Requirement: Namespace Structure

The component SHALL export as a compound component namespace.

#### Scenario: Component parts

- **WHEN** MainPage is imported
- **THEN** SHALL provide MainPage.Root as page container
- **AND** SHALL provide MainPage.Header as header section
- **AND** SHALL provide MainPage.Title as page title
- **AND** SHALL provide MainPage.Actions as action buttons area
- **AND** SHALL provide MainPage.Content as content area (wrapping PageContent)
- **AND** SHALL provide MainPage.Footer as optional footer
- **AND** Root SHALL be first property in namespace

#### Scenario: Info page usage (no footer)

- **WHEN** consumer renders MainPage without Footer
- **THEN** SHALL render header and content only
- **AND** footer grid row SHALL collapse to zero height

#### Scenario: Form page usage (with footer)

- **WHEN** consumer renders MainPage with Footer
- **THEN** SHALL render header, content, and footer
- **AND** footer SHALL appear at bottom of page

#### Scenario: Tabular page usage (with Tabs)

- **WHEN** consumer renders Tabs inside MainPage.Content
- **THEN** SHALL render Tabs within the content area
- **AND** Tabs SHALL receive width constraints from Content's PageContent wrapper

### Requirement: Root Grid Layout

The Root component SHALL use CSS grid for the page skeleton layout.

#### Scenario: Grid structure

- **WHEN** MainPage.Root is rendered
- **THEN** SHALL use `grid-template-rows: auto 1fr auto`
- **AND** SHALL use `grid-template-columns: 1fr`
- **AND** SHALL fill full height and width of parent

#### Scenario: Footer absent

- **WHEN** MainPage.Footer is not rendered inside Root
- **THEN** the third grid row (auto) SHALL collapse to zero height
- **AND** content SHALL fill remaining space below header

### Requirement: Header Layout

The Header component SHALL arrange title and actions horizontally.

#### Scenario: Header with title and actions

- **WHEN** MainPage.Header contains Title and Actions
- **THEN** SHALL use flex layout with `justify-content: space-between`
- **AND** SHALL vertically center children with `align-items: center`
- **AND** Title SHALL appear on the left
- **AND** Actions SHALL appear on the right

#### Scenario: Header with title only

- **WHEN** MainPage.Header contains only Title (no Actions)
- **THEN** SHALL render title with standard padding and border

### Requirement: Title Rendering

The Title component SHALL render the page title text.

#### Scenario: Title content

- **WHEN** MainPage.Title receives children
- **THEN** SHALL render children within a styled container

### Requirement: Actions Area

The Actions component SHALL provide a container for action buttons.

#### Scenario: Actions layout

- **WHEN** MainPage.Actions contains multiple children
- **THEN** SHALL use flex layout with gap between items
- **AND** SHALL vertically center action items

### Requirement: Content Wraps PageContent

The Content component SHALL internally render PageContent.Root.

#### Scenario: Variant forwarding

- **WHEN** MainPage.Content receives a `variant` prop
- **THEN** SHALL forward it to the internal PageContent.Root
- **AND** SHALL support "wide", "narrow", and "full" variants

#### Scenario: Columns forwarding

- **WHEN** MainPage.Content receives a `columns` prop
- **THEN** SHALL forward it to the internal PageContent.Root
- **AND** SHALL support "1", "1/1", and "2/1" column layouts

#### Scenario: Content fills remaining space

- **WHEN** MainPage.Content is rendered
- **THEN** SHALL occupy the 1fr grid row (filling remaining space)
- **AND** SHALL support vertical scrolling when content overflows

#### Scenario: Children passthrough

- **WHEN** MainPage.Content receives children
- **THEN** SHALL render children inside PageContent.Root

### Requirement: Optional Footer

The Footer component SHALL provide a container for page-level actions.

#### Scenario: Footer with content

- **WHEN** MainPage.Footer receives children
- **THEN** SHALL render children in a footer container
- **AND** SHALL display a top border to visually separate from content

#### Scenario: Footer absence

- **WHEN** MainPage.Footer is not rendered
- **THEN** page SHALL render without footer area
- **AND** content SHALL extend to bottom of page

### Requirement: Multi-Slot Recipe

The component SHALL use a multi-slot recipe registered as `nimbusMainPage`.

#### Scenario: Slot definition

- **WHEN** the recipe is defined
- **THEN** SHALL define slots: root, header, title, actions, content, footer
- **AND** SHALL use className "nimbus-main-page"

#### Scenario: Recipe registration

- **WHEN** MainPage component is used
- **THEN** recipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL use "nimbusMainPage" key

### Requirement: Type Definitions

The component SHALL provide comprehensive TypeScript types.

#### Scenario: Root props type

- **WHEN** MainPageProps type is defined
- **THEN** SHALL extend OmitInternalProps of MainPageRootSlotProps
- **AND** SHALL include children, ref, and data-* attributes
- **AND** all props SHALL have JSDoc documentation

#### Scenario: Header props type

- **WHEN** MainPageHeaderProps type is defined
- **THEN** SHALL extend OmitInternalProps of MainPageHeaderSlotProps
- **AND** SHALL include children and ref

#### Scenario: Title props type

- **WHEN** MainPageTitleProps type is defined
- **THEN** SHALL extend OmitInternalProps of MainPageTitleSlotProps
- **AND** SHALL include children and ref

#### Scenario: Actions props type

- **WHEN** MainPageActionsProps type is defined
- **THEN** SHALL extend OmitInternalProps of MainPageActionsSlotProps
- **AND** SHALL include children and ref

#### Scenario: Content props type

- **WHEN** MainPageContentProps type is defined
- **THEN** SHALL extend OmitInternalProps of MainPageContentSlotProps
- **AND** SHALL include PageContent variant and columns props
- **AND** SHALL include children and ref

#### Scenario: Footer props type

- **WHEN** MainPageFooterProps type is defined
- **THEN** SHALL extend OmitInternalProps of MainPageFooterSlotProps
- **AND** SHALL include children and ref

### Requirement: DOM Reference Access

The component SHALL forward refs to DOM elements.

#### Scenario: Root ref

- **WHEN** ref prop is provided on MainPage.Root
- **THEN** SHALL forward ref to root div element

#### Scenario: Sub-component refs

- **WHEN** ref prop is provided on any sub-component
- **THEN** SHALL forward ref to the corresponding DOM element

### Requirement: Data Attribute Support

The component SHALL support data attributes for testing.

#### Scenario: Custom data attributes

- **WHEN** data-* props are provided on Root
- **THEN** SHALL forward all data attributes to root element

### Requirement: Debug Identification

The component SHALL provide display names for debugging.

#### Scenario: Display name setting

- **WHEN** MainPage components are defined
- **THEN** MainPage.Root SHALL set displayName="MainPage.Root"
- **AND** MainPage.Header SHALL set displayName="MainPage.Header"
- **AND** MainPage.Title SHALL set displayName="MainPage.Title"
- **AND** MainPage.Actions SHALL set displayName="MainPage.Actions"
- **AND** MainPage.Content SHALL set displayName="MainPage.Content"
- **AND** MainPage.Footer SHALL set displayName="MainPage.Footer"

### Requirement: Component Export

The component SHALL be exported from the main package barrel.

#### Scenario: Package export

- **WHEN** MainPage is imported from @commercetools/nimbus
- **THEN** SHALL export MainPage namespace object
- **AND** SHALL export all prop types
- **AND** SHALL export underscore-prefixed individual parts
