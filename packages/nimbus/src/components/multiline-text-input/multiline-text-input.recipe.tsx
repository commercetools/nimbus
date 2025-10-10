import { defineSlotRecipe } from "@chakra-ui/react/styled-system";
import { designTokens } from "@commercetools/nimbus-tokens";

/**
 * Recipe configuration for the MultilineTextInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const multilineTextInputRecipe = defineSlotRecipe({
  // Unique class name prefix for the component
  className: "nimbus-multiline-text-input",
  slots: ["root", "leadingElement", "textarea"],
  // Base styles applied to all instances of the component
  base: {
    root: {
      "--input-border-radius": "sizes.200",
      display: "inline-flex",
      overflowY: "auto",
      resize: "vertical",
      borderRadius: "var(--input-border-radius)",
      colorPalette: "neutral",
      bg: "transparent",
      boxShadow: "inset 0 0 0 var(--border-width) var(--border-color)",
      _focusWithin: {
        layerStyle: "focusRing",
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
          // TODO: fix this
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
      "&[data-disabled='true']": {
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
      display: "flex",
      color: "neutral.11",
    },
    textarea: {
      flexGrow: 1,
      outline: "none",
      resize: "none",
      background: "transparent",
      borderTopRightRadius: "200",
      borderBottomRightRadius: "200",
      _placeholder: {
        opacity: 0.5,
        color: "currentColor",
      },
      "&[data-disabled='true']": { cursor: "not-allowed" },
    },
  },

  variants: {
    size: {
      sm: {
        root: {
          minH: "800",
          textStyle: "sm",
          gap: "100",
          pl: "300",
        },
        textarea: {
          pr: "300",
          py: "100",
        },
        leadingElement: {
          pt: "200",
          "& svg": {
            boxSize: "400",
          },
        },
      },
      md: {
        root: {
          minH: "1000",
          textStyle: "md",
          gap: "200",
          pl: "400",
        },
        textarea: {
          py: "200",
          pr: "400",
        },
        leadingElement: {
          pt: "200",
          "& svg": {
            mt: "50",
            boxSize: "500",
          },
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
