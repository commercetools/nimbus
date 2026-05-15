## Context

`Menu.Content` (exposed as `Menu.Options`) carries a `@supportsStyleProps` JSDoc annotation, but its `MenuContentProps` type only declared `children`, `ref`, and `placement`. Style props such as `width`, `maxHeight`, `minWidth`, and `bg` were silently dropped at the type boundary and never reached the popover DOM element, contradicting the documented API contract (CRAFT-2184).

The fix lives in two files only — the type definition and the component — because the underlying `MenuPopoverSlot` is already a Chakra slot that natively accepts `HTMLChakraProps<"div">` style props. The plumbing existed; the public surface just refused to expose it.

## Approach

- Redefine `MenuContentProps` as `OmitInternalProps<MenuPopoverSlotProps> & { children?; ref?; placement? }` so all Chakra style props flow through the type, with explicit overrides for the menu-specific concerns.
- In `MenuContent`, destructure the known props (`children`, `placement`, `ref`) and collect the remainder as `...styleProps`, then spread `styleProps` onto `MenuPopoverSlot`.
- Leave `placement` handling, the `Popover` wrapper, focus behavior, and `MenuSectionProvider` wiring untouched — the rest-prop forwarding is purely additive.
- `MenuSubmenuProps` continues to alias `MenuContentProps`, so submenus inherit the fix for free.

## Alternatives Considered

- Stripping the `@supportsStyleProps` annotation instead of honoring it — rejected because consumers already rely on style-prop support on other compound parts (`Menu.Root`, trigger slots) and Menu.Content is the natural place to size/style the flyout.
- Threading a dedicated `popoverProps` escape hatch — rejected as needlessly indirect when the slot already accepts the props directly.

## Risks / Trade-offs

- None — narrowly scoped fix. Type widens to a superset of the prior shape, and runtime behavior for unspecified props goes from "dropped" to "forwarded to the slot," matching the documented contract.
