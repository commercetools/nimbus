# Design: FeedbackCard pattern

## Context

`FeedbackCard` is a Tier-3 compound component in structure (namespace object
with `.Root` first, slot recipe, per-part wrapper files) but a **pattern** in
intent: a layout-only composition of existing primitives with no visual
variants. It is the first entry under a new `patterns/feedback/` category and
the first pattern to use a Chakra v3 slot recipe + dot-notation API. The
existing `Card` component (`packages/nimbus/src/components/card/`) is the
structural template and is followed 1:1, minus the recipe variants and minus
Card's React Aria `HeadingContext`/`TextContext` wiring (FeedbackCard content is
arbitrary children, so no context is imposed).

## Goals / Non-Goals

**Goals**

- Ship `FeedbackCard.Root` / `.Content` / `.Action` as a responsive, wrapping
  flex layout.
- Forward all Chakra style props so consumers express every visual context.
- Compose cleanly with existing Nimbus primitives (Text/Heading, Button).

**Non-Goals**

- No `variant`/`size` props; no built-in surface colors, borders, or padding
  (those come from the consumer). The only color the recipe sets is a
  palette-aware text color (`colorPalette.11`) on Root that the content
  inherits.
- No built-in text, no built-in button, no i18n strings.
- No new interactive behavior — the pattern adds no focusable elements of its
  own.

## Directory & wiring

```
packages/nimbus/src/patterns/feedback/
├── index.ts                         # export * from "./feedback-card"
└── feedback-card/
    ├── feedback-card.tsx            # compound object { Root, Content, Action } + _-aliased exports + JSDoc/@example per part
    ├── feedback-card.slots.tsx      # createSlotRecipeContext({ key: "nimbusFeedbackCard" })
    ├── feedback-card.recipe.ts      # defineSlotRecipe — layout + palette-aware text color, NO variants/defaultVariants
    ├── feedback-card.types.ts       # slot props + public props (no variant unions)
    ├── feedback-card.stories.tsx    # title "patterns/feedback/FeedbackCard" + play fns
    ├── feedback-card.dev.mdx        # developer docs
    ├── feedback-card.mdx            # designer docs
    ├── index.ts                     # export * from "./feedback-card"; export * from "./feedback-card.types"
    └── components/
        ├── feedback-card.root.tsx      # displayName "FeedbackCard.Root", @supportsStyleProps
        ├── feedback-card.content.tsx   # displayName "FeedbackCard.Content", @supportsStyleProps
        ├── feedback-card.action.tsx    # displayName "FeedbackCard.Action", @supportsStyleProps
        └── index.ts                    # barrel re-exporting the three wrappers
```

Edits outside the new directory:

- `patterns/index.ts` — add `export * from "./feedback";`
- `theme/slot-recipes/index.ts` — `import { feedbackCardRecipe }` and add
  `nimbusFeedbackCard: feedbackCardRecipe`.
- `src/index.ts` already re-exports `./patterns`, so no change there.

## Slot recipe (layout + palette-aware text color)

`defineSlotRecipe` with `slots: ["root", "content", "action"]`,
`className: "nimbus-feedback-card"`, and a `base` block only (no variants):

- **root**: `display: flex`, `flexWrap: wrap`, `alignItems: center`,
  `justifyContent: space-between`, token `gap` (e.g. `spacing.400`), and
  `color: "colorPalette.11"`. No bg, border, radius, or padding — those are the
  consumer's via style props. The `color` is inherited by the content copy so
  the whole card reads in the consumer's `colorPalette`; the action `Button` is
  unaffected (it sets its own color).
- **content**: `display: flex`, `flexDirection: column`, `flex: "1 1 auto"`,
  `minWidth: 0`, token `gap` for title/subtitle stacking.
- **action**: `display: flex`, `alignItems: center`, `flexShrink: 0`.

No `variants` / `defaultVariants`. The key `nimbusFeedbackCard` is
`nimbus`-prefixed and a valid JS identifier (required — otherwise
`build-theme-typings` silently emits no slot-recipe types).

## Slots & prop handling

`feedback-card.slots.tsx` uses
`createSlotRecipeContext({ key: "nimbusFeedbackCard" })`:

- `FeedbackCardRootSlot = withProvider<HTMLDivElement, …>("div", "root")`
- `FeedbackCardContentSlot = withContext<HTMLDivElement, …>("div", "content")`
- `FeedbackCardActionSlot = withContext<HTMLDivElement, …>("div", "action")`

Explicit `SlotComponent<TElement, TProps>` return-type annotations (from
`type-utils/slot-types`) avoid TS2742 non-portable-type errors. Import paths use
the correct relative depth from `patterns/feedback/feedback-card/` (e.g.
`../../../type-utils/...`) — verify depth against the compiled tree rather than
copying Card's `../../` verbatim.

Root wrapper follows the documented standard pattern (`useSlotRecipe({ key })` →
`splitVariantProps` → `extractStyleProps` → forward). With no variants,
`splitVariantProps` returns `[{}, props]`; the call is kept for consistency with
the design-system convention. Content/Action wrappers are thin:
`extractStyleProps` → forward to their slot.

## Types (four-layer, minus variants)

`feedback-card.types.ts`:

- Slot props: `FeedbackCardRootSlotProps = HTMLChakraProps<"div">`, and the same
  for `...ContentSlotProps` / `...ActionSlotProps`. No `SlotRecipeProps<…>`
  variant unions because the recipe has none.
- Public props:
  `FeedbackCardRootProps = OmitInternalProps<FeedbackCardRootSlotProps> & { children?: React.ReactNode; ref?: React.Ref<HTMLDivElement>; [key: \`data-${string}\`]:
  unknown }`; Content/Action props identical in shape.
- JSDoc on every public prop (strict repo requirement).

## Accessibility decision

`FeedbackCard.Root` renders a neutral `<div>` with **no implicit ARIA role**.
Rationale: it is a soft confirmation, not an alert/live region; forcing a role
would be misleading and could double-announce. The only interactive element is
the consumer's own React Aria `Button` (self-labeled, keyboard accessible), and
the text is consumer-provided. `role`, `aria-*`, and related props forward
through, so a consumer may opt into `role="group"` + `aria-label` when they want
the card announced as a unit. This keeps the pattern honestly "layout-only"
while leaving WCAG 2.1 AA within reach via the consumer's primitives.

## Testing strategy (TDD, stories-as-tests)

`feedback-card.stories.tsx`, title `patterns/feedback/FeedbackCard`. Play
functions are written first and confirmed red before implementation:

- **ApproveContext / RejectedContext**: Content = title + subtitle via Nimbus
  `Heading`/`Text`; Action = `<Button onPress={fn()}>Undo</Button>`; distinct
  consumer style props per story. Assert text present, action button present
  with accessible name, `onPress` fires on `userEvent.click`.
- **StylePropForwarding**: pass `bg`/`border`/`borderRadius`/`padding` to Root;
  assert they land on the rendered element.
- **LayoutContract**: assert all three slots render and Action follows Content
  in DOM order; wrapping layout applied.

## Risks / trade-offs

- **First slot-recipe pattern in `patterns/`.** Establishes a new
  sub-convention; mitigated by mirroring the well-trodden `Card` structure
  exactly.
- **Silent typings failure** if the recipe key is malformed; mitigated by the
  `nimbus`-prefixed identifier key and a `build-theme-typings` step in tasks.
- **Import-depth drift** from Card's `../../` paths; mitigated by verifying
  depth from the deeper `patterns/feedback/feedback-card/` location and running
  `typecheck:dev`.
