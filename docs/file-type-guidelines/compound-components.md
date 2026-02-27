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
// Import from barrel export index for consistent module resolution
import { MenuRoot, MenuTrigger, MenuContent } from "./components";

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  // ...
};
```

**IMPORTANT**:

- Sub-components must be imported from the barrel export index
  (`./components/index.ts`), not from individual files
- Each part must have JSDoc documentation in the main file. See
  [Main Component Guidelines - Documenting Compound Component Parts](./main-component.md#documenting-compound-component-parts)
  for detailed documentation requirements.

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

Note: Every compound component must have a Root component as the first property
to provide configuration and state management.

### 3. Root Accepts Configuration

The Root component receives all theme and component configuration:

```typescript
// Usage
<Menu.Root variant="outline" size="lg">
  <Menu.Trigger>Open</Menu.Trigger>
  <Menu.Content>...</Menu.Content>
</Menu.Root>
```

### Important: Root Implementation Patterns Vary

While all compound components must have a Root component, **the internal
implementation varies significantly**:

- **React Aria Components**: Root may wrap React Aria providers (Menu wraps
  MenuTrigger, Select wraps Select)
- **Custom Context**: Root may provide custom context without React Aria (Alert,
  Card)
- **Hybrid**: Root may combine both patterns (ComboBox)

The examples in this document show different patterns to illustrate this
diversity. When implementing a new compound component, choose the pattern that
best fits your requirements.

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

Root components vary significantly based on their requirements. Here are common
patterns:

#### Pattern 1: React Aria Component Wrapper (Menu Example)

Used when leveraging React Aria's built-in state management:

```typescript
// components/menu.root.tsx
import { useSlotRecipe } from '@chakra-ui/react/styled-system';
import { MenuTrigger as RaMenuTrigger } from 'react-aria-components';
import { MenuRootSlot } from '../menu.slots';
import type { MenuRootProps } from '../menu.types';
import { extractStyleProps } from "@/utils";

export const MenuRoot = (props: MenuRootProps) => {
  // Standard pattern: Split recipe variants
  const recipe = useSlotRecipe({ key: 'menu' });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Standard pattern: Extract style props
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  return (
    <MenuRootSlot {...recipeProps} {...styleProps} asChild>
      <RaMenuTrigger {...functionalProps}>
        {functionalProps.children}
      </RaMenuTrigger>
    </MenuRootSlot>
  );
};

MenuRoot.displayName = 'Menu.Root';
```

#### Pattern 2: Custom Context Provider (Alert Example)

Used when React Aria is not needed or for layout-only components:

```typescript
// components/alert.root.tsx
import { createContext, useMemo, useState } from 'react';
import { useSlotRecipe } from '@chakra-ui/react/styled-system';
import { AlertRootSlot } from '../alert.slots';
import type { AlertRootProps } from '../alert.types';
import { extractStyleProps } from "@/utils";

export const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export const AlertRoot = (props: AlertRootProps) => {
  // Standard pattern: First split recipe variants
  const recipe = useSlotRecipe({ key: 'alert' });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Standard pattern: Second extract style props from remaining
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  // State management for coordinating child components
  const [titleNode, setTitle] = useState<ReactNode>(null);

  const contextValue = useMemo(() => ({ setTitle }), []);

  return (
    <AlertContext.Provider value={contextValue}>
      <AlertRootSlot {...recipeProps} {...styleProps} role="alert">
        {functionalProps.children}
      </AlertRootSlot>
    </AlertContext.Provider>
  );
};

AlertRoot.displayName = 'Alert.Root';
```

### Standard Prop Handling Pattern

**Root components follow this sequential pattern:**

1. **First: Split recipe variants** using `useSlotRecipe` and
   `splitVariantProps` (if component has recipes)
2. **Second: Extract style props** from remaining props using
   `extractStyleProps`
3. **Forward recipe props + style props** to slot components
4. **Forward functional props** to React Aria or underlying components

**Sub-components follow this pattern:**

1. **Extract style props** using `extractStyleProps`
2. **Forward style props** to slot components
3. **Forward functional props** to React Aria or underlying components

This ensures consistent behavior across the design system and proper prop
forwarding.

### Sub-Component Implementation

Sub-components should support flexible composition and avoid hardcoding content:

```typescript
// components/menu.trigger.tsx
import { Button } from 'react-aria-components';
import { MenuTriggerSlot } from '../menu.slots';
import type { MenuTriggerProps } from '../menu.types';
import { extractStyleProps } from "@/utils";

export const MenuTrigger = ({ children, asChild, ref, ...props }: MenuTriggerProps) => {
  // Standard pattern: Extract and forward style props
  const [styleProps, restProps] = extractStyleProps(props);

  // Support asChild pattern for custom trigger elements
  if (asChild) {
    return (
      <MenuTriggerSlot ref={ref} asChild {...styleProps}>
        {children}
      </MenuTriggerSlot>
    );
  }

  // Default: wrap children in an unstyled button
  return (
    <MenuTriggerSlot asChild {...styleProps}>
      <Button ref={ref} {...restProps}>
        {children}
      </Button>
    </MenuTriggerSlot>
  );
};

