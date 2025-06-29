import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Slot recipe configuration for the ListBox component.
 * Defines the styling for different slots using Chakra UI's slot recipe system.
 */
export const listBoxSlotRecipe = defineSlotRecipe({
  className: "nimbus-list-box",
  slots: [
    "root",
    "item",
    "itemLabel",
    "itemDescription",
    "section",
    "sectionHeader",
  ],
  base: {
    root: {
      colorPalette: "primary",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    },
    item: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      px: "300",
      py: "200",
      borderRadius: "200",
      cursor: "pointer",
      userSelect: "none",
      color: "neutral.12",
      fontSize: "400",
      lineHeight: "500",
      position: "relative",
      transition: "all 150ms ease-out",

      // Hover state
      "&:hover:not([data-disabled])": {
        backgroundColor: "neutral.3",
        color: "neutral.12",
      },

      // Highlighted state (keyboard navigation)
      "&[data-highlighted]": {
        backgroundColor: "neutral.4",
        outline: "none",
        color: "neutral.12",
      },

      // Active/pressed state
      "&:active:not([data-disabled])": {
        backgroundColor: "neutral.5",
        transform: "translateY(1px)",
      },

      // Focus-visible state for keyboard navigation
      "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "colorPalette.7",
        outlineOffset: "2px",
        backgroundColor: "neutral.4",
      },

      // Selected state
      "&[data-selected]": {
        backgroundColor: "colorPalette.3",
        color: "colorPalette.11!",

        "&:hover": {
          backgroundColor: "colorPalette.4",
        },
      },

      // Disabled state
      "&[data-disabled]": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },

      "&:focus": {
        outline: "none",
      },
    },
    itemLabel: {
      display: "block",
      flexGrow: 1,
      fontWeight: "500",
      textStyle: "sm",
      paddingRight: "1200",
      ["[data-selected] &"]: {
        color: "colorPalette.11",
      },
    },
    itemDescription: {
      display: "block",
      textStyle: "sm",
      color: "neutral.11",
      marginTop: "100",
      ["[data-selected] &"]: {
        color: "colorPalette.11/70",
      },
    },
    section: {
      display: "flex",
      flexDirection: "column",
    },
    sectionHeader: {
      fontSize: "300",
      fontWeight: "600",
      color: "neutral.11",
      px: "300",
      py: "200",
      marginBottom: "100",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
  },
});
