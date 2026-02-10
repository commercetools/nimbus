import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Tooltip component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const tooltipRecipe = defineRecipe({
  // Unique class name prefix for the component
  className: "nimbus-tooltip",

  // Base styles applied to all instances of the component
  base: {
    // Tooltip styling is inverse of normal dark/light mode styling:
    // light mode: dark bg / light text
    // dark mode: light bg / dark text
    color: "bg",
    textStyle: "xs",
    fontWeight: "400",
    background: "slate.12",
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "100",
    paddingX: "300",
    paddingY: "100",
    margin: "100",
    maxW: "6400",
    boxShadow: "1",
  },
});
