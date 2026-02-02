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
      borderWidth: "2px",
      borderStyle: "solid",
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
        item: {
          gap: "200", // 8px
        },
        indicator: {
          width: "600", // 24px
          height: "600",
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
        item: {
          gap: "300", // 12px
        },
        indicator: {
          width: "800", // 32px
          height: "800",
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
        item: {
          gap: "400", // 16px
        },
        indicator: {
          width: "1000", // 40px
          height: "1000",
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
          height: "2px",
          flex: "1",
          minWidth: "40px",
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
          width: "2px",
          flex: "1",
          minHeight: "40px",
        },
      },
    },
  },

  // Compound variants for vertical separator positioning
  compoundVariants: [
    {
      orientation: "vertical",
      size: "xs",
      css: {
        separator: {
          marginLeft: "calc(12px - 1px)", // half of 24px indicator - half of 2px width
        },
      },
    },
    {
      orientation: "vertical",
      size: "sm",
      css: {
        separator: {
          marginLeft: "calc(16px - 1px)", // half of 32px indicator - half of 2px width
        },
      },
    },
    {
      orientation: "vertical",
      size: "md",
      css: {
        separator: {
          marginLeft: "calc(20px - 1px)", // half of 40px indicator - half of 2px width
        },
      },
    },
  ],

  defaultVariants: {
    size: "sm",
    orientation: "horizontal",
  },
});
