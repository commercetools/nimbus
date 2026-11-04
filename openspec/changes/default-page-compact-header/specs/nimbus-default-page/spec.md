# Spec Delta

## ADDED Requirements

### Requirement: Collapse Header On Scroll

When `collapseHeaderOnScroll` is set and the header is pinned, the header SHALL
show a collapsed form while the content is scrolled away from the top, and its
full form at the top. The header is pinned with `layout="constrained"`, or with
`layout="flexible"` and `stickyHeader`. The component SHALL use the
scroll-driven change where the browser supports view and scroll timelines and
the user does not prefer reduced motion, and the one-step change otherwise.

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
- **AND** the element that scrolls the page MAY be the document or any ancestor
  of DefaultPage.Root, including across shadow DOM boundaries, at any position
  on the screen

#### Scenario: Scroll-driven change where supported

- **WHEN** the browser supports view and scroll timelines
- **AND** `prefers-reduced-motion: reduce` does not match
- **THEN** the header SHALL change as described in "Scroll-Driven Header
  Collapse"

#### Scenario: One-step change otherwise

- **WHEN** the browser does not support view or scroll timelines
- **OR** `prefers-reduced-motion: reduce` matches
- **THEN** the header SHALL change as described in "One-Step Header Collapse"

#### Scenario: First render

- **WHEN** the page renders for the first time, including during server
  rendering
- **THEN** the header SHALL show its full form

#### Scenario: Header not pinned

- **WHEN** `collapseHeaderOnScroll` is true
- **AND** `layout` is `"flexible"` and `stickyHeader` is not true
- **THEN** the header SHALL show its full form
- **AND** development builds SHALL log a warning

#### Scenario: Option switched off

- **WHEN** `collapseHeaderOnScroll` changes from true to false
- **THEN** the header SHALL show its full form
- **AND** the component SHALL remove every style it set on the page

#### Scenario: Option not set

- **WHEN** `collapseHeaderOnScroll` is not set or is false
- **THEN** the page SHALL look and behave as without this requirement

### Requirement: Scroll-Driven Header Collapse

In the scroll-driven change, the header SHALL follow the scroll position: over
the collapse distance it SHALL change continuously from its full form to its
collapsed form. The collapse distance is the full header height minus the pinned
height, in whole CSS pixels. The pinned height is the height of the collapsed
form, plus the extra height of a title with several lines.

#### Scenario: Header follows the scroll position

- **WHEN** the scroll position moves through the collapse distance
- **THEN** each scroll position SHALL show its own in-between form
- **AND** the header SHALL reach its collapsed form at the end of the distance
- **AND** scrolling back SHALL show the same forms backwards

#### Scenario: Where the distance starts

- **WHEN** the layout is flexible
- **THEN** the collapse distance SHALL start when the top of DefaultPage.Root
  reaches the top of the scrolling area
- **WHEN** the layout is constrained
- **THEN** the collapse distance SHALL start at the top of DefaultPage.Content

#### Scenario: Stopping in between

- **WHEN** the user stops scrolling inside the collapse distance
- **THEN** the header SHALL keep the in-between form of that scroll position

#### Scenario: Content moves only with the scroll

- **WHEN** the header changes form
- **THEN** the content SHALL move exactly as far as the scroll position changes
- **AND** the component SHALL NOT change the scroll position

#### Scenario: Flexible layout keeps the header space

- **WHEN** the layout is flexible
- **THEN** the header SHALL keep its full height in the page in every form
- **AND** content after the header SHALL NOT move when the header changes form

#### Scenario: Constrained layout gives the space to the content area

- **WHEN** the layout is constrained
- **THEN** DefaultPage.Content SHALL start at the bottom edge of the header at
  every scroll position
- **AND** a top padding the page sets on DefaultPage.Content, and a top margin
  it sets on DefaultPage.Header, SHALL stay in effect
- **AND** the header SHALL NOT be moved with a transform

#### Scenario: Smooth scrolls reach their target

