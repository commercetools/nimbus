## 1. Types & scaffolding

- [x] 1.1 Add a curated `SplitterSizeToken` union to `splitter.types.ts`:
      `3xs`–`8xl` and `breakpoint-sm`…`breakpoint-2xl` (hand-authored, **not**
      `keyof typeof themeTokens.size`). JSDoc the accepted set and why it is
      curated.
- [x] 1.2 Add the value/config types: `ResponsiveSplitterSizeValue`
      (`number` px | `SplitterSizeToken` | `` `${number}%` ``),
      `ResponsiveSplitterSizeThreshold` (`number` px | `SplitterSizeToken` —
      no percent), `ResponsiveSplitterSizeConfig`
      (`ResponsiveSplitterSizeValue` | a threshold-keyed map of it),
      `SplitterSizesStorage` (Storage-like `getItem`/`setItem`),
      `UseResponsiveSplitterSizesOptions` (`orientation?`, `size`, optional
      `minSize`/`maxSize`/`collapsedSize`, `persistKey`, `storage?`,
      `onCollapsedChange?`), and the return type
      `UseResponsiveSplitterSizesResult`
      (`{ rootProps: { size, minSize, maxSize, collapsedSize, onSizeChangeEnd, ref, orientation } }`).
      JSDoc every field; state the `number = px` rule explicitly.
- [x] 1.3 Create `hooks/use-responsive-splitter-sizes.ts` with the signature and
      a typed stub returning a valid (config-default, `%`-resolvable) `rootProps`.

## 2. Pure resolution helpers (unit-testable in isolation)

- [x] 2.1 `resolveTokenToPx(token, tokens)` — resolve a `SplitterSizeToken` to a
      pixel number via injected `themeTokens.size`; throw/ignore policy for
      unknown tokens defined and documented.
- [x] 2.2 `valueToPercent(value, containerPx, tokens)` — pure: `number`→px→%,
      token→px→%, `` `${n}%` ``→% passthrough; guards `containerPx <= 0` /
      non-finite (returns a sentinel the caller treats as "unresolved").
- [x] 2.3 `selectBand(map, measuredPx, tokens, hysteresis)` — resolve all
      threshold keys to px, sort ascending, pick the largest `≤ measuredPx`
      (smallest applies below), with a hysteresis deadband around boundaries.
- [x] 2.4 `clampPercent(percent, minPercent, maxPercent)` — clamp the resolved
      size into the resolved `[minSize, maxSize]` window.
- [x] 2.5 `percentToPx(percent, containerPx)` — inverse, for persistence re-derive.

## 3. Container resolution (ResizeObserver)

- [x] 3.1 Implement `"container"` resolution: a `ResizeObserver` on the
      `rootProps.ref` element measuring width (horizontal) / height (vertical),
      driving band selection and pixel→percent conversion.
- [x] 3.2 Feature-detect `ResizeObserver`; with none, resolve `%`-only config and
      fall back for px/token without throwing; retry once a positive measurement
      arrives.
- [x] 3.3 Guard width `0`/non-finite; never emit a non-finite size; re-resolve on
      the next positive measurement.
- [x] 3.4 Always resolve against the container — no resolution-axis option.
- [x] 3.5 Observe/unobserve cleanup-symmetric and StrictMode-safe (no leaked
      observers, no double-bind).

## 4. Two-phase resolution & emit gating

- [x] 4.1 Resolve `%`-only config synchronously for the earliest correct value;
      resolve px/token config after the first measurement in a `useLayoutEffect`.
- [x] 4.2 Clamp every resolved `size` (live, default, restored) into
      `[minSize, maxSize]` before emitting.
- [x] 4.3 Equality-gate the emitted `rootProps.size` with a tolerance coarser
      than the component's `1e-6` so px↔% round-trips under resize ticks do not
      thrash the controlled prop.
- [x] 4.4 Translate `minSize`/`maxSize`/`collapsedSize` to percentages and expose
      them on `rootProps`.

## 5. Persistence

- [x] 5.1 Versioned storage adapter defaulting to `localStorage`, all access
      try/caught; read/parse `{ v, bands: { [thresholdPx]: { unit, value } } }`,
      tolerating absent/corrupt/old data (migrate by version where possible).
