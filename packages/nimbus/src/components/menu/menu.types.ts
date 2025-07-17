import type { ReactNode, Ref } from "react";
import type {
  MenuTriggerProps as RaMenuTriggerProps,
  MenuProps as RaMenuProps,
  MenuItemProps as RaMenuItemProps,
  ButtonProps as RaButtonProps,
  PopoverProps as RaPopoverProps,
  SeparatorProps as RaSeparatorProps,
  MenuSectionProps as RaMenuSectionProps,
  SubmenuTriggerProps as RaSubmenuTriggerProps,
} from "react-aria-components";
import type { RecipeVariantProps } from "@chakra-ui/react";
import type { MenuTriggerSlotProps } from "./menu.slots";
import { menuSlotRecipe } from "./menu.recipe";

// Root component that wraps MenuTrigger
export interface MenuRootProps
  extends Omit<RaMenuTriggerProps, "trigger" | "children">,
    Omit<RaMenuProps<object>, "children">,
    RecipeVariantProps<typeof menuSlotRecipe> {
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
}

// Menu trigger component
export interface MenuTriggerProps
  extends Omit<MenuTriggerSlotProps, keyof RaButtonProps>,
    RaButtonProps {
  ref?: Ref<HTMLButtonElement>;
}

// Menu content/popover component
export interface MenuContentProps {
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
  /**
   * The placement of the menu relative to the trigger.
   */
  placement?: RaPopoverProps["placement"];
}

// Menu item component
export interface MenuItemProps extends RaMenuItemProps {
  /**
   * if set to `true`, highlights the item as critical (red)
   * */
  isCritical?: boolean;
  ref?: Ref<HTMLDivElement>;
}

// Menu separator component
export interface MenuSeparatorProps extends RaSeparatorProps {
  ref?: Ref<HTMLDivElement>;
}

// Menu section component
export interface MenuSectionProps<T = object> extends RaMenuSectionProps<T> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Label for the section header
   */
  label: ReactNode;
}

// Menu section label component - Header doesn't have props type, so we'll use basic props
export interface MenuSectionLabelProps {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

// Menu submenu component - extends MenuContentProps
export interface MenuSubmenuProps extends MenuContentProps {}

// Menu submenu trigger component
export interface MenuSubmenuTriggerProps extends RaSubmenuTriggerProps {
  ref?: Ref<HTMLDivElement>;
}
