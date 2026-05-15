# Change: Fix Menu.Content style props forwarding

## Why

`Menu.Content` (exposed as `Menu.Options`) has a `@supportsStyleProps` JSDoc annotation, but its type (`MenuContentProps`) only accepts `children`, `ref`, and `placement`. Style props like `width` are silently dropped because the type does not extend `HTMLChakraProps` and the component never spreads extra props onto the DOM. This violates the documented API contract.

Ref: [CRAFT-2184](https://commercetools.atlassian.net/browse/CRAFT-2184)

## What Changes

- Extend `MenuContentProps` to include `OmitInternalProps<MenuPopoverSlotProps>` so style props are part of the type
- Forward rest props from `MenuContent` to `MenuPopoverSlot` so they reach the DOM
- Existing behavior (`placement`, `ref`, `children`) remains unchanged

## Impact

- Affected specs: `nimbus-menu`
- Affected code:
  - `packages/nimbus/src/components/menu/menu.types.ts`
  - `packages/nimbus/src/components/menu/components/menu.content.tsx`
