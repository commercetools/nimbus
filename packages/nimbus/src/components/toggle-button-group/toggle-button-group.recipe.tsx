import { defineSlotRecipe } from "@chakra-ui/react/styled-system";
import { buttonRecipe } from "../button/button.recipe";

/**
 * Recipe configuration for the ToggleButtonGroup component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const buttonGroupRecipe = defineSlotRecipe({
  slots: ["root", "button"],
  // Unique class name prefix for the component
  className: "nimbus-toggle-button-group",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
    },
    button: {
      // Base style is the same as our Button (layout fundamentals only -
      // colors/borders/gaps are defined per `variant` below).
      ...buttonRecipe.base,
    },
  },

  variants: {
    size: {
      xs: {
        button: buttonRecipe.variants?.size.xs,
      },
      md: {
        button: buttonRecipe.variants?.size.md,
      },
    },

    colorPalette: {
      primary: {
        button: { colorPalette: "primary" },
      },
      critical: {
        button: { colorPalette: "critical" },
      },
      neutral: {
        button: { colorPalette: "neutral" },
      },
    },

    variant: {
      // Current/default behavior: outline border when unselected, solid
      // fill when selected. Buttons are joined with shared borders and
      // border radius only on the first/last button.
      outline: {
        button: {
          // Unselected style matches the Button `outline` variant
          ...buttonRecipe.variants?.variant.outline,

          borderRadius: "0",
          borderRightWidth: "0",
          "&:first-of-type": {
            borderLeftRadius: "200",
          },
          "&:last-of-type": {
            borderRightWidth: "1px",
            borderRightRadius: "200",
          },

          // Selected style matches the Button `solid` variant
          "&[data-selected=true]": buttonRecipe.variants?.variant.solid,
        },
      },

      // No border, no background unselected. Tinted background when
      // selected. Buttons have a small gap and their own border radius.
      ghost: {
        root: {
          gap: "100",
        },
        button: {
          "--button-bg": "transparent",
          "--button-text": "{colors.neutral.11}",

          bg: "var(--button-bg)",
          color: "var(--button-text)",
          borderWidth: "0",
          borderRadius: "200",

          "&[data-hovered='true']": {
            "--button-bg": "{colors.colorPalette.2}",
          },

          "&[data-selected='true']": {
            "--button-bg": "{colors.colorPalette.3}",
            "--button-text": "{colors.colorPalette.11}",

            "&[data-hovered='true']": {
              "--button-bg": "{colors.colorPalette.4}",
            },
          },
        },
      },

      // Solid fill always, joined layout like outline. Selected buttons
      // get a stronger/darker fill.
      solid: {
        button: {
          "--button-bg": "{colors.colorPalette.3}",
          "--button-text": "{colors.colorPalette.11}",
          "--border-width": "{sizes.25}",
          "--border-color": "{colors.colorPalette.3}",

          bg: "var(--button-bg)",
          color: "var(--button-text)",
          borderWidth: "var(--border-width)",
          borderColor: "var(--border-color)",

          borderRadius: "0",
          borderRightWidth: "0",
          "&:first-of-type": {
            borderLeftRadius: "200",
          },
          "&:last-of-type": {
            borderRightWidth: "var(--border-width)",
            borderRightRadius: "200",
          },

          "&[data-hovered='true']": {
            "--button-bg": "{colors.colorPalette.4}",
            "--border-color": "{colors.colorPalette.4}",
          },

          "&[data-selected='true']": {
            "--button-bg": "{colors.colorPalette.9}",
            "--button-text": "{colors.colorPalette.contrast}",
            "--border-color": "{colors.colorPalette.9}",

            "&[data-hovered='true']": {
              "--button-bg": "{colors.colorPalette.10}",
              "--border-color": "{colors.colorPalette.10}",
            },
          },
        },
      },

      // Light tinted background unselected. Stronger tint selected.
      // Buttons have a small gap and their own border radius.
      subtle: {
        root: {
          gap: "100",
        },
        button: {
          "--button-bg": "{colors.colorPalette.3}",
          "--button-text": "{colors.colorPalette.11}",

          bg: "var(--button-bg)",
          color: "var(--button-text)",
          borderWidth: "0",
          borderRadius: "200",

          "&[data-hovered='true']": {
            "--button-bg": "{colors.colorPalette.4}",
          },

          "&[data-selected='true']": {
            "--button-bg": "{colors.colorPalette.5}",
            "--button-text": "{colors.colorPalette.11}",

            "&[data-hovered='true']": {
              "--button-bg": "{colors.colorPalette.6}",
            },
          },
        },
      },

      // iOS/Material-style segmented control: the root renders a visible
      // background "track" and buttons have no border. The selected
      // button is visually lifted off the track with a contrasting
      // background and subtle shadow.
      segmented: {
        root: {
          bg: "neutral.3",
          borderRadius: "200",
          padding: "50",
          gap: "0",
        },
        button: {
          "--button-bg": "transparent",
          "--button-text": "{colors.neutral.11}",

          bg: "var(--button-bg)",
          color: "var(--button-text)",
          borderWidth: "0",
          borderRadius: "150",
          boxShadow: "none",

          "&[data-hovered='true']": {
            "--button-bg": "{colors.neutral.4}",
          },

          "&[data-selected='true']": {
            "--button-bg": "{colors.bg}",
            "--button-text": "{colors.colorPalette.11}",
            boxShadow: "1",

            "&[data-hovered='true']": {
              "--button-bg": "{colors.bg}",
            },
          },
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "outline",
  },
});
