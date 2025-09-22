# Recipe Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Documentation](./documentation.md) | [Next: Slots →](./slots.md)

## Purpose

Recipe files (`{component-name}.recipe.ts`) define component styling variants,
sizes, and visual states using Chakra UI's recipe system. They enable
consistent, theme-aware styling across components.

## When to Use

### Create a Recipe When:

- Component needs **new visual styling** (custom CSS)
- Component has **variants** (solid, outline, ghost)
- Component has **sizes** (sm, md, lg)
- Component needs **state-based styles** (hover, focus, disabled)
- Building a **primitive component** others will use

## Recipe Types

### Standard Recipe (Single Element)

For components with a single styled element:

```typescript
// button.recipe.ts
import { defineRecipe } from "@chakra-ui/react/styled-system";

export const buttonRecipe = defineRecipe({
  className: "nimbus-button",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "medium",
    borderRadius: "200",
    transitionProperty: "colors",
    transitionDuration: "fast",
    cursor: "pointer",

    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  variants: {
    variant: {
      solid: {
        backgroundColor: "primary.500",
        color: "white",
        _hover: {
          backgroundColor: "primary.600",
        },
      },
      outline: {
        borderWidth: "1px",
        borderColor: "primary.500",
        color: "primary.500",
        _hover: {
          backgroundColor: "primary.50",
        },
      },
      ghost: {
        color: "primary.500",
        _hover: {
          backgroundColor: "primary.50",
        },
      },
    },
    size: {
      sm: {
        height: "8",
        paddingX: "300",
        fontSize: "sm",
      },
      md: {
        height: "10",
        paddingX: "400",
        fontSize: "md",
      },
      lg: {
        height: "12",
        paddingX: "500",
        fontSize: "lg",
      },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
```

### Slot Recipe (Multiple Elements)

For components with multiple styled parts:

```typescript
// menu.recipe.tsx
import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const menuSlotRecipe = defineSlotRecipe({
  slots: ["root", "trigger", "content", "item", "separator"],
  className: "nimbus-menu",
  base: {
    root: {
      position: "relative",
    },
    trigger: {
      display: "inline-flex",
      alignItems: "center",
      gap: "200",
      cursor: "pointer",
    },
    content: {
      backgroundColor: "white",
      borderRadius: "200",
      boxShadow: "lg",
      padding: "200",
      minWidth: "200px",
      _dark: {
        backgroundColor: "gray.800",
      },
    },
    item: {
      padding: "200 300",
      borderRadius: "100",
      cursor: "pointer",
      _hover: {
        backgroundColor: "gray.100",
      },
      _disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
    separator: {
      height: "1px",
      backgroundColor: "gray.200",
      marginY: "100",
    },
  },
  variants: {
    size: {
      sm: {
        trigger: {
          fontSize: "sm",
          height: "8",
        },
        item: {
          fontSize: "sm",
        },
      },
      md: {
        trigger: {
          fontSize: "md",
          height: "10",
        },
        item: {
          fontSize: "md",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
```

## Recipe Structure

### Base Styles

Always define base styles that apply regardless of variants:

```typescript
base: {
  // Layout
  display: "flex",
  alignItems: "center",

  // Spacing (use design tokens)
  padding: "400",
  gap: "200",

  // Typography
  fontSize: "md",
  fontWeight: "medium",

  // Colors
  color: "text.primary",
  backgroundColor: "background",

  // Borders
  borderRadius: "200",
  borderWidth: "1px",

  // Transitions
  transitionProperty: "colors",
  transitionDuration: "fast",

  // States
  _hover: {
    backgroundColor: "gray.50",
  },
  _focus: {
    outline: "2px solid",
    outlineColor: "primary.500",
    outlineOffset: "2px",
  },
  _disabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
}
```

### Variants

Define visual variations:

```typescript
variants: {
  variant: {
    primary: { /* styles */ },
    secondary: { /* styles */ },
    danger: { /* styles */ },
  },
  size: {
    sm: { /* styles */ },
    md: { /* styles */ },
    lg: { /* styles */ },
  },
  // Can have multiple variant categories
  appearance: {
    rounded: { borderRadius: "full" },
    square: { borderRadius: "0" },
  },
}
```

### Default Variants

Always specify defaults:

```typescript
defaultVariants: {
  variant: "primary",
  size: "md",
  appearance: "rounded",
}
```

## Design Token Usage

### Use Semantic Tokens

```typescript
// ✅ Good - uses design tokens
base: {
  padding: "400",           // Spacing token
  fontSize: "md",          // Typography token
  color: "text.primary",   // Semantic color
  borderRadius: "200",     // Radius token
}

```

