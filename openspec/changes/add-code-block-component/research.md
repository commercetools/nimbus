# Research: CodeBlock feature set, engine, and structure

This file records the evidence behind `proposal.md` and `design.md`. It has four
parts:

1. What other libraries offer (web research)
2. Which highlighting engine to use (measurements)
3. What commercetools products need today (local repository scan)
4. Defects found in the first `CodeBlock` version on this branch

Research date: 2026-10-10.

## 1. What other libraries offer

### Method

Three research passes. Each pass used Claude Haiku agents only:

- search the web for official docs
- read the pages and copy quotes for each feature claim
- check each claim with 3 independent agents, which try to refute it

A claim was dropped when 2 of 3 checkers refuted it.

| Pass | Scope                                                     | Claims | Kept |
| ---- | --------------------------------------------------------- | ------ | ---- |
| 1    | Design systems and docs tools                             | 101    | 61   |
| 2    | Libraries with no data in pass 1, and Mantine again       | 57     | 31   |
| 3    | React highlighting libraries and compound code block APIs | 229    | 204  |

In pass 3, only one checker judged the exact wording of the quote. 123 of the
204 kept claims have a correct meaning and API name, but a reworded quote. Some
pages were read through a summarizing fetch tool. Confirm exact prop names in
the library source before copying an API.

### Libraries with a block-level code component

| Library            | Component                            | Source                                                                                                                   |
| ------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Chakra UI v3       | `CodeBlock` (compound)               | https://chakra-ui.com/docs/components/code-block                                                                         |
| Mantine            | `CodeHighlight`, `CodeHighlightTabs` | https://mantine.dev/code-highlight/code-highlight/                                                                       |
| Atlassian          | `CodeBlock`                          | https://developer.atlassian.com/platform/forge/ui-kit/components/code-block/                                             |
| IBM Carbon         | `CodeSnippet`                        | https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/CodeSnippet/CodeSnippet.tsx       |
| Ant Design X       | `CodeHighlighter`                    | https://ant-design-x.antgroup.com/components/code-highlighter                                                            |
| MUI X (Preview)    | `ChatCodeBlock`                      | https://mui.com/x/react-chat/material/examples/code-block/                                                               |
| Docusaurus         | `@theme/CodeBlock`                   | https://github.com/facebook/docusaurus/blob/main/website/docs/guides/markdown-features/markdown-features-code-blocks.mdx |
| Expressive Code    | `<Code>`                             | https://expressive-code.com/key-features/frames/                                                                         |
| Kibo UI            | `CodeBlock*` parts (shadcn registry) | https://www.kibo-ui.com/components/code-block                                                                            |
| Vercel AI Elements | `CodeBlock*` parts (shadcn registry) | https://elements.ai-sdk.dev/components/code-block                                                                        |
| Fumadocs           | `CodeBlock`, `Pre`                   | https://fumadocs.dev/docs/ui/components/codeblock                                                                        |

No block-level code component was found in GitHub Primer or React Spectrum 2.
The result for Shopify Polaris is unclear.

### React highlighting libraries

| Library                  | API shape                                                                                                  | Source                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| prism-react-renderer     | `Highlight` render function, `getLineProps`, `getTokenProps`, `useTokenize`                                | https://raw.githubusercontent.com/FormidableLabs/prism-react-renderer/master/README.md               |
| react-syntax-highlighter | Props (`showLineNumbers`, `startingLineNumber`, `wrapLongLines`, `lineProps`, `renderer`)                  | https://raw.githubusercontent.com/react-syntax-highlighter/react-syntax-highlighter/master/README.md |
| Shiki                    | Transformers that read comment notation (`[!code ++]`, `[!code focus]`, `[!code error]`, `[!code word:x]`) | https://shiki.style/packages/transformers                                                            |
| react-shiki              | `ShikiHighlighter` component, `useShikiHighlighter` hook                                                   | https://github.com/AVGVSTVS96/react-shiki                                                            |
| Code Hike                | Annotation handlers on `Pre`, render props per line and token                                              | https://codehike.org/docs/concepts/annotations                                                       |
| Bright                   | Server component, props `title`, `lineNumbers`                                                             | https://bright.codehike.org/                                                                         |
| lowlight / refractor     | Output is a tree of objects (hast); `register`, `alias`                                                    | https://raw.githubusercontent.com/wooorm/refractor/main/readme.md                                    |
| react-code-blocks        | Props `highlight="1-5"`, `startingLineNumber`; `CopyBlock`                                                 | https://raw.githubusercontent.com/rajinwonderland/react-code-blocks/master/README.md                 |

