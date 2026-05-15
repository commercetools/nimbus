# nimbus-default-page Specification

## Purpose
TBD - created by archiving change add-default-page-component. Update Purpose after archive.
## Requirements
### Requirement: Namespace Structure

The component SHALL export as a compound component namespace.

#### Scenario: Component parts

- **WHEN** DefaultPage is imported
- **THEN** SHALL provide DefaultPage.Root as page container
- **AND** SHALL provide DefaultPage.Header as header section
- **AND** SHALL provide DefaultPage.BackLink as optional back navigation link
- **AND** SHALL provide DefaultPage.Title as page title heading
- **AND** SHALL provide DefaultPage.Subtitle as optional subtitle
- **AND** SHALL provide DefaultPage.Actions as action button container
- **AND** SHALL provide DefaultPage.TabNav as tab navigation container
- **AND** SHALL provide DefaultPage.Content as main content area
- **AND** SHALL provide DefaultPage.Footer as optional footer section
- **AND** Root SHALL be first property in namespace

#### Scenario: Main page usage (no back link, no footer)

- **WHEN** consumer renders DefaultPage without BackLink or Footer
- **THEN** SHALL render header and content only
- **AND** SHALL NOT require BackLink or Footer to be present

#### Scenario: Detail page usage (with back link)

- **WHEN** consumer renders DefaultPage with BackLink
- **THEN** SHALL render back link in header above the title
- **AND** Actions SHALL align with the title row (not the back link row)

#### Scenario: Form page usage (with footer)

- **WHEN** consumer renders DefaultPage with Footer
- **THEN** SHALL render header, content, and footer
- **AND** Footer SHALL appear below content area

#### Scenario: Tabular page usage (with TabNav)

- **WHEN** consumer renders TabNav inside DefaultPage.Header
- **THEN** SHALL render tab navigation below the title row
- **AND** header bottom padding SHALL be removed when TabNav is present

### Requirement: Root Layout

The Root component SHALL support two explicit layout modes via a `layout` prop.

#### Scenario: Constrained layout (default)

- **WHEN** `layout` is `"constrained"` or omitted on DefaultPage.Root
- **THEN** Root SHALL fill its parent height
- **AND** Header and Footer SHALL remain visible without scrolling
- **AND** Content SHALL scroll independently when it overflows

#### Scenario: Flexible layout

- **WHEN** `layout` is `"flexible"` on DefaultPage.Root
- **THEN** Root SHALL grow with its content (no fixed height)
- **AND** the entire page SHALL scroll as a single unit

#### Scenario: Footer absent

- **WHEN** DefaultPage.Footer is not rendered inside Root
- **THEN** footer space SHALL collapse
- **AND** content SHALL fill remaining space below header

### Requirement: Header Layout

The Header SHALL arrange title, actions, back link, and tab navigation.

#### Scenario: Header structure

- **WHEN** Header renders
- **THEN** Title and Actions SHALL appear on the same row
- **AND** Title SHALL take available horizontal space
- **AND** Actions SHALL be end-aligned

#### Scenario: Visual separation

- **WHEN** Header renders
- **THEN** SHALL display a bottom border separating it from content

#### Scenario: Actions positioning (without BackLink)

- **WHEN** Actions is placed inside Header without BackLink
- **THEN** Actions SHALL vertically span the title and subtitle rows

#### Scenario: Actions positioning (with BackLink)

- **WHEN** Actions is placed inside Header WITH BackLink
- **THEN** Actions SHALL vertically span the title and subtitle rows
- **AND** Actions SHALL NOT span the back link row

### Requirement: Back Navigation Link

The component SHALL provide optional accessible back navigation.

#### Scenario: Link rendering

- **WHEN** BackLink renders
- **THEN** SHALL render as a semantic `<a>` element
- **AND** SHALL be accessible via keyboard and screen reader
- **AND** SHALL require `href` prop for navigation target

#### Scenario: Default accessible name

- **WHEN** BackLink renders without children
- **THEN** SHALL display i18n-translated default text ("Go back")
- **AND** SHALL support de, en, es, fr-FR, pt-BR locales

#### Scenario: Custom label

- **WHEN** BackLink renders with children
- **THEN** SHALL display the provided children text
- **AND** children text SHALL serve as the accessible name

#### Scenario: Visual presentation

- **WHEN** BackLink renders
- **THEN** SHALL display an ArrowBack icon before the text
- **AND** SHALL use primary color palette with hover underline
- **AND** SHALL span the full header width
- **AND** SHALL have focus ring for keyboard navigation

#### Scenario: BackLink is optional

- **WHEN** DefaultPage renders without BackLink
- **THEN** header SHALL render normally without adjustment
- **AND** component SHALL function as a main-level page

### Requirement: TabNav Sub-Component

The component SHALL provide a layout slot for tab navigation in the header.

#### Scenario: TabNav rendering

- **WHEN** TabNav renders inside Header
- **THEN** SHALL span the full header width
- **AND** SHALL appear below the title row

#### Scenario: TabNav is optional

- **WHEN** DefaultPage renders without TabNav
- **THEN** header SHALL render with standard padding
- **AND** no adjustment to header layout

### Requirement: Sticky Variants

The component SHALL support sticky header and footer positioning only in
flexible layout mode.

#### Scenario: Sticky header in flexible layout

