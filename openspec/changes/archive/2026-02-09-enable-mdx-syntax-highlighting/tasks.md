## 1. Remark Plugin

- [x] 1.1 Create
      `apps/docs/src/components/document-renderer/plugins/remark-live-code.ts`
  - Walks MDAST tree visiting `code` nodes
  - If `meta` contains `live-dev`, appends `-live-dev` to `lang` (checked first
    to avoid false match)
  - If `meta` contains `live`, appends `-live` to `lang`
  - Clears consumed meta keywords
  - **Validation**: TypeScript compiles (`npx tsc --noEmit` in apps/docs)

- [x] 1.2 Register plugin in
      `apps/docs/src/components/document-renderer/mdx-string-renderer.tsx`
  - Import `remarkLiveCode` from new plugin
  - Add to `remarkPlugins` array: `[remarkGfm, remarkMark, remarkLiveCode]`
  - **Validation**: TypeScript compiles, docs site renders existing pages
    unchanged

## 2. MDX File Migration

- [x] 2.1 Bulk-replace `jsx-live-dev` → `jsx live-dev` in all `.mdx` files under
      `packages/nimbus/src/`
  - Must run before the shorter pattern to prevent false matches
  - **Validation**:
    `grep -r '```jsx-live-dev' packages/nimbus/src/ --include='*.mdx' | wc -l` →
    0

- [x] 2.2 Bulk-replace `jsx-live` → `jsx live` in all `.mdx` files under
      `packages/nimbus/src/`
  - Safe because step 2.1 already changed the longer pattern
  - **Validation**:
    `grep -r '```jsx-live' packages/nimbus/src/ --include='*.mdx' | wc -l` → 0;
    total `jsx live` count matches original 1,172

## 3. Documentation and Tooling Updates

- [x] 3.1 Update template files in `docs/`
  - `docs/engineering-docs-template.mdx` — code fences and prose references
  - `docs/engineering-docs-template-guide.md` — all jsx-live references
  - `docs/file-type-guidelines/documentation.md` — all jsx-live references
  - `docs/file-review-protocol.md` — jsx-live reference

- [x] 3.2 Update skill and agent files in `.claude/`
  - `.claude/skills/writing-developer-documentation/SKILL.md`
  - `.claude/skills/writing-designer-documentation/SKILL.md`
  - `.claude/agents/nimbus-coder.md`
  - `.claude/commands/mdx-from-wireframe.md`

- [x] 3.3 OpenSpec spec files deferred to archive
  - Spec files (`openspec/specs/`, `openspec/project.md`) will be updated via
    `openspec:archive` using the MODIFIED delta

## 4. Verification

- [x] 4.1 TypeScript check: `npx tsc --noEmit` in apps/docs passes with zero
      errors
- [x] 4.2 Zero remaining `jsx-live` (hyphenated) references in codebase
      (excluding remark plugin comments)
- [x] 4.3 Manual smoke test: Start docs site (`pnpm start:docs`), navigate to a
      component page, verify live code blocks render in both preview and editor
      modes
