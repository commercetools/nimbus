import { defineSlotRecipe } from "@chakra-ui/react";

export const fieldErrorsRecipe = defineSlotRecipe({
  className: "nimbus-field-errors",
  slots: ["root"],
  base: {
    root: {
      display: "block",
    },
  },
});
