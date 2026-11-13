## 1. Schema

- [x] 1.1 Add `related: z.array(z.string()).optional().default([])` with a JSDoc comment to `packages/nimbus-docs-build/src/schemas/mdx-document.ts`
- [x] 1.2 Make the same change in `apps/docs/src/schemas/mdx-document.ts`
- [x] 1.3 Write a unit test (spec file) that both schemas accept the same `related` value and default to an empty list

## 2. Build: validation and manifest

- [x] 2.1 Write failing unit tests for unknown ids, two-way links, ordering, duplicates and self-links
- [x] 2.2 Add the unknown-id check to `validation/validate-content.ts` (severity `error`)
- [x] 2.3 Make `builders/build.ts` throw on unknown related ids, also when `validation.strict` is off
- [x] 2.4 Resolve the final related id list in `builders/manifest-builder.ts` and write `related: string[]` into each route entry
- [x] 2.5 Add `related: string[]` to the `RouteManifest` type in `apps/docs/src/contexts/manifest-context.tsx`
- [x] 2.6 Check that search index and sitemap builders still work with the new field

## 3. Docs app UI

- [x] 3.1 Move the grid card from `category-overview.tsx` into its own file and use it in both places
- [x] 3.2 Create the `RelatedDocuments` component: reads the active document's related ids, maps them to manifest entries, renders cards, renders nothing for an empty list
- [x] 3.3 Render `RelatedDocuments` in `document-renderer.tsx` at the end of the Overview tab only
- [x] 3.4 Add a unit test for `RelatedDocuments` (empty list, several ids, id missing from the manifest)

## 4. Skeleton pages

- [x] 4.1 Add `related` to `skeleton.mdx` listing `Components-SkeletonText` and `Components-SkeletonCircle`
- [x] 4.2 Add `related` to the SkeletonText and SkeletonCircle pages, pointing to the other two skeleton components
- [ ] 4.3 Run the docs build and check the section in the browser with Playwright (screenshot of the Skeleton page)

## 5. Other component groups

- [x] 5.1 Find other clear component groups (for example Button, IconButton, ToggleButton) and list them for maintainer approval
- [x] 5.2 After approval, add `related` to the approved pages
- [ ] 5.3 Check each edited page in the browser

## 6. Keep docs and tooling in sync

- [x] 6.1 Document `related` in `docs/file-type-guidelines/documentation.md` (optional front matter fields, two-way behavior, id values)
- [x] 6.2 Update `.claude/skills/writing-developer-documentation/SKILL.md` and `.claude/skills/writing-designer-documentation/SKILL.md`
- [x] 6.3 Update `.claude/commands/mdx-from-wireframe.md` and `docs/file-review-protocol.md` where they list front matter
- [x] 6.4 Add a changeset only if the change affects the published package (expected: not needed); see `docs/changeset-conventions.md`

## 7. Verification

- [ ] 7.1 Run `pnpm test:unit`, `pnpm lint` and `pnpm typecheck:strict`
- [x] 7.2 Run `pnpm build:docs` and confirm a wrong id fails the build
