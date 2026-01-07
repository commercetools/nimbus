# Specification: Nimbus Documentation App

## Purpose

The Nimbus documentation app is a Vite-powered React SPA that provides comprehensive documentation for the Nimbus design system. It features auto-generated API documentation, interactive code examples, full-text search, and multi-view documentation with hot module replacement.

**Framework:** React 18+ with TypeScript (strict mode)
**Build Tool:** Vite v5+ with SWC
**Routing:** React Router v7
**Content:** MDX v3 with runtime evaluation
**App Location:** `/apps/docs`
**Build Package:** `/packages/nimbus-docs-build`

## Requirements

### Requirement: Auto-Generated API Documentation
The system SHALL extract and display TypeScript component APIs.

#### Scenario: Type extraction
- **WHEN** build process runs
- **THEN** SHALL use react-docgen-typescript to parse component exports
- **AND** SHALL filter out HTML/Chakra/React internal props
- **AND** SHALL generate per-component JSON files in src/data/types/
- **AND** SHALL create ~283 type files for all components

#### Scenario: Props table display
- **WHEN** documentation page renders <PropsTable>
- **THEN** SHALL dynamically load component type JSON
- **AND** SHALL display prop names, types, descriptions, default values
- **AND** SHALL support compound components with tabbed interface
- **AND** SHALL categorize props by purpose (base, styling, accessibility)

### Requirement: Interactive Code Examples
The system SHALL provide live code editor with real-time preview.

#### Scenario: Live code rendering
- **WHEN** MDX contains jsx-live or jsx-live-dev fence
- **THEN** SHALL render LiveCodeEditor component
- **AND** SHALL provide React Live scope with all Nimbus components and icons
- **AND** SHALL show preview and code tabs
- **AND** SHALL support real-time editing with instant preview updates

#### Scenario: Code transformation
- **WHEN** code example includes imports
- **THEN** SHALL automatically strip import statements
- **AND** SHALL make components available as globals
- **AND** SHALL provide syntax highlighting with Prism

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

### Requirement: Multi-View Documentation
The system SHALL support multiple documentation perspectives per component.

#### Scenario: Tab-based views
- **WHEN** component has multiple MDX files (button.mdx, button.dev.mdx, button.api.mdx)
- **THEN** SHALL render as separate tabs
- **AND** SHALL use tab-title and tab-order from frontmatter
- **AND** "Overview" tab SHALL default to order 0
- **AND** SHALL preserve tab state in URL

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

## Build System

### Requirement: MDX Processing Pipeline
The system SHALL transform MDX files into route data.

#### Scenario: MDX parsing
- **WHEN** buildMdx runs
- **THEN** SHALL scan packages/nimbus/src for *.mdx files
- **AND** SHALL parse frontmatter with gray-matter
- **AND** SHALL inject test sections via {{docs-tests:}} tokens
- **AND** SHALL generate table of contents with remark-flexible-toc
- **AND** SHALL write per-route JSON to src/data/routes/

#### Scenario: Test section injection
- **WHEN** MDX contains {{docs-tests: filename.docs.spec.ts}}
- **THEN** SHALL extract annotated test code from .docs.spec.ts files
- **AND** SHALL look for @docs-section JSDoc tags in describe() blocks
- **AND** SHALL inject formatted code blocks into MDX at token location

### Requirement: Manifest Generation
The system SHALL create route and navigation manifests.

#### Scenario: Route manifest
- **WHEN** buildManifest runs
- **THEN** SHALL aggregate all parsed documentation
- **AND** SHALL generate src/data/route-manifest.json with routes array
- **AND** SHALL include categories, navigation structure
- **AND** SHALL provide metadata for dynamic routing

#### Scenario: Search index
- **WHEN** buildManifest runs
- **THEN** SHALL generate src/data/search-index.json
- **AND** SHALL extract searchable content from all routes
- **AND** SHALL strip markdown for pure text search

### Requirement: Type Extraction
The system SHALL extract TypeScript types from components.

#### Scenario: Component API extraction
- **WHEN** buildTypes runs
- **THEN** SHALL parse packages/nimbus/src/index.ts
- **AND** SHALL use react-docgen-typescript to extract props
- **AND** SHALL filter unwanted props (HTML, Chakra system props, React internals)
- **AND** SHALL write per-component type files to src/data/types/
- **AND** SHALL generate types manifest

### Requirement: Vite Build Optimization
The system SHALL optimize production bundle.

