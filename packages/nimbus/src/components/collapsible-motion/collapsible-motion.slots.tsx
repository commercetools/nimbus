import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type { CollapsibleMotionRootSlotProps } from "./collapsible-motion.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "collapsibleMotion",
});

export const CollapsibleMotionRootSlot = withProvider<
  HTMLDivElement,
  CollapsibleMotionRootSlotProps
>("div", "root");

export const CollapsibleMotionTriggerSlot = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"button">
>("button", "trigger");

export const CollapsibleMotionContentSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "content");
