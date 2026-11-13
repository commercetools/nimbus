## ADDED Requirements

### Requirement: Pattern export

The `JsonSnippet` pattern SHALL be exported as a single flat component from
`@commercetools/nimbus`, together with the `JsonSnippetProps` type. It SHALL
live in `packages/nimbus/src/patterns/code/json-snippet/` and be re-exported
through `packages/nimbus/src/patterns/code/index.ts` and
`packages/nimbus/src/patterns/index.ts`.

#### Scenario: Import surface

- **WHEN** a consumer imports from `@commercetools/nimbus`
- **THEN** `JsonSnippet` and the type `JsonSnippetProps` are available

### Requirement: Flat props API

`JsonSnippet` SHALL accept `value` (required, any type) and `indent` (number of
spaces, default `2`), plus every `CodeSnippet` prop except `code` and
`language`. Those props SHALL behave as specified for `CodeSnippet`.

#### Scenario: Indentation

- **WHEN** `value={{ a: 1 }}` and `indent={4}` are set
- **THEN** the shown text is `{\n    "a": 1\n}`

### Requirement: Internal composition

`JsonSnippet` SHALL be built from `CodeSnippet` (or `CodeBlock` parts) with the
language `json`. It MUST NOT define its own recipe or slot components.

#### Scenario: JSON highlighting

- **WHEN** `value={{ name: "x", count: 2 }}` is rendered
- **THEN** the language label is "json" and keys, strings and numbers are
  highlighted

### Requirement: Safe formatting

`JsonSnippet` SHALL format `value` with
`JSON.stringify(value, replacer, indent)` and MUST NOT throw for any value.
Circular references SHALL be shown as the string `"[Circular]"`. `BigInt` values
SHALL be shown as their decimal string. When `JSON.stringify` returns
`undefined` (for example for `undefined` or a function), the snippet SHALL show
the text `undefined`.

#### Scenario: Circular reference

- **WHEN** `value` is an object that contains a reference to itself
- **THEN** the snippet renders, and the self-reference is shown as
  `"[Circular]"`

#### Scenario: BigInt

- **WHEN** `value={{ id: 12345678901234567890n }}` is rendered
- **THEN** the snippet shows `"id": "12345678901234567890"`

#### Scenario: Undefined value

- **WHEN** `value={undefined}` is rendered
- **THEN** the snippet shows `undefined` and does not throw

### Requirement: Copy formatted JSON

The copy and download actions SHALL use the formatted JSON text that is shown.

#### Scenario: Copy

- **WHEN** the user copies a `JsonSnippet` with `value={{ a: 1 }}`
- **THEN** the clipboard contains `{\n  "a": 1\n}`
