import { List } from "@commercetools/nimbus";
import { MenuProps } from "../menu.types";
import { MenuItem } from "./menu-item";

/**
 * Renders a list of menu items. Lists from the third level down are indented
 * and hang from a thin line, so the nesting is visible.
 *
 * @param {MenuProps} props - The properties for the MenuList component.
 */
export const MenuList = ({ items, level = 0 }: MenuProps) => {
  const isNested = level >= 2;

  return (
    <List.Root
      variant="plain"
      ml={isNested ? "500" : "100"}
      borderLeft={isNested ? "solid-25" : undefined}
      borderColor="neutral.6"
    >
      {items.map((item) => (
        <List.Item key={item.id} display="block">
          <MenuItem item={item} level={level} />
        </List.Item>
      ))}
    </List.Root>
  );
};
