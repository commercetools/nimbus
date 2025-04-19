import {
  DocumentState,
  documentStateDescriptions,
} from "@/src/schemas/mdx-document-states";
import { useCallback, useEffect, useMemo } from "react";
import { Box, Stack, Text, Select } from "@commercetools/nimbus";
import { KeyboardArrowDown } from "@commercetools/nimbus-icons";
import { useUpdateDocument } from "@/src/hooks/useUpdateDocument";

export const DocumentStateSelector = () => {
  const { meta, updateMeta } = useUpdateDocument();

  const options = useMemo(() => {
    const arr = Object.keys(documentStateDescriptions).map((key) => {
      const item = documentStateDescriptions[key as DocumentState];
      return {
        id: key as DocumentState,
        value: key,
        ...item,
      };
    });
    return arr;
  }, []);

  const onSaveRequest = useCallback(
    (value: DocumentState) => {
      if (!meta) return;
      const payload = { ...meta, documentState: value };
      void updateMeta(payload);
    },
    [meta, updateMeta]
  );

  useEffect(() => {
    // Assign a state if the document does not have one yet
    if (!meta) return;
    if (meta.documentState === undefined) {
      onSaveRequest(options[0].id);
    }
  }, [meta, options, onSaveRequest]);

  return (
    <Stack>
      <Text fontWeight="600" asChild>
        <label htmlFor="documentState">Status</label>
      </Text>
      <Select.Root
        selectedKey={meta?.documentState}
        onSelectionChange={(key: string | number) =>
          onSaveRequest(key as DocumentState)
        }
        aria-label="Document status"
      >
        <Select.Options>
          {options.map(({ id, label, order, description }) => (
            <Select.Option key={id} id={id}>
              <Text slot="label">
                {order}. {label}
              </Text>
              <Text slot="description">{description}</Text>
            </Select.Option>
          ))}
        </Select.Options>
      </Select.Root>
    </Stack>
  );
};
