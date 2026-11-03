## Why

The docs app teaches how to use Nimbus, but it never teaches **when to use which
customization level**. The three levels are: (1) a component and its props, (2) a
few one-off style props, (3) Box, Flex or Stack. Level 1 and 2 are spread over six
Learn pages. Level 3 has no page and no rule for "too many overrides". At the same
time, the menu is confusing: "Foundations" is a label that joins Learn with
Design Tokens and Style Props, while those pages still live under `/home/...`.
A five-agent audit (consuming developer, maintainer, designer, information
architecture, ladder gap) found the same problems from five sides.

## What Changes

- **New page** `Foundations > Customize in three steps`. It teaches the ladder
  with a decision rule, numbered decision questions, one worked Card example, and a short
  "For designers" section that uses the same three level names.
- **Decision rule.** Move from level 2 to level 3 when one element needs more than
  3 style props, or any layout prop (`display`, `position`, `flexDirection`,
  `gridTemplate*`). The number 3 is a team rule. Interactive parts stay Nimbus
  components, because Box has no keyboard, focus or ARIA behavior.
- **Restructure the menu.** Foundations contains the styling system only (the new
  page, Design Tokens, Style Props). Learn becomes its own top-level section.
  Contribute becomes its own top-level section and receives Collaboration and
  Release Process.
- **Align `menu:` frontmatter with the menu.** About 24 pages move from
  `/home/style-props/*` and `/home/design-tokens/*` to `/foundations/...`, and
  Collaboration and Release Process move into Contribute. Prefix redirects keep old
  links working.
- **Make the ladder the single source.** Rules 4 and 8, Styling, Layout,
  Component structure, How style props work and "Style one part" link to the new
  page and drop repeated ladder text.
- **Designer page** `What the system supports`, with a shared glossary for
  `variant`, `size`, `colorPalette`, "custom" and "one-off".
- **Contribute.** `home-contribute.mdx` links to the repo `docs/` guides on GitHub.
  Fix the `naivgation.mdx` file name and id, inconsistent ids, `order: 999`, and
  ADR title styles.
- **Button page.** `button.dev.mdx` states "three size variants" but shows
  `2xs`, `xs`, `sm`, `md` and `xl`. Correct the text. Replace the unmarked
  `purple.9` example with `colorPalette`, or mark it `nimbus-one-off:`.
- **Keep tooling in sync.** Update `docs/file-type-guidelines/documentation.md`
  (Learn Pages section), the docs skills and commands, and templates that describe
  the Learn and Foundations structure.
- **BREAKING (URLs).** About 26 page URLs change. Redirects cover them.

Out of scope: a "Customizing" link line in the component, pattern and hook page
templates.

## Capabilities

### New Capabilities

- `docs-customization-ladder`: the content requirements for the "Customize in
  three steps" page and for the pages that link to it.
- `docs-designer-guidance`: the requirements for the designer page "What the
  system supports" and the shared glossary.

### Modified Capabilities

- `docs-app`: the Navigation System requirement (top-level sections, Foundations
  scope, Contribute as a section), Dynamic Route Resolution (prefix redirects for
  moved sections) and Full-Text Search (categories follow the new menu).

## Impact

- **Content:** `packages/nimbus/src/docs/*.mdx` (about 30 files: Foundations,
  Learn, tokens, style props, Contribute, ADRs), `button.dev.mdx`, a new designer
  page.
- **Docs app code:** `apps/docs/src/components/navigation` config
  (`navigation-config.ts`), `apps/docs/src/routes/dynamic-route.tsx`
  (`REMOVED_PAGES` and prefix redirects), `search-categories.ts`
  (`top === "Home" && sub === "Design Tokens"`),
  `apps/docs/src/components/document-renderer/components/frontpage/section-routes.ts`.
- **Other consumers of paths:** MCP data, the sitemap and external links. These
  must be checked in the design phase. The audit did not check them.
- **Guidelines and tooling:** `docs/file-type-guidelines/documentation.md`,
  `.claude/skills/writing-developer-documentation`,
  `.claude/skills/writing-designer-documentation`, and related commands.
- **Release:** a changeset for the docs and any changed packages.