### Feature catalog with API shapes

Each row lists libraries with a verified claim. Quotes are from the cited page.

| Feature                                  | Who offers it, and how                                                                                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Line numbers and start number            | Docusaurus `showLineNumbers=3`; react-syntax-highlighter `startingLineNumber`; react-shiki `startingLineNumber`; Shiki `transformerRenderLineNumber` option `start`                                     |
| Line highlight                           | Atlassian `highlight` ("Comma delimited lines to highlight."); Chakra `meta.highlightLines`; react-shiki `highlightLineNumbers`                                                                         |
| Line ranges                              | Docusaurus `{1,4-6,11}`; Expressive Code `{4-8}`; Shiki meta `{1,3-4}`; react-code-blocks `highlight="1-5"`                                                                                             |
| Screen-reader text for highlighted lines | Atlassian `highlightedStartText`: "Screen reader text for the start of a highlighted line."                                                                                                             |
| Word wrap                                | Atlassian `shouldWrapLongLines` ("When set to `true`, these lines will visually wrap instead."); Carbon `wrapText`; Chakra `meta.wordWrap`; react-syntax-highlighter `wrapLongLines`                    |
| Title / file name                        | Chakra `CodeBlock.Title`; Docusaurus `title`; Expressive Code `title`, `extractFileNameFromCode`; Bright `title`; Vercel `CodeBlockFilename`; Kibo `CodeBlockFilename` with `icon`                      |
| Copy button as its own part              | Chakra `CopyTrigger`; Vercel `CodeBlockCopyButton` (`onCopy`, `onError`, `timeout`); Kibo `CodeBlockCopyButton` (`timeout`, default `2000`)                                                             |
| Custom copy text                         | Carbon `copyText`: "Optional text to copy."                                                                                                                                                             |
| Copy feedback                            | Carbon `feedback`, `feedbackTimeout`; Mantine `copyLabel` / `copiedLabel`                                                                                                                               |
| Collapse / show more                     | Carbon `maxCollapsedNumberOfRows`, `showMoreText`, `showLessText`; Mantine `withExpandButton`, `defaultExpanded`; Chakra `meta.maxLines`, `CollapseTrigger`                                             |
| Header actions                           | Vercel `CodeBlockActions`; Ant Design X `header`; Mantine `controls` with `CodeHighlightControl`                                                                                                        |
| Tabs / several files                     | Mantine `CodeHighlightTabs`; Docusaurus `<Tabs>` + `<TabItem>`; Kibo `CodeBlockFiles`; Code Hike `CodeWithTabs`                                                                                         |
| Language switch                          | Vercel `CodeBlockLanguageSelector` ("switch between implementations of the same code in different languages")                                                                                           |
| Diff (added / removed lines)             | Chakra `meta.addedLineNumbers` / `meta.removedLineNumbers`; Shiki `[!code ++]` / `[!code --]`; Code Hike `// !diff`; Expressive Code `ins` / `del`                                                      |
| Word highlight                           | Shiki `[!code word:Hello]` and meta `/Hello/`; Expressive Code `"given text"`, `/ye[sp]/`                                                                                                               |
| Focus / dim other lines                  | Shiki `transformerNotationFocus`; Code Hike `!focus`; Kibo uses blur on unfocused lines                                                                                                                 |
| Error / warning lines                    | Shiki `transformerNotationErrorLevel` (`[!code error]`, `[!code warning]`)                                                                                                                              |
| Pluggable engine                         | Chakra `AdapterProvider`, `createShikiAdapter`, `createHighlightJsAdapter`; Mantine `CodeHighlightAdapterProvider`; MUI X `highlighter` ("intentionally does not bundle a syntax-highlighting library") |
| Streaming                                | react-shiki `delay` ("Minimum ms between highlights")                                                                                                                                                   |
| Virtualization                           | react-syntax-highlighter `renderer`                                                                                                                                                                     |
| Terminal frame                           | Expressive Code `frame`; react-code-blocks terminal                                                                                                                                                     |

