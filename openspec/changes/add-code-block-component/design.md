## Context

Nimbus has an inline `Code` component (`nimbus-code` spec) but no block-level
code display. The first version on this branch (commits `7009a6253`,
`9551f9305`, `f06559639`) is a single props-driven `CodeBlock` built on
`prism-react-renderer`. It is not released.

`research.md` holds the evidence for this design:

- **Section 1:** features and API shapes of 11 code block components and 8
  highlighting libraries.
- **Section 2:** measured bundle sizes and a synchronous Shiki test.
- **Section 3:** a scan of commercetools repositories. The most common needs are
  copy, formatted JSON, wrap, collapse, and switching between languages with
  download.
- **Section 4:** four defects in the first version.

Constraints:

- WCAG 2.1 AA, with the project rule of 44×44px touch targets
  (`openspec/config.yaml`)
- strict TypeScript
- no inline styles or raw design values; recipes and tokens only
- safe for server rendering
- the bundle-size and package-shape CI gates

## Goals / Non-Goals

**Goals:**

- Cover the needs found in commercetools products with one consistent,
  accessible code block.
- Make the common case easy to find and use, through flat-props patterns.
- Let teams build uncommon layouts from the same parts, through a compound
  component.
- Keep the highlighting engine replaceable without changing the component API.
- Stay at or below today's engine bundle size while adding `bash`, `diff` and
  `http`.

**Non-Goals:**

- Editing code (that is an editor, not a display component).
- Focus/dim lines, error/warning lines, auto-scroll for logs. Each was found 0–1
  times in our repositories. They can be added later on the same `Content` part.
- Remembering the selected language across `CodeSnippetGroup`s (the docs kit
  does this with `localStorage`); deferred until a product needs it.
- Comment notation (`[!code ++]`) or Markdown meta strings (`{1,3-4}`) as an
  API. Props are the API; the Markdown follow-up can map fence meta to props.
- Automatic language detection, virtualization, terminal window frames.
- Interactive JSON trees and copyable secret fields: different components
  (`research.md` §3).
- In this change: Markdown using `CodeBlock`, the docs app switching away from
  `react-syntax-highlighter`, and a Shiki engine entry point. These are
  follow-up changes.

## Decisions

### Decision 1: Three layers, using the documented Component vs Pattern split

`docs/file-type-guidelines/component-vs-pattern.md` says components are
"building blocks" and patterns are "convenience wrappers with a flat-props API"
that do "not need [their] own recipe". The code block maps onto that:

| Layer | What                                                               | Where                        |
| ----- | ------------------------------------------------------------------ | ---------------------------- |
| 1     | `CodeHighlighter` engine interface                                 | `src/components/code-block/` |
| 2     | `CodeBlock` compound component                                     | `src/components/code-block/` |
| 3     | `CodeSnippet`, `CodeSnippetGroup`, `JsonSnippet`, `CommandSnippet` | `src/patterns/code/`         |

All visual treatment lives in the `CodeBlock` recipe, because patterns may not
have their own recipe. A pattern only arranges parts and passes props.

`CodeBlock` follows `compound-components.md`: the main file contains exports
only, and `Root` is the first property.

**Alternatives considered:**

- _Keep the single props-driven component._ Rejected: every layout choice
  becomes a prop (`showHeader`, `showCopyButton`, …). The copy button cannot
  move out of the header, and new needs keep growing the prop list.
- _Make `CodeBlock` itself usable and attach the parts to it with
  `Object.assign`._ Rejected: the team treats this as a legacy approach and does
  not want it repeated.
- _Compound component only, no patterns._ Rejected: most uses are the same few
  layouts, and building them from ten parts every time hurts discoverability and
  consistency.

### Decision 2: Engine — `refractor` by default, behind a small interface

The default engine is `refractor` 5 (Prism grammars, output as a hast tree),
wrapped by `createPrismHighlighter`. Measured cost (`research.md` §2):

| Option                                | Gzip     |
| ------------------------------------- | -------- |
| `prism-react-renderer` (today)        | 26.2 KB  |
| `refractor/core` + 14 languages       | 24.1 KB  |
| Shiki core + JS engine + 14 languages | 167.0 KB |

Why `refractor`:

