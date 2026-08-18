## ADDED Requirements

### Requirement: Layout is applied before paint

The component SHALL resolve its aside size so that no frame is ever painted at a
size other than the configured one. The initial layout SHALL be derived
synchronously from props during render (not adopted in a mount effect), and a
change to a controlled `size` SHALL be reconciled into state within the same
commit (a layout effect, not a passive one).

#### Scenario: Uncontrolled first paint honors `defaultSize`

- **WHEN** `<Splitter.Root defaultSize={30}>` mounts
- **THEN** the first committed frame SHALL already render the aside at `30`
- **AND** SHALL NOT paint the 50/50 fallback first

#### Scenario: Controlled first paint honors `size`

- **WHEN** `<Splitter.Root size={30}>` mounts with a valid controlled size
- **THEN** the first committed frame SHALL already render the aside at `30`
- **AND** SHALL NOT paint the 50/50 fallback first, including when the value
  arrives from a container measurement (e.g. `useResponsiveSplitterSizes`)

#### Scenario: Collapsed-on-mount first paint honors `collapsedSize`

- **WHEN** the splitter mounts collapsed (via `collapsed` or `defaultCollapsed`)
  on a `collapsible` aside
- **THEN** the first committed frame SHALL already render the aside at
  `collapsedSize`
- **AND** SHALL retain the uncollapsed size as the expand target

#### Scenario: Controlled `size` change is adopted in the same commit

- **GIVEN** a controlled `<Splitter.Root size={state}>`
- **WHEN** `state` changes to a new aside size
- **THEN** SHALL apply the new size within the commit that renders it, before
  paint
- **AND** SHALL NOT leave a painted frame showing the previous size