MenuTrigger.displayName = 'Menu.Trigger';
```

### JSDoc Tags in Implementation Files (CRITICAL)

**Implementation File JSDoc Requirement:**

JSDoc tags like `@supportsStyleProps` must be placed **directly above the
component function** in implementation files (e.g.,
`components/menu.trigger.tsx`) for `react-docgen-typescript` to extract metadata
for documentation generation.

#### Parser Behavior

The `react-docgen-typescript` parser extracts JSDoc tags from component function
definitions in implementation files. Place the `@supportsStyleProps` tag in
individual subcomponent implementation files where the parser can process it.

#### Implementation File JSDoc Pattern

Each component implementation file must include JSDoc directly above the
component export:

```typescript
// components/menu.trigger.tsx
import { Button } from "react-aria-components";
import { MenuTriggerSlot } from "../menu.slots";
import type { MenuTriggerProps } from "../menu.types";

/**
 * Menu.Trigger - The button or element that opens the menu
 *
 * @supportsStyleProps
 */
export const MenuTrigger = ({
  children,
  asChild,
  ref,
  ...props
}: MenuTriggerProps) => {
  // Implementation...
};

MenuTrigger.displayName = "Menu.Trigger";
```

#### Main Export File Namespace JSDoc

The main export file documents each part with JSDoc for developer convenience
(IDE tooltips and code readability):

````typescript
// menu.tsx
export const Menu = {
  /**
   * # Menu.Trigger
   *
   * The trigger element that opens the menu when activated.
   * Handles keyboard and mouse interactions for menu activation.
   *
   * @example
   * ```tsx
   * <Menu.Root>
   *   <Menu.Trigger>Options</Menu.Trigger>
   *   <Menu.Content>...</Menu.Content>
   * </Menu.Root>
   * ```
   */
  Trigger: MenuTrigger,
};
````

**Note**: Place `@supportsStyleProps` tags in implementation files for
documentation generation. The parser extracts metadata from implementation
files, not namespace objects.

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

React Aria components often handle state management internally. Here's a
simplified example:

```typescript
// components/select.root.tsx - Simplified for clarity
import { useSlotRecipe } from '@chakra-ui/react/styled-system';
import { Select as RaSelect } from 'react-aria-components';
import { SelectRootSlot } from '../select.slots';
import type { SelectRootProps } from '../select.types';
import { extractStyleProps } from "@/utils";

export const SelectRoot = (props: SelectRootProps) => {
  // Standard pattern: Split recipe variants
  const recipe = useSlotRecipe({ recipe: selectSlotRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Standard pattern: Extract style props
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  const {
    children,
    value,
    onSelectionChange,
    defaultSelectedKey,
    ...restProps
  } = functionalProps;

  return (
    <SelectRootSlot asChild {...recipeProps} {...styleProps}>
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

**Note**: Actual implementations may be significantly more complex with
conditional rendering, multiple internal slots, loading states, and custom
validation logic. See the actual `select.root.tsx` for a production example.

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

## Type Definitions

For comprehensive type patterns and examples for compound components, see:

- **[Type Definitions Guidelines](./types.md)** - Props interfaces for Root and
  sub-components

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

### Structure

- [ ] `components/` directory exists
- [ ] Main file contains exports only
- [ ] **Sub-components imported from barrel export (`./components/index.ts`)**
- [ ] **`.Root` component exists and is first property**
- [ ] Root component in `components/component-name.root.tsx`
- [ ] All sub-components in separate files following pattern:
      `components/component-name.{part}.tsx`
- [ ] Components index file exports all parts

### Documentation (in main file)

- [ ] **Each part has JSDoc documentation directly above it**
- [ ] **JSDoc includes heading (# ComponentName.Part)**
- [ ] **JSDoc includes purpose description**
- [ ] **JSDoc includes `@example` block for each part**

### Documentation (in implementation files)

- [ ] **Each component implementation has JSDoc directly above the component
      function**
- [ ] **`@supportsStyleProps` JSDoc tag added in implementation files**
      (required for doc generation)
- [ ] **`@supportsStyleProps` tag placed in implementation files where parser
      can extract it**

### Standard Patterns

- [ ] **Root uses `useSlotRecipe` and `splitVariantProps`** (for recipe-based
      components)
- [ ] **All components use `extractStyleProps`** to separate style props
- [ ] **Style props forwarded to slot components**
- [ ] **Functional props forwarded to React Aria or underlying components**
- [ ] Display names set for all components (Pattern: `ComponentName.PartName`)

### Props & Types

- [ ] Root accepts variant/size/theme props via recipe
- [ ] Props interfaces defined in types file
- [ ] Proper prop destructuring and forwarding

### Integration

- [ ] React Aria integration where needed
- [ ] Context provided by Root if state sharing required
- [ ] Refs properly forwarded with `useObjectRef` if needed

---

[← Back to Index](../component-guidelines.md) | [Previous: Slots](./slots.md) |
[Next: Hooks →](./hooks.md)
