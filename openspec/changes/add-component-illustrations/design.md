# Design

## Context

Docs cards in `apps/docs` (`category-overview.tsx`) show an icon per entry.
Route data comes from `nimbus-docs-build` (`generators/routes.ts`) and is
validated by two zod schemas. `InlineSvg` sanitizes SVG with DOMPurify and
removes `style`. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**

- One look for all 106 illustrations, enforced by code, not by review alone.
- Colors and dark mode come from Nimbus tokens, with no per-file color code.
- New components cannot ship without an illustration.

**Non-Goals:**

- Publishing illustrations to npm.
- Animated or interactive illustrations.
- Using illustrations inside Storybook or the component pages.

## Decisions

**Source is TypeScript, SVG is generated and committed.** Sources use only
kit primitives that take role names (`tone: "strong"`), so a source cannot
contain raw colors. Generated SVGs are committed so docs can import them with
`?raw` and the freshness test can compare bytes. Alternative: hand-written
SVG. Rejected because the look could not be changed in one place.

**Primitives return a branded `Fragment` type.** A raw markup string fails the
typecheck. The kit is built per illustration with its own id prefix, so there
is no global state.

**Colors are roles mapped to CSS variables with ctviolet fallbacks.** Roles use
`light-dark()` where dark mode needs another palette step. The docs place sets
`colorPalette="primary"`; the fallback covers `<img>` use.

**Test in the existing jsdom `unit` project.** `pnpm test` and CI run it with
no workflow change. Every component with a main doc page must have an
illustration from the day it is added.

**Docs read SVGs with `import.meta.glob(..., { query: "?raw" })`.** Ids are
rewritten with a `useId()` prefix so the same picture can appear twice. If Vite
refuses files outside the app root, docs-build copies the SVGs into
`apps/docs/src/data/illustrations/`.

**Card band uses the illustration's default background color**, so band and
SVG look like one surface.

**The route manifest lists illustration names per document**
(`illustrations: string[]`), resolved at build time: a document's own file
first, otherwise the first three illustrations of the documents below it in the
menu (a category page), otherwise none. The card component only renders the
list: one name is a square, several overlap as a small fan. Alternatives: pick
one hero component per category (misrepresents the category) or draw one
illustration per category (more art to keep in sync).

### Metaphors for abstract components

| Component            | Metaphor                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| box                  | One panel with a dashed inner padding guide                              |
| flex                 | A row of 3 panels with different widths, with gap ticks                  |
| grid                 | A 3×3 grid where one cell spans 2 columns                                |
| simple-grid          | A 3×2 grid of equal cells                                                |
| stack                | 3 bars stacked vertically, with equal gap ticks                          |
| spacer               | Two panels with a dashed bracket in the gap between them                 |
| separator            | Two text blocks with a line between them                                 |
| scroll-area          | A panel whose text bars are cut off, with a scrollbar thumb              |
| splitter             | Two panes with a divider handle (grip dots) between them                 |
| default-page         | A page frame with a header bar (title, actions) and content              |
| page-content         | A page with a centered content column and dashed max-width guides        |
| modal-page           | A full page lying over a dimmed page, with a close "X" in the header     |
| nimbus-provider      | An outer frame around small UI pieces, with 3 palette swatches           |
| nimbus-i18n-provider | An outer frame around text bars, with a globe icon                       |
| region               | A dashed area with a small landmark tab or flag on the edge              |
| group                | A field and an icon button joined inside one shared border               |
| localized-field      | Stacked fields with a globe icon and a small language pill               |
| item / item-group    | One list row (icon, text, chevron) / a header plus 3 rows in one panel   |
| inline-svg           | A `</>` bracket stroke next to simple shapes                             |
| icon                 | A 2×2 set of simple line icons                                           |
| collapsible-motion   | A header row, content with up/down chevrons, and a dashed collapsed part |

Look-alike families (text-like inputs, dialog/drawer/modal-page, skeleton trio)
each get one distinguishing glyph and are compared side by side on the sheet.

## Risks / Trade-offs

- [Same SVG twice on a page: `url(#id)` points to the first copy] → The docs
  component rewrites ids with a `useId()` prefix. Other consumers must do the same.
- [A kit change re-renders every SVG] → Expected. Review the full contact sheet after any kit change.
- [`<img src>` cannot inherit variables] → Shows the ctviolet light fallback.
- [Recipe radius cannot be checked by a test] → It is on the reviewer checklist.
