# Compound Components Guidelines

[← Back to Index](../component-guidelines.md) | [Previous: Slots](./slots.md) |
[Next: Hooks →](./hooks.md)

## Purpose

The `components/` directory contains implementation files for compound
components - components with multiple parts that work together (e.g.,
`Menu.Root`, `Menu.Trigger`, `Menu.Item`).

## When to Use

### Create Compound Components When:

- Component has **multiple interactive parts**
- Users need **flexible composition**
- Parts can be **arranged differently** per use case
- Component has **internal state sharing** between parts

### Examples of Compound Components:

- Menu (Root, Trigger, Content, Item)
- Select (Root, Trigger, Option)
- Accordion (Root, Item, Trigger, Content)
- Popover (Root, Trigger, Content, Title, Close)

## Critical Rules

### 1. Main File Contains Exports Only

For compound components, the main file (`component-name.tsx`) must contain
**only exports**, no implementation:

```typescript
// ✅ CORRECT - menu.tsx contains only exports
export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  // ...
};
```

### 2. Root Component is MANDATORY

**Every compound component MUST have a `.Root` component** as the first
property:

```typescript
// ✅ CORRECT - Root is first
export const Menu = {
  Root: MenuRoot, // FIRST property
  Trigger: MenuTrigger,
  Content: MenuContent,
};

```

Note: Every compound component must have a Root component as the first property to provide configuration and state management.

### 3. Root Accepts Configuration

The Root component receives all theme and component configuration:

```typescript
// Usage
<Menu.Root variant="outline" size="lg">
  <Menu.Trigger>Open</Menu.Trigger>
  <Menu.Content>...</Menu.Content>
</Menu.Root>
```

## File Structure

### Directory Organization

```
menu/
├── menu.tsx                    # Exports only
├── menu.types.ts              # All type definitions
├── menu.recipe.tsx            # Slot recipe
├── menu.slots.tsx             # Slot components
├── components/                # Implementation files
│   ├── menu.root.tsx          # Root implementation
│   ├── menu.trigger.tsx       # Trigger implementation
│   ├── menu.content.tsx       # Content implementation
│   ├── menu.item.tsx          # Item implementation
│   └── index.ts               # Component exports
└── index.ts                   # Public API
```

### Root Component Implementation

```typescript
// components/menu.root.tsx
import { MenuTrigger as RaMenuTrigger } from 'react-aria-components';
import { MenuRootSlot } from '../menu.slots';
import type { MenuRootProps } from '../menu.types';

export const MenuRoot = (props: MenuRootProps) => {
  const { children, variant, size, ...restProps } = props;

  return (
    <MenuRootSlot variant={variant} size={size}>
      <RaMenuTrigger {...restProps}>
        {children}
      </RaMenuTrigger>
    </MenuRootSlot>
  );
};

MenuRoot.displayName = 'Menu.Root';
```

### Sub-Component Implementation

```typescript
// components/menu.trigger.tsx
import { Button as RaButton } from 'react-aria-components';
import { MenuTriggerSlot } from '../menu.slots';
import type { MenuTriggerProps } from '../menu.types';

export const MenuTrigger = (props: MenuTriggerProps) => {
  return (
    <MenuTriggerSlot asChild>
      <RaButton {...props}>
        {props.children}
        <ChevronDownIcon />
      </RaButton>
    </MenuTriggerSlot>
  );
};

MenuTrigger.displayName = 'Menu.Trigger';
```

### Components Index File

```typescript
// components/index.ts
export { MenuRoot } from "./menu.root";
export { MenuTrigger } from "./menu.trigger";
export { MenuContent } from "./menu.content";
export { MenuItem } from "./menu.item";
```

## Display Names

Always set display names for debugging:

```typescript
// Pattern: ComponentName.PartName
MenuRoot.displayName = "Menu.Root";
MenuTrigger.displayName = "Menu.Trigger";
MenuItem.displayName = "Menu.Item";
```

