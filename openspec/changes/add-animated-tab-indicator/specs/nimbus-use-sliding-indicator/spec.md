## ADDED Requirements

### Requirement: Position a sliding indicator over the active item

The hook SHALL position an absolutely-placed indicator element over the active
item within a container and keep it in sync as the active item or layout changes.
The caller SHALL provide the indicator ref, a CSS `activeSelector` identifying
the active item within the container, the attribute names to watch for
active-item changes, and a `getGeometry({ container, active })` callback that maps
the container and active bounding rects to indicator geometry (`x`, `y`, and
optional `width` / `height`). The container SHALL be the indicator's positioned
parent element.

#### Scenario: Indicator measures the active item before paint

- **WHEN** the hook is enabled and the indicator ref and an active item are
  mounted
- **THEN** the hook measures synchronously before paint and sets the indicator's
  `transform` (and `width`/`height` per `getGeometry`) so it appears over the
  active item with no first-frame flash

#### Scenario: Indicator follows active-item changes

- **WHEN** the active item changes (a watched attribute toggles on a different
  element)
- **THEN** the hook re-measures and repositions the indicator to the new active
  item

#### Scenario: Indicator re-measures on layout changes

- **WHEN** the container or its items resize
- **THEN** the hook re-measures and repositions the indicator

#### Scenario: No active item hides the indicator

- **WHEN** no element matching `activeSelector` exists in the container
- **THEN** the hook sets the indicator's opacity to 0

#### Scenario: Disabled hook is inert

- **WHEN** the hook is called with `enabled: false`
- **THEN** it does not measure, observe, or mutate the indicator, and registers
  no observers

#### Scenario: Marks the container as JS-enhanced

- **WHEN** the hook activates (on mount, enabled)
- **THEN** it sets `data-animated="true"` on the container and removes it on
  cleanup, so the recipe can suppress the static marker only once the sliding
  indicator is live (keeping the static marker as the no-JS fallback)
