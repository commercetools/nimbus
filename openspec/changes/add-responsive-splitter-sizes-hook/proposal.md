## Why

The `Splitter` component sizes its single configurable pane (`Splitter.Aside`)
as a percentage of its container — one number, `0–100`, with `Splitter.Main`
taking the remainder. That percentage model keeps the component's state machine
simple, but it is the wrong unit for the most common real layout: a sidebar that
should be a fixed width (a `320px` nav, an icon rail), and whose right split
differs per device. Consumers cannot express "320px here, 30% there" today, the
component has no pixel code path by design, and any value a consumer does pick is
lost on reload.

The component already exposes the exact runtime seam a companion hook needs: a
controlled, **settle-only** `size` prop that reconciles in place (no remount, no
snap-back) plus `onSizeChangeEnd`. A hook can sit in front of that seam and act
as a pure **pixel/token → percentage translator**, keeping every responsive,
pixel, and persistence concern out of the component.

## What Changes

- Add `useResponsiveSplitterSizes`, a `Splitter` companion hook that resolves a
  pixel-/token-based, optionally per-container-width size config down to the
  percentage `Splitter.Root` consumes, and returns props to spread onto the
  root: `{ rootProps: { size, minSize, maxSize, collapsedSize, onSizeChangeEnd, onCollapsedChange, ref, orientation } }`.
  The forwarded `onCollapsedChange` lets the hook observe collapse (it fires
  before the collapse-driven settle) so it can suppress persistence while
  collapsed; an optional `onCollapsedChange` option is called through for
  consumers who also want to observe collapse.
- **Unit model (`number` is always pixels).** A size value is one of: a `number`
  (pixels), a size **token** string (`3xs`–`8xl` or `breakpoint-sm`…`breakpoint-2xl`,
  resolving to pixels via `themeTokens.size`), or a `` `${number}%` `` string
  (a percentage, passed through untranslated). The hook converts pixels and
  tokens to a percentage of the **measured container** so the component stays
  percentage-only.
- **Responsive config keyed by container width.** Each configurable dimension
  (`size`, and the `minSize` / `maxSize` / `collapsedSize` facade) is either a
  single value (applies at every width) **or** an object whose keys are
  container **min-width thresholds** — a `number` (px) or a size token — forming
  a min-width cascade resolved against the splitter's **own** measured width
  (not the viewport). The largest threshold `≤` the measured width wins; the
  smallest entry also applies below it.
- **Explicit resolution axis.** `resolveAgainst` is required and is `"container"`
  in this version (resolved via `ResizeObserver`). The option exists explicitly
  so a future `"viewport"` mode is purely additive and the container-width keys
  never silently change meaning.
- **Pixel facade over the aside's constraints.** `minSize`, `maxSize`, and
  `collapsedSize` accept the same pixel/token/percent values, are translated to
  percentages the same way, and are forwarded via `rootProps`. The hook clamps
  the resolved `size` into `[minSize, maxSize]` **itself** before emitting,
  because the component reconciles controlled `size` without re-clamping until
  the next interaction.
- **Persistence in pixels, per band, versioned.** On a genuine settle the hook
  stores the size under the active threshold band through an injectable,
  Storage-like `storage` (default `localStorage`) under a versioned envelope.
  Pixel/token bands persist **pixels** (so a dragged `320px` re-pins to `320px`
  across reloads and resizes); percent bands persist a percentage. Resolution is
  `stored[band] ?? configDefault[band]`. `collapsedSize` is static config and is
  never persisted; while the aside is collapsed the hook suppresses persistence
  so the latest expanded size survives collapse/expand.
- Close the controlled loop without snap-back: feed the resolved value back as
  `size` and wire `onSizeChangeEnd`, honoring the component's settle-only
  contract. The hook equality-gates its emitted `size` so pixel↔percent
  round-trips under `ResizeObserver` churn cannot thrash the controlled prop.
- No changes to `Splitter.Root` / `Splitter.Aside` / `Splitter.Main` /
  `Splitter.Handle`.

Explicitly **out of scope**: live per-tick (`onSizeChange`) control — control
stays settle-only; a `resolveAgainst: "viewport"` mode (reserved, not shipped);
any pixel code path inside the component itself.

**Known dependency, tracked separately:** the component currently seeds its
first paint at `50%` and derives `size`/`defaultSize` in a mount effect, so the
first committed frame is `50/50` for any consumer (hook or not) before it snaps
to the configured value. That first-paint flash is a standalone component
behavior fixed independently (seed the size synchronously); the hook does not
attempt to mask it and this proposal does not depend on the responsive feature
to fix it.

## Capabilities

### New Capabilities

- `nimbus-use-responsive-splitter-sizes`: A React hook that translates a
  pixel-/token-based, optionally per-container-width pane-size config into the
  percentage `Splitter.Root` accepts — with pixel-to-percentage conversion
  against the measured container, a pixel facade over `minSize` / `maxSize` /
  `collapsedSize`, hook-side clamping, and versioned per-band persistence in
  pixels across sessions and resizes.

### Modified Capabilities

<!-- None. The Splitter component's public API is unchanged; the controlled
`size` prop and `onSizeChangeEnd` this hook relies on already exist. The
splitter spec itself is still the pending `add-splitter-component` change, not a
published capability. -->

## Impact

- **New code**:
  `packages/nimbus/src/components/splitter/hooks/use-responsive-splitter-sizes.ts`,
  a curated `SplitterSizeToken` union + pure resolution helpers under
  `components/splitter/utils/`, exported from the splitter barrel
  (`components/splitter/index.ts`) and surfaced through the package public API.
- **New tests**: a `.spec.tsx` unit test for the hook and its pure resolvers
  (JSDOM, per the hooks-are-unit-tested convention), a token-existence guard
  test, plus a Storybook story demonstrating the responsive + pixel + persisted
  flow.
- **Docs**: a usage section in the splitter `.dev.mdx` / `.mdx` covering the
  pixel/token/responsive + persistence recipe and the `ref` requirement.
- **Depends on**: the existing controlled `size` + `onSizeChangeEnd` API on
  `Splitter.Root`; the size tokens in `themeTokens.size`. No new runtime
  dependencies.
- **Browser APIs**: `ResizeObserver` and `localStorage` — both accessed
  defensively so SSR and storage-denied environments degrade to config-default
  resolution without throwing.
