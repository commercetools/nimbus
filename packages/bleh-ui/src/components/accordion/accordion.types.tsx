import type { RecipeVariantProps, HTMLChakraProps } from "@chakra-ui/react";
import { accordionSlotRecipe } from "./accordion.recipe";
import { type DisclosureProps } from "react-aria-components";
import type { ReactNode, RefObject } from "react";
import { useButton, useDisclosure } from "react-aria";
import type { useDisclosureState } from "react-stately";

export type AccordionRootProps = HTMLChakraProps<
  "div",
  RecipeVariantProps<typeof accordionSlotRecipe>
>;

export type AccordionComposition = {
  state: ReturnType<typeof useDisclosureState>;
  buttonProps: ReturnType<typeof useButton>["buttonProps"];
  panelProps: ReturnType<typeof useDisclosure>["panelProps"];
  triggerRef: RefObject<HTMLButtonElement>;
  panelRef: RefObject<HTMLDivElement>;
  isFocusVisible: boolean;
};
export interface AccordionProps
  extends Omit<DisclosureProps, "children" | "id"> {
  additionalTriggerComponent?: ReactNode;
  children: ReactNode;
  recipe?: string;
  size?: AccordionRootProps["size"];
}
