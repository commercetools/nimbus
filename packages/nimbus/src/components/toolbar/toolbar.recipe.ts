import { defineRecipe } from "@chakra-ui/react";

export const toolbarRecipe = defineRecipe({
  className: "nimbus-toolbar",
  base: {
    display: "inline-flex",
    p: "var(--toolbar-spacing)",
    gap: "var(--toolbar-spacing)",
    borderRadius: "300",
    alignItems: "stretch",
    flexDirection: "var(--toolbar-direction)",

    "& .nimbus-group, & .nimbus-toggle-button-group__root": {
      alignItems: "center",
      gap: "var(--toolbar-spacing)",
      flexDirection: "var(--toolbar-direction)",
    },
  },
  variants: {
    size: {
      xs: {
        "--toolbar-spacing": "{spacing.100}",
      },
      md: {
        "--toolbar-spacing": "{spacing.200}",
      },
    },
    orientation: {
      horizontal: {
        "--toolbar-direction": "row",
        "& .nimbus-divider": {
          height: "auto",
          mx: "var(--toolbar-spacing)",
        },
      },
      vertical: {
        "--toolbar-direction": "column",
        "& .nimbus-divider": {
          my: "var(--toolbar-spacing)",
        },
      },
    },
    variant: {
      plain: {},
      outline: {
        boxShadow: "0 0 0 {sizes.25} {colors.neutral.6}",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "plain",
  },
});
