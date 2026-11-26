## Context

Every MDX document has a unique `id` in its front matter. The front matter is
validated by a zod schema that exists twice:
`packages/nimbus-docs-build/src/schemas/mdx-document.ts` and
`apps/docs/src/schemas/mdx-document.ts`. The build (`builders/build.ts`) parses
all documents, validates them with `validateContent`, then writes the route
manifest with `buildManifest`. The docs app reads this manifest through
`useManifest()` (`apps/docs/src/contexts/manifest-context.tsx`). Each manifest
route entry already has `id`, `title`, `description`, `path`, `order` and
`illustrations`. The category overview page
(`components/document-renderer/components/category-overview/`) already renders
illustration cards from these entries.

Note: `validateContent` only stops the build when `config.validation.strict` is
set. Unknown `related` ids must stop the build in every mode, so they need their
own check.

## Goals / Non-Goals

**Goals:**

- Authors list related documents by `id` in one place.
- The reader sees the related documents as cards at the end of the Overview tab.
- Links work in both directions without extra author work.
- A wrong `id` stops the build.

**Non-Goals:**

- Automatic suggestions from tags or categories.
- Showing the section on tabs other than Overview.
- Changing the published `@commercetools/nimbus` package.

## Decisions

### 1. Link by document `id`, in a property named `related`

`id` is unique and does not change when a page moves to another menu category.
`route` is generated from `menu` and would break on such a move.
Alternative: link by route. Rejected because of the move problem.

### 2. Resolve two-way links in the manifest builder

`buildManifest` receives all documents. It builds, for each document, the final
list of related ids: first its own `related` list in the written order, then the
ids of documents that list it, sorted by title. It removes duplicates and the
document's own id. The manifest route entry gets a new field `related: string[]`
(ids only). The docs app turns ids into cards using the route entries it already
has, so title, description, path and illustrations are not copied.
Alternative: resolve in the browser from all documents. Rejected because it
needs the whole manifest logic in the client and is harder to test.

### 3. Unknown ids throw, independent of `validation.strict`

A new check in `validate-content.ts` reports unknown ids with severity `error`.
`build.ts` additionally throws when this check finds an unknown id, even if
`strict` is off. Other validation rules keep their current behavior.
The thrown message names the file and the unknown id.

### 4. Reuse the overview card

The grid card inside `category-overview.tsx` moves to its own file, so both the
category page and the new section use it. The new section component
`RelatedDocuments` reads `related` from the active document's manifest entry and
renders nothing when the list is empty.

### 5. Placement: end of the Overview tab

`document-renderer.tsx` renders `RelatedDocuments` after the Overview content
only. It is not part of the MDX files, so authors cannot forget it and the
position is the same on every page.

## Risks / Trade-offs

- [Two copies of the schema can drift apart] → Change both in one commit; the
  tasks include a check that both schemas accept the same `related` value.
- [Two-way links can show a page that its own file does not list] → This is the
  chosen behavior. The guidelines tell authors that one side is enough.
- [A page with very many related items makes a long section] → No limit for now.
  The guidelines recommend a short list. I don't have data on typical group
  sizes.
- [Search or routes built from the manifest might use all entry fields] → Only
  an added field; existing consumers ignore it. To be confirmed in tests.

## Migration Plan

No data migration. `related` is optional with an empty default, so existing
pages are unchanged. Roll back by removing the field and the section component.

## Open Questions

- Which component groups besides Skeleton get `related`? Candidates are found
  during implementation and listed for maintainer approval before any MDX edit
  (task 5.1).