- **WHEN** `layout` is `"flexible"` and `stickyHeader` is true
- **THEN** header SHALL remain visible at the top of the viewport during scroll

#### Scenario: Sticky footer in flexible layout

- **WHEN** `layout` is `"flexible"` and `stickyFooter` is true
- **THEN** footer SHALL remain visible at the bottom of the viewport during
  scroll

#### Scenario: No sticky in constrained layout

- **WHEN** `layout` is `"constrained"` or omitted
- **THEN** `stickyHeader` and `stickyFooter` props SHALL NOT be available
- **AND** TypeScript SHALL produce a compile error if they are provided

#### Scenario: Default in flexible layout

- **WHEN** `layout` is `"flexible"` and neither `stickyHeader` nor
  `stickyFooter` is provided
- **THEN** header and footer SHALL scroll with the page content

### Requirement: Content Area

The component SHALL provide a main content area.

#### Scenario: Content rendering

- **WHEN** DefaultPage.Content is rendered
- **THEN** SHALL render as `<main>` element

#### Scenario: Constrained content scrolling

- **WHEN** `layout` is `"constrained"` or omitted
- **THEN** Content SHALL scroll independently when it overflows

#### Scenario: Flexible content scrolling

- **WHEN** `layout` is `"flexible"`
- **THEN** Content SHALL scroll with the rest of the page

#### Scenario: Content is plain container

- **WHEN** DefaultPage.Content receives children
- **THEN** SHALL render children directly without wrapping in PageContent
- **AND** consumers MAY compose PageContent inside Content when needed

### Requirement: Semantic HTML Landmarks

The component SHALL use semantic HTML elements for accessibility.

#### Scenario: Landmark roles

- **WHEN** DefaultPage renders with all parts
- **THEN** Header SHALL render as `<header>` (banner landmark)
- **AND** Content SHALL render as `<main>` (main landmark)
- **AND** Footer SHALL render as `<footer>` (contentinfo landmark)

#### Scenario: Heading hierarchy

- **WHEN** Title renders
- **THEN** SHALL render as an `<h1>` element

### Requirement: Footer Visual Separation

The component SHALL visually separate the footer from content.

#### Scenario: Footer border

- **WHEN** Footer renders
- **THEN** SHALL display a top border separating it from content

### Requirement: Type Definitions

The component SHALL provide comprehensive TypeScript types with discriminated
union enforcement.

#### Scenario: Root props discriminated union

- **WHEN** DefaultPageProps type is defined
- **THEN** SHALL use a discriminated union on the `layout` prop
- **AND** the `"constrained"` branch (and default/omitted) SHALL NOT include
  `stickyHeader` or `stickyFooter`
- **AND** the `"flexible"` branch SHALL include optional `stickyHeader` and
  `stickyFooter` boolean props
- **AND** both branches SHALL include children, ref, and style props

#### Scenario: Type error on invalid combinations

- **WHEN** consumer passes `stickyHeader` without `layout="flexible"`
- **THEN** TypeScript SHALL produce a compile error
- **WHEN** consumer passes `stickyFooter` without `layout="flexible"`
- **THEN** TypeScript SHALL produce a compile error
- **WHEN** consumer passes `layout="constrained"` with `stickyHeader`
- **THEN** TypeScript SHALL produce a compile error

#### Scenario: BackLink props type

- **WHEN** DefaultPageBackLinkProps type is defined
- **THEN** SHALL require `href: string` prop

#### Scenario: Slot props types

- **WHEN** slot props types are defined
- **THEN** Root SHALL extend HTMLChakraProps<"div">
- **AND** Header SHALL extend HTMLChakraProps<"header">
- **AND** Title SHALL extend HTMLChakraProps<"h1">
- **AND** Subtitle SHALL extend HTMLChakraProps<"p">
- **AND** Content SHALL extend HTMLChakraProps<"main">
- **AND** Footer SHALL extend HTMLChakraProps<"footer">
- **AND** Actions SHALL extend HTMLChakraProps<"div">
- **AND** BackLink SHALL extend HTMLChakraProps<"a">
- **AND** TabNav SHALL extend HTMLChakraProps<"div">

### Requirement: DOM Reference Access

The component SHALL forward refs to DOM elements.

#### Scenario: Ref forwarding

- **WHEN** ref prop is provided on any sub-component
- **THEN** SHALL forward ref to the corresponding DOM element

### Requirement: Debug Identification

The component SHALL provide display names for debugging.

#### Scenario: Display name setting

- **WHEN** DefaultPage sub-components are defined
- **THEN** each SHALL set displayName matching `DefaultPage.<Part>`

### Requirement: Component Export

The component SHALL be exported from the main package barrel.

#### Scenario: Package export

- **WHEN** DefaultPage is imported from @commercetools/nimbus
- **THEN** SHALL export DefaultPage namespace object
- **AND** SHALL export all prop types
- **AND** SHALL export underscore-prefixed individual parts

### Requirement: Internationalization

The component SHALL support i18n for user-facing text.

#### Scenario: Back link default text

- **WHEN** BackLink renders without children
- **THEN** SHALL use LocalizedStringDictionary for "Go back" text
- **AND** SHALL support locales: de, en, es, fr-FR, pt-BR
- **AND** message key SHALL be registered in `packages/i18n/data/core.json`

