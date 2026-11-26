## ADDED Requirements

### Requirement: Page header
The docs app SHALL show a header at the top of every page with the `app-frame`
layout. The header SHALL contain the page title, the lifecycle badge (when the
page has a `lifecycleState`), the description, and the resource links. The
header SHALL NOT show tags.

#### Scenario: Component page with an illustration
- **WHEN** a component page is shown and an illustration exists for the component
- **THEN** the header SHALL show the illustration on the right of the title and description
- **AND** the illustration SHALL be hidden from assistive technology

#### Scenario: Page without an illustration
- **WHEN** a page is shown and no illustration exists for it
- **THEN** the header SHALL show the title and description over the full content width
- **AND** SHALL NOT leave an empty area on the right

#### Scenario: Tags
- **WHEN** a page has `tags` in its front matter
- **THEN** the header SHALL NOT show them
- **AND** the search index SHALL still contain them

#### Scenario: Wide and no-sidebar layouts
- **WHEN** a page uses the `wide` or `no-sidebar` layout
- **THEN** the page SHALL keep its current header behavior

#### Scenario: Narrow screens
- **WHEN** the viewport is narrower than the `md` breakpoint
- **THEN** the header SHALL hide the illustration
- **AND** SHALL show the title first

### Requirement: Underline view tabs
The docs app SHALL show the views of a page (for example Overview, Guidelines,
Implementation, Accessibility) as left-aligned underline tabs when the page has
more than one view. Each tab SHALL be as wide as its label.

#### Scenario: Active tab
- **WHEN** a view is active
- **THEN** its tab SHALL show an underline indicator
- **AND** the indicator SHALL move to a newly selected tab
- **AND** the indicator SHALL NOT animate when the user prefers reduced motion

#### Scenario: Sticky behavior is kept
- **WHEN** the reader scrolls down the page
- **THEN** the tab bar SHALL hide as it does today
- **AND** SHALL show again when the reader scrolls up

#### Scenario: URL state is kept
- **WHEN** a tab is selected
- **THEN** the URL SHALL contain the view key as it does today

### Requirement: Duplicate view heading
The docs app SHALL hide the first `h2` of a view when its text equals the label
of the active tab (compared without case). The heading SHALL stay in the page
for assistive technology and keep its anchor.

#### Scenario: Heading matches the tab label
- **WHEN** the "Overview" tab is active and the view starts with `## Overview`
- **THEN** the heading SHALL NOT be visible
- **AND** SHALL stay available to screen readers

#### Scenario: Heading does not match
- **WHEN** the first `h2` of a view has a different text than the tab label
- **THEN** the heading SHALL be shown as normal

#### Scenario: Table of contents
- **WHEN** the first `h2` is hidden by this rule
- **THEN** the table of contents SHALL NOT list it
- **AND** SHALL list its `h3` children at the top level
- **AND** SHALL move deeper entries below it up by one level

### Requirement: Related components carousel
The docs app SHALL show the related components of a page as a carousel between
the header and the view tabs, on every view.

#### Scenario: Position
- **WHEN** a page has related components
- **THEN** the carousel SHALL appear below the header and above the view tabs
- **AND** SHALL NOT appear when the page has none

#### Scenario: Scrolling
- **WHEN** the cards are wider than the page
- **THEN** the reader SHALL be able to scroll sideways, with previous and next buttons
- **AND** each button SHALL be disabled at its end of the list
- **AND** scrolling SHALL NOT animate when the user prefers reduced motion

### Requirement: One scroll area
The content and the table of contents SHALL scroll together in one scroll area.
The table of contents SHALL stay in view while the page scrolls.

#### Scenario: View tabs position
- **WHEN** the view tabs are stuck
- **THEN** they SHALL sit directly under the top bars, with no gap above them

### Requirement: Content width
The page SHALL fill its column. Paragraphs and lists SHALL be limited to `80ch`.

#### Scenario: Page fills its column
- **WHEN** a documentation page is shown
- **THEN** the page content SHALL fill the width of its column

#### Scenario: Line length of text
- **WHEN** a paragraph or a list is shown
- **THEN** its width SHALL be limited to `80ch`

### Requirement: Type hierarchy
The docs app SHALL render the headings and text of a page with a clear size
order: `h2` larger than `h3`, `h3` larger than `h4`, and `h4` larger than body
text. Body text SHALL use a 16px font size and a line height of 1.6.

#### Scenario: Space above sections
- **WHEN** an `h2` follows other content
- **THEN** the space above the `h2` SHALL be larger than the space above an `h3`

#### Scenario: Rule under h2 only
- **WHEN** a page shows headings of several levels
- **THEN** only `h2` SHALL have a rule under it

#### Scenario: Line length
- **WHEN** body text is shown in the content column
- **THEN** a line SHALL NOT be longer than about 80 characters

### Requirement: Short table of contents
The table of contents SHALL list the `h2` headings of the page. It SHALL also
list the `h3` headings of the section that contains the active heading. It SHALL
keep the colored active marker.

#### Scenario: Section is active
- **WHEN** the active heading is an `h3`, or an `h2` that has `h3` children
- **THEN** the `h3` entries of that section SHALL be listed under their `h2`

#### Scenario: Other sections
- **WHEN** a section does not contain the active heading
- **THEN** its `h3` entries SHALL NOT be listed

#### Scenario: Reader jumps to an entry
- **WHEN** the reader selects an entry
- **THEN** the page SHALL scroll to the heading as it does today
- **AND** the entry SHALL become active
