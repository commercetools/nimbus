# Tasks: Add Markdown component

> **API note:** `Markdown` is a single entry point — `<Markdown>{md}</Markdown>`
> — plus a default renderer map. It is not a `.Root` compound component. Default
> renderers reuse existing Nimbus primitives (`Heading`, `Link`, `Code`, `Text`,
> `Separator`); recipe-styled slots cover the rest. Engine: `react-markdown` +
> `remark-gfm` + `remend` (streaming). Security piggybacks on Merchant Center
> conventions — react-markdown safe defaults (`skipHtml`) + `allowedElements`
> allowlist + `rel=noopener` external links; image-host security is the app
> CSP's job. **No `harden-react-markdown`.** Style props forward to the outer
> root container.

## 1. Dependencies and scaffolding

- [ ] 1.1 Add runtime deps to `packages/nimbus`: `react-markdown`, `remark-gfm`,
      `remend`. Add `rehype-raw` + `rehype-sanitize` (loaded only on
      `trust="trusted"` + `allowRawHtml`). Do **not** add
      `harden-react-markdown`. Verify no Tailwind/CSS is pulled in; run
      `pnpm check:bundle-size` baseline note.
- [ ] 1.2 Create `packages/nimbus/src/components/markdown/` following the Nimbus
      file-type layout, with shell files exporting empty/stub symbols:
      `markdown.tsx`, `markdown.types.ts`, `markdown.recipe.ts`,
      `markdown.slots.tsx`, `markdown.stories.tsx`, and `index.ts` (barrel).
- [ ] 1.3 Export the component from
      `packages/nimbus/src/components/index.ts` (`export * from "./markdown"`).
- [ ] 1.4 Add `markdown.recipe.ts` (`markdownSlotRecipe`) with slots for
      `root`, `heading`, `paragraph`, `link`, `inlineCode`, `codeBlock`,
      `list`, `listItem`, `blockquote`, `table`, `tableHeaderCell`,
      `tableCell`, `image`, `separator`. Register it as `nimbusMarkdown` in
      `packages/nimbus/src/theme/slot-recipes/index.ts`.
- [ ] 1.5 Add `markdown.slots.tsx` deriving slot prop types from the recipe.
- [ ] 1.6 Add i18n messages (`markdown.i18n.ts`) for the external-link
      "(opens in new tab)" label; wire through the Nimbus i18n pipeline.

      **Acceptance:** component dir builds; `Markdown` is importable from the
      package barrel; recipe registered; no Tailwind in the dependency tree.

## 2. Types (four-layer)

