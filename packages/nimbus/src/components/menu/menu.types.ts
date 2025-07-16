import type { ReactNode, Ref } from "react";
import type {
  MenuTriggerProps as RaMenuTriggerProps,
  MenuProps as RaMenuProps,
  MenuItemProps as RaMenuItemProps,
  ButtonProps as RaButtonProps,
  PopoverProps as RaPopoverProps,
  SeparatorProps as RaSeparatorProps,
  SectionProps as RaSectionProps,
} from "react-aria-components";
import type { MenuRootSlotProps, MenuTriggerSlotProps } from "./menu.slots";

// Root component that wraps MenuTrigger
export interface MenuRootProps
  extends Omit<MenuRootSlotProps, "children" | "css" | "asChild" | "as">,
    Omit<RaMenuTriggerProps, "trigger">,
    Pick<
      RaMenuProps<object>,
      | "onAction"
      | "selectionMode"
      | "selectedKeys"
      | "defaultSelectedKeys"
      | "onSelectionChange"
      | "disallowEmptySelection"
    > {
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
  isCritical?: boolean;
  ref?: Ref<HTMLDivElement>;
}

// Menu separator component
export interface MenuSeparatorProps extends RaSeparatorProps {
  ref?: Ref<HTMLDivElement>;
}

// Menu section component
export interface MenuSectionProps<T = object>
  extends Omit<RaSectionProps<T>, "children">,
    Pick<
      RaMenuProps<T>,
      | "selectionMode"
      | "selectedKeys"
      | "defaultSelectedKeys"
      | "onSelectionChange"
      | "disallowEmptySelection"
    > {
  ref?: Ref<HTMLDivElement>;
  /**
   * Label for the section header
   */
  label: ReactNode;
  /**
   * Item objects in the section for collection pattern
   */
  items?: Iterable<T>;
  /**
   * Children can be static items or a function to render items from collection
   */
  children?: ReactNode | ((item: T) => ReactNode);
}

// Menu section label component - Header doesn't have props type, so we'll use basic props
export interface MenuSectionLabelProps {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

// Menu submenu component - extends MenuContentProps
export interface MenuSubmenuProps extends MenuContentProps {}

// Menu submenu trigger component
export interface MenuSubmenuTriggerProps {
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}
