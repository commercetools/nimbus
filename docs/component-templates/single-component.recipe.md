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
    fontSize: "400",
    fontWeight: "500",

    // Colors
    color: "fg",
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
      backgroundColor: "neutral.2",
    },

    _focus: {
      outline: "2px solid",
      outlineColor: "primary.9",
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
        backgroundColor: "primary.9",
        color: "primary.contrast",
        borderColor: "primary.9",

        _hover: {
          backgroundColor: "primary.10",
          borderColor: "primary.10",
        },

        _active: {
          backgroundColor: "primary.11",
          borderColor: "primary.11",
        },
      },
      secondary: {
        borderColor: "neutral.6",
        color: "fg",

        _hover: {
          backgroundColor: "neutral.3",
          borderColor: "neutral.7",
        },
      },
      ghost: {
        color: "primary.11",
        borderColor: "transparent",

        _hover: {
          backgroundColor: "primary.2",
        },
      },
    },
    size: {
      sm: {
        height: "8",
        paddingX: "300",
        fontSize: "350",
        gap: "100",
      },
      md: {
        height: "10",
        paddingX: "400",
        fontSize: "400",
        gap: "200",
      },
      lg: {
        height: "12",
        paddingX: "500",
        fontSize: "450",
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
