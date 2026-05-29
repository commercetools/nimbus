# Nimbus Architectural Inconsistencies & Conceptual Incoherence Audit

**Date:** 2026-05-29 **Scope:** `packages/nimbus/src/components` (80 component
dirs) + `packages/nimbus/src/patterns` **Method:** Static read-only audit
measuring the codebase against its own documented norms in
`docs/file-type-guidelines/`. Three parallel investigations (compound/export
shape, prop/API naming, styling/types) plus direct verification of load-bearing
claims. **Status:** Findings only — no code was modified.

---

## How to read this

Each finding states the inconsistency, gives concrete `path:line` evidence,
names the components on **each side** of the divergence, and explains **why it's
incoherent** (what a consumer or maintainer trips on). Findings are ordered by
severity:

- **Tier 1 — Load-bearing / correctness:** silent failures, dead code, broken
  doc generation.
- **Tier 2 — Consumer-facing API incoherence:** the public surface contradicts
  itself.
- **Tier 3 — Internal / cosmetic:** real divergence, but invisible to consumers.

---

## Tier 1 — Load-bearing inconsistencies

### 1.1 Dead, self-regenerating orphan stubs in `components/{confirmation-dialog,detail-page,form-dialog}`

The real implementations of these three "dialog/page" composites live under
`src/patterns/dialogs/…` (e.g.
`patterns/dialogs/confirmation-dialog/confirmation-dialog.tsx:47`,
`patterns/dialogs/form-dialog/form-dialog.tsx:53`). But there are also three
husk directories under `src/components/` containing **only** a
`<name>.messages.ts` + an `intl/` folder and **no `.tsx`**:

- `components/confirmation-dialog/confirmation-dialog.messages.ts` (+ `intl/`)
- `components/detail-page/detail-page.messages.ts` (+ `intl/`)
- `components/form-dialog/form-dialog.messages.ts` (+ `intl/`)

Verified dead: `components/index.ts` does **not** export any of the three, and a
repo-wide search for `components/confirmation-dialog` returns zero references.
The orphan `*.messages.ts` differ from the live `patterns/` copies only by
`normalize-messages` import depth (`../../utils/…` vs `../../../utils/…`). Their
mtimes (May 29, today) show the i18n extract pipeline still **regenerates**
them.

- **Why incoherent:** A maintainer fixing a translation in
  `components/confirmation-dialog/…` edits a file that is never imported — a
  silent no-op. `detail-page` has **no live implementation anywhere** (only the
  husk), so it is a documented-but-nonexistent component.

### 1.2 `_Underscore` doc-extraction footer applied to ~18 compounds, silently absent on 6

Many compounds append a re-export block (`export { XRoot as _XRoot, … }`)
explicitly so `react-docgen-typescript` can extract per-part prop docs — see the
TODO explaining it at `data-table/data-table.tsx:178-183` (calls the mechanism
"awkward").

- **Have it (~18):** accordion, alert, card, collapsible-motion, data-table,
  default-page, dialog, draggable-list, drawer, form-field, list, menu,
  modal-page, page-content, splitter, steps, tabs, toggle-button-group.
- **Absent (6):** combobox, localized-field, radio-input, select, tag-group,
  tooltip.
- **Partial/different shape:** tab-nav (single inline statement vs the
  multi-line block).

- **Why incoherent:** This footer is load-bearing for documentation generation.
  The 6 compounds without it get their sub-part props documented differently (or
  not at all) than peers — an invisible regression with no stated rule for when
  it applies.

### 1.3 `date-range-picker` has neither a `components/` barrel nor barrel-based imports

`components/index.ts` is **missing** for `date-range-picker` (also missing for
`toggle-button-group`, `tooltip`, `nimbus-provider`), and its main file imports
part files directly. The documented rule (illustrated with a dialog/drawer
example in `compound-components.md`) is that parts are imported through the
`./components` barrel — yet even the canonical `dialog` and `drawer` import
around their existing barrels.

- **Why incoherent:** The "barrel" rule is stated authoritatively but followed
  by a minority. New contributors copying `dialog` (the documented exemplar)
  reproduce the violation.

---

## Tier 2 — Consumer-facing API incoherence

### 2.1 `size` scales fragment into ~14 different vocabularies, several non-contiguous

The same `size` prop means different things per component. Worst offenders skip
the middle of the scale:

