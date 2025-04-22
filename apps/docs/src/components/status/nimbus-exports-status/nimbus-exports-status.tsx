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
  Alert,
} from "@commercetools/nimbus";

import { getColorForType } from "./utils/export-utils";
import {
  nimbusExportsCategorizedAtom,
  NimbusExportItem,
  missingDocsExportsAtom,
} from "../../../atoms/nimbus-exports";
import { ComponentStatus } from "../../status/component-status";
import { DocLink } from "../../navigation/doc-link/doc-link";

export const NimbusExportsStatus = () => {
  const [categorized, setCategorizedAction] = useAtom(
    nimbusExportsCategorizedAtom
  );
  const [missingDocsExports] = useAtom(missingDocsExportsAtom);

  // Trigger the computation when the component mounts
  useEffect(() => {
    setCategorizedAction();
  }, [setCategorizedAction]);

  const renderExportTable = (
    title: string,
    exports: NimbusExportItem[],
    showAlert: boolean = false
  ) => {
    if (exports.length === 0) return null;

    return (
      <Box mb="1200">
        <Heading as="h2" mb="600" id={title.toLowerCase()}>
          {title} ({exports.length})
        </Heading>

        {showAlert && (
          <Alert.Root variant="outlined" tone="critical" mb="600">
            <Alert.Title>Missing Documentation</Alert.Title>
            <Alert.Description>
              These exports are missing proper documentation or component status
              and need to be addressed.
            </Alert.Description>
          </Alert.Root>
        )}

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
                  <DocLink docRoute={exportItem.docRoute} asCode={true}>
                    {exportItem.name}
                  </DocLink>
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
                  <ComponentStatus
                    status={exportItem.componentStatus || null}
                    size="sm"
                  />
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
      <Text mb="800">
        This page lists all the named exports from the{" "}
        <Code mr="100">@commercetools/nimbus</Code>
        package, organized by category and linked to their documentation when
        available.
      </Text>

      <Stack gap="1200">
        {/* Display missing documentation exports at the top */}
        {missingDocsExports.length > 0 &&
          renderExportTable("Exports with issues", missingDocsExports, true)}

        {renderExportTable("Components", categorized.components)}
        {renderExportTable("Hooks", categorized.hooks)}
        {renderExportTable("Themes", categorized.theme)}
        {renderExportTable("Others", categorized.other)}
      </Stack>
    </Box>
  );
};
