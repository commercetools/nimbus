# Claude Code Tooling Map

> **This file is the source of truth for the `.claude/` tooling** — the slash
> commands, subagents, and skills that automate component work in this repo.
> When you add, rename, remove, or repoint a command/agent/skill, update this
> file in the same change. A CI/precommit guard (`pnpm check:claude-docs`)
> verifies that the cross-references below — and inside the `.claude/` files —
> actually resolve, so this map cannot silently rot.

[← Back to Component Guidelines](./component-guidelines.md)

## Why this exists

The `.claude/` tooling and the `docs/` guidelines are designed as a pair: the
docs hold the canonical prose (conventions, file-type rules, templates), and the
commands/agents/skills **reference** those docs at runtime (`cat docs/<file>.md`
or `@docs/<file>`) rather than copying them. That keeps a single source of
truth. The failure mode this map guards against is **embedded copies that
drift** (e.g. a skill hard-coding a file path that later moves). Rule of thumb:

- **Canonical facts (paths, conventions, templates) live in `docs/`.**
- **`.claude/` files reference the canonical doc; they do not restate it.**
- **This map records what references what, so drift is detectable.**

## The pipeline: Command → Agent → Skill

```
Commands (your interface)         Agents (multi-step phases)      Skills (single file-type/task)
─────────────────────────         ──────────────────────────      ──────────────────────────────
/propose-component  ──► /brainstorm
                    └─► /opsx:propose ──► /opsx:apply ──► nimbus-coder ──► writing-types
                                                          (implements)     writing-recipes
                                                                           writing-slots
                                                                           writing-main-component
                                                                           writing-stories
                                                                           writing-i18n
                                                                           writing-developer-documentation
                                                                           writing-designer-documentation
                                          nimbus-reviewer ─► (same writing-* skills in "validate" mode)
/create-eng-docs    ──► writing-developer-documentation
/review             ──► writing-* skills (validate mode)
/opsx:archive       ──► (openspec sync)
```

`nimbus-researcher` supports the research phase (React Aria / Chakra docs) and
may invoke `/brainstorm` when a request is underspecified.

## Commands (`.claude/commands/`)

| Command                                                             | Purpose                                         | Delegates to                                               | Canonical doc(s) it should reference                                                  |
| ------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `/propose-component`                                                | End-to-end creation of a new component          | `/brainstorm`, `/opsx:propose`, then the writing-\* skills | `docs/component-guidelines.md`, `docs/file-type-guidelines/architecture-decisions.md` |
| `/create-eng-docs`                                                  | Create `.dev.mdx` + `.docs.spec.tsx`            | `writing-developer-documentation`                          | `docs/engineering-docs-template-guide.md`                                             |
| `/review`                                                           | Review a change/component for compliance        | writing-\* skills (validate)                               | `docs/file-review-protocol.md`, `docs/component-guidelines.md`                        |
| `/mdx-from-wireframe`                                               | MDX docs from a wireframe                       | —                                                          | `docs/file-type-guidelines/documentation.md`                                          |
| `/design-guidelines-jira-ticket`                                    | Jira ticket for a component's design guidelines | —                                                          | `docs/file-type-guidelines/documentation.md`                                          |
| `/housekeeping`                                                     | Update workspace deps with smart ordering       | —                                                          | (automation; no doc dependency)                                                       |
| `/healthcheck`                                                      | Verify repo setup                               | —                                                          | `README.md` (versions)                                                                |
| `/opsx:propose` · `/opsx:apply` · `/opsx:archive` · `/opsx:explore` | OpenSpec change lifecycle                       | openspec-\* skills                                         | `openspec/`                                                                           |
| `/github:fix-security-alerts`                                       | Triage/fix Dependabot alerts                    | —                                                          | (automation)                                                                          |

