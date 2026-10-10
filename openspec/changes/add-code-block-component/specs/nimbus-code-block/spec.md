## ADDED Requirements

### Requirement: Compound component export

`CodeBlock` SHALL be exported from `@commercetools/nimbus` as a compound
component namespace object whose first property is `Root`. The namespace SHALL
contain exactly these parts: `Root`, `Header`, `Title`, `LanguageLabel`,
`Actions`, `CopyTrigger`, `DownloadTrigger`, `Content`, `ExpandTrigger`,
`Footer`. `CodeBlock` itself MUST NOT be renderable as a component. The main
file `code-block.tsx` SHALL contain exports only, and the parts SHALL be
implemented in `packages/nimbus/src/components/code-block/components/`.

#### Scenario: Import surface

- **WHEN** a consumer imports from `@commercetools/nimbus`
- **THEN** `CodeBlock`, `CodeHighlighterProvider`, `createPrismHighlighter` and
  `defaultCodeLanguages` are exported
- **AND** the types `CodeBlockRootProps`, `CodeBlockContentProps`,
  `CodeHighlighter`, `CodeToken`, `CodeLine`, `CodeLineSelection` and
  `CodeLanguageDefinition` are exported

#### Scenario: Root is the first property

- **WHEN** the keys of the `CodeBlock` object are listed in order
- **THEN** the first key is `Root`

#### Scenario: Parts render only inside Root

- **WHEN** any part other than `Root` is rendered outside a `CodeBlock.Root`
- **THEN** it throws an error that names the part and says it must be used
  inside `CodeBlock.Root`

### Requirement: Highlighter interface

A `CodeHighlighter` SHALL provide `resolveLanguage(language)`, which returns a
canonical language id or `undefined`, and `highlight(code, language)`, which
returns either an array of lines or a Promise of that array. Each line SHALL be
an array of tokens `{ content, types }`. No token `content` SHALL contain a line
break, and the concatenated `content` of line _i_ SHALL equal line _i_ of the
input code.

#### Scenario: Multi-line token is split per line

- **WHEN** the default highlighter highlights a JavaScript block comment that
  spans three lines
- **THEN** the result has one token per line for the comment, each with type
  `comment`, and no token contains a line break

#### Scenario: Lines reproduce the input

- **WHEN** any supported code string is highlighted
- **THEN** joining the token contents of each line, and joining the lines with
  `\n`, reproduces the normalized input exactly

### Requirement: Default Prism highlighter

`createPrismHighlighter()` SHALL return a synchronous `CodeHighlighter` backed
by `refractor` with these languages: tsx, typescript, javascript, jsx, json,
css, markup, bash, yaml, graphql, diff, sql, markdown, http. It SHALL resolve
these aliases: `ts`→typescript, `js`→javascript, `html`/`xml`/`svg`→markup,
`sh`/`shell`/`zsh`/`console`/`terminal`/`curl`→bash, `yml`→yaml, `md`→markdown,
`gql`→graphql. The values `plaintext`, `text` and `txt` SHALL mean "no
highlighting". `defaultCodeLanguages` SHALL list the default language ids.

#### Scenario: Shell code is highlighted

- **WHEN** `code="npm install --save foo # note"` is rendered with
  `language="bash"`
- **THEN** the output contains at least one token with a non-plain type (for
  example `function` or `comment`)

#### Scenario: Alias resolves to a language

- **WHEN** `language="sh"` is used
- **THEN** the code is highlighted with the bash grammar

#### Scenario: Unknown or plain language renders plain text

- **WHEN** `language` is `"plaintext"`, omitted, or an unsupported value such as
  `"brainfuck"`
- **THEN** the code renders as plain text without throwing or logging an error

### Requirement: Adding languages and aliases

`createPrismHighlighter` SHALL accept `additionalLanguages` (refractor language
definitions) and `aliases` (alias → language id). Each call SHALL create an
independent highlighter: registering a language on one highlighter MUST NOT
change any other highlighter or any global object.

#### Scenario: Additional language is highlighted

- **WHEN** a highlighter is created with `additionalLanguages: [java]` and
  provided to a `CodeBlock.Root` with `language="java"`
- **THEN** the Java code is highlighted

#### Scenario: Highlighters are isolated

- **WHEN** one highlighter is created with `additionalLanguages: [java]` and a
  second one without it
- **THEN** the second highlighter's `resolveLanguage("java")` returns
  `undefined`

### Requirement: Highlighter provider

Every `CodeBlock.Root` SHALL use the highlighter from the nearest
`CodeHighlighterProvider`. Without a provider, it SHALL use a shared default
Prism highlighter. `CodeHighlighterProvider` MUST NOT render a DOM element.

