> The previous task list (sections 1–15) built the first, single-component
> version in commits `7009a6253`, `9551f9305` and `f06559639`. This list
> replaces it. Reuse existing code, stories and docs where the task says so.

## 1. Engine (Layer 1)

- [x] 1.1 In `packages/nimbus/package.json`, add `refractor` (`^5.0.0`, through
      the `utils` catalog) and run `pnpm install`. `prism-react-renderer` is
      removed in 4.9, together with the first-version code that imports it.
- [x] 1.2 Create `code-block/highlighter/code-highlighter.types.ts` with
      `CodeToken`, `CodeLine`, `CodeHighlighter`, `CodeLanguageDefinition` and
      `CodeLineSelection`, each with JSDoc.
- [x] 1.3 Create `code-block/highlighter/create-prism-highlighter.ts`: the
      shared `refractor/core` registry with a separate language and alias list
      per highlighter, the 14 default languages, the default aliases, `plaintext`/`text`/`txt` as no highlighting,
      `additionalLanguages`, `aliases`, `resolveLanguage`, and a hast-to-lines
      conversion that splits multi-line text nodes and keeps the token types of
      all ancestor elements.
- [x] 1.4 Export `defaultCodeLanguages` (the default language ids).
- [x] 1.5 Create `code-block/highlighter/code-highlighter-provider.tsx` with its
      context and a shared default highlighter; it renders no DOM element; set
      `displayName`.
- [x] 1.6 Unit tests (`create-prism-highlighter.spec.ts`): lines reproduce the
      input, a three-line block comment is split per line, bash code gets
      non-plain tokens, `sh` resolves to bash, unknown and plain languages
      return plain tokens, `additionalLanguages` adds Java, two highlighters are
      isolated, no global object changes, an unterminated string does not throw.

## 2. Shared utilities and hooks

- [x] 2.1 `code-block/utils/normalize-lines.ts`: split on `\r\n`, `\n`, `\r`;
      drop one trailing line break. Unit tests for CRLF, CR, trailing newline,
      empty string.
- [x] 2.2 `code-block/utils/line-selection.ts`: turn a `CodeLineSelection` into
      a set of displayed line numbers (inclusive ranges, ignore non-integers and
      reversed ranges) and group marked lines into contiguous runs. Unit tests.
- [x] 2.3 `code-block/utils/highlight-words.ts`: split token runs at exact,
      case-sensitive word matches, also across token borders, and keep token
      types. Unit tests.
- [x] 2.4 `code-block/hooks/use-highlighted-lines.ts`: memoize by code, language
      and highlighter; for Promise results render plain lines first, keep the
      last highlighted result while a new one is pending, and discard outdated
      results. Unit tests with a fake async highlighter.

## 3. Recipe, slots and types

- [x] 3.1 Rewrite `code-block.recipe.ts` (slot recipe `nimbusCodeBlock`): slots
      for root, header, title, languageLabel, actions, trigger, content, pre,
      code, line, lineNumber, marker, prompt, lineContent, expandTrigger,
      footer; token-class →
      `--code-token-*` mapping from design Decision 3 including
      `inserted`/`deleted`; highlighted start-edge bar and background;
      added/removed backgrounds; actions inside content in a column next to the
      scroll area; gutter width in `ch` (set by `Content`); wrap styles; `user-select: none` on
      numbers, prompts, markers and announcement text; extended 44×44px hit area
      for triggers; `size` `sm`/`md`. Keep the existing contrast notes.
- [x] 3.2 Confirm the recipe is still registered as `nimbusCodeBlock` in
      `packages/nimbus/src/theme/slot-recipes/index.ts`, then run
      `pnpm --filter @commercetools/nimbus build-theme-typings`.
- [x] 3.3 Rewrite `code-block.slots.tsx` for the new slots, each with a
      `SlotComponent` return type.
- [x] 3.4 Rewrite `code-block.types.ts` with the four-layer type structure:
      recipe props, slot props, helper types, and the props of every part, with
      JSDoc and `@default` tags.

## 4. CodeBlock parts (Layer 2)

- [x] 4.1 `code-block.context.ts`: Root context; and
      `hooks/use-code-block-context.ts`: a `useCodeBlockContext(partName)` hook
      that throws an error naming the part when used outside `CodeBlock.Root`.
