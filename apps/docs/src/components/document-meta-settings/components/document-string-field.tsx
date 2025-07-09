import { useMemo } from "react";

import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  TextInput,
  MultilineTextInput,
} from "@commercetools/nimbus";
import { activeDocAtom } from "@/atoms/active-doc.ts";
import { useAtomValue } from "jotai";

type DocumentStringFieldProps = {
  fieldName: string;
  label: string;
  description?: string;
  placeholder?: string;
  isMultiline?: boolean;
};

export const DocumentStringField = ({
  fieldName,
  label,
  description,
  placeholder,
  isMultiline = false,
}: DocumentStringFieldProps) => {
  const activeDoc = useAtomValue(activeDocAtom);
  const meta = activeDoc?.meta;

  const fieldValue = useMemo(() => {
    if (!meta) return "";
    return meta[fieldName as keyof typeof meta] as string;
  }, [meta, fieldName]);

  return (
    <Stack>
      <Text fontWeight="600" asChild>
        <label htmlFor={fieldName}>{label}</label>
      </Text>
      {description && (
        <Text textStyle="xs" color="neutral.11">
          {description}
        </Text>
      )}
      <Box>
        {isMultiline ? (
          <MultilineTextInput
            id={fieldName}
            placeholder={placeholder}
            value={fieldValue}
            aria-label={label}
            readOnly={true}
            minHeight="20"
          />
        ) : (
          <TextInput
            id={fieldName}
            placeholder={placeholder}
            value={fieldValue}
            aria-label={label}
            readOnly={true}
          />
        )}
      </Box>
    </Stack>
  );
};
