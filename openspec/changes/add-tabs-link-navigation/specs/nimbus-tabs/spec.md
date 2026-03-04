## ADDED Requirements

### Requirement: Link-Based Tab Navigation

The Tab component SHALL support rendering as an anchor element for URL-driven
navigation, forwarding React Aria's `LinkDOMProps` to the underlying `Tab`.

#### Scenario: Tab with href

- **WHEN** `href` prop is provided to `Tabs.Tab`
- **THEN** SHALL render as an `<a>` element instead of a button
- **AND** SHALL set the `href` attribute on the anchor

#### Scenario: Tab with target and rel

- **WHEN** `target` and/or `rel` props are provided alongside `href`
- **THEN** SHALL forward `target` to the anchor element
- **AND** SHALL forward `rel` to the anchor element

#### Scenario: Tab with routerOptions

- **WHEN** `routerOptions` prop is provided alongside `href`
- **THEN** SHALL forward `routerOptions` to React Aria's `Tab`
- **AND** React Aria SHALL pass them to the configured router navigate function

#### Scenario: Link tabs via simplified API

- **WHEN** `tabs` prop items include `href`, `target`, `rel`, or `routerOptions`
- **THEN** SHALL forward all link props to the rendered `Tabs.Tab` components
- **AND** behavior SHALL be identical to compound component usage

#### Scenario: Router integration

- **WHEN** a `NimbusProvider` is configured with a `router` prop
- **AND** a link tab is clicked
- **THEN** SHALL call `router.navigate` with the tab's `href`
- **AND** SHALL prevent default browser navigation

#### Scenario: Keyboard navigation with link tabs

- **WHEN** link tabs are used
- **THEN** arrow key navigation SHALL work identically to button tabs
- **AND** focus management SHALL follow the same roving tabindex pattern

### Requirement: Force-Mounted Panels

The TabPanel component SHALL support keeping panels mounted in the DOM when not
selected, forwarding React Aria's `shouldForceMount` prop.

#### Scenario: shouldForceMount enabled

- **WHEN** `shouldForceMount={true}` is set on `Tabs.Panel`
- **THEN** SHALL keep the panel in the DOM when its tab is not selected
- **AND** inactive panel SHALL be inert (not interactable)

#### Scenario: shouldForceMount disabled (default)

- **WHEN** `shouldForceMount` is not set or is `false`
- **THEN** SHALL only mount the panel when its corresponding tab is selected
- **AND** behavior SHALL match existing default

## MODIFIED Requirements

### Requirement: Namespace Structure

The component SHALL export additional public types for typed consumer wrappers.

#### Scenario: Type exports

- **WHEN** types are imported from `@commercetools/nimbus`
- **THEN** SHALL export `TabProps` for individual tab typing
- **AND** SHALL export `TabPanelsProps` for panels container typing
- **AND** SHALL export `TabPanelProps` for individual panel typing
- **AND** SHALL continue exporting `TabsProps`, `TabListProps`, `TabItemProps`

### Requirement: Panel Management

#### Scenario: Panel association (updated)

- **WHEN** panels render
- **THEN** each Tab SHALL associate with Panel via `id` prop
- **AND** `TabPanelProps` SHALL accept `id` (not `tabs`)
- **AND** Tab SHALL use aria-controls to reference panel
- **AND** Panel SHALL use aria-labelledby to reference tab

## REMOVED Requirements

### Requirement: Panel tabs prop

- `TabPanelProps.tabs` has been removed. The `tabs` prop on individual panels
  was vestigial and non-functional. Panel identity is established via the `id`
  prop.
