## Why

The docs pages work, but they look flat and repeat themselves. Looking at the
Button page in the running docs app:

- The header is a title, one line of text and grey tag chips. The component
  illustration is not used there, although all 90 components have one.
- The first heading under the tab bar repeats the tab name ("Overview" under the
  "Overview" tab, "Getting started" under "Implementation").
- Every live example has its own Preview/Code tab strip. The Overview tab of
  Button shows six of them in a row.
- Heading sizes and spacing are close to body text, so sections do not stand
  apart.
- Links to design and code resources are hidden in a "Resources" section in the
  page body, and only the Figma link has a front matter field.

## What Changes

- **Page header.** Pages with the `app-frame` layout get a new header: title and
  lifecycle badge, a larger description, a row of resource link buttons, and the
  component illustration on the right when the page has one. The tag chips are
  removed from the header. Tags stay in the front matter and in the search
  index.
- **Resource links.** Add two optional front matter fields, `storybookLink` and
  `githubLink`, next to the existing `figmaLink`. The header shows a link button
  for each field that is set. Fill in both fields for all component pages. The
  body "Resources" sections stay as they are.
- **View tabs.** Replace the full-width rounded pill with left-aligned underline
  tabs. Each tab is as wide as its label. The bar keeps its current sticky
  position and its hide-on-scroll-down behavior.
- **Duplicate heading.** The first `h2` of a view, when its text equals the
  active tab label, is hidden visually but stays in the page for screen readers.
  The table of contents drops that entry and lists its sub-headings at the top
  level.
- **Example frame.** Each live example becomes one frame: a preview area with
  even padding, and a `</>` toggle button that opens the code editor below it.
  This replaces the Preview/Code tabs. The editor stays editable. The existing
  "Default view" setting (Preview or Code) decides whether examples start closed
  or open.
- **Type hierarchy.** Larger `h2` with more space above it and a rule under it,
  a clear size step down for `h3` and `h4`, and body text at 16px with a line
  height of 1.6.
- **Table of contents.** Show only `h2` entries by default. The `h3` entries of
  the section that contains the active heading are shown too. The existing
  active marker (colored rail segment) is kept.
- Update the documentation, skills and commands that describe the front matter
  and the docs page structure.

Not changed: the left navigation, the top bar, the `wide` and `no-sidebar`
layouts (21 pages), the props table, the token demos, and the published
`@commercetools/nimbus` package.

## Capabilities

### New Capabilities

- `docs-page-presentation`: How a documentation page is laid out in the docs
  app: header, view tabs, duplicate heading handling, example frame, type
  hierarchy and table of contents.
- `docs-resource-links`: The `figmaLink`, `storybookLink` and `githubLink` front
  matter fields, their validation, and how the header shows them.

### Modified Capabilities

- `docs-app`: The "Interactive Code Examples" requirement says the editor SHALL
  show "preview and code tabs". It changes to a preview with a code toggle.

## Impact

- `apps/docs/src/components/doc-metadata/`: becomes the new page header.
- `apps/docs/src/components/document-renderer/document-renderer.tsx`: header for
  all `app-frame` pages, duplicate heading handling.
- `apps/docs/src/components/view-tabs/view-tabs.tsx`: underline style.
- `apps/docs/src/components/document-renderer/components/live-code-editor/`:
  example frame and code toggle.
- `apps/docs/src/components/document-renderer/components/base-tags/` (`h2`,
  `h3`, `h4`, paragraph): type hierarchy.
- `apps/docs/src/components/navigation/toc/toc.tsx` and `hooks/useToc`: shorter
  list and promoted sub-headings.
- `packages/nimbus-docs-build/src/schemas/mdx-document.ts` and
  `apps/docs/src/schemas/mdx-document.ts`: new link fields (both copies).
- About 90 component MDX files: `storybookLink` and `githubLink`.
- `docs/file-type-guidelines/documentation.md`, the `writing-*-documentation`
  skills and `.claude/commands/mdx-from-wireframe.md`: front matter reference.
- Overlaps in time with the open change `use-nimbus-components-in-docs-app`,
  which edits other files in `apps/docs/src` (`app-frame.tsx`, `app-layout.tsx`
  and others). Rebase before merging, and do not mix the two in one commit.
- No change to the published `@commercetools/nimbus` package API, so no
  changeset is expected.
