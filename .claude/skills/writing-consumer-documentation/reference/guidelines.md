# Guidelines Documentation (`{component}.guidelines.mdx`)

> Reference file for the **writing-consumer-documentation** skill, loaded for
> the Guidelines tab. The skill owns mode detection and argument parsing; this
> file is the per-type detail.

Design-decision guidance: how a **designer or product owner** should reason
about using the component — when, how, and when **not** to. Not implementation
detail (that is the `.dev.mdx` Implementation tab) and not the visual variant
tour (that is the `.mdx` Overview tab).

Canonical structure rules live in
[documentation.md](../../../../docs/file-type-guidelines/documentation.md); this
file is the per-type quick reference.

## Frontmatter (minimal — view file)

```yaml
---
tab-title: Guidelines
tab-order: 2
---
```

Inherits id/title/menu/tags from the main `{component}.mdx`. No top-level
`# Title` heading in the body.

## Content structure

1. **Best practices** — concrete do's: content length, visual hierarchy,
   localization, error handling, placement.
2. **When to use / When not to use** — GitHub-style alert blocks, each with a
   short bulleted list:

   ```markdown
   > [!TIP]\
   > **Do** — use when…

   > [!CAUTION]\
   > **Don't** — avoid when…; reach for {AlternativeComponent} instead.
   ```

3. **Component-specific guidance** — e.g. button labels and icon placement,
   input label-vs-placeholder, select width rules, table cell content.
4. **Common mistakes** (optional) — Do/Don't pairs, with a `jsx live` comparison
   where a visual makes the point faster than prose.

## Authoring rules

- Use `jsx live` blocks (**not** `jsx live-dev`) — this is a designer-facing
  tab.
- Design-focused: explain the decision, not the API.
- Prose follows the [writing style](../../../../docs/writing-style.md)
  **designer overlay** — warm and plain, but normative keywords
  (`must`/`should`/`may`) still carry the rule.

## Validation checklist

- [ ] Frontmatter is exactly `tab-title: Guidelines` + `tab-order: 2`.
- [ ] No top-level `# Title` heading in the body.
- [ ] Best practices present.
- [ ] When-to-use / when-not-to-use guidance present (alert blocks).
- [ ] Design-focused, no implementation/API detail.
- [ ] Any examples use `jsx live`, define `App`, and need no imports.

## Reference examples

- `packages/nimbus/src/components/button/button.guidelines.mdx`
- `packages/nimbus/src/components/select/select.guidelines.mdx`
- `packages/nimbus/src/components/text/text.guidelines.mdx`

_Execution (mode + arguments) is handled by the writing-consumer-documentation
skill._
