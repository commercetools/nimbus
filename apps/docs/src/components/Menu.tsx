import { Box, Text, List } from "@bleh-ui/react";
import { useAtom, useAtomValue } from "jotai";

import { menuAtom } from "../atoms/menu";
import { activeRouteAtom } from "../atoms/route";

type MenuItem = {
  id: string;
  label: string;
  slug: string;
  children?: MenuItem[];
};

type MenuProps = {
  items: MenuItem[];
  level: number;
};

const MenuList: React.FC<MenuProps> = ({
  items,
  level = 0,
}: {
  items: MenuItem[];
  level: number;
}) => {
  return (
    <List.Root variant="plain">
      {items.map((item) => (
        <List.Item key={item.id} display="block">
          <MenuItemComponent item={item} level={level + 1} />
        </List.Item>
      ))}
    </List.Root>
  );
};

const MenuItemComponent: React.FC<{ item: MenuItem; level: number }> = ({
  item,
  level,
}) => {
  const [activeRoute, setActiveRoute] = useAtom(activeRouteAtom);
  const isActiveRoute = activeRoute === item.slug;

  const onLinkClick = (e, path) => {
    e.preventDefault();
    setActiveRoute(path);
  };

  return (
    <Box display="block" mb={level === 1 ? "6" : undefined}>
      <Text
        colorPalette={isActiveRoute ? "primary" : "neutral"}
        display="block"
        color={level === 1 ? "coloPalette.12" : "colorPalette.11"}
        fontWeight={isActiveRoute || level === 1 ? "700" : "400"}
        height="10"
        px="4"
        py="2"
        bg={isActiveRoute ? "colorPalette.3" : "transparent"}
        _hover={{
          bg: isActiveRoute ? "colorPalette.3" : "colorPalette.2",
        }}
        asChild
        transition="backgrounds"
        transitionTimingFunction="ease-out-in"
        transitionDuration="slow"
      >
        <a href={`/${item.slug}`} onClick={(e) => onLinkClick(e, item.slug)}>
          {level > 3 && "└ "}
          {item.label}
        </a>
      </Text>
      {item.children && item.children.length > 0 && (
        <MenuList items={item.children} level={level + 1} />
      )}
    </Box>
  );
};

export const Menu = () => {
  const menuJson = useAtomValue(menuAtom);

  return <MenuList items={menuJson} level={0} />;
};
