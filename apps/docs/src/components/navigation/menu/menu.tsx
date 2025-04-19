import { useAtomValue } from "jotai";
import { menuAtom } from "@/src/atoms/menu";
import { MenuList } from "./components/menu-list";

/**
 * Component representing the main menu.
 * It fetches the menu items from the menuAtom and passes them to the MenuList component.
 */
export const Menu = () => {
  // Retrieve the menu items from the atom
  const menuItems = useAtomValue(menuAtom);

  return <MenuList items={menuItems} level={0} />;
};
