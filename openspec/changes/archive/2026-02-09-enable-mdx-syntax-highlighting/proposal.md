# Change: Enable VS Code syntax highlighting in MDX live code blocks

## Why

MDX files use custom language identifiers (`jsx-live`, `jsx-live-dev`) for live
code examples. VS Code doesn't recognize these, so documentation authors get
**no syntax highlighting** when editing MDX files. This degrades the authoring
experience and makes it harder to spot errors in code examples.

## What Changes

- **New authoring syntax**: Authors write `` ```jsx live `` and
  `` ```jsx live-dev `` instead of `` ```jsx-live `` / `` ```jsx-live-dev ``.
  VS Code sees standard `jsx` and provides full syntax highlighting.
- **New remark plugin**: `remarkLiveCode` merges the meta string back into the
  language identifier at runtime, producing the same `language-jsx-live` class
  names the `Code` component already expects.
- **Bulk migration**: All ~228 MDX files (~1,172 occurrences) updated to the new
  syntax.
- **Documentation and tooling updated**: Skills, templates, guides, and OpenSpec
  files reference the new syntax.

## Impact

- Affected specs: `docs-app` (Interactive Code Examples requirement)
- Affected code:
  - `apps/docs/src/components/document-renderer/plugins/remark-live-code.ts`
    (new)
  - `apps/docs/src/components/document-renderer/mdx-string-renderer.tsx`
    (modified)
  - ~228 `.mdx` files in `packages/nimbus/src/` (syntax change)
  - Skill files, templates, and guides in `docs/` and `.claude/` (reference
    updates)
- **No breaking changes**: No public API affected. Only internal authoring
  syntax changes. The old `jsx-live` direct syntax is no longer supported.
