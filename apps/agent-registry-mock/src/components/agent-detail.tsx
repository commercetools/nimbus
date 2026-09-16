import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Code,
  DefaultPage,
  Dialog,
  Flex,
  Heading,
  IconButton,
  MakeElementFocusable,
  Table,
  TagGroup,
  Text,
  Tooltip,
} from "@commercetools/nimbus";
import { Delete, Info } from "@commercetools/nimbus-icons";
import { mockAgents, type MockAgent } from "../data/mock-agents";
import { LocatorTreePanel, mockLocatorEntries, type LocatorEntry } from "./locator-tree";

const statusColorPalette: Record<MockAgent["status"], string> = {
  ACTIVE: "positive",
  DRAFT: "warning",
  DISABLED: "neutral",
};

const SectionHeader = ({ title, tooltip }: { title: string; tooltip?: string }) => (
  <Flex align="center" gap="100" mb="200">
    <Heading size="xs">{title}</Heading>
    {tooltip && (
      <Tooltip.Root>
        <MakeElementFocusable>
          <Box color="neutral.11" cursor="help">
            <Info />
          </Box>
        </MakeElementFocusable>
        <Tooltip.Content placement="top">{tooltip}</Tooltip.Content>
      </Tooltip.Root>
    )}
  </Flex>
);

const sidebarCardProps = {
  border: "solid-25",
  borderColor: "neutral.6",
  borderRadius: "200",
  p: "300",
} as const;

export const AgentDetail = () => {
  const { agentKey } = useParams<{ agentKey: string }>();
  const [isUninstallOpen, setIsUninstallOpen] = useState(false);
  const [isUninstalled, setIsUninstalled] = useState(false);
  const [locatorEntries, setLocatorEntries] = useState<LocatorEntry[]>(mockLocatorEntries);

  const agent = useMemo(
    () => mockAgents.find((candidate) => candidate.key === agentKey),
    [agentKey]
  );

  if (!agent) {
    return (
      <DefaultPage.Root>
        <DefaultPage.Header>
          <DefaultPage.BackLink href="/agents">
            Back to Agent Registry
          </DefaultPage.BackLink>
          <DefaultPage.Title>Agent not found</DefaultPage.Title>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Text>
            No agent was found for key &quot;{agentKey}&quot;. It may have been
            removed from the registry.
          </Text>
        </DefaultPage.Content>
      </DefaultPage.Root>
    );
  }

  return (
    <DefaultPage.Root>
      <DefaultPage.Header>
        <DefaultPage.BackLink href="/agents">
          Back to Agent Registry
        </DefaultPage.BackLink>
        <DefaultPage.Title>
          <Flex align="center" gap="200" width="100%">
            {agent.name}
            <Badge
              colorPalette={
                isUninstalled ? "neutral" : statusColorPalette[agent.status]
              }
              size="xs"
            >
              {isUninstalled ? "UNINSTALLED" : agent.status}
            </Badge>
            <Box flex="1" />
            {!isUninstalled && (
              <IconButton
                variant="ghost"
                colorPalette="critical"
                size="xs"
                aria-label="Uninstall agent"
                onPress={() => setIsUninstallOpen(true)}
              >
                <Delete />
              </IconButton>
            )}
          </Flex>
        </DefaultPage.Title>
        <DefaultPage.Subtitle>{agent.description}</DefaultPage.Subtitle>
      </DefaultPage.Header>
      <DefaultPage.Content>
        <Flex gap="400" align="flex-start" wrap="wrap">
          <Box flex="2" minWidth="320px">
            <Flex direction="column" gap="300">
              <Box border="solid-25" borderColor="neutral.6" borderRadius="200" p="300">
                <SectionHeader
                  title="Required permissions"
                  tooltip="OAuth scopes this agent needs. Each scope is shown with a plain-language description of what it allows."
                />
                <Table.Root variant="outline">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Scope</Table.ColumnHeader>
                      <Table.ColumnHeader>Description</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {agent.requiredScopes.map((scope) => (
                      <Table.Row key={scope.scope}>
                        <Table.Cell><Code size="xs">{scope.scope}</Code></Table.Cell>
                        <Table.Cell>{scope.description}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
              <Box>
                <LocatorTreePanel
                  entries={locatorEntries}
                  onEntriesChange={setLocatorEntries}
                />
              </Box>
            </Flex>
          </Box>
          <Box flex="1" minWidth="280px">
            <Flex direction="column" gap="300">
              <Box {...sidebarCardProps}>
                <Heading size="xs" mb="200">
                  Agent info
                </Heading>
                <Flex direction="column" gap="200">
                  <Flex justify="space-between">
                    <Text color="neutral.11" fontSize="sm">Publisher</Text>
                    <Text fontSize="sm">{agent.publisher}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="neutral.11" fontSize="sm">Version</Text>
                    <Text fontSize="sm">{agent.version}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="neutral.11" fontSize="sm">Last updated</Text>
                    <Text fontSize="sm">{agent.lastUpdated}</Text>
                  </Flex>
                </Flex>
              </Box>
              <Box {...sidebarCardProps}>
                <SectionHeader
                  title="Runs on"
                  tooltip="Channels where this agent is active. Each channel is a hosting surface (Merchant Center, MosAIc, Teams) with its own rendering contract."
                />
                <Flex gap="150" wrap="wrap">
                  {agent.channels.map((channel) => (
                    <Badge key={channel} colorPalette="info" size="2xs">
                      {channel}
                    </Badge>
                  ))}
                </Flex>
              </Box>
              <Box {...sidebarCardProps}>
                <SectionHeader
                  title="Capabilities"
                  tooltip="What this agent can do. Human-in-the-loop means every proposal is staged for a merchandiser to accept, edit, or reject."
                />
                <TagGroup.Root aria-label="Agent capabilities" size="sm">
                  <TagGroup.TagList
                    items={[
                      { id: "hitl", name: "Human-in-the-loop", isHitl: true },
                      ...agent.capabilities.map((c) => ({
                        id: c,
                        name: c,
                        isHitl: false,
                      })),
                    ]}
                  >
                    {(item) => (
                      <TagGroup.Tag
                        id={item.id}
                        style={
                          item.isHitl
                            ? {
                                background: "hsl(143, 55%, 93%)",
                                color: "hsl(143, 60%, 28%)",
                                borderColor: "hsl(143, 45%, 75%)",
                              }
                            : undefined
                        }
                      >
                        {item.name}
                      </TagGroup.Tag>
                    )}
                  </TagGroup.TagList>
                </TagGroup.Root>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </DefaultPage.Content>
      <Dialog.Root
        isOpen={isUninstallOpen}
        onOpenChange={setIsUninstallOpen}
      >
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Uninstall {agent.name}?</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            <Text>
              Uninstalling this agent will prevent all future interactions.
              Historical logs will be preserved.
            </Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Button slot="close" variant="outline">
              Cancel
            </Button>
            <Button
              colorPalette="critical"
              onPress={() => {
                setIsUninstalled(true);
                setIsUninstallOpen(false);
              }}
            >
              Uninstall
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </DefaultPage.Root>
  );
};
