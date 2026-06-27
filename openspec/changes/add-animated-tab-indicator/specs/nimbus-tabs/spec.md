## ADDED Requirements

### Requirement: Animated active-tab indicator

`Tabs.Root` SHALL accept an opt-in `animated` boolean prop. When `true`, `Tabs`
SHALL render a single decorative indicator that slides between tabs as the
selected tab changes, instead of the static per-tab marker. `animated` SHALL
default to `false`, leaving the default appearance and behavior unchanged. The
indicator SHALL be `aria-hidden` and non-focusable, and SHALL NOT affect
`aria-selected`, focus rings, or keyboard navigation.

#### Scenario: Animated indicator follows the selected tab

- **WHEN** `Tabs.Root` has `animated` and the selected tab changes
- **THEN** the indicator slides from the previously selected tab to the newly
  selected tab

#### Scenario: Indicator adapts to variant, orientation, and placement

- **WHEN** `animated` is set
- **THEN** for the `line` variant the indicator is a thin bar on the active tab's
  bottom edge when horizontal, its right edge when vertical with
  `placement="start"`, and its left edge when vertical with `placement="end"`;
  and for the `pills` variant the indicator is a filled, fully-rounded highlight
  behind the active tab

#### Scenario: Static marker is suppressed while animated

- **WHEN** `animated` is set
- **THEN** the static selected marker (the `line` underline / `pills` background)
  is not rendered, so only the sliding indicator shows

#### Scenario: Reduced motion snaps the indicator

- **WHEN** the user requests `prefers-reduced-motion: reduce`
- **THEN** the indicator repositions without a slide transition

#### Scenario: Default is unchanged

- **WHEN** `animated` is not set
- **THEN** `Tabs` renders the static selected marker and no indicator element