Part names used by more than one compound API: `Header`, `Content`,
`CopyButton`, `Filename`.

## 2. Highlighting engine

### Bundle size

Measured with esbuild 0.25 (`minify: true`, `format: "esm"`,
`platform: "browser"`, React marked as external), then gzip. The entry imports
the engine and the listed grammars.

| Option                                             | Minified  | Gzip        |
| -------------------------------------------------- | --------- | ----------- |
| prism-react-renderer 2.4.1 (current)               | 84.2 KB   | 26.2 KB     |
| refractor 5.0.0 `refractor/core`, no languages     | 30.0 KB   | 11.0 KB     |
| **refractor/core + 14 languages (below)**          | 65.7 KB   | **24.1 KB** |
| refractor default entry (36 common languages)      | 111.6 KB  | 38.5 KB     |
| Shiki 4.5.0 core + JavaScript engine, no languages | 164.3 KB  | 53.7 KB     |
| Shiki + tsx, json, css, bash, yaml, graphql        | 979.8 KB  | 137.9 KB    |
| Shiki + the same 14 languages                      | 1155.5 KB | 167.0 KB    |
| sugar-high 2.6.0 (JavaScript-like only)            | 29.5 KB   | 10.8 KB     |

The 14 languages: tsx, typescript, javascript, jsx, json, css, markup (HTML),
bash, yaml, graphql, diff, sql, markdown, http.

prism-react-renderer bundles a fixed grammar set. It has no `bash`, `diff` or
`http` grammar (checked by listing `Prism.languages` in version 2.4.1).

### Measured in the Nimbus build

Measured after tasks 1–2, with `pnpm build:packages` and
`pnpm check:bundle-size` (baseline: the comment chain on `main`). At that point
the build contained both engines: `prism-react-renderer` through the
first-version `CodeBlock`, and refractor through the new exports.

| Item                                                       | ES chunk raw | ES chunk gzip |
| ---------------------------------------------------------- | ------------ | ------------- |
| refractor + 14 languages (`code-highlighter-provider-*`)   | 62.2 KB      | 20.9 KB       |
| Chunk with prism-react-renderer (`no-op-*`), see note      | 114.7 KB     | 31.5 KB       |

The prism chunk also contains the first-version `CodeBlock` code and
`copy-to-clipboard`, so its prism-only share is smaller than shown. The ES output
is mangled but not whitespace-minified.

The bundle-size gate sums every file in `dist` (ES, CJS, `.d.ts` and source
maps) and allows 5% growth:

| State                                           | `dist` total | Compared with `main` |
| ----------------------------------------------- | ------------ | -------------------- |
| First-version `CodeBlock` only (computed)       | 21668.9 KB   | +3.26%               |
| Plus the refractor engine (measured)            | 22159.0 KB   | +5.59% (gate fails)  |
| refractor engine files, all formats and maps    | 484.4 KB     | of which 109.2 KB JS |
| prism chunk files, all formats and maps         | 681.0 KB     | of which 202.1 KB JS |

The gate failure is temporary: task 4.9 removes `prism-react-renderer`. The
budget left for the compound parts and the patterns is not known yet; run the
check again after section 4.

### Maintenance (npm registry, 2026-10-10)

