# Alert × FeedbackCard Merge — Design

- **Date:** 2026-07-16
- **Branch:** `FEC-988-feedback-card-pattern`
- **Status:** Approved (brainstorming) — ready for implementation plan
- **Author:** Michael Salzmann (with Claude)

## 1. Context & Problem

The `FeedbackCard` pattern
(`packages/nimbus/src/patterns/feedback/feedback-card/`, Beta/InitialDraft) was
built for AI-agent confirmation flows (approve / reject / undo). In practice it
is **an Alert with a different look and a different announcement model** — but
the difference in the announcement model is not "polite vs. assertive," it is
**"no live region at all" (FeedbackCard) vs. "always assertive" (Alert)**.

We want to fold FeedbackCard's capabilities into the `Alert` component so there
is one component and one mental model. While we are in the Alert code, we also
fix its accumulated debt and add the clearly-missing, high-value features a
modern alert should have.

### Status quo (from audit)

**Alert** (`packages/nimbus/src/components/alert/`) is a styling-only compound:

- `role="alert"` is **hardcoded and un-overridable** — written _after_
  `{...restProps}` in `components/alert.root.tsx:34`. `role="alert"` is an
  implicit `aria-live="assertive"` region, so **every** alert always interrupts.
  This contradicts the component's own a11y doc, which recommends
  `role="status"` for non-interrupting messages.
- Recipe has **no `defaultVariants`** (`alert.recipe.ts:50-63`) even though docs
  call `outlined` the default; omitting `variant` renders unstyled.
- The **`outlined` value actually renders a tinted card** (`bg colorPalette.2` +
  border `colorPalette.5` + padding + radius) — i.e. it looks like the
  industry's `subtle`, not a border-only "outline."
- `AlertIconProps` / `AlertIconSlotProps` **types are exported**
  (`alert.types.ts:28,52`) but there is **no public `Alert.Icon` component** —
  an orphaned type. (The visible icon comes from an internal slot auto-populated
  by switching on `colorPalette` — that stays.)
- No way to customize or hide the icon (hiding it requires dropping
  `colorPalette`, which also kills the color).
- `Alert.Title` renders a bare `div` with `fontWeight:600`
  (`components/alert.title.tsx:11`) — not a heading, and not the Nimbus text
  primitive, so it silently loses `TextContext` integration.
- `Alert.DismissButton` is a `div` typed as a full `Button`; most button props
  are silently dropped, and `variant`/`size` are locked.
- `colorPalette` type **excludes `neutral`** (`alert.types.ts:25`); FeedbackCard
  needs `neutral`.
- `alert.a11y.mdx` promises `aria-live`/`aria-atomic` and Esc-to-dismiss that
  the code never implements.

**FeedbackCard** (`packages/nimbus/src/patterns/feedback/feedback-card/`) is
layout-only:

- Three parts: `.Root` / `.Content` / `.Action`; **zero variants**; flex row
  (content leading, single action trailing, wraps on narrow).
- **No role, no aria-live** by design; opt-in `role="group"` + `aria-label`
  only.
- Consumer supplies all surface styling via `colorPalette` + style props, and
  all children (`Heading` / `Text` / `Button`).
