# Tasks: Add Markdown component

> **API note:** `Markdown` is a single entry point — `<Markdown>{md}</Markdown>`
> — plus a default renderer map. It is not a `.Root` compound component. Default
> renderers reuse existing Nimbus components (`Heading`, `Link`, `Code`,
> `Text`); styled `chakra.*` primitives with design-token style props cover the
> rest (no component-specific slot recipe). Engine: `react-markdown` +
> `remark-gfm` + `remend` (streaming). Security piggybacks on Merchant Center
> conventions — react-markdown safe defaults (`skipHtml`) + `allowedElements`
> allowlist + `rel=noopener` external links; image-host security is the app
> CSP's job. **No `harden-react-markdown`.** Style props forward to the outer
> root container.
>
> **Amendment (§6):** the `trust` / `allowRawHtml` props and the `rehype-raw` /
> `rehype-sanitize` raw-HTML path were removed in favor of a single
> safe-by-default posture; application components are embedded via **custom
> component tags** registered through the `components` prop. Tasks in §§1–4 that
> reference `trust` / `allowRawHtml` are superseded by §6.

## 1. Dependencies and scaffolding

- [x] 1.1 Add runtime deps to `packages/nimbus`: `react-markdown`, `remark-gfm`,
      `remend`. Add `rehype-raw` + `rehype-sanitize` (loaded only on
      `trust="trusted"` + `allowRawHtml`). Do **not** add
      `harden-react-markdown`. Verify no Tailwind/CSS is pulled in; run
      `pnpm check:bundle-size` baseline note.
- [x] 1.2 Create `packages/nimbus/src/components/markdown/` following the Nimbus
      file-type layout, with shell files exporting empty/stub symbols:
      `markdown.tsx`, `markdown.types.ts`, `markdown.stories.tsx`, and
      `index.ts` (barrel), plus the `utils/`, `constants/`, and `components/`
      directories.
- [x] 1.3 Export the component from `packages/nimbus/src/components/index.ts`
      (`export * from "./markdown"`).
- [x] 1.4 Style the root and all renderers with **design-token style props** (no
      component-specific slot recipe): the root is a `Box` carrying the document
      typography + vertical rhythm; the renderer map applies the Figma
      `Markdown/*` scale as style props. Do **not** register a `nimbusMarkdown`
      slot recipe.
- [x] 1.5 Add i18n messages (`markdown.i18n.ts`) for the external-link "(opens
      in new tab)" label; wire through the Nimbus i18n pipeline.

      **Acceptance:** component dir builds; `Markdown` is importable from the
      package barrel; no slot recipe registered; no Tailwind in the dependency
      tree.

## 2. Types (four-layer)

