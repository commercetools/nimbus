import { createContext, useContext } from "react";
import type { MenuContextValue } from "./menu.types";

const MenuContext = createContext<MenuContextValue | null>(null);

export const MenuProvider = MenuContext.Provider;

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  return context;
};
