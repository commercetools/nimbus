import { Navigate, Route, Routes } from "react-router-dom";
import { Box, Flex, Heading, Text } from "@commercetools/nimbus";
import { SidebarNav } from "./components/sidebar-nav";
import { AgentList } from "./components/agent-list";
import { AgentDetail } from "./components/agent-detail";
import { AgentExplore } from "./components/agent-explore";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => (
  <Box p="600">
    <Heading size="lg" mb="200">
      {title}
    </Heading>
    <Text color="neutral.11">{description}</Text>
  </Box>
);

export const App = () => {
  return (
    <Flex width="100vw" height="100vh" overflow="hidden">
      <SidebarNav />
      <Box flex="1" overflow="auto" bg="neutral.1">
        <Routes>
          <Route
            path="/"
            element={
              <PlaceholderPage
                title="Merchant Center"
                description="Select Agent Sphere from the sidebar to browse the agent registry."
              />
            }
          />
          <Route
            path="/profile"
            element={
              <PlaceholderPage
                title="Profile"
                description="Profile settings are not part of this mock."
              />
            }
          />
          <Route
            path="/account"
            element={
              <PlaceholderPage
                title="Account"
                description="Organization account settings are not part of this mock."
              />
            }
          />
          <Route path="/agents/explore" element={<AgentExplore />} />
          <Route path="/agents" element={<AgentList />} />
          <Route path="/agents/:agentKey" element={<AgentDetail />} />
          <Route path="*" element={<Navigate to="/agents" replace />} />
        </Routes>
      </Box>
    </Flex>
  );
};
