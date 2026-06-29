# Maintaining the `docs/` Folder

> Conventions for authoring the **maintainer-facing** documentation under
> `docs/` — the guidelines, conventions, and maps a contributor reads to work in
> this repo. This is distinct from **component documentation** (`.dev.mdx`,
> designer `.mdx`) that ships to the docs site; for that, see
> [file-type-guidelines/documentation.md](./file-type-guidelines/documentation.md)
> and the
> [engineering-docs template guide](./engineering-docs-template-guide.md).

[← Back to Documentation Index](./readme.md)

## Diagrams are Mermaid — always

**Any diagram in a `docs/` file (or in a `.claude/` / root `CLAUDE.md` file)
must be a [Mermaid](https://mermaid.js.org/) code block, not hand-drawn ASCII
art.**

````text
✅  ```mermaid
    flowchart LR
        A --> B
    ```

❌  A ──► B   (ASCII boxes, arrows, or column layouts)
````

Why:

- **It renders.** GitHub, the IDE preview, and most Markdown viewers render
  Mermaid as a real diagram; ASCII stays monospace text that breaks on reflow.
- **It diffs cleanly.** A node rename is a one-line diff; realigning ASCII boxes
  churns the whole block.
- **It's already the norm.** Mermaid is used across `architecture-decisions.md`,
  `recipes.md`, `i18n.md`, `stories.md`, `component-vs-pattern.md`,
  `testing-strategy.md`, `file-type-guidelines/index.md`, and the root
  `CLAUDE.md`. New diagrams match that, and existing ASCII diagrams should be
  converted when a file is touched.

Pick the Mermaid type that fits: `flowchart` for pipelines/decision trees,
`sequenceDiagram` for ordered interactions, `graph`/`classDiagram` for
relationships. Use `subgraph` to reproduce column or grouping layouts. Keep node
labels short; put prose explanation in the surrounding text, not inside the
diagram.

## Other conventions

- **One source of truth — reference, don't duplicate.** Canonical facts (paths,
  conventions, templates) live in exactly one doc; other docs and all `.claude/`
  tooling **link** to it rather than restating it. See
  [claude-tooling.md](./claude-tooling.md) for how the tooling consumes these
  docs without copying them.
- **Use real examples from the codebase**, with concrete `package/...` paths.
  Illustrative (non-real) paths should use `{placeholder}` form so the guardrail
  skips them.
- **Keep formatting consistent** with the surrounding docs: sentence-case
  headings, Markdown tables for matrices, fenced code blocks with a language
  tag.
- **Follow the house writing style for the prose.** This doc governs the
  _structure_ of a `docs/` file; the [writing style](./writing-style.md) governs
  the _prose_ — voice, mood, normative keywords (`must`/`should`/`may`),
  terminology, and references. Internal docs use its universal core plus the
  internal `.md` overlay.

## Adding, renaming, or moving a doc

The index in [readme.md](./readme.md) is the single hub, and it is kept complete
by enforcement, not memory. The process and the guardrail it runs
(`pnpm check:claude-docs`) are documented there — follow
[readme.md → Documentation Index](./readme.md#documentation-index). In short:
create/move the `.md(x)` file, link it in the appropriate section of the index,
then run `pnpm check:claude-docs`.
