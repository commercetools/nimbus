import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { drawerSlotRecipe } from "./drawer.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: drawerSlotRecipe,
});

/**
 * DrawerRootSlot - Root slot component that provides styling context
 */
export type DrawerRootSlotProps = HTMLChakraProps<"div">;
export const DrawerRootSlot = withProvider<HTMLDivElement, DrawerRootSlotProps>(
  "div",
  "root",
  { forwardAsChild: true }
);
DrawerRootSlot.displayName = "DrawerRootSlot";

/**
 * DrawerTriggerSlot - Trigger button slot component
 */
export type DrawerTriggerSlotProps = HTMLChakraProps<"button">;
export const DrawerTriggerSlot = withContext<
  HTMLButtonElement,
  DrawerTriggerSlotProps
>("button", "trigger");
DrawerTriggerSlot.displayName = "DrawerTriggerSlot";

/**
 * DrawerBackdropSlot - Backdrop overlay slot component
 */
export type DrawerBackdropSlotProps = HTMLChakraProps<"div">;
export const DrawerBackdropSlot = withContext<
  HTMLDivElement,
  DrawerBackdropSlotProps
>("div", "backdrop");
DrawerBackdropSlot.displayName = "DrawerBackdropSlot";

/**
 * DrawerPositionerSlot - Positioner slot component
 */
export type DrawerPositionerSlotProps = HTMLChakraProps<"div">;
export const DrawerPositionerSlot = withContext<
  HTMLDivElement,
  DrawerPositionerSlotProps
>("div", "positioner");
DrawerPositionerSlot.displayName = "DrawerPositionerSlot";

/**
 * DrawerContentSlot - Main content slot component
 */
export type DrawerContentSlotProps = HTMLChakraProps<"div">;
export const DrawerContentSlot = withContext<
  HTMLDivElement,
  DrawerContentSlotProps
>("div", "content");
DrawerContentSlot.displayName = "DrawerContentSlot";

/**
 * DrawerHeaderSlot - Header section slot component
 */
export type DrawerHeaderSlotProps = HTMLChakraProps<"header">;
export const DrawerHeaderSlot = withContext<HTMLElement, DrawerHeaderSlotProps>(
  "header",
  "header"
);
DrawerHeaderSlot.displayName = "DrawerHeaderSlot";

/**
 * DrawerBodySlot - Body content slot component
 */
export type DrawerBodySlotProps = HTMLChakraProps<"div">;
export const DrawerBodySlot = withContext<HTMLDivElement, DrawerBodySlotProps>(
  "div",
  "body"
);
DrawerBodySlot.displayName = "DrawerBodySlot";

/**
 * DrawerFooterSlot - Footer section slot component
 */
export type DrawerFooterSlotProps = HTMLChakraProps<"footer">;
export const DrawerFooterSlot = withContext<HTMLElement, DrawerFooterSlotProps>(
  "footer",
  "footer"
);
DrawerFooterSlot.displayName = "DrawerFooterSlot";

/**
 * DrawerTitleSlot - Title element slot component
 */
export type DrawerTitleSlotProps = HTMLChakraProps<"h2">;
export const DrawerTitleSlot = withContext<
  HTMLHeadingElement,
  DrawerTitleSlotProps
>("h2", "title");
DrawerTitleSlot.displayName = "DrawerTitleSlot";

/**
 * DrawerDescriptionSlot - Description element slot component
 */
export type DrawerDescriptionSlotProps = HTMLChakraProps<"p">;
export const DrawerDescriptionSlot = withContext<
  HTMLParagraphElement,
  DrawerDescriptionSlotProps
>("p", "description");
DrawerDescriptionSlot.displayName = "DrawerDescriptionSlot";

/**
 * DrawerCloseTriggerSlot - Close button slot component
 */
export type DrawerCloseTriggerSlotProps = HTMLChakraProps<"button">;
export const DrawerCloseTriggerSlot = withContext<
  HTMLButtonElement,
  DrawerCloseTriggerSlotProps
>("button", "closeTrigger");
DrawerCloseTriggerSlot.displayName = "DrawerCloseTriggerSlot";
