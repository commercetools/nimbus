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
        label="Title"
        placeholder="Enter document title"
        metaProperty="title"
      />
      <DocumentStringField
        label="Description"
        placeholder="Enter document description"
        metaProperty="description"
        isMultiline={true}
      />
      <LifecycleStateSelector />
      <DocumentStringField
        label="Figma Link"
        placeholder="http://www.figma.com/..."
        metaProperty="figmaLink"
      />
    </Stack>
  );
};
