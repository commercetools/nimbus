## ADDED Requirements

### Requirement: Resolve a pixel/token/percent size config into root props

The hook SHALL accept a `size` config for the aside expressed as a single value
or a per-threshold map, plus an explicit `orientation` and `resolveAgainst`, and
SHALL return a `rootProps` object containing `size`, `minSize`, `maxSize`,
`collapsedSize`, `onSizeChangeEnd`, `onCollapsedChange`, `ref`, and
`orientation`, intended to be spread onto `Splitter.Root`. The forwarded
`onCollapsedChange` lets the hook observe collapse so it can suppress
persistence while collapsed. A size value SHALL be one of: a `number`
(interpreted as **pixels**), a size **token** string (resolving to pixels), or a
`` `${number}%` `` string (a percentage passed through untranslated). The
returned `rootProps.size` SHALL always be a valid controlled value: a single
percentage in `[0, 100]`.

#### Scenario: Config resolves to a controlled size

- **WHEN** the hook is called with a `size` config and its `ref` is attached to
  a mounted `Splitter.Root`
- **THEN** `rootProps.size` is a percentage in `[0, 100]` for the active band,
  and spreading `rootProps` onto `Splitter.Root` drives the controlled
  (settle-only) size channel without remounting it

#### Scenario: A bare number is always pixels

- **WHEN** a size value is the bare `number` `320`
- **THEN** the hook treats it as `320px` and converts it to a percentage of the
  measured container — never as `320%`

#### Scenario: A percent string passes through untranslated

- **WHEN** a size value is the string `"30%"`
- **THEN** the hook resolves the aside to `30` percent directly, without
  measuring the container

### Requirement: Convert pixel and token values to percentages against the container

When a resolved value is expressed in pixels or as a size token, the hook SHALL
convert it to a percentage of the measured `Splitter.Root` width (horizontal
splitter) or height (vertical splitter) before exposing it as a controlled size.
Tokens SHALL resolve to pixels via the size-token source before conversion.
Pixel conversion SHALL always measure the splitter's own container. The
`Splitter` component SHALL NOT receive pixel values.

#### Scenario: Pixel value becomes a percentage of the container

- **WHEN** the active band resolves the aside to a `px` value and the container
  measures a known size on the relevant axis
- **THEN** the hook converts the `px` value to the equivalent percentage of the
  container and exposes it as `rootProps.size`

#### Scenario: Token value resolves to pixels then to a percentage

- **WHEN** the active band resolves the aside to a size token (e.g.
  `"breakpoint-sm"`)
- **THEN** the hook resolves the token to its pixel value and converts that to a
  percentage of the measured container

#### Scenario: Only curated size tokens are accepted

- **WHEN** a value or threshold key is a string that is not a member of the
  curated `SplitterSizeToken` set (`3xs`–`8xl`, `breakpoint-sm`…`breakpoint-2xl`)
  and is not a `` `${number}%` `` value
- **THEN** the type does not permit it, and at runtime the hook ignores the
  unresolvable entry and falls back to a valid resolution rather than throwing

### Requirement: Resolve the active band against the container by min-width threshold

The hook SHALL determine the active band using `resolveAgainst`, which is
**required** and SHALL be `"container"` in this version. In `"container"` mode
the hook SHALL observe the referenced `Splitter.Root` element with a
`ResizeObserver` and select the band whose **min-width threshold** the element's
measured size satisfies. Thresholds SHALL be expressed as pixel numbers or size
tokens (never percentages). The active band SHALL be the largest threshold less
than or equal to the measured size; the smallest configured entry SHALL also
apply below its threshold. The hook SHALL re-resolve when the active band
changes.

#### Scenario: Container width selects the band

- **WHEN** the observed root element's measured size crosses from one threshold
  band into another
- **THEN** the hook re-resolves the active band to the one matching the new
  measured size and updates `rootProps.size` accordingly

#### Scenario: Below the smallest threshold

- **WHEN** the measured size is smaller than the smallest configured threshold
- **THEN** the hook resolves using the smallest configured entry

#### Scenario: A single value applies at every width

- **WHEN** `size` is a single value rather than a threshold map
- **THEN** the hook resolves that value at every measured width without band
  selection

#### Scenario: Boundary stability

- **WHEN** the measured size sits at or oscillates around a threshold by
  sub-pixel deltas
- **THEN** the hook applies hysteresis so the active band does not flap between
  values frame to frame

### Requirement: Apply a pixel facade over the aside constraints and clamp the size

The hook SHALL accept `minSize`, `maxSize`, and `collapsedSize` in the same
pixel/token/percent units (each a single value or a per-threshold map), SHALL
translate them to percentages the same way as `size`, and SHALL forward them via
`rootProps`. The hook SHALL clamp the resolved `rootProps.size` into the resolved
`[minSize, maxSize]` window before emitting it.

#### Scenario: Resolved size is clamped into the configured window

- **WHEN** a resolved pixel `size` converts to a percentage below the resolved
  `minSize` or above the resolved `maxSize`
