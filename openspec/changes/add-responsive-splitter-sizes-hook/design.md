## Context

As of commit `ab266b119` the `Splitter` is a single-dimension component: one
`Splitter.Aside` (the pane you size) and one `Splitter.Main` (the remainder),
with role designated by component type rather than id. `Splitter.Root` owns one
number — the aside's percentage `size` (`0–100`; main is `100 − size`) — and
exposes a controlled, **settle-only** `size` prop alongside `onSizeChangeEnd`.
Control is reconciled at rest by an effect: internal state stays authoritative
during a drag, the prop is written into state in place, silently (no callbacks),
normalized to `[0,100]`, and **not** clamped to `minSize`/`maxSize` (the next
interaction re-clamps). If the controlled value is not fed back, the splitter
keeps the last interactive value and behaves uncontrolled from then on (no
snap-back). Resizing is locked while the aside is collapsed. See
`hooks/use-splitter-state.ts` and `splitter.types.ts`.

The component is percentage-native and has no pixel code path by design. But the
most common real layout — a fixed-width sidebar (`320px` nav, icon rail) whose
split differs per device and survives reload — is naturally expressed in pixels.
Pixels, responsive resolution, and persistence are consumer- and surface-specific
policy that does not belong in the component's state machine. The settle-only
controlled channel is exactly the runtime seam a companion hook needs: pushing a
new value lands in place, no remount, so pane scroll state survives.

This design was pressure-tested by four independent reviewers (consumer-DX,
API-minimalism, runtime-correctness, long-term-maintainability) before being
written down; their findings are folded into the Decisions and Risks below.

## Goals / Non-Goals

**Goals:**

- A `useResponsiveSplitterSizes` hook that maps a pixel-/token-/percent size
  config into `{ rootProps: { size, minSize, maxSize, collapsedSize, onSizeChangeEnd, ref, orientation } }`.
- `number` always means pixels; tokens resolve to pixels; `` `${number}%` ``
  passes through. All pixel/token values convert to a percentage of the measured
  container so the component stays percentage-only.
- Optional per-container-width responsiveness via a min-width threshold cascade
  keyed by pixel/token thresholds, resolved against the splitter's own width.
- A pixel facade over `minSize` / `maxSize` / `collapsedSize`, with hook-side
  clamping of the resolved `size`.
- Versioned, per-band, pixel-first persistence through injectable storage, with
  `stored[active] ?? default[active]` resolution.
- Keep the controlled loop closed (no snap-back, no churn) and degrade safely
  when browser APIs are unavailable.

**Non-Goals:**

- No change to `Splitter.Root` / `Splitter.Aside` / `Splitter.Main` /
  `Splitter.Handle`.
- No live per-tick control — control stays settle-only; `onSizeChange` is not
  used to drive the controlled value.
- No viewport-relative resolution — the hook always measures the splitter's own
  container. (There is no `resolveAgainst` option.)
- No pixel code path inside the component.
- The hook does not fix or mask the component's first-paint `50/50` flash — that
  is a separate component change (see Risks).

## Decisions

### D1. A companion hook, not a component feature

The component stays a pure percentage size engine. Pixel math, responsive
resolution, and persistence live in the hook, composed on the already-shipped
controlled `size` + `onSizeChangeEnd` pair. **Why:** these are consumer- and
surface-specific policies; baking them in would put layout truth outside the
component's state machine and reintroduce the pixel path it deliberately omits.
*Alternative considered:* a `units`/`responsive` prop on `Splitter.Root` —
rejected as scope creep coupling the component to pixels, tokens, breakpoints,
and storage.

### D2. `number` is always pixels (single, position-independent unit rule)

