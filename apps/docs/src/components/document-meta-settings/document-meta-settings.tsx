import { Stack } from "@bleh-ui/react";
import { useDocumentMetaSettings } from "./use-document-meta-settings";
import { DocumentStateSelector } from "./components/document-state-selector";
import { DocumentAudienceSelector } from "./components/document-audience-selector";
import { DocumentActionButtons } from "./components/document-action-buttons";

export const DocumentMetaSettings = () => {
  const { noDoc } = useDocumentMetaSettings();
  if (noDoc) return null;

  return (
    <Stack>
      <DocumentActionButtons />
      <hr />
      <DocumentStateSelector />
      <DocumentAudienceSelector />
    </Stack>
  );
};
