## Context

Merchant Center Application Kit shipped three separate modal page components —
`FormModalPage`, `InfoModalPage`, and `TabularModalPage` — that all rendered the
same fullscreen overlay shell (top bar + header + scrollable content + optional
footer) but each baked in its own form controls, footer button layout, and
prop API. Roughly 29 modal page usages exist across MC. Consumers need a single
Nimbus replacement that covers all three patterns without prescribing the page
content itself.

Dialog is the wrong primitive for this: it's centred, sized to content, and
lacks the breadcrumb top bar / pinned footer affordances. DefaultPage is also
wrong — it owns the main viewport, not an overlay. A new tier was needed.

## Approach

`ModalPage` is a Tier-2 compound component built on Drawer with `placement="right"`
and a near-fullscreen width (`calc(100vw - {spacing.1200})`). It exposes nine
slot parts via a `nimbusModalPage` slot recipe that defines a four-row CSS grid
(`auto auto 1fr auto`): TopBar, Header, scrollable Content, optional Footer.

Sub-components:

- **Root** wraps `Drawer.Root` (`isDismissable={false}` to disable backdrop
  click; Escape stays active via React Aria default) and renders
  `ModalPageRootSlot` (the recipe provider) inside `Drawer.Content`. API is
  controlled-only — `isOpen` + `onClose`, no `defaultOpen`.
- **TopBar** renders an `IconButton` with `slot="close"` (React Aria wires this
  to the dialog's close handler), `autoFocus`, and an i18n aria-label
  (`"Go back to {previousPathLabel}"`). The previous label + separator are
  `aria-hidden`; the current label uses `aria-current="page"`.
- **Header** is a 2-column grid (Title column / Actions column). Actions span
  rows 1+2 so they sit centred against Title+Subtitle. A
  `&:has(.nimbus-modal-page__tabNav)` selector zeros bottom padding when TabNav
  is present so tabs sit flush with the border.
- **Title / Subtitle** render as `h2` (dialog accessible name) and `p`
  (`aria-describedby` target).
- **TabNav / Actions / Content / Footer** are layout containers with no business
  logic. Footer has built-in `gap: "200"` so consumers don't need a wrapper.

Slots use Chakra's `createSlotRecipeContext` (`withProvider` for root,
`withContext` for the rest). Headings/landmarks: `<header>` and `<footer>` are
nested inside the dialog's sectioning context, so per ARIA spec §5.3.3 they do
not produce `banner`/`contentinfo` landmarks — comments in the slots file call
this out.

i18n is handled via `modal-page.messages.ts` with a single `backButton` key
consumed through `useLocalizedStringFormatter`.

## Alternatives Considered

- **Extending Dialog with a `fullscreen` variant.** Rejected — Dialog's centred
  layout, sizing model, and lack of breadcrumb/pinned-footer slots would have
  required a parallel rendering path inside Dialog, polluting its API.
- **Three separate Form/Info/Tabular components mirroring App Kit.** Rejected —
  the structural shell is identical across all three; the only difference is
  page content. Compound composition expresses that more cleanly and removes
  three near-duplicate APIs.
- **Building atop a not-yet-existing `Page` base.** Rejected as premature —
  DefaultPage and ModalPage have different layout responsibilities (viewport
  owner vs. overlay) and no shared primitive emerged from the design pass.

## Risks / Trade-offs

- **Backdrop-click disabled** is a deliberate UX break from App Kit's modals
  to prevent data loss on long forms. Documented in dev docs; Escape still
  dismisses to satisfy WCAG 2.1 SC 2.1.2.
- **Focus management** leans entirely on Drawer + React Aria. `autoFocus` on
  the TopBar back button overrides the default first-focusable behaviour;
  stacked modals rely on React Aria's overlay stack for inertness.
- **Scroll boundary** lives on the `content` slot only. Consumers composing
  multi-column layouts inside Content must not introduce a second scroll
  container or the pinned-footer effect breaks.
- **`has()` selector** for TabNav padding removal requires a modern browser
  (Baseline 2023). Acceptable given Nimbus's general browser target.
