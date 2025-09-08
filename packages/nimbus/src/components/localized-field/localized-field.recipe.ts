import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

const fieldGroupGrid = `
"label"
"fields"
"description"
"error"
"toggle"
`;

const localeFieldGrid = `
"label input"
"description description"
"error error"
`;

export const localizedFieldSlotRecipe = defineSlotRecipe({
  slots: [
    // Group / Fieldset slots
    "root",
    "label",
    "infoDialog",
    "fieldsContainer",
    "description",
    "error",
    "toggleButtonContainer",
    // Individual Locale Field / Input slots
    "localeFieldRoot",
    "localeFieldLabel",
    "localeFieldInput",
    "localeFieldDescription",
    "localeFieldError",
  ],
  className: "nimbus-localized-field",
  base: {
    root: {
      display: "grid",
      width: "auto",
      gridTemplateAreas: fieldGroupGrid,
      gap: "100",
    },
    label: {
      gridArea: "label",
      fontWeight: "500",
      color: "neutral.11",
      fontSize: "var(--localized-field-font-size)",
      lineHeight: "var(--localized-field-line-height)",
    },
    infoDialog: {
      bg: "neutral.1",
      maxWidth: "xl",
      borderRadius: "200",
      boxShadow: "6",
      border: "solid-25",
      borderColor: "neutral.8",
      maxHeight: "40svh",
      overflow: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "{colors.neutral.8} {colors.neutral.3}",
      focusRing: "outside",
    },
    fieldsContainer: {
      gridArea: "fields",
      display: "flex",
      flexDirection: "column",
      gap: "100",
    },
    description: {
      gridArea: "description",
      color: "neutral.11",
      fontSize: "var(--localized-field-font-size)",
      lineHeight: "var(--localized-field-line-height)",
    },
    error: {
      gridArea: "error",
      color: "critical.11",
      fontSize: "var(--localized-field-font-size)",
      lineHeight: "var(--localized-field-line-height)",
    },
    toggleButtonContainer: { gridArea: "toggle" },
    // Individual Locale Field / Input slots
    localeFieldRoot: {
      gap: 0,
      gridTemplateAreas: localeFieldGrid,
    },
    localeFieldLabel: {
      display: "flex",
      borderLeftRadius: "200",
      backgroundColor: "neutral.1",
      boxShadow: `inset 0 0 0 {sizes.25} {colors.neutral.7}`,
      // remove boxShadow on right side so that it looks like there is a 1px border betwee
      clipPath: `inset(0 {sizes.25} 0 0)`,
      marginInlineEnd: "-25",
      paddingInline: "400",
      alignItems: "center",
      _focusWithin: {
        outlineWidth: "var(--focus-ring-width)",
        outlineColor: "var(--focus-ring-color)",
        outlineStyle: "var(--focus-ring-style)",
        outlineOffset: "var(--focus-ring-offset)",
      },
    },
    localeFieldInput: {
      borderLeftRadius: 0,
    },
    localeFieldDescription: {},
    localeFieldError: {},
  },
  variants: {
    size: {
      md: {
        root: {
          "--localized-field-font-size": "fontSizes.350",
          "--localized-field-line-height": "lineHeights.500",
        },
      },
      sm: {
        root: {
          "--localized-field-font-size": "fontSizes.300",
          "--localized-field-line-height": "lineHeights.450",
        },
      },
    },
    type: {
      text: {},
      multiLine: {},
      money: {},
      richText: {},
    },
  },
});
