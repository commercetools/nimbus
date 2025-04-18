import { useCallback, useEffect, useState } from "react";
import { IconButton, Input, Stack, Text } from "@commercetools/nimbus";

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

  useEffect(() => {
    setValue(meta?.[metaProperty] || "");
  }, [meta, metaProperty]);

  const onSaveRequest = useCallback(
    (value: string) => {
      if (!meta) return;
      const payload = { [metaProperty]: value.length > 0 ? value : undefined };
      updateMeta(payload);
    },
    [meta, updateMeta, metaProperty]
  );

  const unsaved = value !== meta?.[metaProperty] && value.length > 0;

  return (
    <Stack>
      <Text fontWeight="600" asChild>
        <label htmlFor="documentState">{label}</label>
      </Text>
      <Stack direction="row">
        <Input
          size="md"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
        <IconButton
          variant="solid"
          tone="primary"
          size="md"
          onPress={() => onSaveRequest(value)}
        >
          <Save />
        </IconButton>
      </Stack>
    </Stack>
  );
};
