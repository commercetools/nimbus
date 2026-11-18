## 1. Resource link fields

- [x] 1.1 Add `storybookLink` and `githubLink` (`z.string().url().optional()`, with JSDoc) to `packages/nimbus-docs-build/src/schemas/mdx-document.ts` and `apps/docs/src/schemas/mdx-document.ts`
- [x] 1.2 Find the Storybook story path format from the story `title` fields and the Storybook build output, and write the rule down in `design.md`
- [x] 1.3 Write a unit test that both schema copies accept valid URLs, reject invalid values, and default to unset
- [x] 1.4 Write a script that derives `githubLink` and `storybookLink` for each component MDX file, checks that every URL matches a real folder or story id, and writes the fields into the front matter
- [x] 1.5 Run the script, review the diff, and run the docs build

## 2. Page header

- [x] 2.1 Audit single-view `app-frame` pages for a body heading that repeats the title, and remove those body headings
- [x] 2.2 Write failing unit tests for the header logic (`getResourceLinks`: link order, only set links, no empty row). The docs app has no component render tests, so the layout is checked in the browser (6.1)
- [x] 2.3 Rebuild `doc-metadata` as the page header (title, lifecycle badge, description, link buttons, illustration from `hasIllustration`)
- [x] 2.4 Render the header for every `app-frame` page in `document-renderer.tsx` and remove the separate badge row
- [x] 2.5 Hide the illustration below the `md` breakpoint and mark it `aria-hidden`
- [x] 2.6 Remove the commented-out Figma link block and its TODO from `doc-metadata.tsx`

## 3. View tabs and duplicate heading

- [x] 3.1 Restyle `view-tabs.tsx` as left-aligned underline tabs and keep the sticky, hide-on-scroll and URL logic
- [x] 3.2 Add the sliding indicator and turn off its transition for `prefers-reduced-motion`
- [x] 3.3 Write failing tests for the duplicate heading rule (match, no match, case difference)
- [x] 3.4 Hide the matching first `h2` visually in the `H2` base tag and keep the id
- [x] 3.5 Apply the same rule in `useToc`: drop the entry and promote its `h3` children

## 4. Layout revision

- [x] 4.1 Restore the Preview/Code tabs in `live-code-editor.tsx`
- [x] 4.2 Move the aside into the scroll area and make it sticky
- [x] 4.3 Set the view tabs to `top: 0` and `size="lg"`
- [x] 4.4 Limit paragraphs and lists to `80ch` and remove the column cap
- [x] 4.5 Add the `Carousel` and show the related components under the header

## 5. Type hierarchy and table of contents

- [x] 5.1 Update `H2`, `H3`, `H4` and `Paragraph` in `base-tags` (sizes, spacing, rule on `h2` only, body 16px and line height 1.6) using tokens
- [x] 5.2 Filter `toc.tsx` to `h2` entries plus the `h3` entries of the active section
- [x] 5.3 Write unit tests for the TOC filter (active `h3`, active `h2` with children, no active heading)

## 6. Verify in the browser

- [x] 6.1 Check Button, a single-view page (Radii) and a `wide` page (Accessibility) with Playwright at 1440px, Button at 390px, and Button in dark color mode (a compound component was not checked separately)
- [x] 6.2 Check keyboard use of the tabs, the carousel and the link buttons, and check reduced motion
- [x] 6.3 Run `pnpm --filter docs` type check, lint and unit tests

## 7. Keep docs and tooling in sync

- [x] 7.1 Document `storybookLink` and `githubLink` in `docs/file-type-guidelines/documentation.md` and describe the new header
- [x] 7.2 Update `.claude/skills/writing-developer-documentation/SKILL.md`, `.claude/skills/writing-designer-documentation/SKILL.md` and `.claude/commands/mdx-from-wireframe.md`
- [x] 7.3 Check `docs/file-review-protocol.md` and `docs/engineering-docs-template-guide.md` for front matter lists and the Preview/Code wording
- [x] 7.4 Confirm that no changeset is needed (no published package change); see `docs/changeset-conventions.md`
