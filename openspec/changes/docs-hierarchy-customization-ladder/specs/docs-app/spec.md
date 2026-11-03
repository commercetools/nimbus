## MODIFIED Requirements

### Requirement: Navigation System
The system SHALL provide comprehensive navigation structure.

#### Scenario: Sidebar navigation
- **WHEN** user views documentation
- **THEN** SHALL display collapsible sidebar with category-based organization
- **AND** SHALL highlight current route
- **AND** SHALL support keyboard navigation

#### Scenario: Breadcrumbs
- **WHEN** user views any page
- **THEN** SHALL display breadcrumb trail from menu frontmatter array
- **AND** SHALL link to parent pages
- **AND** SHALL display deepest → root order

#### Scenario: Table of contents
- **WHEN** page renders
- **THEN** SHALL auto-generate TOC from h2 and h3 headings
- **AND** SHALL provide anchor links
- **AND** SHALL highlight current section on scroll

#### Scenario: Top-level sections
- **WHEN** the top bar renders
- **THEN** Learn SHALL be its own top-level section
- **AND** Foundations SHALL contain the customization ladder page, Design Tokens and Style Props
- **AND** Contribute SHALL be its own top-level section containing Development Setup, Collaboration, Release Process and ADRs

#### Scenario: Menu and URL agree
- **WHEN** a page appears in a top-level section
- **THEN** its `menu` frontmatter SHALL start with that section name
- **AND** its URL and breadcrumb SHALL start with that section

### Requirement: Dynamic Route Resolution
The system SHALL use single catch-all route for all content.

#### Scenario: Route matching
- **WHEN** user navigates to any path
- **THEN** single dynamic route (`*`) SHALL handle all paths
- **AND** SHALL lookup route in manifest by path
- **AND** SHALL load corresponding route JSON
- **AND** SHALL render with DocumentRenderer component

#### Scenario: Menu-to-path conversion
- **WHEN** MDX frontmatter includes menu array
- **THEN** menu SHALL convert to URL path
- **AND** example: `["Components", "Inputs", "Button"]` → `/components/inputs/button`

#### Scenario: Prefix redirects for moved sections
- **WHEN** user opens a path that starts with `home/design-tokens` or `home/style-props`
- **THEN** the system SHALL redirect to the same path under `foundations/`
- **AND** SHALL redirect `home/getting-started/collaboration` and `home/getting-started/release-process` to their Contribute paths
- **AND** SHALL keep the rest of the path and any hash

### Requirement: Full-Text Search
The system SHALL provide keyboard-accessible search.

#### Scenario: Search index generation
- **WHEN** build process runs
- **THEN** SHALL generate src/data/search-index.json with all routes
- **AND** SHALL include title, description, content, tags for each route
- **AND** SHALL strip markdown formatting for searchable content

#### Scenario: Search interaction
- **WHEN** user presses Cmd+K or clicks search
- **THEN** SHALL open accessible ComboBox with Fuse.js fuzzy search
- **AND** SHALL search across titles, descriptions, tags, and content
- **AND** SHALL highlight matching text
- **AND** SHALL navigate to selected route

#### Scenario: Categories follow the menu
- **WHEN** a Design Tokens page appears in search results
- **THEN** its category SHALL come from `menu` starting with `Foundations` and `Design Tokens`
- **AND** no category SHALL depend on a special case for a moved section

## ADDED Requirements

### Requirement: MCP route compatibility
The MCP docs tools SHALL accept the new Foundations routes and the old
`home/design-tokens` and `home/style-props` routes.

#### Scenario: Old route
- **WHEN** a client calls `get_docs_page` with `home/style-props`
- **THEN** the tool SHALL return the page at `foundations/style-props`

#### Scenario: New route
- **WHEN** a client calls `get_docs_page` with `foundations/style-props`
- **THEN** the tool SHALL return the same page
