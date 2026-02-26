import { defineRecipe } from "@chakra-ui/react/styled-system";

export const toolbarRecipe = defineRecipe({
  className: "nimbus-toolbar",
  base: {
    display: "inline-flex",
    p: "var(--toolbar-spacing)",
    gap: "var(--toolbar-spacing)",
    borderRadius: "300",
    alignItems: "center",
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
        "--separator-size": "{sizes.600}",
      },
      md: {
        "--toolbar-spacing": "{spacing.200}",
        "--separator-size": "{sizes.800}",
      },
    },
    orientation: {
      horizontal: {
        "--toolbar-direction": "row",
        "& .nimbus-separator": {
          height: "var(--separator-size)",
          mx: "var(--toolbar-spacing)",
        },
      },
      vertical: {
        "--toolbar-direction": "column",
        "& .nimbus-separator": {
          width: "var(--separator-size)",
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
