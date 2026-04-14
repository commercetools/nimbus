import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Card component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const cardRecipe = defineSlotRecipe({
  slots: ["root", "header", "body", "footer"],

  className: "nimbus-card",

  base: {
    root: {
      colorPalette: "slate",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      borderRadius: "300",
      focusVisibleRing: "outside",
    },
  },

  variants: {
    size: {
      sm: {
        root: {
          gap: "100",
        },
        header: {
          px: "200",
          _first: { pt: "200" },
          _last: { pb: "200" },
        },
        body: {
          px: "200",
          _first: { pt: "200" },
          _last: { pb: "200" },
        },
        footer: {
          px: "200",
          _first: { pt: "200" },
          _last: { pb: "200" },
        },
      },
      md: {
        root: {
          gap: "200",
        },
        header: {
          px: "400",
          _first: { pt: "400" },
          _last: { pb: "400" },
        },
        body: {
          px: "400",
          _first: { pt: "400" },
          _last: { pb: "400" },
        },
        footer: {
          px: "400",
          _first: { pt: "400" },
          _last: { pb: "400" },
        },
      },
      lg: {
        root: {
          gap: "400",
        },
        header: {
          px: "600",
          _first: { pt: "600" },
          _last: { pb: "600" },
        },
        body: {
          px: "600",
          _first: { pt: "600" },
          _last: { pb: "600" },
        },
        footer: {
          px: "600",
          _first: { pt: "600" },
          _last: { pb: "600" },
        },
      },
    },

    variant: {
      outlined: {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.3",
          backgroundColor: "bg",
        },
      },
      elevated: {
        root: {
          shadow: "1",
          backgroundColor: "bg",
        },
      },
      filled: {
        root: {
          backgroundColor: "colorPalette.2",
        },
      },
      plain: {
        root: {
          backgroundColor: "bg",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "outlined",
  },
});
