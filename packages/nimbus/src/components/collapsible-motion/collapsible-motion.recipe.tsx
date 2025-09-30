import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const collapsibleMotionSlotRecipe = defineSlotRecipe({
  slots: ["root", "trigger", "content"],
  className: "collapsibleMotion",
  base: {
    root: {},
    trigger: {
      cursor: "pointer",
    },
    content: {},
  },
});