- [x] 2.1 In `markdown.types.ts` define helper types: `MarkdownTrust`
      (`"untrusted" | "trusted"`) and `MarkdownComponents` (re-export of
      react-markdown's `Components`).
- [x] 2.2 Define the public `MarkdownProps` with JSDoc on every prop: `children`
      (markdown string, canonical input), `trust` (default `"untrusted"`),
      `allowRawHtml`, `components`, `allowedElements`, `disallowedElements`,
      `isStreaming`, `headingOffset` (default 0), `ref`, and Nimbus style props
      (forwarded to the outer root container).

      **Acceptance:** `pnpm --filter @commercetools/nimbus typecheck:strict`
      passes for the types; no `any`.

## 3. Failing Storybook tests (TDD)

- [x] 3.1 Write play functions in `markdown.stories.tsx` covering, and confirm
      they FAIL initially: - **Defaults:**
      headings/paragraph/list/blockquote/table/inline-code/ code-block render
      with the expected Nimbus elements + roles (code block is plain styled
      `pre`/`code` — no copy button, no highlighting). - **GFM:** table, task
      list (read-only checkbox with name from item text + state), strikethrough,
      autolink. - **Overrides:** `components={{ a: CustomLink }}` replaces
      anchors only; other defaults intact; `node` not leaked to DOM. -
      **Security (untrusted default):** `<script>`/`<iframe>`/`onerror` not
      rendered live (skipHtml + allowedElements); `javascript:` link
      neutralized; image renders with `loading="lazy"` +
      `referrerpolicy="no-referrer"`. - **Trusted + allowRawHtml:** safe raw
      HTML renders; dangerous tags still stripped (sanitize after raw, using
      `rehype-sanitize`'s `defaultSchema`). - **Streaming:** partial `**bold`,
      `` `code ``, `[text](` render as formatted/text via `remend`; complete
      input identical with/without `isStreaming`; `aria-busy` toggles and a
      single completion announcement fires on settle. - **A11y:**
      `headingOffset` shifts levels; heading-skip + missing-alt emit dev
      warnings; external link has `rel="noopener noreferrer"` + labelled,
      non-color indicator; table uses `th[scope]`. - **Layout:** style props
      (e.g. `maxW`) forward to the outer container.

      **Acceptance:** all new play functions exist and fail against the stubs.

## 4. Implementation (dependency order)

- [x] 4.1 Apply the Figma `Markdown/*` scale as **style props** (no recipe) on
      the renderers and the root `Box` — existing primitive tokens (sizes
      14/16/18/20/24, line-heights 20/22/24/28, weights 400/600/700, italic
      emphasis, system `fontFamily.mono` for code) plus the inter-block vertical
      rhythm on the root. No new tokens.
- [x] 4.2 Organize component-scoped code into the canonical directories: pure
      helpers in `utils/` (split by family, each with a sibling `.spec.ts` + a
      barrel), shared values in `constants/`, and sub-component renderers
      (default map + streaming) in `components/`.
- [x] 4.3 Implement the default renderer map: reuse `Heading` (h1–h6 via `as`,
      fold h5/h6), `Text` (p), `Link` (a, with external detection +
      `rel`/`target` + i18n, non-color indicator), `Code` (inline), and styled
      `chakra.*` primitives for code blocks (plain `pre`/`code`, no
      copy/highlighting), lists (task-list checkbox read-only + named from item
      text), blockquote, table (`th[scope]`), image (`loading="lazy"` +
      `referrerpolicy="no-referrer"`, dev-warn on missing alt), hr. **Every
      renderer destructures out `node` before spreading onto the DOM.**
- [x] 4.4 Implement `headingOffset` (render markdown level L as
      `min(L + offset, 6)`) and a dev-mode warning on author heading-level
      skips.
- [x] 4.5 Implement the MC-aligned security layer (no `harden-react-markdown`):
      default `trust="untrusted"` → `skipHtml` + safe `allowedElements`
      allowlist (tunable via `allowedElements`/`disallowedElements`); rely on
      react-markdown's built-in `urlTransform`; `trust="trusted"` +
      `allowRawHtml` wires `rehype-raw` + `rehype-sanitize` (sanitize last,
      using its built-in `defaultSchema`). Image-host security is delegated to
      the app CSP — do not re-implement host allowlists.
- [x] 4.6 Implement streaming (tree-shakeable, behind `isStreaming`):
      pre-process with `remend(value, { linkMode: "text-only" })`; split into
      top-level blocks with stable keys and memoize each block (`React.memo`) so
      only the final block re-parses on new tokens; manage `aria-busy` + a
      coalesced polite completion announcement (i18n) internally — no consumer
      ARIA.
- [x] 4.7 Implement `markdown.tsx`: wire the default plugins (`[remarkGfm]`;
      `rehype-raw` + `rehype-sanitize` only when `allowRawHtml`), merge
      `components` (`{ ...nimbusDefaults, ...props.components }`), forward `ref`
      and style props to the outer root container.
- [x] 4.8 Create developer documentation with the
      `/writing-developer-documentation` skill (`markdown.dev.mdx` +
      `markdown.docs.spec.tsx`) — overrides, streaming, trust model, security
      guidance.
- [x] 4.9 Create designer documentation with the
      `/writing-designer-documentation` skill (`markdown.guidelines.mdx`,
      `markdown.a11y.mdx`).

      **Acceptance:** all Step 3 play functions pass.

## 5. Validation (blocks shipping)

- [x] 5.1 `pnpm --filter @commercetools/nimbus typecheck:strict` — no errors.
- [x] 5.2 `pnpm test:storybook:dev` for the markdown stories — all play
      functions pass.
- [x] 5.3 `pnpm lint` — clean.
- [x] 5.4 `pnpm check:bundle-size` — record the component's footprint; confirm
      no Tailwind/CSS framework entered the bundle.
- [x] 5.5 Confirm `Markdown` + public types are exported from the
      `@commercetools/nimbus` barrel and resolve for consumers.
- [x] 5.6 Add a changeset with the `/writing-changeset` skill (consumer-facing:
      new `Markdown` component, streaming + override/custom-renderer API, safe-
      by-default trust model).
- [x] 5.7 Verify the OpenSpec change:
      `openspec validate add-markdown-component     --strict`.

## 6. Custom component tags + safe-by-default (amendment)

- [x] 6.1 Remove the `trust` / `allowRawHtml` props and `MarkdownTrust` type;
      drop `rehype-raw` + `rehype-sanitize` from `package.json` and the
      `markdown` catalog. `skipHtml` is always on; `rehypePlugins` is `[]`.
- [x] 6.2 Widen `MarkdownComponents` (react-markdown `Components` ∩ an open
      index signature) and add `MarkdownCustomComponent` so non-standard
      PascalCase keys typecheck without breaking per-element overrides.
- [x] 6.3 Add `utils/parse-tag-attributes.ts` (string/boolean attrs, `{expr}`
      dropped, casing preserved) + `.spec.ts`.
- [x] 6.4 Add `utils/remark-custom-component-tags.ts`: a dependency-free remark
      plugin that materializes only registered tags into a `nimbusCustomTag`
      node with `data.hName`/`hProperties`, supporting self-closing + paired
      (stack-based sibling pairing, nesting-aware, unbalanced left inert) +
      `.spec.ts`.
- [x] 6.5 In `markdown.tsx`: derive `customTagNames` (non-standard `components`
      keys), conditionally add the plugin to `remarkPlugins`, and union the
      names into the resolved `allowedElements`.
- [x] 6.6 Extend `utils/split-blocks.ts` with an optional `customTagNames` param
      that keeps a paired region in one streaming block (depth-counted; unclosed
      tail kept whole); thread it through `ReactMarkdownRenderOptions` and
      `StreamingContent` without leaking it to react-markdown + `.spec.ts`.
- [x] 6.7 Add stories (custom self-closing tag with props, paired with children,
      unregistered inert, code-fence literal, streaming partial) and a
      `custom-components` `@docs-section`; update dev/main/guidelines/a11y docs
      to drop the trust model and document custom component tags.
- [x] 6.8 Re-validate: `typecheck:strict`, markdown unit + storybook tests,
      `check:bundle-size` (confirms two deps removed), `lint`, and
      `openspec validate add-markdown-component --strict`.