- It is smaller than today and adds `bash`, `diff` and `http`.
- It registers grammars without changing global objects. `prism-react-renderer`
  needs the Prism instance assigned to `global`/`window` to add a language.
- It is synchronous, so code never flashes as plain text, server rendering
  works, and streamed code is simple.
- Its output is a data tree that we render as React elements, so we never use
  `dangerouslySetInnerHTML`.
- It covers the languages our products use (java, php, csharp, properties, yaml,
  markup, graphql, http); only `dotenv` is missing.

Default languages: tsx, typescript, javascript, jsx, json, css, markup, bash,
yaml, graphql, diff, sql, markdown, http. Default aliases: `ts`, `js`, `html`,
`xml`, `svg`, `sh`, `shell`, `zsh`, `console`, `terminal`, `curl`, `yml`, `md`,
`gql`. The shell aliases follow the commercetools docs kit. `plaintext`, `text`
and `txt` mean "no highlighting".

The interface (TypeScript sketch):

```ts
type CodeToken = { content: string; types: readonly string[] };
type CodeLine = readonly CodeToken[];
type CodeHighlighter = {
  /** Returns the canonical language id, or undefined when unsupported. */
  resolveLanguage(language: string): string | undefined;
  /** One entry per line; no token contains a line break. */
  highlight(
    code: string,
    language: string
  ): readonly CodeLine[] | Promise<readonly CodeLine[]>;
};

createPrismHighlighter(options?: {
  additionalLanguages?: readonly CodeLanguageDefinition[]; // e.g. refractor/java
  aliases?: Readonly<Record<string, string>>;
}): CodeHighlighter;
```

`refractor/core` exports one shared instance, so all highlighters in a bundle
use one grammar registry. Each highlighter keeps its own list of languages and
aliases and resolves only those. A grammar that extends another grammar (for
example `refractor/jsdoc` extends `javascript`) therefore changes that grammar
for every highlighter.

`CodeHighlighterProvider` supplies a highlighter to every `CodeBlock.Root` below
it. Without a provider, a shared default Prism highlighter is used. The name
`additionalLanguages` follows Docusaurus.

The interface allows a `Promise`, so that an asynchronous engine (Shiki with
lazy grammars) can be added later without an API change. While a result is
pending, `Content` shows the code as plain text. When a new result arrives,
older pending results are discarded.

**Alternatives considered:**

- _Keep `prism-react-renderer`._ Rejected: no `bash`/`diff`/`http`, global state
  to add languages, last release 2024-12-11.
- _Shiki as default._ Shiki is actively developed (4.5.0, 2026-10-01) and uses
  VS Code grammars. We tested that it works synchronously and maps colors to our
  `--code-token-*` variables. Rejected as default because it is about 7 times
  larger for the same 14 languages and its first tsx highlight took 94 ms. It is
  kept as a follow-up opt-in entry point
  (`@commercetools/nimbus/code-block/shiki`, Shiki as an optional peer
  dependency). Nimbus already ships subpath entry points such as `./theme`.
- _sugar-high (10.8 KB gzip)._ Rejected: JavaScript-like languages only.
- _highlight.js / lowlight._ Not measured; no advantage over Prism grammars was
  found that would justify a different token vocabulary.

### Decision 3: Rendering and theming — token classes mapped in the recipe

The highlighter returns token types (Prism names such as `keyword`, `string`,
`comment`). `Content` renders each token as a `span` with React text children
and exposes the types as classes. The recipe maps types to namespaced CSS custom
properties (`--code-token-*`) with light defaults and `_dark` overrides. There
are no inline styles. This replaces the static `PrismTheme` object of the first
version, which used inline `style` attributes.

| Variable                   | Prism token types                                        |
| -------------------------- | -------------------------------------------------------- |
| `--code-token-plain`       | everything not listed                                    |
| `--code-token-keyword`     | keyword, atrule, attr-name                               |
| `--code-token-string`      | string, char                                             |
| `--code-token-comment`     | comment, prolog, doctype, cdata                          |
| `--code-token-number`      | number, boolean, constant, symbol, entity, url, variable |
| `--code-token-function`    | function, class-name                                     |
| `--code-token-tag`         | tag, selector                                            |
| `--code-token-attr`        | attr-value                                               |
| `--code-token-punctuation` | punctuation                                              |
| `--code-token-operator`    | operator, regex, important                               |
| `--code-token-inserted`    | inserted (diff grammar)                                  |
| `--code-token-deleted`     | deleted (diff grammar)                                   |

