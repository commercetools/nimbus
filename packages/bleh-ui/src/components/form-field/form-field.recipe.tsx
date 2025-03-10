import { defineSlotRecipe } from "@chakra-ui/react";

const columnLayout = `
"label"
"input"
"description"
"error"
`;
const rowLayout = `
"label input"
". description"
". error"
`;

/**
 * Recipe configuration for the FormField component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const formFieldRecipe = defineSlotRecipe({
  slots: ["root", "label", "input", "description", "error"],
  // Unique class name prefix for the component
  className: "bleh-ui-form-field",

  base: {
    root: {
      display: "inline-grid",
      width: "auto",
      gridTemplateColumns: "auto 1fr",
      gridTemplateRows: "auto auto auto auto",
      gridRowGap: "100",
      //outline: "1px solid black",
    },
    label: {
      gridArea: "label",
      fontWeight: "500",
      color: "neutral.11",
      fontSize: "350",
      lineHeight: "400",
      //outline: "1px solid orange",
    },
    input: {
      gridArea: "input",
      //outline: "1px solid green",

      "& input": {
        border: "solid-25",
        borderColor: "neutral.8",
        borderRadius: "200",
        height: "1000",
      },
    },
    description: {
      gridArea: "description",
      color: "neutral.11",
      fontSize: "350",
      lineHeight: "500",
      //outline: "1px solid blue",
    },
    error: {
      gridArea: "error",
      color: "error.11",
      fontSize: "350",
      lineHeight: "500",
      //outline: "1px solid red",
    },
  },

  variants: {
    direction: {
      column: {
        root: {
          gridTemplateColumns: "auto 1fr",
          gridTemplateRows: "auto auto auto",
          gridTemplateAreas: columnLayout,
        },
      },
      row: {
        root: {
          gridTemplateAreas: rowLayout,
          gridColumnGap: "200",
        },
      },
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    direction: "column",
  },
});
