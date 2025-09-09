import { NimbusProvider, Flex, Box, Stack } from "@commercetools/nimbus";
import { IntlProvider } from "react-intl";
import { Menu } from "./components/navigation/menu";
import { DocumentRenderer } from "./components/document-renderer";
import { Toc } from "./components/navigation/toc";
import { AppNavBar } from "./components/navigation/app-nav-bar";
import { DevOnly } from "./components/utils/dev-only.tsx";
import { DocumentMetaSettings } from "./components/document-meta-settings/document-meta-settings.tsx";
import { StickySidebar } from "./components/navigation/sticky-sidebar.tsx";
import { RouterProvider } from "./components/router";
import { useAtom } from "jotai";
import { activeRouteAtom } from "./atoms/route";

function App() {
  const [, setActiveRoute] = useAtom(activeRouteAtom);

  return (
    <IntlProvider locale="en" messages={{}}>
      <RouterProvider>
        <NimbusProvider router={{ navigate: setActiveRoute }}>
          <>
            <Flex direction="column" width="full" maxWidth="1600px" mx="auto">
              <Box position="sticky" top="0" zIndex="1" bg="neutral.1">
                <AppNavBar />
              </Box>

              <Flex zIndex="0" flexGrow="1" flexShrink="1">
                <StickySidebar
                  as="nav"
                  width="7200"
                  borderRight="solid-25"
                  borderColor="neutral.3"
                  flexShrink="0"
                  pt="600"
                  id="sidebar-left"
                >
                  <Menu />
                </StickySidebar>

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

                <StickySidebar
                  width="8000"
                  borderLeft="solid-25"
                  borderColor="neutral.3"
                  flexShrink="0"
                  px="400"
                  pt="600"
                  id="sidebar-right"
                >
                  <Stack gap="800">
                    <DevOnly>
                      <DocumentMetaSettings />
                    </DevOnly>
                    <Toc />
                  </Stack>
                </StickySidebar>
              </Flex>
            </Flex>
          </>
        </NimbusProvider>
      </RouterProvider>
    </IntlProvider>
  );
}

export default App;
