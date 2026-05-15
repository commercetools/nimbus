## 1. Type Definitions

- [x] 1.1 Add `href`, `target`, `rel`, `routerOptions` to `TabItemProps`
- [x] 1.2 Add `href`, `target`, `rel`, `routerOptions` to `TabProps`
- [x] 1.3 Add `shouldForceMount` to `TabPanelProps`
- [x] 1.4 Replace vestigial `TabPanelProps.tabs` with `TabPanelProps.id`
- [x] 1.5 Simplify slot types to only hold styling concerns
- [x] 1.6 Export `TabProps`, `TabPanelsProps`, `TabPanelProps` from barrel
- [x] 1.7 Add JSDoc descriptions to all undocumented props

## 2. Component Forwarding

- [x] 2.1 Destructure and forward `href`, `target`, `rel`, `routerOptions`
      in `TabsTab` to React Aria's `Tab`
- [x] 2.2 Forward link props from `TabItemProps` in `TabsList` simplified
      rendering path
- [x] 2.3 Destructure and forward `shouldForceMount` in `TabsPanel` to
      React Aria's `TabPanel`

## 3. Slot Typing

- [x] 3.1 Add explicit `SlotComponent<>` type annotations to `TabsRootSlot`,
      `TabsListSlot`, `TabsTabSlot` for consistency

## 4. Stories & Tests

- [x] 4.1 Add `LinkTabs` story with mock router demonstrating href tabs
- [x] 4.2 Add play function testing anchor rendering, href attributes,
      router navigate calls, and keyboard navigation
- [x] 4.3 Add `beforeEach` mock reset to prevent stale state across runs
- [x] 4.4 Add router integration consumer example in `tabs.docs.spec.tsx`

## 5. Documentation & Release

- [x] 5.1 Create changeset documenting new features and breaking change
- [x] 5.2 Update PR description with breaking change callout
