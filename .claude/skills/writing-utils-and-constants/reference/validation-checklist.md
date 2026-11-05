# Utils and Constants Validation Checklist

### Validation Checklist

Validate against these requirements. Each violation MUST be reported with the
specific file path and line number.

#### Category 1: Location & Inlining

- [ ] **No inlined utils in main file**: `{component}.tsx` MUST NOT export pure
      helper functions. Detection: any `export function name(...)` or
      `export const name = (...) => ...` whose return value is not JSX is a
      utility and belongs in `utils/`.
- [ ] **Utils folder exists**: If the component has utilities, they live under
      `packages/nimbus/src/components/{component}/utils/`.
- [ ] **Constants folder exists** (if applicable): Constants live under
      `packages/nimbus/src/components/{component}/constants/`.

#### Category 2: File Organization

- [ ] **One purpose per file**: A solo helper lives in its own
      `{kebab-name}.ts`. Cohesive helpers merge into a single file when
      (1) they share a meaningful name token (≥4 chars after dropping generic
      verbs and connectors), (2) one is a factory for another's signature, or
      (3) they form a direct dependency chain. Merged files are named for the
      shared token (agent-noun pluralized: `filters.ts`, `validators.ts`). Chains are not merged: when A and B share a token and B and C share one, but A and C do not, report the chain instead of merging all three.
      Banned: `helpers.ts`, `utils.ts`, `misc.ts`, or naming a merged file
      after a single export. Promotable and component-coupled helpers do not
      belong in the same file. See
      [File Organization](../../../../docs/file-type-guidelines/utils-and-constants.md#file-organization)
      in `utils-and-constants.md` for the full rule.
- [ ] **Kebab-case filename**: File name matches the function/topic name in
      kebab-case.
- [ ] **Index barrel**: `utils/index.ts` re-exports every util:
      `export { getInitials } from "./get-initials";`
- [ ] **Constants index barrel** (if applicable): `constants/index.ts`
      re-exports every constant.

#### Category 3: Purity

- [ ] **No React imports**: Util files MUST NOT import React, hooks, or any
      `react-aria` modules. If you need React, it's a hook — move it to
      `hooks/` instead.
- [ ] **No JSX**: Util files MUST NOT return JSX. Files containing JSX are
      components, not utilities.
- [ ] **No side effects at module level**: Top-level statements must be
      `import`, `export`, type definitions, or `const` declarations. No
      mutation, no I/O, no DOM access at module scope.
- [ ] **Deterministic**: Pure functions — same input always yields same
      output, no reliance on `Date.now()`, `Math.random()`, or external state
      (unless explicitly passed as a parameter).

#### Category 4: Documentation

- [ ] **JSDoc on every export**: Each exported function/constant has a JSDoc
      block explaining purpose, parameter contracts, and any non-obvious
      behavior (e.g. codepoint safety, locale handling).
- [ ] **No "WHAT" comments**: JSDoc explains WHY/contracts. Don't restate the
      function signature in prose.

#### Category 5: Type Safety

- [ ] **Explicit parameter types**: All parameters typed (TypeScript may
      infer; the export signature should still be explicit).
- [ ] **`as const` for constants**: Constants use `as const` assertions for
      narrowest types.
- [ ] **No `any`**: No `any` types without an inline comment justifying the
      use.

#### Category 6: Testing

- [ ] **Sibling spec exists**: Every `{name}.ts` has a sibling
      `{name}.spec.ts` (Vitest, JSDOM).
- [ ] **Edge case coverage**: Tests cover empty/undefined/null inputs,
      boundary values, and codepoint-sensitive cases (emoji surrogate pairs,
      CJK, RTL) where applicable.
- [ ] **Imports from sibling**: Spec imports the unit under test from
      `./{name}`, NOT from a barrel or the main component file.
- [ ] **Tests pass**: `pnpm test:dev packages/nimbus/src/components/{component}/utils/`
      reports 0 failures.

## How to Count

Run this from the skill folder to count the items. The result is N in the report:

```bash
rg -c '^- \[ \]' reference/validation-checklist.md
```

---
