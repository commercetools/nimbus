# Keeping Docs and Tooling in Sync

**Important: Keep docs and tooling in sync.** When you change a pattern (file
structure, naming convention, code style, template format, etc.), check whether
that pattern is documented or codified anywhere else and update those locations
too. Common places patterns are referenced:

- **Skills** (`.claude/skills/`) — templates and validation checklists
- **Commands** (`.claude/commands/`) — step-by-step instructions and examples
- **Guidelines** (`docs/file-type-guidelines/`) — documented conventions
- **Templates** (`docs/component-templates/`, `docs/engineering-docs-template*`)

A pattern change is not complete until all references to the old pattern are
updated.

When updating those references, state the new requirement positively. You SHOULD
NOT add a prohibition against the pattern you just removed: once it is gone from
the templates a reader will not invent it, and describing it teaches a dead
pattern to people who would otherwise never encounter it. Deleting it is enough.

Warn against something only when a reader would plausibly reach for it anyway —
it is a common habit outside this repo (e.g. barrel imports from
`@chakra-ui/react`), an older pattern still present elsewhere in the codebase,
or, in designer-facing docs, a component someone could reasonably pick for the
wrong job.
