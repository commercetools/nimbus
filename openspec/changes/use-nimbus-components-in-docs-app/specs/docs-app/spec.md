## MODIFIED Requirements

### Requirement: Navigation System
The system SHALL provide comprehensive navigation structure.

#### Scenario: Sidebar navigation
- **WHEN** user views documentation
- **THEN** SHALL display collapsible sidebar with category-based organization
- **AND** SHALL highlight current route
- **AND** SHALL support keyboard navigation
- **AND** SHALL restore the sidebar scroll position after navigation

#### Scenario: Breadcrumbs
- **WHEN** user views any page
- **THEN** SHALL display breadcrumb trail from menu frontmatter array using the Nimbus `Breadcrumbs` component
- **AND** SHALL link to parent pages
- **AND** SHALL display root → deepest order, starting with Home
- **AND** SHALL keep showing the previous trail while the next route loads
- **AND** SHALL provide a "Copy link" button that is visible on hover and on keyboard focus

#### Scenario: Table of contents
- **WHEN** page renders
- **THEN** SHALL auto-generate TOC from h2 and h3 headings
- **AND** SHALL provide anchor links
- **AND** SHALL highlight current section on scroll

## ADDED Requirements

### Requirement: Nimbus Components In The App UI
The system SHALL use a Nimbus component in its own UI wherever a Nimbus component matches the need, instead of hand-built markup.

#### Scenario: Loading placeholder with a known shape
- **WHEN** the content area or the table of contents is loading and its layout is known
- **THEN** SHALL show the Nimbus `Skeleton` component as the placeholder
- **AND** SHALL use the same width as the final content to avoid layout shift

#### Scenario: Loading with an unknown shape
- **WHEN** a loading area has no fixed shape
- **THEN** MAY show the Nimbus `LoadingSpinner` component

#### Scenario: Semantic search model download
- **WHEN** semantic search is downloading its model
- **THEN** SHALL show the Nimbus `ProgressBar` component with the download percentage
- **AND** SHALL keep a text label that screen readers can read

#### Scenario: Components without a natural place
- **WHEN** a Nimbus component has no matching need in the app
- **THEN** SHALL NOT add UI only to use that component
