import { Box, Code, Table, Text } from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import { typesAtom } from "../../../../../atoms/types.ts";
import { ReactNode, useMemo } from "react";
import { MdxStringRenderer } from "../../../mdx-string-renderer.tsx";
import { DefaultValue } from "./default-value.tsx";

interface PropItem {
  name: string;
  type?: {
    name?: string;
  };
  description: string;
  required: boolean;
  defaultValue: ReactNode | { value?: string | number | boolean | null };
}

export const ComponentPropsTable = ({ id }: { id: string }) => {
  const typesArr = useAtomValue(typesAtom);
  const propsTableData = useMemo(() => {
    return typesArr.find((v) => v.displayName === id);
  }, [typesArr, id]);

  const propsArr = useMemo<PropItem[]>(() => {
    if (!propsTableData?.props) return [];

    return Object.keys(propsTableData.props).map((key) => {
      // Using type assertion to safely access properties
      const prop =
        propsTableData.props[key as keyof typeof propsTableData.props];
      return {
        ...prop,
      } as PropItem;
    });
  }, [propsTableData]);

  // If the component with the given ID is not found, display an error message
  if (!propsTableData) {
    return (
      <Box padding="400" backgroundColor="critical.subtle" borderRadius="4">
        <Text color="critical.emphasized">
          Error: Component with ID "{id}" not found.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {propsArr.length > 0 ? (
        <Table.Root variant="outline">
          <Table.ColumnGroup>
            <Table.Column width="1/4" />
            <Table.Column width="2/4" />
            <Table.Column width="1/4" />
          </Table.ColumnGroup>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>name</Table.ColumnHeader>
              <Table.ColumnHeader>type / description</Table.ColumnHeader>
              <Table.ColumnHeader>default</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {propsArr.map((item) => (
              <Table.Row key={[id, item.name].join("-")}>
                <Table.Cell display="flex" justifyContent="flex-start">
                  <Text fontWeight="600">
                    {item.name}
                    {item.required ? (
                      <Box
                        as="sup"
                        title="required"
                        display="inline-block"
                        color="critical.10"
                        cursor="help"
                      >
                        *
                      </Box>
                    ) : (
                      ""
                    )}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Code mb="200">{item.type?.name || "unknown"}</Code>
                  <MdxStringRenderer content={item.description} />
                </Table.Cell>

                <Table.Cell display="flex" justifyContent="flex-start">
                  <DefaultValue value={item.defaultValue} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <Text>No props found for this component.</Text>
      )}
    </Box>
  );
};
