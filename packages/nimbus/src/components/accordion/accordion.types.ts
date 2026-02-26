import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { ReactNode, Ref } from "react";
import type {
  DisclosureGroupProps as RaDisclosureGroupProps,
  DisclosureProps as RaDisclosureProps,
  DisclosurePanelProps as RaDisclosurePanelProps,
  ButtonProps as RaButtonProps,
} from "react-aria-components";
// TODO: this needs to be an @/ import
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type AccordionRecipeProps = SlotRecipeProps<"nimbusAccordion">;

// ============================================================
// SLOT PROPS
// ============================================================

export type AccordionRootSlotProps = HTMLChakraProps<
  "div",
  AccordionRecipeProps
>;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Accordion.Root component.
 * Controls the overall accordion container and behavior.
 */
export type AccordionRootProps = OmitInternalProps<AccordionRootSlotProps> &
  RaDisclosureGroupProps & {
    /** The accordion items to display */
    children: ReactNode;
    /** Ref to the root element */
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for the Accordion.Item component.
 */
export type AccordionItemProps = OmitInternalProps<
  RaDisclosureProps & HTMLChakraProps<"div">
> & {
  /** The accordion item content (Header and Content components) */
  children: ReactNode;
  /** Unique value for this item (used for controlled state) */
  value?: string;
  /** Ref to the item element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Accordion.Header component.
 * Displays the clickable header that expands/collapses content.
 */
export type AccordionHeaderProps = OmitInternalProps<
  RaButtonProps & HTMLChakraProps<"div">
> & {
  /** The header content to display */
  children: ReactNode;
  /** Ref to the header element */
  ref?: Ref<HTMLButtonElement>;
};

/**
 * Props for the Accordion.Content component.
 * Contains the collapsible content area.
 */
export type AccordionContentProps = OmitInternalProps<
  RaDisclosurePanelProps & HTMLChakraProps<"div">
> & {
  /** The content to display when expanded */
  children: ReactNode;
  /** Ref to the content element */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the Accordion.HeaderRightContent component.
 * Optional content that appears on the right side of the accordion header.
 */
export type AccordionHeaderRightContentProps = OmitInternalProps<
  HTMLChakraProps<"div">
> & {
  /** The content to display on the right side of the header */
  children: ReactNode;
  /** Ref to the element */
  ref?: Ref<HTMLDivElement>;
};
