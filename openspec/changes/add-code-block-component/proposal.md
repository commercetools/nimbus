## Why

Nimbus has an inline `Code` component for short, unstyled inline snippets, but no
way to render a block of source code with syntax highlighting. Product surfaces
that show API examples, configuration, integration guides, and developer docs
currently hand-roll `<pre>` blocks with ad-hoc styling and no accessibility,
theming, or copy affordance. A first-class, read-only `CodeBlock` gives consumers
a consistent, accessible, token-themed way to display multi-line code with
syntax highlighting, light/dark support, and copy-to-clipboard.

## What Changes

- Add a new **`CodeBlock`** component to `@commercetools/nimbus`: a block-level,
  **read-only** source-code renderer with syntax highlighting. It is the
  block-level sibling of the existing inline `Code` component (Chakra v3 /
  Atlassian convention: inline `Code` + block `CodeBlock`).
- Public API is a single **props-driven** component:
  `<CodeBlock code={string} language="tsx" showLineNumbers aria-label="…" />`
  (not a compound `.Root` API — the content is data, a code string + language,
  not composable JSX).
- v1 capabilities: syntax highlighting for the common language set, an opt-out
  header bar showing the language label, a copy-to-clipboard button with a
  screen-reader success announcement, and opt-in line numbers. The line-number
  gutter starts at `1` by default but accepts a `startLineNumber` offset, so a
  consumer can render an excerpt of a file with its real source line numbers
  (e.g. a five-line snippet numbered 42–46). A `size` variant
  (`sm`/`md`) scales typography + padding.
- Syntax highlighting via **`prism-react-renderer`** (added as a bundled
  `dependency`). It renders through React elements (no `dangerouslySetInnerHTML`
  → no XSS), is synchronous (SSR-safe), and exposes a plain-object theme whose
  color values can be CSS variables.
- **Token-driven theming**: every syntax-token color is a namespaced CSS custom
  property declared in the recipe (light defaults + `_dark` overrides) and mapped
  to Nimbus color tokens; a static `PrismTheme` maps each token type to a
  `var(--code-token-*)`. Light/dark and any future brand redesign touch only
  tokens + recipe — never component logic.
- Internally composed from a registered Chakra slot recipe `nimbusCodeBlock`
  (slots: root, header, languageLabel, copyButton, pre, code, line, lineNumber),
  so future additions (collapsible, word-wrap, filename/title) slot in without an
  API break.
- Accessibility: the outer container is a labelled `role="region"`; the scrollable
  `<pre>` is keyboard-operable; the copy button has an i18n accessible name and
  announces success via an `aria-live` region. No accessible name is ever placed
  on the `<code>` element (ARIA prohibits it on `role=code`).

No breaking changes — this is purely additive.

## Capabilities

### New Capabilities

- `code-block`: A read-only, syntax-highlighted, accessible, token-themed
  block-level code renderer with an optional header (language label), an optional
  copy-to-clipboard button with screen-reader announcement, optional line
  numbers (with an optional `startLineNumber` offset for displaying excerpts at
  their real source line numbers), light/dark theming, and constrained-width
  horizontal-scroll behavior.

### Modified Capabilities

<!-- None. The existing inline `Code` component is unchanged; `CodeBlock` is a new, separate component. -->

## Impact

- **New component**: `packages/nimbus/src/components/code-block/` (full Nimbus
  file set: types, recipe, slots, tsx, constants, stories, i18n, dev.mdx,
  docs.spec.tsx, mdx, index.ts).
- **New dependency**: `prism-react-renderer` (`^2.4.1`) added to
  `packages/nimbus/package.json` `dependencies` (already present in the monorepo
  lockfile via `apps/docs`). Bundle-size CI gate (`pnpm check:bundle-size`) and
  package-shape gate apply.
- **Theme registration**: `nimbusCodeBlock` slot recipe registered in
  `packages/nimbus/src/theme/slot-recipes/index.ts`.
- **Barrel export**: `CodeBlock` + its public types exported from
  `packages/nimbus/src/components/index.ts`.
- **i18n**: new `code-block.i18n.ts` with two messages (`Copy code`, `Copied`);
  requires `pnpm extract-intl` (CI build-breaker if missed).
- **Reuses**: existing `useCopyToClipboard` hook, `IconButton`,
  `VisuallyHidden`, `fontFamily: "mono"` token.
