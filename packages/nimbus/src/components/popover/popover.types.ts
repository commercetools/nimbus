import type { ReactNode, Ref } from "react";
import type { RecipeVariantProps, HTMLChakraProps } from "@chakra-ui/react";
import type {
  DialogTriggerProps,
  PopoverProps as RAPopoverProps,
} from "react-aria-components";
import { popoverRecipe } from "./popover.recipe";

/**
 * Root component props that wraps around trigger and content.
 * Manages the popover state and positioning.
 */
export interface PopoverRootProps extends DialogTriggerProps {
  children: ReactNode;
}

/**
 * Trigger component props that renders the element that opens the popover.
 */
export interface PopoverTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Content component props for the popover content area.
 */
export interface PopoverContentProps
  extends HTMLChakraProps<"div">,
    RecipeVariantProps<typeof popoverRecipe> {
  children: ReactNode;
  /**
   * The placement of the popover relative to the trigger.
   * @default "bottom"
   */
  placement?: RAPopoverProps["placement"];
  /**
   * The offset distance from the trigger.
   * @default 4
   */
  offset?: RAPopoverProps["offset"];
  /**
   * Whether the popover should flip when it would overflow.
   * @default true
   */
  shouldFlip?: RAPopoverProps["shouldFlip"];
  ref?: Ref<HTMLDivElement>;
}
