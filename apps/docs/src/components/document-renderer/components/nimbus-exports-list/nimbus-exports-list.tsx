import {
  Box,
  Heading,
  Stack,
  Table,
  TagGroup,
  Button,
  Icon,
  Badge,
  Text,
  Link,
} from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import { useState } from "react";
import React from "react";
import { nimbusExportsAtom, NimbusExportItem } from "./atom";
import { PropsTable } from "@/components/document-renderer/components/props-table";
import { documentationAtom } from "@/atoms/documentation";
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
  const documentation = useAtomValue(documentationAtom);
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

  // Find documentation for an export item
  const findDocForExport = (exportName: string) => {
    return Object.values(documentation).find(
      (doc) => doc.meta.title === exportName
    );
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
      {Object.entries(groupedExports).map(([type, items]) => (
        <Box key={type}>
          <Heading
            size="lg"
            marginBottom="400"
            style={{ textTransform: "capitalize" }}
          >
            {type}s
          </Heading>
          <Table.Root variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
                <Table.ColumnHeader>Lifecycle</Table.ColumnHeader>
                <Table.ColumnHeader>Docs</Table.ColumnHeader>
                {type === "component" && (
                  <Table.ColumnHeader>Actions</Table.ColumnHeader>
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((item) => {
                const doc = findDocForExport(item.name);
                const lifecycleState = doc?.meta.lifecycleState;
                const lifecycleInfo = lifecycleState
                  ? lifecycleStateDescriptions[lifecycleState]
                  : null;

                return (
                  <React.Fragment key={item.name}>
                    <Table.Row>
                      <Table.Cell>
                        {doc ? (
                          <Link href={doc.meta.route}>
                            <code>{item.name}</code>
                          </Link>
                        ) : (
                          <code>{item.name}</code>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <TagGroup.Root>
                          <TagGroup.TagList>
                            <TagGroup.Tag colorPalette={getTagColor(item.type)}>
                              {item.type}
                            </TagGroup.Tag>
                          </TagGroup.TagList>
                        </TagGroup.Root>
                      </Table.Cell>
                      <Table.Cell>
                        {lifecycleInfo ? (
                          <Badge
                            size="xs"
                            colorPalette={lifecycleInfo.colorPalette}
                          >
                            {lifecycleInfo.label}
                          </Badge>
                        ) : (
                          <Text fontSize="xs" color="neutral.10">
                            -
                          </Text>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {doc ? (
                          <Icon size="2xs" color="positive.9">
                            <CheckCircle />
                          </Icon>
                        ) : (
                          <Icon size="2xs" color="critical.9">
                            <HighlightOff />
                          </Icon>
                        )}
                      </Table.Cell>
                      {type === "component" && (
                        <Table.Cell>
                          <Button
                            size="xs"
                            variant="ghost"
                            onPress={() => toggleExpanded(item.name)}
                          >
                            {expandedComponents.includes(item.name)
                              ? "Hide props"
                              : "Show props"}
                          </Button>
                        </Table.Cell>
                      )}
                    </Table.Row>
                    {type === "component" &&
                      expandedComponents.includes(item.name) && (
                        <Table.Row>
                          <Table.Cell colSpan={5}>
                            <Box py="m" px="s">
                              <PropsTable id={item.name} />
                            </Box>
                          </Table.Cell>
                        </Table.Row>
                      )}
                  </React.Fragment>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      ))}
    </Stack>
  );
};
