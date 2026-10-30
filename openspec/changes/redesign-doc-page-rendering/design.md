## Context

Findings from the running docs app and the code (Button page, 1440px wide):

- `document-renderer.tsx` shows `DocMetadata` (title, description, tag chips) only
  when a page has more than one view. Single-view pages show only a lifecycle
  badge.
- `view-tabs.tsx` renders a sticky, full-width rounded pill. It hides when the
  reader scrolls down and shows again on scroll up. The URL holds the active
  view.
- `live-code-editor.tsx` renders `Tabs` (Preview / Code) above a bordered box.
  The code is editable (react-live). A saved "Default view" setting (jotai
  atoms `defaultLiveViewAtom`, `defaultLiveDevViewAtom`) sets the starting tab.
  The `defaultActiveTab` prop is declared on the component but not read by it.
  `base-tags/code.tsx` passes it, so it currently has no effect.
- `toc.tsx` already marks the active heading with a colored rail segment. It lists
  `h1` to `h3` entries all the time.
- `component-illustration.tsx` exports `hasIllustration(name)` and
  `ComponentIllustration`. SVGs are generated into `src/data/illustrations`.
- The front matter schema exists twice, in `packages/nimbus-docs-build` and in
  `apps/docs`. Only `figmaLink` exists today.
- 21 pages use the `wide` or `no-sidebar` layout. All other pages use `app-frame`.
- 117 MDX files have a body "Resources" section. Many also hold React Aria and
  ARIA pattern links, which have no front matter field.

## Goals / Non-Goals

**Goals:**
- A header with one memorable element: the component illustration.
- Fewer repeated controls (one toggle per example, not a tab strip).
- A clearer reading order through heading sizes and spacing.
- Keep all current behavior: URL state, sticky tabs, editable examples, anchors,
  keyboard use, reduced motion.

**Non-Goals:**
- Changing the left navigation, top bar, `wide` and `no-sidebar` pages, props
  table or token demos.
- Moving React Aria and ARIA pattern links into front matter, or deleting the
  117 body "Resources" sections.
- Changing the published `@commercetools/nimbus` package.
- A new color palette or font. The change uses existing Nimbus tokens and the
  current font.

## Decisions

### 1. One header component for all `app-frame` pages

`DocMetadata` becomes the page header and renders for every `app-frame` page,
not only multi-view pages. The lifecycle badge moves into it, so the separate
badge row in `document-renderer.tsx` is removed.

Layout: a two-column grid (text, illustration) from the `md` breakpoint up. The
illustration column is about 200px wide and uses `ComponentIllustration`,
chosen when `hasIllustration(name)` is true. Below `md`, the illustration is not
rendered. The `name` is the component name that the illustration loader uses
today in `document-card.tsx`; implementation reuses that lookup.

Alternative considered: show the illustration above the title on narrow screens.
Rejected: it pushes the title down and the illustration is decoration.

Risk: a single-view `app-frame` page may already repeat its title in the MDX
body, which would show the title twice. See Risks.

### 2. Resource links are front matter, rendered as link buttons

Add `storybookLink` and `githubLink` (optional `z.string().url()`) next to
`figmaLink` in both schema copies. The header renders the Nimbus `Link` styled
as a small button (icon plus label) for each set field, opening in a new tab.

The `githubLink` value is derived from the component folder:
`https://github.com/commercetools/nimbus/tree/main/packages/nimbus/src/components/<folder>`.
The remote `https://github.com/commercetools/nimbus.git` was confirmed with
`git remote get-url origin`.

The `storybookLink` host is `https://nimbus-storybook.vercel.app/`
(`docs/engineering-docs-template-guide.md`). The path format of one story is
not confirmed yet. Task 1.2 reads the `title` fields of the stories and the
Storybook build output to find the exact path before any MDX file is edited.
If a component has no stories, it sets no `storybookLink` and the requirement
"Component pages have links" is checked per component by a script.

Alternative considered: compute both links in the build and add no fields.
Rejected by the maintainer: explicit fields can be overridden per page.

