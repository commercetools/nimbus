## Context

FEC-981 requested a "bouncing dots" indicator for chat/agent surfaces ("Thinking…", "Processing request", "Agent is typing"), originally scoped as a `variant="dots"` on `LoadingSpinner`. Review surfaced a structural mismatch: `LoadingSpinner` sizes via square icon tokens (its SVG scales to fit a square box), while three dots are a wide-short shape; and a spinner's `role="progressbar"` ("indeterminate progress, wait") is the wrong accessibility contract for a polite "activity" status. The decision (documented in FEC-981 comment #1103879) is to build a dedicated, presentational `ActivityIndicator` and leave `LoadingSpinner` untouched.

This is a Tier 1 (simple, single-component, recipe-based) component. The closest existing precedents are `kbd` (em-based inline sizing with `display: inline-flex`) and `loading-spinner` (the `colorPalette` and i18n patterns, and the square `size` token scale points).

## Goals / Non-Goals

**Goals:**

- A presentational three-dot indicator that scales inline with surrounding text by default (em-based, zero-config).
- Optional fixed sizes that reserve a square icon-box footprint so the indicator drops into input start/end icon slots, while the dots overflow that box horizontally without perturbing layout.
- A decorative-by-default accessibility contract that upgrades to a polite live region only when labeled.
- Reuse `LoadingSpinner`'s `colorPalette` and i18n conventions for consistency.
- No change to `LoadingSpinner` (no breaking change).

**Non-Goals:**

- No interactivity, focus management, or keyboard handling (the component is non-interactive).
- No `role="progressbar"` / determinate or indeterminate progress semantics.
- No compound/slotted sub-component API (`.Root`, `.Item`, etc.) — a single component suffices.
- Not modifying or deprecating `LoadingSpinner`.

## Decisions

### Single em-based dot geometry, `font-size`-driven sizing

Dot diameter (≈0.375em) and gap (≈0.25em) are defined once in em. The `size` variant only sets `font-size` (and, for fixed sizes, the square box dimensions). This yields one geometry definition for every size and is the mechanism that lets the default track surrounding text.

- *Alternative considered:* per-size pixel/token dot dimensions. Rejected — duplicates geometry across five sizes and reintroduces the non-square fight that motivated splitting from `LoadingSpinner`.

### `size="inherit"` default vs. fixed sizes

`inherit` keeps the dots in normal flow (`inline-flex`, intrinsic width) so the indicator behaves like inline text. Fixed sizes (`2xs`–`lg`, reusing LoadingSpinner scale points 350/500/600/800/1000) additionally set `width`/`height` to a square box and place the dots in an absolutely-positioned, centered layer (`position: relative` on the box; `position: absolute` + `top/left: 50%` + `translate(-50%, -50%)` on the dots row).

- *Why absolute positioning for fixed sizes:* the dots are taken out of flow, so their wider-than-square footprint cannot expand the box content size or shift siblings in an icon slot. `overflow` is left `visible` (never `auto`/`scroll`), so the component itself never renders scrollbars.
- *Alternative considered:* in-flow dots with `overflow: visible`. Rejected — in-flow overflow still contributes to the box content size and can nudge sibling layout / press against ancestor scroll containers.

### Accessibility: presence of `aria-label` is the switch

No `aria-label` → `aria-hidden="true"`, no role (decorative; adjacent visible text announces state — the common inline case). `aria-label` present → `role="status"` + `aria-live="polite"` with that name. No separate boolean prop.

- *Why no React Aria:* there is no interaction and it is not a progressbar; a plain styled `<span>` with conditional `role`/`aria-live` is correct and lighter. `useProgressBar` would impose the wrong semantics.
- *Alternative considered:* always `role="status"` with an i18n default label. Rejected — risks double-announcement when paired with visible text, and surfaces a possibly-misleading default.

### `<span>`-based markup

Root and dots are all `<span>` so the indicator can live inside a line of text without injecting block-level boxes. Slot uses `withContext<HTMLSpanElement, …>("span")`; `ref` is `React.Ref<HTMLSpanElement>`.

### i18n default label only when labeled

A `Nimbus.ActivityIndicator.*` default (e.g. "Agent is typing") is applied only in the labeled/live-region path, never in the decorative path, so assistive tech never hears a misleading default.

## Risks / Trade-offs

- **Absolutely-positioned dots can still contribute to an ancestor scroll container's overflow** → Mitigation: dots no longer affect in-flow sibling layout, the horizontal bleed is small and symmetric, and `overflow` is never set to `auto`/`scroll`; acceptable for icon-slot usage.
- **Consumers may reach for ActivityIndicator as a generic spinner replacement** → Mitigation: docs/guidelines clearly scope it to chat/agent activity and point progress use cases to `LoadingSpinner`.
- **Two indicators with similar `size`/`colorPalette` APIs could drift** → Mitigation: deliberately mirror LoadingSpinner's `colorPalette` values and scale points; note the shared conventions in the dev docs.
- **Reduced-motion pulse must remain visible but unobtrusive** → Mitigation: opacity-only pulse, validated in a dedicated story.

## Migration Plan

Additive only — a new export from `@commercetools/nimbus`. No consumer migration required; `LoadingSpinner` is unchanged. Ship with a changeset describing the new component. Register the recipe in `theme/recipes/index.ts` and export from the package barrel.

## Open Questions

- Final wording/keys for the i18n default label(s) (single "Agent is typing" vs. a more generic "Loading"/"Working" phrasing) — to be confirmed during i18n authoring; does not block implementation.
- Whether a future chat component family should re-export or compose ActivityIndicator — out of scope here; the standalone component is designed to be composable later.
