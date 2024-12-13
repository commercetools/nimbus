import { Box, Button } from "@bleh-ui/react";
import { useDocumentMetaSettings } from "./use-document-meta-settings";
import { DocumentStateSelector } from "./components/document-state-selector";

export const DocumentMetaSettings = () => {
  const { noDoc } = useDocumentMetaSettings();
  if (noDoc) return null;

  return (
    <Box mb="8">
      <DocumentStateSelector />
    </Box>
  );
};
