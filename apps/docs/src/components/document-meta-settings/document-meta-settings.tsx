import { Stack } from "@bleh-ui/react";
import { DocumentStateSelector } from "./components/document-state-selector";
import { DocumentAudienceSelector } from "./components/document-audience-selector";
import { DocumentActionButtons } from "./components/document-action-buttons";
import { useAtomValue } from "jotai";
import { activeDocAtom } from "@/atoms/active-doc";

import { DocumentStringFieldEdit } from "./components/document-string-field";

export const DocumentMetaSettings = () => {
  const activeDocument = useAtomValue(activeDocAtom);
  if (!activeDocument) return null;
  return (
    <Stack>
      <DocumentActionButtons />
      <hr />
      <DocumentStringFieldEdit
        label="Title"
        placeholder="http://www.figma.com/..."
        metaProperty="title"
      />
      <DocumentStringFieldEdit
        label="Description"
        placeholder="http://www.figma.com/..."
        metaProperty="description"
      />
      <DocumentStateSelector />
      <DocumentAudienceSelector />
      <DocumentStringFieldEdit
        label="Figma Link"
        placeholder="http://www.figma.com/..."
        metaProperty="figmaLink"
      />
    </Stack>
  );
};
