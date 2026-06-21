## ADDED Requirements

### Requirement: Read-only syntax-highlighted code rendering

The `CodeBlock` component SHALL render a multi-line source-code string with
syntax highlighting for the supplied `language`. It SHALL be read-only: it MUST
NOT accept text input, MUST NOT be `contentEditable`, and MUST NOT expose an
editing or `isDisabled` concept. Highlighting SHALL be produced via React
elements (no `dangerouslySetInnerHTML`), so untrusted code strings are rendered
as inert text.

#### Scenario: Renders highlighted code for a supported language

- **WHEN** a consumer renders `<CodeBlock code={tsSource} language="tsx" />`
- **THEN** the source is displayed inside a `<pre><code>` structure with
  syntax-token `<span>`s, and the visible text content equals the original
  `code` string (no characters added or dropped).

#### Scenario: Unknown or omitted language falls back to plain text

- **WHEN** `language` is omitted (defaults to `"plaintext"`) or set to a value
  not in the bundled grammar set (e.g. `language="brainfuck"`)
- **THEN** the component renders the `code` string as un-highlighted plain text
  without throwing or logging an error.

#### Scenario: Empty code renders a valid empty block

- **WHEN** `code` is an empty string
- **THEN** the component renders a valid, non-crashing empty block (the
  `region`, header, and an empty `<pre>` are present).

#### Scenario: Untrusted code is not executed or injected as markup

- **WHEN** `code` contains HTML/script-like text such as
  `<img src=x onerror=alert(1)>`
- **THEN** that text is displayed verbatim as code and is NOT parsed into live
  DOM (no `img` element, no script execution), because tokens are rendered as
  React text nodes.

### Requirement: Accessible region and code semantics

The component SHALL wrap its content in a container with `role="region"` whose
accessible name comes from the `aria-label` prop, defaulting to the localized
"Code block" message. The component MUST NOT place an `aria-label` (or any
accessible-name attribute) on the `<code>` element, because ARIA prohibits
accessible names on the `code` role. The language label shown in the header
SHALL be decorative (`aria-hidden`) since the region already carries the name.

#### Scenario: Region carries the accessible name

- **WHEN** a consumer renders `<CodeBlock code={src} language="ts" aria-label="Example config" />`
- **THEN** an element with `role="region"` and accessible name "Example config"
  wraps the code, and the `<code>` element has no `aria-label`.

#### Scenario: Default accessible name is localized

- **WHEN** a consumer renders `<CodeBlock code={src} language="ts" />` with no
  `aria-label`
- **THEN** the region's accessible name is the localized default ("Code block"
  in the `en` locale).

#### Scenario: Language label is not announced redundantly

- **WHEN** the header is shown with a language label
- **THEN** the language label element is `aria-hidden="true"` so screen readers
  do not announce it in addition to the region name.

### Requirement: Keyboard-operable scroll region

The scrollable `<pre>` container SHALL be keyboard-operable so that overflowing
code can be scrolled without a pointer, satisfying WCAG 2.1.1 (Keyboard, Level
A) and the axe `scrollable-region-focusable` rule. The `<pre>` SHALL carry
`tabIndex={0}`. No other non-interactive element SHALL receive a stray
`tabIndex`.

#### Scenario: Scroll container is focusable

- **WHEN** the user tabs through a rendered `CodeBlock`
- **THEN** the `<pre>` scroll container receives focus (has `tabIndex="0"`) and
  can be scrolled with the arrow keys.

#### Scenario: No stray tabIndex on non-interactive parts

- **WHEN** the component is rendered
- **THEN** only the `<pre>` (and the copy button, when shown) are in the tab
  order; the region, header, language label, and line numbers carry no
  `tabIndex`.

### Requirement: Constrained width and horizontal overflow

When placed in a constrained-width container, the component SHALL contain long
lines via horizontal scrolling inside the `<pre>` without breaking the page
layout or silently overflowing its container. When given `width="full"` it SHALL
stretch to fill the available width.