- **Gap scales (the real trap):**
  - `badge` → `2xs, xs, md` — **no `sm`** (`badge.recipe.ts:31`, verified)
  - `toggle-button-group` → `xs, md` (`:38`), `toolbar` → `xs, md` (`:19`) —
    **no `sm`**
  - `progress-bar` → `2xs, md` only (`:57`)
- **Otherwise divergent:** form inputs cluster on `sm, md`; layout/data add
  `lg`; `button` reaches `2xs..md` (`button.recipe.ts:33`); `icon` uses
  `2xs, xs, md, lg, xl` — **omits `sm`** (`icon.recipe.tsx:13`); `heading` spans
  11 steps (`xs..7xl`); `avatar` lists keys reverse-ordered & gapped
  (`md, xs, 2xs`, `avatar.recipe.ts:31`).

- **Why incoherent:** `"sm"` is the default on most form inputs but **invalid**
  on Badge, Toolbar, ToggleButtonGroup, and Icon. A consumer cannot transfer a
  learned size literal across components, and `<Badge size="sm">` fails for a
  value that is canonical elsewhere.

### 2.2 `toggle-button` has no `size`, but `toggle-button-group` does — and they disagree

`toggle-button.recipe.ts` defines **no `size` variant** (`size=[]`), while
`toggle-button-group.recipe.tsx:38` defines `xs, md` and forwards into the
per-button recipe. The button recipe's own internal scale is `2xs, xs, sm, md`,
which doesn't match the group's `xs, md`.

- **Why incoherent:** A standalone toggle button can't be sized; the grouped one
  can, with a third, mismatched scale. The "same" component sizes differently
  depending on context.

### 2.3 `variant` vocabularies collide: `outline` vs `outlined`, and a fragmented "container appearance" family

- **`outline` vs `outlined` (verified):** `button`, `split-button`, `code`,
  `table`, `toolbar`, `select`, `toggle-button` spell it **`outline`**;
  `alert.recipe.ts:53` and `card.recipe.ts:80` spell it **`outlined`**. Same
  visual concept, two spellings.
- **Container-appearance family fragments 3+ ways for the same idea
  (bordered/filled/flat):**
  - `card` → `plain, outlined, elevated, muted`
  - `alert` → `flat, outlined` (`alert.recipe.ts:50`)
  - `toolbar` → `plain, outline`
  - `code` → `solid, subtle, outline, surface, plain`
  - (`flat` and `plain` appear synonymous; `elevated` and `surface` appear
    synonymous.)
- **`button` vs `split-button`:** identical 5 values in **different order**
  (`solid, subtle, outline, ghost, link` vs
  `solid, ghost, outline, subtle, link`) — signals independent authoring rather
  than a shared source of truth.

- **Why incoherent:** A `variant` value learned on one component is
  unpredictably invalid or differently-spelled on a sibling.

### 2.4 "value changed" callback is `onChange` on some inputs, `onValueChange` on others

For the analogous "this input's value changed" event:

- `onChange` → `rich-text-input.types.ts:59`
- `onValueChange` → `money-input.types.ts:133`,
  `scoped-search-input.types.ts:71`

- **Why incoherent:** Consumers wiring custom inputs must memorize which
  spelling fires per component, for what is conceptually the same callback.

### 2.5 `colorPalette` prop is coherent in name, but its value domain diverges per component

A single semantic-color concept (`colorPalette`) is used everywhere (no
competing `tone`/ `colorScheme`). But the accepted values differ:

- Full `SemanticPalettesOnly` → `button.types.ts:38`, `toggle-button`,
  `toggle-button-group`
- `Exclude<…, "neutral" | "primary">` → `alert.types.ts:25`
- **`"primary" | "white"`** (not even a subset of the semantic palette) →
  `loading-spinner.types.ts:27`

- **Why incoherent:** `colorPalette="critical"` works on Button but not
  LoadingSpinner (`"white"` only); `"neutral"`/`"primary"` are silently invalid
  on Alert. Same prop name, three incompatible vocabularies.

### 2.6 Three incompatible mental models for the "dialog" family

- `dialog` / `drawer` → full `.Root`-first compounds:
  `<Dialog.Root><Dialog.Content>…`.
- `confirmation-dialog` / `form-dialog` → **single** props-configured function
  components in `patterns/` (`<ConfirmationDialog title=… onConfirm=… />`).
- `toast` → **imperative** API (`toast.success({…})`,
  `toast.stories.tsx:88-97`), no component object at all, despite a
  compound-looking folder.

