## ADDED Requirements

### Requirement: Customization ladder page
The docs app SHALL provide one page, "Customize in three steps", in the
Foundations section. The page SHALL be the single owner of the three
customization levels.

#### Scenario: Three levels are defined
- **WHEN** a reader opens `/foundations/customize-in-three-steps`
- **THEN** the page SHALL define level 1 as a Nimbus component with its theming props (`variant`, `size`, `colorPalette`) or parts
- **AND** SHALL define level 2 as a few one-off style props with tokens, marked `nimbus-one-off:`
- **AND** SHALL define level 3 as a layout built with Box, Flex or Stack

#### Scenario: Decision rule
- **WHEN** a reader needs to choose between level 2 and level 3
- **THEN** the page SHALL state that level 3 applies when one element needs more than 3 style props
- **AND** SHALL state that level 3 applies when any layout prop (`display`, `position`, `flexDirection`, `gridTemplate*`) is needed
- **AND** SHALL state that the number 3 is a team rule

#### Scenario: Limits of level 3
- **WHEN** the page describes level 3
- **THEN** it SHALL state that interactive parts stay Nimbus components
- **AND** SHALL state that Box gives no keyboard, focus or ARIA behavior

#### Scenario: Decision questions and example
- **WHEN** the page renders
- **THEN** it SHALL show the decision as numbered questions in the order a reader asks them (the docs app does not render Mermaid)
- **AND** SHALL show one worked example that moves one UI need through all three levels using real Nimbus components and prop names

#### Scenario: Designer section
- **WHEN** the page renders
- **THEN** it SHALL include a short "For designers" section
- **AND** SHALL use the same three level names

### Requirement: Single source for the ladder
Pages that mention the customization levels SHALL link to the ladder page and
SHALL NOT repeat its steps.

#### Scenario: Learn pages link to the ladder
- **WHEN** Rules (rules 4 and 8), Styling, Layout, Component structure, How style props work or "Style one part" describe a customization level
- **THEN** each page SHALL link to `/foundations/customize-in-three-steps`

#### Scenario: Guidelines name the owner
- **WHEN** a maintainer reads `docs/file-type-guidelines/documentation.md`
- **THEN** the Learn Pages section SHALL name the ladder page as the owner of the three levels

### Requirement: Accurate Button customization docs
The Button developer page SHALL list the sizes that the Button recipe provides,
and every one-off example SHALL carry a `nimbus-one-off:` marker.

#### Scenario: Sizes match the recipe
- **WHEN** a reader opens `button.dev.mdx`
- **THEN** the size text SHALL match the sizes in `button.recipe.ts`

#### Scenario: Marked one-offs
- **WHEN** an example uses a raw palette or style value that Nimbus does not offer as a prop
- **THEN** the example SHALL carry a `nimbus-one-off:` comment
