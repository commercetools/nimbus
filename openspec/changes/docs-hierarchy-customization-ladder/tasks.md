## 1. Verify open facts

- [x] 1.1 Confirm the Button size list in `button.recipe.ts` and fix the sentence in `button.dev.mdx:31`
- [x] 1.2 Ask the owner whether `purple` is an allowed app palette; replace the `purple.9` example with `colorPalette` or add `nimbus-one-off:`
- [x] 1.3 Read `apps/mcp-eval/src/eval.spec.ts` and `scripts/run-eval.ts` for old route inputs
- [x] 1.4 Search `.claude/` (skills, commands) and `docs/` for text about the Learn and Foundations structure; list the files to update

## 2. Navigation code, redirects, search, MCP (tests first)

- [x] 2.1 Update `navigation-config.ts`: Learn is top-level, Foundations groups are `foundations/design-tokens` and `foundations/style-props`, Contribute is top-level; update `shape-navigation.spec.ts`
- [x] 2.2 Add prefix redirects in `dynamic-route.tsx` for `home/design-tokens/*`, `home/style-props/*` and the two Contribute moves, keeping path rest and hash; add a spec per prefix
- [x] 2.3 Remove the `top === "Home" && sub === "Design Tokens"` special case in `search-categories.ts` and update its tests
- [x] 2.4 Update `section-routes.ts`, `app-nav-bar-menu.tsx` comment, `style-props-banner.tsx`, `count-pages-below.spec.ts` and `illustration-schema.spec.ts` fixtures
- [x] 2.5 Update `packages/nimbus-mcp`: alias old `home/...` prefixes in `get-docs-page.ts`, use new paths in `data-loader.ts`, `types.ts`, tool descriptions and specs
- [x] 2.6 Update `apps/mcp-eval` fixtures and `find-unknown-links.ts` comments; check the sitemap generator output

## 3. Move frontmatter and fix names

- [x] 3.1 Change `menu:` to `Foundations` for the 13 token pages and the style-props pages (about 24 URLs)
- [x] 3.2 Change `menu:` to `Contribute` for Collaboration, Release Process, Development Setup, Stats and the ADRs; add the two `REMOVED_PAGES` entries
- [x] 3.3 Rename `naivgation.mdx` to `navigation.mdx` and fix its `id`
- [x] 3.4 Remove timestamp ids, replace `order: 999` on section and Contribute pages with real orders (sibling style-prop and token pages stay alphabetical), and give the top-level sections distinct orders
- [x] 3.5 Use one title style for ADRs and fix the ADR-0001 apostrophe and the ADR-0000 menu label
- [x] 3.6 Update every internal link that uses `/home/design-tokens` or `/home/style-props` (about 40 MDX files)

## 4. New and changed content

- [x] 4.1 Write `customize-in-three-steps.mdx` in Foundations: three levels, decision rule (more than 3 style props or a layout prop), limits of level 3, numbered decision questions, worked Card example, "For designers" section; verify every prop name in code
- [x] 4.2 Rewrite `foundations.mdx` for the styling system only; remove the Learn card and the "start with Learn" sentence
- [x] 4.3 Update `learn.mdx`, `learn-concepts.mdx` (description and page count) and `home-installation.mdx` next steps
- [x] 4.4 Link Rules 4 and 8, Styling, Layout, Component structure, How style props work and "Style one part" to the ladder page; remove repeated ladder text
- [x] 4.5 Write the designer page "What the system supports" with the shared glossary
- [x] 4.6 Rename "Custom colors" to "Other palette colors" in `badge.mdx` and align other designer wording
- [x] 4.7 Link `home-contribute.mdx` to the repo `docs/` guides on GitHub
- [x] 4.8 Fix `button.dev.mdx` as decided in 1.1 and 1.2

## 5. Guidelines and tooling

- [x] 5.1 Update `docs/file-type-guidelines/documentation.md` (Learn Pages, Foundations, ladder owner) using positive wording
- [x] 5.2 Update the skills, commands and templates found in 1.4

## 6. Verify and release

- [x] 6.1 Run `pnpm build:docs`, `pnpm test:unit`, the docs app and MCP tests, `pnpm lint` and `pnpm typecheck:dev`
- [x] 6.2 Open old and new URLs with Playwright and check redirects, breadcrumbs, top bar and search
- [x] 6.3 Check the sitemap and `find-unknown-links` output
- [x] 6.4 Add a changeset (`pnpm changeset`) following `docs/changeset-conventions.md`
- [x] 6.5 Run `nimbus-reviewer` on the new pages
