## Why

Agent-driven flows in the Merchant Center need an inline "soft confirmation"
surface: after an agent suggestion is approved or rejected, the chat feed should
show a small embedded card that states what happened and offers a single action
(e.g. *Undo*). This is a recurring composition of existing Nimbus primitives,
not a new visual primitive — today every team hand-rolls the flex layout, so the
spacing, wrapping, and action placement drift. FEC-988 asks Nimbus to ship the
canonical layout so consumers stop reinventing it.

Jira: [FEC-988](https://commercetools.atlassian.net/browse/FEC-988) ·
Figma: [node 10094-8293](https://www.figma.com/design/AvtPX6g7OGGCRvNlatGOIY/NIMBUS-design-system?node-id=10094-8293)

## What Changes

- Add a new **`FeedbackCard`** compound pattern under
  `packages/nimbus/src/patterns/feedback/feedback-card/` exposing
  `FeedbackCard.Root`, `FeedbackCard.Content`, and `FeedbackCard.Action`.
- `FeedbackCard` is **layout-only**: a responsive wrapping flex row
  (`flex-wrap`, `space-between`, token gap) that positions consumer-provided
  content and a consumer-provided action button. It renders no text and no
  button of its own.
- **No variant prop.** All visual treatment (bg, border, borderRadius, padding)
  is supplied by the consumer via standard Chakra style props forwarded on
  `FeedbackCard.Root`. Approve vs. reject contexts are expressed purely through
  those style props.
- Introduce a new **`feedback` category** under `patterns/` (new
  `patterns/feedback/index.ts`, wired into `patterns/index.ts`). `FeedbackCard`
  becomes the first pattern to use a Chakra v3 slot recipe + dot-notation
  compound API — modeled 1:1 on the existing `Card` component.
- Register a layout-only slot recipe `nimbusFeedbackCard` in the theme
  slot-recipes index and regenerate theme typings.
- Ship Storybook stories (with play-function tests), developer docs
  (`.dev.mdx`), and designer docs (`.mdx`). No i18n files — all copy is
  consumer-provided.

## Capabilities

### New Capabilities
- `feedback-card-pattern`: A layout-only compound pattern
  (`Root`/`Content`/`Action`) that arranges consumer-provided feedback text and
  a consumer-provided action button into a responsive, wrapping row, with all
  visual chrome driven by forwarded Chakra style props and no variants.

### Modified Capabilities
<!-- None. This is a purely additive pattern; no existing spec-level behavior changes. -->

## Impact

- **New source:** `packages/nimbus/src/patterns/feedback/feedback-card/`
  (`feedback-card.tsx`, `.slots.tsx`, `.recipe.ts`, `.types.ts`, `.stories.tsx`,
  `.dev.mdx`, `.mdx`, `index.ts`, and `components/` with the three part
  wrappers + barrel).
- **Wiring:** new `patterns/feedback/index.ts`; edit `patterns/index.ts`; edit
  `theme/slot-recipes/index.ts` to register `nimbusFeedbackCard`. Public API
  already flows via `src/index.ts` → `export * from "./patterns"`.
- **Build:** run `build-theme-typings` after registering the recipe (a
  non-`nimbus`-prefixed or non-identifier key fails typing generation silently).
- **Consumers:** purely additive — a new export, no changes to existing
  components or their APIs. No breaking changes.
