import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const localizedFieldSlotRecipe = defineSlotRecipe({
  slots: [
    // Group / Fieldset slots
    "root",
    "label",
    "fieldsContainer",
    "description",
    "error",
    "toggleButtonContainer",
    // Individual Locale Field / Input slots
    "localeFieldLabel",
    "localeFieldInput",
    "localeFieldDescription",
    "localeFieldError",
  ],
  className: "nimbus-localized-field",
  base: {
    root: {},
    label: {},
    fieldsContainer: {},
    description: {},
    error: {},
    toggleButtonContainer: {},
    // Individual Locale Field / Input slots
    localeFieldLabel: {},
    localeFieldInput: {},
    localeFieldDescription: {},
    localeFieldError: {},
  },
  variants: {
    size: {
      md: {},
      sm: {},
    },
    type: {
      text: {},
      multiLine: {},
      money: {},
      richText: {},
    },
  },
});
