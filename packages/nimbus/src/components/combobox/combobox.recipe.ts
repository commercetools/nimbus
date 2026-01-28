import { defineSlotRecipe } from "@chakra-ui/react/styled-system";
import { checkboxSlotRecipe } from "../checkbox/checkbox.recipe";

/**
 * Recipe configuration for the Combobox component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const comboBoxSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "trigger",
    "leadingElement",
    "content",
    "tagGroup",
    "input",
    "popover",
    "listBox",
    "section",
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
      display: "inline-flex",
      position: "relative",
      alignSelf: "flex-start",
      maxWidth: "100%",
      borderRadius: "200",
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
      "& [data-placeholder]": {
        opacity: 0.5,
      },
    },
    leadingElement: {
      gridArea: "leadingElement",
      display: "contents",
      alignItems: "center",
      justifyContent: "center",
      color: "neutral.11",
      "& svg": {
        minH: "600",
        minW: "600",
        pr: "100",
      },
    },
    trigger: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto auto",
      gridTemplateAreas: '"leadingElement content clear toggle"',
      alignItems: "center",
      gap: "100",
      width: "100%",
      focusRing: "outside",
      px: "300",
      py: "100",
      borderRadius: "200",
      color: "neutral.12",
      textAlign: "left",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",

      _focusWithin: {
        layerStyle: "focusRing",
      },
      _disabled: { pointerEvents: "none" },
      '[data-invalid="true"] &': {
        "--border-width": "sizes.50",
        "--border-color": "colors.critical.7",
        color: "critical.11",
      },
      '& button[slot="toggle"]': {
        gridArea: "toggle",
        alignSelf: "center",
      },
      '& button[slot="clear"]': {
        gridArea: "clear",
        alignSelf: "center",
        mr: "-100",
        _expanded: {
          bg: "colorPalette.3",
        },
      },
    },
    content: {
      gridArea: "content",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "100",
      minWidth: 0,
      cursor: "text",
      "[data-disabled='true'] &": {
        pointerEvents: "none",
      },
    },
    tagGroup: {
      display: "contents",
    },
    input: {
      flex: "0 0 auto",
      minWidth: "0",
      maxWidth: "100%",
      border: "none",
      outline: "none",
      bg: "transparent",
      padding: 0,

      // If the value & placeholder are falsy, input width should be 1px
      // so it doesn't cause a blank line in content box
      '&[data-empty="true"]': {
        width: "25",
      },
      _hover: {
        bg: "primary.2",
      },
      _placeholder: { opacity: 0.5 },
    },
    popover: {
      bg: "bg",
      borderRadius: "200",
      boxShadow: "5",
      minWidth: "var(--nimbus-combobox-trigger-width)",
      overflow: "hidden",
      padding: 0,
    },
    listBox: {
      "--scrollbar-color": "colors.neutral.8",
      "--scrollbar-bg": "colors.neutral.3",
      gap: "100",
      padding: "200",
      focusRing: "outside",

      maxH: "40svh",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "var(--scrollbar-color) var(--scrollbar-bg)",
    },
    section: {
      textStyle: "xs",
      color: "neutral.11",
      fontWeight: "600",
      lineHeight: "350",
      letterSpacing: "25",
      textTransform: "uppercase",
      p: "200",
      borderBottom: "solid-25",
      borderColor: "neutral.3",
      mx: "-200",
      mt: "200",
      mb: "300",
    },
    option: {
      focusRing: "outside",
      cursor: "pointer",
      color: "neutral.12",
      textStyle: "sm",
      padding: "200",
      borderRadius: "200",
      whiteSpace: "wrap",
      overflow: "hidden",
      textOverflow: "ellipsis",

      '&[aria-selected="true"]': {
        bg: "primary.3",
      },
      '&[data-focused="true"]': {
        bg: "primary.2",
      },
      "&:hover:not([data-disabled='true'])": {
        bg: "primary.2",
      },
      '& [slot="label"]': {
        display: "block",
      },

      '& [slot="description"]': {
        display: "block",
        color: "neutral.11",
        textStyle: "xs",
      },

      "&[data-disabled='true']": {
        layerStyle: "disabled",
      },
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
        trigger: {
          minH: "800",
          textStyle: "sm",
        },
        leadingElement: {
          minH: "800",
        },
      },
      // Medium
      md: {
        trigger: {
          minH: "1000",
          textStyle: "md",
        },
        leadingElement: {
          minH: "1000",
        },
      },
    },
    // Visual style variants
    variant: {
      solid: {
        root: {
          bg: "primary.1",
          "&:hover:not([data-disabled='true'])": {
            bg: "primary.2",
          },
          width: "7200",
        },
        trigger: {
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7",

          width: "100%",
        },
      },
      ghost: {
        root: {
          bg: "transparent",
          "&:hover:not([data-disabled='true'])": {
            bg: "primaryAlpha.2",
          },
          width: "7200",
        },
        trigger: {
          "--border-width": "sizes.25",
          "--border-color": "transparent",
          bg: "transparent",
          width: "100%",
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
        listBox: {
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
        trigger: {
          flex: "1 1 auto",
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
