import { createContext, useContext } from "react";

export type MenuSectionContextValue = {
  selectionMode?: "single" | "multiple" | "none";
};

const MenuSectionContext = createContext<MenuSectionContextValue | undefined>(
  undefined
);

export const MenuSectionProvider = MenuSectionContext.Provider;

export const useMenuSectionContext = () => {
  return useContext(MenuSectionContext);
};