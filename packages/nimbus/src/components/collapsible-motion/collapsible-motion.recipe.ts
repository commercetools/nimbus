import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const collapsibleMotionSlotRecipe = defineSlotRecipe({
  slots: ["root", "trigger", "content"],
  className: "nimbus-collapsible-motion",
  base: {
    root: {},
    trigger: {
      cursor: "pointer",
    },
    content: {},
  },
});
