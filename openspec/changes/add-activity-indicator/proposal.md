## Why

Chat and AI surfaces (the `nimbus-chat` initiative) need an inline "agent is
working" hint — the familiar three bouncing dots shown next to text like
"Thinking…" or "Processing request". FEC-981 originally scoped this as a
`variant="dots"` on `LoadingSpinner`, but a spinner and a typing indicator are
semantically different: `LoadingSpinner` is _always_ a `role="progressbar"` (via
React Aria's `useProgressBar`) communicating indeterminate progress ("wait for
completion"), always announced, whereas an activity hint is decorative by
default and at most a polite live status. Folding the dots into a
`LoadingSpinner` variant would make a styling prop silently flip the ARIA role
and default announcement behavior — a confusing contract. A dedicated component
keeps both concerns clean and is discoverable by the chat-building audience,
while still reusing `LoadingSpinner`'s square `size` scale points so the two are
interchangeable in icon slots.

## What Changes

- Add a new **`ActivityIndicator`** component to `@commercetools/nimbus`: an
  animated three-dot activity hint for chat/agent surfaces.
- Default `size="inherit"` makes the dots **em-based**, scaling with the
  surrounding `font-size` for inline use next to text (zero-config common case).
- Fixed sizes (`2xs`–`lg`) reserve a **square icon-box footprint** (reusing
  `LoadingSpinner`'s scale points), drawn as a single square
  `viewBox="0 0 24 24"` SVG with the three dots composed inside the grid, so the
  indicator drops into input start/end icon slots interchangeably with a
  spinner.
- Accessibility is **purely decorative** (`aria-hidden`, always; no `aria-label`
  prop). The component does not own a live region — announcing the activity is
  the consumer's responsibility, via adjacent visible text or a persistent live
  region in the surrounding chat container. (A conditionally-mounted
  component-owned live region does not announce reliably; see `design.md`.)
- `colorPalette` accepts **any Nimbus palette** (default `primary`); the dots
  are filled from the palette's `11` shade.
- `variant` selects the dot color treatment: **`plain`** (default →
  `colorPalette.11`) for neutral backgrounds, and **`contrast`** (→
  `colorPalette.contrast`) for placing the dots on a solid colored surface (auto
  black/white per palette).
- `LoadingSpinner` is **not** modified — no breaking change. FEC-981's variant
  approach is superseded (deviation documented in FEC-981 comment #1103879).

## Capabilities

### New Capabilities

- `activity-indicator`: An animated, presentational three-dot indicator
  signalling ongoing agent/system activity in chat and AI surfaces, with
  em-relative default sizing, optional fixed icon-slot sizing, a purely
  decorative (`aria-hidden`) accessibility contract, full color-palette theming
  with a `plain`/`contrast` variant for solid surfaces, and reduced-motion
  support.

### Modified Capabilities

<!-- None. LoadingSpinner is intentionally left untouched; no existing spec requirements change. -->

## Impact

- **New files** under `packages/nimbus/src/components/activity-indicator/`:
  `activity-indicator.tsx`, `.types.ts`, `.recipe.ts`, `.slots.tsx`,
  `.stories.tsx`, `.docs.spec.tsx`, `.figma.tsx`, `.mdx`, `.dev.mdx`,
  `.guidelines.mdx`, `index.ts`.
- **Recipe registration** in `packages/nimbus/src/theme/recipes/index.ts` and
  **public export** from the `@commercetools/nimbus` barrel.
- **i18n**: none — the component is decorative and exposes no accessible name of
  its own.
- **Figma Code Connect**: maps to Figma node `10603-16574`.
- **No** changes to `LoadingSpinner`, its recipe, types, or public API.
- New consumer-facing component → changeset required for release.
