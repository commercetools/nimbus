import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Steps component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 *
 * Slots:
 * - root: Container for the entire steps component
 * - list: Flex container for step items and separators
 * - item: Individual step container
 * - trigger: Clickable button within each step for direct navigation
 * - indicator: Circular step number or icon within trigger
 * - number: Step number display within indicator
 * - title: Step title text within trigger
 * - description: Optional hint text within trigger
 * - separator: Connecting line between steps
 * - content: Auto-visibility content container for step content
 * - completedContent: Content displayed when all steps are complete
 * - prevTrigger: Navigation button to go to previous step
 * - nextTrigger: Navigation button to go to next step
 */
export const stepsSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "list",
    "item",
    "trigger",
    "indicator",
    "number",
    "title",
    "description",
    "separator",
    "content",
    "completedContent",
    "prevTrigger",
    "nextTrigger",
  ],
  // Unique class name prefix for the component
  className: "nimbus-steps",

  base: {
    root: {
      colorPalette: "primary",
      width: "100%",
      // CSS variable for separator width - used in calc for vertical centering
      "--separator-width": "spacing.50", // 2px
    },
    list: {
      display: "flex",
      alignItems: "center",
    },
    item: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },
    trigger: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      background: "transparent",
      border: "none",
      padding: "0",
      textAlign: "left",
      _disabled: {
        cursor: "not-allowed",
        opacity: 0.5,
      },
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "colorPalette.9",
        outlineOffset: "2px",
        borderRadius: "md",
      },
    },
    indicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "full",
      border: "solid-50",
      flexShrink: 0,
      fontWeight: "medium",
      // Default state (incomplete) - data-state="closed" without data-complete
      borderColor: "neutral.7",
      color: "neutral.12",
      bg: "transparent",
      // Current step - data-state="open"
      "&[data-state='open']": {
        borderColor: "colorPalette.9",
        color: "colorPalette.9",
        bg: "colorPalette.2",
      },
      // Completed step - has data-complete attribute
      "&[data-complete]": {
        borderColor: "colorPalette.9",
        color: "colorPalette.contrast",
        bg: "colorPalette.9",
      },
    },
    number: {
      fontWeight: "medium",
    },
    title: {
      color: "neutral.12",
    },
    description: {
      color: "neutral.11",
      fontWeight: "normal",
    },
    separator: {
      bg: "neutral.6",
      flexShrink: 0,
      // Completed separator - has data-complete attribute
      "&[data-complete]": {
        bg: "colorPalette.7",
      },
    },
    content: {
      // Content visibility is managed by Chakra Steps based on step state
      _hidden: {
        display: "none",
      },
    },
    completedContent: {
      // Shown when all steps are complete
      _hidden: {
        display: "none",
      },
    },
    prevTrigger: {
      // Styling is typically handled by asChild pattern with Button component
    },
    nextTrigger: {
      // Styling is typically handled by asChild pattern with Button component
    },
  },

  variants: {
    size: {
      xs: {
        root: {
          "--indicator-size": "sizes.600", // 24px
        },
        item: {
          gap: "200", // 8px
        },
        trigger: {
          gap: "200", // 8px
        },
        indicator: {
          width: "var(--indicator-size)",
          height: "var(--indicator-size)",
          fontSize: "300", // 12px
          lineHeight: "350", // 14px
        },
        number: {
          fontSize: "300", // 12px
          lineHeight: "350", // 14px
        },
        title: {
          fontSize: "350", // 14px
          lineHeight: "550", // 22px
          fontWeight: "bold",
        },
        description: {
          fontSize: "300", // 12px
          lineHeight: "450", // 18px
        },
      },
      sm: {
        root: {
          "--indicator-size": "sizes.800", // 32px
        },
        item: {
          gap: "300", // 12px
        },
        trigger: {
          gap: "300", // 12px
        },
        indicator: {
          width: "var(--indicator-size)",
          height: "var(--indicator-size)",
          fontSize: "350", // 14px
          lineHeight: "400", // 16px
        },
        number: {
          fontSize: "350", // 14px
          lineHeight: "400", // 16px
        },
        title: {
          fontSize: "400", // 16px
          lineHeight: "500", // 20px
          fontWeight: "semibold",
        },
        description: {
          fontSize: "350", // 14px
          lineHeight: "500", // 20px
        },
      },
      md: {
        root: {
          "--indicator-size": "sizes.1000", // 40px
        },
        item: {
          gap: "400", // 16px
        },
        trigger: {
          gap: "400", // 16px
        },
        indicator: {
          width: "var(--indicator-size)",
          height: "var(--indicator-size)",
          fontSize: "400", // 16px
          lineHeight: "500", // 20px
        },
        number: {
          fontSize: "400", // 16px
          lineHeight: "500", // 20px
        },
        title: {
          fontSize: "450", // 18px
          lineHeight: "600", // 24px
          fontWeight: "semibold",
        },
        description: {
          fontSize: "350", // 14px
          lineHeight: "500", // 20px
        },
      },
    },
    orientation: {
      horizontal: {
        list: {
          flexDirection: "row",
          gap: "300", // 12px
        },
        separator: {
          height: "var(--separator-width)",
          flex: "1",
          minWidth: "1000",
        },
      },
      vertical: {
        list: {
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "0", // No gap between items - separator provides spacing
        },
        item: {
          flexDirection: "column", // Stack trigger and separator vertically
          alignItems: "flex-start",
          gap: "0", // Override size variant gap - separator margins control spacing
        },
        separator: {
          width: "var(--separator-width)",
          minHeight: "1000",
          // Center separator under indicator: (indicator / 2) - (separator / 2)
          marginLeft:
            "calc(var(--indicator-size) / 2 - var(--separator-width) / 2)",
          marginTop: "100", // 4px gap above separator
          marginBottom: "100", // 4px gap below separator
        },
      },
    },
  },

  defaultVariants: {
    size: "sm",
    orientation: "horizontal",
  },
});
