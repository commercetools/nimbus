## MODIFIED Requirements

### Requirement: Resolve a pixel/token/percent size config into root props

The hook SHALL accept a `size` config for the aside expressed as a single value
or a per-threshold map, plus an optional `orientation`, and SHALL return a
`rootProps` object containing `size`, `minSize`, `maxSize`,
`collapsedSize`, `onSizeChangeEnd`, `onCollapsedChange`, `ref`, and
`orientation`, intended to be spread onto `Splitter.Root`. The returned
`rootProps.size` SHALL always be a valid controlled value: a single percentage
in `[0, 100]`.

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

#### Scenario: Forwarded `onCollapsedChange` lets the hook observe collapse

- **WHEN** the aside collapses or expands through the spread `rootProps`
- **THEN** the forwarded `onCollapsedChange` informs the hook, so it can
  suppress persistence while the aside is collapsed

### Requirement: Resolve the active band against the container by min-width threshold

The hook SHALL resolve the active band against the splitter's own container,
which it observes on the referenced `Splitter.Root` element with a
`ResizeObserver`. The active band SHALL be the largest **min-width threshold**
less than or equal to the measured size; the smallest configured entry SHALL
also apply below its threshold. The hook SHALL re-resolve when the active band
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

#### Scenario: Only the container is used for resolution

- **WHEN** a consumer configures the hook
- **THEN** there is no option to resolve bands against another axis; the
  splitter's own container is always used

#### Scenario: Thresholds are pixels or tokens

- **WHEN** a threshold map is configured
- **THEN** each threshold is a pixel number or a size token, never a percentage

### Requirement: Persist the settled size per band, in pixels, versioned

The hook SHALL persist the settled size keyed by the active threshold band,
through an injectable `storage` (a `localStorage`-like get/set interface)
defaulting to `localStorage`, under a consumer-provided `persistKey`. The stored
payload SHALL be versioned and keyed by the resolved pixel threshold. Pixel/token
bands SHALL persist a pixel value (re-derived from the settled percentage and the
measured container); percent bands SHALL persist a percentage.

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

#### Scenario: A percent band persists a percentage

- **WHEN** a resize settles in a percent band
- **THEN** the hook writes the settled percentage under that band

## ADDED Requirements

### Requirement: Accept pixel, token, and percent size values

A size value SHALL be one of: a `number` (interpreted as **pixels**), a size
**token** string (resolving to pixels), or a `` `${number}%` `` string (a
percentage passed through untranslated).

#### Scenario: A size token resolves to pixels

- **WHEN** a size value is a size token string
- **THEN** the hook resolves the token to its pixel value and converts it to a
  percentage of the measured container

### Requirement: Restore the persisted size

Resolution SHALL follow `stored[activeBand] ?? configDefault[activeBand]`. A
restored value SHALL be clamped into `[minSize, maxSize]` like any other
resolved value.

#### Scenario: A restored value is clamped

- **WHEN** a stored value is outside the current `[minSize, maxSize]`
- **THEN** the hook clamps it into that range before using it
