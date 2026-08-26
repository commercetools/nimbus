import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  DataTable,
  DefaultPage,
  Flex,
  Heading,
  SearchInput,
  Text,
  type DataTableColumnItem,
} from "@commercetools/nimbus";
import { SmartToy } from "@commercetools/nimbus-icons";
import { mockAgents, type MockAgent } from "../data/mock-agents";

type AgentRow = MockAgent & { id: string; [key: string]: unknown };

const statusColorPalette: Record<MockAgent["status"], string> = {
  ACTIVE: "positive",
  DRAFT: "warning",
  DISABLED: "neutral",
};

const columns: DataTableColumnItem<AgentRow>[] = [
  {
    id: "name",
    header: "Agent name",
    accessor: (row) => row.name,
    isSortable: true,
    render: ({ row }) => (
      <Flex align="center" gap="200">
        <SmartToy />
        <Link
          to={`/agents/${row.key}`}
          style={{ color: "inherit", fontWeight: 500 }}
        >
          {row.name}
        </Link>
      </Flex>
    ),
  },
  {
    id: "publisher",
    header: "Publisher",
    accessor: (row) => row.publisher,
    isSortable: true,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    isSortable: true,
    render: ({ row }) => (
      <Badge colorPalette={statusColorPalette[row.status]}>{row.status}</Badge>
    ),
  },
  {
    id: "channels",
    header: "Channels",
    accessor: (row) => row.channels.join(", "),
    isSortable: false,
    render: ({ row }) => (
      <Flex gap="150" wrap="wrap">
        {row.channels.map((channel) => (
          <Badge key={channel} colorPalette="info" size="xs">
            {channel}
          </Badge>
        ))}
      </Flex>
    ),
  },
  {
    id: "version",
    header: "Version",
    accessor: (row) => row.version,
  },
  {
    id: "actions",
    header: "",
    accessor: (row) => row.key,
    render: () => (
      <Button variant="solid" size="sm">
        Add Agent
      </Button>
    ),
  },
];

export const AgentExplore = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const availableAgents = useMemo(
    () => mockAgents.filter((agent) => !agent.installed),
    []
  );

  const hasAnyCatalogAgents = mockAgents.length > 0;

  const rows: AgentRow[] = availableAgents.map((agent) => ({
    ...agent,
    id: agent.key,
  }));

  // Empty state: no agents exist in the catalog at all
  if (!hasAnyCatalogAgents) {
    return (
      <DefaultPage.Root>
        <DefaultPage.Header>
          <DefaultPage.Title>Explore</DefaultPage.Title>
          <DefaultPage.Subtitle>
            Browse available agents for your organization.
          </DefaultPage.Subtitle>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Flex
            direction="column"
            align="center"
            justify="center"
            py="1200"
            gap="300"
          >
            <Heading size="md" color="neutral.11">
              No agents available
            </Heading>
            <Text color="neutral.10">
              There are no agents in the catalog yet. Check back later.
            </Text>
          </Flex>
        </DefaultPage.Content>
      </DefaultPage.Root>
    );
  }

  // Empty state: all available agents are already installed
  if (availableAgents.length === 0) {
    return (
      <DefaultPage.Root>
        <DefaultPage.Header>
          <DefaultPage.Title>Explore</DefaultPage.Title>
          <DefaultPage.Subtitle>
            Browse available agents for your organization.
          </DefaultPage.Subtitle>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Flex
            direction="column"
            align="center"
            justify="center"
            py="1200"
            gap="300"
          >
            <Heading size="md" color="neutral.11">
              All agents installed
            </Heading>
            <Text color="neutral.10">
              Every available agent is already installed for your organization.
            </Text>
          </Flex>
        </DefaultPage.Content>
      </DefaultPage.Root>
    );
  }

  return (
    <DefaultPage.Root>
      <DefaultPage.Header>
        <DefaultPage.Title>Explore</DefaultPage.Title>
        <DefaultPage.Subtitle>
          Browse available agents for your organization.
        </DefaultPage.Subtitle>
      </DefaultPage.Header>
      <DefaultPage.Content>
        <Flex direction="column" gap="400">
          <SearchInput
            aria-label="Search available agents"
            placeholder="Search available agents..."
            value={search}
            onChange={setSearch}
          />
          <DataTable
            columns={columns}
            rows={rows}
            allowsSorting
            allowsPinning={false}
            search={search}
            onRowClick={(row) => navigate(`/agents/${row.key}`)}
          />
        </Flex>
      </DefaultPage.Content>
    </DefaultPage.Root>
  );
};
