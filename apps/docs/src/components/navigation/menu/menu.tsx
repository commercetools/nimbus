import { useAtomValue } from "jotai";
import { menuAtom } from "@/atoms/menu";
import { MenuList } from "./components/menu-list";
import { findActiveSection } from "./shape-navigation";
import { useRouteInfo } from "@/hooks/use-route-info";

/**
 * The sidebar menu. Shows the rows of the section the current page belongs
 * to (the section that is active in the top bar).
 */
export const Menu = () => {
  const sections = useAtomValue(menuAtom);
  const { baseRoute } = useRouteInfo();
  const activeSection = findActiveSection(sections, baseRoute);

  // A route outside every section falls back to the list of all sections.
  return <MenuList items={activeSection?.children ?? sections} level={0} />;
};
