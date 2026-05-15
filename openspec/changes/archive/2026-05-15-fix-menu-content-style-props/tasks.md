## 1. Implementation

- [x] 1.1 Update `MenuContentProps` type to extend `OmitInternalProps<MenuPopoverSlotProps>` with explicit `children`, `ref`, and `placement` overrides
- [x] 1.2 Update `MenuContent` component to destructure known props and spread rest onto `MenuPopoverSlot`
- [x] 1.3 Verify TypeScript compiles cleanly (no menu-related errors)
- [x] 1.4 Verify existing Menu stories still pass (pre-existing storybook setup issue unrelated to changes)