| Package              | Latest  | Released   | Weekly downloads |
| -------------------- | ------- | ---------- | ---------------- |
| prism-react-renderer | 2.4.1   | 2024-12-11 | 5.1 M            |
| prismjs              | 1.30.0  | 2025-03-10 | 33.4 M           |
| refractor            | 5.0.0   | 2025-03-11 | 10.6 M           |
| shiki                | 4.5.0   | 2026-10-01 | 24.9 M           |
| highlight.js         | 11.12.0 | 2026-08-12 | 38.6 M           |
| lowlight             | 3.3.0   | 2024-12-14 | 13.5 M           |

### Shiki test

A script created a Shiki 4.5.0 highlighter with `createHighlighterCoreSync`,
`createJavaScriptRegexEngine()` and
`createCssVariablesTheme({ variablePrefix: "--code-" })`, then called
`codeToTokens`. Results:

- The result is not a Promise (synchronous use works).
- Token colors are CSS variables, for example
  `["import", "var(--code-token-keyword)"]`. These match the `--code-token-*`
  names in the current recipe.
- Bash works: `["npm", "var(--code-token-function)"]`.
- Creating the highlighter took 2.6 ms. The first tsx highlight took 94.4 ms
  (Node 24.12.0, this machine; one run).

Shiki's CSS-variable theme uses these names: `token-link`, `token-string`,
`token-comment`, `token-constant`, `token-keyword`, `token-parameter`,
`token-function`, `token-string-expression`, `token-punctuation`,
`token-inserted`, `token-deleted`, `token-changed`, plus 16 `ansi-*` names.

### refractor language coverage

Checked in `refractor@5.0.0/lang`: java, php, csharp, properties, yaml, markup,
bash, shell-session, diff, http, json, graphql, sql, python, go, ruby, swift,
kotlin, ini, toml, docker are present. `dotenv` is not present.

### What we do not know

- How much more accurate Shiki highlighting is than Prism grammars for our
  languages. We measured size and speed, not accuracy.
- Whether the first-highlight time of Shiki is acceptable in a browser. We
  measured in Node only.

## 3. What commercetools products need today

### Method

Four Claude Haiku agents searched these repositories read-only:
`/Volumes/Code/mcf-repos/maintained/*` (merchant-center-frontend,
merchant-center-application-kit, merchant-center-e2e-custom-view,
merchant-center-prices, merchant-center-services, audit-log, identity, ui-kit,
nimbus, mc-ai-tooling, test-data, test-data-generation),
`/Volumes/Code/mcf-repos/apps/*` (dashboard, dashboard-api),
`/Volumes/Code/mcf-repos/packages/*`, and `ui-kit-docs-poc`. Eight key findings
were re-checked by hand and were correct.

Not covered: six of the nine Nimbus consumers in
`packages/nimbus-consumer-registry` (for example checkout-anywhere,
commerce-agents) are not checked out on this machine.

### Findings by use case

**Formatted JSON (most common in product UIs)**

- merchant-center-frontend: MCP response-filtering rules
  (`response-filtering-policies-tab.tsx:85`, `JSON.stringify(value, null, 2)`
  inside Nimbus `Code as="pre"`), Connect installation logs, PIM search query
  example (`more-info.tsx:170`, indent 4), API playground response.
- audit-log: about 8 render sites with `JSON.stringify(…, null, 2)`, for example
  `json-value.tsx`, `price-attribute.tsx`. Large values open in a modal
  (`custom-object-presenter.tsx`, limits of 12 lines / 2000 characters).
- identity: error details (`src/app/error/page.tsx:45`) in a collapsible panel
  with a 400px maximum height.
- merchant-center-application-kit playground: echo-server result.

**Snippets in several languages, with copy and download**

- merchant-center-frontend developer settings
  (`developer-settings-api-client-usage-examples.jsx`): a `SelectInput` to
  switch between about 15 formats (curl, CLI, Java, PHP, .NET, JS, YAML, .env,
  and more), `CopyableToClipboard`, `DownloadToFile` with a file name per
  language, `white-space: pre-wrap`, dark card.
- commercetools docs kit (`@commercetools-docs/ui-kit` 24.11.0, used by
  merchant-center-application-kit): `CodeBlock` props `language`,
  `highlightLines`, `noPromptLines`, `secondaryTheme`; `MultiCodeBlock` with a
  language `<select>`, choice saved in `localStorage`; language aliases `sh`,
  `zsh`, `console`, `terminal`, `curl` → `bash`.
