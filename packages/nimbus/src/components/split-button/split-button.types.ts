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
   * Accessibility label for the dropdown trigger
   */
  "aria-label": string;
  /**
   * Children should contain:
   * - Icon slot: Icon component with slot="icon" containing an icon element
   * - Menu components: Menu.Item, Menu.Section, Divider
   *
   * The component automatically selects the first enabled Menu.Item as the primary action.
   */
  children: ReactNode;
}
