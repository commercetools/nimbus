## ADDED Requirements

### Requirement: Pattern export

The `CodeSnippet` pattern SHALL be exported as a single flat component (not a
compound namespace) from `@commercetools/nimbus`, together with the
`CodeSnippetProps` type. It SHALL live in
`packages/nimbus/src/patterns/code/code-snippet/` and be re-exported through
`packages/nimbus/src/patterns/code/index.ts` and
`packages/nimbus/src/patterns/index.ts`.

#### Scenario: Import surface

- **WHEN** a consumer imports from `@commercetools/nimbus`
- **THEN** `CodeSnippet` and the type `CodeSnippetProps` are available

### Requirement: Flat props API

`CodeSnippet` SHALL accept these props: `code` (required), `language`, `title`,
`showLanguage` (default `true`), `showCopyButton` (default `true`),
`downloadFileName`, `showLineNumbers`, `startLineNumber`, `highlightedLines`,
`addedLines`, `removedLines`, `highlightedWords`, `wrapLongLines`, `maxLines`,
`defaultExpanded`, `size`, `aria-label`, `onCopy`, `footer`, and style props for
the root element. Each prop with the same name as a `CodeBlock` prop SHALL
behave as specified for `CodeBlock`.

#### Scenario: Minimal usage

- **WHEN** `<CodeSnippet code={src} language="tsx" />` is rendered
- **THEN** a highlighted code region is shown with a header that contains the
  language label "tsx" and a copy button

#### Scenario: Line options are forwarded

- **WHEN** `showLineNumbers`, `startLineNumber={42}` and
  `highlightedLines={[43]}` are set
- **THEN** the numbers start at 42 and the line numbered 43 is highlighted

### Requirement: Internal composition

`CodeSnippet` SHALL be built only from `CodeBlock` parts. It MUST NOT define its
own recipe or slot components; all styling SHALL come from the `CodeBlock`
recipe.

#### Scenario: No own styling layer

- **WHEN** the pattern folder is inspected
- **THEN** it contains no `.recipe.ts` and no `.slots.tsx` file

### Requirement: Header and action placement

`CodeSnippet` SHALL render a `CodeBlock.Header` when `title` is set or
`showLanguage` is `true`. The header SHALL contain the title (if set), the
language label (if shown), and the actions. When no header is rendered, the
actions SHALL float inside `CodeBlock.Content`. When neither the copy button nor
the download button is shown, no actions container SHALL be rendered.

#### Scenario: Title and language

- **WHEN** `title="button.tsx"` and `language="tsx"` are set
- **THEN** the header shows "button.tsx" and the language label "tsx", and the
  region's accessible name is "button.tsx"

#### Scenario: No header, floating copy

- **WHEN** `showLanguage={false}` is set and no `title` is set
- **THEN** no header is rendered and the copy button floats in the top-end
  corner of the code area

#### Scenario: No actions

- **WHEN** `showCopyButton={false}` is set and `downloadFileName` is not set
- **THEN** no copy button, download button or empty actions container is
  rendered

### Requirement: Download and footer

`CodeSnippet` SHALL show a `CodeBlock.DownloadTrigger` only when
`downloadFileName` is set, using it as the file name. When `footer` is set, it
SHALL be rendered inside `CodeBlock.Footer` below the code.

#### Scenario: Download button

- **WHEN** `downloadFileName="client.env"` is set
- **THEN** a download button is shown, and activating it downloads `client.env`
  with the code as content

#### Scenario: Footer content

- **WHEN** `footer={<Link href={url}>View on GitHub</Link>}` is set
- **THEN** the link is rendered below the code

### Requirement: Collapsible snippet

When `maxLines` is set and the code has more lines, `CodeSnippet` SHALL render a
`CodeBlock.ExpandTrigger` below the code, starting collapsed unless
`defaultExpanded` is `true`.

#### Scenario: Long snippet starts collapsed

- **WHEN** a 40-line snippet has `maxLines={12}`
- **THEN** 12 lines and a "Show more" button are rendered
