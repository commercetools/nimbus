import { defineRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the TextInput component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const textInputRecipe = defineRecipe({
  // Unique class name prefix for the component
  className: "nimbus-text-input",

  // Base styles applied to all instances of the component
  base: {
    "& .nimbus-text-input-container": {
      position: "relative",
      display: "flex",
      alignItems: "center",
      borderRadius: "200",
      border: "solid-25",
      width: "100%",
      height: "100%",
      bg: "white",
      boxShadow: "5",
      overflow: "hidden", // Ensure elements stay within borders
    },

    focusVisibleRing: "outside",
    _focusVisible: {
      // Ensure focus ring surrounds the entire input, including elements
      zIndex: 1,
    },

    _disabled: {
      "& .nimbus-text-input-container": {
        bg: "neutral.3",
      },
      layerStyle: "disabled",
    },

    "&[data-invalid='true']": {
      "& .nimbus-text-input-container": {
        boxShadow: "5",
      },
      color: "critical.11",
    },

    // Position for leading and trailing elements
    "& .leading-element": {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      // width: "200",
      // zIndex: 1,
      left: "400",
      right: "200",
      _rtl: {
        left: "auto",
        right: "400",
      },
    },

    "& .trailing-element": {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      // zIndex: 1,
      right: "400",
      left: "200",
      _rtl: {
        right: "auto",
        left: "400",
      },
    },

    // Style the input element when there are leading/trailing elements
    "& [data-part='input']": {
      width: "100%",
      height: "100%",
      // padding: "400",
      outline: "none",
      border: "none",
      borderRadius: "inherit",
      bg: "transparent",
      color: "inherit",
      fontSize: "inherit",
      fontFamily: "inherit",
      lineHeight: "inherit",

      _focusVisible: {
        outline: "none",
        boxShadow: "none", // Remove default focus ring from input
      },

      _placeholder: {
        opacity: 0.5,
        color: "currentColor",
      },

      _disabled: {
        opacity: 0.6,
        cursor: "not-allowed",
      },
    },

    // Adjust padding when leading element is present
    "&[data-has-leading='true'] [data-part='input']": {
      // paddingLeft: "1200",
      _rtl: {
        paddingLeft: "400",
        // paddingRight: "1200",
      },
    },

    // Adjust padding when trailing element is present
    "&[data-has-trailing='true'] [data-part='input']": {
      paddingRight: "1200",
      _rtl: {
        paddingRight: "400",
        paddingLeft: "1200",
      },
    },

    // For both leading and trailing elements
    "&[data-has-leading='true'][data-has-trailing='true'] [data-part='input']":
      {
        paddingLeft: "1200",
        paddingRight: "1200",
        _rtl: {
          paddingLeft: "1200",
          paddingRight: "1200",
        },
      },
  },

  variants: {
    size: {
      sm: {
        height: "800",
        textStyle: "sm",
        "& [data-part='input']": {
          padding: "300",
        },
        "& .leading-element": {
          left: "300",
          _rtl: {
            left: "auto",
            right: "300",
          },
        },
        "& .trailing-element": {
          right: "300",
          _rtl: {
            right: "auto",
            left: "300",
          },
        },
        "&[data-has-leading='true'] [data-part='input']": {
          paddingLeft: "1000",
          _rtl: {
            paddingLeft: "300",
            paddingRight: "1000",
          },
        },
        "&[data-has-trailing='true'] [data-part='input']": {
          paddingRight: "1000",
          _rtl: {
            paddingRight: "300",
            paddingLeft: "1000",
          },
        },
      },
      md: {
        height: "1000",
        textStyle: "md",
        "& [data-part='input']": {
          padding: "400",
        },
        "& .leading-element": {
          left: "400",
          _rtl: {
            left: "auto",
            right: "400",
          },
        },
        "& .trailing-element": {
          right: "400",
          _rtl: {
            right: "auto",
            left: "400",
          },
        },
        "&[data-has-leading='true'] [data-part='input']": {
          paddingLeft: "1200",
          _rtl: {
            paddingLeft: "400",
            paddingRight: "1200",
          },
        },
        "&[data-has-trailing='true'] [data-part='input']": {
          paddingRight: "1200",
          _rtl: {
            paddingRight: "400",
            paddingLeft: "1200",
          },
        },
      },
    },

    variant: {
      solid: {
        "& .nimbus-text-input-container": {
          boxShadow: "inset 0 0 0 sizes.25 colors.neutral.7",
          backgroundColor: "primary.1",
        },
        _hover: {
          "& .nimbus-text-input-container": {
            backgroundColor: "primary.2",
          },
        },
      },
      ghost: {
        _hover: {
          "& .nimbus-text-input-container": {
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
