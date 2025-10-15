import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { ReactNode, Ref } from "react";
import type {
  DisclosureGroupProps as RaDisclosureGroupProps,
  DisclosureProps as RaDisclosureProps,
  DisclosurePanelProps as RaDisclosurePanelProps,
  ButtonProps as RaButtonProps,
} from "react-aria-components";
import type { ExcludePolymorphicFromProps } from "@/components/utils/type-helpers";

// ============================================================
// RECIPE PROPS
// ============================================================

type AccordionRecipeProps = SlotRecipeProps<"accordion">;

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
export type AccordionRootProps = AccordionRootSlotProps &
  RaDisclosureGroupProps & {
    /** The accordion items to display */
    children: ReactNode;
    /** Ref to the root element */
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for the Accordion.Item component.
 */
export type AccordionItemProps = ExcludePolymorphicFromProps<
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
export type AccordionHeaderProps = ExcludePolymorphicFromProps<
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
export type AccordionContentProps = ExcludePolymorphicFromProps<
  RaDisclosurePanelProps & HTMLChakraProps<"div">
> & {
  /** The content to display when expanded */
  children: ReactNode;
  /** Ref to the content element */
  ref?: Ref<HTMLDivElement>;
};