- [x] 4.2 `components/code-block.root.tsx`: `section` with `role="region"`;
      accessible name order (`aria-label`, then `Title`, then the localized
      default); element ids; highlighter from the provider; line normalization;
      expanded state (controlled and uncontrolled); one polite live region;
      recipe and style prop split.
- [x] 4.3 `components/` for `Header`, `Title` (registers its id for
      `aria-labelledby`), `LanguageLabel` (`aria-hidden`, defaults to the
      language), `Actions` (placement depends on whether it is inside `Header`
      or `Content`) and `Footer`.
- [x] 4.4 `components/code-block.content.tsx`: focusable `pre` (`tabIndex={0}`)
      and `code`; token spans with type classes and React text children; line
      numbers with `startLineNumber`; highlighted, added and removed lines with
      precedence; `+`/`−` marker column only when needed; visually hidden
      start/end text per run; word highlights with `mark`; `prompt` and
      `outputLines`; `wrapLongLines`; only the first `maxLines` lines while
      collapsed; content id for `aria-controls`.
- [x] 4.5 `components/code-block.copy-trigger.tsx`: icon button "Copy code";
      copies `text ?? code`; `onCopy`, `onCopyError`, `timeout` (default 2000);
      icon swap; "Copied" and "Copy failed" announcements; state survives `code`
      updates. Reuse the copy logic of the first version.
- [x] 4.6 `components/code-block.download-trigger.tsx`: icon button "Download
      code"; `fileName`, `mimeType`, `text`, `onDownload`; uses `Blob` and
      object URLs only on press.
- [x] 4.7 `components/code-block.expand-trigger.tsx`: renders only when
      collapsible; localized "Show more" / "Show less" or `children`;
      `aria-expanded` and `aria-controls`; focus stays on the button.
- [x] 4.8 Make `code-block.tsx` exports only, with `Root` first and JSDoc for
      every part; add `components/index.ts`; set `displayName` on every part.
- [x] 4.9 Delete the static `PrismTheme` in `code-block.constants.ts` and any
      other code from the first version that is no longer used; remove
      `prism-react-renderer` from `packages/nimbus/package.json` and run
      `pnpm install`.

## 5. i18n

- [x] 5.1 Extend `code-block.i18n.ts` with `copyFailed`, `downloadCode`,
      `showMore`, `showLess`, `highlightedLinesStart`, `highlightedLinesEnd`,
      `addedLinesStart`, `addedLinesEnd`, `removedLinesStart`,
      `removedLinesEnd`; keep `regionLabel`, `copyCode`, `copied`.
