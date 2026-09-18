# Accessibility Documentation Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Documentation (MDX)](./documentation.md) |
[Next: Design Guidelines →](./design-guidelines-docs.md)

## Purpose

Accessibility documentation files (`{component-name}.a11y.mdx`) document the
accessibility behaviour a component **already has** — the ARIA roles it renders,
the keys it responds to, how focus moves through it, and what a screen reader
announces. They render as the "Accessibility" tab on the component's
documentation page.

They are reference material for developers and QA, not a wish list. If something
described here is not true of the component, the file is a bug.

For filename and extension rules, `docs/naming-conventions.md` is authoritative.

## When to Use

Every component that renders interactive or semantic markup gets one. In
practice this includes layout primitives: `box`, `flex`, `grid`, `group`,
`simple-grid`, `stack`, `splitter`, `scroll-area`, `separator`,
`visually-hidden`, `collapsible-motion` and `inline-svg` all have accessibility
documentation, because DOM semantics and focus order are real accessibility
surface even without interaction.

Two kinds of component legitimately have none:

- **Headless infrastructure** with no rendered semantics of its own —
  `nimbus-provider` (a configuration wrapper), `region` (a portal primitive).
- **Components whose accessibility content is still inline** in the base `.mdx`
  file and has not been split out yet. This is a migration gap, not a decision;
  see [Coverage](#coverage).

## File Structure

### Required frontmatter

```mdx
---
tab-title: Accessibility
tab-order: 4
---
```

Both keys are required, and `tab-order: 4` places the tab last, after Overview
(0), Guidelines (2) and Implementation (3). Nothing validates this — see
[Validation](#validation) — so a wrong value fails silently by rendering the tab
in the wrong position.

### Required headings

| Heading                     | Level | Required |
| --------------------------- | ----- | -------- |
| `## Accessibility`          | H2    | Always   |
| `### Accessibility standards` | H3  | Expected |

`## Accessibility` opens every one of these files. `### Accessibility standards`
holds the checklist of WCAG-derived requirements and closes almost all of them.

The one sanctioned variant replaces `### Accessibility standards` with headings
named for the WCAG criteria being satisfied, which suits components that
implement many unrelated criteria. `markdown.a11y.mdx` does this:

```mdx
### Headings (1.3.1, 2.4.6)
### Links (2.4.4, 1.4.1, 1.4.11)
### Images (1.1.1)
### Tables (1.3.1)
### Streaming (4.1.3)
```

Use it when a flat checklist would obscure which criterion each item serves.
Otherwise prefer `### Accessibility standards`.

### Standard opening

Open with the shared definition sentence, then a component-specific paragraph
saying what pattern the component implements:

```mdx
## Accessibility

Accessibility ensures that digital content and functionality are usable by
everyone, including people with disabilities, by addressing visual, auditory,
cognitive, and physical limitations.

Tree is rendered as an ARIA `treegrid` — React Aria's screen-reader-tested
pattern for interactive trees that support selection and per-row actions.
```

The first paragraph is boilerplate and appears in most of these files. The
second is the part that carries information: name the actual pattern, and say
where it comes from.

## Worked Example

`packages/nimbus/src/components/button/button.a11y.mdx`, abridged:

````mdx
---
tab-title: Accessibility
tab-order: 4
---

## Accessibility

Accessibility ensures that digital content and functionality are usable by
everyone, including people with disabilities, by addressing visual, auditory,
cognitive, and physical limitations.

The Button component uses `onPress*` props to handle all user
interactions—mouse clicks, touch taps, and keyboard presses—consistently.

```jsx live
const App = () => (
  <Button size="md" variant="solid" onPress={() => alert("clicked!")}>
    Click me... with your keyboard
  </Button>
)
```

### Accessibility standards

- **Color contrast for text:** The contrast ratio between the button text and
  the button background should be at least 4.5:1 for normal text and 3:1 for
  large text.
- **Focus indicator:** Provide a clear visual indicator when the button receives
  keyboard focus...
- **Keyboard accessibility:** Buttons must be operable using a keyboard. Users
  should be able to navigate to the button using the Tab key and activate it
  using the Enter or Space key.
````

Points to copy:

- The live example demonstrates the accessibility behaviour being described. Here
  the label literally invites keyboard use.
- Standards entries are **bolded term, then explanation** — scannable as a
  checklist.
- Numbers are concrete (4.5:1, 3:1, 24x24 CSS pixels), not "sufficient contrast".

## Code Blocks

Use ` ```jsx live ` for runnable examples. Every accessibility file contains at
least one.

Do **not** use:

- ` ```jsx live-dev ` — reserved for `.dev.mdx`, where the live-dev variant
  exposes the developer-facing editor
- `PropsTable` — the API surface belongs in `.dev.mdx`

Depth should track the component. A component that delegates wholesale to React
Aria needs a short file; one with bespoke semantics needs a long one.
`item.a11y.mdx` runs to 164 lines with subject-specific headings
(`### Presentational by default`, `### Link-mode accessible name`,
`### Actions keep an independent focus order`) because Item's semantics change
with its props.

## Callouts

GitHub alert callouts are rare here — roughly one across the whole set — because
this file states facts rather than giving advice. Do/Don't guidance belongs in
`{component}.guidelines.mdx`. A `> [!NOTE]` is appropriate for a cross-reference,
as in `drop-zone.a11y.mdx` pointing at `FileTrigger`.

## How the Docs Site Consumes This File

Understanding the pipeline explains why the frontmatter matters and why nothing
catches mistakes.

1. **Discovery.** `packages/nimbus-docs-build/src/parsers/parse-mdx.ts` globs the
   component directory for `^{base}\.([^.]+)\.mdx$`, so `button.a11y.mdx` is
   found as the view keyed `a11y`. The regex is generic — a new suffix needs no
   code change.
2. **Never a page of its own.** `parseMdxFile` returns `null` for any filename
   with two dots before `.mdx`, so this file is only ever assembled into its base
   component's page.
3. **Tab assembly.** The parser reads `tab-title` and `tab-order`, defaulting the
   title to the key (`"a11y"`) and the order to `999`, then sorts. Omitting the
   frontmatter yields a tab labelled "a11y" sitting last.
4. **Routing.** Tabs render as `Overview → Guidelines → Implementation →
   Accessibility`, and this file is served at `/<component-route>/a11y`. The
   route comes from the **base** file's `menu` frontmatter; this file has no
   route of its own.
5. **Watch mode.** `apps/docs/scripts/watcher.ts` re-parses the *base* `.mdx`
   when this file changes, because the view only exists as part of that document.

### Two known gaps

- **Not searchable.** The search index generator reads only the base `.mdx`
  content. Nothing written in this file is findable through docs-site search.
  Put anything that must be discoverable in the base file too.
- **Not validated.** Content validation iterates only base documents, never
  views — and the docs build runs with `strict: false` anyway. No tool checks the
  frontmatter, the required headings, or whether the file is empty. Review is the
  only gate.

## Coverage

Eleven components have a base `.mdx` but no accessibility file:
`activity-indicator`, `code`, `default-page`, `nimbus-provider`, `page-content`,
`region`, `skeleton`, `skeleton-circle`, `skeleton-text`, `steps`, `toast`.

Three different reasons, and they need different responses:

| Reason | Components | Action |
| --- | --- | --- |
| Content exists inline in the base `.mdx`, not yet split out | `toast`, `steps`, `default-page`, `page-content` | Split it out; the content is already written |
| No accessibility content anywhere yet | `activity-indicator`, `skeleton` and its derivatives | Write it |
| Legitimately not applicable | `nimbus-provider`, `region` | Leave |

`code.mdx` is a stub whose body is the placeholder text "description later." —
incomplete rather than deliberately omitted.

Derivative components are inconsistent: `range-slider` has an accessibility file,
while `skeleton-circle` and `skeleton-text` do not, mirroring their parent's gap.
See [Derivatives](./derivatives.md).

## Related Guidelines

- [Documentation (MDX)](./documentation.md) — the four MDX file types and how
  they relate
- [Design Guidelines](./design-guidelines-docs.md) — the sibling
  `.guidelines.mdx` tab
- [Naming Conventions](../naming-conventions.md) — authoritative for filenames
- [Stories](./stories.md) — where accessibility behaviour is actually *tested*

Documenting accessibility is not testing it. Assertions live in story play
functions.

## Validation Checklist

- [ ] Filename is `{component-name}.a11y.mdx`, matching the base `.mdx` name
- [ ] Frontmatter has `tab-title: Accessibility` and `tab-order: 4`
- [ ] Opens with `## Accessibility`
- [ ] Includes `### Accessibility standards`, or WCAG-criteria headings with a
      reason
- [ ] Opening paragraph names the actual ARIA pattern and its source
- [ ] At least one ` ```jsx live ` example, demonstrating the behaviour described
- [ ] No ` ```jsx live-dev ` and no `PropsTable`
- [ ] Every claim is true of the current implementation
- [ ] Concrete values (ratios, pixel sizes, key names), not vague adjectives
- [ ] Do/Don't guidance moved to `{component}.guidelines.mdx`
- [ ] Anything that must be searchable also appears in the base `.mdx`

---
