# Change: Add Link Navigation Support to Tabs

**Status:** implemented (retroactive)

## Why

Tabs often represent distinct views or sections that map to URLs in
single-page applications. React Aria's `Tab` component already supports `href`
and related link props, but Nimbus never exposed them. Consumers had to work
around this with `@ts-expect-error` or abandon the simplified `tabs` prop API
entirely. Additionally, `TabPanelProps` was missing React Aria's
`shouldForceMount` prop, preventing consumers from keeping inactive panels
mounted (e.g. to preserve form state).

## What Changes

- **MODIFIED** `TabProps` — adds `href`, `target`, `rel`, and `routerOptions`
  props to enable link-based tab rendering via React Aria
- **MODIFIED** `TabItemProps` — adds the same link props for the simplified
  `tabs` prop API
- **MODIFIED** `TabPanelProps` — adds `shouldForceMount` to keep panels mounted
  when not selected; removes vestigial `tabs` prop, replaces with `id`
- **MODIFIED** `TabsTab` component — explicitly destructures and forwards link
  props to React Aria's `Tab`
- **MODIFIED** `TabsList` component — forwards link props from `TabItemProps` to
  `TabsTab` in the simplified rendering path
- **MODIFIED** `TabsPanel` component — forwards `shouldForceMount` to React
  Aria's `TabPanel`
- **ADDED** new type exports: `TabProps`, `TabPanelsProps`, `TabPanelProps`
- **MODIFIED** slot types — simplified to only hold styling concerns; behavioral
  props moved to public component types

## Impact

- Affected specs: `nimbus-tabs`
- Affected code:
  - `packages/nimbus/src/components/tabs/tabs.types.ts`
  - `packages/nimbus/src/components/tabs/tabs.tsx`
  - `packages/nimbus/src/components/tabs/tabs.slots.tsx`
  - `packages/nimbus/src/components/tabs/components/tabs.tab.tsx`
  - `packages/nimbus/src/components/tabs/components/tabs.list.tsx`
  - `packages/nimbus/src/components/tabs/components/tabs.panel.tsx`

## Breaking Changes

- `TabPanelProps.tabs` removed (replaced with `TabPanelProps.id`). The `tabs`
  prop on individual panels was vestigial and non-functional, so consumer
  impact is expected to be zero.
