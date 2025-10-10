import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { ReactNode, Ref } from "react";
import type {
  DisclosureGroupProps as RaDisclosureGroupProps,
  DisclosureProps as RaDisclosureProps,
  DisclosurePanelProps as RaDisclosurePanelProps,
  ButtonProps as RaButtonProps,
} from "react-aria-components";

type AccordionRecipeProps = SlotRecipeProps<"accordion">;

export type AccordionRootSlotProps = HTMLChakraProps<
  "div",
  AccordionRecipeProps
>;

/**
 * For use in components that use the polymorphic `as` and `asChild` props
 * internally, but do not make them available to the consumer.
 *
 * Long rambling background:
 * React-Aria's components cannot be configured to use `as` and `asChild` internally,
 * and cannot be directly styled by chakra's styledSystem. Therefore components
 * from `react-aria-components` should be wrapped in a chakra `withContext`
 * root component to set the styles onto the `r-a-c` component using `asChild`.
 * This means that we need to allow polymorphism internally, but should not
 * allow it in the external props api since it would not work.
 */
type ExcludePolymorphicFromProps<T> = Omit<T, "as" | "asChild">;

/**
 * Props for the Accordion Root component.
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
 * Props for individual Accordion Item components.
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
 * Props for Accordion Header component.
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
 * Props for Accordion Content component.
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
