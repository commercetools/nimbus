import { List } from "@commercetools/nimbus";
import { MenuProps } from "../menu.types";
import { MenuItem } from "./menu-item";

/**
 * Renders a list of menu items.
 *
 * @param {MenuListProps} props - The properties for the MenuList component.
 * @returns {JSX.Element} The rendered MenuList component.
 */
export const MenuList = ({ items, level = 0 }: MenuProps): JSX.Element => {
  return (
    <List.Root variant="plain" ml="100">
      {items.map((item) => (
        <List.Item key={item.id} display="block">
          <MenuItem item={item} level={level} />
        </List.Item>
      ))}
    </List.Root>
  );
};
