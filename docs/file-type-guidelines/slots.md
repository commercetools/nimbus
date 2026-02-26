# Slot Component Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Recipes](./recipes.md) |
[Next: Compound Components →](./compound-components.md)

## Purpose

Slot component files (`{component-name}.slots.tsx`) create styled wrapper
components that inject Chakra UI recipe context and apply CSS classes. They
bridge React Aria components with the Nimbus styling system.

## When to Use

### Create Slot Components When:

- Component needs **recipe-based styling**
- Using **React Aria components** that need styling
- Building **multi-element components** with coordinated styles
- Need to **propagate recipe context** to child elements

### When Slots Aren't Needed:

- Component doesn't use recipes
- Only composing existing styled components
- No custom styling needed

## Critical Requirements

### MUST Use Explicit Return Type Annotations

**All slot component exports MUST include explicit return type annotations**
using the `SlotComponent<TElement, TProps>` utility type. This prevents
TypeScript TS2742 errors during declaration file generation by avoiding inferred
types that reference peer dependency internals.

### MUST Export Both Components AND Types

**This is non-negotiable** - Slot files must export:

1. The slot component itself with explicit return type annotation
2. Its TypeScript type definition

**The type name MUST equal the component name plus "Props" suffix:**

```typescript
import type { SlotComponent } from "../utils/slot-types";

// ✅ CORRECT - Multi-slot component
export type MenuTriggerSlotProps = HTMLChakraProps<"button">;
export const MenuTriggerSlot: SlotComponent<
  HTMLButtonElement,
  MenuTriggerSlotProps
> = withContext<HTMLButtonElement, MenuTriggerSlotProps>("button", "trigger");

// ✅ CORRECT - Single-slot component
export type ButtonRootProps = HTMLChakraProps<"button">;
export const ButtonRoot: SlotComponent<HTMLButtonElement, ButtonRootProps> =
  withContext<HTMLButtonElement, ButtonRootProps>("button", "root");
```

## SlotComponent Utility Type

The `SlotComponent<TElement, TProps>` utility type provides explicit return type
annotations for slot components created with Chakra UI's `withProvider` and
`withContext` HOCs.

**Why this is required:**

- TypeScript infers return types for `withProvider`/`withContext` that reference
  Chakra's internal generated recipe types
- These inferred types create non-portable references to
  `node_modules/@chakra-ui/react/dist/types/styled-system/generated/recipes.gen`
- During declaration file (`.d.ts`) generation, this causes TS2742 errors
  because the types reference peer dependency internals that won't exist in
  consumer projects
- Explicit return type annotations using `SlotComponent` override the inference
  and create stable, portable types

**Type Definition:**

```typescript
// packages/nimbus/src/components/utils/slot-types.ts
export type SlotComponent<
  TElement = Element,
  TProps = Record<string, unknown>,
> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TProps> & React.RefAttributes<TElement>
>;
```

**Usage:** Every slot component export must include this type annotation.

## File Structure

### Standard Recipe Slots

For components with standard recipes (single-slot):

```typescript
// button.slots.tsx
import {
  createRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { buttonRecipe } from "./button.recipe";
import type { SlotComponent } from "../utils/slot-types";

const { withContext } = createRecipeContext({
  recipe: buttonRecipe,
});

// Export both type and component - type name = component name + "Props"
export type ButtonRootProps = HTMLChakraProps<"button">;
export const ButtonRoot: SlotComponent<HTMLButtonElement, ButtonRootProps> =
  withContext<HTMLButtonElement, ButtonRootProps>("button", "root");
```

### Slot Recipe Components

For components with multiple slots:

```typescript
// menu.slots.tsx
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { menuSlotRecipe } from "./menu.recipe";
import type { SlotComponent } from "../utils/slot-types";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: menuSlotRecipe,
});

// Root slot - provides context
export type MenuRootSlotProps = HTMLChakraProps<"div">;
export const MenuRootSlot: SlotComponent<HTMLDivElement, MenuRootSlotProps> =
  withProvider<HTMLDivElement, MenuRootSlotProps>("div", "root");

// Trigger slot - consumes context
export type MenuTriggerSlotProps = HTMLChakraProps<"button">;
export const MenuTriggerSlot: SlotComponent<
  HTMLButtonElement,
  MenuTriggerSlotProps
> = withContext<HTMLButtonElement, MenuTriggerSlotProps>("button", "trigger");

// Content slot
export type MenuContentSlotProps = HTMLChakraProps<"div">;
export const MenuContentSlot: SlotComponent<
  HTMLDivElement,
  MenuContentSlotProps
> = withContext<HTMLDivElement, MenuContentSlotProps>("div", "content");

// Item slot
export type MenuItemSlotProps = HTMLChakraProps<"div">;
export const MenuItemSlot: SlotComponent<HTMLDivElement, MenuItemSlotProps> =
  withContext<HTMLDivElement, MenuItemSlotProps>("div", "item");
```

## Context Patterns

### withProvider vs withContext

- **`withProvider`**: Used for the root slot, provides recipe context
- **`withContext`**: Used for child slots, consumes recipe context

