import { Box, Heading, Stack, Table, TagGroup } from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import { nimbusExportsAtom, NimbusExportItem } from "./atom";

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
  const filteredExports = filter ? allExports.filter(filter) : allExports;

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
    <Stack gap="m">
      {Object.entries(groupedExports).map(([type, items]) => (
        <Box key={type}>
          <Heading
            size="lg"
            marginBottom="m"
            style={{ textTransform: "capitalize" }}
          >
            {type}s
          </Heading>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item.name}>
                  <Table.Cell>
                    <code>{item.name}</code>
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
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      ))}
    </Stack>
  );
};
