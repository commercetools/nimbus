# Proposal: Add tabListAriaLabel prop to Tabs component

## Summary

Add an optional `tabListAriaLabel` prop to `Tabs.Root` that allows consumers to
provide an accessible label for the tab list when using the simplified `tabs`
prop API.

## Problem

When using the simplified `tabs` prop API (instead of children-based
composition), there is no way to provide an `aria-label` for the `TabList`. This
causes accessibility warnings in tests and fails WCAG requirements for labeling
navigation regions.

```tsx
// Current: No way to add aria-label to the generated TabList
<Tabs.Root tabs={tabs} />

// Children API allows it, but is more verbose
<Tabs.Root>
  <Tabs.List aria-label="Product sections">
    ...
  </Tabs.List>
</Tabs.Root>
```

## Solution

Add `tabListAriaLabel` prop to `Tabs.Root` that gets forwarded to the internally
rendered `Tabs.List` when using the `tabs` prop API.

```tsx
<Tabs.Root tabs={tabs} tabListAriaLabel="Product sections" />
```

## Scope

- **In scope**: Adding `tabListAriaLabel` prop to `TabsProps`
- **Out of scope**: Changes to children-based composition (already supports
  aria-label directly)

## Impact

- **Breaking changes**: None
- **Migration required**: None (new optional prop)
- **Dependencies**: None
