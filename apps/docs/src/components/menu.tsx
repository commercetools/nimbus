import { Box, Text, List } from "@bleh-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { menuAtom } from "../atoms/menu";
import { activeRouteAtom } from "../atoms/route";
import * as iconModule from "@bleh-ui/icons";

const MenuIcon = ({ id }: { id: string }) => {
  const IconComponent = (iconModule as any).icons[id];

  if (IconComponent) {
    return (
      <Text
        as="span"
        display="inline-block"
        position="relative"
        top="0.5"
        mr="2"
      >
        <IconComponent size="1em" />
      </Text>
    );
  }
  return (
    <Text as="span" display="inline-block" mr="2" fontSize="sm">
      {id}
    </Text>
  );
};

type MenuItem = {
  id: string;
  label: string;
  slug: string;
  icon?: string;
  children?: MenuItem[];
};

type MenuProps = {
  items: MenuItem[];
  level: number;
};

const MenuList: React.FC<MenuProps> = ({ items, level = 0 }) => {
  return (
    <List.Root variant="plain">
      {items.map((item) => (
        <List.Item key={item.id} display="block">
          <MenuItemComponent item={item} level={level} />
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
  const isAParentItem = activeRoute.includes(item.slug);
  const isActiveRoute = activeRoute === item.slug;
  const [isOpen, setIsOpen] = useState(
    isAParentItem || isActiveRoute || level === 0
  );

  useEffect(() => {
    if (!isActiveRoute) {
      setIsOpen(isAParentItem ? true : false);
    }
  }, [isActiveRoute, isAParentItem]);

  const onLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    if (level > 0) {
      setIsOpen(!isOpen);
    }
    setActiveRoute(path);
  };

  const ml = level > 2 ? `4` : undefined;

  return (
    <Box display="block" mb={level === 0 ? "6" : undefined}>
      <Text
        colorPalette={isActiveRoute ? "primary" : "neutral"}
        display="block"
        color={level === 0 ? "coloPalette.12" : "colorPalette.11"}
        fontWeight={isActiveRoute || level === 0 ? "700" : "400"}
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
        ml={ml}
      >
        <a href={`/${item.slug}`} onClick={(e) => onLinkClick(e, item.slug)}>
          {level > 1 && (
            <Text display="inline" mr="2" position="relative">
              └
            </Text>
          )}
          {item.icon && <MenuIcon id={item.icon} />}
          {item.label}
        </a>
      </Text>
      {item.children &&
        item.children.length > 0 &&
        (isOpen || level === 0 || isActiveRoute) && (
          <MenuList items={item.children} level={level + 1} />
        )}
    </Box>
  );
};

export const Menu = () => {
  const menuJson = useAtomValue(menuAtom);
  return <MenuList items={menuJson} level={0} />;
};
