import { Stack } from "@commercetools/nimbus";
import { DocumentActionButtons } from "./components/document-action-buttons";
import { LifecycleStateSelector } from "./components/lifecycle-state-selector";
import { useAtomValue } from "jotai";
import { activeDocAtom } from "@/atoms/active-doc";

import { DocumentStringField } from "./components/document-string-field";

export const DocumentMetaSettings = () => {
  const activeDocument = useAtomValue(activeDocAtom);
  if (!activeDocument) return null;
  return (
    <Stack>
      <DocumentActionButtons />
      <hr />
      <DocumentStringField
        fieldName="title"
        label="Title"
        placeholder="Enter document title"
      />
      <DocumentStringField
        fieldName="description"
        label="Description"
        placeholder="Enter document description"
      />
      <LifecycleStateSelector />
      <DocumentStringField
        fieldName="figmaLink"
        label="Figma Link"
        placeholder="http://www.figma.com/..."
      />
    </Stack>
  );
};