#### Scenario: Long line scrolls horizontally, no silent overflow

- **WHEN** a `CodeBlock` containing a single very long line is rendered inside a
  fixed-width container (e.g. `width="400px"`)
- **THEN** the `<pre>` shows a horizontal scrollbar and the component does not
  exceed the container's width (no layout-breaking overflow).

#### Scenario: Full-width stretch

- **WHEN** a `CodeBlock` is rendered with `width="full"` inside a wider container
- **THEN** the region stretches to fill the container's width.

### Requirement: Optional header with language label

The component SHALL render a header bar by default that displays the `language`
label and hosts the copy button. The header SHALL be removable via
`showHeader={false}`, which also removes the copy button hosted within it.

#### Scenario: Header visible by default

- **WHEN** `<CodeBlock code={src} language="json" />` is rendered with defaults
- **THEN** a header is present showing the language label "json".

#### Scenario: Header hidden on request

- **WHEN** `showHeader={false}` is set
- **THEN** no header element is rendered and no copy button is present.

### Requirement: Copy-to-clipboard with screen-reader announcement

When the header and copy button are shown, the component SHALL render a copy
button (an `IconButton` with a localized "Copy code" accessible name). Activating
it SHALL copy the `code` string to the clipboard exactly once per activation,
fire the optional `onCopy` callback exactly once per successful copy, show a
transient "copied" affordance, and announce success through a polite
`aria-live` region (a `VisuallyHidden` live region whose message clears after a
short delay). The copy button SHALL be hideable via `showCopyButton={false}`.

#### Scenario: Copy button has an accessible name

- **WHEN** the copy button is rendered
- **THEN** it is reachable by role `button` with the localized accessible name
  "Copy code".

#### Scenario: Single activation copies once and fires onCopy once

- **WHEN** the user activates the copy button a single time (click or Enter/Space)
- **THEN** the clipboard write happens exactly once, the `onCopy` callback is
  invoked exactly once, and the `aria-live` region is updated to the localized
  "Copied" message.

#### Scenario: Copy button can be hidden independently

- **WHEN** `showCopyButton={false}` is set while the header is shown
- **THEN** the header renders without a copy button.

### Requirement: Optional line numbers

The component SHALL render a per-line number gutter when `showLineNumbers={true}`,
aligned one number per rendered line, and SHALL render no gutter when the prop is
`false` (the default). Line numbers SHALL be non-selectable decoration and MUST
NOT be part of the copied text.

The gutter SHALL begin at the `startLineNumber` value (a positive integer,
default `1`) and increment by one per rendered line, so a consumer can display a
contiguous excerpt of a file with its real source line numbers (e.g.
`startLineNumber={42}` numbers a five-line excerpt 42–46). `startLineNumber`
SHALL be orthogonal to visibility: it has no effect when `showLineNumbers` is
`false`, and it never changes the copied text (which always equals the `code`
prop). The offset applies to a single contiguous run of lines; non-contiguous
or per-line custom numbering is out of scope for v1.

#### Scenario: Line numbers shown when enabled

- **WHEN** `showLineNumbers={true}` is set on multi-line code
- **THEN** a line-number gutter is rendered with one number per line.

#### Scenario: No gutter when disabled

- **WHEN** `showLineNumbers` is omitted or `false`
- **THEN** no line-number gutter is rendered.

#### Scenario: Gutter defaults to starting at 1

- **WHEN** `showLineNumbers={true}` is set with no `startLineNumber`
- **THEN** the first rendered line is numbered `1` and each subsequent line
  increments by one.

#### Scenario: Excerpt displays real source line numbers

- **WHEN** a five-line excerpt is rendered with
  `showLineNumbers startLineNumber={42}`
- **THEN** the gutter shows `42, 43, 44, 45, 46`, one per line.

#### Scenario: startLineNumber is ignored when line numbers are hidden

