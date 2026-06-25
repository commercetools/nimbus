# Change: Add Markdown component

## Why

Nimbus has no primitive for rendering a Markdown string into styled, accessible
React content. Consumers building **agentic / LLM chat and assistant UIs** (the
primary driver) currently hand-roll a markdown pipeline: they pick a parser,
wire sanitization, restyle every element to match the design system, and — for
streaming output — fight the "flash of broken markdown" when a model emits a
half-written `**bold` or `[link](` mid-stream. This is repeated, error-prone,
and a security footgun (XSS via raw HTML / unsafe URLs).

`Markdown` fills that gap with one focused job: **turn a markdown string into
Nimbus-styled, accessible React elements**, with first-class support for (1)
sensible default renderers, (2) per-element overrides, and (3) safe incremental
rendering of streamed output.

This proposal is backed by completed deep research and a working spike
(`react-markdown@10` + `remend@1.3` on React 19, rendering streamed partial
markdown through Nimbus components with **zero Tailwind / zero CSS** — styling
is 100% ours via the component map).

## What Changes

**Component:** `Markdown` (Tier 2/3 — a single `<Markdown>` entry point plus a
default renderer map; default renderers reuse existing Nimbus primitives).
**Package:** `@commercetools/nimbus` **Category:** Content / Typography.

### Core API

```tsx
<Markdown
  components={{
    // overrides (standard keys) + custom tags (non-standard keys)
    a: MyLink,
    SearchQueryResultCard: Card,
  }}
  isStreaming // enable remend completion + block memoization + a11y streaming state
  headingOffset={0} // shift rendered heading levels to preserve page outline
  maxW="60ch" // style props forward to the outer container (standard Nimbus pattern)
>
  {markdownString}
</Markdown>
```

`children` is the markdown source string (canonical input, matching
`react-markdown`). GFM (tables, task lists, strikethrough, autolinks) is on by
default via `remark-gfm`. Style props are forwarded to the component's **outer
root container** (the established Nimbus convention), so consumers control
width/measure, clamping, and spacing with the usual style props rather than
bespoke layout props.

### 1. Default Nimbus-styled renderers

Out of the box, every standard markdown element maps to a Nimbus-styled
renderer. Default renderers **reuse existing Nimbus primitives** where they
exist — `Heading` (h1–h4 → the Figma `Markdown/*` heading scale; h5/h6 fold to
the smallest), `Link` (a), `Code` (inline code), `Text` (p, emphasis) — and
styled `chakra.*` primitives with design-token style props for the rest (code
blocks, blockquote, lists, tables, hr, images), with no component-specific slot
recipe. Typography follows the Figma **Typography Markdown Map** (node
`10798-21557`), composed from **existing tokens** (see Token strategy below).

### 2. Per-element overrides and custom component tags

A single `components` prop maps an HTML element name (`h1`–`h6`, `a`, `code`,
`pre`, `em`, `strong`, `p`, `ul`/`ol`/`li`, `blockquote`, `img`,
`table`/`thead`/ `tbody`/`tr`/`td`/`th`, `del`, `input`, `hr`, `br`) to a React
component or string tag. Consumer entries are **shallow-merged per element key**
over the Nimbus defaults — overriding `a` leaves every other default intact.

The same prop also accepts **non-standard keys** (e.g. `SearchQueryResultCard`),
which register **custom component tags**: the consumer can embed
`<SearchQueryResultCard id="foo" />` (self-closing) or
`<SearchQueryResultCard>…</SearchQueryResultCard>` (paired, with markdown
children) directly in the source, and the registered component renders it with
the tag's string attributes as props. Tag names match by exact case (any casing
preserved). A Nimbus-owned remark plugin materializes only registered tags —
unregistered tags stay inert, so this is safe by default and needs no
`rehype-raw`.

### 3. Safe incremental (streaming) rendering — in v1

`isStreaming` runs each frame through **`remend`** (zero-dependency
string→string pre-processor) which completes unterminated
bold/italic/inline-code/links/ images/strikethrough so partial tokens render
cleanly instead of as literal `**` / `[`. `remend` is a **no-op on complete
input** (spike-verified byte-identical), so it is safe to apply on every frame.
The component splits content into blocks and memoizes each (`React.memo`) so a
new token only re-parses the final block, not the whole document. In-progress
links use `linkMode: 'text-only'` so a half-typed URL shows as plain text until
it finishes.

**Accessible streaming, behind Nimbus conventions.** Consumers never touch ARIA.
Driven off `isStreaming`, the component sets `aria-busy` on the root while
streaming and emits a single, coalesced completion announcement via a polite
live region when the stream settles — so screen-reader users get a coherent
"loading → done" model without per-token spam (WCAG 4.1.3). The streaming code
path (`remend`, block memoization, live region) is tree-shakeable so
non-streaming consumers don't pay for it.

