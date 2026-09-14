import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

const columnLayout = `
"label"
"input"
"description"
"error"
`;
const rowLayout = `
"label input"
"label description"
"label error"
`;

/**
 * Recipe configuration for the FormField component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const formFieldRecipe = defineSlotRecipe({
  slots: ["root", "label", "input", "description", "error", "popover"],
  // Unique class name prefix for the component
  className: "nimbus-ui-form-field",

  base: {
    root: {
      "--grid-gap": "spacing.100",

      display: "grid",
      width: "auto",
    },
    label: {
      gridArea: "label",
      // a flex row over the label text and the info-button, so the two are
      // centered against each other. Without it the info-button wrapper sits on
      // the text baseline and its offset depends on the font's `ch` advance
      // width rather than on the label's own line height.
      display: "flex",
      alignItems: "center",
      // `direction="row"` spans this slot across the input/description/error
      // rows, so it has to stay at its own content height - stretched, the
      // `alignItems` above would center the label over the whole field.
      alignSelf: "start",
      fontWeight: "500",
      color: "neutral.11",
      fontSize: "var(--form-field-font-size)",
      lineHeight: "var(--form-field-line-height)",
      // ensure the asterisk is always aligned top-right
      "& > label[data-required='true']": {
        display: "inline-flex",
        "& > sup": {
          lineHeight: "inherit",
        },
      },
    },
    input: {
      gridArea: "input",
    },
    description: {
      gridArea: "description",
      color: "neutral.11",
      fontSize: "var(--form-field-font-size)",
      lineHeight: "var(--form-field-line-height)",
    },
    error: {
      gridArea: "error",
      color: "critical.11",
      fontSize: "var(--form-field-font-size)",
      lineHeight: "var(--form-field-line-height)",
      display: "flex",
      alignItems: "flex-start",
      gap: "100",
    },
    popover: {
      "--scrollbar-color": "colors.neutral.8",
      "--scrollbar-bg": "colors.neutral.3",
      bg: "neutral.1",
      maxWidth: "xl",
      borderRadius: "200",
      boxShadow: "6",
      border: "solid-25",
      borderColor: "neutral.8",
      maxHeight: "40svh",
      overflow: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "var(--scrollbar-color) var(--scrollbar-bg)",
      focusRing: "outside",
    },
  },

  variants: {
    size: {
      md: {
        root: {
          "--form-field-font-size": "fontSizes.350",
          "--form-field-line-height": "lineHeights.500",
        },
      },
      sm: {
        root: {
          "--form-field-font-size": "fontSizes.300",
          "--form-field-line-height": "lineHeights.450",
        },
      },
    },
    direction: {
      column: {
        root: {
          gridTemplateAreas: columnLayout,
        },
        input: {
          mt: "var(--grid-gap)",
        },
        description: {
          mt: "var(--grid-gap)",
        },
        error: {
          mt: "var(--grid-gap)",
        },
      },
      row: {
        root: {
          gridTemplateAreas: rowLayout,
          gridTemplateColumns: "auto 1fr",
          gridColumnGap: "200",
        },
        description: {
          mt: "var(--grid-gap)",
        },
        error: {
          mt: "var(--grid-gap)",
        },
      },
    },
  },

  // Default variant values when not explicitly specified
  defaultVariants: {
    direction: "column",
    size: "md",
  },
});
