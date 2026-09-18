# Design Guidelines Documentation Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Accessibility Docs](./accessibility-docs.md) |
[Next: Recipes →](./recipes.md)

## Purpose

Design guidelines files (`{component-name}.guidelines.mdx`) tell a reader **when
to use a component and how to use it well**: which situations it suits, which it
does not, what wording to put in it, and which arrangements to avoid. They render
as the "Guidelines" tab on the component's documentation page.

The audience is designers and product people. This file answers "should I use
this, and how?" — not "what props does it take?" (that is `.dev.mdx`) and not
"what ARIA does it render?" (that is `.a11y.mdx`).

For filename and extension rules, `docs/naming-conventions.md` is authoritative.

## When to Use

Write one whenever a component presents a real choice to whoever is designing
with it — competing options, wording that matters, layouts that can go wrong.

Layout primitives usually do **not** need one. Of the thirteen structural
primitives (`box`, `flex`, `grid`, `group`, `simple-grid`, `stack`, `splitter`,
`scroll-area`, `separator`, `visually-hidden`, `collapsible-motion`,
`inline-svg`, `spacer`), only three have guidelines. They have accessibility
surface worth documenting but little product judgement to offer beyond the
Overview tab. Headless infrastructure — `nimbus-provider`, `region` — needs
neither.

## File Structure

### Required frontmatter

```mdx
---
tab-title: Guidelines
tab-order: 2
---
```

Both keys are required. `tab-order: 2` places the tab second, between Overview
(0) and Implementation (3). Nothing validates this, so an omission silently
produces a tab labelled "guidelines" in last position.

Some existing files also carry a `title:` key. It is read by nothing and has no
effect — do not copy it into new files.

### Required headings

| Heading               | Level | Required |
| --------------------- | ----- | -------- |
| `## Guidelines`       | H2    | Always   |
| `### Best practices`  | H3    | Expected |
| `### Usage`           | H3    | Common   |

Open with `## Guidelines` as an H2. Two existing files open with an
`# X Guidelines` H1 instead (`button`, `table`); that is inconsistent with the
rest and should not be copied — the page already supplies a title.

Keep subsections at H3. `data-table.guidelines.mdx` nests its content at H4,
which flattens oddly in the rendered tab.

After the expected sections, subsequent headings are component-specific and
should name the actual decision being guided. Real examples:
`### Solid-styled widths`, `### Labels and preselection`, `## Icons in buttons`,
`## Button groupings`, `## Preferred words`, `## Avoid these words`.

## The Do / Don't Convention

This is the distinctive feature of the file type, used about four or five times
per file. GitHub alert callouts carry the advice:

- `> [!TIP]` introduces what **to** do
- `> [!CAUTION]` introduces what **not** to do

The trailing backslash after the alert marker forces a line break so the
`**Do**` / `**Don't**` label sits on its own line:

```mdx
> [!TIP]\
> **Do**
>
> - The form is at maximum size and the popover matches the width of the field.
> - Longer options flow to the next line, and when chosen are truncated so the
>   user can still see the icons clearly.

> [!CAUTION]\
> **Don't**
>
> - Do not have different widths for select inputs.
```

Where a section is about choosing between situations rather than getting details
right, the same two callouts take the labels **When to use** and **When not to
use** instead. `button.guidelines.mdx` does this.

Pair the callouts with a live example between them wherever the advice is visual,
so the reader sees the recommended arrangement rather than only reading about it.

## Worked Example

From `packages/nimbus/src/components/select/select.guidelines.mdx`:

````mdx
---
tab-title: Guidelines
tab-order: 2
---

## Guidelines

### Usage

Select inputs are common and users are familiar with their uses. Keeping
consistent with the guidelines will help our products intuitive and easy to
understand, even through complicated areas.

### Solid-styled widths

These placements are more regular, they have either a maximum width of 268px or
form wide. The popover width should match the width of the field itself.

> [!TIP]\
> **Do**
>
> - The form is at maximum size (when not in a pull page form) and the popover
>   matches the width of the field.