- **THEN** the hook clamps `rootProps.size` into `[minSize, maxSize]` before
  exposing it, rather than relying on the component (which does not re-clamp a
  controlled size until the next interaction)

#### Scenario: Constraints are forwarded as percentages

- **WHEN** `minSize` / `maxSize` / `collapsedSize` are given in pixels or tokens
- **THEN** the hook converts each to a percentage of the measured container and
  exposes them on `rootProps`, so the component receives only percentages

### Requirement: Persist the settled size per band, in pixels, versioned

The hook SHALL persist the settled size keyed by the active threshold band,
through an injectable `storage` (a `localStorage`-like get/set interface)
defaulting to `localStorage`, under a consumer-provided `persistKey`. The stored
payload SHALL be versioned and keyed by the resolved pixel threshold. Pixel/token
bands SHALL persist a pixel value (re-derived from the settled percentage and the
measured container); percent bands SHALL persist a percentage. Resolution SHALL
follow `stored[activeBand] ?? configDefault[activeBand]`. A restored value SHALL
be clamped into `[minSize, maxSize]` like any other resolved value.

#### Scenario: A settled drag is persisted in pixels under the active band

- **WHEN** a resize settles (the spread `onSizeChangeEnd` fires) in a
  pixel/token band
- **THEN** the hook re-derives the pixel width from the settled percentage and
  the measured container and writes it under that band, leaving other bands
  untouched

#### Scenario: A pixel pin survives reload and resize

- **WHEN** the user drags to a width in a pixel band, reloads, and the container
  is a different size
- **THEN** the hook restores the stored pixel width and re-converts it to a
  percentage for the new container, so the pinned pixel width is preserved

#### Scenario: Stored value takes precedence over the config default

- **WHEN** the active band has a previously stored value
- **THEN** the hook resolves to the stored value rather than the configured
  default for that band

#### Scenario: Persistence degrades gracefully when storage is unavailable

- **WHEN** `storage` access throws, is unavailable (SSR, privacy mode), or holds
  corrupt/old data
- **THEN** the hook does not throw and resolves from the configured defaults,
  using the payload version to migrate where possible

### Requirement: Never persist the collapsed size

The hook SHALL treat `collapsedSize` as static configuration and SHALL NOT
persist it. While the aside is collapsed the hook SHALL suppress persistence so
the latest expanded size is preserved across collapse and expand. Suppression
SHALL be keyed off the collapse signal, not a comparison of the settled value to
`collapsedSize`.

#### Scenario: Collapsing does not overwrite the stored expanded size

- **WHEN** the aside collapses (a settle fires with the collapsed size) and later
  expands
- **THEN** the stored value still reflects the last expanded size, and expanding
  restores it

#### Scenario: An expanded size equal to the collapsed size is still persisted

- **WHEN** the user drags the expanded aside to a size that happens to equal
  `collapsedSize` without collapsing
- **THEN** the hook persists that size, because suppression is keyed off the
  collapse signal rather than value equality

### Requirement: Maintain the controlled loop without snap-back or churn

The hook SHALL feed its resolved value back as the controlled `size` and SHALL
wire `onSizeChangeEnd`, honoring the component's settle-only, no-snap-back
contract: live drag/keyboard motion is owned by the component's internal state
and the hook reconciles only at rest. The hook SHALL equality-gate its emitted
`size` with a tolerance coarser than the component's internal epsilon so
pixel↔percent round-trips under `ResizeObserver` ticks do not push a new prop
every frame.

#### Scenario: Interaction settles into the controlled value

- **WHEN** the user drags the handle and releases
- **THEN** the component animates from its internal state during the drag, fires
  `onSizeChangeEnd` once on release, and the hook persists and feeds the settled
  value back as `size` without a visible snap-back

#### Scenario: Resize ticks do not thrash the controlled prop

- **WHEN** the container resizes within the same band, causing repeated
  pixel→percent recomputation
- **THEN** the hook only emits a new `rootProps.size` when the resolved value
  changes beyond its equality tolerance, so the controlled prop does not update
  every frame

### Requirement: Degrade safely without browser APIs or measurement

The hook SHALL feature-detect `ResizeObserver` and `storage` and SHALL guard
non-positive or non-finite container measurements. When measurement or
`ResizeObserver` is unavailable, the hook SHALL resolve `%`-only config and fall
back for pixel/token config without throwing, and SHALL retry resolution once a
positive measurement becomes available.

#### Scenario: No ResizeObserver available

- **WHEN** `ResizeObserver` is undefined (SSR, older runtimes, JSDOM without a
  polyfill)
- **THEN** the hook resolves any `%`-only config and returns a valid
  `rootProps.size` without throwing

#### Scenario: Container not yet laid out

- **WHEN** the container measures `0` or a non-finite size (e.g. `display:none`)
- **THEN** the hook does not divide by zero, does not emit a non-finite size, and
  re-resolves once a positive measurement is observed
