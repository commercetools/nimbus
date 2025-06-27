import type { ReactNode } from "react";
import type { Key } from "react-aria-components";
import type { RecipeVariantProps } from "@chakra-ui/react";
import type { menuSlotRecipe } from "./menu.recipe";

export interface MenuTriggerProps {
  children: ReactNode;
  isDisabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export interface MenuContentProps {
  children: ReactNode;
  placement?:
    | "bottom"
    | "bottom start"
    | "bottom end"
    | "top"
    | "top start"
    | "top end"
    | "start"
    | "end"
    | "left"
    | "right";
  offset?: number;
  shouldFlip?: boolean;
}

export interface MenuItemProps {
  children: ReactNode;
  id?: Key;
  isDisabled?: boolean;
  onAction?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  textValue?: string;
}

export interface MenuSeparatorProps {
  className?: string;
}

export interface MenuGroupProps {
  children: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export interface MenuGroupLabelProps {
  children: ReactNode;
}

export interface MenuItemLabelProps {
  children: ReactNode;
}

export interface MenuItemDescriptionProps {
  children: ReactNode;
}

export interface MenuItemKeyboardProps {
  children: ReactNode;
}

export interface MenuRootProps
  extends RecipeVariantProps<typeof menuSlotRecipe> {
  children: ReactNode;
  onAction?: (key: Key) => void;
  onOpenChange?: (isOpen: boolean) => void;
  isOpen?: boolean;
  defaultOpen?: boolean;
  closeOnSelect?: boolean;
}

export type MenuTriggerState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export type MenuContextValue = {
  state?: MenuTriggerState | null;
  onAction?: (key: Key) => void;
  closeOnSelect: boolean;
};