Shiki's CSS-variable theme uses the same `token-*` naming (`token-keyword`,
`token-string`, `token-inserted`, …), so a later Shiki engine can share these
tokens.

### Decision 4: Compound parts

Part names use the vocabulary already common in Nimbus (counted across compound
main files): `Root` (33), `Content` (11), `Header` (9), `Footer` (8), `Title`
(7), `Actions` (5), and `…Trigger` for buttons (`CloseTrigger`, `PrevTrigger`).

| Part                        | Element / role                     | Main props                                                                                                |
| --------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `CodeBlock.Root`            | `section`, `role="region"`         | `code`, `language`, `size`, `maxLines`, `isExpanded`, `defaultExpanded`, `onExpandedChange`, `aria-label` |
| `CodeBlock.Header`          | `div`                              | —                                                                                                         |
| `CodeBlock.Title`           | `span`; names the region           | `children`                                                                                                |
| `CodeBlock.LanguageLabel`   | `span`, `aria-hidden`              | `children` (defaults to the language)                                                                     |
| `CodeBlock.Actions`         | `div`                              | —                                                                                                         |
| `CodeBlock.CopyTrigger`     | icon button                        | `text`, `onCopy`, `onCopyError`, `timeout`                                                                |
| `CodeBlock.DownloadTrigger` | icon button                        | `fileName`, `mimeType`, `text`, `onDownload`                                                              |
| `CodeBlock.Content`         | `pre` (focusable) > `code` > lines | line options (Decision 5)                                                                                 |
| `CodeBlock.ExpandTrigger`   | button                             | `children` for custom labels                                                                              |
| `CodeBlock.Footer`          | `div`                              | —                                                                                                         |

`Root` holds shared state in context:

- normalized code and resolved language
- highlight result
- expanded state
- element ids (`Title`, `Content`)
- one polite live region for announcements

`Actions` placed inside `Header` aligns to the end of the header. `Actions`
placed inside `Content` sits in the top-end corner, in its own column next to the
scroll area, so it never covers code, also when the code scrolls horizontally. This gives a copy button without a
header, which the first version could not do and the Nimbus docs icon dialog
builds by hand.

### Decision 5: Line model

