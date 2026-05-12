## ADDED Requirements

### Requirement: PublicPageLayout renders a centered vertical layout

The component SHALL render a vertically stacked, horizontally centered layout containing (in order): logo area, welcome heading, main content area, and legal footer area. The layout MUST use Nimbus design tokens for all spacing and sizing.

#### Scenario: Default layout structure

- **WHEN** PublicPageLayout is rendered with `children`
- **THEN** the component renders a centered vertical Flex container with the children in the main content area

#### Scenario: Full layout with all slots populated

- **WHEN** PublicPageLayout is rendered with `logo`, `welcomeMessage`, `children`, and `legalMessage`
- **THEN** the layout displays logo at top, welcome heading below it, children in the middle, and legal message at the bottom

### Requirement: PublicPageLayout accepts a logo prop

The component SHALL accept an optional `logo` prop of type `ReactNode` for rendering a brand logo at the top of the layout. When omitted, the logo area SHALL NOT be rendered.

#### Scenario: Logo is provided

- **WHEN** `logo` is set to a ReactNode (e.g., an image element)
- **THEN** the logo is rendered at the top of the layout inside a container with `data-slot="logo"`

#### Scenario: Logo is omitted

- **WHEN** `logo` is not provided
- **THEN** no logo container is rendered in the layout

### Requirement: PublicPageLayout accepts a welcomeMessage prop

The component SHALL accept an optional `welcomeMessage` prop of type `ReactNode`. When provided as a string, it SHALL render inside a Heading component. When omitted, a default i18n welcome message SHALL be rendered.

#### Scenario: String welcome message

- **WHEN** `welcomeMessage` is set to a string value
- **THEN** the string is rendered inside a Heading element with `data-slot="welcome-message"`

#### Scenario: ReactNode welcome message

- **WHEN** `welcomeMessage` is set to a ReactNode
- **THEN** the ReactNode is rendered inside the welcome message area

#### Scenario: Welcome message omitted

- **WHEN** `welcomeMessage` is not provided
- **THEN** a default i18n welcome message (e.g., "Welcome") is rendered as a Heading

### Requirement: PublicPageLayout accepts a legalMessage prop

The component SHALL accept an optional `legalMessage` prop of type `ReactNode` for rendering legal/footer content at the bottom of the layout. When omitted, the legal footer area SHALL NOT be rendered.

#### Scenario: Legal message is provided

- **WHEN** `legalMessage` is set to a ReactNode
- **THEN** the legal content is rendered at the bottom of the layout inside a container with `data-slot="legal-message"`

#### Scenario: Legal message is omitted

- **WHEN** `legalMessage` is not provided
- **THEN** no legal footer container is rendered

### Requirement: PublicPageLayout supports contentWidth variants

The component SHALL accept a `contentWidth` prop with values `"normal"` or `"wide"`, defaulting to `"normal"`. This prop SHALL control the max-width of the main content area.

#### Scenario: Normal content width (default)

- **WHEN** `contentWidth` is `"normal"` or omitted
- **THEN** the content area has a narrower max-width suitable for form-width content

#### Scenario: Wide content width

- **WHEN** `contentWidth` is `"wide"`
- **THEN** the content area has a wider max-width than the normal variant

### Requirement: PublicPageLayout provides an accessible landmark

The component SHALL render the outer container as a `<main>` element with an `aria-label` attribute. The aria-label SHALL default to an i18n message (e.g., "Public page") and SHALL be overridable via an `aria-label` prop.

#### Scenario: Default landmark label

- **WHEN** PublicPageLayout is rendered without an explicit `aria-label`
- **THEN** the outer `<main>` element has an `aria-label` with the default i18n value

#### Scenario: Custom landmark label

- **WHEN** `aria-label` is provided
- **THEN** the outer `<main>` element uses the provided label instead of the default

### Requirement: PublicPageLayout is exported from @commercetools/nimbus

The component and its types SHALL be exported from the `@commercetools/nimbus` package via the patterns barrel exports.

#### Scenario: Import from package

- **WHEN** a consumer imports `{ PublicPageLayout, type PublicPageLayoutProps }` from `@commercetools/nimbus`
- **THEN** the imports resolve successfully

### Requirement: PublicPageLayout has displayName set

The component SHALL have `displayName` set to `"PublicPageLayout"` for debugging and dev tools.

#### Scenario: displayName is set

- **WHEN** the component is inspected via React DevTools
- **THEN** it displays as "PublicPageLayout"

### Requirement: PublicPageLayout i18n messages follow Nimbus conventions

The component SHALL define i18n source messages in a `.i18n.ts` file following the `Nimbus.PublicPageLayout.{key}` naming convention. Compiled messages SHALL be generated via `pnpm extract-intl`.

#### Scenario: i18n message IDs

- **WHEN** the i18n source file is inspected
- **THEN** all message IDs follow the pattern `Nimbus.PublicPageLayout.{key}`

### Requirement: PublicPageLayout has comprehensive Storybook coverage

Stories SHALL cover: default layout, wide content width, custom logo, with legal message, and minimal layout (children only). Each story SHALL have play functions that verify layout structure and content rendering.

#### Scenario: Stories render without errors

- **WHEN** all stories are rendered in Storybook
- **THEN** no runtime errors occur and play functions pass

### Requirement: PublicPageLayout has documentation

The component SHALL have a `.mdx` file with frontmatter (`menu: [Patterns, Pages, Public page layout]`, `related-components: [Flex, Stack, Heading, Text]`), a `.dev.mdx` file with API reference and escape hatch section, and a `.docs.spec.tsx` file with consumer implementation examples.

#### Scenario: Documentation files exist

- **WHEN** the documentation build runs
- **THEN** PublicPageLayout appears in the docs site under Patterns > Pages > Public page layout
