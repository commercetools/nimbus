import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Flex, Icon, Menu, Text, Separator, Avatar, ComboBox } from "@commercetools/nimbus";
import { CommercetoolsCube } from "@commercetools/nimbus-icons";
import { NavLink } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { ChatPanel, type ChatMessage } from "./ChatPanel";
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
        <Icon as={CommercetoolsCube} size="xs" />
      </Flex>
    </NavLink>
    <Box flex="1" />
    <Flex alignItems="center" gap="200">
      {/* Organization selector */}
      <ComboBox.Root size="sm" variant="ghost" defaultValue="my-organization-name" aria-label="Organization" width="max-content" css={{ "& [slot=clear]": { display: "none" }, "& input": { color: "rgba(255,255,255,0.9)", fontSize: "var(--nimbus-font-sizes-xs)" }, "& button": { color: "rgba(255,255,255,0.6)" } }}>
        <ComboBox.Trigger />
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Option id="my-org" textValue="my-organization-name">my-organization-name</ComboBox.Option>
            <ComboBox.Option id="other-org" textValue="other-org">other-org</ComboBox.Option>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>
      <Box width="1px" height="16px" bg="rgba(255,255,255,0.15)" />
      {/* Project selector */}
      <ComboBox.Root size="sm" variant="ghost" defaultValue="my-project-key" aria-label="Project" width="max-content" css={{ "& [slot=clear]": { display: "none" }, "& input": { color: "rgba(255,255,255,0.9)", fontSize: "var(--nimbus-font-sizes-xs)" }, "& button": { color: "rgba(255,255,255,0.6)" } }}>
        <ComboBox.Trigger />
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Option id="my-proj" textValue="my-project-key">my-project-key</ComboBox.Option>
            <ComboBox.Option id="staging" textValue="staging-project">staging-project</ComboBox.Option>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>
      <Box width="1px" height="16px" bg="rgba(255,255,255,0.15)" />
      {/* Profile menu — avatar trigger */}
      <Menu.Root placement="bottom end">
        <Menu.Trigger asChild>
          <Box cursor="pointer">
            <Avatar firstName="Lena" lastName="M" size="2xs" colorPalette="primary" />
          </Box>
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

  // Auto-open panel in orchestrated mode (the conversation IS the interface)
  const isOrchestrated = location.pathname.includes("/orchestrated/");
  useEffect(() => {
    if (isOrchestrated) {
      setPanelOpen(true);
    } else {
      setPanelOpen(false);
    }
  }, [isOrchestrated]);

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

  // Track previous page's message count for progressive reveal carry-over
  const prevMessageCountRef = useRef(0);
  const carriedCount = useMemo(() => {
    const prev = prevMessageCountRef.current;
    return prev;
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Memoize mapped messages so progressive reveal doesn't reset on every render
  const mappedMessages = useMemo(() => {
    const mapped = chatConfig?.messages.map((m) => ({
      sender: m.role === "assistant" ? "agent" as const : "user" as const,
      agentLabel: m.role === "assistant" ? chatConfig.agentName : undefined,
      content: m.content,
      richContent: m.richContent,
    }));
    // Update prev count AFTER computing carried (for next navigation)
    prevMessageCountRef.current = mapped?.length ?? 0;
    return mapped;
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PanelProvider openPanel={handleOpenPanel}>
      <Flex direction="column" height="100vh" width="100vw" overflow="hidden">
        {/* Top app bar */}
        <AppBar />

        <Flex flex="1" overflow="hidden" position="relative">
          {/* Icon-only sidebar: hidden on small screens */}
          <Box
            flexShrink={0}
            borderRightWidth="1px"
            borderColor="neutral.4"
            height="100%"
            display={{ base: "none", sm: "block" }}
          >
            <Sidebar />
          </Box>

          {/* Main content area */}
          <Box flex="1" overflow="auto" bg="neutral.2" minWidth="0" position="relative">
            <Outlet context={{ panelOpen, setPanelOpen }} />
            {/* Floating ✦ button to open the agent panel */}
            {!panelOpen && (
              <Flex
                position="fixed"
                bottom="400"
                right="400"
                width="500"
                height="500"
                alignItems="center"
                justifyContent="center"
                bg="primary.9"
                borderRadius="full"
                shadow="lg"
                cursor="pointer"
                zIndex={40}
                _hover={{ bg: "primary.10", transform: "scale(1.08)" }}
                transition="all 200ms ease"
                onClick={() => setPanelOpen(true)}
              >
                <Text fontSize="300" lineHeight="1" color="white">✦</Text>
              </Flex>
            )}
          </Box>

          {/* Chat panel: inline on large screens, overlay on small */}
          <Flex
            data-tour="chat-panel"
            direction="column"
            width={panelOpen ? { base: "100%", lg: "380px" } : "0px"}
            minWidth={panelOpen ? { base: "100%", lg: "380px" } : "0px"}
            maxWidth={panelOpen ? { base: "100%", lg: "380px" } : "0px"}
            position="relative"
            right="0"
            top="0"
            overflow="hidden"
            transition="width 200ms ease, min-width 200ms ease, max-width 200ms ease, opacity 200ms ease"
            opacity={panelOpen ? 1 : 0}
            borderLeftWidth="1px"
            borderColor="neutral.4"
            bg="white"
            height="100%"
            flexShrink={0}
            zIndex={{ base: 50, lg: "auto" }}
          >
            <ChatPanel
              onClose={() => {
                setPanelOpen(false);
                setWhyContext(undefined);
              }}
              agentName={chatConfig?.agentName}
              messages={mappedMessages}
              placeholder={chatConfig?.placeholder}
              whyContext={whyContext}
              progressive={isOrchestrated}
              carriedCount={carriedCount}
            />
          </Flex>
        </Flex>
      </Flex>
    </PanelProvider>
  );
};