- Beta, **not in docs data, no in-repo consumers**. A guideline exception was
  added specifically for it (commit `33be28fbd`, "layout-only slot recipe, no
  variants" in `docs/file-type-guidelines/component-vs-pattern.md`).
- Only the `patterns/feedback` category member; `patterns/feedback/index.ts`
  just re-exports `feedback-card`.

### Industry benchmark (from survey of React Aria/Spectrum, Chakra v3, MUI, Ant, Primer, Atlassian, Polaris, Carbon, Radix/shadcn)

- De-facto **status** vocabulary: info / success / warning / error, plus a
  neutral tone. Nimbus uses info / positive / warning / critical (+ neutral).
- De-facto **emphasis** vocabulary: `subtle` (tinted) / `outline` (border-only)
  / `solid` (high-contrast).
- De-facto **layout** vocabulary: `inline` (in-flow, section-scoped), `banner`
  (full-width page-level); `toast` is universally a **separate component**
  (Nimbus already has Toast — out of scope here).
- A11y consensus: default to **polite** (`role="status"`), escalate to
  **assertive** (`role="alert"`) only for critical; a live region must exist
  before its content changes to announce reliably ("priming").

## 2. Goals / Non-Goals

### Goals

- One component (`Alert`); FeedbackCard's use case expressed as
  `<Alert layout="inline" role="group">`.
- Fix Alert's a11y, recipe, typing, and semantics debt.
- Add high-value industry features: `solid` emphasis, `banner` layout,
  `dismissible` convenience, icon customization, `neutral` status.
- Preserve backwards compatibility of the **typed API and rendered DOM/visual
  structure**. Default **announcement politeness** is allowed to improve.

### Non-Goals (deferred / out of scope)

- Toast stays a separate component; not folded in.
- Comprehensive-tier features: loading/pending state, `autoFocus` for critical,
  codified link-vs-button action semantics.
- Uncontrolled self-dismiss state model (`isOpen`/`onOpenChange`).
- Esc-to-dismiss keyboard behavior (we remove the doc promise instead).
- Automated live-region priming helper (documentation only).

## 3. Backwards-Compatibility Contract

Backwards compatibility covers the **API surface** (every existing prop keeps
working) and the **rendered DOM / visual structure** (existing markup looks
identical). The **default announcement politeness is allowed to change** from
assertive → polite, because no consumer relies on the assertive behavior
specifically. Alert is used ~48 times across 4 repos.

## 4. Detailed Design

### 4.1 Recipe axes

Two orthogonal recipe `variant` groups plus the `colorPalette` system prop:

| Axis                    | Canonical values                                         | Default  | Notes                                                                                                                                                                      |
| ----------------------- | -------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant` (emphasis)    | `flat` · `subtle` · `outline` · `solid`                  | `subtle` | `subtle` = today's tinted card (preserves look). `outline` = **new** border-only, minimal fill. `solid` = **new** high-contrast filled. `flat` = today's no-chrome (kept). |
| `layout`                | `stack` · `inline` · `banner`                            | `stack`  | `stack` = today's grid. `inline` = FeedbackCard row. `banner` = full-width page-level.                                                                                     |
| `colorPalette` (status) | `info` · `positive` · `warning` · `critical` · `neutral` | none     | Relax the type to re-allow `neutral`.                                                                                                                                      |

**Compatibility handling:**

- `variant="outlined"` → deprecated alias resolving to **`subtle`** (identical
  rendering — no visual change). TypeScript keeps accepting `"outlined"` and
  `"flat"`; `@deprecated` JSDoc on `"outlined"` points to `"subtle"`.
- `variant` stays _the_ emphasis axis (Chakra recipe convention); no separate
  `emphasis` prop is invented.
- Set `defaultVariants: { variant: "subtle", layout: "stack" }`. This is a
  **visual change for existing uses that omit `variant`** (unstyled → tinted
  card), matching what the docs always claimed as the default. Accepted.

**Layout specifics:**

- `stack` (default): grid `[icon] [title/description/actions stacked] [dismiss]`
  (today's `auto 1fr auto`).
- `inline`: flex row `[icon?] [title + description] ⟶ [actions] [dismiss]`,
  wrapping actions/dismiss below on narrow widths (the FeedbackCard reflow).
- `banner`: full-width, edge-to-edge (no border radius), horizontal row like
  `inline`; pairs with `subtle`/`solid` emphasis only.

### 4.2 Accessibility model

- **`role`** is a native, overridable prop on `Alert.Root`. Default
  `role="status"` (polite) for **every** status. Fix the spread order so the
  default sits _before_ `{...restProps}` — consumers win.
- Rely on the role's **implicit** `aria-live`/`aria-atomic` (status → polite +
  atomic; alert → assertive + atomic). Both remain native, passable props; our
  defaults never clobber consumer-supplied `aria-*`.
- **Documented guidance:** critical/error alerts that must interrupt pass
  `role="alert"`; the silent (FeedbackCard) case passes `role="group"` +
  `aria-label`.
- **`Alert.Title` → Nimbus `Heading`** component, with a default `as` that
  renders a **non-heading** element (carries Heading styling but does not inject
  into the document outline). Consumers promote it via `as="h2"` etc.
- **`Alert.Description` → Nimbus `Text`** component.
- **Focus on dismiss** stays consumer-owned; documentation-level guidance to
  return focus to a sensible anchor. No automated focus management.
- **Live-region priming:** documentation only (option A). Ship a clear example
  (keep a persistent container mounted and toggle the alert's content, or use
  React Aria's imperative announcer for guaranteed cases). No built-in helper.

### 4.3 Slots, icon, and new props

**Slot roster** (unchanged names — backwards compatible):

- `Alert.Root`
- `Alert.Title` (now Nimbus `Heading`)
- `Alert.Description` (now Nimbus `Text`)
- `Alert.Actions`
- `Alert.DismissButton` (typing fixed: props reach the actual button;
  `variant`/`size` no longer silently locked)
- `Alert.Icon` — **new public compound part** (gives the orphaned type a home)

**Icon control:**

- Omit `Alert.Icon` → auto status icon (today's behavior, via internal
  auto-injection keyed on `colorPalette`).
- Include `<Alert.Icon><CustomIcon/></Alert.Icon>` → custom icon replaces the
  auto one.
- **`hideIcon`** prop on `Alert.Root` → suppress the icon entirely. `hideIcon`
  suppresses **both** the auto icon and any explicit `Alert.Icon`. The exact
  FeedbackCard look is `layout="inline" hideIcon`.
- Auto-injection and the explicit slot coexist; the explicit slot wins when
  present.

**Dismiss ergonomics:**

- Keep the composable `Alert.DismissButton` for advanced cases.
- Add `dismissible?: boolean` on `Alert.Root` → auto-renders the localized
  dismiss button in the correct slot for the current layout.
- Add `onDismiss?: () => void` → fires on press.
- **Control model = callback-only (A):** the consumer still owns removing the
  alert from the tree (matches today's show/hide model). No internal open state.
  Uncontrolled self-dismiss can layer on later without breaking this.
- If both `dismissible` and a manual `Alert.DismissButton` are provided, the
  **manual slot wins** — the auto button is not rendered (no double button).

### 4.4 Removing FeedbackCard

- Delete `packages/nimbus/src/patterns/feedback/feedback-card/` in full.
- Remove the `feedback` pattern category too — `feedback-card` is its only
  member and `patterns/feedback/index.ts` only re-exports it. Remove from
  `patterns/index.ts` and the package barrel.
- Drop `nimbusFeedbackCard` from the slot-recipe registry
  (`packages/nimbus/src/theme/slot-recipes/index.ts`).
- **Revert the guideline exception** added in commit `33be28fbd`
  (`docs/file-type-guidelines/component-vs-pattern.md`, the "layout-only slot
  recipe, no variants" carve-out — approx. lines 63, 89-91, 224, 288-291).
- **Fold its value into Alert:** migrate the agent-confirmation stories +
  `.dev.mdx` examples (approve / reject / undo) under Alert as the
  `layout="inline"` use case.

### 4.5 Impact on existing Alert usage

| Change                                    | Effect                                             | Consumer action                                              |
| ----------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| `variant="outlined"` → alias for `subtle` | Renders identically                                | None                                                         |
| `variant="flat"`                          | Unchanged                                          | None                                                         |
| `variant` omitted                         | Was unstyled → now `subtle`                        | Visual only; matches documented intent                       |
| Default `role` `alert` → `status`         | Non-critical alerts stop interrupting              | None (improvement)                                           |
| Critical alerts now polite by default     | A critical alert that must interrupt is now polite | **Add `role="alert"`** — the one migration note to broadcast |
| `Alert.Title` now Heading-based           | Same visual; gains semantics                       | None (opt into `as="h2"`)                                    |

## 5. Testing & Docs

### Stories (`alert.stories.tsx`) — TDD, play-function coverage

- Each `variant` (`flat`/`subtle`/`outline`/`solid`) and each `layout`
  (`stack`/`inline`/`banner`), including `inline` wrap/reflow on narrow widths.
- `neutral` status; `Alert.Icon` custom icon; `hideIcon`.
- A11y assertions: default renders `role="status"`; `role="alert"` override
  works; `role="group"` + `aria-label` silent mode; icons stay `aria-hidden`.
- `dismissible` + `onDismiss` fires on press; composable `Alert.DismissButton`
  still works.
- Migration guard: `variant="outlined"` renders identically to `subtle`.
- Migrated agent-confirmation examples (approve / reject / undo) as
  `layout="inline"` stories.

### Docs (keep-in-sync sweep)

- `alert.dev.mdx` — new axes, `Alert.Icon` slot, `hideIcon`, `dismissible`,
  `role` guidance, inline/banner use cases, live-region priming pattern (A), the
  critical → `role="alert"` note. Fix the copy-paste "icon buttons" overview
  (`alert.mdx:26`) and the `order: 999` placeholder.
- `alert.a11y.mdx` — correct to real defaults (`role="status"`), document
  override + priming, **remove the unfulfilled Esc-to-dismiss and
  aria-live/aria-atomic promises**.
- `alert.docs.spec.tsx` — give examples a tone + role (audit found
  icon-less/untoned samples).
- `alert.guidelines.mdx` + designer doc — when to use `stack`/`inline`/`banner`,
  `subtle`/`outline`/`solid`, polite vs. assertive.
- `alert.figma.tsx` — realign Code Connect to the new `variant`/`layout` (audit
  found `Ghost→flat` and an unmodeled "Clear button" boolean).

### Build / verify

- Rebuild theme typings after the recipe change (`build-theme-typings`).
- `typecheck:dev` + `lint`.
- `test:storybook:dev` during TDD; full `test:storybook` before merge.
- i18n unchanged (the `dismiss` string already exists).

## 6. Release

- **Changeset: minor**, with a prominent "Behavior changes" section (option A).
  Nothing in the typed API breaks; the changes are default-behavior improvements
  plus removal of an unadopted export.
- Broadcast the one migration note loudly: **re-assert `role="alert"` on
  genuinely-interrupting critical alerts.**

## 7. Resolved Decisions (summary)

1. Merge FeedbackCard into Alert as one component; **remove** FeedbackCard.
2. Expose native, overridable **`role`**; do not invent an `announce` prop.
3. Default **`role="status"`** (polite) for all statuses; document
   `role="alert"` for critical.
4. `variant`: `flat`/`subtle`/`outline`/`solid`, default **`subtle`**;
   `outlined` → `subtle` alias.
5. `layout`: `stack`/`inline`/`banner`, default `stack`.
6. Re-allow `neutral` status.
7. Reuse Alert's existing slots; `Alert.Title` = `Heading` (non-heading default
   `as`), `Alert.Description` = `Text`.
8. Icon customization via a **public `Alert.Icon` slot** + `hideIcon` prop.
9. `dismissible` + `onDismiss` = **callback-only** convenience.
10. Live-region priming = **documentation only**.
11. Drop the Esc-to-dismiss doc promise.
12. Changeset = **minor + loud behavior-change notes**.
