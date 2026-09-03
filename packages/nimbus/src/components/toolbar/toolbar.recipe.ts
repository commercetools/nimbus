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

    // Align, and (for a vertical toolbar) stack, any nested cluster, and give
    // independent controls inter-item spacing. This includes a ToggleButtonGroup
    // used only as a selection manager around bare toggles (IconToggleButton
    // children), which need the spacing to breathe.
    "& .nimbus-group, & .nimbus-toggle-button-group__root": {
      alignItems: "center",
      flexDirection: "var(--toolbar-direction)",
      gap: "var(--toolbar-spacing)",
    },
    // ...but a real segmented ToggleButtonGroup (its children are `.Button`s)
    // must stay flush: the buttons collapse their shared borders and only the
    // outer corners round, so any gap would split it into detached islands.
    "& .nimbus-toggle-button-group__root:has(> .nimbus-toggle-button-group__button)":
      {
        gap: "0",
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