#### Scenario: Default without provider

- **WHEN** `CodeBlock.Root` is rendered without a `CodeHighlighterProvider`
- **THEN** code in a default language is highlighted

#### Scenario: Provider overrides the default

- **WHEN** a `CodeHighlighterProvider` with a custom highlighter wraps a
  `CodeBlock.Root`
- **THEN** that block uses the custom highlighter's tokens

### Requirement: Asynchronous highlighters

When `highlight` returns a Promise, `CodeBlock.Content` SHALL render the code as
plain text until the Promise resolves, then render the highlighted tokens. If
`code` or `language` changes before the Promise resolves, the outdated result
MUST NOT be rendered. While a new result is pending, the last highlighted result
for the same block SHALL stay visible.

#### Scenario: Plain text while pending

- **WHEN** a provided highlighter returns a Promise that has not resolved
- **THEN** the full code text is visible as plain text

#### Scenario: Outdated result is discarded

- **WHEN** `code` changes from A to B while the Promise for A is still pending,
  and the Promise for A resolves after the one for B
- **THEN** the block shows the tokens for B

### Requirement: Read-only and safe rendering

`CodeBlock` SHALL be read-only: it MUST NOT accept text input, MUST NOT be
`contentEditable`, and MUST NOT expose a disabled state. Tokens SHALL be
rendered as React text nodes; the component MUST NOT use
`dangerouslySetInnerHTML`.

#### Scenario: Visible text equals the code

- **WHEN** `<CodeBlock.Root code={src} language="tsx">` with `CodeBlock.Content`
  is rendered
- **THEN** the text content of the `code` element equals `src` without its
  trailing line break, and line numbers, prompts and markers are excluded from
  that comparison

#### Scenario: Untrusted code is not turned into markup

- **WHEN** `code` is `<img src=x onerror=alert(1)>`
- **THEN** the text is shown as code and no `img` element is created

#### Scenario: Empty code

- **WHEN** `code` is an empty string
- **THEN** the block renders without errors with an empty `pre`

### Requirement: Token-driven theming

All visual treatment SHALL come from the `nimbusCodeBlock` slot recipe and
design tokens. Token types SHALL be exposed as classes on token elements and
mapped to namespaced CSS custom properties (`--code-token-*`) in the recipe,
with light defaults and `_dark` overrides. The component MUST NOT render inline
`style` attributes for token colors and MUST NOT contain raw color, pixel or
spacing values in its logic. The recipe SHALL offer `size` `sm` and `md`
(default `md`).

#### Scenario: No inline token styles

- **WHEN** highlighted code is rendered
- **THEN** no token element has a `style` attribute

#### Scenario: Dark mode changes only resolved colors

- **WHEN** the color mode switches to dark
- **THEN** token and surface colors resolve to the dark values and the DOM
  structure does not change

#### Scenario: Size variant

- **WHEN** `size="sm"` is set on `CodeBlock.Root`
- **THEN** font size and padding are smaller than with `size="md"`, with no
  change in behavior

### Requirement: Region and accessible name

`CodeBlock.Root` SHALL render a `section` with `role="region"`. Its accessible
name SHALL be, in this order: the `aria-label` prop; else the text of
`CodeBlock.Title` through `aria-labelledby`; else the localized default "Code
block". The `code` element MUST NOT have an accessible name.
`CodeBlock.LanguageLabel` SHALL be `aria-hidden="true"`.

#### Scenario: Title names the region

- **WHEN** a block contains `<CodeBlock.Title>button.tsx</CodeBlock.Title>` and
  Root has no `aria-label`
- **THEN** the region's accessible name is "button.tsx"

#### Scenario: aria-label wins over the title

- **WHEN** Root has `aria-label="Example"` and a `Title` is present
- **THEN** the region's accessible name is "Example"

#### Scenario: Localized default name

- **WHEN** neither `aria-label` nor `Title` is present
- **THEN** the region's accessible name is "Code block" in the `en` locale

#### Scenario: Code element has no name and label is hidden

- **WHEN** the block renders a `LanguageLabel` and `Content`
- **THEN** the `code` element has no `aria-label` or `aria-labelledby`
- **AND** the language label has `aria-hidden="true"`

### Requirement: Keyboard access and focus order

The `pre` rendered by `CodeBlock.Content` SHALL have `tabIndex={0}` so that
overflowing code can be scrolled with the keyboard (WCAG 2.1.1). No other
non-interactive part SHALL have a `tabIndex`. Focus order SHALL follow DOM
order. Every trigger SHALL be operable with Enter and Space and SHALL show a
visible focus indicator.

