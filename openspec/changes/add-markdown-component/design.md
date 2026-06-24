# Design: Markdown component

## Context

Primary use case is rendering **agentic / LLM streaming output** in chat and
assistant UIs; the secondary case is rendering authored markdown (release notes,
docs snippets, descriptions). The component must be flexible (every element
overridable, custom nodes supported), safe by default (untrusted input), and
visually owned by Nimbus (token-driven, no foreign CSS).

This design is grounded in a completed research pass and a working spike
(`scratchpad/md-spike/`) that rendered streamed partial markdown through Nimbus
stand-in components on React 19 with zero Tailwind.

## Library decision

**Engine: `react-markdown@10`** (remark/rehype/unified). Rationale:

- **Headless** — emits React elements, ships no CSS. Styling is 100% ours via
  the `components` map + Chakra recipe. The only widely-adopted renderer with
  this property.
- **Safe by default** — no `dangerouslySetInnerHTML`; raw HTML escaped/ignored;
  built-in `urlTransform` neutralizes dangerous protocols. GitHub Advisory DB
  has no advisories against the package itself; reported XSS is always
  misconfiguration (`rehype-raw` without sanitize).
- **The `components` prop is exactly requirements 1–3** — map element name →
  component; every renderer also receives the original hast `node` for custom
  rendering; new constructs from remark/rehype plugins flow through the same
  prop.
- **React 19 compatible** (peer `react >=18`), verified in the spike.

**Streaming: `remend@1.3`** — zero-dependency, framework-agnostic string→string
pre-processor (`remend(text, options) => string`). Completes unterminated
bold/italic/inline-code/links/images/strikethrough/math. **No-op on complete
input** (spike-verified byte-identical), so safe to run unconditionally per
frame. This is the exact streaming engine inside Streamdown, extracted without
the Tailwind styling.

**Security: piggyback on Merchant Center conventions — no extra library.** The
MC framework already governs image/host security at the **application CSP**
(`img-src`), and its existing `react-markdown` viewer
(`merchant-center-frontend/.../connect/markdown-viewer.tsx`) relies on
react-markdown's built-in safety: `skipHtml` (no raw HTML), an `allowedElements`
allowlist, and a custom `a` with `rel="noopener noreferrer"`. We adopt the same
posture rather than adding `harden-react-markdown`. Benefits: no per-frame
third-party code on untrusted input (supply-chain), one fewer dependency
(bundle), and internal relative/CDN/`data:` images "just work" because the CSP
gates them — exactly as MC works today.

**GFM: `remark-gfm`** — tables, task lists, strikethrough, autolinks. Default-on.

Rejected: Streamdown (Tailwind), markdown-to-jsx (XSS history + non-remark),
marked/markdown-it (`dangerouslySetInnerHTML`), MDX (executes code),
markstream-react (own CSS). See proposal for detail.

## Architecture

```
                         children (markdown string)
                                   │
                  isStreaming ?  remend(text, {linkMode:'text-only'})
                                   │           └─ aria-busy + coalesced completion announce
              split into blocks (stable block keys) ── memoized per block
                                   │
        react-markdown  ── skipHtml (raw HTML off) unless trust="trusted" && allowRawHtml
                            allowedElements (safe allowlist) / disallowedElements
                            remarkPlugins:[remarkGfm, ...user]
                            rehypePlugins:[...(raw+sanitize if allowRawHtml), ...user]
                            urlTransform (built-in: neutralizes javascript:/vbscript:/file:)
                            components: { ...nimbusDefaults, ...userComponents }
                                   │
                       Nimbus-styled React elements
              (style props → outer root container; images lazy + no-referrer)
                                   │
                     image-host security ← application CSP (img-src)
```

### Default renderer map

Reuse existing Nimbus primitives where they exist; recipe-styled slots
otherwise. Each default renderer destructures out `node` before spreading
(spike surfaced `node="[object Object]"` leaking to the DOM otherwise).

| Element | Default renderer |
| --- | --- |
| `h1`–`h4` | `Heading` at the Figma `Markdown/*` heading sizes |
| `h5`,`h6` | smallest heading style (folded) |
| `p` | `Text` (Markdown/Body) |
| `a` | `Link` — external-link detection adds `target="_blank" rel="noopener noreferrer"` + visible indicator + i18n label |
| `code` (inline) | `Code` (Markdown/Code, system mono) |
| `pre`/code block | recipe-styled block (system mono); v1 has **no** copy button / highlighting (override seam only); visually-hidden language label for SR parity |
| `strong`/`em`/`del` | Body Strong / Body Emphasis (italic) / strikethrough |
| `ul`/`ol`/`li` | recipe-styled lists; GFM task-list `input` rendered read-only |
| `blockquote` | recipe-styled slot |
| `table`/`thead`/`tr`/`th`/`td` | recipe-styled, semantic table markup with `th[scope]` |
| `img` | recipe-styled; preserves `alt`; missing-alt behaviour per a11y reqs |
| `hr`/`br` | `Separator` / line break |

### Override merge

`const components = { ...nimbusDefaults, ...props.components }` — shallow per
element key. Overriding one element never disturbs the others.

### Streaming & performance

`react-markdown` re-parses the whole AST every render. For streaming we split
content into top-level blocks and wrap each in `React.memo`, so appending a
token only re-parses the last block. Block splitting must produce **stable keys**
so settled blocks don't remount (and lose focus/scroll). `remend` runs on the
full string before splitting (it needs trailing context to close constructs).

The streaming-only code (`remend`, the block splitter/memoization, and the live
region) lives behind the `isStreaming` flag and is structured to be
**tree-shakeable**, so non-streaming consumers (e.g. MC rendering a description)
don't pay for it.