#### Scenario: Code splitting
- **WHEN** Vite builds for production
- **THEN** SHALL create route-based chunks for lazy loading
- **AND** SHALL create vendor chunks (react, nimbus, icons, mdx, syntax-highlighter)
- **AND** SHALL use hash-based filenames for cache busting
- **AND** SHALL generate static HTML

## Development Experience

### Requirement: Hot Module Replacement
The system SHALL provide instant feedback during development.

#### Scenario: MDX HMR
- **WHEN** developer edits .mdx file
- **THEN** custom vite-plugin-mdx-hmr SHALL detect changes
- **AND** SHALL invalidate affected route modules
- **AND** SHALL trigger Vite HMR update
- **AND** page SHALL update without full reload

#### Scenario: File watcher
- **WHEN** developer runs dev mode
- **THEN** watcher.ts SHALL monitor MDX/TS/TSX files with chokidar
- **AND** SHALL trigger incremental rebuilds on changes
- **AND** SHALL update route JSON files
- **AND** SHALL reload manifest via Vite HMR

### Requirement: File System API
The system SHALL provide REST API for file operations during development.

#### Scenario: CRUD operations
- **WHEN** vite-plugin-fs-api is active
- **THEN** SHALL provide endpoints for reading/writing MDX files
- **AND** SHALL apply rate limiting (1000 requests per 100ms)
- **AND** SHALL validate path traversal attempts
- **AND** SHALL be development-only (not in production)

## Routing and Content Delivery

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

## Special Documentation Components

### Requirement: Token Demonstration Components
The system SHALL provide interactive token demos.

#### Scenario: Color scales
- **WHEN** <ColorScales> renders
- **THEN** SHALL display visual color palette grids
- **AND** SHALL show all color values and names
- **AND** SHALL support light/dark mode previews

#### Scenario: Icon search
- **WHEN** <IconSearch> renders
- **THEN** SHALL display searchable grid of all 2,126 icons
- **AND** SHALL filter by name
- **AND** SHALL copy import statement to clipboard on click

#### Scenario: Token demos
- **WHEN** documentation includes token demonstrations
- **THEN** SHALL provide interactive demos for: spacing, sizing, typography, animations
- **AND** SHALL show visual representations with values

## Content Processing

### Requirement: MDX Runtime Evaluation
The system SHALL compile and evaluate MDX at runtime.

#### Scenario: MDX compilation
- **WHEN** route JSON loads
- **THEN** SHALL use @mdx-js/mdx to compile MDX string
- **AND** SHALL evaluate with React context
- **AND** SHALL provide scope with documentation components
- **AND** SHALL support GFM (GitHub Flavored Markdown) via remark-gfm

#### Scenario: Component injection
- **WHEN** MDX references documentation components
- **THEN** SHALL make available: PropsTable, LiveCodeEditor, ColorScales, IconSearch, NimbusExportsList, CategoryOverview
- **AND** SHALL provide access to all Nimbus components
- **AND** SHALL provide access to all icons

## Package Integration

### Requirement: Nimbus Package Consumption
The system SHALL use Nimbus packages for UI and data.

#### Scenario: Component imports
- **WHEN** app renders
- **THEN** SHALL import UI components from @commercetools/nimbus
- **AND** SHALL import icons from @commercetools/nimbus-icons
- **AND** SHALL use Chakra UI theme from Nimbus

#### Scenario: Build package usage
- **WHEN** build scripts run
- **THEN** SHALL use @commercetools/nimbus-docs-build for parsers and builders
- **AND** SHALL leverage shared schemas and generators
- **AND** SHALL maintain consistent build logic

## Performance Optimization

### Requirement: Lazy Loading
The system SHALL lazy load route content for optimal initial load.

#### Scenario: Route-based splitting
- **WHEN** user navigates
- **THEN** SHALL load only current route JSON chunk
- **AND** SHALL lazy load route-specific vendor code
- **AND** SHALL cache loaded chunks

### Requirement: Asset Optimization
The system SHALL optimize static assets.

#### Scenario: Compression
- **WHEN** production build completes
- **THEN** SHALL apply Gzip compression
- **AND** SHALL apply Brotli compression
- **AND** SHALL generate optimized images

## Deployment

### Requirement: Static Site Generation
The system SHALL produce deployable static assets.

#### Scenario: Build artifacts
- **WHEN** `pnpm build:docs` completes
- **THEN** SHALL output static HTML/CSS/JS to dist/
- **AND** SHALL include all pre-generated route JSON
- **AND** SHALL include component type files
- **AND** SHALL include search index
- **AND** SHALL generate robots.txt and sitemap.xml
