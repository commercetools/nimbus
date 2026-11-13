## ADDED Requirements

### Requirement: Resource link front matter fields
The front matter schema SHALL accept the optional fields `storybookLink` and
`githubLink`, next to the existing `figmaLink`. Each value SHALL be an absolute
URL.

#### Scenario: Valid links
- **WHEN** a document sets `storybookLink` and `githubLink` to absolute URLs
- **THEN** the build SHALL accept the document

#### Scenario: Invalid link
- **WHEN** a document sets one of the fields to a value that is not an absolute URL
- **THEN** the build SHALL fail and name the document and the field

#### Scenario: Both schema copies agree
- **WHEN** the docs build schema and the docs app schema parse the same front matter
- **THEN** both SHALL accept and reject the same values

### Requirement: Resource links in the header
The page header SHALL show one link button for each of `figmaLink`,
`storybookLink` and `githubLink` that the page sets, in this order: Figma,
Storybook, GitHub.

#### Scenario: Links are shown
- **WHEN** a page sets `figmaLink` and `githubLink`
- **THEN** the header SHALL show two link buttons, Figma first
- **AND** each button SHALL open its URL in a new tab with `rel="noopener noreferrer"`
- **AND** each button SHALL tell assistive technology that it opens in a new tab

#### Scenario: No links
- **WHEN** a page sets none of the three fields
- **THEN** the header SHALL NOT show an empty link row

### Requirement: Component pages have links
Every component page SHALL set `githubLink`. Every component page whose component
has stories SHALL also set `storybookLink`.

#### Scenario: GitHub link
- **WHEN** a component page is built
- **THEN** its `githubLink` SHALL point to the component folder in the
  `commercetools/nimbus` repository

#### Scenario: Storybook link
- **WHEN** a component page is built and its component has stories
- **THEN** its `storybookLink` SHALL point to the stories of that component in
  the published Storybook

#### Scenario: Component without stories
- **WHEN** a component has no stories (Code, Flex, Heading, Image, Kbd, List,
  Table and Text at the time of writing)
- **THEN** its page SHALL NOT set `storybookLink`
