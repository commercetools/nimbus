import { defineSlotRecipe } from "@chakra-ui/react";

export const dateRangePickerSlotRecipe = defineSlotRecipe(
  {
    className: "nimbus-date-range-picker",
    slots: [
      "root",
      "group",
      "trigger",
      "popover",
      "calendar",
      "calendarHeader",
      "calendarGrid",
      "calendarCell",
    ],
    base: {
      root: {
        display: "inline-block",
        overflow: "hidden",
      },
      group: {
        display: "flex",
        alignItems: "center",
        border: "solid-25",
        borderColor: "neutral.7",
        borderRadius: "200",
        background: "neutral.1",
        px: "400",
        height: "1200",
        boxSizing: "border-box",

        // Remove border/background from DateInputs
        '& [class*="nimbus-date-input__root"], & [class*="nimbus-date-input__segmentGroup"]':
          {
            border: "none",
            boxShadow: "none",
            borderRadius: 0,
            px: 0,
            width: "auto",
            flex: "0 0 auto",
          },
        // Style the separator
        '& > span[aria-hidden="true"]': {
          color: "neutral.9",
          px: "200",
          userSelect: "none",
        },
        // Style the icon buttons
        "& .nimbus-icon-button": {
          ml: "300",
          color: "primary.7",
          alignSelf: "center",
        },
      },
      trigger: {
        position: "static",
        ml: "auto",
        display: "flex",
        alignItems: "center",
        gap: "100",
      },
      popover: {
        bg: "neutral.1",
        boxShadow: "4",
        borderRadius: "300",
        overflow: "auto",
        "&[data-entering]": {
          animationName: "fade-in, scale-in",
          animationDuration: "fast",
        },
        "&[data-exiting]": {
          animationName: "fade-out, scale-out",
          animationDuration: "faster",
        },
      },
    },
    //variants: {
    // Size variants from smallest to largest
    //   size: {
    //     sm: {
    //       group: {
    //         "& .nimbus-date-input__root": {
    //           mr: "1400",
    //         },
    //       },
    //       trigger: {
    //         top: "50",
    //       },
    //     },
    //     md: {
    //       group: {
    //         "& .nimbus-date-input__root": {
    //           // combine 2 tokens cause there is no token for this crooked value
    //           mr: "calc({spacing.1600} + {spacing.200})",
    //         },
    //       },
    //       trigger: {
    //         top: "100",
    //       },
    //     },
    //   },
    //   variant: {
    //     // those need to exist, as the date-input has and needs those variants
    //     solid: {},
    //     ghost: {},
    //   },
    // },
    // defaultVariants: {
    //   size: "md",
    // },
  }
  //s defaultVariants: {
  // size: "md",
  // },
);
