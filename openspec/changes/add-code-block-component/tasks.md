## 1. Scaffold & dependency

- [x] 1.1 Create `packages/nimbus/src/components/code-block/` directory.
- [x] 1.2 Add `prism-react-renderer` (`^2.4.1`) to `packages/nimbus/package.json` `dependencies`; run `pnpm install` and confirm it resolves from the existing lockfile.
- [x] 1.3 Create empty/stub files for the full file set: `code-block.types.ts`, `code-block.constants.ts`, `code-block.recipe.ts`, `code-block.slots.tsx`, `code-block.tsx`, `code-block.i18n.ts`, `code-block.stories.tsx`, `code-block.dev.mdx`, `code-block.docs.spec.tsx`, `code-block.mdx`, `index.ts`.

## 2. Failing play functions (TDD baseline)

- [x] 2.1 In `code-block.stories.tsx`, write the Storybook meta (`tags:["autodocs"]`, typed `Meta`/`StoryObj`, `fn()` for `onCopy`) and a `Base` story with a `play` function — these will fail until implementation lands.
- [x] 2.2 Write play functions / stories for every Tier-2 acceptance scenario from `specs/code-block/spec.md`: supported-language render (text content preserved), unknown-language fallback, empty-code block, region has accessible name + `<code>` has no `aria-label`, default localized region name, language label `aria-hidden`, `<pre>` is `tabIndex=0` and scroll container, no stray tabIndex, constrained-width horizontal overflow (no layout break), `width="full"` stretch, header shown by default / hidden via `showHeader={false}`, copy button accessible name, single-activation copies once + `onCopy` once + live-region updates, `showCopyButton={false}`, line numbers shown/hidden + excluded from copy, dark-mode color resolution, `size` sm/md, event/prop-leak integrity.

## 3. Types

- [x] 3.1 `code-block.types.ts`: define recipe prop types from the slot recipe, slot prop types (`SlotComponent` return annotations to avoid TS2742), and the public `CodeBlockProps` (`code`, `language`, `showLineNumbers`, `showHeader`, `showCopyButton`, `size`, `aria-label`, `onCopy`, plus style-prop passthrough). Use `type` not `interface`; JSDoc every public prop with `@default` on optional booleans. No `any`/`as unknown as`.

## 4. Constants (highlighter theme)

- [x] 4.1 `code-block.constants.ts`: define the static `PrismTheme` mapping each Prism token type to a namespaced `var(--code-token-*)`; export the component class-name prefix and the ordered token-type → CSS-var map. No raw colors.

## 5. Recipe (design layer)

- [x] 5.1 `code-block.recipe.ts`: `defineSlotRecipe({ slots: ["root","header","languageLabel","copyButton","pre","code","line","lineNumber"], className:"nimbus-code-block", ... })`. Surface/border/radius via semantic tokens; `fontFamily:"mono"`; declare all `--code-token-*` custom properties (light defaults + `_dark` overrides) on `root`; `size` variant (`sm`/`md`) scaling font + padding; `defaultVariants.size = "md"`. No raw px/hex.
- [x] 5.2 Register the recipe as `nimbusCodeBlock` in `packages/nimbus/src/theme/slot-recipes/index.ts`.
- [x] 5.3 Run `pnpm --filter @commercetools/nimbus build-theme-typings`.

## 6. Slots (design layer)

- [x] 6.1 `code-block.slots.tsx`: `createSlotRecipeContext({ key:"nimbusCodeBlock" })`; export `withProvider` root (`section` element) + `withContext` for header, languageLabel, copyButton, pre (`pre`), code (`code`), line, lineNumber — each annotated with `SlotComponent` return types.

## 7. i18n

- [x] 7.1 `code-block.i18n.ts`: define messages `Nimbus.CodeBlock.copyCode` ("Copy code") and `Nimbus.CodeBlock.copied` ("Copied"), plus `Nimbus.CodeBlock.regionLabel` ("Code block") default region name.
- [x] 7.2 Run `pnpm extract-intl` and confirm generated message files exist and the `en` default matches (CI build-breaker if skipped).

## 8. Main component (mechanics layer)

- [x] 8.1 `code-block.tsx`: implement `CodeBlock`. Split recipe variants, extract style props, render `Root(section, role="region", aria-label or default i18n)` → optional `Header(languageLabel aria-hidden + copy IconButton)` → `pre tabIndex={0}` → `code` → `prism-react-renderer` `Highlight` render-prop emitting `line`/`lineNumber`/token spans using the static `PrismTheme`. Set `displayName`. JSDoc tags (`@see`, `@example`, `@supportsStyleProps`, `@default`). Guard any `process.env` with `typeof`. No raw design values; no DOM/prop leakage.
- [x] 8.2 Copy behavior: `useCopyToClipboard`; copy button `onPress` copies `code`, fires `onCopy` once, sets transient "copied" state (icon swap + live-region message via `VisuallyHidden` `aria-live="polite"`), resets after ~2s. Live region always mounted (empty until copied).
- [x] 8.3 Line numbers: render the `lineNumber` gutter only when `showLineNumbers`; ensure gutter text is non-selectable and not part of the copied string (copy uses the `code` prop, not DOM text).
- [x] 8.4 Header/copy toggles: honor `showHeader={false}` (no header, no copy) and `showCopyButton={false}` (header without copy).