- **Why incoherent:** Four "show me something transient/modal" surfaces, three
  unrelated usage paradigms, with no shared base surfaced to the consumer.

---

## Tier 3 — Internal / structural inconsistencies

### 3.1 File extensions (`.tsx` vs `.ts`) carry no consistent meaning

The guideline permits `.tsx` "if JSX is used." Verified by scanning for JSX
literals:

- **9 `.recipe.tsx` files contain zero JSX** (field-errors, icon, menu,
  money-input, popover, select, split-button, tag-group, toggle-button-group) —
  structurally identical to the 51 `.recipe.ts` files.
- **6 `.types.tsx` files contain zero JSX literals** (group, icon-button, link,
  select, switch, toggle-button-group); the only "hits" are JSDoc `@example`s or
  `React.FC<>` type refs.
- **Of 59 `.slots.*` files, exactly one has JSX**
  (`tag-group/tag-group.slots.tsx:37`). Yet 56 JSX-free files are named
  `.slots.tsx` while two identical JSX-free files (`kbd.slots.ts`,
  `tooltip.slots.ts`) are named `.ts`.

- **Why incoherent:** The `.ts`/`.tsx` boundary tracks nothing — not recipe
  type, not content, not construct. It is residue that misleads anyone using the
  extension as signal.

### 3.2 Compound objects assembled by four different mechanisms

- Plain object literal (majority): `menu`, `dialog`, `splitter`, etc.
- `Object.assign(Base, {…})`: `data-table/data-table.tsx:45`,
  `localized-field/localized-field.tsx:44`
- Explicitly typed literal: `list/list.tsx:12`,
  `collapsible-motion/collapsible-motion.tsx:20`
- Object that mixes member kinds:
  - `combobox` bundles a non-component `filters` utility namespace into the
    component object (`combobox.tsx:244`).
  - `data-table` carries a renderable base **and** `Context` (`:164`) **and**
    `useDataTableContext` (`:175`) — three member kinds in one object.
  - `localized-field` has **no `.Root`** at all; its members are all utility
    functions — a single component dressed as a compound namespace.

- **Why incoherent:** "Compound" is supposed to mean a uniform `.Root`-first
  object of sub-components. These variants violate the contract differently each
  time.

### 3.3 `components/` subfolder means "compound parts" for some, "internal helpers" for others

Five **single** components use `components/` purely for internal sub-views never
exposed as parts: `calendar`, `range-calendar`, `date-picker`,
`date-range-picker`, `rich-text-input`. Meanwhile 2-part compounds like
`radio-input` (Root/Option) and `page-content` (Root/Column) also use it. So a
`components/` dir predicts neither compound-ness nor part-exposure.

- **Why incoherent:** The directory shape no longer signals the documented "this
  is a compound" meaning.

### 3.4 Part-file naming: dot vs dash vs no-prefix

Documented convention is dot-style `component.part.tsx`. Deviations:

- `collapsible-motion` uses **dash**: `collapsible-motion-root.tsx`,
  `-trigger.tsx`, `-content.tsx`.
- `rich-text-input` uses **no component prefix**: `rich-text-editor.tsx`,
  `rich-text-toolbar.tsx`, `formatting-menu.tsx`.

- **Why incoherent:** Glob tooling and humans expecting
  `*/components/<name>.root.tsx` miss these; `formatting-menu.tsx` gives no hint
  which component owns it.

### 3.5 Main-file "exports-only" rule violated by `data-table` (and stretched by `combobox`)

`data-table/data-table.tsx:19-42` defines a full `DataTableBase` component
(refs, JSX return) in the main file before `Object.assign`.
`combobox/combobox.tsx` imports 9 filter utilities and composes them into the
export. Every other compound's main file is genuinely exports-only.

### 3.6 Type-definition idioms diverge for the same job

- **`XRecipeVariantProps` misnomer:** `tag-group.types.ts:20`,
  `localized-field.types.ts:56`, `toggle-button-group.types.tsx:20` name their
  local recipe-props type `…RecipeVariantProps` but **don't import** Chakra's
  `RecipeVariantProps` — they use `SlotRecipeProps<>` underneath, the same thing
  everyone else calls `…RecipeProps`. Misleading synonym.
- **`interface` vs `type`:** 69 type files use `export type XProps`; exactly one
  uses `export interface` — `group/group.types.tsx:34`.
- **Excluded-prop stripping:** `group.types.tsx:28` hand-rolls a local
  `DefaultExcludedProps`
  - `Omit<>`, while peers use the shared `OmitInternalProps<>` util.

