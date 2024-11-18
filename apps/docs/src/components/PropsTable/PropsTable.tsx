import { Box, Code, Table, Text } from "@bleh-ui/react";
import { useAtomValue } from "jotai";
import { typesAtom } from "../../atoms/types";
import { useMemo } from "react";
import { JSONTree } from "react-json-tree";

export const PropsTable = ({ id }) => {
  const typesArr = useAtomValue(typesAtom);
  const propsTableData = useMemo(() => {
    const item = typesArr.find((v) => v.displayName === id);
    return item;
  }, [typesArr, id]);
  const propsArr = useMemo(() => {
    const props = Object.keys(propsTableData?.props || {}).map((key) => {
      return {
        ...propsTableData.props[key],
      };
    });

    return props;
  }, [propsTableData]);

  return (
    <Box>
      <Table.Root variant="outline">
        <Table.ColumnGroup>
          <Table.Column width="33%" />
          <Table.Column width="33%" />
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
          {propsArr &&
            propsArr.length &&
            propsArr.map((item, idx) => (
              <Table.Row key={idx}>
                <Table.Cell display="flex" justifyContent="flex-start">
                  <Text fontWeight="600">{item.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Code>{item.type.name}</Code>
                  <Text mt="2">{item.description}</Text>
                </Table.Cell>
                <Table.Cell display="flex" justifyContent="flex-start">
                  {item.required ? "Yes" : "-"}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
      {false && (
        <pre>
          <JSONTree data={propsTableData} />
        </pre>
      )}
    </Box>
  );
};
