import { useState, useCallback, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Flex, Icon, ComboBox } from "@commercetools/nimbus";
import { HelpOutline, PersonOutline } from "@commercetools/nimbus-icons";
import { Sidebar } from "./Sidebar";
import { ChatPanel } from "./ChatPanel";
import { PanelProvider } from "./ProvenanceIndicator";
import { chatConfigs } from "../data/chatMessages";

/** Top app bar matching the real MC: white bg, box-shadow, org + project selectors + user menu */
const AppBar = () => (
  <Flex
    alignItems="center"
    height="40px"
    bg="white"
    px="300"
    gap="200"
    flexShrink={0}
    shadow="sm"
    zIndex={100}
  >
    <ComboBox.Root size="sm" variant="ghost" defaultInputValue="my-organization-name" aria-label="Organization" width="max-content">
      <ComboBox.Trigger />
      <ComboBox.Popover>
        <ComboBox.ListBox>
          <ComboBox.Option id="my-org" textValue="my-organization-name">my-organization-name</ComboBox.Option>
          <ComboBox.Option id="other-org" textValue="other-org">other-org</ComboBox.Option>
        </ComboBox.ListBox>
      </ComboBox.Popover>
    </ComboBox.Root>
    <ComboBox.Root size="sm" variant="ghost" defaultInputValue="my-project-key" aria-label="Project" width="max-content">
      <ComboBox.Trigger />
      <ComboBox.Popover>
        <ComboBox.ListBox>
          <ComboBox.Option id="my-proj" textValue="my-project-key">my-project-key</ComboBox.Option>
          <ComboBox.Option id="staging" textValue="staging-project">staging-project</ComboBox.Option>
        </ComboBox.ListBox>
      </ComboBox.Popover>
    </ComboBox.Root>
    <Box flex="1" />
    <Box cursor="pointer" color="neutral.9"><Icon as={HelpOutline} size="xs" /></Box>
    <Flex
      width="24px"
      height="24px"
      borderRadius="full"
      bg="neutral.4"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
    >
      <Icon as={PersonOutline} size="2xs" color="neutral.9" />
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
