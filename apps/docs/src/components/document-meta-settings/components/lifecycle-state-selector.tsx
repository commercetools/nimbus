import { lifecycleStateDescriptions } from "@/schemas/lifecycle-states";
import { Select, Stack, Text, Badge, Flex } from "@commercetools/nimbus";
import { activeDocAtom } from "@/atoms/active-doc.ts";
import { useAtomValue } from "jotai";

export const LifecycleStateSelector = () => {
  const activeDoc = useAtomValue(activeDocAtom);
  const meta = activeDoc?.meta;

  if (!meta) return null;

  const lifecycleState = meta.lifecycleState;
  const options = Object.entries(lifecycleStateDescriptions).map(
    ([key, { label, description, colorPalette }]) => ({
      key,
      label,
      description,
      colorPalette,
    })
  );

  return (
    <Stack>
      <Text fontWeight="600" asChild>
        <label htmlFor="lifecycleState">Lifecycle State</label>
      </Text>
      <Select.Root
        selectedKey={lifecycleState || ""}
        aria-label="Lifecycle state"
        isDisabled={true}
      >
        <Select.Options>
          <Select.Option key="" id="">
            <Text slot="label">None</Text>
            <Text slot="description">No lifecycle state assigned</Text>
          </Select.Option>
          {options.map(({ key, label, description, colorPalette }) => (
            <Select.Option key={key} id={key} textValue={label}>
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
