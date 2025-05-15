import { defineSlotRecipe } from "@chakra-ui/react";
import { selectSlotRecipe } from "../select/select.recipe";

/**
 * Recipe configuration for the Combobox component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const comboBoxSlotRecipe = defineSlotRecipe({
  slots: ["root", "value", "buttonGroup", "options", "optionGroup", "option"],
  // Unique class name prefix for the component
  className: "nimbus-combobox",

  // Base styles applied to all instances of the component
  base: {
    root: {
      ...selectSlotRecipe.base?.root,

      "& input": { cursor: "text" },
    },
    value: {
      ...selectSlotRecipe.base?.trigger,
      ...selectSlotRecipe.base?.triggerLabel,
    },
    buttonGroup: {
      position: "absolute",
      display: "inline-flex",
      top: 0,
      bottom: 0,
      right: 400,
    },
    options: {
      ...selectSlotRecipe.base?.options,
    },
    optionGroup: {
      ...selectSlotRecipe.base?.optionGroup,
    },
    option: {
      ...selectSlotRecipe.base?.option,
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      sm: {
        value: {
          ...selectSlotRecipe.variants?.size.sm.trigger,
          paddingRight: "1600",
        },
      }, // Small
      md: {
        value: {
          ...selectSlotRecipe.variants?.size.md.trigger,
          paddingRight: "1600",
        },
      }, // Medium
    },

    // Visual style variants
    variant: {
      solid: {
        root: {
          ...selectSlotRecipe.variants?.variant.outline.root,
        },
        value: {
          ...selectSlotRecipe.variants?.variant.outline.trigger,
        },
      },
      ghost: {
        root: {
          ...selectSlotRecipe.variants?.variant.ghost.root,
        },
        value: { ...selectSlotRecipe.variants?.variant.ghost.trigger },
      },
    },
  },
  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
