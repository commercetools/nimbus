import type { ReactNode, Ref } from "react";
import type {
  MenuTriggerProps as RaMenuTriggerProps,
  MenuProps as RaMenuProps,
  MenuItemProps as RaMenuItemProps,
  ButtonProps as RaButtonProps,
  PopoverProps as RaPopoverProps,
  MenuSectionProps as RaMenuSectionProps,
  SubmenuTriggerProps as RaSubmenuTriggerProps,
} from "react-aria-components";
import type { RecipeVariantProps } from "@chakra-ui/react/styled-system";
import type { MenuTriggerSlotProps } from "./menu.slots";
import { menuSlotRecipe } from "./menu.recipe";

// Root component that wraps MenuTrigger
export type MenuRootProps = Omit<RaMenuTriggerProps, "trigger" | "children"> &
  Omit<RaMenuProps<object>, "children"> &
  RecipeVariantProps<typeof menuSlotRecipe> & {
    /**
     * The trigger element and menu content
     */
    children: ReactNode;
    /**
     * The trigger event to use for the menu.
     * @default "press"
     */
    trigger?: "press" | "longPress";
    /**
     * The placement of the menu relative to the trigger.
     * @default "bottom start"
     */
    placement?: RaPopoverProps["placement"];
  };

// Menu trigger component
export type MenuTriggerProps = Omit<MenuTriggerSlotProps, keyof RaButtonProps> &
  RaButtonProps & {
    ref?: Ref<HTMLButtonElement>;
  };

// Menu content/popover component
export type MenuContentProps = {
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
  /**
   * The placement of the menu relative to the trigger.
   */
  placement?: RaPopoverProps["placement"];
};

// Menu item component
export type MenuItemProps = RaMenuItemProps & {
  /**
   * if set to `true`, highlights the item as critical (red)
   * */
  isCritical?: boolean;
  ref?: Ref<HTMLDivElement>;
};

// Menu section component
export type MenuSectionProps<T = object> = RaMenuSectionProps<T> & {
  ref?: Ref<HTMLDivElement>;
  /**
   * Label for the section header
   */
  label: ReactNode;
};

// Menu section label component - Header doesn't have props type, so we'll use basic props
export type MenuSectionLabelProps = {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

// Menu submenu component - extends MenuContentProps
export type MenuSubmenuProps = MenuContentProps;

// Menu submenu trigger component
export type MenuSubmenuTriggerProps = RaSubmenuTriggerProps & {
  ref?: Ref<HTMLDivElement>;
};
