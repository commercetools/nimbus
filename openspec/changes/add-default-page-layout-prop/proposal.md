# Change: Add Layout Prop to DefaultPage

## Why

The DefaultPage component currently has two distinct layout behaviors that are
controlled implicitly through CSS properties rather than explicit API:

1. **Constrained layout** (current default): Root has `height: 100%`, content
   area scrolls independently via `overflow: auto`, header and footer are
   naturally pinned by the CSS grid — `stickyHeader`/`stickyFooter` are
   irrelevant in this mode.
2. **Flexible layout** (achieved by overriding `height: auto`): Root grows with
   content, the whole page scrolls, and `stickyHeader`/`stickyFooter` with
   `position: sticky` are needed to pin header/footer.

The problem: consumers must understand CSS grid internals to pick the right
combination of properties. The `stickyHeader`/`stickyFooter` props are confusing
because they only have an effect in one layout mode, and the mode itself is not
an explicit API concept.

## What Changes

- **NEW** `layout` prop on `DefaultPage.Root` with two values:
  - `"constrained"` (default): `height: 100%`, content area scrolls, header and
    footer are always pinned by the grid. `stickyHeader`/`stickyFooter` are not
    available.
  - `"flexible"`: `height: auto`, the whole page scrolls. `stickyHeader` and
    `stickyFooter` props become available to pin header/footer with
    `position: sticky`.
- **MODIFIED** `DefaultPageProps` type uses a discriminated union so TypeScript
  prevents `stickyHeader`/`stickyFooter` when `layout` is `"constrained"` (or
  omitted).
- **MODIFIED** Recipe adds a `layout` variant that controls `height` on root and
  `overflow` on content.
- **REMOVED** The old flat `stickyHeader`/`stickyFooter` variant props that were
  available regardless of layout mode.
- **MODIFIED** Stories updated to demonstrate both layout modes explicitly.
- **MODIFIED** Developer documentation updated with layout mode guidance.

## Deviations from Original Proposal

The original `add-default-page-component` proposal defined `stickyHeader` and
`stickyFooter` as unconditional boolean variant props on Root. This change
replaces that with a two-level API:

1. `layout` prop selects the layout mode
2. `stickyHeader`/`stickyFooter` are only available when `layout="flexible"`

This is a breaking change to the variant API but the component has not been
released yet, so there is no migration burden.

## Impact

- Affected specs: `nimbus-default-page` (modifies Root Grid Layout, Sticky
  Variants, Type Definitions, Multi-Slot Recipe requirements)
- Affected code:
  - `default-page.types.ts` (discriminated union for props)
  - `default-page.recipe.ts` (layout variant, conditional sticky variants)
  - `default-page.root.tsx` (pass layout variant to recipe)
  - `default-page.stories.tsx` (update stories for both layout modes)
  - `default-page.dev.mdx` (document layout modes)
  - `default-page.docs.spec.tsx` (consumer examples for both modes)
