# Docs Home Page Redesign — Design

- **Date:** 2026-07-23
- **Area:** `apps/docs` — the home route (`home.mdx` → `<Frontpage />`)
- **Status:** Approved (brainstorm), pending implementation plan

## Problem

On wide screens the home route feels empty. The content is a hero card plus four
link cards, and the whole page is clamped to a centered `maxWidth="80ch"` column
(`AppFrameMainContent`), leaving a large void below the fold. The page describes
the design system instead of demonstrating it.

## Goals

- Make effective use of the full main-content width on large screens.
- A **balanced hybrid** page: impressive on first load, still useful for daily
  users.
- Demonstrate Nimbus with **real, interactive** components, not screenshots.
- Surface live, self-updating figures so the page stays accurate as the library
  grows.

## Non-goals

- No change to the app chrome (left sidebar, top nav, breadcrumb, theme/palette
  controls). The home route keeps the left sidebar.
- No new marketing copy pipeline; value-prop text is a single hardcoded line.
- No install command on the home page (peer deps make a one-liner misleading —
  see Decisions).

## Decisions (from brainstorm)

1. **Direction:** balanced hybrid — hero + light showcase up top, practical
   nav/stats below.
2. **Width:** the home route breaks out of the `80ch` clamp to a wide container
   (~1280px), keeping the left sidebar.
3. **Blocks:** hero, at-a-glance stats, enhanced destination cards, live
   component showcase. The "getting-started/install" block is folded into the
   hero's **Get started** CTA (routes to the Installation page, which documents
   the full peer-dependency install).
4. **Layout:** editorial stack (Layout A), full width, top to bottom.
5. **Hero:** branded gradient band + one-line value prop + two CTAs. No inline
   install snippet.
6. **Showcase:** live tile grid — each tile renders a real interactive component
   and links to that component's doc page.

### Why no install snippet

`@commercetools/nimbus` peer-depends on `@chakra-ui/react`,
`@commercetools/nimbus-icons`, `@commercetools/nimbus-tokens`, `react@19`, and
four `slate*` packages. A bare `pnpm add @commercetools/nimbus` would mislead,
so install lives on the Installation page, reached via the hero CTA.

## Layout & content spec

Full-width editorial stack, in order:

### 1. Hero band

- Soft brand-gradient background built from **semantic tokens** (e.g.
  `colorPalette`/`primary`/`neutral` scales) so it follows both the light/dark
  theme toggle and the palette switcher. No hardcoded hex.
- Elements: **Nimbus** wordmark, one-line value prop ("Accessible React
  components, tokens & icons for the Merchant Center"), two CTAs:
  - **Get started** → Installation page (primary)
  - **Browse components** → Components (secondary)

### 2. At-a-glance stats band

- Horizontal row of live figures: **components**, **icons**, **patterns**,
  **hooks**, plus the **version** (v3.2.0 at time of writing).
- All derived at runtime, never hardcoded (see Data sources).

### 3. Destination cards

- Redesigned, richer versions of the existing four (Design Tokens, Components,
  Icons, Hooks), **plus a Patterns card** (a top-nav destination currently
  absent from the cards) — five total.
- Responsive grid: 2-up at `md`, 3-up at `lg`.

### 4. Live component showcase (tile grid)

- Grid of tiles; each tile renders a **real, interactive** Nimbus component with
  its name, linking to that component's doc page.
- Curated starter set: Button, TextInput, Select, Checkbox, Switch, Badge,
  Avatar, Menu. The set is a small config list, easy to extend.

## Data sources (all live)

| Figure/content    | Source                                                                       |
| ----------------- | ---------------------------------------------------------------------------- |
| Component count   | `useManifest()` — `categories` "Components" (95)                             |
| Pattern count     | `useManifest()` — `categories` "Patterns" (19)                               |
| Hook count        | `useManifest()` — `categories` "Hooks" (4)                                   |
| Icon count        | `Object.keys(import * as icons from "@commercetools/nimbus-icons")` (~2,100) |
| Version           | `nimbusPackageVersionAtom` (`@/atoms/nimbus-version`)                        |
| Destination links | Static config list (existing pattern in `frontpage.tsx`)                     |
| Showcase tiles    | Static config list mapping component → render + doc href                     |

## Architecture

`Frontpage` becomes a thin composer of four focused, independently
understandable units, each in its own file under
`apps/docs/src/components/document-renderer/components/frontpage/`:

- `hero.tsx` — `Hero`: branded band + CTAs. No data dependencies beyond route
  hrefs.
- `stats-band.tsx` — `StatsBand`: reads manifest counts, icon count, and
  version; renders the figure row. Owns its own loading/skeleton state.
- `destination-cards.tsx` — `DestinationCards`: config-driven card grid.
- `component-showcase.tsx` — `ComponentShowcase`: renders the curated live tiles
  from a config list.
- `frontpage.tsx` — `Frontpage`: composes the four in editorial-stack order.

Each unit: single purpose, well-defined props, testable in isolation.

### Full-width plumbing

The home route must escape the `80ch` clamp in `AppFrameMainContent` while
keeping the left sidebar. Approach — keep width orthogonal to the existing
`layout` (sidebar vs. no-sidebar) concept:

1. Add an optional `contentWidth` field to the MDX frontmatter schema
   (`src/schemas`), e.g.
   `z.enum(["normal", "wide"]).optional().default("normal")`.
2. `AppFrameMainContent` reads the active doc's `contentWidth` (via
   `useActiveDoc` or by threading it from `DynamicLayout`, mirroring how
   `layout` is resolved) and swaps the inner `Box` `maxWidth` between `80ch`
   (normal) and a wide container (~`1280px`).
3. `home.mdx` sets `contentWidth: wide`.

This confines the change to the home route; every other doc keeps the `80ch`
reading measure by default.

### Styling & theming

- All color/gradient/spacing via Nimbus semantic tokens so the page respects the
  theme toggle and the palette switcher (consistent with recent palette work,
  e.g. `randomSystemColorPalette`).
- No barrel imports from `@chakra-ui/react`; use Nimbus components and modular
  subpath imports per repo convention.

### Error & loading

- Manifest may still be loading: `StatsBand` renders subtle
  skeletons/placeholders and reserves layout space so there is no layout shift
  when numbers arrive.
- Icon count and version are available synchronously (static import / atom).
- Showcase tiles are isolated so a single component cannot break the row.

## Testing

- A light smoke test/story for `Frontpage`: it mounts; destination and showcase
  links resolve to real routes present in the manifest; stats render numeric
  values (or skeletons while loading).
- The showcased components already carry their full test suites in
  `packages/nimbus`; the home page does not re-test component behavior.

## Deferred / easy to flip

- **Stack order** follows the approved Layout A (hero → stats → cards →
  showcase). Moving the showcase directly under the hero is a one-line reorder
  if desired later.
- **Card count** is five (added Patterns). Reverting to four, or adding a sixth
  (Getting Started), is a config edit.
