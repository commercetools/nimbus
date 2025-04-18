import {
  DocumentState,
  documentStateDescriptions,
} from "@/schemas/mdx-document-states";
import { useCallback, useEffect, useMemo } from "react";
import { Box, Stack, Text } from "@commercetools/nimbus";
import { KeyboardArrowDown } from "@commercetools/nimbus-icons";
import { useUpdateDocument } from "@/hooks/useUpdateDocument";

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
      updateMeta(payload);
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
      <Box position="relative">
        <Box
          bg="transparent"
          appearance="none"
          display="block"
          width="full"
          h="1000"
          py="200"
          textStyle="sm"
          px="200"
          asChild
          border="solid-25"
          borderColor="colorPalette.6"
          focusRing="outside"
        >
          <select
            value={meta?.documentState}
            onChange={(e) => onSaveRequest(e.target.value as DocumentState)}
          >
            {options.map(({ id, label, order }) => {
              return (
                <option key={id} value={id}>
                  {order}. {label}
                </option>
              );
            })}
          </select>
        </Box>
        <Box
          position="absolute"
          right="300"
          top="300"
          pointerEvents="none"
          asChild
        >
          <KeyboardArrowDown />
        </Box>
      </Box>

      <Box>
        {options.map(({ id, description }) => {
          if (meta?.documentState === id) {
            return (
              <Text textStyle="sm" key={id}>
                {description}
              </Text>
            );
          }
          return null;
        })}
      </Box>
    </Stack>
  );
};