#### Scenario: Scroll area is focusable

- **WHEN** the user tabs into a block with overflowing code
- **THEN** the `pre` receives focus and arrow keys scroll it

#### Scenario: Focus follows DOM order

- **WHEN** a block has a `Header` with a `CopyTrigger`, followed by `Content`
- **THEN** pressing Tab focuses the copy button first and the `pre` second

#### Scenario: No stray tab stops

- **WHEN** the block is rendered
- **THEN** the region, header, title, language label, actions container, footer,
  line numbers and markers have no `tabIndex`

### Requirement: Layout of header, actions and footer

`CodeBlock.Header` SHALL lay out its children in a row. `CodeBlock.Actions`
inside `Header` SHALL align to the end of the header. `CodeBlock.Actions` inside
`CodeBlock.Content` SHALL float in the top-end corner of the content, and the
content SHALL reserve end padding so the first line is not covered.
`CodeBlock.Footer` SHALL render below the content. In a constrained container,
long lines SHALL scroll horizontally inside the `pre` without overflowing the
container; with `width="full"` the root SHALL fill the available width.

#### Scenario: Copy without a header

- **WHEN** `CodeBlock.Actions` with a `CodeBlock.CopyTrigger` is placed inside
  `CodeBlock.Content` and no `Header` is rendered
- **THEN** the copy button is visible in the top-end corner and does not cover
  the text of the first line

#### Scenario: Long line in a narrow container

- **WHEN** a block with a very long line is rendered in a 400px-wide container
- **THEN** the `pre` scrolls horizontally and the root is not wider than 400px

### Requirement: Line normalization

