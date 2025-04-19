import { ReactNode } from "react";
import { Box, BoxProps } from "@commercetools/nimbus";
import { useStickyScroll } from "../../hooks/useStickyScroll";

export interface StickySidebarProps extends Omit<BoxProps, "ref"> {
  children: ReactNode;
  id?: string;
}

/**
 * A sidebar component that implements sticky scroll behavior
 * Stays sticky at the top until content is scrolled to the end
 */
export function StickySidebar({
  children,
  id,
  ...boxProps
}: StickySidebarProps) {
  const { sidebarRef, sidebarStyles } = useStickyScroll();

  return (
    <Box
      ref={sidebarRef}
      position="sticky"
      overflowY="auto"
      id={id}
      style={{
        position: sidebarStyles.position,
        top: sidebarStyles.top,
        height: sidebarStyles.height,
        overflowY: sidebarStyles.overflowY,
        display: sidebarStyles.display,
        flexDirection: sidebarStyles.flexDirection,
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