## State Management Patterns

### Using React Aria State

```typescript
// components/select.root.tsx
import { Select as RaSelect } from 'react-aria-components';

export const SelectRoot = (props: SelectRootProps) => {
  const {
    children,
    value,
    onSelectionChange,
    defaultSelectedKey,
    ...restProps
  } = props;

  return (
    <SelectRootSlot>
      <RaSelect
        selectedKey={value}
        onSelectionChange={onSelectionChange}
        defaultSelectedKey={defaultSelectedKey}
        {...restProps}
      >
        {children}
      </RaSelect>
    </SelectRootSlot>
  );
};
```

### Custom Context for State Sharing

```typescript
// menu-context.tsx
const MenuContext = createContext<MenuContextValue>();

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu parts must be used within Menu.Root');
  }
  return context;
};

// components/menu.root.tsx
export const MenuRoot = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen }}>
      <MenuRootSlot>
        {props.children}
      </MenuRootSlot>
    </MenuContext.Provider>
  );
};
```

## Composition Patterns

### Flexible Child Composition

```typescript
// Allow flexible ordering
<Popover.Root>
  <Popover.Content>
    <Popover.Title>Title</Popover.Title>
    <Popover.Description>Description</Popover.Description>
    {/* User can add custom content */}
    <CustomContent />
    <Popover.Actions>
      <Button>Cancel</Button>
      <Button>Confirm</Button>
    </Popover.Actions>
  </Popover.Content>
</Popover.Root>
```

### Required Structure Enforcement

```typescript
// components/tabs.root.tsx
export const TabsRoot = ({ children, ...props }) => {
  // Validate children structure if needed
  const tabList = Children.find(children, TabsList);
  const tabPanels = Children.find(children, TabsPanels);

  if (!tabList || !tabPanels) {
    throw new Error('Tabs.Root requires Tabs.List and Tabs.Panels');
  }

  return (
    <TabsRootSlot {...props}>
      {children}
    </TabsRootSlot>
  );
};
```

## Type Patterns

### Root Props

```typescript
// menu.types.ts
export interface MenuRootProps {
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
}
```

### Sub-Component Props

```typescript
export interface MenuItemProps {
  children: React.ReactNode;
  onAction?: () => void;
  isDisabled?: boolean;
  value: string;
}
```

## Examples from Nimbus

### Menu Component

```typescript
// menu.tsx - Main file with exports only
export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
};

// components/menu.root.tsx - Implementation
export const MenuRoot = (props: MenuRootProps) => {
  return (
    <MenuRootSlot {...props}>
      <RaMenuTrigger>
        {props.children}
      </RaMenuTrigger>
    </MenuRootSlot>
  );
};
```

### Select Component

```typescript
// select.tsx
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Option: SelectOption,
  Group: SelectGroup,
  Label: SelectLabel,
};
```


## When to Use Compound vs Single

### Use Compound Components When:

- Multiple parts need coordination
- Flexible composition required
- Different layouts per use case
- Internal state management needed

### Use Single Component When:

- Fixed, simple structure
- No composition flexibility needed
- Single responsibility
- Consistency more important than flexibility

## Related Guidelines

- [Main Component](./main-component.md) - Export patterns
- [Slots](./slots.md) - Slot component usage
- [Context Files](./context-files.md) - State sharing
- [Architecture Decisions](./architecture-decisions.md) - When to use compound

## Validation Checklist

- [ ] `components/` directory exists
- [ ] Main file contains exports only
- [ ] **`.Root` component exists and is first property**
- [ ] Root component in `components/component-name.root.tsx`
- [ ] All sub-components in separate files
- [ ] Display names set for all components
- [ ] Components index file exports all parts
- [ ] Root accepts variant/size/theme props
- [ ] Props interfaces defined in types file
- [ ] React Aria integration where needed

---

[← Back to Index](../component-guidelines.md) | [Previous: Slots](./slots.md) |
[Next: Hooks →](./hooks.md)
