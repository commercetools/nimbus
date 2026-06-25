# Specification: Markdown

## Overview

The Markdown component renders a Markdown source string into Nimbus-styled,
accessible React elements. It provides default renderers for every standard
markdown element, lets consumers override any element renderer, and safely
renders incrementally streamed (LLM) output.

It is built on `react-markdown` (headless, no `dangerouslySetInnerHTML`), with
GFM enabled by default and optional streaming completion via `remend`. Security
follows the established Merchant Center convention — react-markdown's built-in
safety (`skipHtml`, `urlTransform`), a safe element allowlist, and
`rel="noopener noreferrer"` external links — with image-host security delegated
to the application Content-Security-Policy (no `harden-react-markdown`). Styling
is owned entirely by Nimbus through the default component map: standard elements
render through existing Nimbus components (`Heading`, `Text`, `Code`, `Link`)
and the rest through `chakra.*` primitives carrying design-token style props, so
there is no component-specific slot recipe.

**Component:** `Markdown` **Package:** `@commercetools/nimbus`
**Category:** Content / Typography

## ADDED Requirements

### Requirement: Default Nimbus-styled rendering

The component SHALL render a Markdown string into Nimbus-styled React elements
using default renderers for all standard markdown elements, with GitHub Flavored
Markdown (tables, task lists, strikethrough, autolinks) enabled by default.

#### Scenario: Render standard markdown

- **WHEN** a Markdown string containing headings, paragraphs, emphasis, links,
  inline code, code blocks, lists, blockquotes, and images is provided
- **THEN** SHALL render each as the corresponding Nimbus-styled element using
  design tokens from the Figma Typography Markdown Map
- **AND** SHALL produce semantic HTML (`<h1>`–`<h6>`, `<p>`, `<a>`, `<code>`,
  `<pre>`, `<ul>`/`<ol>`/`<li>`, `<blockquote>`, `<img>`)

#### Scenario: GitHub Flavored Markdown

- **WHEN** the source contains GFM constructs (tables, task lists,
  `~~strikethrough~~`, autolinks)
- **THEN** SHALL render them correctly with `remark-gfm` enabled by default
- **AND** SHALL render task-list checkboxes as disabled inputs reflecting their
  checked state

#### Scenario: Heading typography mapping

- **WHEN** headings `#` through `####` are rendered
- **THEN** SHALL apply the `Markdown/*` heading scale (H1 24/28, H2 20/24,
  H3 18/24, H4 16/20, all Inter 600) composed from existing tokens
- **AND** SHALL fold `#####`/`######` to the smallest heading style

### Requirement: Per-element renderer overrides

The component SHALL accept a `components` prop mapping HTML element names to
React components or string tags, shallow-merged per element key over the Nimbus
defaults. The same prop additionally registers custom component tags by
non-standard key (see "Custom component tags").

#### Scenario: Override a single element

- **WHEN** `components={{ a: CustomLink }}` is provided
- **THEN** SHALL render all anchors with `CustomLink`
- **AND** SHALL leave every other element's default renderer unchanged

#### Scenario: Renderer receives the source node

- **WHEN** any renderer (default or override) is invoked
- **THEN** SHALL pass the original hast `node` element to it
- **AND** the default renderers SHALL NOT leak the `node` prop onto the rendered
  DOM element

### Requirement: Custom component tags

The component SHALL allow consumers to embed custom component tags in the source
and render them via components registered under non-standard (e.g. PascalCase)
keys of the `components` prop. Tags are materialized by a Nimbus-owned remark
plugin (not `rehype-raw`), so this does not relax the raw-HTML stance.

#### Scenario: Registered custom tag renders with props

- **WHEN** `components={{ SearchQueryResultCard: Card }}` is provided and the
  source contains `<SearchQueryResultCard id="foo" />`
- **THEN** SHALL render `Card` with the tag's string attributes as props
  (`{ id: "foo" }`)

#### Scenario: Any casing preserved

- **WHEN** a registered tag uses arbitrary casing matching its `components` key
- **THEN** SHALL match by exact case and render the registered component (the
  tag name SHALL NOT be lowercased)

#### Scenario: Unregistered tag stays inert

- **WHEN** the source contains a custom tag with no matching `components` key
- **THEN** SHALL NOT render it as a live element (safe by default)

#### Scenario: Self-closing and paired tags

- **WHEN** a registered tag is self-closing (`<Tag ... />`)
- **THEN** SHALL render it with its attributes as props and no children
- **AND WHEN** a registered tag is paired (`<Tag ...>…</Tag>`)
- **THEN** SHALL render it with the enclosed markdown parsed as its children

#### Scenario: Custom tags stay coherent while streaming

- **WHEN** `isStreaming` is set and a paired custom tag is split across the
  streamed source
- **THEN** SHALL keep the tag's region in a single block so it is paired once
  complete, leaving an unclosed opening tag inert until its closing tag arrives

### Requirement: Safe by default rendering

The component SHALL render with a single security posture safe for untrusted and
AI-generated content. Raw HTML is never rendered as live markup.

#### Scenario: Raw HTML is not rendered

