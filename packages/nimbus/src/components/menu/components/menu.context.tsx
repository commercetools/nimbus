import { createContext, useContext } from "react";
import type { MenuContentProps } from "./../menu.types";

export type MenuContextValue = Pick<
  MenuContentProps,
  | "onAction"
  | "selectionMode"
  | "selectedKeys"
  | "defaultSelectedKeys"
  | "onSelectionChange"
  | "disallowEmptySelection"
>;

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export const MenuProvider = MenuContext.Provider;

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  return context;
};
