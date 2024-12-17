import {
  DocumentState,
  documentStateDescriptions,
} from "@/schemas/mdx-document-states";
import { useCallback, useEffect, useMemo } from "react";
import { Box, Stack, Text } from "@bleh-ui/react";
import { ChevronDown } from "@bleh-ui/icons";
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
      <Text fontWeight="semibold" asChild>
        <label htmlFor="documentState">Document Status</label>
      </Text>
      <Box position="relative">
        <Box
          appearance="none"
          display="block"
          width="full"
          py="2"
          px="2"
          asChild
          border="1px solid"
          borderColor="colorPalette.6"
          rounded="sm"
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
        <Box position="absolute" right="2" top="2" pointerEvents="none" asChild>
          <ChevronDown />
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
