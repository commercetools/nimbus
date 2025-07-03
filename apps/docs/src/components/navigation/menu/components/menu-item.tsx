import { useAtom } from "jotai";
import { type MenuItemProps } from "../menu.types";
import { activeRouteAtom } from "@/atoms/route";
import { useEffect, useState } from "react";
import { Box, Link, Text } from "@commercetools/nimbus";
import { MenuIcon } from "./menu-icon";
import { MenuList } from "./menu-list";

/**
 * MenuItem component
 * @param {MenuItemProps} props - The props for the MenuItem component
 */
export const MenuItem = ({ item, level }: MenuItemProps) => {
  const [activeRoute] = useAtom(activeRouteAtom);
  const isParentItem = activeRoute.includes(item.slug);
  const isActiveRoute = activeRoute === item.slug;
  const [isOpen, setIsOpen] = useState(
    isParentItem || isActiveRoute || level === 0
  );

  useEffect(() => {
    if (!isActiveRoute) {
      setIsOpen(isParentItem);
    }
  }, [isActiveRoute, isParentItem]);

  const marginLeft = level > 2 ? `400` : undefined;

  return (
    <Box display="block" mb={level === 0 ? "600" : undefined}>
      <Text
        colorPalette={isActiveRoute ? "primary" : "neutral"}
        display="block"
        color={level === 0 ? "colorPalette.12" : "colorPalette.11"}
        fontWeight={level === 0 ? "700" : "400"}
        minHeight="1000"
        px="400"
        py="200"
        bg={isActiveRoute ? "colorPalette.3" : "transparent"}
        _hover={{
          bg: isActiveRoute ? "colorPalette.3" : "colorPalette.2",
        }}
        asChild
        transition="backgrounds"
        transitionTimingFunction="ease-out-in"
        transitionDuration="slow"
        ml={marginLeft}
      >
        <Link unstyled href={item.slug}>
          {level > 1 && (
            <Text display="inline" mr="200" position="relative">
              └
            </Text>
          )}
          {item.icon && <MenuIcon id={item.icon} />}
          {item.label}
        </Link>
      </Text>
      {item.children &&
        item.children.length > 0 &&
        (isOpen || level === 0 || isActiveRoute) && (
          <MenuList items={item.children} level={level + 1} />
        )}
    </Box>
  );
};
