## ADDED Requirements

### Requirement: Unified variants with a sliding active indicator

`Tabs` and `TabNav` SHALL expose the same three variants — `underline` (the
default), `rounded`, and `pill` — and SHALL render the active marker as a single
indicator that slides between items/tabs as the selection changes, rather than a
static per-item marker. The indicator SHALL be decorative (`aria-hidden`,
non-focusable) and SHALL NOT affect the selected state, focus, or keyboard
navigation. The motion SHALL be disabled under `prefers-reduced-motion: reduce`
(the indicator snaps). There SHALL be no per-instance prop to toggle the
animation. The recipe's static marker SHALL remain as the no-JS / pre-hydration
fallback.

#### Scenario: Active marker slides on selection change

- **WHEN** the selected item/tab changes
- **THEN** the indicator slides from the previous selection to the new one

#### Scenario: Indicator adapts to the variant

- **WHEN** the variant is `underline`
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

### Requirement: Deprecated variant aliases

The components SHALL accept the previous variant names as deprecated aliases,
resolved to the new names at runtime, so existing consumers keep working:
`Tabs` `line` → `underline` and `pills` → `pill`; `TabNav` `tabs` → `underline`.

#### Scenario: Legacy Tabs variant names still render

- **WHEN** `Tabs.Root` is given `variant="line"` or `variant="pills"`
- **THEN** it renders as `underline` / `pill` respectively

#### Scenario: Legacy TabNav variant name still renders

- **WHEN** `TabNav.Root` is given `variant="tabs"`
- **THEN** it renders as `underline`
