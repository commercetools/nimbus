import { UiKitProvider, Flex, Box, Text } from "@bleh-ui/react";
import { Menu } from "./components/Menu";
import { DocumentRenderer } from "./components/DocumentRenderer";
import { Toc } from "./components/Toc";
import { AppNavBar } from "./components/AppNavBar";
import { useAtom } from "jotai";
import { activeRouteAtom } from "./atoms/route";
import { useEffect } from "react";

function App() {
  const [activeRoute, setActiveroute] = useAtom(activeRouteAtom);

  useEffect(() => {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const handleRouteChange = () => {
      const route = location.pathname.slice(1);
      setActiveroute(route);
    };

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleRouteChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleRouteChange();
    };

    window.addEventListener("popstate", handleRouteChange);

    // Cleanup (if needed):
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [activeRoute]);

  useEffect(() => {
    if (!activeRoute) {
      setActiveroute("home");
    }

    history.pushState(null, "", "/" + activeRoute);
  }, [activeRoute]);

  // todo: meh
  const availableHeight = "calc(100vh - 69px)";

  return (
    <UiKitProvider>
      <Flex
        direction="column"
        height="100vh"
        width="100%"
        maxWidth="1600px"
        mx="auto"
        overflow="hidden"
      >
        <Box flexShrink="0">
          <AppNavBar />
        </Box>

        <Flex flexGrow="1" flexShrink="1" height={availableHeight}>
          <Box
            width="72"
            borderRight="1px solid"
            borderColor="neutral.3"
            flexShrink="0"
            pt="6"
            overflow="auto"
            height="100%"
          >
            <Menu />
          </Box>
          <Flex
            flexGrow="1"
            flexShrink="1"
            minWidth="512px"
            pt="8"
            px="16"
            overflow="auto"
            height="100%"
            id="main"
          >
            <DocumentRenderer />
          </Flex>
          <Box
            width="72"
            borderLeft="1px solid"
            borderColor="neutral.3"
            flexShrink="0"
            px="4"
            pt="6"
            overflow="auto"
            height="100%"
          >
            <Toc />
          </Box>
        </Flex>
      </Flex>
    </UiKitProvider>
  );
}

export default App;
