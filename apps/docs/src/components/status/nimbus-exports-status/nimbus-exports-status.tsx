import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumnHeader,
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

        <TableRoot>
          <TableHeader>
            <TableRow>
              <TableColumnHeader width="1/5">Export Name</TableColumnHeader>
              <TableColumnHeader width="1/5">Type</TableColumnHeader>
              <TableColumnHeader width="1/5">Status</TableColumnHeader>
              <TableColumnHeader>Description</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exports.map((exportItem) => (
              <TableRow key={exportItem.name}>
                <TableCell>
                  {exportItem.docRoute ? (
                    <Link href={`/${exportItem.docRoute}`}>
                      <Code>{exportItem.name}</Code>
                    </Link>
                  ) : (
                    <Code>{exportItem.name}</Code>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    size="xs"
                    colorPalette={getColorForType(exportItem.type)}
                  >
                    {exportItem.type}
                  </Badge>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Text fontSize="sm">{exportItem.description}</Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
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
