# Popover Compound Component Export

Jira: [FEC-1167](https://commercetools.atlassian.net/browse/FEC-1167) — epic
[FEC-1134](https://commercetools.atlassian.net/browse/FEC-1134) (MC Usability:
Nimbus Updates)

## Why

Nimbus has no public overlay primitive. Consumers who need a positioned,
dismissible surface around arbitrary interactive content — a filter panel, a
settings popup, a context-sensitive form — have to either misuse `Tooltip`
(non-interactive, hover-only) or `Dialog` (modal, focus-trapping), or hand-roll
React Aria's `DialogTrigger` + `Popover` themselves and reinvent the styling.

A `Popover` component already exists in the package but is not exported: it is a
~15-line styled wrapper around React Aria's `Popover`, used internally by
ComboBox and LocalizedField. Promoting it to a public compound component gives
consumers the missing building block at low cost, since the React Aria
foundation and the compound patterns (Menu, Dialog) are both already in place.

## What Changes

- **New public compound component** `Popover` with three parts —
  `Popover.Root`, `Popover.Trigger`, `Popover.Content` — exported from
  `@commercetools/nimbus`.
- **`Popover.Content` supplies its own React Aria `Dialog`.** React Aria
  requires a `Dialog` inside a `Popover` under `DialogTrigger` for correct
  `role`, accessible naming, and Escape handling. Wrapping it in `Content`
  means consumers cannot get that wrong.
- **`nimbusPopover` becomes a slot recipe.** It moves from
  `theme/recipes/index.ts` to `theme/slot-recipes/index.ts` with slots `root`,
  `trigger`, `content`, `dialog`.
- **The recipe stops using a raw CSS color.** `bg: "white"` becomes the
  semantic token `bg`, matching Menu and Dialog. Enter/exit fade+scale
  animations are lifted from Menu's popover slot for consistency.
- **Internal consumers migrate off the callable `Popover`.** Both ComboBox and
  LocalizedField drop to a bare React Aria `Popover` (what Select already
  does), since both fully override the shared surface in their own recipes.
  Neither is a public API break — `Popover` is not currently exported.
- **Full documentation set** (`.mdx`, `.dev.mdx`, `.a11y.mdx`,
  `.guidelines.mdx`, `.docs.spec.tsx`) plus stories with play functions,
  matching what every other public overlay component ships.
- **The existing `nimbus-popover` spec is corrected.** It currently describes
  eight parts, size variants, a backdrop and an i18n message, none of which
  exist. It is narrowed to what actually ships.

Not breaking: `Popover` has no public consumers today, so the reshape from a
callable component to a namespace object breaks nobody outside the package.

## Capabilities

### New Capabilities

None. `nimbus-popover` already exists as a spec path.

### Modified Capabilities

- `nimbus-popover`: Requirements are narrowed from an eight-part aspirational
  surface (Root, Trigger, Content, Header, Body, Footer, CloseButton, Arrow —
  plus size variants, a backdrop and a `closePopover` message) to the three
  parts actually being built, and the namespace is specified as publicly
  exported. Positioning, dismissal, focus and ARIA requirements are retained
  and made accurate against the React Aria implementation.

ComboBox and LocalizedField change internally but their observable behavior is
unchanged, so `nimbus-combobox` and `nimbus-localized-field` need no delta.

## Impact

**New files** — `packages/nimbus/src/components/popover/`: `components/`
(`popover.root.tsx`, `popover.trigger.tsx`, `popover.content.tsx`, `index.ts`),
`popover.stories.tsx`, `popover.mdx`, `popover.dev.mdx`, `popover.a11y.mdx`,
`popover.guidelines.mdx`, `popover.docs.spec.tsx`.

**Modified files:**

| File | Change |
| --- | --- |
| `popover/popover.tsx` | Becomes exports-only namespace |
| `popover/popover.types.ts` | Slot + part prop types |
| `popover/popover.recipe.tsx` | Plain recipe → slot recipe, tokenized |
| `popover/popover.slots.tsx` | `createRecipeContext` → `createSlotRecipeContext` |
| `popover/index.ts` | Public barrel |
| `components/index.ts` | Adds `export * from "./popover"` |
| `theme/recipes/index.ts` | Removes `nimbusPopover` |
| `theme/slot-recipes/index.ts` | Adds `nimbusPopover` |
| `combobox/components/combobox.popover.tsx` | Uses React Aria `Popover` directly |
| `combobox/combobox.recipe.ts` | Explicit `zIndex: 1` on the `popover` slot |
| `localized-field/components/localized-field.root.tsx` | Uses React Aria `Popover` directly |
| `localized-field/localized-field.recipe.ts` | New `infoPopover` slot preserving inherited styles |
| `localized-field/localized-field.slots.tsx` | New `LocalizedFieldInfoPopoverSlot` |
| `openspec/specs/nimbus-popover/spec.md` | Narrowed to shipped surface |

**Risk.** The recipe re-keying is the one place this can regress: ComboBox and
LocalizedField currently inherit styles from the plain `nimbusPopover` recipe.
ComboBox's own slot already re-declares everything except `zIndex`, which is
why that one property is restored explicitly. Their existing story suites plus
Chromatic are the regression net.

**Release.** Minor version — additive public API. Needs a changeset.

**Out of scope.** `popover.figma.tsx` Code Connect (no Figma node to map to
yet) and i18n (the three-part surface has no close button, so no translatable
string).