### Accessible streaming (behind Nimbus conventions)

Consumers do not manage ARIA. Off `isStreaming`, the root gets `aria-busy="true"`
while content is changing, flipping to `false` on settle; a polite live region
emits **one coalesced completion announcement** (not per-token) when streaming
ends. This gives SR users a "loading → done" model (WCAG 4.1.3) and pairs with
block memoization (only the tail mutates). The exact announcement string is i18n.

### Four-layer types

1. **Recipe props** — `markdown.recipe.ts` slot variants.
2. **Slot props** — derived in `markdown.slots.tsx`.
3. **Helper types** — `MarkdownComponents` (the override map type, re-exporting
   react-markdown's `Components`) and `MarkdownTrust`.
4. **Main props** — `MarkdownProps` (public, JSDoc'd): `children` (markdown
   string), `trust`, `allowRawHtml`, `sanitizeSchema`, `components`,
   `remarkPlugins`, `rehypePlugins`, `allowedElements`, `disallowedElements`,
   `isStreaming`, `headingOffset`, `ref`, and Nimbus **style props (forwarded to
   the outer root container)**.

## Accessibility (WCAG 2.1 AA)

- **Heading hierarchy (1.3.1, 2.4.6):** `headingOffset` shifts rendered heading
  levels (e.g. offset 1 → markdown `#` renders `<h2>`) so embedded content does
  not break the host page outline. Default renderers never skip levels on their
  own.
- **Heading skips within content (1.3.1, 2.4.6):** the renderer never *adds* a
  skip, but it faithfully renders author skips (`#` then `###`). Mitigation: a
  **dev-mode `console.warn`** on detected level skips + documented author
  guidance (we don't silently rewrite author structure).
- **Streaming announcements (4.1.3):** `aria-busy` + a single coalesced polite
  completion announcement (see *Accessible streaming* above) — built in, no
  consumer ARIA.
- **Links (2.4.4, 1.4.1, 1.4.11):** external links get `rel="noopener noreferrer"`,
  an i18n "(opens in new tab)" label, and a visible indicator that is a
  **shape/icon (not color alone)** meeting ≥3:1 non-text contrast.
- **Images (1.1.1):** `alt` preserved; rendered with `loading="lazy"` +
  `referrerpolicy="no-referrer"`. No alt → `alt=""` (decorative) **plus a
  dev-mode warning**, since for untrusted/AI images a missing alt is more likely
  a meaningful image being hidden; consumers handling untrusted images are
  directed to override `img`.
- **Tables (1.3.1):** real `<table>`/`<thead>`/`<th scope>` semantics. (GFM
  cannot express complex multi-header tables — documented limitation.)
- **Code/lists:** semantic `<pre><code>` and real `<ul>`/`<ol>`; fenced-block
  language surfaced via a visually-hidden label. Task-list checkboxes are
  read-only with an **accessible name derived from the item text** (not a bare
  unlabeled disabled input).
- **Color/contrast & reduced motion:** all default styles use AA-compliant
  tokens; no streaming reveal animation is introduced (if ever added, it must
  honour `prefers-reduced-motion`).

These are enforced by the **default renderers**; a consumer override owns its
own a11y (documented, with a checklist for the common `a`/`img`/`code`
overrides).

## Token mapping (compose existing primitives)

Figma `Markdown/*` → existing tokens, set directly in the recipe (no new
tokens, system mono):

| Style | Family | Weight | Size | Line height |
| --- | --- | --- | --- | --- |
| H1 | Inter | 600 | 24 | 28 |
| H2 | Inter | 600 | 20 | 24 |
| H3 | Inter | 600 | 18 | 24 |
| H4 | Inter | 600 | 16 | 20 |
| Body | Inter | 400 | 16 | 24 |
| Body Strong | Inter | 700 | 16 | 24 |
| Body Emphasis | Inter (italic) | 400 | 16 | 24 |
| Small | Inter | 400 | 14 | 20 |
| Code | mono (system) | 400 | 14 | 22 |

## Open questions (resolved)

- **Trust model** → configurable per instance (`trust` prop); untrusted default.
- **Security model** → piggyback on MC conventions: react-markdown safe defaults
  (`skipHtml`) + `allowedElements` allowlist + `rel=noopener` external links;
  image-host security delegated to the app CSP. **No `harden-react-markdown`.**
- **Streaming in v1** → yes (remend + block memoization), with built-in
  `aria-busy` + coalesced completion announcement.
- **Code blocks in v1** → semantic styled `pre`/`code` only; no copy button / no
  syntax highlighting (override seam + fast-follow `CodeBlock`).
- **Override merge** → shallow per element key.
- **Simple-case layout** → style props forward to the outer root container
  (standard Nimbus pattern); no bespoke `maxW`/`lineClamp`/`variant` props.
- **Canonical input** → `children` (string), matching react-markdown.
- **Tokens** → compose primitives in recipe; system mono (no new tokens, no
  Roboto Mono webfont).
- **Math** → `remarkPlugins` passthrough; not bundled.

## Remaining decisions for implementation

- Exact block-splitting strategy for stable keys (candidate: `marked.lexer` raw
  tokens, or a lightweight top-level splitter to avoid a `marked` dependency).
- `h5`/`h6` exact fold target.
- Default `allowedElements` set (start from the MC viewer's list — `h1`,`h2`,`p`,
  `a`,`br`,`strong`,`i`,`code`,`ul`,`ol`,`li` — extended for the Nimbus default
  renderer coverage: headings `h1`–`h6`, `em`, `pre`, `blockquote`, `img`, `hr`,
  GFM `table`/`thead`/`tbody`/`tr`/`th`/`td`/`del`/`input`).
