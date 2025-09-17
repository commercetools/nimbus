import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const collapsibleMotionSlotRecipe = defineSlotRecipe({
  slots: ["root", "trigger", "content"],
  className: "collapsibleMotion",
  base: {
    root: {},
    trigger: {},
    // Content slot - basic container
    content: {
      // TODO: No animation styles - will be implemented later once RAC releases support for this PR: https://github.com/adobe/react-spectrum/pull/8867
      // TODO: support minHeight feature parity with UI-Kit's CollapsibleMotion
    },
  },
});
