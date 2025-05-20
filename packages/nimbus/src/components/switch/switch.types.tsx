import type { HTMLChakraProps, RecipeVariantProps } from "@chakra-ui/react";
import { switchSlotRecipe } from "./switch.recipe";
import type { AriaCheckboxProps } from "react-aria";

/**
 * List of props that should be excluded from the root props when combining with ARIA props
 */
export type ExcludedSwitchProps =
  | "asChild"
  | "isIndeterminate"
  | "colorScheme"
  | "validationState"
  | "validationBehavior"
  | "validate";

/**
 * Props for the Switch component root element.
 * Includes all HTML props for the label element and recipe variant props.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SwitchRootProps
  extends HTMLChakraProps<
    "label",
    RecipeVariantProps<typeof switchSlotRecipe>
  > {}

/**
 * Main props interface for the Switch component.
 * Combines root element props with ARIA toggle functionality props.
 */
export type SwitchProps = Omit<
  SwitchRootProps,
  ExcludedSwitchProps | "onChange"
> &
  Omit<AriaCheckboxProps, ExcludedSwitchProps> & {
    /**
     * The content to display next to the switch.
     * Can be a string or React node.
     */
    children?: React.ReactNode;
  };
