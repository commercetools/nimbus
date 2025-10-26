import { useLocation } from "react-router-dom";
import { type MenuItemProps } from "../menu.types";
import { normalizeRoute } from "@/utils/normalize-route";
import { useEffect, useState } from "react";
import { Box, Link, Text } from "@commercetools/nimbus";
import { MenuIcon } from "./menu-icon";
import { MenuList } from "./menu-list";

/**
 * MenuItem component
 * @param {MenuItemProps} props - The props for the MenuItem component
 */
export const MenuItem = ({ item, level }: MenuItemProps) => {
  const location = useLocation();
  const activeRoute = normalizeRoute(location.pathname);
  const isParentItem = activeRoute.includes(item.route);
  const isActiveRoute = activeRoute === item.route;
  const [isOpen, setIsOpen] = useState(
    isParentItem || isActiveRoute || level === 0
  );

  useEffect(() => {
    if (!isActiveRoute) {
      setIsOpen(isParentItem);
    }
  }, [isActiveRoute, isParentItem]);

  // Preserve sidebar scroll position on click
  const handleClick = () => {
    const sidebar = document.getElementById("app-frame-left-nav");
    if (sidebar) {
      const scrollPos = sidebar.scrollTop;
      // Store scroll position in sessionStorage as backup
      sessionStorage.setItem("sidebar-scroll", scrollPos.toString());

      // Also force the scroll to stay by setting it multiple times
      requestAnimationFrame(() => {
        if (sidebar) sidebar.scrollTop = scrollPos;
      });
      setTimeout(() => {
        if (sidebar) sidebar.scrollTop = scrollPos;
      }, 0);
    }
  };

  const marginLeft = level > 2 ? `400` : undefined;

  return (
    <Box display="block" mb={level === 0 ? "300" : undefined}>
      <Text
        colorPalette={isActiveRoute ? "primary" : "neutral"}
        display="block"
        color={level === 0 ? "colorPalette.12" : "colorPalette.11"}
        fontWeight={level === 0 ? "700" : "400"}
        px="400"
        py="100"
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
        <Link
          unstyled
          href={`/${item.route}`}
          textDecoration="none"
          onClick={handleClick}
        >
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
