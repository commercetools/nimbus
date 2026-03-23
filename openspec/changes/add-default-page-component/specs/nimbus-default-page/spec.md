## ADDED Requirements

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
- **AND** header grid SHALL adjust Actions positioning via CSS `:has()`

#### Scenario: Form page usage (with footer)

- **WHEN** consumer renders DefaultPage with Footer
- **THEN** SHALL render header, content, and footer
- **AND** Footer SHALL appear below content area

#### Scenario: Tabular page usage (with TabNav)

- **WHEN** consumer renders TabNav inside DefaultPage.Header
- **THEN** SHALL render tab navigation below the title row
- **AND** header padding bottom SHALL be removed via CSS `:has()`

### Requirement: Root Grid Layout

The Root component SHALL support two explicit layout modes via a `layout` prop.

#### Scenario: Constrained layout (default)

- **WHEN** `layout` is `"constrained"` or omitted on DefaultPage.Root
- **THEN** SHALL use `height: 100%` to fill parent height
- **AND** SHALL use `grid-template-rows: auto 1fr auto`
- **AND** SHALL use `grid-template-columns: 1fr`
- **AND** Content slot SHALL use `overflow: auto` for independent scrolling
- **AND** header and footer SHALL be naturally pinned by the grid (no sticky
  positioning needed)

#### Scenario: Flexible layout

- **WHEN** `layout` is `"flexible"` on DefaultPage.Root
- **THEN** SHALL use `height: auto` so root grows with content
- **AND** SHALL use `grid-template-rows: auto 1fr auto`
- **AND** SHALL use `grid-template-columns: 1fr`
- **AND** Content slot SHALL NOT use `overflow: auto`
- **AND** the entire page SHALL scroll as a single unit

#### Scenario: Footer absent

- **WHEN** DefaultPage.Footer is not rendered inside Root
- **THEN** the third grid row (auto) SHALL collapse to zero height
- **AND** content SHALL fill remaining space below header

### Requirement: Header Layout

The component SHALL use CSS grid for header layout.

#### Scenario: Grid structure

- **WHEN** Header renders
- **THEN** SHALL use CSS grid with template columns `1fr auto`
- **AND** SHALL align items center
- **AND** SHALL apply padding tokens: top `800`, horizontal `900`, bottom `600`

#### Scenario: Visual separation

- **WHEN** Header renders
- **THEN** SHALL display a bottom border using `solid-25` border token
- **AND** SHALL use `neutral.6` border color

#### Scenario: Actions positioning (without BackLink)

- **WHEN** Actions is placed inside Header without BackLink
- **THEN** SHALL be positioned in grid column 2, spanning rows 1-2
- **AND** SHALL display as flex row with gap of token `200`

#### Scenario: Actions positioning (with BackLink)

- **WHEN** Actions is placed inside Header WITH BackLink
- **THEN** SHALL be positioned in grid column 2, spanning rows 2-3
- **AND** CSS rule `&:has(.nimbus-default-page__backLink)` SHALL shift actions
  down to align with title row

#### Scenario: TabNav removes padding

- **WHEN** TabNav is present inside Header
- **THEN** CSS rule `&:has(.nimbus-default-page__tabNav)` SHALL set
  `paddingBottom: 0`

### Requirement: Back Navigation Link

The component SHALL provide optional accessible back navigation using React Aria.

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
- **AND** SHALL span full grid width (column 1 / -1)
- **AND** SHALL have focus ring for keyboard navigation

#### Scenario: BackLink is optional

- **WHEN** DefaultPage renders without BackLink
- **THEN** header grid SHALL render normally without adjustment
- **AND** component SHALL function as a main-level page

### Requirement: TabNav Sub-Component

The component SHALL provide a layout slot for tab navigation in the header.

#### Scenario: TabNav rendering

- **WHEN** TabNav renders inside Header
- **THEN** SHALL span full grid width (column 1 / -1)
- **AND** SHALL apply top margin token `200`

#### Scenario: TabNav is optional

- **WHEN** DefaultPage renders without TabNav
- **THEN** header SHALL render with standard padding bottom
- **AND** no adjustment to header layout

### Requirement: Sticky Variants

The component SHALL support sticky header and footer positioning only in
flexible layout mode.

#### Scenario: Sticky header in flexible layout

- **WHEN** `layout` is `"flexible"` and `stickyHeader` is true
- **THEN** header SHALL use `position: sticky` with `top: 0`
- **AND** SHALL use `zIndex: 1` and background color `bg`

#### Scenario: Sticky footer in flexible layout

- **WHEN** `layout` is `"flexible"` and `stickyFooter` is true
- **THEN** footer SHALL use `position: sticky` with `bottom: 0`
- **AND** SHALL use `zIndex: 1` and background color `bg`

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
- **AND** SHALL apply padding tokens: horizontal `900`, vertical `800`

#### Scenario: Constrained content scrolling

- **WHEN** `layout` is `"constrained"` or omitted
- **THEN** Content SHALL use `overflow: auto` for independent scrolling

#### Scenario: Flexible content scrolling

- **WHEN** `layout` is `"flexible"`
- **THEN** Content SHALL NOT use `overflow: auto`
- **AND** content SHALL scroll with the rest of the page

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
- **THEN** SHALL display a top border using `solid-25` border token
- **AND** SHALL use `neutral.6` border color
- **AND** SHALL apply padding using tokens `900` horizontal and `400` vertical

### Requirement: Multi-Slot Recipe

The component SHALL use a multi-slot recipe registered as `nimbusDefaultPage`.

#### Scenario: Slot definition

- **WHEN** the recipe is defined
- **THEN** SHALL define slots: root, header, backLink, title, subtitle, actions,
  tabNav, content, footer
- **AND** SHALL use className "nimbus-default-page"

#### Scenario: Recipe registration

- **WHEN** DefaultPage component is used
- **THEN** recipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL use "nimbusDefaultPage" key

#### Scenario: Layout variant definition

- **WHEN** the recipe defines variants
- **THEN** SHALL define `layout` variant with `"constrained"` and `"flexible"`
  values
- **AND** `"constrained"` SHALL set root `height: 100%` and content
  `overflow: auto`
- **AND** `"flexible"` SHALL set root `height: auto` and content without
  overflow
- **AND** SHALL default to `"constrained"` via `defaultVariants`

#### Scenario: Sticky variant definition

- **WHEN** the recipe defines variants
- **THEN** SHALL define `stickyHeader` boolean variant
- **AND** SHALL define `stickyFooter` boolean variant

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
- **AND** SHALL extend OmitInternalProps of DefaultPageBackLinkSlotProps

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