> The OpenSpec namespace is **`opsx:`** with verb **`propose`** (the legacy
> `/openspec:proposal` command was removed in #1378 — do not reference it).

## Agents (`.claude/agents/`)

| Agent               | Single responsibility                              | Reads                                                            |
| ------------------- | -------------------------------------------------- | ---------------------------------------------------------------- |
| `nimbus-researcher` | Gather library docs/patterns before implementation | React Aria docs (MCP), context7, web                             |
| `nimbus-coder`      | Implement component files per guidelines           | all `docs/file-type-guidelines/` via the writing-\* skills       |
| `nimbus-reviewer`   | Validate implementation against standards          | all `docs/file-type-guidelines/`, `docs/file-review-protocol.md` |

## Skills (`.claude/skills/`)

Each `writing-*` skill owns one file type and **reads its canonical guideline at
runtime**. When updating a skill, change the guideline (canonical) first; the
skill should point at it rather than embedding a second copy.

| Skill                                        | Produces / validates            | Canonical doc it reads                                                                                                 |
| -------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `writing-types`                              | `*.types.ts(x)`                 | `docs/file-type-guidelines/types.md`, `docs/types-architecture.md`, `docs/jsdoc-standards.md`                          |
| `writing-recipes`                            | `*.recipe.ts`                   | `docs/file-type-guidelines/recipes.md` (incl. **Recipe Registration**)                                                 |
| `writing-slots`                              | `*.slots.tsx`                   | `docs/file-type-guidelines/slots.md`                                                                                   |
| `writing-main-component`                     | `*.tsx`                         | `docs/file-type-guidelines/main-component.md` (+ compound, architecture-decisions)                                     |
| `writing-stories`                            | `*.stories.tsx`                 | `docs/file-type-guidelines/stories.md`, `docs/file-type-guidelines/testing-strategy.md`                                |
| `writing-i18n`                               | `*.i18n.ts`                     | `docs/file-type-guidelines/i18n.md`                                                                                    |
| `writing-utils-and-constants`                | utils/constants                 | `docs/file-type-guidelines/utils-and-constants.md`                                                                     |
| `writing-developer-documentation`            | `*.dev.mdx` + `*.docs.spec.tsx` | `docs/engineering-docs-template.mdx`, `docs/engineering-docs-template-guide.md`, `docs/engineering-docs-validation.md` |
| `writing-designer-documentation`             | `*.mdx`                         | `docs/file-type-guidelines/documentation.md`                                                                           |
| `brainstorm`                                 | design exploration              | —                                                                                                                      |
| `openspec-*` (propose/apply/archive/explore) | OpenSpec lifecycle              | `openspec/`                                                                                                            |
| `nimbus-code-connect`                        | `*.figma.tsx`                   | Figma API + `code-connect-constants.ts`                                                                                |
| `update-uikit-mapping`                       | MCP migration data              | `packages/nimbus-mcp/src/data/uikit-migration.ts`                                                                      |

## Load-bearing conventions that ALL component tooling depends on

These are documented canonically elsewhere; collected here because getting them
wrong breaks the build silently:

- **Flat component files** — `{component}/{component}.recipe.ts` etc., **not** a
  `recipes/` subfolder. (`docs/component-guidelines.md`)
- **Recipe registration** — two registries (`theme/recipes/index.ts` for
  standard, `theme/slot-recipes/index.ts` for slot recipes), keyed by a
  **`nimbus`-prefixed** name (`nimbusSwitch`). A bare key fails
  `build-theme-typings` silently. (`docs/file-type-guidelines/recipes.md` →
  Recipe Registration)
- **`SlotComponent`** is imported from `@/type-utils`
  (`packages/nimbus/src/type-utils/slot-types.ts`).
  (`docs/file-type-guidelines/slots.md`)
- **React Aria** imports use the `Ra` prefix. (`docs/component-guidelines.md` →
  Import Conventions)

## When you change the tooling

1. Update the canonical `docs/` file first (it is the source of truth).
2. Make the `.claude/` command/skill/agent **reference** it (don't copy).
3. Update the relevant row in this map.
4. Run `pnpm check:claude-docs` — it fails if any `.claude/` reference to a
   `/command`, skill, or `docs/` path doesn't resolve, or if a
   `docs/file-type-guidelines/*.md` is orphaned (referenced by no tooling).
