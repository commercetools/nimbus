import { Box, Code, Table, Text } from "@commercetools/nimbus";
import { MdxStringRenderer } from "../../../mdx-string-renderer.tsx";
import { DefaultValue } from "./default-value.tsx";
import type { PropItem } from "../types";

interface PropsCategoryTableProps {
  props: PropItem[];
  componentId: string;
  categoryTitle: string;
}

/**
 * Renders a single props table for a specific category
 */
export const PropsCategoryTable = ({
  props,
  componentId,
}: PropsCategoryTableProps) => {
  if (props.length === 0) {
    return null;
  }

  return (
    <Box mb="600">
      {/* Props table */}
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
          {props.map((item) => (
            <Table.Row key={[componentId, item.name].join("-")}>
              {/* Prop name with required indicator */}
              <Table.Cell display="flex" justifyContent="flex-start">
                <Text fontWeight="600">
                  {item.name}
                  {item.required && (
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

              {/* Type and description */}
              <Table.Cell>
                <Code mb="200">{item.type?.name || "unknown"}</Code>
                <MdxStringRenderer content={item.description} />
              </Table.Cell>

              {/* Default value */}
              <Table.Cell display="flex" justifyContent="flex-start">
                <DefaultValue value={item.defaultValue} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
