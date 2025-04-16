import { NimbusProvider, Flex, Box, Stack } from "@commercetools/nimbus";
import { Menu } from "./components/navigation/menu";
import { DocumentRenderer } from "./components/document-renderer";
import { Toc } from "./components/navigation/toc";
import { AppNavBar } from "./components/navigation/app-nav-bar";
import { useAtom } from "jotai";
import { activeRouteAtom } from "./atoms/route";
import { useEffect } from "react";
import { Chatbot } from "./components/chatbot";
import { DevOnly } from "./components/utils/dev-only.tsx";
import { DocumentMetaSettings } from "./components/document-meta-settings/document-meta-settings.tsx";
import { createSidebarHook } from "./hooks/useStickyScroll";

// Create separate hooks for left and right sidebars
const useLeftSidebar = createSidebarHook();
const useRightSidebar = createSidebarHook();

function App() {
  const [activeRoute, setActiveroute] = useAtom(activeRouteAtom);

  // Initialize sidebar hooks
  const { sidebarRef: leftSidebarRef, sidebarStyles: leftSidebarStyles } =
    useLeftSidebar();

  const { sidebarRef: rightSidebarRef, sidebarStyles: rightSidebarStyles } =
    useRightSidebar();

  useEffect(() => {
    const handleRouteChange = () => {
      const route = location.pathname.slice(1);
      setActiveroute(route);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [activeRoute]);

  useEffect(() => {
    if (!activeRoute) {
      setActiveroute("home");
    }

    const currentRoute = location.pathname.slice(1);
    const routeChanged = currentRoute !== activeRoute;

    if (routeChanged) {
      history.pushState({ activeRoute }, "", "/" + activeRoute);
    }
  }, [activeRoute]);

  return (
    <NimbusProvider>
      <>
        <Flex direction="column" width="full" maxWidth="1600px" mx="auto">
          <Box position="sticky" top="0" zIndex="1" bg="neutral.1">
            <AppNavBar />
          </Box>

          <Flex zIndex="0" flexGrow="1" flexShrink="1">
            <Box
              as="nav"
              width="7200"
              borderRight="solid-25"
              borderColor="neutral.3"
              flexShrink="0"
              pt="600"
              id="sidebar-left"
              ref={leftSidebarRef}
              position="sticky"
              top={0}
              height="100%"
              overflowY="auto"
              style={{
                position: leftSidebarStyles.position,
                top: leftSidebarStyles.top,
                height: leftSidebarStyles.height,
                overflowY: leftSidebarStyles.overflowY,
                display: leftSidebarStyles.display,
                flexDirection: leftSidebarStyles.flexDirection,
              }}
            >
              <Menu />
            </Box>
            <Flex
              id="main"
              as="main"
              flexGrow="1"
              flexShrink="1"
              minWidth="lg"
              pt="800"
              px="1600"
            >
              <DocumentRenderer />
            </Flex>
            <Box
              width="8000"
              borderLeft="solid-25"
              borderColor="neutral.3"
              flexShrink="0"
              px="400"
              pt="600"
              id="sidebar-right"
              ref={rightSidebarRef}
              position="sticky"
              top={0}
              height="100%"
              overflowY="auto"
              style={{
                position: rightSidebarStyles.position,
                top: rightSidebarStyles.top,
                height: rightSidebarStyles.height,
                overflowY: rightSidebarStyles.overflowY,
                display: rightSidebarStyles.display,
                flexDirection: rightSidebarStyles.flexDirection,
              }}
            >
              <Stack gap="800">
                <DevOnly>
                  <DocumentMetaSettings />
                </DevOnly>
                <Toc />
              </Stack>
            </Box>
          </Flex>
        </Flex>
        <DevOnly>
          <Chatbot />
        </DevOnly>
      </>
    </NimbusProvider>
  );
}

export default App;
