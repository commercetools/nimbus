# Spec Delta

## Purpose

Gives every Nimbus component, derivative and pattern one consistent SVG illustration that docs pages can show, and keeps those illustrations complete, current and safe to inline.

## ADDED Requirements

### Requirement: Illustration Coverage

Every folder under `packages/nimbus/src/components` and `packages/nimbus/src/patterns` that has a main doc page `<dir>/<dir-name>.mdx` SHALL have an illustration source.

#### Scenario: Required folder has a source

- **WHEN** a folder has a main doc page
- **THEN** it SHALL contain `<name>.illustration.ts`
- **AND** the illustration's `name` SHALL equal the folder name

#### Scenario: Orphan files

- **WHEN** an illustration file exists in a folder without a main doc page
- **THEN** the unit test SHALL fail

### Requirement: Visual Language

All illustrations SHALL use a 96×96 canvas, a 4-unit grid, centered content with an 8-unit margin, and Nimbus radius tokens divided by 4.

#### Scenario: Geometry limits

- **WHEN** an illustration is rendered
- **THEN** its shapes (excluding the cursor) SHALL stay inside 8–88 on both axes
- **AND** their bounding-box center SHALL be within 2 units of (48, 48)
- **AND** the file SHALL be at most 8 KB

#### Scenario: Text is drawn as bars

- **WHEN** an illustration shows text
- **THEN** it SHALL use round-ended bars and SHALL NOT use `<text>`

### Requirement: Theme-Aware Colors

Illustrations SHALL take every color from the Nimbus color palette in scope through CSS variables, with a fallback value, and SHALL adapt to dark mode.

#### Scenario: Palette inheritance

- **WHEN** an illustration is inlined inside an element with `colorPalette` set
- **THEN** its colors SHALL follow that palette

#### Scenario: Dark mode

- **WHEN** an ancestor has `color-scheme: dark`
- **THEN** roles that need a different step in dark mode SHALL use the dark step

#### Scenario: No variables available

- **WHEN** the SVG is shown without the page's variables (for example through `<img>`)
- **THEN** it SHALL render with the fallback colors

### Requirement: Sanitizer-Safe Output

Rendered SVGs SHALL survive the `InlineSvg` sanitizer without change.

#### Scenario: Restricted markup

- **WHEN** an SVG is rendered from a source
- **THEN** it SHALL use only `svg`, `defs`, `linearGradient`, `stop`, `filter`, `feDropShadow`, `g`, `rect`, `circle`, `line` and `path`
- **AND** it SHALL NOT contain `style`, `class` or external `href`
- **AND** every id SHALL be unique and start with `il-<name>-`

#### Scenario: Sanitizer parity

- **WHEN** the SVG is passed through the `InlineSvg` sanitizer
- **THEN** the resulting tree SHALL equal the input tree

### Requirement: Source Only

Only the illustration source SHALL be committed. The docs build and the docs dev server SHALL render the SVGs from the sources into a gitignored folder.

#### Scenario: Committed SVG

- **WHEN** an `*.illustration.svg` file exists in a component or pattern folder
- **THEN** the unit test SHALL fail

#### Scenario: Docs build

- **WHEN** the docs are built
- **THEN** one SVG per illustration source SHALL be rendered before the route manifest is used
- **AND** SVGs of removed components SHALL be deleted

### Requirement: Source Purity

Illustration sources SHALL use only the drawing kit and role names.

#### Scenario: Source purity

- **WHEN** an illustration source is checked
- **THEN** it SHALL import only from the illustration kit and use only role names, never raw colors or markup

### Requirement: Not Published

The drawing kit and illustration files SHALL NOT be part of the published npm package.

#### Scenario: Build output

- **WHEN** the package is built
- **THEN** the output SHALL contain no file with `illustration` in its name
