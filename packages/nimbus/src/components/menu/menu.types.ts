import type { ReactNode } from "react";
import type { Key } from "react-aria-components";
import type { HTMLChakraProps } from "@chakra-ui/react";

export interface MenuTriggerProps
  extends Omit<HTMLChakraProps<"button">, "slot"> {
  children: ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
  asChild?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  slot?: string | null | undefined;
}

export interface MenuContentProps
  extends Omit<HTMLChakraProps<"div">, "slot" | "id"> {
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
  isLoading?: boolean;
  slot?: string | null | undefined;
}

export interface MenuItemProps
  extends Omit<HTMLChakraProps<"div">, "slot" | "id"> {
  children: ReactNode;
  id?: Key;
  isDisabled?: boolean;
  onAction?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  textValue?: string;
  isSelected?: boolean;
  isDanger?: boolean;
  isLoading?: boolean;
  slot?: string | null | undefined;
}

export interface MenuSeparatorProps
  extends Omit<HTMLChakraProps<"div">, "slot"> {}

export interface MenuGroupProps
  extends Omit<HTMLChakraProps<"div">, "slot"> {
  children: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  slot?: string | null | undefined;
}

export interface MenuGroupLabelProps
  extends Omit<HTMLChakraProps<"div">, "slot"> {
  children: ReactNode;
  slot?: string | null | undefined;
}

export interface MenuItemLabelProps
  extends Omit<HTMLChakraProps<"span">, "slot"> {
  children: ReactNode;
  slot?: string | null | undefined;
}

export interface MenuItemDescriptionProps
  extends Omit<HTMLChakraProps<"span">, "slot"> {
  children: ReactNode;
  slot?: string | null | undefined;
}

export interface MenuItemKeyboardProps
  extends Omit<HTMLChakraProps<"span">, "slot"> {
  children: ReactNode;
  slot?: string | null | undefined;
}

export interface MenuRootProps
  extends Omit<HTMLChakraProps<"div">, "slot"> {
  children: ReactNode;
  onAction?: (key: Key) => void;
  onOpenChange?: (isOpen: boolean) => void;
  isOpen?: boolean;
  defaultOpen?: boolean;
  closeOnSelect?: boolean;
  slot?: string | null | undefined;
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
