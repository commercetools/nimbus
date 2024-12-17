import { useAtom } from "jotai";
import { type MenuItemProps } from "../menu.types";
import { activeRouteAtom } from "@/atoms/route";
import { useEffect, useState } from "react";
import { Box, Text } from "@bleh-ui/react";
import { MenuIcon } from "./menu-icon";
import { MenuList } from "./menu-list";

/**
 * MenuItem component
 * @param {MenuItemProps} props - The props for the MenuItem component
 */
export const MenuItem = ({ item, level }: MenuItemProps) => {
  const [activeRoute, setActiveRoute] = useAtom(activeRouteAtom);
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

  /**
   * Handles link click event
   * @param {React.MouseEvent<HTMLAnchorElement>} e - The click event
   * @param {string} path - The path to set as active route
   */
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    if (level > 0) {
      setIsOpen(!isOpen);
    }
    setActiveRoute(path);
  };

  const marginLeft = level > 2 ? `4` : undefined;

  return (
    <Box display="block" mb={level === 0 ? "6" : undefined}>
      <Text
        colorPalette={isActiveRoute ? "primary" : "neutral"}
        display="block"
        color={level === 0 ? "colorPalette.12" : "colorPalette.11"}
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
        ml={marginLeft}
      >
        <a
          href={`/${item.slug}`}
          onClick={(e) => handleLinkClick(e, item.slug)}
        >
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
