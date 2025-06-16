import { defineSlotRecipe } from "@chakra-ui/react";
import { selectSlotRecipe } from "../select/select.recipe";
import { checkboxSlotRecipe } from "../checkbox/checkbox.recipe";

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
    "optionIndicator",
    "optionContent",
  ],
  // Unique class name prefix for the component
  className: "nimbus-combobox",

  // Base styles applied to all instances of the component
  base: {
    root: {
      colorPalette: "primary",
      focusRing: "outside",
      display: "inline-flex",
      position: "relative",
      alignSelf: "flex-start",
      maxWidth: "100%",
      borderRadius: "200",
      "&[data-disabled]": {
        layerStyle: "disabled",
        focusRing: "none",
      },
      "& input": {
        cursor: "text",
        _placeholder: { opacity: 0.5 },
      },
      "& [data-placeholder]": {
        opacity: 0.5,
      },
    },
    value: {
      display: "flex",
      focusRing: "outside",
      alignItems: "flex-start",
      paddingRight: "1600!",
      borderRadius: "200",
      color: "neutral.12",
      maxWidth: "100%",
      textAlign: "left",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
      _disabled: { pointerEvents: "none" },
      '[data-invalid="true"] &': {
        "--border-width": "sizes.50",
        "--border-color": "colors.critical.7",
      },
      '& button[slot="remove"]': {
        _expanded: {
          bg: "colorPalette.3",
        },
      },
    },
    buttonGroup: {
      position: "absolute",
      display: "inline-flex",
      top: 0,
      bottom: 0,
      right: 300,
      my: "auto",
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
        bg: "transparent",
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
      whiteSpace: "wrap",
    },
    optionIndicator: {
      ...checkboxSlotRecipe.base?.indicator,
      ...checkboxSlotRecipe.variants?.size.md.indicator,
    },
    optionContent: {
      ...checkboxSlotRecipe.base?.label,
      ...checkboxSlotRecipe.variants?.size.md.label,
      whiteSpace: "wrap",
      width: "calc(100% - var(--nimbus-sizes-600))",
      display: "inline-block",
    },
  },

  // Available variants for customizing the component's appearance
  variants: {
    // Size variants from smallest to largest
    size: {
      // Small
      sm: {
        value: {
          minH: "800",
          py: "100",
          px: "400",
          textStyle: "sm",
        },
      },
      // Medium
      md: {
        value: {
          minH: "1000",
          px: "400",
          py: "100",
          textStyle: "md",
        },
      },
    },

    // Visual style variants
    variant: {
      solid: {
        root: {
          width: "7200",
        },
        value: {
          ...selectSlotRecipe.variants?.variant.outline.trigger,
          bg: "primary.1",
          width: "100%",
        },
      },
      ghost: {
        root: {
          ...selectSlotRecipe.variants?.variant.ghost.root,
          maxW: "7200",
        },

        value: {
          ...selectSlotRecipe.variants?.variant.ghost.trigger,
          bg: "transparent",
        },
      },
    },
    selectionMode: {
      multiple: {
        options: {
          borderRadius: "0 ",
          boxShadow: "none",
          px: "200",
          py: 0,
          my: "200",
          minW: "unset",
        },
        option: {
          colorPalette: "primary",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7",
          cursor: "pointer",
          gap: "200",

          "&:hover": {
            bg: "primary.4",
          },
          '&[data-focused="true"]': {
            boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
          },
          '&[aria-selected="true"], &[data-focused="true"]': {
            bg: "inherit",
          },
          "& label": {
            width: "100%",
            '& span[data-slot="label"]': {
              whiteSpace: "wrap",
              width: "calc(100% - var(--nimbus-sizes-600))",
              display: "inline-block",
            },
          },
        },
      },
      single: {},
      none: {},
    },
  },
  compoundVariants: [
    {
      variant: "solid",
      selectionMode: "multiple",
      css: {
        popover: {
          width: "var(--trigger-width)",
        },
      },
    },
    {
      variant: "solid",
      selectionMode: "single",
      css: {
        options: {
          width: "var(--trigger-width)",
        },
      },
    },
    {
      variant: "ghost",
      selectionMode: "multiple",
      css: {
        popover: {
          minW: "max(var(--trigger-width), var(--nimbus-sizes-2000))",
          maxW: "max(var(--trigger-width), var(--nimbus-sizes-7200))",
        },
      },
    },
    {
      variant: "ghost",
      selectionMode: "single",
      css: {
        value: {
          flex: "1 1 auto",
        },
        options: {
          minW: "max(var(--trigger-width), var(--nimbus-sizes-2000))",
          maxW: "max(var(--trigger-width), var(--nimbus-sizes-7200))",
        },
      },
    },
  ],
  // Default variant values when not explicitly specified
  defaultVariants: {
    size: "md",
    variant: "solid",
    selectionMode: "single",
  },
});
