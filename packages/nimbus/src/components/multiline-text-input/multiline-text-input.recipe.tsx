import { defineSlotRecipe } from "@chakra-ui/react/styled-system";
import { designTokens } from "@commercetools/nimbus-tokens";

/**
 * Recipe configuration for the MultilineTextInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const multilineTextInputRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  className: "nimbus-multiline-text-input",
  slots: ["root", "leadingElement", "trailingElement", "textarea"],
  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-flex",
      overflowY: "auto",
      resize: "vertical",
      borderRadius: "200",
      colorPalette: "neutral",
      bg: "transparent",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
      _focusWithin: {
        layerStyle: "focusRing",
      },

      "& input": {
        outline: "none",
      },

      focusVisibleRing: "outside",
      focusRing: "outside",
      fontFamily: "inherit",
      "&::-webkit-resizer": {
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_4610_25787" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="-1" y="-1" width="9" height="9">
            <rect width="1.03391" height="4.13563" transform="matrix(0.716449 0.69764 -0.716449 0.69764 6.92578 4.05362)" fill="currentColor"/>
            <rect width="1.03391" height="8.27125" transform="matrix(0.716448 0.69764 -0.716448 0.69764 5.87891 -0.0262451)" fill="currentColor"/>
          </mask>
          <g mask="url(#mask0_4610_25787)">
            <rect width="8" height="8" fill="${designTokens.color["semantic-palettes"].primary.light[9]}"/>
          </g>
        </svg>
      `)}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "200 200",
        width: "400",
        height: "400",
      },
      _placeholder: {
        opacity: 0.5,
        color: "currentColor",
      },
      _disabled: {
        layerStyle: "disabled",
        bg: "neutral.3",
      },
      "&[data-invalid='true']": {
        "--border-width": "sizes.50",
        "--border-color": "colors.critical.7",
        color: "critical.11",
      },
    },
    leadingElement: {
      overflow: "hidden",
      display: "flex",
      justifyContent: "flex-start",
    },
    trailingElement: {
      overflow: "hidden",
      display: "flex",
      justifyContent: "flex-start",
    },
    textarea: {
      flexGrow: 1,
      outline: "none",
      resize: "none",
      background: "transparent",
    },
  },

  variants: {
    size: {
      sm: {
        root: {
          minH: 800,
          textStyle: "sm",
          px: 300,
          py: 100,
        },
        textarea: {
          px: 100,
        },
        leadingElement: {
          py: "100",
          minHeight: "400",
          minWidth: "400",
        },
        trailingElement: {
          py: "100",
          minHeight: "400",
          minWidth: "400",
        },
      },
      md: {
        root: {
          minH: 1000,
          textStyle: "md",
          px: 400,
          py: 200,
        },
        textarea: {
          px: 200,
        },
        leadingElement: {
          minHeight: "500",
          minWidth: "500",
        },
        trailingElement: {
          minHeight: "500",
          minWidth: "500",
        },
      },
    },

    variant: {
      solid: {
        root: {
          "--border-width": "sizes.25",
          "--border-color": "colors.neutral.7",
          backgroundColor: "neutral.1",
          _hover: {
            backgroundColor: "primary.2",
          },
        },
      },
      ghost: {
        root: {
          _hover: {
            backgroundColor: "primary.2",
          },
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
