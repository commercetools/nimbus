import { createContext, useContext } from "react";

export interface MenuSectionContextValue {
  selectionMode?: "single" | "multiple" | "none";
}
/**
 * Why is a second context (MenuSectionContext) needed?
 *
 * MenuSectionContext enables section-level config for menu items, such as
 * selection mode, which may differ from the global menu context. This allows
 * advanced menus where each section can have its own selection behavior
 * (e.g., one section is single-select, another is multi-select).
 * By scoping context to a section, menu items inherit settings from their
 * nearest section, falling back to the global menu context if not present.
 * This pattern improves flexibility and composability for complex menus,
 * and avoids prop drilling or awkward prop merging.
 */

const MenuSectionContext = createContext<MenuSectionContextValue | undefined>(
  undefined
);

export const MenuSectionProvider = MenuSectionContext.Provider;

export const useMenuSectionContext = () => {
  return useContext(MenuSectionContext);
};
