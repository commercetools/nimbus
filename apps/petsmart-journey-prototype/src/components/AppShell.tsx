import { useState, useCallback, useEffect } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import {
  Box,
  Flex,
  Icon,
  Menu,
  Text,
  Separator,
  Avatar,
  ComboBox,
} from "@commercetools/nimbus";
import { CommercetoolsCube } from "@commercetools/nimbus-icons";
import { Sidebar } from "./Sidebar";
import { ChatPanel } from "./ChatPanel";
import { FloatingChatButton } from "./FloatingChatButton";
import { PanelProvider } from "./ProvenanceIndicator";
import { useJourney } from "./JourneyContext";
import { chatConfigs } from "../data/chatMessages";

/** Top app bar: dark bg matching sidebar, persona avatar on the right */
const AppBar = () => {
  const { activePersona } = useJourney();
  return (
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
        <Flex
          alignItems="center"
          justifyContent="center"
          color="white"
          _hover={{ opacity: 0.8 }}
          cursor="pointer"
        >
          <Icon as={CommercetoolsCube} size="md" />
        </Flex>
      </NavLink>
      <Box flex="1" />
      <Flex alignItems="center" gap="200">
        {/* Organization selector */}
        <ComboBox.Root
          size="sm"
          variant="ghost"
          defaultValue="petsmart-production"
          aria-label="Organization"
          width="max-content"
          css={{
            "& [slot=clear]": { display: "none" },
            "& input": {
              color: "rgba(255,255,255,0.9)",
              fontSize: "var(--nimbus-font-sizes-xs)",
            },
            "& button": { color: "rgba(255,255,255,0.6)" },
          }}
        >
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="petsmart" textValue="petsmart-production">
                petsmart-production
              </ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
        <Box width="1px" height="16px" bg="rgba(255,255,255,0.15)" />
        {/* Project selector */}
        <ComboBox.Root
          size="sm"
          variant="ghost"
          defaultValue="us-retail"
          aria-label="Project"
          width="max-content"
          css={{
            "& [slot=clear]": { display: "none" },
            "& input": {
              color: "rgba(255,255,255,0.9)",
              fontSize: "var(--nimbus-font-sizes-xs)",
            },
            "& button": { color: "rgba(255,255,255,0.6)" },
          }}
        >
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="us-retail" textValue="us-retail">
                us-retail
              </ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
        <Box width="1px" height="16px" bg="rgba(255,255,255,0.15)" />
        {/* Profile menu — persona avatar */}
        <Menu.Root placement="bottom end">
          <Menu.Trigger asChild>
            <Box cursor="pointer">
              {activePersona ? (
                <Avatar
                  src={activePersona.avatarUrl}
                  firstName={activePersona.name}
                  size="2xs"
                  colorPalette="primary"
                />
              ) : (
                <Avatar firstName="User" size="2xs" colorPalette="neutral" />
              )}
            </Box>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Section
              label={
                activePersona
                  ? `${activePersona.name} · ${activePersona.role}`
                  : "Account"
              }
            >
              <Menu.Item id="profile">
                <Text slot="label">My profile</Text>
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
};

export const AppShell = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [whyContext, setWhyContext] = useState<string | undefined>();
  const location = useLocation();
  const { activeJourney } = useJourney();

  // Determine chat config based on active journey + current path
  const chatKey = activeJourney
    ? `j${activeJourney.id}:${location.pathname}`
    : undefined;
  const chatConfig = chatKey ? chatConfigs[chatKey] : undefined;

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

        <Flex flex="1" overflow="hidden" position="relative">
          {/* Icon-only sidebar */}
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
          <Box flex="1" overflow="auto" bg="neutral.2" minWidth="0">
            <Outlet context={{ panelOpen, setPanelOpen }} />
          </Box>

          {/* Chat panel: inline on large screens, overlay on small */}
          <Box
            data-tour="chat-panel"
            width={panelOpen ? { base: "100%", lg: "380px" } : "0px"}
            minWidth={panelOpen ? { base: "100%", lg: "380px" } : "0px"}
            maxWidth={panelOpen ? { base: "100%", lg: "380px" } : "0px"}
            position={{ base: "absolute", lg: "relative" }}
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
              messages={chatConfig?.messages}
              placeholder={chatConfig?.placeholder}
              whyContext={whyContext}
            />
          </Box>
        </Flex>

        {/* Floating chat button */}
        {!panelOpen && (
          <FloatingChatButton
            pulse={!!chatConfig}
            onClick={() => setPanelOpen(true)}
          />
        )}
      </Flex>
    </PanelProvider>
  );
};
