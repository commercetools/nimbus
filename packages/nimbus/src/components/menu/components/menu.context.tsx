import { createContext, useContext } from "react";
import type { MenuRootProps } from "./../menu.types";

export type MenuContextValue = Pick<
  MenuRootProps,
  | "onAction"
  | "selectionMode"
  | "selectedKeys"
  | "defaultSelectedKeys"
  | "onSelectionChange"
  | "disallowEmptySelection"
  | "placement"
>;

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export const MenuProvider = MenuContext.Provider;

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  return context;
};
