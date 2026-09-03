import { defineSlotRecipe } from "@chakra-ui/react/styled-system";
import { buttonRecipe } from "../button/button.recipe";

/**
 * Recipe configuration for the ToggleButtonGroup component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */

const activeFill = {
  tint: {
    bg: "colorPalette.5",
    color: "colorPalette.12",
    _hover: {
      bg: "colorPalette.6",
    },
  },
  solid: {
    bg: "colorPalette.9",
    color: "colorPalette.contrast",
    _hover: {
      bg: "colorPalette.10",
    },
  },
};

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
      // Base style is the same as our Button
      ...buttonRecipe.base,
      borderRadius: "0",
      borderRightWidth: "0",
      "&:first-of-type": {
        borderLeftRadius: "200",
      },
      "&:last-of-type": {
        borderRightWidth: "1px",
        borderRightRadius: "200",
      },
    },
  },

  variants: {
    variant: {
      outline: {
        button: {
          borderColor: "neutral.7",
          color: "neutral.11",
          _hover: {
            bg: "neutral.3",
            borderColor: "neutral.8",
          },
        },
      },
      subtle: {
        button: {
          bg: "neutral.3",
          color: "neutral.11",
          _hover: {
            bg: "neutral.4",
          },
        },
      },
    },

    activeFillStyle: {
      tint: {
        button: {
          _selected: activeFill.tint,
        },
      },
      solid: {
        button: {
          _selected: activeFill.solid,
        },
      },
    },

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
  },

  compoundVariants: [
    {
      variant: "outline",
      activeFillStyle: "tint",
      css: {
        button: {
          _selected: {
            borderColor: "colorPalette.8",
            _hover: {
              borderColor: "colorPalette.8",
            },
            "& + button": {
              borderLeftColor: "colorPalette.8",
            },
          },
        },
      },
    },
    {
      variant: "outline",
      activeFillStyle: "solid",
      css: {
        button: {
          _selected: {
            borderColor: "colorPalette.9",
            _hover: {
              borderColor: "colorPalette.10",
            },
            "& + button": {
              borderLeftColor: "colorPalette.9",
            },
          },
        },
      },
    },
  ],

  defaultVariants: {
    size: "md",
    variant: "outline",
    activeFillStyle: "solid",
  },
});
