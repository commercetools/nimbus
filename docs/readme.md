# Nimbus Documentation

This directory contains comprehensive documentation for the Nimbus design system
component development.

## 📚 Documentation Structure

### Component Development

- **[Component Guidelines](./component-guidelines.md)** - Main hub for component
  development guidelines
- **[File Type Guidelines](./file-type-guidelines/)** - Detailed guides for each
  file type in a component
- **[Component Templates](./component-templates/)** - Ready-to-use boilerplate
  code for new components

### AI / Claude Code Tooling

- **[Claude Tooling Map](./claude-tooling.md)** - Source of truth for the
  `.claude/` commands, agents, and skills: what each does, the invocation graph,
  and which doc each one reads. These docs are the canonical reference; the
  tooling references them rather than duplicating them.

## 🚀 Quick Start

### Creating a New Component

1. Start with [Component Guidelines](./component-guidelines.md)
2. Use
   [Architecture Decisions](./file-type-guidelines/architecture-decisions.md) to
   determine component type
3. Copy templates from [Component Templates](./component-templates/)
4. Follow specific guidelines in [File Type Guidelines](./file-type-guidelines/)

### Updating Existing Components

1. Check specific file type guidelines for patterns
2. Use validation checklists to ensure compliance

## 📁 Documentation Index

This is the canonical index of everything under `docs/` — the single hub a human
reads to understand how the repo is organized, and the entry point the tooling
points back to.

**Adding, renaming, or moving a doc?** The process is:

1. Create/move the `.md(x)` file anywhere under `docs/`.
2. Add (or update) its link in the appropriate section below.
3. Run `pnpm check:claude-docs`.

There is **no generated manifest and no list to update in any script** — the
guardrail discovers docs by walking `docs/`, so a new doc is picked up
automatically. It will **fail the build until it is linked here** (and if any
`.claude/` command/skill or doc points at it, that reference must resolve too).
In other words: this index is kept complete by enforcement, not by memory. See
[claude-tooling.md](./claude-tooling.md) for how the tooling consumes these
docs.

### Hubs & navigation

- [component-guidelines.md](./component-guidelines.md) — main navigation hub for
  component development
- [file-type-guidelines/index.md](./file-type-guidelines/index.md) — index of
  per-file-type guides
- [component-templates/index.md](./component-templates/index.md) — index of
  boilerplate templates

### Conventions & standards

- [naming-conventions.md](./naming-conventions.md)
- [types-architecture.md](./types-architecture.md)
- [jsdoc-standards.md](./jsdoc-standards.md)
- [git-conventions.md](./git-conventions.md)
- [changeset-conventions.md](./changeset-conventions.md)

### API & release

- [api-evolution.md](./api-evolution.md) — versioning, deprecation,
  breaking-change policy
- [component-checklist.md](./component-checklist.md) — well-shaped-component
  go/no-go gate
- [package-shape-verification.md](./package-shape-verification.md)
- [bundle-size-monitoring.md](./bundle-size-monitoring.md)
- [bundler-plugins.md](./bundler-plugins.md)

### Documentation authoring

- [writing-style.md](./writing-style.md) — the house writing style for all prose
  (universal core + per-audience overlays), applied in review
- [engineering-docs-template.mdx](./engineering-docs-template.mdx)
- [engineering-docs-template-guide.md](./engineering-docs-template-guide.md)
- [engineering-docs-validation.md](./engineering-docs-validation.md)
- [file-review-protocol.md](./file-review-protocol.md)

### AI / Claude Code tooling

- [claude-tooling.md](./claude-tooling.md) — source of truth for `.claude/`
  commands, agents, and skills

### File-type guidelines (`file-type-guidelines/`)

- [architecture-decisions.md](./file-type-guidelines/architecture-decisions.md)
- [component-vs-pattern.md](./file-type-guidelines/component-vs-pattern.md)
- [barrel-exports.md](./file-type-guidelines/barrel-exports.md)
- [main-component.md](./file-type-guidelines/main-component.md)
- [types.md](./file-type-guidelines/types.md)
- [recipes.md](./file-type-guidelines/recipes.md)
- [slots.md](./file-type-guidelines/slots.md)
- [stories.md](./file-type-guidelines/stories.md)
- [documentation.md](./file-type-guidelines/documentation.md)
- [i18n.md](./file-type-guidelines/i18n.md)
- [compound-components.md](./file-type-guidelines/compound-components.md)
- [hooks.md](./file-type-guidelines/hooks.md)
- [utils-and-constants.md](./file-type-guidelines/utils-and-constants.md)
- [context-files.md](./file-type-guidelines/context-files.md)
- [figma-code-connect.md](./file-type-guidelines/figma-code-connect.md)
- [testing-strategy.md](./file-type-guidelines/testing-strategy.md)
- [unit-testing.md](./file-type-guidelines/unit-testing.md)

### Component templates (`component-templates/`)

Boilerplate for new components — see
[component-templates/index.md](./component-templates/index.md) for the single-
vs compound-component template sets.

## 🔑 Key Principles

1. **Consistency** - Follow established patterns across all components
2. **Accessibility** - Use React Aria for WCAG compliance
3. **Type Safety** - Comprehensive TypeScript definitions
4. **Testing** - Interactive components must have play functions
5. **Documentation** - Every component needs complete MDX documentation
6. **Internationalization** - Translatable UI text via compile-time message
   compilation (`@internationalized/string` with `LocalizedStringDictionary`)

## 🧪 Testing Strategy

Nimbus uses 3 distinct test categories:

| Category                          | File Pattern      | Purpose                                  |
| --------------------------------- | ----------------- | ---------------------------------------- |
| **Story Tests**                   | `*.stories.tsx`   | Internal component behavior testing      |
| **Internal Unit Tests**           | `*.spec.tsx`      | Internal utility and hook testing        |
| **Consumer Implementation Tests** | `*.docs.spec.tsx` | Documentation examples for consumer apps |

See [Testing Strategy Guide](./file-type-guidelines/testing-strategy.md) for
details.

## 🛠 Development Workflow

1. **Plan** - Determine architecture and patterns needed
2. **Implement** - Follow file type guidelines
3. **Test** - Write comprehensive stories with play functions
4. **Document** - Create MDX documentation
5. **Validate** - Run linting, type checking, and build

## 📝 Contributing

When updating these docs:

1. Maintain consistent formatting and structure
2. Include real examples from the codebase
3. Keep navigation links updated
4. Add validation checklists
5. Document common mistakes and solutions

---

For questions or suggestions, please open an issue or pull request.
