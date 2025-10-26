import { useAtomValue } from "jotai";
import { useLocation } from "react-router-dom";
import { menuAtom } from "@/atoms/menu";
import { normalizeRoute } from "@/utils/normalize-route";
import { MenuList } from "./components/menu-list";

/**
 * Component representing the main menu.
 * Displays only the sub-items of the currently selected top-level menu item.
 */
export const Menu = () => {
  const menuItems = useAtomValue(menuAtom);
  const location = useLocation();
  const activeRoute = normalizeRoute(location.pathname);

  // Extract the top-level route (first part before any /)
  const topLevelRoute = activeRoute.split("/")[0];

  // Find the active top-level item
  const activeTopLevelItem = menuItems?.find(
    (item) => item.route === topLevelRoute
  );

  // If we found the active item and it has children, show only its children
  // Otherwise show all items (fallback)
  const itemsToDisplay = activeTopLevelItem?.children || menuItems;

  return <MenuList items={itemsToDisplay} level={0} />;
};
