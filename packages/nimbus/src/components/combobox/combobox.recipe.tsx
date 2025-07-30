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
      _hover: {
        bg: "primary.2",
      },
      "&[data-disabled='true']": {
        layerStyle: "disabled",
        focusRing: "none",
        bg: "neutral.3",
        "& input, & button": {
          // if you set 'pointer-events: none' on an element, it does not display a cursor,
          // so in order to display `cursor: not-allowed`, we must set pointerEvents: none on the interactive children
          pointerEvents: "none!",
        },
      },
      "& input": {
        cursor: "text",
        _hover: {
          bg: "primary.2",
        },
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
      pr: "1600",
      pl: "400",
      py: "100",
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
        color: "critical.11",
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
    },
    multiSelectInput: {
      "& input": {
        py: "300",
        px: "400",
        focusRing: "none",
        borderBottom: "solid 1px",
        borderBottomColor: "neutral.3",
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
      gap: "100",
    },
    optionGroup: {
      ...selectSlotRecipe.base?.optionGroup,
    },
    option: {
      ...selectSlotRecipe.base?.option,
      whiteSpace: "wrap",
    },
    optionIndicator: {
      // make sure option is aligned with the first line of text (using lh units)
      height: "max(1lh, {sizes.600})",
      width: "max(1lh, {sizes.600})",
      display: "flex",
      alignItems: "center",
      "& span[data-selected]": {
        ...checkboxSlotRecipe.base?.indicator,
        ...checkboxSlotRecipe.variants?.size.md.indicator,
      },
    },
    optionContent: {
      ...checkboxSlotRecipe.base?.label,
      whiteSpace: "wrap",
      width: "calc(100% - {sizes.600})",
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
          textStyle: "sm",
        },
      },
      // Medium
      md: {
        value: {
          minH: "1000",
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
          boxShadow: "none",
          px: "200",
          my: "200",
          minW: "unset",
          "& section:first-of-type > header": {
            mt: 0,
          },
        },
        option: {
          colorPalette: "primary",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          position: "relative",
          cursor: "pointer",
          gap: "200",
          mb: "var(--focus-ring-width)",
          "&:last-of-type": {
            mb: 0,
          },
          '&[aria-selected="true"]': {
            bg: "unset",
          },
          '&[data-focused="true"]': {
            // TODO: can't use focusRing prop, find other solution (helper, util, etc.)
            outlineWidth: "var(--focus-ring-width)",
            outlineColor: "var(--focus-ring-color)",
            outlineStyle: "var(--focus-ring-style)",
            bg: "unset",
          },
          _hover: {
            bg: "primary.2",
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
        root: {
          "&:has(button:hover)": {
            "& input": {
              bg: "primary.2",
            },
          },
        },
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
          minW: "max(var(--trigger-width), {sizes.2000})",
          maxW: "max(var(--trigger-width), {sizes.7200})",
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
          minW: "max(var(--trigger-width), {sizes.2000})",
          maxW: "max(var(--trigger-width), {sizes.7200})",
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
