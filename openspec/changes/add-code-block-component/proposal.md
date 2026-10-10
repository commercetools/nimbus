## Why

Nimbus has an inline `Code` component but no way to show a block of source code
with syntax highlighting. Products build their own: the dashboard has two
`CodeSnippet` stand-ins (one says it exists because Nimbus `CodeBlock` "didn't
make it into the published bundle"), merchant-center-frontend shows JSON, curl
commands and multi-language snippets with hand-made `pre` blocks, and Nimbus
`Markdown` renders code fences as plain text while its docs promise "a richer
`CodeBlock`" as a fast-follow. See `research.md` for the evidence.

The first version on this branch (a single props-driven `CodeBlock`) does not
cover these needs: the copy button exists only inside the header, there is no
title, wrap, collapse, download, diff or language switch, and `bash` gets no
colors. The component is not released yet, so we can change its structure now at
no cost to consumers.

## What Changes

The code block becomes three layers, following the Component vs Pattern split in
`docs/file-type-guidelines/component-vs-pattern.md`:

- **Layer 1 — highlighting engine.** A small `CodeHighlighter` interface that
  turns code into lines of typed tokens. The default implementation,
  `createPrismHighlighter`, uses `refractor` (Prism grammars) with 14 bundled
  languages, including `bash`, `diff` and `http`. Consumers can add languages
  and aliases, or supply their own engine through `CodeHighlighterProvider`.
  **BREAKING (unreleased):** `prism-react-renderer` is replaced by `refractor`.
- **Layer 2 — `CodeBlock` compound component** (`src/components/code-block/`).
  Parts: `CodeBlock.Root`, `.Header`, `.Title`, `.LanguageLabel`, `.Actions`,
  `.CopyTrigger`, `.DownloadTrigger`, `.Content`, `.ExpandTrigger`, `.Footer`.
  New capabilities on these parts: copy and download anywhere in the block,
  title that names the region, line ranges, added/removed lines, word highlight,
  command prompts, wrap long lines, maximum lines with expand/collapse, and safe
  updates for streamed code. **BREAKING (unreleased):** the flat `CodeBlock`
  props API on this branch is removed; its behavior moves to the `CodeSnippet`
  pattern.
- **Layer 3 — patterns** (`src/patterns/code/`), each with a flat-props API and
  no own recipe:
  - `CodeSnippet` — the default snippet: title, language label, copy, download,
    and all line options.
  - `CodeSnippetGroup` — several snippets with one visible at a time, switched
    by tabs or a select.
  - `JsonSnippet` — formats any value as JSON.
  - `CommandSnippet` — shell commands with a prompt that is not copied.
- Fixes found in the first version: aligned line-number gutter, no extra empty
  line for a trailing newline, colors for `bash`, and correct keyboard order in
  the docs.

## Capabilities

### New Capabilities

- `nimbus-code-block`: the highlighting engine interface, the default Prism
  highlighter, the highlighter provider, and the `CodeBlock` compound component
  with all its parts.
- `nimbus-code-snippet`: the `CodeSnippet` pattern.
- `nimbus-code-snippet-group`: the `CodeSnippetGroup` pattern.
- `nimbus-json-snippet`: the `JsonSnippet` pattern.
- `nimbus-command-snippet`: the `CommandSnippet` pattern.

### Modified Capabilities

<!-- None. `nimbus-code` (inline Code) and `nimbus-markdown` are unchanged.
     Switching Markdown code fences to CodeBlock is a separate follow-up change. -->

## Impact

- **New code**: `packages/nimbus/src/components/code-block/` (compound
  component, highlighter, provider) and `packages/nimbus/src/patterns/code/`
  (four patterns), with stories, docs and consumer tests.
- **Dependencies**: remove `prism-react-renderer` from
  `packages/nimbus/package.json`; add `refractor` (`^5.0.0`). Measured engine
  size: 24.1 KB gzip with 14 languages, compared with 26.2 KB gzip for
  `prism-react-renderer` today. `pnpm check:bundle-size` and
  `pnpm check:package-shape` apply.
- **Exports**: `CodeBlock`, `CodeHighlighterProvider`, `createPrismHighlighter`,
  `defaultCodeLanguages` and their types from the components barrel;
  `CodeSnippet`, `CodeSnippetGroup`, `JsonSnippet`, `CommandSnippet` from the
  patterns barrel.
- **Theme**: the `nimbusCodeBlock` slot recipe gets new slots; it stays
  registered in `packages/nimbus/src/theme/slot-recipes/index.ts`.
- **i18n**: new messages for download, show more / show less, marked-line
  announcements, copy failure, the snippet-group switcher label, and the command
  region label; requires `pnpm extract-intl`.
- **Changeset**: the unreleased `add-code-block-component` changeset is
  rewritten to describe the final API.
- **Not changed here** (follow-up changes): Nimbus `Markdown` using `CodeBlock`
  for fences, the Nimbus docs app replacing `react-syntax-highlighter`, an
  optional Shiki engine entry point.
