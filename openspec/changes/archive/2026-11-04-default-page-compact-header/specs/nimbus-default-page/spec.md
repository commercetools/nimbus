# Spec Delta

## ADDED Requirements

### Requirement: Collapse Header On Scroll

When `collapseHeaderOnScroll` is set and the header is pinned, the header SHALL
show a collapsed form while the content is scrolled away from the top, and its
full form at the top. The header is pinned with `layout="constrained"`, or with
`layout="flexible"` and `stickyHeader`. The scroll distance is the scroll
position of DefaultPage.Content plus how far its top edge is above the bottom
edge of the header. The space given back is the full height minus the collapsed
height.

#### Scenario: Header collapses after scrolling past the space it gives back

- **WHEN** `collapseHeaderOnScroll` is true and the header is pinned
- **AND** the scroll distance is at least the space given back plus 8 CSS
  pixels
- **AND** no scroll event has happened for 150 milliseconds
- **AND** the mouse pointer is not over the header
- **THEN** the header SHALL show its collapsed form
- **AND** DefaultPage.Header SHALL have `data-collapsed="true"`

#### Scenario: Header is full at the top

- **WHEN** `collapseHeaderOnScroll` is true
- **AND** the scroll distance is less than 1 CSS pixel
- **AND** no scroll event has happened for 150 milliseconds
- **AND** the mouse pointer is not over the header
- **THEN** the header SHALL show its full form
- **AND** DefaultPage.Header SHALL NOT have `data-collapsed`

#### Scenario: Header keeps its form between the two points

- **WHEN** `collapseHeaderOnScroll` is true
- **AND** the scroll distance is at least 1 CSS pixel and less than the space
  given back plus 8 CSS pixels
- **THEN** the header SHALL keep the form it currently shows

#### Scenario: Scrolling up does not expand the header

- **WHEN** the header shows its collapsed form
- **AND** the user scrolls up but the scroll distance stays at least 1 CSS pixel
- **THEN** the header SHALL keep its collapsed form

#### Scenario: No form change while scrolling

- **WHEN** scroll events happen less than 150 milliseconds apart
- **THEN** the header SHALL keep the form it currently shows
- **AND** the component SHALL NOT change the scroll position

#### Scenario: Smooth scrolls reach their target

- **WHEN** a smooth scroll runs, for example `scrollIntoView` with
  `behavior: "smooth"` or a `#hash` link under `scroll-behavior: smooth`
- **THEN** the scroll SHALL reach its target as without this requirement

#### Scenario: Pointer over the header holds the form

- **WHEN** the mouse pointer is over the header
- **AND** the scroll distance calls for the other form
- **THEN** the header SHALL keep its current form
- **AND** SHALL change form when the pointer leaves the header, or when the user
  scrolls with the mouse wheel while the pointer is over the header

#### Scenario: A form change does not cause the opposite change

- **WHEN** the header changes from one form to the other
- **AND** the user does not scroll
- **THEN** the header SHALL NOT change back

#### Scenario: Content stays still when the header collapses after scrolling

- **WHEN** the header changes to its collapsed form after the user scrolled
- **THEN** the content SHALL stay at the same position on the screen, within 1
  CSS pixel

#### Scenario: Collapse after a jump

- **WHEN** the scroll position changed in one step by more than the space given
  back, for example by scroll restoration or a `#hash` link
- **AND** the header changes to its collapsed form
- **THEN** the component SHALL NOT change the scroll position

#### Scenario: Full header at the top pushes the content down

- **WHEN** the header returns to its full form at the top
- **THEN** the content SHALL start directly below the full header
- **AND** content above DefaultPage.Root in the same scrolling element SHALL
  NOT move

#### Scenario: First render

- **WHEN** the page renders for the first time
- **THEN** the header SHALL show its full form
- **AND** DefaultPage.Header SHALL NOT have `data-collapsed`

#### Scenario: Header that cannot be measured

- **WHEN** the header or the content cannot be measured, or the header height
  is 0
- **THEN** the header SHALL show its full form
- **AND** DefaultPage.Header SHALL NOT have `data-collapsed`

#### Scenario: First measurement calls for the collapsed form

