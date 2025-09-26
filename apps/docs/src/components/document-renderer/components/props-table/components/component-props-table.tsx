import { Table, Text, Code } from "@commercetools/nimbus";
import { useMemo } from "react";
import typesData from "../../../../../data/types.json";
import { MdxStringRenderer } from "../../../mdx-string-renderer.tsx";
import { DefaultValue } from "./default-value.tsx";

interface ComponentPropsTableProps {
  componentName: string;
  props?: PropData[];
}

interface PropData {
  name: string;
  type: { name: string };
  defaultValue?: { value: string };
  required: boolean;
  description?: string;
}

interface ComponentData {
  displayName: string;
  description?: string;
  props?: Record<string, PropData>;
}

export const ComponentPropsTable = ({
  componentName,
  props: filteredProps,
}: ComponentPropsTableProps) => {
  const componentTypesData = useMemo(() => {
    return (typesData as ComponentData[]).find(
      (c) => c.displayName === componentName
    );
  }, [componentName]);

  if (!componentTypesData) {
    return <div>No component data found for {componentName}</div>;
  }

  // Use provided props or fall back to all props
  const propsArr =
    filteredProps || Object.values(componentTypesData.props || {});

  if (propsArr.length === 0) {
    return null;
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
        {propsArr.map((prop) => (
          <Table.Row key={prop.name}>
            <Table.Cell>
              <Text>
                {prop.name}
                {prop.required && <sup>*</sup>}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Code size="xs">{prop.type.name}</Code>
            </Table.Cell>
            <Table.Cell>
              {prop.defaultValue ? (
                <DefaultValue value={prop.defaultValue} />
              ) : (
                "—"
              )}
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