- [x] 5.2 Resolution precedence `stored[activeBand] ?? configDefault[activeBand]`;
      key bands by the resolved pixel threshold (stable across token renames).
- [x] 5.3 On settle, write the active band: px/token bands store px (re-derived
      via `percentToPx` from the measured container); percent bands store percent.
- [x] 5.4 Clamp restored values into `[minSize, maxSize]` before emitting (covers
      a wide-session px restored into a narrow container).
- [x] 5.5 Never persist `collapsedSize`; suppress persistence while collapsed,
      keyed off the collapse signal (not value equality), so an expanded size
      equal to `collapsedSize` is still persisted.

## 6. Controlled-loop wiring

- [x] 6.1 Expose the resolved value as `rootProps.size` (controlled) and keep it
      stable across renders unless the resolved value changes beyond the gate.
- [x] 6.2 Wire `onSizeChangeEnd` to persist (subject to the collapse suppression)
      and feed the settled value back; never emit both `size` and `defaultSize`.
- [x] 6.3 Re-resolve on band change, relying on the component's in-place,
      settle-only reconcile (no remount); verify no snap-back.

## 7. Exports & token guard

- [x] 7.1 Export the hook and its public types (incl. `SplitterSizeToken`) from
      `components/splitter/index.ts`.
- [x] 7.2 Confirm the splitter barrel is surfaced in the package public API so
      `useResponsiveSplitterSizes` is importable from `@commercetools/nimbus`.
- [x] 7.3 Add a token-existence guard test: every `SplitterSizeToken` member
      exists in `themeTokens.size` (turns a token rename into a red build).

## 8. Tests (unit — hooks are JSDOM-tested)

- [x] 8.1 Pure helpers (§2): `number = px` conversion, token→px→%, `%`
      passthrough, band selection + hysteresis, clamping, px round-trip.
- [x] 8.2 Container-mode band selection across simulated width bands (mock
      `ResizeObserver`); single-value-applies-everywhere case.
- [x] 8.3 Clamping: a px `size` resolving below `minSize` / above `maxSize` is
      clamped before emit; restored wide px in a narrow container is clamped.
- [x] 8.4 Persistence: settle writes px under the active band; `stored ?? default`
      precedence; per-band independence; px pin survives a simulated reload +
      resize; versioned/corrupt/absent data tolerated.
- [x] 8.5 Collapse: `collapsedSize` never stored; suppression while collapsed;
      an expanded size equal to `collapsedSize` still persisted.
- [x] 8.6 Emit gating: resize ticks within a band do not push a new `size` unless
      it changes beyond the tolerance (no oscillation).
- [x] 8.7 Degradation: no `ResizeObserver`, no/throwing `storage`, width `0` —
      no throw, `%`-only still resolves.

## 9. Story & docs

- [x] 9.1 Storybook story: the responsive + pixel/token + persisted flow on a
      real `Splitter.Root` (play function exercising a settle and a simulated
      band change).
- [x] 9.2 Document in the splitter `.dev.mdx` / `.mdx`: the recipe, the
      **`number = px`** rule (and the contrast with the component's percentage
      props), container-width threshold keys vs viewport, the curated token set,
      the `ref` requirement, and the px-pin-survives-drag persistence behavior.

## 10. Verification

- [x] 10.1 `pnpm --filter @commercetools/nimbus typecheck:strict` passes (no
      `any`); `SplitterSizeToken` gives clean autocomplete.
- [x] 10.2 `pnpm test:dev` for the new spec passes; `pnpm lint` clean.
- [x] 10.3 Build the package and confirm the hook is exported from the published
      entry (`pnpm --filter @commercetools/nimbus build`).

## 11. Tracked separately (not part of this change)

- [ ] 11.1 Component first-paint fix: seed `Splitter.Root`'s `size`/`defaultSize`
      synchronously (lazy `useState` initializer / `useLayoutEffect`) instead of
      the pane-registration mount effect, so the first committed frame honors the
      configured size rather than painting `50/50` first. Validate during hook
      implementation; land as an independent fix.
