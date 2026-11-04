---
"@commercetools/nimbus": minor
---

### CodeBlock

`CodeBlock`: new compound component for read-only, syntax-highlighted code.
Compose `CodeBlock.Root` with `Header`, `Title`, `LanguageLabel`, `Actions`,
`CopyTrigger`, `DownloadTrigger`, `Content`, `ExpandTrigger` and `Footer`.

- Highlighting for tsx, typescript, javascript, jsx, json, css, html, bash,
  yaml, graphql, diff, sql, markdown and http, with aliases such as `ts`, `sh`
  and `yml`. Add more languages with
  `createPrismHighlighter({ additionalLanguages })` and
  `CodeHighlighterProvider`, or plug in your own highlighter.
- Line numbers with a start offset, highlighted lines and ranges, added and
  removed lines with `+`/`−` markers, word highlights, command prompts with
  output lines, and wrapping of long lines. Marked lines are announced to screen
  readers, and numbers, prompts and markers are never copied.
- Copy and download buttons anywhere in the block, including next to the code
  without a header. Copy results are announced, and `onCopy` / `onCopyError`
  report them.
- Long code can start collapsed with `maxLines` and a "Show more" button.
- A block is a named region only when it has `aria-label` or a `Title`.
- Light and dark mode, `sm` and `md` sizes.

### Patterns

New patterns built on `CodeBlock`:

- `CodeSnippet`: one snippet with title, language, copy and download.
- `CodeSnippetGroup`: one example in several languages, switched by tabs or a
  select.
- `JsonSnippet`: any value as formatted JSON.
- `CommandSnippet`: shell commands with a prompt that is not copied.
