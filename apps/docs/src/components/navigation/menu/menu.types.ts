import type { NavigationItem } from "./shape-navigation";

export type MenuProps = {
  items: NavigationItem[];
  level: number;
};

export type MenuItemProps = {
  item: NavigationItem;
  level: number;
  /** The current page is this row's page. */
  isCurrent: boolean;
  /** The rows below this row are shown. */
  showChildren: boolean;
};
