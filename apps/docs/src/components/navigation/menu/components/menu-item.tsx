import { memo } from "react";
import { type MenuItemProps } from "../menu.types";
import { Box, Link, Text } from "@commercetools/nimbus";
import { MenuList } from "./menu-list";
import { useSidebarViewport } from "@/contexts/scroll-container-context";

/**
 * One row of the sidebar menu, followed by the rows below it.
 *
 * A first-level row with rows below it is a group title (bold), and its rows
 * are always shown. Deeper rows show the rows below them only while the
 * current page is inside them. A row without a page is text, not a link.
 *
 * @param {MenuItemProps} props - The props for the MenuItem component
 */
export const MenuItem = memo(function MenuItem({
  item,
  level,
  isCurrent,
  showChildren,
}: MenuItemProps) {
  const sidebarViewportRef = useSidebarViewport();
  const isGroupTitle = level === 0 && item.children.length > 0;

  // Preserve sidebar scroll position on click
  const handleClick = () => {
    const sidebar = sidebarViewportRef.current;
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

  return (
    <Box display="block" mb={isGroupTitle ? "300" : undefined}>
      <Text
        colorPalette={isCurrent ? "primary" : "neutral"}
        display="block"
        color={isGroupTitle ? "colorPalette.12" : "colorPalette.11"}
        fontWeight={isGroupTitle ? "700" : "400"}
        px="400"
        py="100"
        bg={isCurrent ? "colorPalette.3" : "transparent"}
        _hover={
          item.hasPage
            ? { bg: isCurrent ? "colorPalette.3" : "colorPalette.2" }
            : undefined
        }
        asChild={item.hasPage}
        transition="backgrounds"
        transitionTimingFunction="ease-out-in"
        transitionDuration="slow"
      >
        {item.hasPage ? (
          <Link
            unstyled
            href={`/${item.route}`}
            textDecoration="none"
            aria-current={isCurrent ? "page" : undefined}
            onClick={handleClick}
          >
            {item.label}
          </Link>
        ) : (
          item.label
        )}
      </Text>
      {showChildren && <MenuList items={item.children} level={level + 1} />}
    </Box>
  );
});
