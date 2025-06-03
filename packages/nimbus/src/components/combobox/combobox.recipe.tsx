import { defineSlotRecipe } from "@chakra-ui/react";
import { selectSlotRecipe } from "../select/select.recipe";

/**
 * Recipe configuration for the Combobox component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const comboBoxSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "value",
    "buttonGroup",
    "multiSelectInput",
    "options",
    "optionGroup",
    "option",
  ],
  // Unique class name prefix for the component
  className: "nimbus-combobox",

  // Base styles applied to all instances of the component
  base: {
    root: {
      colorPalette: "primary",
      focusRing: "outside",
      display: "inline-block",
      position: "relative",
      maxWidth: "100%",
      borderRadius: "200",
      "&[data-disabled]": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },
      "& input": { cursor: "text" },
      "& [data-placeholder]": {
        opacity: 0.5,
      },
    },
    value: {
      display: "inline-flex",
      focusRing: "outside",
      alignItems: "flex-start",
      borderRadius: "200",
      color: "neutral.12",
      width: "100%",
      textAlign: "left",
      maxWidth: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
      "& span": {
        display: "inline-block",
        my: "auto",
      },
      '& [slot="description"]': {
        display: "none",
      },

      "[data-invalid] &": {
        "--border-width": "sizes.50",
        "--border-color": "colors.critical.7",
      },
    },
    buttonGroup: {
      position: "absolute",
      display: "inline-flex",
      top: 0,
      bottom: 0,
      right: 300,
    },
    multiSelectInput: {
      px: 200,
      py: "100",
      "& input": {
        focusRing: "none",
        borderBottom: "solid 1px",
        borderBottomColor: "neutral.9",
        bg: "bg",
        _placeholder: { opacity: 0.5 },
      },
    },
    options: {
      ...selectSlotRecipe.base?.options,
      borderRadius: "0 0 200 200",
      boxShadow: "none",
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
    selectionMode: {
      multiple: {
        option: {
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7",
          '&[data-focused="true"], &:hover': {
            boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
          },
          '&[aria-selected="true"], &[data-focused="true"]': {
            bg: "inherit",
          },
        },
      },
      single: {},
      none: {},
    },
  },
  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
