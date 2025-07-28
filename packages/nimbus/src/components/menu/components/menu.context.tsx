import { createContext, useContext } from "react";
import type { MenuRootProps } from "./../menu.types";
import type { MenuTriggerProps as RaMenuTriggerProps } from "react-aria-components";

// Context should contain all Menu props (excluding MenuTrigger-specific props)
export type MenuContextValue = Omit<
  MenuRootProps,
  keyof RaMenuTriggerProps | "children" | "trigger"
>;

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export const MenuProvider = MenuContext.Provider;

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  return context;
};
