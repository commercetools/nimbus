import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the Tooltip component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const tooltipSlotRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  slots: ["trigger", "content", "arrow"],
  className: "bleh-ui-tooltip",

  // Base styles applied to all instances of the component
  base: {
    trigger: {
      // this is some example fallback styling for the trigger, in case the user does
      // only provide a text-string as ``children` to `Tooltip`
      all: "unset",
      appearance: "none",
      textDecoration: "underline",
      textDecorationStyle: "dotted",
      textDecorationColor: "neutral.8",
      textUnderlineOffset: "3px",
      focusRing: "outside",
    },
    content: {
      background: "neutral.12",
      color: "neutral.1",
      fontSize: "300",
      lineHeight: "400",
      fontWeight: "400",
      display: "inline-block",
      borderRadius: "100",
      paddingX: "300",
      paddingY: "100",
      maxW: "6400",
      boxShadow: "1",
      _icon: {
        boxSize: "1.25em",
        display: "inline-block",
        verticalAlign: "text-bottom",
      },
    },
    arrow: {
      "--arrow-size": "sizes.200",
      boxSize: "var(--arrow-size)",
      //outline: "1px solid tomato",
      position: "absolute",
      _icon: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        transformOrigin: "center center",
        //outline: "1px solid seagreen",
        boxSize: "var(--arrow-size)",
      },
      "&[data-placement='top']": {
        _icon: {},
      },
      "&[data-placement='bottom']": {
        _icon: {
          transform: "rotate(180deg)",
        },
      },
      "&[data-placement='left']": {
        _icon: {
          transform: "rotate(-90deg)",
        },
      },
      "&[data-placement='right']": {
        _icon: {
          transform: "rotate(90deg)",
        },
      },
    },
  },
});
