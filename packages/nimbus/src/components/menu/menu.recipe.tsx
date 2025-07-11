import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Menu component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const menuSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "trigger",
    "content",
    "item",
    "itemLabel",
    "itemDescription",
    "itemKeyboard",
    "itemIcon",
    "separator",
    "group",
    "groupLabel",
    "submenu",
  ],
  // Unique class name prefix for the component
  className: "nimbus-menu",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-block",
      position: "relative",
    },
    trigger: {
      focusRing: "outside",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "neutral.1",
      borderRadius: "300",
      border: "solid-25",
      borderColor: "neutral.6",
      boxShadow: "lg",
      minWidth: "200px",
      maxHeight: "400px",
      overflowY: "auto",
      p: "200",
      zIndex: "dropdown",
      position: "relative",

      // Focus styles for keyboard navigation
      "&:focus": {
        outline: "none",
      },
    },
    item: {
      display: "grid",
      /*
       * Define a 4-column grid:
       * 1. icon      – size to its content (usually 0 when no icon)
       * 2. label/description – takes up all remaining space
       * 3. keyboard  – size to its content (or 0 when missing)
       * 4. flyout    – size to its content (or 0 when missing)
       *
       * Using `1fr` for the second column ensures that, when columns 3 or 4
       * are absent for a particular row, the label/description column expands
       * to fill the available width instead of leaving empty reserved space.
       */
      gridTemplateColumns: "auto 1fr auto auto",
      gridTemplateAreas: `
        'icon label keyboard flyoutCaret'
        'icon description keyboard flyoutCaret'`,
      flexDirection: "column",
      alignItems: "start",
      px: "300",
      py: "200",
      borderRadius: "200",
      cursor: "pointer",
      userSelect: "none",
      color: "fg",
      fontSize: "400",
      lineHeight: "500",
      position: "relative",
      textStyle: "sm",
      outline: 0,

      // Hover state
      "&[data-hovered='true'], &[data-focused='true']": {
        bg: "primary.2",
        outline: "none",
      },

      // keyboard focused
      "&[data-focus-visible]": {
        focusRing: "outside",
      },

      "&[data-selected]": {
        bg: "primary.3",
      },

      "& [slot='caretIcon']": {
        gridArea: "flyoutCaret",
        textAlign: "right",
        my: "auto",
        marginInlineStart: "400",
        boxSize: "500",
        color: "neutral.11",
      },

      // Disabled state
      "&[data-disabled]": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },
    },
    itemLabel: {
      gridArea: "label",
      fontWeight: "500",
    },
    itemDescription: {
      gridArea: "description",
      color: "neutral.10",
    },
    itemKeyboard: {
      gridArea: "keyboard",
      color: "colorPalette.9",
      fontFamily: "mono",
      marginInlineStart: "400",
      my: "auto",
    },
    itemIcon: {
      gridArea: "icon",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginInlineEnd: "300",
      my: "auto",
      flexShrink: 0,
      color: "neutral.11",

      "& svg": {
        boxSize: "500",
      },
    },
    separator: {
      height: "25",
      flexShrink: 0,
      backgroundColor: "neutral.6",
      my: "200",
      mx: "-200",
    },
    group: {
      display: "flex",
      flexDirection: "column",
    },
    groupLabel: {
      textStyle: "xs",
      fontWeight: "600",
      color: "neutral.11",
      px: "300",
      py: "200",
      marginBottom: "100",
      textTransform: "uppercase",
      letterSpacing: "{spacing.25}",
    },
  },
});
