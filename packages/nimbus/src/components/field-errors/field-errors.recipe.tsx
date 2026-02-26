import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const fieldErrorsRecipe = defineSlotRecipe({
  className: "nimbus-field-errors",
  slots: ["root", "message"],
  base: {
    root: {
      display: "block",
      colorPalette: "critical",
    },
    message: {
      color: "colorPalette.11",
    },
  },
});
