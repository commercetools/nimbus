## ADDED Requirements

### Requirement: Pattern export

The `CodeSnippetGroup` pattern SHALL be exported as a single flat component from
`@commercetools/nimbus`, together with the `CodeSnippetGroupProps` and
`CodeSnippetGroupItem` types. It SHALL live in
`packages/nimbus/src/patterns/code/code-snippet-group/` and be re-exported
through `packages/nimbus/src/patterns/code/index.ts` and
`packages/nimbus/src/patterns/index.ts`.

#### Scenario: Import surface

- **WHEN** a consumer imports from `@commercetools/nimbus`
- **THEN** `CodeSnippetGroup` and the types `CodeSnippetGroupProps` and
  `CodeSnippetGroupItem` are available

### Requirement: Flat props API

`CodeSnippetGroup` SHALL accept `items` (required), where each item is
`{ key: string; label: string; code: string; language?: string; fileName?: string }`,
and these props: `switcher` (`"tabs"` or `"select"`, default `"tabs"`),
`selectedKey`, `defaultSelectedKey`, `onSelectionChange`, `title`, `aria-label`,
`switcherLabel`, `showCopyButton` (default `true`), `showLineNumbers`,
`wrapLongLines`, `maxLines`, `size`, `onCopy`, and style props for the root
element. `onCopy` SHALL receive the key of the copied item.

#### Scenario: First item selected by default

- **WHEN** a group with items `curl`, `js`, `java` is rendered without
  `selectedKey` or `defaultSelectedKey`
- **THEN** the `curl` item's code is shown

### Requirement: Internal composition

`CodeSnippetGroup` SHALL be built only from `CodeBlock` parts and the Nimbus
`Tabs` or `Select` components. It MUST NOT define its own recipe or slot
components.

#### Scenario: No own styling layer

- **WHEN** the pattern folder is inspected
- **THEN** it contains no `.recipe.ts` and no `.slots.tsx` file

### Requirement: Tabs switcher

With `switcher="tabs"`, the group SHALL render one tab per item, labelled with
the item `label`, and a tab panel that shows the selected item's code with the
item's `language`. Keyboard behavior SHALL follow the Nimbus `Tabs` component:
arrow keys move between tabs, and Tab moves focus from the tab list to the next
focusable element.

#### Scenario: Switching with the keyboard

- **WHEN** focus is on the first tab and the user presses the right arrow key
- **THEN** the second tab is selected, its code is shown, and
  `onSelectionChange` is called with the second item's key

### Requirement: Select switcher

With `switcher="select"`, the group SHALL render a Nimbus `Select` with one
option per item. The select SHALL have an accessible name: `switcherLabel` if
set, otherwise the localized default "Code example".

#### Scenario: Switching with the select

- **WHEN** the user opens the select and chooses "Java"
- **THEN** the Java item's code is shown with its language

#### Scenario: Accessible name of the select

- **WHEN** no `switcherLabel` is set
- **THEN** the select's accessible name is "Code example" in the `en` locale

### Requirement: Single item

When `items` contains exactly one item, the group SHALL NOT render a switcher
and SHALL show that item.

#### Scenario: One item

- **WHEN** a group has one item
- **THEN** no tab list and no select is rendered, and the item's code is shown

### Requirement: Actions follow the selected item

The copy button SHALL copy the selected item's code. A download button SHALL be
shown only when the selected item has a `fileName`, and SHALL download that
item's code under that file name. The language label SHALL show the selected
item's language.

#### Scenario: Copy the selected item

- **WHEN** the `js` item is selected and the user activates the copy button
- **THEN** the clipboard contains the `js` item's code and `onCopy` is called
  with `"js"`

#### Scenario: Download depends on the item

- **WHEN** the selected item has `fileName: "client.env"`
- **THEN** a download button is shown and downloads `client.env`
- **AND WHEN** an item without `fileName` is selected
- **THEN** no download button is shown

### Requirement: Controlled selection

The selected item SHALL be controllable with `selectedKey` and
`onSelectionChange`, and uncontrolled with `defaultSelectedKey`, with the same
semantics as Nimbus `Tabs`.

#### Scenario: Controlled group

- **WHEN** `selectedKey="java"` is set and the user selects another item
- **THEN** `onSelectionChange` is called with the new key and the Java item
  stays shown until the parent updates `selectedKey`