## 9. Barrel & integration

- [x] 9.1 `index.ts`: export `CodeBlock` and its public types.
- [x] 9.2 Export the component from `packages/nimbus/src/components/index.ts` (no name collision with existing `Code`).

## 10. Documentation

- [x] 10.1 `code-block.dev.mdx`: engineering doc with frontmatter, `<PropsTable>`, the `{{docs-tests:}}` injection block, usage examples, and a Resources section.
- [x] 10.2 `code-block.docs.spec.tsx`: consumer-facing working examples (the `.dev.mdx` companion required by the docs build).
- [x] 10.3 `code-block.mdx`: designer documentation.

## 11. Validation gates

- [x] 11.1 `pnpm --filter @commercetools/nimbus build-theme-typings` then `pnpm typecheck:strict` — both green.
- [x] 11.2 `pnpm lint` — green.
- [x] 11.3 `pnpm build` — green.
- [x] 11.4 `pnpm test:storybook` for `code-block.stories.tsx` — all play functions pass (Tier-2 scenarios now satisfied).
- [x] 11.5 `pnpm check:package-shape` and `pnpm check:bundle-size` (new dependency + exports changed) — within gate.
- [x] 11.6 Remove any leftover TDD scaffolding comments ("WILL FAIL"/"TDD baseline"/"Phase 1") from stories/source.

## 12. Finalize

- [x] 12.1 `pnpm changeset` — consumer-framed, minor bump (new feature).
- [x] 12.2 Mark all tasks complete; create a conventional commit.

## 13. `startLineNumber` gutter offset (proposal extension)

- [x] 13.1 `code-block.types.ts`: add optional `startLineNumber?: number` to `CodeBlockProps`, JSDoc'd with `@default 1` and a note that it only takes effect when `showLineNumbers` is true and is excluded from copy.
- [x] 13.2 `code-block.tsx`: destructure `startLineNumber = 1`; render the gutter as `lineIndex + startLineNumber` instead of `lineIndex + 1`. No other behavior change.
- [x] 13.3 `code-block.stories.tsx`: add play-function coverage for the new scenarios — default starts at 1, `startLineNumber={42}` numbers an excerpt 42–46, offset ignored when `showLineNumbers` is false, copied text excludes numbers with an offset set.
- [x] 13.4 Docs: add a "real source line numbers" example to `code-block.dev.mdx` / `code-block.docs.spec.tsx`; ensure `<PropsTable>` picks up the new prop.
- [x] 13.5 Gates: `pnpm typecheck:strict`, `pnpm lint`, `pnpm test:storybook` for `code-block.stories.tsx` — all green.
- [x] 13.6 Changeset — folded the `startLineNumber` capability into the existing unreleased `add-code-block-component.md` changeset (component not yet published).

## 14. `highlightedLines` line highlighting (proposal extension)

- [x] 14.1 `code-block.types.ts`: add optional `highlightedLines?: number[]` to `CodeBlockProps`, JSDoc'd `@default []`, keyed to displayed line numbers, independent of `showLineNumbers`, excluded from copy.
- [x] 14.2 `code-block.tsx`: destructure `highlightedLines = []`; compute `lineNumber = lineIndex + startLineNumber` once and set `data-highlighted={highlightedLines.includes(lineNumber) || undefined}` on the line slot.
- [x] 14.3 `code-block.recipe.ts`: style `line` `&[data-highlighted]` with a token-driven `backgroundColor` (`amber.3`, mode-adaptive); add `width:max-content` + `minWidth:100%` to the `line` slot so the band spans the full scrollable width.
- [x] 14.4 `code-block.stories.tsx`: add play coverage — specified lines highlighted, offset honored, highlight without gutter.
- [x] 14.5 Docs: add a "highlighting lines" example to `code-block.dev.mdx` + `code-block.docs.spec.tsx`; `<PropsTable>` picks up the new prop.
- [x] 14.6 Gates: `pnpm typecheck:strict`, `pnpm lint`, `pnpm test:storybook` — all green.
- [x] 14.7 Changeset — fold the `highlightedLines` capability into the unreleased changeset.

## 15. Smaller copy button in the `sm` size (fix)

- [x] 15.1 `code-block.recipe.ts`: in the `sm` variant, scale the nested copy button below IconButton's `xs` floor via a `copyButton` descendant override (button box + icon).
- [x] 15.2 `code-block.stories.tsx`: assert in `SizeSmall` that the sm copy button is shorter than the md copy button.
