import type {
  RecipeVariantProps,
  HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import { accordionSlotRecipe } from "./accordion.recipe";
import { type DisclosureProps } from "react-aria-components";
import type { ReactNode, RefObject, RefAttributes } from "react";
import type { Key } from "react-aria-components";
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
  /** The currently expanded keys in the group (controlled). */
  expandedKeys?: Iterable<Key>;
  /** The initial expanded keys in the group (uncontrolled). */
  defaultExpandedKeys?: Iterable<Key>;
};

export type DisclosureItemProps = AccordionItemProps & {
  children: ReactNode;
  id?: string;
  value?: string;
  isDisabled?: boolean;
  isExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
};
