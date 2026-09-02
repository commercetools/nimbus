import { useState, useCallback, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Flex, Icon, IconButton, Menu, Text, Separator } from "@commercetools/nimbus";
import { PersonOutline, CommercetoolsCube, Business, Inventory as InventoryIcon } from "@commercetools/nimbus-icons";
import { NavLink } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { ChatPanel } from "./ChatPanel";
import { PanelProvider } from "./ProvenanceIndicator";
import { chatConfigs } from "../data/chatMessages";

/** Top app bar: dark bg matching sidebar, icon-button menu toolbar on the right */
const AppBar = () => (
  <Flex
    alignItems="center"
    height="36px"
    bg="neutral.12"
    px="300"
    gap="200"
    flexShrink={0}
    zIndex={100}
  >
    <NavLink to="/" style={{ textDecoration: "none" }}>
      <Flex alignItems="center" justifyContent="center" color="white" _hover={{ opacity: 0.8 }} cursor="pointer">
        <Icon as={CommercetoolsCube} size="md" />
      </Flex>
    </NavLink>
    <Box flex="1" />
    <Flex alignItems="center" gap="100">
      {/* Organization menu */}
      <Menu.Root placement="bottom end">
        <Menu.Trigger asChild>
          <IconButton variant="ghost" size="2xs" aria-label="Organization" color="rgba(255,255,255,0.7)" _hover={{ color: "white", bg: "rgba(255,255,255,0.1)" }}>
            <Business />
          </IconButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Section label="Organization">
            <Menu.Item id="my-org">
              <Text slot="label">my-organization-name</Text>
            </Menu.Item>
            <Menu.Item id="other-org">
              <Text slot="label">other-org</Text>
            </Menu.Item>
          </Menu.Section>
        </Menu.Content>
      </Menu.Root>

      {/* Project menu */}
      <Menu.Root placement="bottom end">
        <Menu.Trigger asChild>
          <IconButton variant="ghost" size="2xs" aria-label="Project" color="rgba(255,255,255,0.7)" _hover={{ color: "white", bg: "rgba(255,255,255,0.1)" }}>
            <InventoryIcon />
          </IconButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Section label="Project">
            <Menu.Item id="my-proj">
              <Text slot="label">my-project-key</Text>
            </Menu.Item>
            <Menu.Item id="staging">
              <Text slot="label">staging-project</Text>
            </Menu.Item>
          </Menu.Section>
        </Menu.Content>
      </Menu.Root>

      {/* Profile menu */}
      <Menu.Root placement="bottom end">
        <Menu.Trigger asChild>
          <IconButton variant="ghost" size="2xs" aria-label="Profile" color="rgba(255,255,255,0.7)" _hover={{ color: "white", bg: "rgba(255,255,255,0.1)" }}>
            <PersonOutline />
          </IconButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Section label="Account">
            <Menu.Item id="profile">
              <Text slot="label">My profile</Text>
            </Menu.Item>
            <Menu.Item id="settings">
              <Text slot="label">Settings</Text>
            </Menu.Item>
          </Menu.Section>
          <Separator />
          <Menu.Item id="logout" isCritical>
            <Text slot="label">Sign out</Text>
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </Flex>
  </Flex>
);

export const AppShell = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [whyContext, setWhyContext] = useState<string | undefined>();
  const location = useLocation();
  const chatConfig = chatConfigs[location.pathname];

  const handleOpenPanel = useCallback((ctx?: string) => {
    setWhyContext(ctx);
    setPanelOpen(true);
  }, []);

  // Listen for tour events to open/close the panel programmatically
  useEffect(() => {
    const handleTourOpen = () => setPanelOpen(true);
    const handleTourClose = () => {
      setPanelOpen(false);
      setWhyContext(undefined);
    };
    window.addEventListener("tour:openPanel", handleTourOpen);
    window.addEventListener("tour:closePanel", handleTourClose);
    return () => {
      window.removeEventListener("tour:openPanel", handleTourOpen);
      window.removeEventListener("tour:closePanel", handleTourClose);
    };
  }, []);

  return (
    <PanelProvider openPanel={handleOpenPanel}>
      <Flex direction="column" height="100vh" width="100vw" overflow="hidden">
        {/* Top app bar */}
        <AppBar />

        <Flex flex="1" overflow="hidden">
          {/* Icon-only sidebar */}
          <Box
            flexShrink={0}
            borderRightWidth="1px"
            borderColor="neutral.4"
            height="100%"
          >
            <Sidebar />
          </Box>

          {/* Main content area */}
          <Box flex="1" overflow="auto" bg="neutral.2" minWidth="0">
            <Outlet context={{ panelOpen, setPanelOpen }} />
          </Box>

          {/* Chat panel: slide in/out */}
          <Box
            data-tour="chat-panel"
            width={panelOpen ? "380px" : "0px"}
            minWidth={panelOpen ? "380px" : "0px"}
            overflow="hidden"
            transition="width 200ms ease, min-width 200ms ease, opacity 200ms ease"
            opacity={panelOpen ? 1 : 0}
            borderLeftWidth="1px"
            borderColor="neutral.4"
            bg="white"
            height="100%"
            flexShrink={0}
          >
            <ChatPanel
              onClose={() => {
                setPanelOpen(false);
                setWhyContext(undefined);
              }}
              agentName={chatConfig?.agentName}
              messages={chatConfig?.messages}
              placeholder={chatConfig?.placeholder}
              whyContext={whyContext}
            />
          </Box>
        </Flex>
      </Flex>
    </PanelProvider>
  );
};
