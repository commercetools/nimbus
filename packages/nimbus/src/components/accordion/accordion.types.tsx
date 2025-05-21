import type { RecipeVariantProps, HTMLChakraProps } from "@chakra-ui/react";
import { accordionSlotRecipe } from "./accordion.recipe";
import { type DisclosureProps } from "react-aria-components";
import type { ReactNode, RefAttributes } from "react";

export type AccordionRootProps = HTMLChakraProps<
  "div",
  RecipeVariantProps<typeof accordionSlotRecipe>
>;

export interface AccordionProps
  extends Omit<DisclosureProps, "children" | "id"> {
  additionalTriggerComponent?: ReactNode;
  children: ReactNode;
  recipe?: string;
  size?: "sm" | "md";
}

export type AccordionItemProps = {
  isDisabled?: boolean;
  isExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
  id?: string;
  children: ReactNode;
  title?: string;
};

export type DisclosureGroupProps = AccordionProps & {
  children: ReactNode;
  ref?: RefAttributes<HTMLButtonElement>;
  allowsMultipleExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
  isDisabled?: boolean;
  isExpanded?: boolean;
};

export type DisclosureItemProps = AccordionItemProps & {
  children: ReactNode;
  id?: string;
  value?: string;
  isDisabled?: boolean;
  isExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
};