- Nimbus docs icon dialog (`icon-detail.tsx:82-101`): four usage snippets in
  tabs, with a copy button.

**Source excerpts with line numbers and highlighted lines**

- dashboard `apps/dashboard/src/shared/ui/code-snippet.tsx`: Shiki with
  `dangerouslySetInnerHTML`, line numbers, highlighted line range, start line.
- dashboard `apps/dashboard/src/features/nimbus/code-snippet.tsx:12-16`: "a
  generic stand-in for Nimbus `CodeBlock`, which didn't make it into the
  published bundle".
- Expand/collapse per snippet and a "view on GitHub" link below the snippet
  (`component-detail.tsx`, `anti-patterns.tsx`).

**Commands**

- merchant-center-frontend: curl command for a new API client with copy
  (`created-api-client.tsx:152-163`).
- Nimbus docs: `npm install @commercetools/nimbus` with no header
  (`code-block.mdx`).
- docs kit: `noPromptLines` for console blocks.

**Collapse and maximum height**

- merchant-center-frontend Connect operation report (`CollapsibleMotion`).
- identity error page (collapse + 400px maximum height).
- dashboard live job output (280px maximum height, auto-scroll, streamed).

**Diff**

- dashboard fix queue shows a `package.json` diff as plain text
  (`fix-queue.tsx:66-79`).
- ui-kit Storybook docs have 6 `diff` fences.

**Markdown and chat**

- Nimbus `Markdown` renders code fences as a plain `pre`
  (`markdown.renderers.tsx:165-179`). Its docs say: "a richer `CodeBlock` is a
  planned fast-follow" (`markdown.mdx:36-38`).
- Nimbus docs MDX uses `/word/` fence markers that nothing renders today
  (`docs/list.mdx:70`, `docs/layout.mdx:90,104,128`).

### Feature frequency

| Feature                          | Sites found | Plan in this change                                           |
| -------------------------------- | ----------- | ------------------------------------------------------------- |
| Copy (with feedback)             | 15+         | v1                                                            |
| Formatted JSON                   | 15+         | v1 (`JsonSnippet`)                                            |
| Wrap long lines                  | 6           | v1                                                            |
| Collapse / maximum lines         | 5           | v1                                                            |
| Language or file switch          | 3           | v1 (`CodeSnippetGroup`)                                       |
| Download                         | 3           | v1                                                            |
| Line numbers, highlight, ranges  | 3           | v1                                                            |
| Commands (copy, optional prompt) | 3           | v1 (`CommandSnippet`)                                         |
| Diff                             | 2           | v1                                                            |
| Word highlight                   | 4 fences    | v1                                                            |
| Streaming                        | 2           | v1 (component is safe for it); Markdown switch is a follow-up |
| Auto-scroll for logs             | 1           | Later                                                         |
| Focus / error lines              | 0           | Later                                                         |
| Interactive JSON tree            | 5           | Out of scope (different component)                            |
| Copyable secret fields           | 6           | Out of scope (different component)                            |

## 4. Defects in the first version on this branch

Found while analyzing commits `7009a6253`, `9551f9305`, `f06559639`.

1. **Line-number gutter is not aligned.** The `lineNumber` slot has no width. A
   browser test with the recipe's CSS showed code starting at x=49px on line 9
   and x=57px on line 10.
2. **No colors for `bash`.** Design Decision 6 said bash/shell is "covered by
   the prism core that ships with prism-react-renderer". It is not (see section
   2). The docs use `language="bash"`.
3. **A trailing newline adds an empty line.** With prism-react-renderer 2.4.1,
   `"a\nb\n"` produces 3 lines, and the empty line gets a line number.
4. **Wrong keyboard order in the docs.** `code-block.mdx` says Tab reaches the
   code area first, then the copy button. The header comes first in the DOM, so
   the copy button is reached first.