- **WHEN** a smooth scroll runs, for example `scrollIntoView` with
  `behavior: "smooth"`
- **THEN** the scroll SHALL reach its target as without this requirement

#### Scenario: Pinned form

- **WHEN** the scroll position is at or beyond the end of the collapse distance
- **THEN** the header SHALL be pinned in its collapsed form
- **AND** the visible header height SHALL be the pinned height
- **AND** DefaultPage.BackLink SHALL show only its icon, with a pointer target
  of 24 by 24 CSS pixels, without changing the size of anything around it

#### Scenario: Sharp text at rest

- **WHEN** the header is pinned
- **OR** the header has shown its full form at the top for 500 milliseconds
- **THEN** the header parts SHALL have no running animations

#### Scenario: Ready before the scroll

- **WHEN** the header rests at the top
- **AND** wheel, touch, a scroll key or a pointer press happens
- **THEN** the animations of the header parts SHALL start before the page
  scrolls

#### Scenario: No scroll listeners

- **WHEN** the scroll-driven change runs
- **THEN** the component SHALL NOT add `scroll` event listeners

#### Scenario: Scroll to the top

- **WHEN** the page scrolls to the top, for example after a tab click
- **THEN** the header SHALL show its full form at once, also while the mouse
  pointer is over the header

### Requirement: One-Step Header Collapse

In the one-step change, the header SHALL switch between its full and its
collapsed form at once, after scrolling pauses. The scroll distance is the
scroll position of DefaultPage.Content plus how far its top edge is above the
bottom edge of the header.

#### Scenario: Header collapses after scrolling past the threshold

- **WHEN** the scroll distance is at least the threshold
- **AND** no scroll event has happened for 150 milliseconds
- **AND** the mouse pointer is not over the header
- **THEN** the header SHALL show its collapsed form at once
- **AND** the threshold SHALL be the space the header gives back plus 8 CSS
  pixels in the constrained layout, and 8 CSS pixels past the space the header
  keeps in the flexible layout

#### Scenario: Header is full at the top

- **WHEN** the scroll distance is less than 1 CSS pixel
- **AND** no scroll event has happened for 150 milliseconds
- **AND** the mouse pointer is not over the header
- **THEN** the header SHALL show its full form

#### Scenario: Header keeps its form in between

- **WHEN** the scroll distance is at least 1 CSS pixel and below the threshold
- **THEN** the header SHALL keep the form it currently shows

#### Scenario: No form change while scrolling

- **WHEN** scroll events happen less than 150 milliseconds apart
- **THEN** the header SHALL keep the form it currently shows
- **AND** the component SHALL NOT change the scroll position

#### Scenario: Pointer over the header holds the form

- **WHEN** the mouse pointer is over the header
- **AND** the scroll distance calls for the other form
- **THEN** the header SHALL keep its current form
- **AND** SHALL change form when the pointer leaves the header, or when the user
  scrolls with the mouse wheel while the pointer is over the header

#### Scenario: Content stays still in the constrained layout

- **WHEN** the layout is constrained
- **AND** the header changes to its collapsed form after the user scrolled
- **THEN** the content SHALL stay at the same position on the screen, within 1
  CSS pixel

#### Scenario: Flexible layout keeps the header space

- **WHEN** the layout is flexible
- **AND** the header changes form
- **THEN** the header SHALL keep its full height in the page
- **AND** content after the header SHALL NOT move

#### Scenario: Collapse after a jump

- **WHEN** the scroll position changed in one step by more than the space given
  back, for example by scroll restoration or a `#hash` link
- **AND** the header changes to its collapsed form
- **THEN** the component SHALL NOT change the scroll position

#### Scenario: Appearing parts fade in

- **WHEN** the header returns to its full form
- **AND** `prefers-reduced-motion: reduce` does not match
- **THEN** parts that appear SHALL fade in
- **AND** the header height SHALL change at once

### Requirement: Collapsed Header Form

The collapsed form SHALL hide the parts that orient the user and keep the parts
the user works with.

