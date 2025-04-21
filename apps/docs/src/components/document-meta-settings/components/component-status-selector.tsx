import {
  ComponentStatus,
  componentStatusDescriptions,
} from "@/schemas/mdx-document-status";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Stack, Text, Select } from "@commercetools/nimbus";
import { useUpdateDocument } from "@/src/hooks/useUpdateDocument";

export const ComponentStatusSelector = () => {
  const { meta, updateMeta } = useUpdateDocument();
  const [currentKey, setCurrentKey] = useState<ComponentStatus | null>(
    meta?.componentStatus || null
  );

  // Update the currentKey when meta changes (when switching between documents)
  useEffect(() => {
    setCurrentKey(meta?.componentStatus || null);
  }, [meta]);

  const options = useMemo(() => {
    const arr = Object.keys(componentStatusDescriptions).map((key) => {
      const item = componentStatusDescriptions[key as ComponentStatus];
      return {
        id: key as ComponentStatus,
        value: key,
        ...item,
      };
    });
    return arr;
  }, []);

  const onSaveRequest = useCallback(
    (value: ComponentStatus | null) => {
      if (!meta) return;
      // If null was selected, remove the componentStatus field
      const payload = value
        ? { ...meta, componentStatus: value }
        : { ...meta, componentStatus: undefined };
      void updateMeta(payload);
    },
    [meta, updateMeta]
  );

  return (
    <Stack>
      <Text fontWeight="600" asChild>
        <label htmlFor="componentStatus">Component Status</label>
      </Text>
      <Select.Root
        selectedKey={currentKey}
        onSelectionChange={(key: string | number | null) => {
          const typedKey = key as ComponentStatus | null;
          setCurrentKey(typedKey);
          onSaveRequest(typedKey);
        }}
        aria-label="Component status"
        allowsCustomValue
      >
        <Select.Options>
          <Select.Option key={null} id={null}>
            <Text slot="label">None</Text>
            <Text slot="description">No status specified</Text>
          </Select.Option>
          {options.map(({ id, label, order, description }) => (
            <Select.Option key={id} id={id}>
              <Text slot="label">
                {order}. {label}
              </Text>
              <Text slot="description" truncate>
                {description}
              </Text>
            </Select.Option>
          ))}
        </Select.Options>
      </Select.Root>
    </Stack>
  );
};
