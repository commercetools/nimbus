import { Box, Code, Table, Text } from "@commercetools/nimbus";
import { useAtomValue } from "jotai";
import { typesAtom } from "../../../../atoms/types.ts";
import { useMemo } from "react";

interface PropItem {
  name: string;
  type: {
    name: string;
  };
  description: string;
  required: boolean;
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
            <Table.Column width="1/3" />
            <Table.Column width="1/3" />
            <Table.Column />
          </Table.ColumnGroup>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>name</Table.ColumnHeader>
              <Table.ColumnHeader>type / description</Table.ColumnHeader>
              <Table.ColumnHeader>required</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {propsArr.map((item, idx) => (
              <Table.Row key={idx}>
                <Table.Cell display="flex" justifyContent="flex-start">
                  <Text fontWeight="600">{item.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Code>{item.type.name}</Code>
                  <Text mt="200">{item.description}</Text>
                </Table.Cell>
                <Table.Cell display="flex" justifyContent="flex-start">
                  {item.required ? "Yes" : "-"}
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
