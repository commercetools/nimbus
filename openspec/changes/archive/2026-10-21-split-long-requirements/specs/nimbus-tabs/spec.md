## MODIFIED Requirements

### Requirement: Unified variants with a sliding active indicator

`Tabs` and `TabNav` SHALL expose the same three variants — `line` (the
default), `rounded`, and `pill` — and SHALL render the active marker as a single
indicator that slides between items/tabs as the selection changes, rather than a
static per-item marker.

#### Scenario: Active marker slides on selection change

- **WHEN** the selected item/tab changes
- **THEN** the indicator slides from the previous selection to the new one

#### Scenario: Indicator adapts to the variant

- **WHEN** the variant is `line`
- **THEN** the indicator is a thin bar on the active item's marker edge (bottom
  for horizontal; the inner side for vertical `Tabs`, per `placement`)
- **WHEN** the variant is `rounded` or `pill`
- **THEN** the indicator is a filled highlight behind the active item (subtly
  rounded for `rounded`, a full capsule for `pill`), themeable via `colorPalette`

#### Scenario: Reduced motion snaps the indicator

- **WHEN** the user requests `prefers-reduced-motion: reduce`
- **THEN** the indicator repositions without a slide transition

#### Scenario: No-JS fallback

- **WHEN** JavaScript has not yet run (SSR / pre-hydration)
- **THEN** the recipe's static marker is shown; once the hook activates it is
  replaced by the sliding indicator before paint

## ADDED Requirements

### Requirement: Sliding indicator is decorative

The sliding indicator of `Tabs` and `TabNav` SHALL be decorative (`aria-hidden`,
non-focusable) and SHALL NOT affect the selected state, focus, or keyboard
navigation.

#### Scenario: Indicator is hidden from assistive technology and focus

- **WHEN** the indicator is rendered
- **THEN** it has `aria-hidden` and is not focusable
- **AND** selection, focus, and keyboard navigation behave the same as without
  it

### Requirement: Sliding indicator motion

The slide motion of the `Tabs` and `TabNav` indicator SHALL be disabled under
`prefers-reduced-motion: reduce` (the indicator snaps). There SHALL be no
per-instance prop to toggle the animation.

#### Scenario: No per-instance animation toggle

- **WHEN** a consumer renders `Tabs` or `TabNav`
- **THEN** there is no prop to turn the slide animation on or off for one
  instance; only `prefers-reduced-motion: reduce` disables it

### Requirement: Static marker fallback

The recipe's static marker of `Tabs` and `TabNav` SHALL remain as the no-JS /
pre-hydration fallback for the sliding indicator.

#### Scenario: Static marker is replaced once the indicator is live

- **WHEN** the sliding indicator becomes active on the client
- **THEN** the static marker is no longer shown and the sliding indicator marks
  the active item instead
