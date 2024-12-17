export type TMenuItem = {
  id: string;
  label: string;
  slug: string;
  icon?: string;
  children?: TMenuItem[];
};

export type MenuProps = {
  items: TMenuItem[];
  level: number;
};

export type MenuItemProps = {
  item: TMenuItem;
  level: number;
};

export type MenuIconProps = {
  /** icon identifier */
  id: string;
};