`CodeBlock.Root` SHALL split code into lines on `\r\n`, `\n` and `\r`. One
trailing line break SHALL NOT produce an extra rendered line. Copy and download
SHALL use the original `code` string (or the trigger's `text` prop), not the
normalized lines.

#### Scenario: Trailing newline

- **WHEN** `code="a\nb\n"` is rendered with `showLineNumbers`
- **THEN** exactly two lines and two line numbers are rendered

#### Scenario: Copy keeps the original string

- **WHEN** the user copies `code="a\r\nb\n"`
- **THEN** the clipboard contains `"a\r\nb\n"`

### Requirement: Line numbers

`CodeBlock.Content` SHALL render a line-number column when `showLineNumbers` is
`true` (default `false`). Numbers SHALL start at `startLineNumber` (default `1`)
and increase by one per line. The column SHALL be at least as wide as the widest
displayed number, so code on all lines starts at the same horizontal position.
Line numbers SHALL use `user-select: none` and MUST NOT be part of copied text.

#### Scenario: Offset numbering

- **WHEN** a five-line block has `showLineNumbers startLineNumber={42}`
- **THEN** the numbers are 42, 43, 44, 45, 46

#### Scenario: Aligned code across digit counts

- **WHEN** a block shows lines 8 to 11
- **THEN** the first code character of every line starts at the same horizontal
  position

#### Scenario: Numbers are not copied or selected

- **WHEN** the user copies with the copy trigger
- **THEN** the clipboard equals the code with no line numbers
- **AND** the line-number elements have `user-select: none`

### Requirement: Line selections and highlighted lines

`CodeBlock.Content` SHALL accept a `CodeLineSelection` in the props
`highlightedLines`, `addedLines`, `removedLines` and `outputLines`: an array of
line numbers and inclusive `[start, end]` ranges. Numbers SHALL refer to
displayed line numbers (`index + startLineNumber`). Entries that are not
integers, or ranges with `start > end`, SHALL be ignored. Highlighted lines
SHALL get a background band that spans the full scrollable width and works with
or without the line-number column. When a line is in more than one set, the
background SHALL follow the order removed, added, highlighted.

#### Scenario: Range is highlighted

- **WHEN** `highlightedLines={[2, [5, 7]]}` is set
- **THEN** exactly lines 2, 5, 6 and 7 are highlighted

#### Scenario: Selection follows the start number

- **WHEN** `startLineNumber={42}` and `highlightedLines={[43]}` are set
- **THEN** the second rendered line is highlighted

#### Scenario: Invalid entries are ignored

- **WHEN** `highlightedLines={[1.5, [6, 4]]}` is set
- **THEN** no line is highlighted and no error is thrown

#### Scenario: Highlight band covers scrolled text

- **WHEN** a highlighted line is longer than the visible width and the user
  scrolls horizontally
- **THEN** the band continues behind the scrolled text

### Requirement: Added and removed lines

Lines in `addedLines` and `removedLines` SHALL get the added or removed
background and a marker column showing `+` or `−`. The marker column SHALL be
`aria-hidden` and use `user-select: none`. The marker column SHALL render only
when at least one line is added or removed.

#### Scenario: Diff markers

- **WHEN** `addedLines={[3]}` and `removedLines={[4]}` are set
- **THEN** line 3 shows `+` with the added background and line 4 shows `−` with
  the removed background

#### Scenario: No marker column without diff lines

- **WHEN** neither `addedLines` nor `removedLines` is set
- **THEN** no marker column is rendered

### Requirement: Marked lines are not conveyed by color alone

Highlighted, added and removed lines SHALL have a visible cue that does not
depend on color: a start-edge bar for highlighted lines and the `+`/`−` marker
for added and removed lines (WCAG 1.4.1). Each contiguous run of lines of the
same kind SHALL be wrapped by visually hidden, localized start and end text
("Highlighted lines start" / "Highlighted lines end", "Added lines start" /
"Added lines end", "Removed lines start" / "Removed lines end"). This text SHALL
use `user-select: none` and MUST NOT be part of copied text.

#### Scenario: One announcement pair per run

- **WHEN** `highlightedLines={[[2, 4], 7]}` is set
- **THEN** there are two start texts and two end texts: one pair around lines
  2–4 and one pair around line 7

#### Scenario: Announcement text is not copied

- **WHEN** the user copies a block with highlighted lines
- **THEN** the clipboard equals the code without any announcement text

### Requirement: Word highlighting

`CodeBlock.Content` SHALL accept `highlightedWords`, a list of strings. Every
exact, case-sensitive occurrence of each string SHALL be wrapped in a `mark`
element, also when the occurrence spans more than one token. Syntax colors
inside the match SHALL be kept.

#### Scenario: Word is marked

- **WHEN** `highlightedWords={["variant"]}` is set on code containing
  `variant="primary"`
- **THEN** the text `variant` is inside a `mark` element

#### Scenario: Match across tokens

- **WHEN** `highlightedWords={["a.b"]}` is set on code `a.b`, where `a`, `.` and
  `b` are separate tokens
- **THEN** one `mark` element covers `a.b`

### Requirement: Prompt and output lines

When `prompt` is set on `CodeBlock.Content`, the prompt text SHALL be shown
before every line except the lines in `outputLines`. The prompt SHALL be
`aria-hidden`, use `user-select: none`, and MUST NOT be part of copied text.

#### Scenario: Prompt on command lines only

- **WHEN** `prompt="$"` and `outputLines={[2]}` are set on a two-line block
- **THEN** line 1 shows `$` and line 2 shows no prompt

#### Scenario: Prompt is not copied

- **WHEN** the user copies that block
- **THEN** the clipboard does not contain the `$` prompt

### Requirement: Wrapping long lines

When `wrapLongLines` is `true` on `CodeBlock.Content`, long lines SHALL wrap
instead of scrolling horizontally. The line number, prompt and marker SHALL stay
on the first visual row of the line, and line backgrounds SHALL cover all
wrapped rows. The default SHALL be `false`.

#### Scenario: Wrapped line

- **WHEN** a long line is rendered with `wrapLongLines` in a 400px container
- **THEN** the `pre` has no horizontal overflow and the line takes more than one
  visual row
- **AND** the line number appears once, on the first row

### Requirement: Copy trigger

`CodeBlock.CopyTrigger` SHALL render an icon button with the localized
accessible name "Copy code" and SHALL work anywhere inside `CodeBlock.Root`. On
activation it SHALL copy the `text` prop if given, otherwise the Root `code`. On
success it SHALL call `onCopy` exactly once, show a "copied" icon, and announce
the localized "Copied" message in a polite live region owned by Root; the icon
and message SHALL reset after `timeout` milliseconds (default 2000). On failure
it SHALL announce the localized "Copy failed" message and call `onCopyError`
exactly once, and MUST NOT call `onCopy`.

#### Scenario: Successful copy

- **WHEN** the user activates the copy button once with a click, Enter or Space
- **THEN** the clipboard contains the code, `onCopy` is called once, and the
  live region contains "Copied"

#### Scenario: Custom copy text

- **WHEN** `<CodeBlock.CopyTrigger text="real-secret" />` is activated in a
  block whose code is `"***"`
- **THEN** the clipboard contains `real-secret`

#### Scenario: Feedback resets

- **WHEN** `timeout={500}` is set and the copy succeeds
- **THEN** after 500 ms the icon is the copy icon again and the live region is
  empty

#### Scenario: Copy failure

- **WHEN** the clipboard write fails
- **THEN** the live region contains "Copy failed", `onCopyError` is called once,
  and `onCopy` is not called

### Requirement: Download trigger

`CodeBlock.DownloadTrigger` SHALL render an icon button with the localized
accessible name "Download code". On activation it SHALL download the `text` prop
if given, otherwise the Root `code`, as a file named `fileName` with MIME type
`mimeType` (default `text/plain;charset=utf-8`), and call `onDownload` once. It
MUST NOT access browser-only APIs during render.

#### Scenario: Download starts

- **WHEN** `<CodeBlock.DownloadTrigger fileName="config.yaml" />` is activated
- **THEN** a download named `config.yaml` is started with the block's code as
  content, and `onDownload` is called once

#### Scenario: Server rendering

- **WHEN** a block with a `DownloadTrigger` is rendered on the server
- **THEN** rendering succeeds without accessing `document`, `Blob` or `URL`

### Requirement: Maximum lines and expand trigger

A block SHALL be collapsible when `maxLines` is set on `CodeBlock.Root` and the
code has more lines than `maxLines`. While collapsed, `CodeBlock.Content` SHALL
render only the first `maxLines` lines. `CodeBlock.ExpandTrigger` SHALL render
only when the block is collapsible. It SHALL show the localized "Show more" or
"Show less" text (or its `children`), set `aria-expanded`, and reference the
content with `aria-controls`. The expanded state SHALL support `isExpanded` with
`onExpandedChange` (controlled) and `defaultExpanded` (uncontrolled, default
`false`). Copy and download SHALL always use the full code.

#### Scenario: Collapsed block

- **WHEN** a 30-line block has `maxLines={10}`
- **THEN** 10 lines are rendered and the expand button shows "Show more" with
  `aria-expanded="false"`

#### Scenario: Expanding

- **WHEN** the user activates the expand button
- **THEN** all 30 lines are rendered, the button shows "Show less" with
  `aria-expanded="true"`, focus stays on the button, and `onExpandedChange` is
  called with `true`

#### Scenario: Not collapsible

- **WHEN** a 5-line block has `maxLines={10}`
- **THEN** no expand button is rendered

#### Scenario: Copy while collapsed

- **WHEN** the user copies a collapsed 30-line block
- **THEN** the clipboard contains all 30 lines

### Requirement: Touch target size

Each trigger SHALL have a pointer target of at least 44×44 CSS pixels in every
size variant. This applies to `CodeBlock.CopyTrigger`,
`CodeBlock.DownloadTrigger` and `CodeBlock.ExpandTrigger`. When the visible
button is smaller, the hit area SHALL extend beyond the visible box.

#### Scenario: Compact copy button target

- **WHEN** `size="sm"` is set and the copy button is visibly smaller than 44px
- **THEN** a pointer press anywhere within a 44×44px area centered on the button
  activates it

### Requirement: Streaming updates

`CodeBlock.Root` SHALL accept a `code` value that changes many times per second.
On each change the block SHALL render the latest code, keep the scroll position
of the `pre`, and MUST NOT remount `Header`, `Actions` or triggers. Incomplete
code (for example an unterminated string or comment) SHALL render without
errors.

#### Scenario: Growing code keeps scroll position

- **WHEN** the user has scrolled the `pre` horizontally and `code` grows by one
  line
- **THEN** the horizontal scroll position does not change and the new line is
  rendered

#### Scenario: Copy button state survives updates

- **WHEN** the copy button shows its "copied" state and `code` changes
- **THEN** the copy button is not remounted and keeps its state until the
  timeout

#### Scenario: Unterminated string

- **WHEN** `code` ends inside an open string literal
- **THEN** the block renders without throwing

### Requirement: Localized messages

All user-facing strings SHALL come from `code-block.i18n.ts` under the
`Nimbus.CodeBlock.*` namespace: region label, copy code, copied, copy failed,
download code, show more, show less, and the start/end texts for highlighted,
added and removed lines.

#### Scenario: Locale change

- **WHEN** the block is rendered with the `de` locale
- **THEN** the region name and trigger names use the German messages

### Requirement: Event and prop integrity

Event handlers SHALL fire exactly once per user activation. Internal or React
Aria-only props MUST NOT appear as attributes on rendered DOM elements.

#### Scenario: No prop leakage

- **WHEN** a block with all parts is rendered
- **THEN** no internal props (such as `highlighter`, `maxLines`, line selection
  props, `onExpandedChange`) appear as DOM attributes
