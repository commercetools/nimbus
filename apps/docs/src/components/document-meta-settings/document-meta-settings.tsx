import { Stack } from "@bleh-ui/react";
import { DocumentStateSelector } from "./components/document-state-selector";
import { DocumentAudienceSelector } from "./components/document-audience-selector";
import { DocumentActionButtons } from "./components/document-action-buttons";
import { useAtomValue } from "jotai";
import { activeDocAtom } from "@/atoms/active-doc";

export const DocumentMetaSettings = () => {
  const activeDocument = useAtomValue(activeDocAtom);
  if (!activeDocument) return null;
  return (
    <Stack>
      <DocumentActionButtons />
      <hr />
      <DocumentStateSelector />
      <DocumentAudienceSelector />
    </Stack>
  );
};
