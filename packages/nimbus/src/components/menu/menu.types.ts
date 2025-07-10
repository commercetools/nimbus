import type { ReactNode, Ref } from "react";
import type {
  Key,
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
    Omit<RaMenuTriggerProps, "trigger"> {
  /**
   * The trigger event to use for the menu.
   * @default "press"
   */
  trigger?: "press" | "longPress";
}

// Trigger button component - inherit children from ButtonProps to support render props
export interface MenuTriggerProps
  extends Omit<MenuTriggerSlotProps, keyof RaButtonProps>,
    RaButtonProps {
  ref?: Ref<HTMLButtonElement>;
}

// Menu content/popover component
export interface MenuContentProps extends RaPopoverProps {
  isLoading?: boolean;
  ref?: Ref<HTMLDivElement>;
  onAction?: (key: Key) => void;
  // Selection props from RaMenuProps
  selectionMode?: "none" | "single" | "multiple";
  selectedKeys?: Iterable<Key>;
  defaultSelectedKeys?: Iterable<Key>;
  onSelectionChange?: (keys: "all" | Set<Key>) => void;
  disallowEmptySelection?: boolean;
}

// Menu item component
export interface MenuItemProps extends RaMenuItemProps {
  isSelected?: boolean;
  isDanger?: boolean;
  isLoading?: boolean;
  ref?: Ref<HTMLDivElement>;
}

// Menu separator component
export interface MenuSeparatorProps extends RaSeparatorProps {
  ref?: Ref<HTMLDivElement>;
}

// Menu group component
export interface MenuGroupProps extends RaSectionProps<object> {
  ref?: Ref<HTMLDivElement>;
}

// Menu group label component - Header doesn't have props type, so we'll use basic props
export interface MenuGroupLabelProps {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

// Menu item sub-components
export interface MenuItemLabelProps {
  children: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

export interface MenuItemDescriptionProps {
  children: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

export interface MenuItemKeyboardProps {
  children: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

export interface MenuItemIconProps {
  children: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}