### Token Categories

- **Spacing**: `100`, `200`, `300`, `400`, `500`
- **Colors**: `primary.500`, `gray.100`, `text.primary`
- **Typography**: `sm`, `md`, `lg`, `fontSize.heading`
- **Radii**: `100`, `200`, `300`, `full`
- **Shadows**: `sm`, `md`, `lg`, `xl`
- **Transitions**: `fast`, `normal`, `slow`

## State Modifiers

### CSS Pseudo Selectors

```typescript
base: {
  // Hover state
  _hover: {
    backgroundColor: "gray.50",
    transform: "translateY(-1px)",
  },

  // Focus state
  _focus: {
    outline: "2px solid",
    outlineColor: "primary.500",
  },

  // Active state
  _active: {
    transform: "scale(0.98)",
  },

  // Disabled state
  _disabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    pointerEvents: "none",
  },

  // Focus visible (keyboard focus)
  _focusVisible: {
    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
  },
}
```

### Data Attributes

```typescript
base: {
  // Custom data attributes
  _data-[state=open]: {
    backgroundColor: "primary.50",
  },

  _data-[orientation=horizontal]: {
    flexDirection: "row",
  },
}
```

## Registration (CRITICAL)

### Recipe Registration is REQUIRED

Recipes must be registered in the theme configuration or they won't work:

#### Standard Recipes

```typescript
// packages/nimbus/src/theme/recipes/index.ts
export { buttonRecipe } from "../../components/button/button.recipe";
export { badgeRecipe } from "../../components/badge/badge.recipe";
// ... other standard recipes
```

#### Slot Recipes

```typescript
// packages/nimbus/src/theme/slot-recipes/index.ts
export { menuSlotRecipe } from "../../components/menu/menu.recipe";
export { selectSlotRecipe } from "../../components/select/select.recipe";
// ... other slot recipes
```

### Registration Validation

**WARNING**: No automated validation exists!

- Missing registration = no styles applied
- Component renders unstyled
- Check browser DevTools for missing CSS classes

## Compound Variants

For complex style combinations:

```typescript
export const buttonRecipe = defineRecipe({
  // ... base and variants

  compoundVariants: [
    {
      variant: "solid",
      size: "sm",
      css: {
        // Specific styles for solid + small
        borderRadius: "100",
      },
    },
    {
      variant: ["outline", "ghost"],
      size: "lg",
      css: {
        // Styles for (outline OR ghost) + large
        fontWeight: "semibold",
      },
    },
  ],
});
```

## Common Patterns from Nimbus

### Button (Standard Recipe)

```typescript
export const buttonRecipe = defineRecipe({
  className: "nimbus-button",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "200",
    fontWeight: "medium",
    borderRadius: "200",
    transitionProperty: "colors",
    transitionDuration: "fast",
  },
  variants: {
    variant: {
      solid: {
        /* ... */
      },
      outline: {
        /* ... */
      },
      ghost: {
        /* ... */
      },
    },
    size: {
      sm: { height: "8", paddingX: "300", fontSize: "sm" },
      md: { height: "10", paddingX: "400", fontSize: "md" },
      lg: { height: "12", paddingX: "500", fontSize: "lg" },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
```

### Menu (Slot Recipe)

```typescript
export const menuSlotRecipe = defineSlotRecipe({
  slots: ["root", "trigger", "content", "item"],
  className: "nimbus-menu",
  base: {
    root: { position: "relative" },
    trigger: { cursor: "pointer" },
    content: {
      backgroundColor: "white",
      boxShadow: "lg",
    },
    item: {
      padding: "200 300",
      _hover: { backgroundColor: "gray.50" },
    },
  },
  // ... variants
});
```

## Related Guidelines

- [Slots](./slots.md) - Creating slot components
- [Main Component](./main-component.md) - Using recipes in components
- [Types](./types.md) - Recipe variant types

## Validation Checklist

- [ ] Recipe file exists with `.ts` or `.tsx` extension
- [ ] Correct recipe type (standard vs slot)
- [ ] `className` with "nimbus-" prefix
- [ ] Base styles defined
- [ ] Variants defined (if applicable)
- [ ] Default variants specified
- [ ] Design tokens used (not hardcoded values)
- [ ] **Recipe registered in theme configuration**
- [ ] State modifiers properly defined
- [ ] Dark mode styles included (if needed)
- [ ] Responsive styles (if needed)

---

[← Back to Index](../component-guidelines.md) |
[Previous: Documentation](./documentation.md) | [Next: Slots →](./slots.md)