### Security: safe by default (aligned with Merchant Center)

The security model **piggybacks on the established Merchant Center convention**
(its existing `react-markdown` viewer): rely on react-markdown's built-in
safety, an element allowlist, and `rel="noopener noreferrer"` external links —
with **image/host security governed by the application's CSP** (`img-src`), not
re-implemented in the component.

- **Single safe posture:** raw HTML is never rendered (`skipHtml`), rendering is
  restricted to a safe `allowedElements` allowlist (extended with any registered
  custom component tag names). External links get `rel="noopener noreferrer"`;
  images render with `loading="lazy"` + `referrerpolicy="no-referrer"` and are
  gated by the app CSP. Correct posture for AI / user-generated content.
- **Custom components instead of raw HTML:** to render application components,
  register them as custom component tags (materialized by a Nimbus-owned remark
  plugin that only touches registered tags) — no `rehype-raw` /
  `rehype-sanitize` raw-HTML path.
- `allowedElements` / `disallowedElements` (react-markdown native) are exposed
  for tuning the rendered element set.

`react-markdown` is **safe by default** (no `dangerouslySetInnerHTML`; raw HTML
skipped; built-in `urlTransform` neutralizes `javascript:`/`vbscript:`/`file:`).
**No `harden-react-markdown` dependency** — image-host allowlisting is the
application CSP's job, exactly as MC does it today.

### Token strategy

The Figma `Markdown/*` scale is reproduced by **composing existing primitive
tokens as style props on the renderers and root** (no recipe) — no new
`Markdown/*` composite tokens, and **system mono** (existing `fontFamily.mono`)
for code rather than adding a Roboto Mono webfont. Rationale: every value (font
sizes 14/16/18/20/24, line heights 20/22/24/28, weights 400/600/700) already
exists as a primitive; the only deltas vs existing composites are tighter
line-heights, which the renderers set directly via style props.

## Out of scope (v1)

- **Code-block chrome (copy button, language label) and syntax highlighting.**
  v1 ships a semantic, token-styled `pre`/`code` block only. The consumer-facing
  AI agents driving this work render conversational text, not code-heavy output,
  so code-block UX is deferred. The `components.pre`/`code` override seam
  remains available; a richer `CodeBlock` (copy + language label + `react-shiki`
  highlighting) is a documented fast-follow.
- **Math (KaTeX), emoji shortcodes, custom directives** — not supported in v1.
  These require markdown-engine plugins, and v1 deliberately does not expose a
  `remarkPlugins` / `rehypePlugins` passthrough (it would leak the engine into
  the public API). If a concrete consumer need arises, it becomes an owned,
  first-class feature rather than a passthrough.
- **A markdown editor / input** — that is `RichTextInput`'s domain.
- **Mermaid diagrams.**

## Rejected alternatives

- **Streamdown** — requires Tailwind CSS; hard no for our Chakra v3 stack. Its
  streaming value is available as the standalone, Tailwind-free `remend`
  package, which we adopt directly (its `harden-react-markdown` is unnecessary
  here — see Security: image-host control is the app CSP's job, per MC
  convention).
- **markdown-to-jsx** — documented XSS history (CVE-2024-21535,
  GHSA-ccrp-c664-8p4j) and sits outside the remark/rehype plugin ecosystem.
- **marked / markdown-it + sanitizer** — require `dangerouslySetInnerHTML` plus
  a bolt-on sanitizer.
- **MDX** — executes arbitrary code; unsafe for untrusted/AI input.
- **markstream-react** — ships its own CSS (not token-driven).

`react-markdown` is the only widely-used, fully **headless** renderer, which is
exactly what a token-themed design system needs.

## Impact

- **New dependencies** (in `@commercetools/nimbus`): `react-markdown`,
  `remark-gfm`, `remend`. All logic-only, no CSS/Tailwind. `react-markdown` +
  `remark-gfm` are already used by the MC markdown viewer (same versions).
  Custom component tags are materialized by a Nimbus-owned remark plugin (no new
  dependency). **No `rehype-raw` / `rehype-sanitize`** (no raw-HTML path) and
  **no `harden-react-markdown`** — image-host security is the app CSP's
  responsibility (MC convention).
- **New spec:** `nimbus-markdown`.
- **New component:** `packages/nimbus/src/components/markdown/`.
- **Barrel export** from `packages/nimbus/src/components/index.ts`.
- No changes to the tokens package (composition-only).
- **Aligns with the existing Merchant Center `react-markdown` viewer** security
  posture (`skipHtml` + `allowedElements` + `rel=noopener`), so MC teams adopt a
  familiar model.
