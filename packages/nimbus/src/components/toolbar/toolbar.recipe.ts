import { defineSlotRecipe } from "@chakra-ui/react";

export const toolbarSlotRecipe = defineSlotRecipe({
  className: "nimbus-toolbar",
  slots: ["root", "group", "separator"],
  base: {
    root: {
      display: "inline-flex",
      p: "var(--toolbar-spacing)",
      gap: "var(--toolbar-spacing)",
      borderRadius: "300",
      alignItems: "stretch",
      flexDirection: "var(--toolbar-direction)",
    },
    group: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--toolbar-spacing)",
      flexDirection: "var(--toolbar-direction)",
    },
    separator: {
      border: 0,
      bg: "neutral.6",
    },
  },
  variants: {
    size: {
      xs: {
        root: {
          "--toolbar-spacing": "{spacing.100}",
        },
      },
      md: {
        root: {
          "--toolbar-spacing": "{spacing.200}",
        },
      },
    },
    orientation: {
      horizontal: {
        root: {
          "--toolbar-direction": "row",
        },

        separator: {
          width: "25",
          height: "auto",
        },
      },
      vertical: {
        root: {
          "--toolbar-direction": "column",
        },
        separator: {
          height: "25",
          width: "auto",
        },
      },
    },
    variant: {
      plain: {},
      outline: {
        root: {
          boxShadow: "0 0 0 {sizes.25} {colors.neutral.6}",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "plain",
  },
});
