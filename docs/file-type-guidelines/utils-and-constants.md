# Utilities and Constants Guidelines

[← Back to Index](../component-guidelines.md) | [Previous: Hooks](./hooks.md) |
[Next: Context Files →](./context-files.md)

## Purpose

The `utils/` and `constants/` directories contain helper functions, utilities,
configuration constants, and enums specific to a component. They help organize
non-React logic and static values.

## When to Use

### Create Utils When:

- **Pure functions** are needed (no React features)
- **Data transformation** or formatting logic
- **Validation** or parsing functions
- **Complex calculations** that don't need React
- **Helper functions** used multiple times

### Create Constants When:

- **Configuration values** need central management
- **Enums** or string literals are repeated
- **Default values** for complex structures
- **Keyboard shortcuts** or key codes
- **Regex patterns** for validation

### When Utils/Constants Aren't Needed:

- Logic requires React features (use hooks instead)
- The value is local to a single function body and never exported (a `const`
  inside the component function is fine)
- Simple non-exported constants used in one place

## Same Structure for Global and Component-Scoped Utils

The conventions in this document apply identically to:

- **Component-scoped utils**:
  `packages/nimbus/src/components/{component}/utils/`
- **Global utils**: `packages/nimbus/src/utils/`

Same file shape (one purpose per file with the merge rule defined in
[File Organization](#file-organization) below, sibling `*.spec.ts`, `index.ts`
barrel, JSDoc, pure functions, `as const` for constants). When a
component-scoped util turns out to be reusable, promotion to global utils is a
`git mv` — no rewrite, no shape change. Promote whole files, never members;
splitting a family across scope boundaries is a code smell. Many
component-scoped utils are inherently too specific to ever be shared, and that
is fine; the structural parity exists for the cases where promotion is sensible,
not as a forced migration path.

## Directory Structure

```text
component-name/
├── component-name.tsx
├── utils/
│   ├── formatters.ts        # family file (multiple format helpers)
│   ├── validators.ts        # family file (multiple validate helpers)
│   ├── get-initials.ts      # solo helper (no family yet)
│   └── index.ts
├── constants/
│   ├── defaults.ts
│   ├── enums.ts
│   ├── config.ts
│   └── index.ts
└── index.ts
```

Family files (`formatters.ts`, `validators.ts`) and solo files
(`get-initials.ts`) coexist. The shape is determined by the merge rule defined
in [File Organization](#file-organization) below; grab-bag names like
`helpers.ts`, `utils.ts`, or `misc.ts` are not allowed.

## File Organization

A `utils/` folder mixes solo files (one helper, one file) and family files
(multiple cohesive helpers in one file). The choice is mechanical, not
judgmental.

### One Purpose Per File

A solo helper lives in its own kebab-case file (`get-initials.ts`,
`merge-refs.ts`). Cohesive helpers merge into a single family file when **any**
of these criteria hold. Otherwise the new helper gets its own file.

#### Criterion 1: Shared Meaningful Name Token

Tokenize each name by camelCase boundary. Drop **connectors** (`By`, `For`,
`From`, `To`, `With`) and **generic verbs** (`get`, `is`, `has`, `set`, `add`,
`do`, `make`). If any remaining content token of ≥4 characters appears in both
names, merge.

| Existing          | New             | Shared content tokens | Merge?               |
| ----------------- | --------------- | --------------------- | -------------------- |
| `filterByText`    | `filterByFuzzy` | `filter`              | ✅ → `filters.ts`    |
| `parseColor`      | `formatColor`   | `Color`               | ✅ → `color.ts`      |
| `validateEmail`   | `validatePhone` | `validate`            | ✅ → `validators.ts` |
| `getNameInitials` | `getFullName`   | `Name`                | ✅ → `name.ts`       |
| `getInitials`     | `getFullName`   | (only `get`, generic) | ❌ stay separate     |
| `filterByText`    | `parseColor`    | none                  | ❌ stay separate     |

#### Criterion 2: Factory Relationship

A factory whose return value matches a sibling helper's signature belongs in the
same file. Example: `createMultiTermFilter()` returns
`(nodes, input) => filtered`, and `filterByText` matches that signature → same
file.

#### Criterion 3: Direct Dependency

If helper A imports or calls helper B from the same `utils/` folder, they go in
the same file.

### File Naming on Merge

The merged file is named for the **shared token, agent-noun form, pluralized**:

- verb-token → agent-noun pluralized: `filter` → `filters.ts`, `parse` →
  `parsers.ts`, `validate` → `validators.ts`, `format` → `formatters.ts`
- noun-token → keep singular: `color` → `color.ts`, `currency` → `currency.ts`

**Banned filenames**: `helpers.ts`, `utils.ts`, `misc.ts`, or naming a merged
file after a single function (`get-initials.ts` does NOT become the home for
`getFullName`).

### Coupling Rule

**Don't mix promotable and component-coupled helpers in the same file.** If one
helper's signature uses component-internal types/state and another's doesn't,
they don't belong in the same file even if name tokens match. Component-coupled
families use a component-prefixed name (`combobox-filters.ts`); generic families
use the bare family name (`filters.ts`).

This makes promotability mechanical: a file is promotable to
`packages/nimbus/src/utils/` iff all its exports use only types visible at the
global utils layer.

### Scope, Promotion, and Degenerate States

#### Scope-Agnostic

The merge rule is scope-agnostic — same logic applies in
`components/{name}/utils/` and `packages/nimbus/src/utils/`.

#### Promotion

- **Promote whole files, never members.** Splitting a family across scope
  boundaries is a code smell — usually it means the family wasn't really a
  family, or the coupling rule was violated upstream.
- Promotion is itself a write to a `utils/` folder; the merge rule may fire at
  the destination (e.g., promoting two solo helpers that share a token merges
  them at the destination).

#### No Reverse-Merge

If a family file shrinks to one export after deletions, do **not** automatically
rename it back to a solo file. A single-export family file is a tolerated
degenerate state — the family may grow back, and reverse-merging on every
deletion creates churn for nothing.

#### Forward-Applied Only

Existing components with the older convention do **not** need a retroactive
sweep. The rule fires when someone next touches a `utils/` folder; consistency
converges over time without a one-shot migration.

#### Barrel Is the Stable Contract

All imports into the package go through `utils/index.ts`. Deep imports of
specific util filenames are not part of the public contract, so file-level
renames are non-breaking.

## Utils Patterns

### Pure Helper Functions

- Date formatting and localization functions
- String manipulation utilities (truncation, sanitization)
- Mathematical calculations and conversions
- Data validation and parsing functions
- Array and object transformation utilities

### Utils Index File

Export all utility functions from a centralized index file for clean imports.

## Constants Patterns

### Configuration Constants

- Pagination settings and defaults
- Date picker configuration values
- Form validation rules and limits

### Constant Values and Lookup Tables

Constants should contain **values**, not type definitions. Type definitions
belong in the types file.

**Constants Examples:**

- Keyboard key constants (`ENTER_KEY = 'Enter'`, `ESCAPE_KEY = 'Escape'`)
- Validation limits (`MAX_FILE_SIZE = 5000000`, `MIN_PASSWORD_LENGTH = 8`)
- HTTP status codes or error codes
- Lookup tables for data transformation
- Arrays of valid options (when needed for validation/iteration)

**Note:** Component variants (size, visual style) are defined in:

- **Recipe files** for styling variants
- **Types files** for type definitions like `type Size = 'sm' | 'md' | 'lg'`
- **Not in constants** unless you need an array of valid values for
  validation/iteration purposes

### Default Values

- Default option arrays for select components
- Default table column configurations
- Default color palettes for theming

### Regex Patterns

- Common validation patterns (email, URL, phone numbers)
- Input format validators
- Credit card number patterns

### Constants Index File

Export all constants from a centralized index file for clean imports.

## TypeScript Best Practices

### Type-Safe Constants

Use `as const` assertions to ensure immutable, type-safe constant definitions.

### Pure Function Types

Provide explicit TypeScript types for all utility functions with proper
parameter and return type definitions.

## Related Guidelines

- [Hooks](./hooks.md) - React-specific logic
- [Types](./types.md) - Type definitions
- [Main Component](./main-component.md) - Using utils in components

## Validation Checklist

- [ ] Utils in `utils/` subfolder (component-scoped) or
      `packages/nimbus/src/utils/` (global)
- [ ] Constants in `constants/` subfolder
- [ ] **One purpose per file**: a solo helper lives in its own kebab-case file
      (`get-initials.ts`, `merge-refs.ts`); cohesive helpers merge into a single
      family file per the [File Organization](#file-organization) rule. Banned
      filenames: `helpers.ts`, `utils.ts`, `misc.ts`. Promotable and
      component-coupled helpers do not belong in the same file.
- [ ] **Sibling `{name}.spec.ts`** for every util file
- [ ] Pure functions (no React features in utils, no JSX, no side effects at
      module scope)
- [ ] Immutable constants with `as const`
- [ ] JSDoc documentation for all exports
- [ ] Type-safe function signatures
- [ ] `index.ts` barrel re-exports every item
- [ ] Meaningful, descriptive names

---

[← Back to Index](../component-guidelines.md) | [Previous: Hooks](./hooks.md) |
[Next: Context Files →](./context-files.md)