```typescript
import type { SlotComponent } from "../utils/slot-types";

// Root provides context
export const ComponentRootSlot: SlotComponent<HTMLDivElement, RootProps> =
  withProvider<HTMLDivElement, RootProps>("div", "root");

// Children consume context
export const ComponentChildSlot: SlotComponent<HTMLSpanElement, ChildProps> =
  withContext<HTMLSpanElement, ChildProps>("span", "child");
```

### Context Propagation

Recipe context automatically flows through the component tree:

```typescript
// In component implementation
<MenuRootSlot variant="outline" size="lg">  {/* Provides context */}
  <MenuTriggerSlot>  {/* Receives variant="outline" size="lg" */}
    Trigger
  </MenuTriggerSlot>
  <MenuContentSlot>  {/* Also receives context */}
    Content
  </MenuContentSlot>
</MenuRootSlot>
```

## Integration with React Aria

### Using asChild Pattern

Slot components use the `asChild` prop to pass styles to React Aria components:

```typescript
// In component implementation
import { Button as RaButton } from 'react-aria-components';
import { ButtonRootSlot } from './button.slots';

export const Button = (props: ButtonProps) => {
  // Note: Actual Button implementation is more complex with useButton hook
  // This is a simplified example showing the asChild pattern
  return (
    <ButtonRootSlot asChild>
      <RaButton {...props}>
        {props.children}
      </RaButton>
    </ButtonRootSlot>
  );
};
```

### Multiple Slots Example

```typescript
// menu.root.tsx
export const MenuRoot = (props: MenuRootProps) => {
  return (
    <MenuRootSlot {...props}>
      <RaMenuTrigger>
        {props.children}
      </RaMenuTrigger>
    </MenuRootSlot>
  );
};

// menu.trigger.tsx
export const MenuTrigger = (props: MenuTriggerProps) => {
  return (
    <MenuTriggerSlot asChild>
      <RaButton {...props}>
        {props.children}
      </RaButton>
    </MenuTriggerSlot>
  );
};
```

## Type Patterns

### HTMLChakraProps

Use for components that accept all Chakra style props:

```typescript
import { type HTMLChakraProps } from "@chakra-ui/react/styled-system";

export type ComponentSlotProps = HTMLChakraProps<"div">;
// Includes all style props like backgroundColor, padding, etc.
```

### Restricted Props

For slots that shouldn't accept all props:

```typescript
import { type ComponentProps } from "react";

export type RestrictedSlotProps = ComponentProps<"button"> & {
  // Only specific props, no style props
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
};
```

## Naming Conventions

### Slot Component Names

| Component Type  | Pattern                     | Example           |
| --------------- | --------------------------- | ----------------- |
| Single-slot     | `{ComponentName}Root`       | `ButtonRoot`      |
| Multi-slot root | `{ComponentName}RootSlot`   | `MenuRootSlot`    |
| Multi-slot part | `{ComponentName}{Part}Slot` | `MenuTriggerSlot` |

### Type Names

**Type name = Component name + "Props"**

| Component Type  | Component Name    | Type Name              |
| --------------- | ----------------- | ---------------------- |
| Single-slot     | `ButtonRoot`      | `ButtonRootProps`      |
| Multi-slot root | `MenuRootSlot`    | `MenuRootSlotProps`    |
| Multi-slot part | `MenuTriggerSlot` | `MenuTriggerSlotProps` |
| Multi-slot part | `MenuItemSlot`    | `MenuItemSlotProps`    |

## Common Patterns from Nimbus

### Simple Slot (Button)

```typescript
// button.slots.tsx
import {
  createRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { buttonRecipe } from "./button.recipe";
import type { SlotComponent } from "../utils/slot-types";

const { withContext } = createRecipeContext({
  recipe: buttonRecipe,
});

// Export both type and component with explicit return type annotation
export type ButtonRootProps = HTMLChakraProps<"button">;
export const ButtonRoot: SlotComponent<HTMLButtonElement, ButtonRootProps> =
  withContext<HTMLButtonElement, ButtonRootProps>("button", "root");
```

## Related Guidelines

- [Recipes](./recipes.md) - Creating recipes for slots
- [Main Component](./main-component.md) - Using slots in components
- [Compound Components](./compound-components.md) - Multi-slot patterns

## Validation Checklist

- [ ] Slot file exists with `.tsx` extension
- [ ] **`SlotComponent` utility type imported** from `../utils/slot-types`
- [ ] **All slot component exports have explicit return type annotations** using
      `SlotComponent<TElement, TProps>`
- [ ] **Slot components exported** (types can be in slots file or types file)
- [ ] Types use `HTMLChakraProps` or appropriate interface
- [ ] Naming follows appropriate pattern (see Naming Conventions table)
- [ ] Type names follow `{ComponentName}[Part]Props` or
      `{ComponentName}[Part]SlotProps` pattern
- [ ] Root slot uses `withProvider` (for multi-slot components)
- [ ] Child slots use `withContext` (for multi-slot components)
- [ ] Single-slot components use `withContext`
- [ ] Recipe imported and used in context creation
- [ ] `asChild` pattern used with React Aria when needed
- [ ] Slot names match recipe slot definitions

---

[← Back to Index](../component-guidelines.md) |
[Previous: Recipes](./recipes.md) |
[Next: Compound Components →](./compound-components.md)
