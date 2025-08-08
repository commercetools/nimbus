import {
  LifecycleState,
  lifecycleStateDescriptions,
} from "@/schemas/lifecycle-states";
import { useCallback, useMemo } from "react";
import { Stack, Text, Select, Badge, Flex } from "@commercetools/nimbus";
import { useUpdateDocument } from "@/hooks/useUpdateDocument";

export const LifecycleStateSelector = () => {
  const { meta, updateMeta } = useUpdateDocument();

  const options = useMemo(() => {
    const arr = Object.keys(lifecycleStateDescriptions).map((key) => {
      const item = lifecycleStateDescriptions[key as LifecycleState];
      return {
        id: key as LifecycleState,
        value: key,
        ...item,
      };
    });
    return arr;
  }, []);

  const onSaveRequest = useCallback(
    (value: LifecycleState | "") => {
      if (!meta) return;
      const payload = {
        ...meta,
        lifecycleState: value === "" ? undefined : value,
      };
      void updateMeta(payload);
    },
    [meta, updateMeta]
  );

  return (
    <Stack>
      <Text fontWeight="600" asChild>
        <label htmlFor="lifecycleState">Lifecycle State</label>
      </Text>
      <Select.Root
        selectedKey={meta?.lifecycleState || ""}
        onSelectionChange={(key: string | number) =>
          onSaveRequest(key as LifecycleState | "")
        }
        aria-label="Lifecycle state"
      >
        <Select.Options>
          <Select.Option key="" id="">
            <Text slot="label">None</Text>
            <Text slot="description">No lifecycle state assigned</Text>
          </Select.Option>
          {options.map(({ id, label, description, colorPalette }) => (
            <Select.Option key={id} id={id} textValue={label}>
              <Flex slot="label" display="flex" alignItems="center" gap="200">
                <Flex width="2800" textAlign="right">
                  <Badge width="full" size="xs" colorPalette={colorPalette}>
                    {label}
                  </Badge>
                </Flex>
                <Text
                  textStyle="xs"
                  color="neutral.11"
                  width="40ch"
                  lineClamp="2"
                >
                  {description}
                </Text>
              </Flex>
            </Select.Option>
          ))}
        </Select.Options>
      </Select.Root>
    </Stack>
  );
};
