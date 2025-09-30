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

### MUST Export Both Components AND Types

**This is non-negotiable** - Slot files must export:

1. The slot components themselves
2. Their TypeScript type definitions

```typescript
// ✅ CORRECT - exports both components and types
export type ButtonSlotProps = HTMLChakraProps<"button">;
export const ButtonSlot = withContext<HTMLButtonElement, ButtonSlotProps>(
  "button",
  "root"
);

// Missing type exports - both types and components must be exported
// Type not exported!
```

> **Note**: The actual Button component in the codebase uses `ButtonRoot` instead of `ButtonSlot` as the component name. This is a historical naming convention. New components should follow the `{ComponentName}Slot` pattern for consistency.

## File Structure

### Standard Recipe Slots

For components with standard recipes:

```typescript
// button.slots.tsx
import {
  createRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { buttonRecipe } from "./button.recipe";

const { withContext } = createRecipeContext({
  recipe: buttonRecipe,
});

// CRITICAL: Export both type AND component
export type ButtonSlotProps = HTMLChakraProps<"button">;
export const ButtonSlot = withContext<HTMLButtonElement, ButtonSlotProps>(
  "button",
  "root"
);
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

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: menuSlotRecipe,
});

// Root slot - provides context
export type MenuRootSlotProps = HTMLChakraProps<"div">;
export const MenuRootSlot = withProvider<HTMLDivElement, MenuRootSlotProps>(
  "div",
  "root"
);

// Trigger slot - consumes context
export type MenuTriggerSlotProps = HTMLChakraProps<"button">;
export const MenuTriggerSlot = withContext<
  HTMLButtonElement,
  MenuTriggerSlotProps
>("button", "trigger");

// Content slot
export type MenuContentSlotProps = HTMLChakraProps<"div">;
export const MenuContentSlot = withContext<
  HTMLDivElement,
  MenuContentSlotProps
>("div", "content");

// Item slot
export type MenuItemSlotProps = HTMLChakraProps<"div">;
export const MenuItemSlot = withContext<HTMLDivElement, MenuItemSlotProps>(
  "div",
  "item"
);
```

## Context Patterns

### withProvider vs withContext

- **`withProvider`**: Used for the root slot, provides recipe context
- **`withContext`**: Used for child slots, consumes recipe context

```typescript
// Root provides context
export const ComponentRootSlot = withProvider<HTMLDivElement, RootProps>(
  "div",
  "root"
);

// Children consume context
export const ComponentChildSlot = withContext<HTMLSpanElement, ChildProps>(
  "span",
  "child"
);
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

export const Button = (props: ButtonProps) => {
  return (
    <ButtonSlot asChild>
      <RaButton {...props}>
        {props.children}
      </RaButton>
    </ButtonSlot>
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

Follow this pattern consistently:

| Slot Type   | Pattern                     | Example           |
| ----------- | --------------------------- | ----------------- |
| Single slot | `{ComponentName}Slot`       | `ButtonSlot`      |
| Root slot   | `{ComponentName}RootSlot`   | `MenuRootSlot`    |
| Child slot  | `{ComponentName}{Part}Slot` | `MenuTriggerSlot` |

### Type Names

| Type Purpose | Pattern                          | Example             |
| ------------ | -------------------------------- | ------------------- |
| Slot props   | `{SlotName}Props`                | `ButtonSlotProps`   |
| Root props   | `{ComponentName}RootSlotProps`   | `MenuRootSlotProps` |
| Child props  | `{ComponentName}{Part}SlotProps` | `MenuItemSlotProps` |

## Common Patterns from Nimbus

### Simple Slot (Button)

```typescript
// button.slots.tsx
import {
  createRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { buttonRecipe } from "./button.recipe";

const { withContext } = createRecipeContext({
  recipe: buttonRecipe,
});

export type ButtonSlotProps = HTMLChakraProps<"button">;
export const ButtonSlot = withContext<HTMLButtonElement, ButtonSlotProps>(
  "button",
  "root"
);
```

### Complex Slots (Select)

```typescript
// select.slots.tsx
const { withProvider, withContext } = createSlotRecipeContext({
  recipe: selectSlotRecipe,
});

// Multiple slot exports with types
export type SelectRootSlotProps = HTMLChakraProps<"div">;
export const SelectRootSlot = withProvider<HTMLDivElement, SelectRootSlotProps>(
  "div",
  "root"
);

export type SelectTriggerSlotProps = HTMLChakraProps<"button">;
export const SelectTriggerSlot = withContext<
  HTMLButtonElement,
  SelectTriggerSlotProps
>("button", "trigger");

export type SelectContentSlotProps = HTMLChakraProps<"div">;
export const SelectContentSlot = withContext<
  HTMLDivElement,
  SelectContentSlotProps
>("div", "content");
```

## Advanced Patterns

### Conditional Slot Usage

```typescript
// Component can optionally use slots
export const Component = ({ useSlot = true, ...props }) => {
  if (useSlot) {
    return (
      <ComponentSlot asChild>
        <RaComponent {...props} />
      </ComponentSlot>
    );
  }

  return <RaComponent {...props} />;
};
```

### Slot Composition

```typescript
// Composing multiple slot contexts
export const ComplexComponent = (props) => {
  return (
    <OuterSlot>
      <InnerSlot asChild>
        <RaComponent {...props} />
      </InnerSlot>
    </OuterSlot>
  );
};
```


## Debugging Slot Issues

### Common Problems

1. **No styles applied**: Check recipe registration
2. **Context not propagating**: Ensure withProvider is used on root
3. **TypeScript errors**: Verify types are exported
4. **asChild not working**: Check React Aria component compatibility

### DevTools Inspection

Check for CSS classes in browser DevTools:

- Should see `nimbus-{component}` class
- Should see variant classes like `nimbus-button--variant-solid`

## Related Guidelines

- [Recipes](./recipes.md) - Creating recipes for slots
- [Main Component](./main-component.md) - Using slots in components
- [Compound Components](./compound-components.md) - Multi-slot patterns

## Validation Checklist

- [ ] Slot file exists with `.tsx` extension
- [ ] **Both components AND types exported**
- [ ] Types use `HTMLChakraProps` or appropriate interface
- [ ] Naming follows `{ComponentName}Slot` pattern
- [ ] Type names follow `{ComponentName}SlotProps` pattern
- [ ] Root slot uses `withProvider`
- [ ] Child slots use `withContext`
- [ ] Recipe imported and used in context creation
- [ ] `asChild` pattern used with React Aria
- [ ] Slot names match recipe slot definitions

---

[← Back to Index](../component-guidelines.md) |
[Previous: Recipes](./recipes.md) |
[Next: Compound Components →](./compound-components.md)
