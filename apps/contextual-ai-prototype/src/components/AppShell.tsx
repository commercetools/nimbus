import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Flex } from "@commercetools/nimbus";
import { Sidebar } from "./Sidebar";
import { ChatPanel } from "./ChatPanel";
import { chatConfigs } from "../data/chatMessages";

export const AppShell = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const location = useLocation();
  const chatConfig = chatConfigs[location.pathname];

  return (
    <Flex height="100vh" width="100vw" overflow="hidden">
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
          onClose={() => setPanelOpen(false)}
          agentName={chatConfig?.agentName}
          messages={chatConfig?.messages}
          placeholder={chatConfig?.placeholder}
        />
      </Box>
    </Flex>
  );
};
