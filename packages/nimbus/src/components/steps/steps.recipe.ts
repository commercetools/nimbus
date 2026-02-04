import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Steps component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 *
 * Slots:
 * - root: Container for the entire steps component
 * - list: Flex container for step items and separators
 * - item: Individual step container (indicator + content)
 * - indicator: Circular step number or icon
 * - separator: Connecting line between steps
 * - content: Container for label and description
 * - label: Step title text
 * - description: Optional hint text
 */
export const stepsSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "list",
    "item",
    "indicator",
    "separator",
    "content",
    "label",
    "description",
  ],
  // Unique class name prefix for the component
  className: "nimbus-steps",

  base: {
    root: {
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
    indicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "full",
      border: "solid-50",
      flexShrink: 0,
      fontWeight: "medium",
      // Default state (incomplete)
      borderColor: "neutral.7",
      color: "neutral.12",
      bg: "transparent",
      // State-specific styles
      "&[data-state='current']": {
        borderColor: "primary.9",
        color: "primary.9",
        bg: "primary.2",
      },
      "&[data-state='complete']": {
        borderColor: "primary.9",
        color: "colorPalette.contrast",
        bg: "primary.9",
      },
    },
    separator: {
      bg: "neutral.6",
      flexShrink: 0,
    },
    content: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      color: "neutral.12",
    },
    description: {
      color: "neutral.11",
      fontWeight: "normal",
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
        indicator: {
          width: "var(--indicator-size)",
          height: "var(--indicator-size)",
          fontSize: "300", // 12px
          lineHeight: "350", // 14px
        },
        content: {
          gap: "0",
        },
        label: {
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
        indicator: {
          width: "var(--indicator-size)",
          height: "var(--indicator-size)",
          fontSize: "350", // 14px
          lineHeight: "400", // 16px
        },
        content: {
          gap: "50", // 2px
        },
        label: {
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
        indicator: {
          width: "var(--indicator-size)",
          height: "var(--indicator-size)",
          fontSize: "400", // 16px
          lineHeight: "500", // 20px
        },
        content: {
          gap: "100", // 4px
        },
        label: {
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
          minWidth: "spacing.1000",
        },
      },
      vertical: {
        list: {
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "200", // 8px
        },
        item: {
          alignItems: "flex-start",
        },
        separator: {
          width: "var(--separator-width)",
          flex: "1",
          minHeight: "spacing.1000",
          // Center separator under indicator: (indicator / 2) - (separator / 2)
          marginLeft:
            "calc(var(--indicator-size) / 2 - var(--separator-width) / 2)",
        },
      },
    },
  },

  defaultVariants: {
    size: "sm",
    orientation: "horizontal",
  },
});
