# Writing Slots: Patterns

## File Structure Patterns

### Pattern 1: Standard Recipe (Single Slot)

For components with `defineRecipe`:

```typescript
// button.slots.tsx
import {
  createRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { buttonRecipe } from "./button.recipe";
import type { SlotComponent } from "@/type-utils";

const { withContext } = createRecipeContext({
  recipe: buttonRecipe,
});

// Export both type and component with explicit return type annotation
export type ButtonRootProps = HTMLChakraProps<"button">;
export const ButtonRoot: SlotComponent<HTMLButtonElement, ButtonRootProps> =
  withContext<HTMLButtonElement, ButtonRootProps>("button", "root");
```

### Pattern 2: Slot Recipe (Multiple Slots)

For components with `defineSlotRecipe`:

```typescript
// menu.slots.tsx
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { menuSlotRecipe } from "./menu.recipe";
import type { SlotComponent } from "@/type-utils";

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

**`withProvider`:**

- Used for ROOT slot only
- Provides recipe context to children
- First slot in multi-slot components

**`withContext`:**

- Used for ALL child slots
- Consumes recipe context from provider
- Also used for single-slot components

```typescript
// Root provides context
export const ComponentRootSlot: SlotComponent<HTMLDivElement, RootProps> =
  withProvider<HTMLDivElement, RootProps>("div", "root");

// Children consume context
export const ComponentChildSlot: SlotComponent<HTMLSpanElement, ChildProps> =
  withContext<HTMLSpanElement, ChildProps>("span", "child");
```

### Context Propagation

Recipe context automatically flows through component tree:

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

Slot components use `asChild` prop to pass styles to React Aria components:

```typescript
// In component implementation
import { Button as RaButton } from 'react-aria-components';
import { ButtonRoot } from './button.slots';

export const Button = (props: ButtonProps) => {
  return (
    <ButtonRoot asChild>
      <RaButton {...props}>
        {props.children}
      </RaButton>
    </ButtonRoot>
  );
};
```

### Multiple Slots with React Aria

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
// Includes all style props: backgroundColor, padding, margin, etc.
```

### Element Type Mapping

| HTML Element | Type Parameter | Element Type        |
| ------------ | -------------- | ------------------- |
| `<button>`   | `"button"`     | `HTMLButtonElement` |
| `<div>`      | `"div"`        | `HTMLDivElement`    |
| `<input>`    | `"input"`      | `HTMLInputElement`  |
| `<span>`     | `"span"`       | `HTMLSpanElement`   |
| `<a>`        | `"a"`          | `HTMLAnchorElement` |

### Type Examples

```typescript
// Button element
export type ButtonRootProps = HTMLChakraProps<"button">;
export const ButtonRoot: SlotComponent<HTMLButtonElement, ButtonRootProps> =
  withContext<HTMLButtonElement, ButtonRootProps>("button", "root");

// Div element
export type MenuContentSlotProps = HTMLChakraProps<"div">;
export const MenuContentSlot: SlotComponent<
  HTMLDivElement,
  MenuContentSlotProps
> = withContext<HTMLDivElement, MenuContentSlotProps>("div", "content");

// Input element
export type TextInputInputSlotProps = HTMLChakraProps<"input">;
export const TextInputInputSlot: SlotComponent<
  HTMLInputElement,
  TextInputInputSlotProps
> = withContext<HTMLInputElement, TextInputInputSlotProps>("input", "input");
```