- **Normalization.** Lines are split on `\r\n`, `\n` and `\r`. One trailing line
  break is not rendered as an extra empty line. Copy and download always use the
  original `code` string (or the trigger's `text`).
- **Line selections.** `highlightedLines`, `addedLines`, `removedLines` and
  `outputLines` accept `ReadonlyArray<number | readonly [start, end]>`. Numbers
  are displayed line numbers (`index + startLineNumber`), so they match the
  gutter. Ranges are inclusive. Invalid entries are ignored. Atlassian uses a
  string (`"1-5,7"`); a typed array was chosen for type safety.
- **Precedence.** When a line is in more than one set, the background follows
  the order removed, added, highlighted.
- **Gutter.** The line-number column is at least as wide as the widest displayed
  number (in `ch` units). This fixes the alignment defect.
- **Word highlight.** `highlightedWords: readonly string[]` marks every exact,
  case-sensitive match with a `mark` element, also when a match spans tokens.
- **Prompt.** `prompt` (for example `"$"`) is shown before every line except
  `outputLines`.
- **Wrap.** `wrapLongLines` wraps long lines instead of scrolling. The gutter
  stays on the first visual row, and backgrounds cover all wrapped rows.
- **Not selectable.** Line numbers, prompts, diff markers and announcement text
  use `user-select: none`, so manual text selection copies only code.

### Decision 6: Marked lines are not shown by color alone

This changes the first version's Decision 8 ("visual only"). Highlighted, added
and removed lines carry meaning, and WCAG 1.4.1 (Use of Color) does not allow
meaning by color alone. Atlassian provides `highlightedStartText` for the same
reason.

- **Visible cue that is not color.** Highlighted lines get a start-edge bar.
  Added and removed lines get a `+` / `−` marker column (`aria-hidden`).
- **Screen-reader cue.** Each contiguous run of marked lines gets visually
  hidden start and end text, for example "Highlighted lines start" and
  "Highlighted lines end" (localized). There is one pair per run, not one per
  line, to limit noise.

### Decision 7: Copy, download, expand

- **`CopyTrigger`.**
  - Copies `text ?? code` with the existing `useCopyToClipboard` hook.
  - On success it swaps the icon, announces "Copied" in the Root live region,
    calls `onCopy` once, and resets after `timeout` (default 2000 ms, as in Kibo
    UI and Vercel AI Elements).
  - On failure (the clipboard write throws) it announces "Copy failed" and
    calls `onCopyError` with the error. When the browser can only offer a
    manual-copy prompt, this is not a failure.
  - It works anywhere inside `Root`.
- **`DownloadTrigger`.**
  - Creates a `Blob` from `text ?? code` (default MIME type
    `text/plain;charset=utf-8`) and starts a download named `fileName`.
  - Browser APIs are used only on press, so server rendering is safe.
  - Found in 3 product places (`research.md` §3); none of the researched
    libraries offer it.
- **Expand.**
  - When `maxLines` is set and the code has more lines, `Content` renders only
    the first `maxLines` lines while collapsed, so the visible text and the
    screen-reader text match.
  - `ExpandTrigger` renders only in that case. It shows the localized "Show
    more" / "Show less" text, sets `aria-expanded`, and its `aria-controls`
    points to the `Content` id.
  - Expanded state can be controlled (`isExpanded`, `onExpandedChange`) or
    uncontrolled (`defaultExpanded`), following `CollapsibleMotion`.
  - There is no height animation in v1.

### Decision 8: Accessibility structure

- **Region name.** The order is: `aria-label` on Root, then the `Title` text
  (through `aria-labelledby`), then the localized default "Code block".
- **No name on `code`.** `<code>` never has an accessible name, because ARIA
  prohibits it.
- **Focusable code area.** The `pre` keeps `tabIndex={0}` so overflowing code
  can be scrolled with the keyboard (WCAG 2.1.1, axe
  `scrollable-region-focusable`).
- **Tab order.** It follows DOM order. The docs keyboard table must describe the
  real order, which fixes the docs defect.
- **Touch targets.** `CopyTrigger`, `DownloadTrigger` and `ExpandTrigger` have a
  pointer target of at least 44×44px. When the visible button is smaller (the
  `sm` size), the hit area is extended beyond the visible box.
- **Contrast.** Token colors keep the contrast rule of the first version (shade
  11/12 on `neutral.2`, documented in the recipe).

### Decision 9: Streaming

`Root` accepts a `code` that changes often (Markdown and chat streams):

- The highlight result is memoized by `(code, language, highlighter)`.
- Line elements are keyed by index, so the `pre` is reused and its scroll
  position stays.
- `Header` and `Actions` do not remount.
- Unfinished code (for example an open string) is highlighted without errors.

Throttling is left to the caller (react-shiki offers `delay` for the same
reason).

### Decision 10: Patterns

All patterns live in `src/patterns/code/` and are exported through
`src/patterns/index.ts`. They follow the existing pattern file set (no recipe,
no slots).

- **`CodeSnippet`** — `code`, `language`, `title`, `showLanguage` (default
  `true`), `showCopyButton` (default `true`), `downloadFileName`, all `Content`
  line options, `maxLines`, `defaultExpanded`, `size`, `aria-label`, `onCopy`,
  `footer`.
  - A `Header` is rendered when a title or the language label is shown.
  - Otherwise the actions float inside `Content`.
- **`CodeSnippetGroup`** —
  `items: { key, label, code, language?, fileName? }[]`,
  `switcher: "tabs" | "select"` (default `"tabs"`), `selectedKey`,
  `defaultSelectedKey`, `onSelectionChange` (names as in Nimbus `Tabs`), and
  shared snippet options.
  - Built from `CodeBlock` parts plus Nimbus `Tabs` or `Select`.
  - Copy and download act on the selected item.
  - The download button is shown when the selected item has a `fileName`.
  - The select gets a localized accessible name.
- **`JsonSnippet`** — `value: unknown`, `indent` (default 2), and the
  `CodeSnippet` options except `code`/`language`. It formats with
  `JSON.stringify` and never throws: circular references become `"[Circular]"`,
  and `BigInt` values become their decimal string.
- **`CommandSnippet`** — `command`, `language` (default `bash`), `prompt`
  (default `"$"`), `outputLines`, `size`, `aria-label`, `onCopy`.
  - No header.
  - Copy floats inside `Content` and copies the command without prompts.

### Decision 11: Names and discoverability

- **`CodeBlock`.** The component keeps this name: it is the block sibling of
  inline `Code`, and the name Chakra uses for its compound API.
- **"Snippet" for the patterns.** The dashboard named both of its stand-ins
  `CodeSnippet`, and IBM Carbon uses `CodeSnippet`.
- **Docs search.** `CodeSnippet` and `CodeSnippetGroup` contain "Code", and
  `JsonSnippet` and `CommandSnippet` match the words people search for ("json",
  "command").
- **Cross-links.** Patterns appear in a separate docs section. The `CodeBlock`
  docs ("When to use") therefore start with a table that points to the four
  patterns, and each pattern links back to `CodeBlock` for custom layouts.

## Risks / Trade-offs

- [Prism grammars are no longer actively developed; prismjs 1.30.0 is from
  2025-03-10] → The engine interface allows a different engine without an API
  change. Shiki is planned as an opt-in entry point.
- [All highlighters share refractor's grammar registry, so a grammar that
  extends another one (`jsdoc`, `js-extras`, `css-extras`) applies to every
  highlighter in the bundle] → Accepted: these grammars only add tokens. Each
  highlighter still resolves only its own languages and aliases.
- [Extra grammars come from `refractor/<language>`, which ties the
  `additionalLanguages` type to refractor and needs `refractor` as a consumer
  dependency under strict pnpm] → Expose our own `CodeLanguageDefinition` type
  alias and document the install step. See Open Questions.
- [An asynchronous engine shows plain text first; with streaming this can
  flicker] → Keep showing the last highlighted result until the new one arrives.
  This only applies to future asynchronous engines.
- [`tabIndex={0}` on `pre` adds a tab stop even when nothing overflows] → Kept
  from the first version for simplicity; a later refinement can set it only when
  the content overflows.
- [`CodeBlock.Title` is detected after mount, so server-rendered HTML names the
  region "Code block" until the page hydrates] → Documented on the Title prop;
  set `aria-label` on Root where the server HTML matters.
- [Very long code renders every line; there is no virtualization] → `maxLines`
  limits the rendered lines while collapsed.
- [Some screen readers announce `mark` elements] → Accepted: word highlights are
  meaningful emphasis.
- [44×44px touch targets conflict with the compact `sm` copy button (24px high
  on this branch)] → Extend the hit area with a pseudo-element; the visible size
  stays compact.
- [Patterns use `Tabs` and `Select`] → Both are already in Nimbus; consumers who
  do not use `CodeSnippetGroup` do not pay for them (tree shaking).

## Migration Plan

The component is not released, so no consumer migration is needed. On this
branch:

1. Replace `prism-react-renderer` with `refractor` in
   `packages/nimbus/package.json`.
2. Move the flat API to `CodeSnippet`. Old props map like this:
   - `code`, `language`, `showLineNumbers`, `startLineNumber`,
     `highlightedLines`, `showCopyButton`, `size`, `aria-label`, `onCopy`: same
     names.
   - `showHeader={false}`: `showLanguage={false}` with no `title`.
3. Rebuild `CodeBlock` as the compound component, move existing stories and
   docs, and rewrite the unreleased changeset.

Rollback: revert the change; nothing else depends on it.

## Open Questions

- **Extra languages.** Should Nimbus re-export a curated set of extra grammars
  (for example java, php, csharp) from a subpath, so consumers do not need a
  direct `refractor` dependency?
- **Global highlighter.** Should the highlighter also be configurable on
  `NimbusProvider`, in addition to `CodeHighlighterProvider`?
- **Tabs or select.** For `CodeSnippetGroup`, should the docs recommend a number
  of items above which `switcher="select"` is preferred? The developer settings
  page uses a select for about 15 formats.
