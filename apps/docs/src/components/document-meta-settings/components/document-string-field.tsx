import { useCallback, useEffect, useState } from "react";
import {
  IconButton,
  TextInput,
  Stack,
  Text,
  Flex,
  Box,
  LoadingSpinner,
} from "@commercetools/nimbus";

import { useUpdateDocument } from "@/hooks/useUpdateDocument";
import { Save } from "@commercetools/nimbus-icons";
import { MdxFileFrontmatter } from "@/types";

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type AllowedMetaProps = StringKeys<Required<MdxFileFrontmatter["meta"]>>;

type DocumentStringFieldEditProps = {
  /** the label for the input field  */
  label: string;
  /** placeholder for the input field  */
  placeholder: string;
  /** the document property you want to edit */
  metaProperty: AllowedMetaProps;
};

export const DocumentStringFieldEdit = ({
  label,
  placeholder,
  metaProperty,
}: DocumentStringFieldEditProps) => {
  const { meta, updateMeta } = useUpdateDocument();
  const [value, setValue] = useState<string>(meta?.[metaProperty] || "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setValue(meta?.[metaProperty] || "");
  }, [meta, metaProperty]);

  const onSaveRequest = useCallback(
    async (value: string) => {
      if (!meta) return;
      const payload = { [metaProperty]: value.length > 0 ? value : undefined };
      await updateMeta(payload);
    },
    [meta, updateMeta, metaProperty]
  );

  const unsaved = value !== meta?.[metaProperty] && value.length > 0;

  const handlePress = async () => {
    if (busy) return;
    setBusy(true);
    await onSaveRequest(value);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setBusy(false);
  };

  return (
    <Stack width="full">
      <Text fontWeight="600" asChild>
        <label htmlFor={metaProperty}>{label}</label>
      </Text>
      <Flex alignItems="center" width="full" gap="200">
        <Box flexGrow={1} marginRight="spacing.4">
          <TextInput
            size="md"
            value={value}
            onChange={(value) => setValue(value)}
            placeholder={placeholder}
            width="full"
          />
        </Box>
        <IconButton
          variant={unsaved ? "solid" : undefined}
          tone={unsaved ? "primary" : "neutral"}
          size="md"
          onPress={() => {
            void handlePress();
          }}
          aria-label={`Save ${metaProperty}`}
        >
          {busy ? <LoadingSpinner tone="white" /> : <Save />}
        </IconButton>
      </Flex>
    </Stack>
  );
};
