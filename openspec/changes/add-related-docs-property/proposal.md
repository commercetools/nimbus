## Why

Some components belong together, for example Skeleton, SkeletonText and
SkeletonCircle. Today a reader of one page has no direct way to find the others.
Authors can only write links by hand inside the page text, and these links are
easy to forget and to leave out of date.

## What Changes

- Add an optional `related` property to the MDX front matter. It is a list of
  document `id` values, for example `related: [Components-SkeletonText]`. The
  default is an empty list.
- The property is allowed on any document, not only component pages.
- The build makes links two-way. If page A lists page B, page B also shows page
  A, even when B does not list A.
- The build fails when a `related` entry is not the `id` of an existing
  document.
- Add a "Related components" section at the end of the Overview tab. It shows
  one illustration card for each related document, using the same card style as
  the category overview pages.
- Add `related` to the Skeleton, SkeletonText and SkeletonCircle pages, and to
  other clear groups of components. The list of other groups is agreed with the
  maintainer before those files are edited.
- Update the documentation, skills and commands that describe the front matter,
  so they all list the new property.

## Capabilities

### New Capabilities

- `docs-related-documents`: The `related` front matter property, how the build
  resolves it (two-way links, validation, ordering), and how the docs app shows
  it.

### Modified Capabilities

None. The existing `docs-app` requirements keep their meaning; the new
behavior is described completely in `docs-related-documents`.

## Impact

- `packages/nimbus-docs-build/src/schemas/mdx-document.ts` and
  `apps/docs/src/schemas/mdx-document.ts`: new `related` field (both copies).
- `packages/nimbus-docs-build/src/validation/validate-content.ts` and
  `packages/nimbus-docs-build/src/builders/manifest-builder.ts`: validation and
  two-way resolution.
- `apps/docs/src/contexts/manifest-context.tsx`: the route manifest type gets a
  `related` list of ids.
- `apps/docs/src/components/document-renderer/`: new "Related components"
  section; the card is shared with `category-overview`.
- MDX files of the chosen component groups.
- `docs/file-type-guidelines/documentation.md`,
  `.claude/skills/writing-developer-documentation/SKILL.md`,
  `.claude/skills/writing-designer-documentation/SKILL.md`,
  `.claude/commands/mdx-from-wireframe.md`: front matter reference.
- No change to the published `@commercetools/nimbus` package API.
