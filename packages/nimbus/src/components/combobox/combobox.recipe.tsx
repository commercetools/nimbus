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
    "popover",
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
      display: "block",
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
      display: "flex",
      focusRing: "outside",
      alignItems: "flex-start",
      paddingRight: "1500 !important",
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
    popover: {
      bg: "bg",
      borderRadius: "200",
      boxShadow: "5",
      padding: "200",
    },
    multiSelectInput: {
      "& input": {
        py: "200",
        px: "200",
        focusRing: "none",
        borderBottom: "solid 1px",
        borderBottomColor: "neutral.6",
        bg: "bg",
        w: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "350",
        fontWeight: "400",
        lineHeight: "400",
        _placeholder: { opacity: 0.5 },
      },
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
          minH: "800",
          py: "100",
          px: "400",
          textStyle: "sm",
        },
      }, // Small
      md: {
        value: {
          minH: "1000",
          px: "400",
          py: "100",
          textStyle: "md",
        },
      }, // Medium
    },

    // Visual style variants
    variant: {
      solid: {
        root: {
          width: "7200",
        },
        popover: {
          width: "7200",
        },
        value: {
          ...selectSlotRecipe.variants?.variant.outline.trigger,
        },
      },
      ghost: {
        root: {
          ...selectSlotRecipe.variants?.variant.ghost.root,
          maxW: "7200",
        },
        popover: { minW: "1800", maxW: "7200" },
        value: { ...selectSlotRecipe.variants?.variant.ghost.trigger },
      },
    },
    selectionMode: {
      multiple: {
        options: {
          borderRadius: "0 0 200 200",
          boxShadow: "none",
        },
        option: {
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7",
          cursor: "pointer",
          "&:hover": {
            bg: "primary.4",
          },
          '&[data-focused="true"]': {
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