### 3.7 `inline-svg` slot factory injects a recipe object instead of a registry key

Recipes register centrally in `theme/recipes/index.ts` (16) and
`theme/slot-recipes/index.ts` (41), and every slot factory references its recipe
by `{ key: "nimbusX" }` — **except** `inline-svg.slots.tsx`, which does
`createRecipeContext({ recipe: iconRecipe })` to reuse Icon's styling. Justified
by intent but a third, undocumented idiom.

---

## Quick reference: which side of each inconsistency

| Inconsistency                            | Conforming majority                                               | Diverging                                                                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `.recipe.ts` (no JSX)                    | 51 components                                                     | 9 `.recipe.tsx` (no JSX): field-errors, icon, menu, money-input, popover, select, split-button, tag-group, toggle-button-group |
| `.types.ts`                              | 63 components                                                     | 6 `.types.tsx` (no JSX): group, icon-button, link, select, switch, toggle-button-group                                         |
| `.slots.tsx` (only tag-group has JSX)    | 57                                                                | `.slots.ts`: kbd, tooltip                                                                                                      |
| `size` contiguous scale                  | form inputs (`sm,md`)                                             | gap scales: badge, toolbar, toggle-button-group, progress-bar, icon                                                            |
| `outline` spelling                       | button, code, table, toolbar, select, split-button, toggle-button | `outlined`: alert, card                                                                                                        |
| value-changed callback                   | RA-inherited `onChange`                                           | `onValueChange`: money-input, scoped-search-input                                                                              |
| `colorPalette` full domain               | button, toggle-button(-group)                                     | narrowed: alert; foreign (`primary\|white`): loading-spinner                                                                   |
| compound = object literal, `.Root` first | most                                                              | Object.assign: data-table, localized-field; no `.Root`: localized-field; imperative: toast                                     |
| `_underscore` doc footer                 | ~18 compounds                                                     | absent: combobox, localized-field, radio-input, select, tag-group, tooltip                                                     |
| live impl in expected dir                | most                                                              | husks in `components/`: confirmation-dialog, detail-page, form-dialog (real code in `patterns/`)                               |
| `components/index.ts` barrel             | most compounds                                                    | missing: date-range-picker, toggle-button-group, tooltip, nimbus-provider                                                      |

---

## What is actually coherent (so the team knows what NOT to touch)

- **Boolean prop naming** — near-universal React Aria `is`-prefix (`isDisabled`,
  `isRequired`, `isInvalid`, `isOpen`, …). The two bare-adjective cases
  (`button`, `text-input`) are deliberate, JSDoc-deprecated legacy bridges, not
  drift.
- **Semantic color prop _name_** — single `colorPalette` concept; no competing
  `tone`/`colorScheme`.
- **Recipe registration** — `defineRecipe`→`recipes` and
  `defineSlotRecipe`→`slotRecipes` buckets are in sync; no dead or unregistered
  recipes (the two documented Chakra-override exceptions, `scrollArea`/`toast`,
  are commented).
- **Slot-creation idiom split** — `createRecipeContext`+`withContext`
  (single-element) vs `createSlotRecipeContext`+`withProvider`+`withContext`
  (multi-element) is applied consistently.
- **i18n file triad** — components with i18n consistently ship `.i18n.ts`
  (source) + `.messages.ts` (compiled) + `intl/`.

---

## Suggested remediation order (highest leverage first)

1. **Delete the dead `components/{confirmation-dialog,detail-page,form-dialog}`
   husks** and fix the i18n extract config that regenerates them (Tier 1.1) —
   silent no-op edits today.
2. **Audit & backfill the `_underscore` doc footer** on the 6 missing compounds,
   or replace the whole mechanism (per its own "awkward" TODO) (Tier 1.2).
3. **Unify the `size` scale** — eliminate gap scales; expose documented
   contiguous subsets (Tier 2.1/2.2).
4. **Normalize `variant` vocabulary** — pick `outline` (not `outlined`); unify
   container appearance words across alert/card/toolbar/code (Tier 2.3).
5. **Standardize the value-changed callback** name (Tier 2.4) and **reconcile
   `colorPalette` value domains** (Tier 2.5).
6. **Mechanical cleanups** — rename JSX-free `.tsx` files to `.ts` (or document
   the real rule), rename `…RecipeVariantProps` types, add missing
   `components/index.ts` barrels (Tier 3).