```jsx live
const App = () => (
  <Select.Root defaultSelectedKey="project-1" w="6400">
    <Select.Options placeholder="Select...">
      <Select.Option id="project-1">Project 1</Select.Option>
    </Select.Options>
  </Select.Root>
);
```

> [!CAUTION]\
> **Don't**
>
> - Do not have different widths for select inputs.
````

Points to copy:

- The section is named for a real decision ("Solid-styled widths"), not a generic
  label
- Prose states the rule with concrete numbers (268px) before the callouts
- Do → example → Don't, so the reader sees the recommended case in the middle

## Code Blocks

Use ` ```jsx live ` where an example helps. Most of these files have one; about a
quarter are pure prose and bullets, which is fine for wording guidance such as
`## Preferred words`.

Do **not** use ` ```jsx live-dev ` or `PropsTable` — both belong in `.dev.mdx`.

Tables are appropriate for word lists. `button.guidelines.mdx` uses a two-column
table of terms and their meanings for `## Preferred words`, which reads better
than bullets for that content.

## How the Docs Site Consumes This File

1. **Discovery.** `packages/nimbus-docs-build/src/parsers/parse-mdx.ts` globs the
   component directory for `^{base}\.([^.]+)\.mdx$`, finding this file as the
   view keyed `guidelines`. The regex is generic — new suffixes need no code
   change.
2. **Never a page of its own.** Any filename with two dots before `.mdx` is
   skipped as a top-level document; it only ever assembles into its base page.
3. **Tab assembly.** The parser reads `tab-title` and `tab-order`, defaulting to
   the key name and `999`, then sorts.
4. **Routing.** Served at `/<component-route>/guidelines`. The route comes from
   the **base** file's `menu` frontmatter.
5. **Watch mode.** Editing this file re-parses the base `.mdx`, since the view is
   part of that document.

### Two known gaps

- **Not searchable.** The search index reads only base `.mdx` content, so
  nothing here is findable through docs-site search. Anything that must be
  discoverable belongs in the base file too.
- **Not validated.** Content validation only iterates base documents, and the
  docs build runs with `strict: false`. No tool checks frontmatter, headings, or
  whether the file is empty.

## Coverage

Twenty-four components have a base `.mdx` but no guidelines file. Three reasons,
needing different responses:

| Reason | Components | Action |
| --- | --- | --- |
| Content exists inline in the base `.mdx`, awaiting split | `toast`, `skeleton`, `breadcrumbs`, `file-trigger`, `collapsible-motion`, `inline-svg` | Split it out; already written |
| No guidance content anywhere yet | `avatar`, `chat-message`, `chat-message-list`, `tab-nav` | Write it |
| Legitimately not applicable | layout primitives, `nimbus-provider`, `region` | Leave |

The inline cases are the priority: the content exists and is simply in the wrong
file, so the Guidelines tab is missing on components that have guidance to give.

## Related Guidelines

- [Documentation (MDX)](./documentation.md) — the four MDX file types
- [Accessibility Docs](./accessibility-docs.md) — the sibling `.a11y.mdx` tab
- [Naming Conventions](../naming-conventions.md) — authoritative for filenames
- [Component vs Pattern](./component-vs-pattern.md) — which of the two you are
  documenting

## Validation Checklist

- [ ] Filename is `{component-name}.guidelines.mdx`, matching the base `.mdx`
- [ ] Frontmatter has `tab-title: Guidelines` and `tab-order: 2`
- [ ] No stray `title:` key
- [ ] Opens with `## Guidelines` as an H2, not an `# X Guidelines` H1
- [ ] Subsections at H3, not H4
- [ ] Includes `### Best practices`; `### Usage` where it applies
- [ ] Section headings name real decisions, not generic labels
- [ ] Do/Don't advice uses `> [!TIP]\` and `> [!CAUTION]\` with `**Do**` /
      `**Don't**` (or **When to use** / **When not to use**)
- [ ] Visual advice is paired with a ` ```jsx live ` example
- [ ] No ` ```jsx live-dev ` and no `PropsTable`
- [ ] Concrete values where they matter, not vague adjectives
- [ ] Accessibility facts moved to `{component}.a11y.mdx`
- [ ] Anything that must be searchable also appears in the base `.mdx`

---
