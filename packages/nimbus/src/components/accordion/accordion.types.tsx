import type { RecipeVariantProps } from "@chakra-ui/react/styled-system";
import { accordionSlotRecipe } from "./accordion.recipe";
import type { ReactNode } from "react";
import type {
  DisclosureGroupProps as RaDisclosureGroupProps,
  DisclosureProps as RaDisclosureProps,
  DisclosurePanelProps as RaDisclosurePanelProps,
  ButtonProps as RaButtonProps,
} from "react-aria-components";

/**
 * Props for the Accordion Root component.
 * Controls the overall accordion container and behavior.
 */
export interface AccordionRootProps
  extends RaDisclosureGroupProps,
    RecipeVariantProps<typeof accordionSlotRecipe> {
  /** The accordion items to display */
  children: ReactNode;
}

/**
 * Props for individual Accordion Item components.
 */
export interface AccordionItemProps extends RaDisclosureProps {
  /** The accordion item content (Header and Content components) */
  children: ReactNode;
  /** Unique value for this item (used for controlled state) */
  value?: string;
}

/**
 * Props for Accordion Header component.
 * Displays the clickable header that expands/collapses content.
 */
export interface AccordionHeaderProps extends RaButtonProps {
  /** The header content to display */
  children: ReactNode;
}

/**
 * Props for Accordion Content component.
 * Contains the collapsible content area.
 */
export interface AccordionContentProps extends RaDisclosurePanelProps {
  /** The content to display when expanded */
  children: ReactNode;
}
