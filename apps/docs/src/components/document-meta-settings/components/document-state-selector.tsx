import { documentStateDescriptions } from "@/schemas/mdx-document-states";
import { useEffect, useMemo } from "react";
import { useDocumentMetaSettings } from "../use-document-meta-settings";
import { Box, Stack, Text } from "@bleh-ui/react";
import { ChevronDown } from "@bleh-ui/icons";

export const DocumentStateSelector = () => {
  const { meta, noDoc, save } = useDocumentMetaSettings();
  const options = useMemo(() => {
    const arr = Object.keys(documentStateDescriptions).map((key) => {
      const item = documentStateDescriptions[key];
      return {
        id: key,
        value: key,
        ...item,
      };
    });
    return arr;
  }, []);

  const onSaveRequest = (value) => {
    const payload = { ...meta, documentState: value };
    save(payload);
  };

  useEffect(() => {
    if (!meta) return;
    if (meta.documentState === undefined) {
      onSaveRequest(options[0].id);
    }
  }, [meta, options]);

  if (noDoc) return null;
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
            onChange={(e) => onSaveRequest(e.target.value)}
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