- **WHEN** the source contains raw HTML (e.g. `<script>`, `<iframe>`, an
  `onerror` attribute)
- **THEN** SHALL NOT render the raw HTML as live markup (`skipHtml`)
- **AND** SHALL NOT use `dangerouslySetInnerHTML`

#### Scenario: Dangerous URLs neutralized

- **WHEN** a link or image uses a dangerous protocol (`javascript:`,
  `vbscript:`, `file:`)
- **THEN** SHALL neutralize the URL (via react-markdown's built-in
  `urlTransform`) so it cannot execute

#### Scenario: Element allowlist and CSP-delegated image security

- **WHEN** rendering any source
- **THEN** SHALL render only elements in a safe `allowedElements` allowlist
  (extended with any registered custom component tag names), matching the
  Merchant Center convention
- **AND** SHALL NOT re-implement image-host allowlisting in the component —
  image-host security is delegated to the application Content-Security-Policy
  (`img-src`); rendered images SHALL carry `loading="lazy"` and
  `referrerpolicy="no-referrer"`
- **AND** SHALL allow the rendered element set to be tuned via `allowedElements`
  / `disallowedElements`

### Requirement: Incremental (streaming) rendering

The component SHALL safely render incrementally streamed Markdown when
`isStreaming` is set.

#### Scenario: Unterminated inline constructs render cleanly

- **WHEN** `isStreaming` is set and the current value ends mid-construct (e.g.
  `**bold`, `` `code ``, `[text](`)
- **THEN** SHALL complete the construct via `remend` so it renders as formatted
  content rather than literal markup characters
- **AND** SHALL render an in-progress link's text as plain text until its URL
  completes (`linkMode: "text-only"`)

#### Scenario: Complete input is unaffected by streaming mode

- **WHEN** `isStreaming` is set and the value is already syntactically complete
- **THEN** SHALL render output identical to rendering with `isStreaming` unset
  (the completion pass is a no-op on complete input)

#### Scenario: Settled content is not re-parsed

- **WHEN** a new token extends a streamed value
- **THEN** SHALL only re-parse/re-render the final affected block, memoizing
  already-settled blocks
- **AND** SHALL keep stable keys so settled blocks do not remount

#### Scenario: Streaming does not burden non-streaming consumers

- **WHEN** `isStreaming` is not set
- **THEN** SHALL NOT execute the streaming code path (`remend`, block
  memoization, live region), and that code SHALL be tree-shakeable

### Requirement: Accessibility (WCAG 2.1 AA)

The default renderers SHALL meet WCAG 2.1 AA for rendered markdown content, and
the component SHALL manage required ARIA internally (consumers do not pass ARIA).

#### Scenario: Heading level offset preserves outline

- **WHEN** `headingOffset` is set to N
- **THEN** SHALL render markdown heading level L as HTML heading level
  `min(L + N, 6)` so embedded content does not break the host page outline

#### Scenario: Author heading-level skip warns in development

- **WHEN** author markdown skips a heading level (e.g. `#` then `###`)
- **THEN** SHALL render the levels faithfully (not silently rewrite them)
- **AND** SHALL emit a development-mode warning

#### Scenario: Streaming announced without per-token spam

- **WHEN** `isStreaming` is set
- **THEN** SHALL set `aria-busy="true"` on the root while content is changing and
  `aria-busy="false"` when it settles
- **AND** SHALL emit a single coalesced (not per-token) completion announcement
  via a polite live region, driven by the component (no consumer ARIA required)

#### Scenario: External link semantics

- **WHEN** a link points to an external origin
- **THEN** SHALL render it with `rel="noopener noreferrer"`, an accessible
  (i18n) "opens in new tab" label, and a visible indicator that is not conveyed
  by color alone and meets ≥3:1 non-text contrast

#### Scenario: Accessible tables, images, and task lists

- **WHEN** a table, image, or GFM task-list item is rendered
- **THEN** tables SHALL use `<thead>` and `<th scope>` semantics
- **AND** images SHALL preserve author `alt` (rendering `alt=""` plus a dev-mode
  warning when none is provided) and carry `loading="lazy"` +
  `referrerpolicy="no-referrer"`
- **AND** task-list checkboxes SHALL be read-only with an accessible name
  derived from the item text

### Requirement: Component registration and theming

The component SHALL follow Nimbus structure, styling, and export conventions.

#### Scenario: Styling via design tokens (no recipe)

- **WHEN** the component is themed
- **THEN** SHALL style rendered elements using existing Nimbus components
  (`Heading`, `Text`, `Code`, `Link`) and design-token style props on `chakra.*`
  primitives, composed from existing tokens (no new `Markdown/*` tokens; existing
  system `fontFamily.mono` for code)
- **AND** SHALL NOT register a component-specific slot recipe

#### Scenario: Style props forward to the outer container

- **WHEN** a consumer passes style props (e.g. `maxW`, `lineClamp`, spacing)
- **THEN** SHALL forward them to the component's outer root container, per the
  standard Nimbus pattern (no bespoke layout props)

#### Scenario: Barrel export

- **WHEN** consumers import from `@commercetools/nimbus`
- **THEN** SHALL export `Markdown` and its public types from the package barrel
