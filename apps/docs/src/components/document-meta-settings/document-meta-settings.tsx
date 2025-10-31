import { Stack } from "@commercetools/nimbus";
import { DocumentActionButtons } from "./components/document-action-buttons";
import { LifecycleStateSelector } from "./components/lifecycle-state-selector";
import { DocumentStringField } from "./components/document-string-field";
import { useActiveDoc } from "@/hooks/useActiveDoc";

export const DocumentMetaSettings = () => {
  const { doc: activeDocument } = useActiveDoc();
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
