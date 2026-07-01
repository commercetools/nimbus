---
description: Create, update, or validate consumer-facing component documentation for a Nimbus component — the designer Overview (.mdx), Guidelines (.guidelines.mdx), engineering Implementation (.dev.mdx), or Accessibility (.a11y.mdx) tab. Use whenever writing or reviewing component docs-site MDX. For the maintainer-facing docs/ folder, this is NOT the skill.
argument-hint: create|update|validate ComponentName [overview|guidelines|dev|a11y]
---

# Writing Consumer Documentation Skill

Author the **consumer-facing** documentation for a Nimbus component — the MDX
that ships to the docs site for people who _consume_ the design system
(designers, integrating developers, product owners). This is distinct from the
**maintainer-facing** `docs/` folder (a future `writing-maintainer-documentation`
skill owns that).

A component is documented by up to four MDX files, each a tab. This skill routes
to the right per-type reference; the **canonical structure rules** live in
[`docs/file-type-guidelines/documentation.md`](../../../docs/file-type-guidelines/documentation.md)
and you MUST read it first.

## 1. Detect doc type + mode

**Doc type** (from `$ARGUMENTS`, or infer from the request / target file):

| Type         | File                         | Tab                | Audience                     | Reference                         |
| ------------ | ---------------------------- | ------------------ | ---------------------------- | --------------------------------- |
| `overview`   | `{component}.mdx`            | Overview (1)       | Designers                    | `reference/designer.md`           |
| `guidelines` | `{component}.guidelines.mdx` | Guidelines (2)     | Designers, product teams     | `reference/guidelines.md`         |
| `dev`        | `{component}.dev.mdx`        | Implementation (3) | Consumers (integrating devs) | `reference/engineering.md` |
| `a11y`       | `{component}.a11y.mdx`       | Accessibility (4)  | All roles                    | `reference/a11y.md`               |

If no type is given, work across **all** the component's tabs (or the ones the
request implies). The `dev` type also owns the companion
`{component}.docs.spec.tsx` test file.

**Mode**: `create` | `update` | `validate`. Default to `create` when unspecified
so a missing doc gets written rather than an existing one silently rewritten.

> Creating a brand-new component? Prefer `/propose-component`, which orchestrates
> this skill across all tabs.

## 2. Read the canonical rules, then the per-type reference

```bash
# Always — the source of truth for structure, frontmatter, and the tabbed model
cat docs/file-type-guidelines/documentation.md
# The house writing style (universal core + the matching overlay)
cat docs/writing-style.md
# The per-type detail for the doc type you detected (one or more of):
cat .claude/skills/writing-consumer-documentation/reference/designer.md
cat .claude/skills/writing-consumer-documentation/reference/guidelines.md
cat .claude/skills/writing-consumer-documentation/reference/engineering.md
cat .claude/skills/writing-consumer-documentation/reference/a11y.md
```

## 3. Apply the shared rules

These hold for every type (full detail in `documentation.md`):

- **Frontmatter** — the main `{component}.mdx` carries full metadata (id, title,
  exportName, description, order, menu, tags); the three view files carry only
  `tab-title` + `tab-order` (Guidelines=2, Implementation=3, Accessibility=4).
- **No top-level `# Title`** in any body — it renders from frontmatter.
- **Live code** — `jsx live` everywhere **except** the Implementation tab, which
  uses `jsx live-dev`. Every block defines `App`; all Nimbus components and
  `useState` are global (no imports).
- **PropsTable** — `<PropsTable id="ComponentName" />` (base namespace for
  compound components).
- **Writing style** — apply the [writing style](../../../docs/writing-style.md)
  universal core plus the overlay for the type: the **designer overlay** for
  `overview` / `guidelines` / `a11y`, the **engineering overlay** for
  `dev`. In prose, "consumer" means an integrating developer; avoid the
  ambiguous word "developer".

## 4. Execute

Follow the create / update / validate steps in the per-type reference file. For
`validate`, emit the reference's validation report. Keep the four tabs
consistent with each other and with the component's actual API.

**Operate on: $ARGUMENTS**