- [ ] 2.1 In `markdown.types.ts` define helper types: `MarkdownTrust`
      (`"untrusted" | "trusted"`) and `MarkdownComponents` (re-export of
      react-markdown's `Components`).
- [ ] 2.2 Define the public `MarkdownProps` with JSDoc on every prop:
      `children` (markdown string, canonical input), `trust` (default
      `"untrusted"`), `allowRawHtml`, `sanitizeSchema`, `components`,
      `remarkPlugins`, `rehypePlugins`, `allowedElements`, `disallowedElements`,
      `isStreaming`, `headingOffset` (default 0), `ref`, and Nimbus style props
      (forwarded to the outer root container).

      **Acceptance:** `pnpm --filter @commercetools/nimbus typecheck:strict`
      passes for the types; no `any`.

## 3. Failing Storybook tests (TDD)

- [ ] 3.1 Write play functions in `markdown.stories.tsx` covering, and confirm
      they FAIL initially:
      - **Defaults:** headings/paragraph/list/blockquote/table/inline-code/
        code-block render with the expected Nimbus elements + roles (code block
        is plain styled `pre`/`code` — no copy button, no highlighting).
      - **GFM:** table, task list (read-only checkbox with name from item text +
        state), strikethrough, autolink.
      - **Overrides:** `components={{ a: CustomLink }}` replaces anchors only;
        other defaults intact; `node` not leaked to DOM.
      - **Custom node:** a rehype plugin + `components` entry (+ `allowedElements`
        extension) renders a custom construct under the untrusted default.
      - **Security (untrusted default):** `<script>`/`<iframe>`/`onerror`
        not rendered live; `javascript:` link neutralized; an appended
        `rehype-raw` plugin still cannot inject live HTML (skipHtml +
        allowedElements); image renders with `loading="lazy"` +
        `referrerpolicy="no-referrer"`.
      - **Trusted + allowRawHtml:** safe raw HTML renders; dangerous tags still
        stripped (sanitize after raw); `sanitizeSchema` extends the allowlist.
      - **Streaming:** partial `**bold`, `` `code ``, `[text](` render as
        formatted/text via `remend`; complete input identical with/without
        `isStreaming`; `aria-busy` toggles and a single completion announcement
        fires on settle.
      - **A11y:** `headingOffset` shifts levels; heading-skip + missing-alt emit
        dev warnings; external link has `rel="noopener noreferrer"` + labelled,
        non-color indicator; table uses `th[scope]`.
      - **Layout:** style props (e.g. `maxW`) forward to the outer container.

      **Acceptance:** all new play functions exist and fail against the stubs.

## 4. Implementation (dependency order)

- [ ] 4.1 Implement `markdown.recipe.ts` — map the Figma `Markdown/*` scale to
      existing primitive tokens (sizes 14/16/18/20/24, line-heights 20/22/24/28,
      weights 400/600/700, Body Emphasis `fontStyle: italic`, system
      `fontFamily.mono` for code). No new tokens.
- [ ] 4.2 Implement `markdown.slots.tsx` slot components.
- [ ] 4.3 Implement the default renderer map: reuse `Heading` (h1–h4, fold
      h5/h6), `Text` (p/em/strong/del), `Link` (a, with external detection +
      `rel`/`target` + i18n, non-color indicator), `Code` (inline), recipe slots
      for code blocks (plain `pre`/`code`, visually-hidden language label —
      no copy/highlighting), lists (task-list checkbox read-only + named from
      item text), blockquote, table (`th[scope]`), image (`loading="lazy"` +
      `referrerpolicy="no-referrer"`, dev-warn on missing alt), hr. **Every
      renderer destructures out `node` before spreading onto the DOM.**
- [ ] 4.4 Implement `headingOffset` (render markdown level L as
      `min(L + offset, 6)`) and a dev-mode warning on author heading-level skips.
- [ ] 4.5 Implement the MC-aligned security layer (no `harden-react-markdown`):
      default `trust="untrusted"` → `skipHtml` + safe `allowedElements`
      allowlist (tunable via `allowedElements`/`disallowedElements`); rely on
      react-markdown's built-in `urlTransform`; `trust="trusted"` + `allowRawHtml`
      wires `rehype-raw` + `rehype-sanitize` (sanitize last, extended by
      `sanitizeSchema`). Image-host security is delegated to the app CSP — do not
      re-implement host allowlists.
- [ ] 4.6 Implement streaming (tree-shakeable, behind `isStreaming`): pre-process
      with `remend(value, { linkMode: "text-only" })`; split into top-level
      blocks with stable keys and memoize each block (`React.memo`) so only the
      final block re-parses on new tokens; manage `aria-busy` + a coalesced
      polite completion announcement (i18n) internally — no consumer ARIA.
- [ ] 4.7 Implement `markdown.tsx`: compose plugins
      (`[remarkGfm, ...remarkPlugins]`), merge `components`
      (`{ ...nimbusDefaults, ...props.components }`), forward `ref` and style
      props to the outer root container.
- [ ] 4.8 Create developer documentation with the
      `/writing-developer-documentation` skill (`markdown.dev.mdx` +
      `markdown.docs.spec.tsx`) — overrides, custom nodes, streaming, trust
      model, security guidance.
- [ ] 4.9 Create designer documentation with the
      `/writing-designer-documentation` skill (`markdown.guidelines.mdx`,
      `markdown.a11y.mdx`).

      **Acceptance:** all Step 3 play functions pass.

## 5. Validation (blocks shipping)

- [ ] 5.1 `pnpm --filter @commercetools/nimbus typecheck:strict` — no errors.
- [ ] 5.2 `pnpm test:storybook:dev` for the markdown stories — all play
      functions pass.
- [ ] 5.3 `pnpm lint` — clean.
- [ ] 5.4 `pnpm check:bundle-size` — record the component's footprint; confirm
      no Tailwind/CSS framework entered the bundle.
- [ ] 5.5 Confirm `Markdown` + public types are exported from the
      `@commercetools/nimbus` barrel and resolve for consumers.
- [ ] 5.6 Add a changeset with the `/writing-changeset` skill (consumer-facing:
      new `Markdown` component, streaming + override/custom-renderer API, safe-
      by-default trust model).
- [ ] 5.7 Verify the OpenSpec change: `openspec validate add-markdown-component
      --strict`.
