# Tasks: Add Markdown component

> **API note:** `Markdown` is a single entry point — `<Markdown>{md}</Markdown>`
> — plus a default renderer map. It is not a `.Root` compound component. Default
> renderers reuse existing Nimbus components (`Heading`, `Link`, `Code`,
> `Text`); styled `chakra.*` primitives with design-token style props cover the
> rest (no component-specific slot recipe). Engine: `react-markdown` +
> `remark-gfm` + `remend` (streaming).
>
> **Security is a single safe-by-default posture** — react-markdown safe
> defaults (`skipHtml` always on, built-in `urlTransform`) + `allowedElements`
> allowlist + `rel=noopener` external links; image-host security is the app
> CSP's job. **No `harden-react-markdown`, no `rehype-raw`, no
> `rehype-sanitize`.** Applications embed their own components via **custom
> component tags** registered through the `components` prop (§6), not raw HTML.
> Style props forward to the outer root container.
>
> _(History: an earlier iteration exposed a `trust` / `allowRawHtml` model
> backed by `rehype-raw` + `rehype-sanitize`. It was dropped pre-merge in favor
> of the single posture above; these tasks describe the final shipped state. See
> the proposal's "Changed since the initial review" for rationale.)_

## 1. Dependencies and scaffolding

- [x] 1.1 Add runtime deps to `packages/nimbus`: `react-markdown`, `remark-gfm`,
      `remend`. Do **not** add `rehype-raw`, `rehype-sanitize`, or
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
      in new tab)" label and the streaming completion announcement; wire through
      the Nimbus i18n pipeline.

      **Acceptance:** component dir builds; `Markdown` is importable from the
      package barrel; no slot recipe registered; no Tailwind in the dependency
      tree.

## 2. Types (four-layer)

- [x] 2.1 In `markdown.types.ts` define the renderer-map types: `MarkdownComponents`
      (react-markdown's `Components` ∩ an open index signature) and
      `MarkdownCustomComponent` (a renderer for a custom component tag receiving
      string/boolean attrs as props). No trust-related types.
- [x] 2.2 Define the public `MarkdownProps` with JSDoc on every prop: `children`
      (markdown string, canonical input), `components` (per-element overrides +
      custom component tags), `allowedElements`, `disallowedElements`,
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
      **Safe by default:** `<script>`/`<iframe>`/`onerror` not rendered live
      (skipHtml + allowedElements); `javascript:` link neutralized; image
      renders with `loading="lazy"` + `referrerpolicy="no-referrer"`;
      unregistered custom tags stay inert. - **Streaming:** partial `**bold`,
      `` `code ``, `[text](` render as formatted/text via `remend`; complete
      input identical with/without `isStreaming`; `aria-busy` is set while
      `isStreaming` and a single completion announcement fires when the consumer
      ends the stream. - **A11y:** `headingOffset` shifts levels (and clamps at
      h6); heading-skip + missing-alt emit dev warnings; external link has
      `rel="noopener noreferrer"` + labelled, non-color indicator; table uses
      `th[scope]`. - **Layout:** style props (e.g. `maxW`) forward to the outer
      container.

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
- [x] 4.5 Implement the MC-aligned safe-by-default security layer (no
      `harden-react-markdown`, no raw-HTML path): `skipHtml` always on +
      a safe `allowedElements` allowlist (tunable via
      `allowedElements`/`disallowedElements`, registered custom tag names unioned
      in); rely on react-markdown's built-in `urlTransform` for dangerous URLs.
      Image-host security is delegated to the app CSP — do not re-implement host
      allowlists. Dev-warn when `allowedElements` and `disallowedElements` are
      both passed (react-markdown throws on that combination; we normalize to
      `allowedElements`).
- [x] 4.6 Implement streaming (tree-shakeable, behind `isStreaming`):
      pre-process with `remend(value, { linkMode: "text-only" })`; split into
      top-level blocks with stable keys and memoize each block (`React.memo`) so
      only the final block re-parses on new tokens; manage `aria-busy` + a
      coalesced polite completion announcement (i18n) internally — no consumer
      ARIA. The live region is latched on via state and mounted for the whole
      stream; settling is consumer-driven (the `isStreaming` true→false
      transition).
- [x] 4.7 Implement `markdown.tsx`: wire `remarkGfm` (plus the custom-tag plugin
      when registered, §6); `rehypePlugins` is always `[]`; merge `components`
      (`{ ...nimbusDefaults, ...props.components }`), forward `ref` and style
      props to the outer root container.
- [x] 4.8 Create developer documentation with the
      `/writing-developer-documentation` skill (`markdown.dev.mdx` +
      `markdown.docs.spec.tsx`) — overrides, custom component tags, streaming,
      and security guidance.
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
      `@commercetools/nimbus` barrel and resolve for consumers (internal-only
      coordination types stay out of the published surface).
- [x] 5.6 Add a changeset with the `/writing-changeset` skill (consumer-facing:
      new `Markdown` component, streaming + override/custom-renderer API, safe-
      by-default posture).
- [x] 5.7 Verify the OpenSpec change:
      `openspec validate add-markdown-component --strict`.

## 6. Custom component tags (safe-by-default embedding)

Custom component tags are how applications embed their own components — the
sanctioned alternative to raw HTML.

- [x] 6.1 Confirm the safe-by-default posture is the only one: `skipHtml` always
      on; `rehypePlugins` is `[]`; no `trust` / `allowRawHtml` props or
      `MarkdownTrust` type; `rehype-raw` / `rehype-sanitize` are not dependencies.
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
      tail kept whole); pass it to `StreamingContent` as an explicit prop
      without leaking it to react-markdown + `.spec.ts`.
- [x] 6.7 Add stories (custom self-closing tag with props, paired with children,
      unregistered inert, code-fence literal, streaming partial) and a
      `custom-components` `@docs-section`; ensure dev/main/guidelines/a11y docs
      document custom component tags (no trust model).
- [x] 6.8 Re-validate: `typecheck:strict`, markdown unit + storybook tests,
      `check:bundle-size`, `lint`, and
      `openspec validate add-markdown-component --strict`.
