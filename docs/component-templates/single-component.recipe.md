# Single Component Recipe Template

Template for standard recipe (single element). Replace: ComponentName,
component-name, componentName

```typescript
/**
 * Template for standard recipe (single element)
 * Replace: ComponentName, component-name, componentName
 */

import { defineRecipe } from "@chakra-ui/react/styled-system";

export const componentNameRecipe = defineRecipe({
  className: "nimbus-component-name",
  base: {
    // Display & Layout
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    // Spacing (use design tokens)
    padding: "200",
    gap: "200",

    // Typography
    fontSize: "md",
    fontWeight: "medium",

    // Colors
    color: "text.primary",
    backgroundColor: "transparent",

    // Borders & Radius
    borderRadius: "200",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",

    // Transitions
    transitionProperty: "colors",
    transitionDuration: "fast",

    // Cursor
    cursor: "pointer",

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
      pointerEvents: "none",
    },

    _active: {
      transform: "scale(0.98)",
    },
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: "primary.500",
        color: "white",
        borderColor: "primary.500",

        _hover: {
          backgroundColor: "primary.600",
          borderColor: "primary.600",
        },

        _active: {
          backgroundColor: "primary.700",
          borderColor: "primary.700",
        },
      },
      secondary: {
        borderColor: "gray.300",
        color: "text.primary",

        _hover: {
          backgroundColor: "gray.100",
          borderColor: "gray.400",
        },
      },
      ghost: {
        color: "primary.500",
        borderColor: "transparent",

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
        gap: "100",
      },
      md: {
        height: "10",
        paddingX: "400",
        fontSize: "md",
        gap: "200",
      },
      lg: {
        height: "12",
        paddingX: "500",
        fontSize: "lg",
        gap: "300",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

// IMPORTANT: Remember to register this recipe in:
// packages/nimbus/src/theme/recipes/index.ts
// export { componentNameRecipe } from '../../components/component-name/component-name.recipe';
```
