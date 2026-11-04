import type { NavigationItem } from "./shape-navigation";

export type MenuProps = {
  items: NavigationItem[];
  level: number;
};

export type MenuItemProps = {
  item: NavigationItem;
  level: number;
};