A size value is `number` (pixels), a size token (→ pixels), or `` `${number}%` ``
(percentage passthrough). A threshold **key** is `number` (pixels) or a size
token — never a percentage (a percentage threshold of the container against
itself is meaningless). **Why:** the hook exists to let consumers think in
pixels; `number = px` is its whole reason for being, and one rule ("a bare
number is pixels, everywhere") is easier to hold than per-position inference.
*Known tension (reviewers):* `Splitter.Root`'s own `size`/`minSize`/… props are
percentages, so a bare number means px in the hook but `%` on the raw component.
This is accepted deliberately: the hook owns the **full** facade (`size` +
`minSize`/`maxSize`/`collapsedSize`), so a consumer using the hook never hand-writes
a raw percentage onto the root, which closes the collision in practice. Docs
state the rule prominently.

### D3. Container-width threshold keys, container-only resolution

Responsive config is an object whose keys are container **min-width** thresholds
(pixel numbers or size tokens), resolved against the splitter's own width via a
`ResizeObserver`. The active band is the largest threshold `≤` the measured
width; the smallest entry also applies below it. Resolution is **always against
the container** — there is no `resolveAgainst` option. **Why:** the hook resolves
against the element, so keying by viewport breakpoint *names* would lie about
what is measured; explicit pixel/token thresholds say what they mean. Viewport
resolution was considered and dropped: a one-value option is ceremony, and if a
viewport variant is ever needed it is better introduced as its own explicitly
named hook than as a mode flag that silently reinterprets the same threshold
keys. *Alternative considered:* borrowing Chakra's breakpoint **condition
names** (`sm`/`md`/…) as keys — rejected as viewport-coded and misleading for
container resolution, and it would have coupled the hook to
`theme/breakpoints.ts`.

### D4. Tokens resolve to pixels via a curated union + guard test

`size` tokens accepted as values and keys are the named families only: `3xs`–`8xl`
and `breakpoint-sm`…`breakpoint-2xl`. They are exposed as a hand-authored
`SplitterSizeToken` union (not `keyof typeof themeTokens.size`, which also
contains the numeric scale `25`…`9600` and would both pollute autocomplete and
make `"400"`-as-token collide with `400`-as-pixels). A unit test asserts every
union member still exists in `themeTokens.size`. **Why:** tokens give ergonomic
parity with the rest of the system, but the token names are volatile; a curated
union keeps autocomplete clean and the existence test turns a token rename from a
silent runtime miss into a red build. *Alternative considered:* deriving the
type from the token object — rejected (absorbs renames silently, imports the
numeric-scale noise).

### D5. Pixel facade over `minSize` / `maxSize` / `collapsedSize`, hook clamps `size`

The hook accepts pixel/token/percent for `minSize`, `maxSize`, and
`collapsedSize`, translates each to a percentage, and forwards them via
`rootProps`. It clamps the resolved `size` into `[minSize, maxSize]` **before**
emitting. **Why:** these are size-dimensional constraints a pixel-thinking
consumer needs in pixels too, and the component reconciles controlled `size`
with normalization only — it does **not** re-clamp to min/max until the next
interaction (`use-splitter-state.ts`), so an unclamped px→% result would render
out of bounds for a frame. The facade is explicitly scoped to the **size
dimension only**; it is not a general root pass-through (consumers spread their
own remaining props onto `Splitter.Root` directly).

### D6. Drive the existing settle-only controlled `size`, equality-gated

The hook returns `size` (controlled) plus `onSizeChangeEnd` and feeds the
emitted value back. It equality-gates its own emitted `size` with a tolerance
coarser than the component's internal `1e-6`, so pixel↔percent round-trips
triggered by `ResizeObserver` ticks cannot push a fresh prop every frame.
**Why:** the reconcile effect already writes the prop into state in place and
silently and is double-equality-gated, so a settled push is a no-remount,
no-flash, no-callback-loop update — but only if the hook does not emit a
micro-different value on every measurement.

### D7. Versioned, per-band, pixel-first persistence; collapse suppresses writes

Persist `{ v, bands: { [thresholdPx]: { unit, value } } }` under `persistKey`
via an injectable Storage-like interface (default `localStorage`). On a genuine
settle the hook writes the active band: pixel/token bands store **pixels**
(re-derived from the settled percentage and the measured container, so the size
re-pins on resize), percent bands store a percentage. Bands are keyed by the
**resolved pixel threshold** (stable across token renames). Resolution is
`stored[active] ?? configDefault[active]`. `collapsedSize` is never persisted;
while the aside is collapsed the hook suppresses persistence (keyed off the
collapse signal, not a value comparison) so the latest expanded size survives
collapse/expand. **Why:** pixel-first storage keeps the "320px stays 320px"
promise across drags and reloads; per-band keeps each device's remembered size
independent; the version envelope lets a future shape change migrate rather than
silently misread old data. *Alternative considered:* a single shared value
(can't express per-device memory) and value-equality collapse detection
(rejected — a legitimate expanded size equal to `collapsedSize` would be dropped).

### D8. Two-phase resolution, within the component's first-paint reality

`%`-only config resolves synchronously; pixel/token config is resolved after the
first container measurement in a layout effect. **Why:** this is the best the
hook can do toward a correct first commit. Reviewers verified the component
itself paints `50/50` first (it seeds `useState(50)` and derives in a mount
effect gated on pane registration), so the hook cannot guarantee a flash-free
first frame on its own; the genuine fix is the separate component seeding change.
The hook therefore aims for "correct as early as measurement allows" and the docs
state the dependency rather than over-promising.

### D9. Defensive access to browser APIs

`ResizeObserver` and `storage` are feature-detected and wrapped so SSR, older
runtimes, and storage-denied contexts fall back to config-default resolution
without throwing. A container width of `0`/non-finite is guarded so pixel→percent
never divides by zero; resolution retries on the next measurement.

## Risks / Trade-offs

- **First-paint flash is a component behavior the hook can't mask.** The root
  seeds `50%` and derives in a mount effect, so the first frame is `50/50` for
  every consumer. → Tracked as a separate component fix (seed `size`/`defaultSize`
  synchronously). The hook resolves `%` synchronously and pixels in a layout
  effect, and the docs state the dependency; it does not claim a flash-free first
  paint.
- **`number = px` in the hook vs `number = %` on the raw component.** → Mitigated
  by the hook owning the full size facade, so consumers don't hand-write root
  percentages; stated prominently in docs.
- **Pixel values that convert outside `[minSize, maxSize]`.** → The hook clamps
  the resolved `size` itself before emitting, because the component won't
  re-clamp controlled `size` until the next interaction.
- **`ResizeObserver` churn / controlled-loop oscillation.** → The hook
  equality-gates its emitted `size` with a tolerance coarser than the component's
  `1e-6`; observe/unobserve is cleanup-symmetric and StrictMode-safe; writes are
  idempotent.
- **Band-boundary thrash when the width sits on a threshold.** → A hysteresis
  deadband around thresholds (and a deterministic band assignment for boundary
  values) prevents per-frame flapping and split persistence history.
- **Persisted pixels from a wide session restored into a narrow container.** →
  The px→% restore is clamped into `[minSize, maxSize]` like any other resolved
  value before emitting.
- **`localStorage` quota / corrupt JSON / unavailable.** → All access is
  try/caught; failures no-op and resolution falls back to defaults; the persisted
  payload is versioned so shape changes migrate.
- **Token rename/removal.** → Curated `SplitterSizeToken` union plus an
  existence test against `themeTokens.size` converts a rename into a build
  failure.
- **Container-width measurement vs exact pixels.** → `%` config is exact on first
  commit; pixel correction runs in a layout effect, bounded to a single pre-paint
  reconcile (modulo the separate component first-paint fix above).

## Migration Plan

Additive only — a new hook plus barrel/public-API exports and a curated token
union. No existing API changes, so no consumer migration is required. The
versioned persistence envelope (`v: 1`) reserves room for future storage-shape
changes to migrate rather than break. Rollback is removing the new files and
their exports. The separate component first-paint seeding fix is independent and
can land before, with, or after this hook.

## Open Questions

- Should the hook expose the resolved active band (e.g. a `rootProps` sibling
  like `activeThreshold`) for consumers who want to label the current size band?
  (Deferred unless a concrete need appears.)
