import type { ReactNode } from "react";
import type {
  MenuTriggerProps as RaMenuTriggerProps,
  MenuProps as RaMenuProps,
} from "react-aria-components";
import type { ButtonProps } from "@/components/button";

// Main component props
export interface SplitButtonProps
  extends Omit<RaMenuTriggerProps, "trigger" | "children">,
    Required<Pick<RaMenuProps<object>, "onAction">>,
    Pick<ButtonProps, "size" | "variant" | "tone" | "isDisabled"> {
  /**
   * The ID of the option that should be used as the default primary action.
   * If not provided, the component will render as a regular button that opens the dropdown on click.
   */
  defaultAction?: string;
  /**
   * Accessibility label for the dropdown trigger
   */
  "aria-label": string;
  /**
   * Children should contain:
   * - Icon slot: <Icon slot="icon"><YourIcon /></Icon>
   * - Label slot (regular mode only): <Text slot="label">Button Text</Text>
   * - Menu components: Menu.Item, Menu.Section, Menu.Separator
   *
   * In split button mode, button text comes from the defaultAction Menu.Item.
   * In regular button mode, button text comes from the label slot.
   */
  children: ReactNode;
}
