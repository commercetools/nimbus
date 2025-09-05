# Compound Component Recipe Template

Template for slot recipe (compound components with multiple slots). Replace:
ComponentName, component-name, componentName

```typescript
/**
 * Template for slot recipe (compound components with multiple slots)
 * Replace: ComponentName, component-name, componentName
 */

import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const componentNameSlotRecipe = defineSlotRecipe({
  slots: ["root", "trigger", "content", "item"], // Add/remove slots as needed
  className: "nimbus-component-name",
  base: {
    root: {
      // Root container styles
      position: "relative",
      display: "inline-block",
    },
    trigger: {
      // Trigger button styles
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",

      // Spacing
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
      borderColor: "gray.300",

      // Transitions
      transitionProperty: "colors, box-shadow",
      transitionDuration: "fast",

      // Cursor
      cursor: "pointer",

      // States
      _hover: {
        backgroundColor: "gray.50",
        borderColor: "gray.400",
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
        backgroundColor: "gray.100",
      },

      // Aria states
      _expanded: {
        backgroundColor: "gray.100",
      },
    },
    content: {
      // Content/dropdown styles
      position: "absolute",
      top: "100%",
      left: 0,
      zIndex: "dropdown",

      // Layout
      minWidth: "200px",

      // Colors
      backgroundColor: "white",

      // Borders & Radius
      borderRadius: "300",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "gray.200",

      // Shadow
      boxShadow: "lg",

      // Spacing
      padding: "100",
      gap: "50",

      // Animation
      opacity: 0,
      transform: "translateY(-8px)",
      transitionProperty: "opacity, transform",
      transitionDuration: "fast",

      // Visible state
      _open: {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
    item: {
      // Individual item styles
      display: "flex",
      alignItems: "center",

      // Spacing
      padding: "200",
      gap: "200",

      // Typography
      fontSize: "sm",

      // Colors
      color: "text.primary",

      // Borders & Radius
      borderRadius: "200",

      // Cursor
      cursor: "pointer",

      // States
      _hover: {
        backgroundColor: "gray.50",
      },

      _focus: {
        backgroundColor: "primary.50",
        outline: "none",
      },

      _selected: {
        backgroundColor: "primary.100",
        color: "primary.700",
      },

      _disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
        pointerEvents: "none",
      },
    },
  },
  variants: {
    variant: {
      outline: {
        trigger: {
          borderColor: "gray.300",
          _hover: {
            borderColor: "gray.400",
          },
        },
      },
      filled: {
        trigger: {
          backgroundColor: "gray.100",
          borderColor: "transparent",
          _hover: {
            backgroundColor: "gray.200",
          },
        },
      },
      ghost: {
        trigger: {
          borderColor: "transparent",
          _hover: {
            backgroundColor: "gray.100",
          },
        },
      },
    },
    size: {
      sm: {
        trigger: {
          height: "8",
          paddingX: "300",
          fontSize: "sm",
          gap: "100",
        },
        content: {
          minWidth: "160px",
        },
        item: {
          paddingX: "200",
          paddingY: "100",
          fontSize: "xs",
        },
      },
      md: {
        trigger: {
          height: "10",
          paddingX: "400",
          fontSize: "md",
          gap: "200",
        },
        content: {
          minWidth: "200px",
        },
        item: {
          paddingX: "200",
          paddingY: "150",
          fontSize: "sm",
        },
      },
      lg: {
        trigger: {
          height: "12",
          paddingX: "500",
          fontSize: "lg",
          gap: "300",
        },
        content: {
          minWidth: "240px",
        },
        item: {
          paddingX: "300",
          paddingY: "200",
          fontSize: "md",
        },
      },
    },
  },
  defaultVariants: {
    variant: "outline",
    size: "md",
  },
});

// IMPORTANT: Remember to register this slot recipe in:
// packages/nimbus/src/theme/slot-recipes/index.ts
// export { componentNameSlotRecipe } from '../../components/component-name/component-name.recipe';
```

## Implementation Guidelines

When creating slot recipes, consider the component's structure and identify all
visual elements that need styling. Define slots for each distinct element and
provide comprehensive base styles, variants, and interactive states. Refer to
existing slot recipes in the codebase for concrete examples and patterns.

## Key Requirements

1. **Slot Definition**: Define all slots used by the component in the `slots`
   array
2. **Slot Recipe Registration**: Must register in `theme/slot-recipes/index.ts`
   (not regular recipes)
3. **Base Styles**: Provide base styles for each slot in the `base` object
4. **Variant Support**: Use variants to create different visual appearances
   across all slots
5. **Size Support**: Use size variants to create different scale versions
6. **State Styles**: Include interactive states (\_hover, \_focus, \_disabled,
   etc.)
7. **Responsive Design**: Use design tokens for consistent spacing, colors, and
   typography
8. **Accessibility**: Include ARIA state styles (\_expanded, \_selected, etc.)
