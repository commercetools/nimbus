import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusDrawer",
});

// Root slot - provides recipe context + config to all child components
export type DrawerRootSlotProps = HTMLChakraProps<"div">;
export const DrawerRootSlot = withProvider<HTMLDivElement, DrawerRootSlotProps>(
  "div",
  "root"
);

// Trigger slot - button that opens the drawer
export type DrawerTriggerSlotProps = HTMLChakraProps<"button">;
export const DrawerTriggerSlot = withContext<
  HTMLButtonElement,
  DrawerTriggerSlotProps
>("button", "trigger");

// Backdrop slot - overlay displayed behind the drawer
export type DrawerModalOverlaySlotProps = HTMLChakraProps<"div">;
export const DrawerModalOverlaySlot = withContext<
  HTMLDivElement,
  DrawerModalOverlaySlotProps
>("div", "modalOverlay");

// modal slot - positions the drawer content
export type DrawerModalSlotProps = HTMLChakraProps<"div">;
export const DrawerModalSlot = withContext<
  HTMLDivElement,
  DrawerModalSlotProps
>("div", "modal");

// Content slot - main drawer container
export type DrawerContentSlotProps = HTMLChakraProps<"div">;
export const DrawerContentSlot = withContext<
  HTMLDivElement,
  DrawerContentSlotProps
>("div", "content");

// Header slot - drawer header section
export type DrawerHeaderSlotProps = HTMLChakraProps<"header">;
export const DrawerHeaderSlot = withContext<HTMLElement, DrawerHeaderSlotProps>(
  "header",
  "header"
);

// Body slot - drawer body content
export type DrawerBodySlotProps = HTMLChakraProps<"div">;
export const DrawerBodySlot = withContext<HTMLDivElement, DrawerBodySlotProps>(
  "div",
  "body"
);

// Footer slot - drawer footer section with actions
export type DrawerFooterSlotProps = HTMLChakraProps<"footer">;
export const DrawerFooterSlot = withContext<HTMLElement, DrawerFooterSlotProps>(
  "footer",
  "footer"
);

// Title slot - accessible drawer title
export type DrawerTitleSlotProps = HTMLChakraProps<"h2">;
export const DrawerTitleSlot = withContext<
  HTMLHeadingElement,
  DrawerTitleSlotProps
>("h2", "title");

// Close trigger slot - div container for positioning close button
export type DrawerCloseTriggerSlotProps = HTMLChakraProps<"div">;
export const DrawerCloseTriggerSlot = withContext<
  HTMLDivElement,
  DrawerCloseTriggerSlotProps
>("div", "closeTrigger");
