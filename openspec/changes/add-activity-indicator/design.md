## Context

FEC-981 requested a "bouncing dots" indicator for chat/agent surfaces ("Thinking…", "Processing request", "Agent is typing"), originally scoped as a `variant="dots"` on `LoadingSpinner`. Review surfaced a semantics mismatch: `LoadingSpinner` is *always* a `role="progressbar"` ("indeterminate progress, wait for completion", always announced via React Aria's `useProgressBar`), which is the wrong accessibility contract for a polite, decorative-by-default "activity" status. Folding the dots into a spinner variant would let a styling prop silently flip the ARIA role and default announcement. The decision (documented in FEC-981 comment #1103879) is to build a dedicated, presentational `ActivityIndicator` and leave `LoadingSpinner` untouched. The indicator still reuses `LoadingSpinner`'s square `size` scale points so the two are interchangeable in icon slots.

This is a Tier 1 (simple, single-component, recipe-based) component. The closest existing precedents are `kbd` (em-based inline sizing with `display: inline-flex`) and `loading-spinner` (the i18n pattern and the square `size` token scale points).

## Goals / Non-Goals

**Goals:**

- A presentational three-dot indicator that scales inline with surrounding text by default (em-based box, zero-config).
- Optional fixed sizes that reserve a square icon-box footprint (reusing `LoadingSpinner`'s scale points) so the indicator drops into input start/end icon slots interchangeably with a spinner.
- A decorative-by-default accessibility contract that upgrades to a polite live region only when labeled.
- Reuse `LoadingSpinner`'s `size` scale points and i18n conventions for consistency, while supporting the full Nimbus color-palette set.
- No change to `LoadingSpinner` (no breaking change).

**Non-Goals:**

- No interactivity, focus management, or keyboard handling (the component is non-interactive).
- No `role="progressbar"` / determinate or indeterminate progress semantics.
- No compound/slotted sub-component API (`.Root`, `.Item`, etc.) — a single component suffices.
- Not modifying or deprecating `LoadingSpinner`.

## Decisions

### Single square SVG, box-driven sizing

The three dots are `<circle>`s inside one square `<svg>` (`viewBox="0 0 24 24"`), exactly like an icon / `LoadingSpinner`. Dot geometry is fixed in the viewBox (`r=3`, `cy=13`, `cx` at 4/12/20) and defined once; the `size` variant sizes only the root box (`width`/`height`) and the SVG scales to fit (`width`/`height: 100%`). This keeps a single geometry definition for every size and makes the indicator size-identical to a spinner.

- *Alternative considered:* per-size pixel/token dot dimensions, or em-based dot geometry sized via `font-size`. Rejected — both duplicate or complicate geometry across sizes; a single square SVG that scales to its box is simpler and matches the icon/spinner sizing model directly.

### `size="inherit"` default vs. fixed sizes

`inherit` sets the box to `1em` (`inline-flex`, `vertical-align: middle`) so the indicator scales with the surrounding `font-size` and behaves like inline text. Fixed sizes (`2xs`–`lg`, reusing LoadingSpinner scale points 350/500/600/800/1000) set `width`/`height` to the corresponding square box; the same SVG scales to fill it. The dots are composed *inside* the square grid, so the footprint is square like any other icon — nothing overflows horizontally.

- *Why a square SVG rather than overflowing dots:* drawing the dots inside the 24×24 grid means the footprint is genuinely square, so it can never expand the box content size or shift siblings in an icon slot, with no absolute positioning needed. `overflow` on the SVG is left `visible` (never `auto`/`scroll`) solely so the upward bounce isn't clipped.
- *Dot-spacing trade-off:* `cx` 4/12/20 is a hybrid of the icon family's outer "safe space" (~1px padding) and Figma's wider inter-dot gap. The literal Figma three-dots width (26px) would overflow the 24px canvas; strict icon padding would crowd the dots in small sizes. `cy=13` rests the dots 1px below center so the upward-only bounce balances around the vertical midpoint.

### Accessibility: presence of `aria-label` is the switch

No `aria-label` → `aria-hidden="true"`, no role (decorative; adjacent visible text announces state — the common inline case). `aria-label` present → `role="status"` + `aria-live="polite"` with that name. No separate boolean prop.

- *Why no React Aria:* there is no interaction and it is not a progressbar; a plain styled `<span>` with conditional `role`/`aria-live` is correct and lighter. `useProgressBar` would impose the wrong semantics.
- *Alternative considered:* always `role="status"` with an i18n default label. Rejected — risks double-announcement when paired with visible text, and surfaces a possibly-misleading default.

### `<span>`-based root markup

The root is a `<span>` (wrapping the square `<svg>` of `<circle>` dots) so the indicator can live inside a line of text without injecting block-level boxes. Slot uses `withContext<HTMLSpanElement, …>("span")`; `ref` is `React.Ref<HTMLSpanElement>`.

### Color palette: full palette set, with a `variant` for solid surfaces

`colorPalette` accepts the full `NimbusColorPalette` set (default `primary`); there is no `LoadingSpinner`-style restriction and no per-palette remap. The dots fill from the active palette's step, selected by a recipe `variant`:

- `plain` (default) → `colorPalette.11`, the colored treatment for neutral / page backgrounds.
- `contrast` → `colorPalette.contrast`, the auto black/white step for placing the dots on a solid `colorPalette.9`-style colored surface (e.g. an agent bubble).

This reuses Nimbus's established convention — `colorPalette.contrast` is exactly the foreground-on-solid-fill token `Button`'s `solid` variant uses. `variant` is the conventional home for "which palette step does fg use", so the colored vs contrast choice belongs there rather than on a bespoke prop.

- *Why drop the earlier `primary→ctvioletAlpha` / `white→whiteAlpha` aliases:* `white` is not a real palette and is wrong on light surfaces (a solid `ctyellow.9` needs black, not white). The per-dot opacity (0.4/0.6/0.8) already softens the dots, so the alpha palettes were redundant; using `.11` for every palette is uniform and predictable.
- *Why value names `plain`/`contrast` rather than `subtle`/`solid`:* the indicator is foreground-only (no background fill of its own), so Button's background-implying `solid`/`subtle` would mislead. `plain`/`contrast` name the dots' own treatment.

### i18n default label only when labeled

A `Nimbus.ActivityIndicator.*` default (e.g. "Agent is typing") is applied only in the labeled/live-region path, never in the decorative path, so assistive tech never hears a misleading default.

## Risks / Trade-offs

- **The upward bounce relies on `overflow: visible` on the SVG** → Mitigation: the square footprint itself never changes, so siblings are unaffected; `overflow` is never set to `auto`/`scroll`, so the component renders no scrollbars.
- **Consumers may reach for ActivityIndicator as a generic spinner replacement** → Mitigation: docs/guidelines clearly scope it to chat/agent activity and point progress use cases to `LoadingSpinner`.
- **Two indicators with similar `size`/`colorPalette` APIs could drift** → Mitigation: deliberately reuse LoadingSpinner's `size` scale points; note the shared conventions in the dev docs. `colorPalette` is intentionally broader here (any Nimbus palette, no `primary`/`white` remap), and the colored-vs-contrast choice lives on a `variant` (`plain`/`contrast`) — the dots are pure decoration with no progressbar contract.
- **Reduced-motion pulse must remain visible but unobtrusive** → Mitigation: opacity-only pulse, validated in a dedicated story.

## Migration Plan

Additive only — a new export from `@commercetools/nimbus`. No consumer migration required; `LoadingSpinner` is unchanged. Ship with a changeset describing the new component. Register the recipe in `theme/recipes/index.ts` and export from the package barrel.

## Open Questions

- Final wording/keys for the i18n default label(s) (single "Agent is typing" vs. a more generic "Loading"/"Working" phrasing) — to be confirmed during i18n authoring; does not block implementation.
- Whether a future chat component family should re-export or compose ActivityIndicator — out of scope here; the standalone component is designed to be composable later.
