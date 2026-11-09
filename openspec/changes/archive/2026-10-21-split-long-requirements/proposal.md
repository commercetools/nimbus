# Proposal: Split requirements longer than 500 characters

## Why

OpenSpec 1.14.1 warns when the description of a requirement (the text between
`### Requirement:` and its first scenario) is longer than 500 characters. CI runs
`openspec validate --all --strict`, which fails on any warning, so 12
requirements in 7 specs block the upgrade to OpenSpec 1.14
([FEC-1379](https://commercetools.atlassian.net/browse/FEC-1379)).

A long description usually holds several behaviors, or examples and edge cases
that belong in scenarios. Splitting it gives each behavior its own requirement
and scenarios, so it can be tested and changed on its own.

## What Changes

This change follows the procedure in OpenSpec's spec-driven schema for an
existing long requirement:

- Under MODIFIED, each requirement keeps its header and every scenario. Its
  description is cut down to one behavior without changing its meaning.
- Examples and edge cases that were removed from a description are added as new
  scenarios of the same requirement.
- Each behavior that was removed from a description is added as its own ADDED
  requirement with its own scenarios.

No behavior is added, removed, or changed. Every new requirement and scenario
restates a rule from the original description.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `activity-indicator`: shortens `Fixed icon-box sizing for slot placement` and
  `Purely decorative accessibility contract`; adds `No component-owned live
  region` and `Not a progress indicator`.
- `drop-zone`: shortens `Default state and content`, `Visual states`, and
  `Accessibility (WCAG 2.1 AA)`; adds `Sizing via style props`, `Visual state
  contrast and motion`, `No text selection or pointer cursor`, `Default
  accessible name`, and `Documented file-upload alternative`.
- `nimbus-scroll-area`: shortens `Content wrapper sizes to viewport by default`.
- `nimbus-splitter`: shortens `Collapsible aside`; adds `No resizing while
  collapsed`.
- `nimbus-tabs`: shortens `Unified variants with a sliding active indicator`;
  adds `Sliding indicator is decorative`, `Sliding indicator motion`, and
  `Static marker fallback`.
- `nimbus-use-responsive-splitter-sizes`: shortens three requirements; adds
  `Accept pixel, token, and percent size values` and `Restore the persisted
  size`.
- `nimbus-use-sliding-indicator`: shortens `Position a sliding indicator over
  the active item`.

## Impact

- Specs only. No code, tests, or published packages change.
- Requirement headers stay the same, so existing references to them still work.
- ADDED requirements are appended at the end of each main spec on archive.
