## Context

Tabs in single-page apps often correspond to distinct routes (e.g. `/orders`,
`/customers`). React Aria's `Tab` component already accepts `href` (and the
related `target`, `rel`, `routerOptions` props) and integrates with the
`router` configured on `<NimbusProvider>` — but Nimbus's `TabsTab` wrapper did
not destructure or forward these props. Consumers had to either fall back to
`@ts-expect-error` casts or abandon the simplified `tabs` prop API entirely.

Separately, `TabPanelProps` was missing React Aria's `shouldForceMount`,
which keeps inactive panels in the DOM (useful for preserving form state across
tab switches). The same `TabPanelProps` also carried a vestigial `tabs` prop
that was never wired up to anything; panel identity is actually established
via `id`.

## Approach

**Link props are forwarded through both APIs:**

- `TabProps` and `TabItemProps` each gain `href`, `target`, `rel`,
  `routerOptions` (typed against the `RouterOptions` already exposed by
  `NimbusProvider`).
- `TabsTab` explicitly destructures these four props and passes them to
  `react-aria-components`' `Tab`. React Aria handles the rest: rendering as
  `<a>` when `href` is set, calling the provider's `router.navigate`, and
  preventing default browser navigation.
- `TabsList` forwards the same four props from `TabItemProps` items to
  `TabsTab` in the simplified `tabs`-prop rendering path, so both APIs behave
  identically.

**Panel mounting & identity:**

- `TabsPanel` destructures `shouldForceMount` and forwards it to React Aria's
  `TabPanel`.
- `TabPanelProps.tabs` is removed and replaced with `id`. Since the old `tabs`
  prop was never used by the implementation, no consumer-visible behavior
  changes — only the type signature.

**Slot type cleanup:**

- Slot prop types (`TabsRootSlotProps`, `TabsListSlotProps`, etc.) are reduced
  to styling concerns only. Behavioral props (link, selection, force-mount)
  live on the public component prop types, keeping the slot/recipe boundary
  clean.

## Alternatives Considered

- **Spread all props to React Aria's `Tab`**: rejected. Explicit destructuring
  documents intent, keeps the public prop surface visible in IDE hover, and
  prevents accidentally forwarding internal slot props.
- **Keep `TabPanelProps.tabs` for back-compat**: rejected. It was vestigial
  (never read) — preserving it would lock in a misleading type.

## Risks / Trade-offs

- **A11y / keyboard semantics**: React Aria already maps Enter/Space to link
  activation on anchor-rendered tabs and preserves roving tabindex, so arrow
  keys behave identically. Selected state still reflects the active tab and is
  driven by `selectedKey` (or the router via `routerOptions`).
- **Router coupling**: link tabs only navigate via the provider's `router`
  when one is configured; without it they fall back to native anchor behavior.
  Documented in the `LinkTabs` story and `tabs.docs.spec.tsx`.
- **Breaking change scope**: removing `TabPanelProps.tabs` is technically
  breaking but practically zero-impact — the prop did nothing. Called out in
  the changeset.
