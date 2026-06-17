## Why

Chat and AI surfaces (the `nimbus-chat` initiative) need an inline "agent is working" hint — the familiar three bouncing dots shown next to text like "Thinking…" or "Processing request". FEC-981 originally scoped this as a `variant="dots"` on `LoadingSpinner`, but a spinner and a typing indicator are different things: a spinner communicates indeterminate progress ("wait for completion") via `role="progressbar"` and is sized as a square icon, while three dots are an inherently wide-short shape that is semantically a polite live status. Forcing the dots into the spinner's square size tokens looks unbalanced and would smuggle a second sizing model behind one prop. A dedicated component keeps both concerns clean and is discoverable by the chat-building audience.

## What Changes

- Add a new **`ActivityIndicator`** component to `@commercetools/nimbus`: an animated three-dot activity hint for chat/agent surfaces.
- Default `size="inherit"` makes the dots **em-based**, scaling with the surrounding `font-size` for inline use next to text (zero-config common case).
- Fixed sizes (`2xs`–`lg`) reserve a **square icon-box footprint** (reusing `LoadingSpinner`'s scale points) so the indicator drops into input start/end icon slots; the wider-than-square dots overflow horizontally as decoration without affecting layout.
- Accessibility is **decorative by default** (`aria-hidden`), upgrading to `role="status"` + `aria-live="polite"` only when the consumer provides an `aria-label`.
- `colorPalette` (`primary` | `white`) mirrors `LoadingSpinner`.
- `LoadingSpinner` is **not** modified — no breaking change. FEC-981's variant approach is superseded (deviation documented in FEC-981 comment #1103879).

## Capabilities

### New Capabilities

- `activity-indicator`: An animated, presentational three-dot indicator signalling ongoing agent/system activity in chat and AI surfaces, with em-relative default sizing, optional fixed icon-slot sizing, a conditional decorative/live-region accessibility contract, color-palette theming, and reduced-motion support.

### Modified Capabilities

<!-- None. LoadingSpinner is intentionally left untouched; no existing spec requirements change. -->

## Impact

- **New files** under `packages/nimbus/src/components/activity-indicator/`: `activity-indicator.tsx`, `.types.ts`, `.recipe.ts`, `.slots.tsx`, `.i18n.ts`, `.stories.tsx`, `.docs.spec.tsx`, `.figma.tsx`, `.mdx`, `.dev.mdx`, `.guidelines.mdx`, `index.ts`.
- **Recipe registration** in `packages/nimbus/src/theme/recipes/index.ts` and **public export** from the `@commercetools/nimbus` barrel.
- **i18n**: new message keys under `Nimbus.ActivityIndicator.*` (extract + Transifex sync).
- **Figma Code Connect**: maps to Figma node `10603-16574`.
- **No** changes to `LoadingSpinner`, its recipe, types, or public API.
- New consumer-facing component → changeset required for release.
