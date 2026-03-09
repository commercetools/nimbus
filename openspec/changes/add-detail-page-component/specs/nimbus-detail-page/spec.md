## ADDED Requirements

### Requirement: Namespace Structure

The component SHALL export as a compound component namespace.

#### Scenario: Component parts

- **WHEN** DetailPage is imported
- **THEN** SHALL provide DetailPage.Root as page container
- **AND** SHALL provide DetailPage.Header as header section
- **AND** SHALL provide DetailPage.BackLink as back navigation link
- **AND** SHALL provide DetailPage.Title as page title heading
- **AND** SHALL provide DetailPage.Subtitle as optional subtitle
- **AND** SHALL provide DetailPage.HeaderActions as action button container
- **AND** SHALL provide DetailPage.Content as main content area
- **AND** SHALL provide DetailPage.Footer as optional footer section
- **AND** Root SHALL be first property in namespace

#### Scenario: Minimal usage (info page)

- **WHEN** consumer renders DetailPage without Footer
- **THEN** SHALL render header and content only
- **AND** SHALL NOT require Footer to be present

#### Scenario: Form page usage

- **WHEN** consumer renders DetailPage with Footer
- **THEN** SHALL render header, content, and footer
- **AND** Footer SHALL appear below content area

#### Scenario: Tabular page usage

- **WHEN** consumer composes Tabs inside DetailPage.Content
- **THEN** SHALL render tabs within the scrollable content area
- **AND** tabs SHALL participate in flex layout for scroll propagation

### Requirement: Page Layout

The component SHALL provide a flex column layout for vertical page structure.

#### Scenario: Root container

- **WHEN** DetailPage.Root renders
- **THEN** SHALL use `display: flex` with `flex-direction: column`
- **AND** SHALL set `min-height: 0` for nested flex overflow
- **AND** SHALL set `width: 100%`

#### Scenario: Content scrolling

- **WHEN** content exceeds available height
- **THEN** content area SHALL scroll independently
- **AND** header and footer SHALL remain fixed
- **AND** content SHALL use `flex: 1` and `flex-basis: 0` for flex growth

### Requirement: Header Layout

The component SHALL use CSS grid for header layout with named areas.

#### Scenario: Grid structure

- **WHEN** Header renders
- **THEN** SHALL use CSS grid with template columns `1fr auto`
- **AND** SHALL define grid areas: backLink (full width), title + headerActions
  (row), subtitle (full width)
- **AND** SHALL apply column gap of token `400` and row gap of token `400`

#### Scenario: Visual separation

- **WHEN** Header renders
- **THEN** SHALL display a bottom border using `solid-25` border token
- **AND** SHALL use `neutral.6` border color

#### Scenario: Header actions positioning

- **WHEN** HeaderActions is placed inside Header
- **THEN** SHALL be positioned in the `headerActions` grid area
- **AND** SHALL align next to the title
- **AND** SHALL display as flex row with gap of token `200`

### Requirement: Back Navigation Link

The component SHALL provide accessible back navigation using React Aria.

#### Scenario: Link rendering

- **WHEN** BackLink renders
- **THEN** SHALL render as a semantic `<a>` element
- **AND** SHALL use React Aria `useLink` hook for keyboard and screen reader
  accessibility
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

### Requirement: Semantic HTML Landmarks

The component SHALL use semantic HTML elements for accessibility.

#### Scenario: Landmark roles

- **WHEN** DetailPage renders with all parts
- **THEN** Header SHALL render as `<header>` (banner landmark)
- **AND** Content SHALL render as `<main>` (main landmark)
- **AND** Footer SHALL render as `<footer>` (contentinfo landmark)

#### Scenario: Heading hierarchy

- **WHEN** Title renders
- **THEN** SHALL render as an `<h1>` element
- **AND** SHALL establish proper document outline

### Requirement: Footer Visual Separation

The component SHALL visually separate the footer from content.

#### Scenario: Footer border

- **WHEN** Footer renders
- **THEN** SHALL display a top border using `solid-25` border token
- **AND** SHALL use `neutral.6` border color
- **AND** SHALL apply padding using tokens `600` horizontal and `400` vertical

### Requirement: Multi-Slot Recipe

The component SHALL use a multi-slot recipe registered as `nimbusDetailPage`.

#### Scenario: Slot definition

- **WHEN** the recipe is defined
- **THEN** SHALL define slots: root, header, backLink, title, subtitle,
  headerActions, content, footer
- **AND** SHALL use className "nimbus-detail-page"

#### Scenario: Recipe registration

- **WHEN** DetailPage component is used
- **THEN** recipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL use "nimbusDetailPage" key

### Requirement: Type Definitions

The component SHALL provide comprehensive TypeScript types.

#### Scenario: BackLink props type

- **WHEN** DetailPageBackLinkProps type is defined
- **THEN** SHALL require `href: string` prop
- **AND** SHALL extend HTMLChakraProps<"a"> via OmitInternalProps

#### Scenario: Slot props types

- **WHEN** slot props types are defined
- **THEN** Root SHALL extend HTMLChakraProps<"div">
- **AND** Header SHALL extend HTMLChakraProps<"header">
- **AND** Title SHALL extend HTMLChakraProps<"h1">
- **AND** Subtitle SHALL extend HTMLChakraProps<"p">
- **AND** Content SHALL extend HTMLChakraProps<"main">
- **AND** Footer SHALL extend HTMLChakraProps<"footer">
- **AND** HeaderActions SHALL extend HTMLChakraProps<"div">
- **AND** BackLink SHALL extend HTMLChakraProps<"a">

### Requirement: DOM Reference Access

The component SHALL forward refs to DOM elements.

#### Scenario: Ref forwarding

- **WHEN** ref prop is provided on any sub-component
- **THEN** SHALL forward ref to the corresponding DOM element

### Requirement: Debug Identification

The component SHALL provide display names for debugging.

#### Scenario: Display name setting

- **WHEN** DetailPage sub-components are defined
- **THEN** each SHALL set displayName matching `DetailPage.<Part>`

### Requirement: Component Export

The component SHALL be exported from the main package barrel.

#### Scenario: Package export

- **WHEN** DetailPage is imported from @commercetools/nimbus
- **THEN** SHALL export DetailPage namespace object
- **AND** SHALL export all prop types
- **AND** SHALL export underscore-prefixed individual parts

### Requirement: Internationalization

The component SHALL support i18n for user-facing text.

#### Scenario: Back link default text

- **WHEN** BackLink renders without children
- **THEN** SHALL use LocalizedStringDictionary for "Go back" text
- **AND** SHALL support locales: de, en, es, fr-FR, pt-BR
- **AND** message key SHALL be registered in `packages/i18n/data/core.json`
