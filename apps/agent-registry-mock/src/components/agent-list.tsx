import { useMemo, useState } from "react";
import type { Key } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  DataTable,
  DefaultPage,
  Flex,
  SearchInput,
  TagGroup,
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

const publisherTypeFilters: Array<{
  id: MockAgent["publisherType"];
  label: string;
}> = [
  { id: "commercetools", label: "commercetools" },
  { id: "partner", label: "Partner" },
  { id: "organization", label: "Organization" },
];

const columns: DataTableColumnItem<AgentRow>[] = [
  {
    id: "name",
    header: "Agent name",
    accessor: (row) => row.name,
    isSortable: true,
    render: ({ row }) => (
      <Flex align="center" gap="150">
        <Box flexShrink={0} width="16px" height="16px">
          <SmartToy />
        </Box>
        <Link
          to={`/agents/${row.key}`}
          style={{ color: "inherit", fontWeight: 500, fontSize: "0.875rem" }}
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
      <Badge colorPalette={statusColorPalette[row.status]} size="xs">{row.status}</Badge>
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
          <Badge key={channel} colorPalette="info" size="2xs">
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
    id: "lastUpdated",
    header: "Last updated",
    accessor: (row) => row.lastUpdated,
    isSortable: true,
  },
];

export const AgentList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedPublisherTypes, setSelectedPublisherTypes] = useState<
    Set<string>
  >(new Set());

  const installedAgents = useMemo(
    () => mockAgents.filter((agent) => agent.installed),
    []
  );

  const filteredAgents = useMemo(() => {
    if (selectedPublisherTypes.size === 0) return installedAgents;
    return installedAgents.filter((agent) =>
      selectedPublisherTypes.has(agent.publisherType)
    );
  }, [selectedPublisherTypes, installedAgents]);

  const rows: AgentRow[] = filteredAgents.map((agent) => ({
    ...agent,
    id: agent.key,
  }));

  return (
    <DefaultPage.Root>
      <DefaultPage.Header>
        <DefaultPage.Title>My Agents</DefaultPage.Title>
        <DefaultPage.Subtitle>
          Agents installed for your organization.
        </DefaultPage.Subtitle>
      </DefaultPage.Header>
      <DefaultPage.Content>
        <Flex direction="column" gap="400">
          <SearchInput
            aria-label="Search agents by name"
            placeholder="Search agents by name..."
            value={search}
            onChange={setSearch}
          />
          <TagGroup.Root
            aria-label="Filter by publisher type"
            selectionMode="multiple"
            selectedKeys={selectedPublisherTypes}
            onSelectionChange={(keys) => {
              if (keys === "all") {
                return;
              }
              setSelectedPublisherTypes(
                new Set(keys as Set<Key>) as Set<string>
              );
            }}
          >
            <TagGroup.TagList items={publisherTypeFilters}>
              {(item) => <TagGroup.Tag id={item.id}>{item.label}</TagGroup.Tag>}
            </TagGroup.TagList>
          </TagGroup.Root>
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