- **WHEN** the first measurement after the first render calls for the collapsed
  form
- **THEN** the header SHALL show it without a fade
- **AND** the component SHALL NOT change the scroll position

#### Scenario: Constrained layout

- **WHEN** `layout` is `"constrained"` or omitted and `collapseHeaderOnScroll`
  is true
- **THEN** the header SHALL collapse and return to its full form as the content
  inside DefaultPage.Content scrolls

#### Scenario: Flexible layout with sticky header

- **WHEN** `layout` is `"flexible"`, `stickyHeader` is true and
  `collapseHeaderOnScroll` is true
- **THEN** the header SHALL collapse and return to its full form as the page
  scrolls

#### Scenario: Any scrolling element at any position

- **WHEN** the header is pinned
- **AND** the element that scrolls the page is the document or any ancestor of
  DefaultPage.Root, including across shadow DOM boundaries
- **AND** that element starts at any position on the screen
- **THEN** the header SHALL collapse and return to its full form as described
  in this requirement

#### Scenario: Header not pinned

- **WHEN** `collapseHeaderOnScroll` is true
- **AND** `layout` is `"flexible"` and `stickyHeader` is not true
- **THEN** the header SHALL show its full form
- **AND** development builds SHALL log a warning

#### Scenario: Option switched off

- **WHEN** `collapseHeaderOnScroll` changes from true to false
- **THEN** the header SHALL show its full form
- **AND** DefaultPage.Header SHALL NOT have `data-collapsed`

#### Scenario: Option not set

- **WHEN** `collapseHeaderOnScroll` is not set or is false
- **THEN** the header SHALL look and behave as without this requirement
- **AND** DefaultPage.Header SHALL NOT have `data-collapsed`

### Requirement: Collapsed Header Form

The collapsed form SHALL hide the parts that orient the user and keep the parts
the user works with, in their places.

#### Scenario: Subtitle is hidden

- **WHEN** the header shows its collapsed form
- **THEN** DefaultPage.Subtitle SHALL be hidden visually

#### Scenario: Back link shows its icon with a tooltip

- **WHEN** the header shows its collapsed form
- **THEN** DefaultPage.BackLink SHALL show its icon only, on the title row
- **AND** when the back link receives pointer hover or keyboard focus, a
  tooltip SHALL show its label
- **AND** the tooltip text SHALL be the same as the back link label

#### Scenario: No back link tooltip in the full form

- **WHEN** the header shows its full form
- **THEN** DefaultPage.BackLink SHALL show its label as text
- **AND** SHALL NOT show a tooltip

#### Scenario: Title stays smaller on one line

- **WHEN** the header shows its collapsed form
- **THEN** DefaultPage.Title SHALL use a smaller font size and line height than
  in the full form
- **AND** the title SHALL stay on one line
- **AND** a text title that does not fit SHALL end with an ellipsis

#### Scenario: Work parts stay in place

- **WHEN** the header shows its collapsed form
- **THEN** DefaultPage.Actions and DefaultPage.TabNav SHALL stay visible and
  operable
- **AND** DefaultPage.Actions SHALL stay on the title row

#### Scenario: Other header content stays in place

- **WHEN** the header contains content that is not a DefaultPage part
- **AND** the header shows its collapsed form
- **THEN** that content SHALL stay visible
- **AND** SHALL stay in the header grid column it has in the full form

#### Scenario: Header gets shorter

- **WHEN** the header shows its collapsed form
- **THEN** the header SHALL be shorter than in its full form
- **AND** the header SHALL have less vertical padding than in its full form

### Requirement: Header Height Variable

When `collapseHeaderOnScroll` is set, DefaultPage.Root SHALL publish the current
height of the header as the CSS custom property `--default-page-header-height`.

#### Scenario: Variable follows the header

- **WHEN** `collapseHeaderOnScroll` is true
- **AND** the header has been measured
- **THEN** DefaultPage.Root SHALL set `--default-page-header-height` to the
  current height of DefaultPage.Header as a length in CSS pixels (for example
  `92px`)
- **AND** SHALL update it when the header changes form or size

#### Scenario: Variable before the first measurement

