import { Stack } from "@commercetools/nimbus";
import { DocumentAudienceSelector } from "./components/document-audience-selector";
import { DocumentActionButtons } from "./components/document-action-buttons";
import { LifecycleStateSelector } from "./components/lifecycle-state-selector";
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
      <LifecycleStateSelector />
      <DocumentAudienceSelector />
      <DocumentStringFieldEdit
        label="Figma Link"
        placeholder="http://www.figma.com/..."
        metaProperty="figmaLink"
      />
    </Stack>
  );
};
