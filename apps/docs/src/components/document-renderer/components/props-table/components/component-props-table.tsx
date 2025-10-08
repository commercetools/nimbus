import { Box, Code, Table, Text } from "@commercetools/nimbus";
import { MdxStringRenderer } from "../../../mdx-string-renderer.tsx";
import { DefaultValue } from "./default-value.tsx";
import type { PropData } from "../props-table.types.ts";

interface ComponentPropsTableProps {
  props: PropData[];
}

export const ComponentPropsTable = ({
  props: filteredProps,
}: ComponentPropsTableProps) => {
  if (filteredProps.length === 0) {
    return <Text>No props found for this component.</Text>;
  }

  return (
    <Table.Root variant="outline">
      <Table.ColumnGroup>
        <Table.Column width="1/4" />
        <Table.Column width="1/4" />
        <Table.Column width="1/8" />
        <Table.Column width="3/8" />
      </Table.ColumnGroup>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Type</Table.ColumnHeader>
          <Table.ColumnHeader>Default</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {filteredProps.map((prop) => (
          <Table.Row key={prop.name}>
            <Table.Cell>
              <Text>
                {prop.name}
                {prop.required && (
                  <Box
                    as="sup"
                    title="required"
                    display="inline-block"
                    color="critical.10"
                    cursor="help"
                  >
                    *
                  </Box>
                )}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Code size="xs">{prop.type.name}</Code>
            </Table.Cell>
            <Table.Cell>
              <DefaultValue value={prop.defaultValue} />
            </Table.Cell>
            <Table.Cell>
              {prop.description ? (
                <MdxStringRenderer content={prop.description} />
              ) : (
                "—"
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