- **WHEN** the header has not been measured yet, including during server
  rendering
- **THEN** DefaultPage.Root SHALL NOT set `--default-page-header-height`

#### Scenario: Variable absent without the option

- **WHEN** `collapseHeaderOnScroll` is not set or is false
- **THEN** DefaultPage.Root SHALL NOT set `--default-page-header-height`

### Requirement: Collapsed Header Accessibility

Changing the header form SHALL keep the page structure, the accessible names,
the focus and the operability of every header element.

#### Scenario: Structure stays

- **WHEN** the header changes form
- **THEN** DefaultPage.Title SHALL stay the same `h1` element
- **AND** the back link, subtitle, actions and tab navigation SHALL stay in the
  document and in the accessibility tree
- **AND** DefaultPage.Header SHALL stay a `<header>` element

#### Scenario: Focus stays

- **WHEN** an element inside the header has focus
- **AND** the header changes form
- **THEN** that element SHALL keep focus

#### Scenario: Collapsed back link keeps its name and size

- **WHEN** the header shows its collapsed form, with or without reduced motion
- **THEN** DefaultPage.BackLink SHALL keep its label as its accessible name
- **AND** its pointer target SHALL be at least 24 by 24 CSS pixels

#### Scenario: Tooltip does not repeat the name

- **WHEN** the back link tooltip is shown
- **THEN** the tooltip SHALL NOT add its text to the back link's accessible
  description

#### Scenario: Hidden subtitle stays available to assistive technology

- **WHEN** the header shows its collapsed form
- **THEN** the text of DefaultPage.Subtitle SHALL stay available to assistive
  technology

#### Scenario: Height changes in one step, appearing parts fade in

- **WHEN** the header changes form
- **AND** the user has not asked for reduced motion
- **THEN** the header height SHALL change in one step
- **AND** parts that appear SHALL fade in
- **AND** parts that disappear SHALL be hidden at once

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` matches
- **THEN** the header SHALL change form without a fade
- **AND** the header SHALL still collapse and return to its full form

## MODIFIED Requirements

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
- **AND** the header shows its full form
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
- **AND** the header shows its full form
- **THEN** Actions SHALL vertically span the title and subtitle rows

#### Scenario: Actions positioning (with BackLink)

- **WHEN** Actions is placed inside Header WITH BackLink
- **AND** the header shows its full form
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
- **THEN** SHALL use i18n-translated default text ("Go back") as its label
- **AND** SHALL display the label in the full header form
- **AND** SHALL support de, en, es, fr-FR, pt-BR locales

#### Scenario: Custom label

- **WHEN** BackLink renders with children
- **THEN** SHALL use the provided children text as its label
- **AND** SHALL display the label in the full header form
- **AND** children text SHALL serve as the accessible name

#### Scenario: Visual presentation

- **WHEN** BackLink renders
- **AND** the header shows its full form
- **THEN** SHALL display an ArrowBack icon before the text
- **AND** SHALL use primary color palette with hover underline
- **AND** SHALL span the full header width
- **AND** SHALL have focus ring for keyboard navigation

#### Scenario: BackLink is optional

- **WHEN** DefaultPage renders without BackLink
- **THEN** header SHALL render normally without adjustment
- **AND** component SHALL function as a main-level page

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
- **AND** both branches SHALL include an optional `collapseHeaderOnScroll`
  boolean prop
- **AND** both branches SHALL include children, ref, and style props

#### Scenario: Type error on invalid combinations

- **WHEN** consumer passes `stickyHeader` without `layout="flexible"`
- **THEN** TypeScript SHALL produce a compile error
- **WHEN** consumer passes `stickyFooter` without `layout="flexible"`
- **THEN** TypeScript SHALL produce a compile error
- **WHEN** consumer passes `layout="constrained"` with `stickyHeader`
- **THEN** TypeScript SHALL produce a compile error

#### Scenario: Existing code keeps compiling

- **WHEN** consumer code compiled before `collapseHeaderOnScroll` was added,
  including a `layout` value typed as `"constrained" | "flexible"`, wrappers
  built with `Omit<DefaultPageProps, ...>`, and props spread into Root
- **THEN** that code SHALL still compile

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
