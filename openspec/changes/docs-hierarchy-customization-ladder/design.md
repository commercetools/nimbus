## Context

The docs app derives every URL from the `menu:` frontmatter of an MDX file
(`dynamic-route.tsx`). The top bar is shaped by `navigation-config.ts`, which
builds a virtual "Foundations" section from `groups: ["learn",
"home/design-tokens", "home/style-props"]`. URLs do not change because of this
shaping, so today the menu says Foundations while URLs, breadcrumbs and search
categories say Home.

The path `home/style-props` and `home/design-tokens` is also used outside the docs
app: `packages/nimbus-mcp` (`get-docs-page.ts:18,180`, `data-loader.ts:145`),
`apps/mcp-eval`, `packages/nimbus-docs-build` link validation, and the sitemap
generator. These were found by search. They were not part of the audit, so
they are a real risk for an "all at once" change.

The ladder (component props, a few one-off style props, Box/Flex/Stack) exists
only in pieces: `learn-rules.mdx` rules 4/5/8, `learn-concepts-styling.mdx:28`,
`how-style-props-work.mdx:34`, `learn-concepts-component-structure.mdx:140`.

Facts checked while writing this design:

- `button.dev.mdx:31` says "three size variants" and lists `2xs`, `xs`, `sm`,
  `md` and the recipe also has `xl`. The text is wrong.
- `purple` exists as a base token (`packages/tokens/src/base/tokens.json`).
  `button.dev.mdx:85` uses `purple.9` without a `nimbus-one-off:` marker. Whether
  app code may use `purple` is a rule question; Rule 7 says palettes are fixed.
- `nimbus-one-off` appears only in docs files. No lint or CI check reads it.
- `css` and `style` are not omitted from Button props (`HTMLChakraProps`), so the
  docs must teach the rule. Types do not enforce it.

## Goals / Non-Goals

**Goals:**

- One page that teaches the three levels and the move between them.
- A menu where Foundations is the styling system, Learn and Contribute are
  top-level, and URLs, breadcrumbs, search and the top bar agree.
- Old URLs keep working (docs app and MCP).
- A designer page that uses the same level names.

**Non-Goals:**

- A "Customizing" link line in component, pattern or hook templates.
- A lint rule for `nimbus-one-off` or for style-prop counts.
- Blocking `css` or `style` in component types.
- Rewriting the text of component, pattern, hook and token pages.

## Decisions

**D1. The ladder page lives in Foundations, and Learn keeps the details.**
Path `/foundations/customize-in-three-steps`. Learn Rules, Styling and Layout link
to it and remove repeated ladder text. Alternatives: first page in Learn >
Concepts (rejected: the owner asked for it in Foundations, and Foundations
readers look up style props without reading Learn); extend only the Styling page
(rejected: it leaves no home for level 3 and no designer view).

**D2. Decision rule = number plus signs.** Go to level 3 when one element needs
more than 3 style props, or any layout prop: `display`, `position`,
`flexDirection`, `gridTemplate*`. The page says that 3 is a team rule. Rung 3
keeps interactive parts as Nimbus components. Alternative: signs only (rejected
by the owner).

**D3. Move `menu:` frontmatter to match the menu.** Design Tokens and Style Props
get `menu: [Foundations, ...]`. Learn pages get `menu: [Learn, ...]` where they
already do, and Learn is no longer grouped under Foundations in
`navigation-config.ts`. Contribute pages get `menu: [Contribute, ...]`. This
removes the special cases in `search-categories.ts` and the mismatch in
breadcrumbs. Alternative: only change `navigation-config.ts` (rejected by the
owner, who chose to change everything at once).

**D4. Prefix redirects, not a per-page table.** Add a small prefix map in
`dynamic-route.tsx`, next to `REMOVED_PAGES`:
`home/design-tokens/*` to `foundations/design-tokens/*`,
`home/style-props/*` to `foundations/style-props/*`, and exact entries for the
two Contribute moves. The current `findMovedPath` handles only case and dash
differences, so it cannot do this. Alternative: list about 26 pages in
`REMOVED_PAGES` (rejected: it must be edited for every new token page).

**D5. MCP accepts old and new routes.** `get_docs_page` normalizes old
`home/design-tokens` and `home/style-props` prefixes to the new ones, and tool
descriptions show the new paths. Data and eval files change to the new paths.
Alternative: leave MCP on old paths (rejected: the MCP data comes from the same
manifest, so old paths would not exist).

**D6. Single source for the ladder.** Other pages link to the ladder page and do
not repeat its steps. `docs/file-type-guidelines/documentation.md` (Learn Pages,
about line 716) names the ladder page as the owner of the three levels. Skills
and commands that describe the Learn and Foundations structure are updated in the
same change (repo CLAUDE.md: "A pattern change is not complete until all
references to the old pattern are updated").

**D7. Shared vocabulary.** The designer page defines: **supported** (a
variant, size or palette a component offers), **one-off** (a value or style
Nimbus does not offer, used in one place and marked), **custom composition** (a
new layout built from Box, Flex, Stack). The Badge "Custom colors" wording is
renamed to "Other palette colors".

**D8. Button fixes.** Correct the size sentence to match the recipe. Replace the
`purple.9` example with `colorPalette`, or mark it `nimbus-one-off:` if the
example exists to show a one-off. The proposal's verification step decides which.

## Risks / Trade-offs

- **About 26 URLs change at once** → Prefix redirects, a redirect test for each
  prefix, and a check of the sitemap and `find-unknown-links` output after the
  build.
- **MCP consumers use old routes** → Alias old prefixes in `get_docs_page`; update
  eval fixtures; add a spec for both forms.
- **Search categories rely on `top === "Home" && sub === "Design Tokens"`** →
  Update `search-categories.ts` and its tests in the same task as the menu move.
- **"All at once" is a large review** → Split commits by concern (navigation code,
  frontmatter moves, new pages, link updates, tooling). One change, many commits.
- **The threshold of 3 is not evidence based** → The page calls it a team rule.
  Revisit after feedback.
- **External links to `/home/...` outside the repo are unknown** → Redirects cover
  them. We cannot count them.
- **Docs and tooling drift** → The guideline and skills are updated in this change.

## Migration Plan

1. Implement navigation code, redirects and MCP aliasing with tests.
2. Move frontmatter and rename files and ids.
3. Write the new pages and update linking pages.
4. Update guidelines, skills, commands, templates.
5. Run `pnpm build:docs`, the docs tests, and MCP tests. Open old URLs in a
   browser (playwright) to check redirects.
6. Add a changeset. Rollback is a revert of the change, because no data changes.

## Open Questions

- Does any lint or the `mcp-eval` app need the old routes as test inputs? (Search
  found `apps/mcp-eval/src/eval.spec.ts`; read it in task 2.)
- Is `purple` an allowed palette for apps? Decide with the owner when fixing
  `button.dev.mdx`.
- Which skills and commands mention the Learn and Foundations structure? Search
  `.claude/` in task 7.
