import {
  Box,
  Heading,
  Stack,
  DataTable,
  TagGroup,
  Button,
  Icon,
  Badge,
  Text,
  Link,
  Code,
} from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import { useState } from "react";
import React from "react";
import { nimbusExportsAtom, NimbusExportItem } from "./atom";
import { PropsTable } from "@/components/document-renderer/components/props-table";
import { useManifest } from "@/contexts/manifest-context";
import { CheckCircle, HighlightOff } from "@commercetools/nimbus-icons";
import { lifecycleStateDescriptions } from "@/schemas/lifecycle-states";

interface NimbusExportsListProps {
  filter?: (item: NimbusExportItem) => boolean;
  title?: string;
}

/**
 * Component that displays a list of exports from the @commercetools/nimbus package
 * Can be used in MDX files to show available components, hooks, etc.
 */
export const NimbusExportsList: React.FC<NimbusExportsListProps> = ({
  filter,
}) => {
  const allExports = useAtomValue(nimbusExportsAtom);
  const { routeManifest } = useManifest();
  const filteredExports = filter ? allExports.filter(filter) : allExports;
  const [expandedComponents, setExpandedComponents] = useState<string[]>([]);

  // Toggle expanded state for a component
  const toggleExpanded = (componentName: string) => {
    setExpandedComponents((prev) =>
      prev.includes(componentName)
        ? prev.filter((name) => name !== componentName)
        : [...prev, componentName]
    );
  };

  // Find documentation for an export item using the route manifest
  const findDocForExport = (exportName: string) => {
    if (!routeManifest) return undefined;

    return routeManifest.routes.find((route) => route.title === exportName);
  };

  // Group exports by type
  const groupedExports = filteredExports.reduce<
    Record<string, NimbusExportItem[]>
  >((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});

  // Get tag color based on type
  const getTagColor = (type: NimbusExportItem["type"]) => {
    switch (type) {
      case "component":
        return "blue";
      case "hook":
        return "purple";
      case "util":
        return "orange";
      default:
        return "neutral";
    }
  };

  return (
    <Stack gap="600">
      {Object.entries(groupedExports).map(([type, items]) => {
        const itemsWithIds = items.map((item) => ({
          ...item,
          id: item.name,
        }));

        const columns = [
          {
            id: "name",
            header: "Name",
            accessor: (row: (typeof items)[0]) => row.name,
            width: 250,
            render: ({ row }: { row: (typeof items)[0]; value: string }) => {
              const doc = findDocForExport(row.name);
              return doc ? (
                <Link href={doc.path}>
                  <Code>{row.name}</Code>
                </Link>
              ) : (
                <Code>{row.name}</Code>
              );
            },
          },
          {
            id: "type",
            header: "Type",
            accessor: (row: (typeof items)[0]) => row.type,
            width: 150,
            render: ({ row }: { row: (typeof items)[0]; value: string }) => (
              <TagGroup.Root>
                <TagGroup.TagList>
                  <TagGroup.Tag colorPalette={getTagColor(row.type)}>
                    {row.type}
                  </TagGroup.Tag>
                </TagGroup.TagList>
              </TagGroup.Root>
            ),
          },
          {
            id: "lifecycle",
            header: "Lifecycle",
            accessor: (row: (typeof items)[0]) => {
              const doc = findDocForExport(row.name);
              return doc?.lifecycleState || "";
            },
            width: 150,
            render: ({ row }: { row: (typeof items)[0]; value: string }) => {
              const doc = findDocForExport(row.name);
              const lifecycleState = doc?.lifecycleState;
              const lifecycleInfo = lifecycleState
                ? lifecycleStateDescriptions[lifecycleState]
                : null;

              return lifecycleInfo ? (
                <Badge size="xs" colorPalette={lifecycleInfo.colorPalette}>
                  {lifecycleInfo.label}
                </Badge>
              ) : (
                <Text fontSize="xs" color="neutral.10">
                  -
                </Text>
              );
            },
          },
          {
            id: "docs",
            header: "Docs",
            accessor: (row: (typeof items)[0]) => {
              const doc = findDocForExport(row.name);
              return doc ? "yes" : "no";
            },
            width: 100,
            render: ({ row }: { row: (typeof items)[0]; value: string }) => {
              const doc = findDocForExport(row.name);
              return doc ? (
                <Icon size="2xs" color="positive.9">
                  <CheckCircle />
                </Icon>
              ) : (
                <Icon size="2xs" color="critical.9">
                  <HighlightOff />
                </Icon>
              );
            },
          },
          ...(type === "component"
            ? [
                {
                  id: "actions",
                  header: "Actions",
                  accessor: (row: (typeof items)[0]) => row.name,
                  width: 150,
                  render: ({
                    row,
                  }: {
                    row: (typeof items)[0];
                    value: string;
                  }) => (
                    <Button
                      size="xs"
                      variant="ghost"
                      onPress={() => toggleExpanded(row.name)}
                    >
                      {expandedComponents.includes(row.name)
                        ? "Hide props"
                        : "Show props"}
                    </Button>
                  ),
                },
              ]
            : []),
        ];

        return (
          <Box key={type}>
            <Heading
              size="lg"
              marginBottom="400"
              style={{ textTransform: "capitalize" }}
            >
              {type}s
            </Heading>
            <DataTable
              columns={columns}
              rows={itemsWithIds}
              variant="outline"
            />
            {type === "component" &&
              items
                .filter((item) => expandedComponents.includes(item.name))
                .map((item) => (
                  <Box
                    key={item.name}
                    py="m"
                    px="s"
                    borderWidth="1px"
                    borderColor="neutral.6"
                    mt="-1px"
                  >
                    <PropsTable id={item.name} />
                  </Box>
                ))}
          </Box>
        );
      })}
    </Stack>
  );
};