- [x] 5.2 Add pattern messages: `Nimbus.CodeSnippetGroup.switcherLabel` ("Code
      example") and `Nimbus.CommandSnippet.regionLabel` ("Command").
- [x] 5.3 Run `pnpm extract-intl` and confirm the generated files and `en`
      defaults.

## 6. CodeBlock stories and tests

- [x] 6.1 Move the existing stories in `code-block.stories.tsx` to the compound
      API and keep every scenario they cover today.
- [ ] 6.2 Add play functions for engine behavior: bash highlighting, alias,
      unknown language, custom provider, async highlighter (plain text first,
      then tokens; outdated result discarded).
- [ ] 6.3 Add play functions for safety, theming and semantics: injected markup
      stays text, empty code, no `style` attribute on tokens, dark mode, region
      name order (`aria-label`, `Title`, default), hidden language label, no
      name on `code`, locale `de`, no prop leakage.
- [ ] 6.4 Add play functions for keyboard and layout: Tab reaches the header
      copy button before the `pre`, no stray `tabIndex`, Enter and Space
      activate every trigger, visible focus, floating actions inside content do
      not cover the first line, long line in a 400px container.
- [ ] 6.5 Add play functions for lines: trailing newline, CRLF copied as given,
      offset numbers, equal code start position for lines 9 and 10 (bounding
      boxes), `user-select: none` on numbers, prompts, markers and announcement
      text, ranges, invalid selections, diff markers, one announcement pair per
      run, word highlight across tokens, prompt with output lines, wrapped line
      with one line number.
- [ ] 6.6 Add play functions for actions: copy success, custom copy text, reset
      after `timeout`, copy failure (mocked clipboard), download (spy on object
      URL and anchor click), expand collapsed/expanded with `aria-expanded`,
      `aria-controls` and focus, copy while collapsed copies all lines, 44×44px
      hit area for `sm` triggers.
- [ ] 6.7 Add play functions for streaming: scroll position kept when code
      grows, copy state kept across updates, unterminated string renders.
- [ ] 6.8 Mark the visual stories for Chromatic (sizes, light/dark, diff,
      highlighted lines, wrap, collapsed) following
      `docs/chromatic-visual-testing.md`.

## 7. Patterns (Layer 3)

- [ ] 7.1 Create `packages/nimbus/src/patterns/code/index.ts` and export it from
      `packages/nimbus/src/patterns/index.ts`.
- [ ] 7.2 `patterns/code/code-snippet/`: `.tsx`, `.types.ts`, `.stories.tsx`
      with play functions for every scenario in
      `specs/nimbus-code-snippet/spec.md`, `.mdx`, `.dev.mdx`, `.docs.spec.tsx`,
      `index.ts`. Reuse docs content from the first version.
- [ ] 7.3 `patterns/code/code-snippet-group/`: same file set plus `.i18n.ts`;
      built from `CodeBlock` parts with `Tabs` or `Select`; play functions for
      arrow-key switching, select switching and its accessible name, single
      item, copy and download following the selected item, controlled selection.
- [ ] 7.4 `patterns/code/json-snippet/`: same file set; a safe stringify utility
      with unit tests for indentation, circular references, `BigInt` and
      `undefined`; play functions for highlighting and copying formatted JSON.
- [ ] 7.5 `patterns/code/command-snippet/`: same file set plus `.i18n.ts`; play
      functions for the prompt, no prompt, output lines, copy without prompts,
      floating copy button, default region name "Command".
- [ ] 7.6 Confirm that no pattern folder contains a `.recipe.ts` or `.slots.tsx`
      file.

## 8. Documentation

- [ ] 8.1 Rewrite `code-block.mdx` for the compound API: start "When to use"
      with a table that points to the four patterns; fix the keyboard table so
      it matches DOM order.
- [ ] 8.2 Rewrite `code-block.dev.mdx` and `code-block.docs.spec.tsx` with
      composition examples: copy without header, title, diff lines, collapse,
      download, `createPrismHighlighter` with `additionalLanguages`,
      `CodeHighlighterProvider`.
- [ ] 8.3 Add `code-block.a11y.mdx` and `code-block.guidelines.mdx` following
      the existing component docs files (for example `tabs.a11y.mdx`,
      `tabs.guidelines.mdx`).
- [ ] 8.4 Link every pattern doc back to `CodeBlock` for custom layouts.
- [ ] 8.5 Confirm the docs site lists the new `patterns/code` category; update
      any place that lists pattern categories (skills, commands, guidelines,
      templates).

## 9. Exports and release notes

- [ ] 9.1 `code-block/index.ts`: export `CodeBlock`, `CodeHighlighterProvider`,
      `createPrismHighlighter`, `defaultCodeLanguages` and the public types.
- [ ] 9.2 Confirm `packages/nimbus/src/components/index.ts` and
      `packages/nimbus/src/patterns/index.ts` expose all new exports.
- [ ] 9.3 Rewrite `.changeset/add-code-block-component.md` for consumers: the
      `CodeBlock` compound component and the four patterns.

## 10. Validation

- [ ] 10.1 `pnpm --filter @commercetools/nimbus typecheck:dev` — green.
- [ ] 10.2 `pnpm lint` — green.
- [ ] 10.3 `pnpm test:unit` for the new utilities, hooks and highlighter —
      green.
- [ ] 10.4 `pnpm build`, then `pnpm typecheck:strict` — green.
- [ ] 10.5 `pnpm test:storybook` for `code-block.stories.tsx` and the four
      pattern stories — green.
- [ ] 10.6 `pnpm check:package-shape` and `pnpm check:bundle-size` — within the
      gates; record the engine size compared with `prism-react-renderer`.
- [ ] 10.7 Review with the `nimbus-reviewer` agent and fix all findings.

## Follow-up changes (not tracked in this change)

- Nimbus `Markdown` renders code fences with `CodeBlock` and maps fence meta
  (`{1,3-4}`, `/word/`) to `Content` props.
- The Nimbus docs app replaces `react-syntax-highlighter` with `CodeSnippet`.
- Optional Shiki engine entry point `@commercetools/nimbus/code-block/shiki`.