- **WHEN** `startLineNumber={42}` is set while `showLineNumbers` is omitted or
  `false`
- **THEN** no gutter is rendered and the offset has no visible effect.

#### Scenario: Line numbers are excluded from copied text

- **WHEN** the user copies code while line numbers are shown (with any
  `startLineNumber`)
- **THEN** the clipboard contents equal the original `code` string with no line
  numbers inserted.

### Requirement: Optional line highlighting

The component SHALL render a background highlight band on each line whose
displayed line number appears in the `highlightedLines` array (default `[]`).
The displayed line number is `index + startLineNumber`, so highlighting uses the
same numbering as the gutter and honors a `startLineNumber` offset. Highlighting
SHALL be independent of `showLineNumbers` (a line can be highlighted with the
gutter hidden). The highlight SHALL be a decorative visual treatment expressed
through design tokens, MUST adapt to light/dark mode without component logic
branching, and MUST NOT alter the copied text. The highlight band SHALL span the
full scrollable width of the line, including the portion revealed by horizontal
scrolling. Ranges and non-contiguous custom numbering beyond a flat list of line
numbers are out of scope for v1.

#### Scenario: Specified lines are highlighted

- **WHEN** `highlightedLines={[4, 5]}` is set on multi-line code with
  `showLineNumbers`
- **THEN** exactly the lines whose gutter reads `4` and `5` carry the highlight
  band and no other line does.

#### Scenario: Highlighting honors the startLineNumber offset

- **WHEN** `startLineNumber={42}` and `highlightedLines={[43]}` are set
- **THEN** the single highlighted line is the one whose gutter reads `43` (the
  second rendered line), not the line at index 43.

#### Scenario: Highlighting works without the gutter

- **WHEN** `highlightedLines={[1]}` is set while `showLineNumbers` is `false`
- **THEN** the first rendered line carries the highlight band and no gutter is
  rendered.

#### Scenario: Highlight is excluded from copied text

- **WHEN** the user copies code while one or more lines are highlighted
- **THEN** the clipboard contents equal the original `code` string, unaffected by
  the highlight.

### Requirement: Token-driven theming and light/dark support

The component SHALL express all visual treatment (surface, border, radius,
spacing, typography, and every syntax-token color) through design tokens and
recipe variants. The component logic MUST NOT contain raw px/hex/color/spacing
values and MUST NOT branch on any visual value. Syntax-token colors SHALL be
namespaced CSS custom properties (e.g. `--code-token-keyword`) declared in the
recipe with light defaults and `_dark` overrides, and the highlighter theme SHALL
reference those variables via `var(...)`. Switching to dark mode SHALL change only
resolved token values, not component behavior.

#### Scenario: Dark mode changes resolved colors only

- **WHEN** the application color mode is switched to dark
- **THEN** the surface and syntax-token colors resolve to the dark palette while
  the rendered DOM structure and behavior remain identical.

#### Scenario: No hard-coded design values in logic

- **WHEN** the component source (`code-block.tsx`) is inspected
- **THEN** it contains no raw px/hex/named-color/spacing literals; all such values
  come from the recipe/tokens, and any CSS custom properties are namespaced with
  the component prefix.

#### Scenario: Size variant scales typography and padding

- **WHEN** `size="sm"` versus `size="md"` (default) is applied
- **THEN** the font scale and padding change via recipe tokens, with no change to
  behavior.

### Requirement: Event and prop integrity

Component event handlers SHALL fire exactly once per user activation, and the
component MUST NOT leak internal or React Aria implementation props onto rendered
DOM elements.

#### Scenario: Copy handler fires exactly once

- **WHEN** the copy button is activated once
- **THEN** the underlying copy operation and `onCopy` callback each run exactly
  once (no double firing).

#### Scenario: No internal prop leakage to the DOM

- **WHEN** the component is rendered
- **THEN** no internal/React-Aria-only props appear as attributes on the rendered
  `region`, `pre`, `code`, or button DOM elements.
