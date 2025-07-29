import { defineSlotRecipe } from "@chakra-ui/react";

export const toolbarRecipe = defineSlotRecipe({
  className: "nimbus-toolbar",
  slots: ["root", "group", "separator"],
  base: {
    root: {
      display: "inline-flex",
      borderWidth: "1px",
      borderColor: "neutral.6",
      borderRadius: "200",
      p: "var(--toolbar-spacing)",
    },
    group: {
      display: "inline-flex",
      alignItems: "center",
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
          flexDirection: "row",
          alignItems: "stretch",
          gap: "var(--toolbar-spacing)",
        },
        group: {
          flexDirection: "row",
          gap: "var(--toolbar-spacing)",
        },
        separator: {
          width: "1px",
          height: "auto",
          //height: "800",
          alignSelf: "stretch",
          mx: "var(--toolbar-spacing)",
          my: 0,
        },
      },
      vertical: {
        root: {
          flexDirection: "column",
          gap: "var(--toolbar-spacing)",
        },
        group: {
          flexDirection: "column",
          gap: "var(--toolbar-spacing)",
        },
        separator: {
          height: "1px",
          width: "auto",
          my: "var(--toolbar-spacing)",
          mx: 0,
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
