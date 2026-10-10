## ADDED Requirements

### Requirement: Pattern export

The `CommandSnippet` pattern SHALL be exported as a single flat component from
`@commercetools/nimbus`, together with the `CommandSnippetProps` type. It SHALL
live in `packages/nimbus/src/patterns/code/command-snippet/` and be re-exported
through `packages/nimbus/src/patterns/code/index.ts` and
`packages/nimbus/src/patterns/index.ts`.

#### Scenario: Import surface

- **WHEN** a consumer imports from `@commercetools/nimbus`
- **THEN** `CommandSnippet` and the type `CommandSnippetProps` are available

### Requirement: Flat props API

`CommandSnippet` SHALL accept `command` (required), `language` (default
`"bash"`), `prompt` (default `"$"`; an empty string shows no prompt),
`outputLines`, `showCopyButton` (default `true`), `wrapLongLines`, `size`,
`aria-label`, `onCopy`, and style props for the root element.

#### Scenario: One-line command

- **WHEN** `<CommandSnippet command="pnpm add @commercetools/nimbus" />` is
  rendered
- **THEN** the command is shown with a `$` prompt and a copy button, and no
  header

#### Scenario: No prompt

- **WHEN** `prompt=""` is set
- **THEN** no prompt is shown

### Requirement: Internal composition

`CommandSnippet` SHALL be built only from `CodeBlock` parts: `Root`, `Content`
with the `prompt` and `outputLines` options, and `Actions` with a `CopyTrigger`
placed inside `Content`. It MUST NOT render a `CodeBlock.Header` and MUST NOT
define its own recipe or slot components.

#### Scenario: Floating copy button

- **WHEN** the snippet is rendered
- **THEN** the copy button is inside the code area in the top-end corner and
  does not cover the command text

### Requirement: Copy without prompts

The copy action SHALL copy exactly the `command` string, without prompts.

#### Scenario: Multi-line command with output

- **WHEN** `command="npm whoami\nalice"` and `outputLines={[2]}` are set
- **THEN** line 1 shows the `$` prompt, line 2 shows no prompt, and copying puts
  `npm whoami\nalice` on the clipboard

### Requirement: Accessible name

The region's accessible name SHALL be the `aria-label` prop, or else the
localized default "Command".

#### Scenario: Default name

- **WHEN** no `aria-label` is set
- **THEN** the region's accessible name is "Command" in the `en` locale
