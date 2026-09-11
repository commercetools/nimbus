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
      flexDirection: "var(--toolbar-direction)",
      gap: "var(--toolbar-spacing)",
      // Segmented groups (`ToggleButtonGroup.Button` children share borders)
      // collapse the toolbar gap; raw `ToggleButton` children keep it. Nested
      // so it's one class more specific than the gap above and overrides it.
      "&:has(> .nimbus-toggle-button-group__button)": {
        gap: "0",
      },
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
        boxShadow: "inset 0 0 0 {sizes.25} {colors.neutral.6}",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "plain",
  },
});
