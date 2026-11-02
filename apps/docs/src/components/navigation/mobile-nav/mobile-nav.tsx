import { useEffect, useState } from "react";
import { Box, Drawer, Icon, IconButton } from "@commercetools/nimbus";
import { Menu as MenuIcon } from "@commercetools/nimbus-icons";
import { Menu } from "@/components/navigation/menu";
import { useRouteInfo } from "@/hooks/use-route-info";

/**
 * Navigation for narrow screens. Below the `lg` breakpoint the app frame hides
 * the sidebar, so this shows a menu button that opens the same menu in a
 * drawer. The drawer closes when the route changes.
 */
export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { baseRoute } = useRouteInfo();

  useEffect(() => {
    setIsOpen(false);
  }, [baseRoute]);

  return (
    <Box display={{ base: "block", lg: "none" }}>
      <IconButton
        aria-label="Open navigation"
        size="xs"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      >
        <Icon as={MenuIcon} slot="icon" />
      </IconButton>
      <Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen} placement="left">
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Navigation</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>
          <Drawer.Body>
            <Menu />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </Box>
  );
};
