import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  Table,
  Text,
  Box,
  Heading,
  Stack,
  Badge,
  Code,
  Link,
} from "@commercetools/nimbus";

import { getColorForType } from "./utils/export-utils";
import {
  nimbusExportsCategorizedAtom,
  NimbusExportItem,
} from "../../../atoms/nimbus-exports";

// Helper function to get color for document status
const getStatusColor = (status?: string) => {
  if (!status) return "neutral";

  switch (status) {
    case "Published":
      return "green";
    case "FinalDraft":
    case "Approved":
      return "teal";
    case "EditedForStyle":
    case "PeerReviewed":
    case "Revised":
    case "ReviewedInternal":
      return "blue";
    case "InitialDraft":
      return "amber";
    case "Archived":
      return "red";
    default:
      return "neutral";
  }
};

export const NimbusExportsStatus = () => {
  const [categorized, setCategorizedAction] = useAtom(
    nimbusExportsCategorizedAtom
  );

  // Trigger the computation when the component mounts
  useEffect(() => {
    setCategorizedAction();
  }, [setCategorizedAction]);

  const renderExportTable = (title: string, exports: NimbusExportItem[]) => {
    if (exports.length === 0) return null;

    return (
      <Box mb="1200">
        <Heading as="h2" mb="600" id={title.toLowerCase()}>
          {title} Exports ({exports.length})
        </Heading>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader width="1/5">Export Name</Table.ColumnHeader>
              <Table.ColumnHeader width="1/5">Type</Table.ColumnHeader>
              <Table.ColumnHeader width="1/5">Status</Table.ColumnHeader>
              <Table.ColumnHeader>Description</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {exports.map((exportItem) => (
              <Table.Row key={exportItem.name}>
                <Table.Cell>
                  {exportItem.docRoute ? (
                    <Link href={`/${exportItem.docRoute}`}>
                      <Code>{exportItem.name}</Code>
                    </Link>
                  ) : (
                    <Code>{exportItem.name}</Code>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    size="xs"
                    colorPalette={getColorForType(exportItem.type)}
                  >
                    {exportItem.type}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {exportItem.docStatus ? (
                    <Badge
                      size="xs"
                      colorPalette={getStatusColor(exportItem.docStatus)}
                    >
                      {exportItem.docStatus}
                    </Badge>
                  ) : (
                    <Text fontSize="sm" color="neutral.500">
                      No documentation
                    </Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Text fontSize="sm">{exportItem.description}</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    );
  };

  return (
    <Box>
      <Heading as="h1" mb="800">
        Nimbus Package Exports
      </Heading>
      <Text mb="800">
        This page lists all the named exports from the @commercetools/nimbus
        package, organized by category and linked to their documentation when
        available.
      </Text>

      <Stack gap="1200">
        {renderExportTable("Component", categorized.components)}
        {renderExportTable("Hook", categorized.hooks)}
        {renderExportTable("Theme", categorized.theme)}
        {renderExportTable("Other", categorized.other)}
      </Stack>
    </Box>
  );
};