### 3. Underline tabs: restyle, do not rebuild

`view-tabs.tsx` keeps its scroll and URL logic. Only the container changes: no
border radius, no full-width border, a thin bottom rule, left-aligned tabs sized
to their label. The active indicator reuses `useSlidingIndicator` if the
Nimbus `Tabs` or `TabNav` already uses it; otherwise a CSS underline per tab is
used. The indicator transition is disabled under `prefers-reduced-motion`.

Alternative considered: drop the sticky behavior. Rejected: it is an existing
feature and not part of the request.

### 4. Hide the duplicate heading visually, not in the DOM

In the `H2` base tag, the first `h2` of a view is wrapped so that it is
visually hidden when its text equals the active tab label (case-insensitive).
The DOM node, id and anchor stay, so the heading outline for screen readers and
existing links keep working.

The table of contents drops the matching entry and treats its `h3` children as
top-level entries. This is done in `useToc`, not in the visible TOC component,
so there is one place for the rule.

Alternative considered: remove the `## Overview` lines from MDX files. Rejected:
they would break anchors and the guidelines, and 90 files change for a style
rule.

### 5. Example frame: toggle plus disclosure, driven by the existing setting

`LiveCodeEditor` drops `Tabs`. The frame is one bordered container with the
preview area on a slightly tinted surface. A ghost `IconButton` with a code icon
sits in the top-right corner. It has `aria-expanded`, `aria-controls` and an
accessible name ("Show code" / "Hide code"). The editor area below uses the
existing `CollapsibleMotion` component if it fits, otherwise a CSS height
transition. Both are disabled under reduced motion.

The initial state comes from the existing "Default view" atoms: Preview means
closed, Code means open. The settings menu stays and keeps its labels.
`defaultActiveTab` is kept as a prop. This change makes the component read it as
the initial state when the reader has not saved a setting, which makes the
existing call in `base-tags/code.tsx` work as intended.

`LiveError` is rendered outside the collapsible area so that errors show when the
editor is closed.

Alternative considered: keep tabs and only restyle. Rejected by the maintainer.

### 6. Type hierarchy in the base tags

Change `H2`, `H3`, `H4` and `Paragraph` in `base-tags` using Nimbus text styles
and spacing tokens only (no raw pixel values except where the spec names 16px
and 1.6, which map to existing tokens). `h2` keeps its rule; `h3` and `h4` have
none. The content column keeps its `4xl` max width, which gives about 80
characters per line at 16px.

### 7. Short table of contents

`toc.tsx` filters its items: all `h2` entries, plus `h3` entries whose parent
`h2` contains the active heading id. The parent is the nearest earlier `h2` in
the item list. The existing rail and active marker are unchanged. No animation
is added for the list change.

## Risks / Trade-offs

- [A single-view `app-frame` page repeats its title in the body, so the new
  header shows it twice] → Task 2.1 audits these pages first. Where the body
  starts with its own title, the body heading is removed from that MDX file.
- [`storybookLink` path format is wrong for some components] → Task 1.2 finds
  the format from real stories, and a script checks that each generated URL
  matches a story id before the files are written.
- [Closed examples hide code that readers need] → The toggle has a clear name,
  the existing "Default view" setting lets a reader start with code open, and
  `docs.spec.tsx`-style tests are not affected because they test the consumer
  examples, not this UI.
- [Playwright tests or docs tests look for the Preview/Code tabs] → Task 4.5
  searches `apps/docs` and `packages` for those labels and updates them.
- [Open change `use-nimbus-components-in-docs-app` edits nearby docs app files] →
  Keep commits separate and rebase before merging.
- [Hiding the first `h2` makes the page look as if the first section has no
  title] → That is the intent: the tab already names the section. The heading
  stays for screen readers.

## Migration Plan

1. Land schema fields first (they are optional, so nothing breaks).
2. Land UI changes behind no flag; they are visual and reversible by revert.
3. Add the link fields to component MDX files with one script, then review the
   diff and the docs build output.
4. Rollback: revert the commits. The new front matter fields are optional and
   can stay.