#### Scenario: Subtitle is hidden

- **WHEN** the header shows its collapsed form
- **THEN** DefaultPage.Subtitle SHALL be hidden visually

#### Scenario: Back link shows its icon with a tooltip

- **WHEN** the header shows its collapsed form
- **THEN** DefaultPage.BackLink SHALL show its icon only, before the title
- **AND** when the back link receives pointer hover or keyboard focus, a tooltip
  SHALL show its label
- **AND** the tooltip text SHALL be the same as the back link label

#### Scenario: No back link tooltip in the full form

- **WHEN** the header shows its full form
- **THEN** DefaultPage.BackLink SHALL show its label as text
- **AND** SHALL NOT show a tooltip

#### Scenario: Title gets smaller and keeps its lines

- **WHEN** the header shows its collapsed form
- **THEN** DefaultPage.Title SHALL use the collapsed font size
- **AND** a title with several lines SHALL keep all of them
- **AND** the title row SHALL be tall enough for the title, with the collapsed
  padding above and below

#### Scenario: Page truncates the title

- **WHEN** the page truncates DefaultPage.Title with style props, for example
  `truncate`
- **THEN** the collapsed title SHALL stay on one line

#### Scenario: Work parts stay

- **WHEN** the header shows its collapsed form
- **THEN** DefaultPage.Actions and DefaultPage.TabNav SHALL stay visible and
  operable
- **AND** DefaultPage.Actions SHALL be on the title row

#### Scenario: Hidden parts let clicks through

- **WHEN** the header shows its collapsed form
- **THEN** a pointer press on a visible part SHALL reach that part, not a hidden
  part

#### Scenario: Header gets shorter

- **WHEN** the header shows its collapsed form
- **THEN** the visible header SHALL be shorter than in its full form
- **AND** the header SHALL have less vertical padding than in its full form

### Requirement: Header State For Page Content

DefaultPage.Header SHALL accept a function as children that receives
`{ isCollapsed }`, so pages can adapt their own header content.

#### Scenario: Function children

- **WHEN** the children of DefaultPage.Header are a function
- **THEN** DefaultPage.Header SHALL render what the function returns
- **AND** SHALL call it with `{ isCollapsed }`

#### Scenario: State in the scroll-driven change

- **WHEN** the scroll-driven change runs
- **THEN** `isCollapsed` SHALL be true from the moment the header starts to
  collapse
- **AND** SHALL be false once the header is back in its full form

#### Scenario: State in the one-step change

- **WHEN** the one-step change runs
- **THEN** `isCollapsed` SHALL be true while the header shows its collapsed form

#### Scenario: Header that cannot collapse

- **WHEN** `collapseHeaderOnScroll` is not set, or the header is not pinned
- **THEN** `isCollapsed` SHALL be false

### Requirement: Header Height Variable

When `collapseHeaderOnScroll` is set, DefaultPage.Root SHALL publish a header
height as the CSS custom property `--default-page-header-height`.

#### Scenario: Pinned height in the scroll-driven change

- **WHEN** the scroll-driven change runs
- **AND** the header has been measured
- **THEN** DefaultPage.Root SHALL set `--default-page-header-height` to the
  pinned height as a length in CSS pixels
- **AND** SHALL update it when the header changes size

#### Scenario: Current height in the one-step change

- **WHEN** the one-step change runs
- **AND** the header has been measured
- **THEN** DefaultPage.Root SHALL set `--default-page-header-height` to the
  current header height as a length in CSS pixels
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

- **WHEN** the header shows its collapsed form
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

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` matches
- **THEN** the header SHALL use the one-step change
- **AND** SHALL change form without a fade
- **AND** SHALL still collapse and return to its full form

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

#### Scenario: Header children type

- **WHEN** DefaultPageHeaderProps type is defined
- **THEN** its children SHALL accept React nodes
- **AND** SHALL accept a function that receives `DefaultPageHeaderRenderProps`
  (`{ isCollapsed: boolean }`) and returns React nodes

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
