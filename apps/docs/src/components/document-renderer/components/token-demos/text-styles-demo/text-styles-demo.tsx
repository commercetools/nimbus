import { Code, system, Table, Text } from "@commercetools/nimbus";
export const TextStylesDemo = () => {
  const obj = system._config.theme?.textStyles || [];
  const items = Object.entries(obj).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader width="16ch">Token-Name</Table.ColumnHeader>
            <Table.ColumnHeader>Demo</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items &&
            items.map((item) => {
              const { name } = item;

              return (
                <Table.Row key={name}>
                  <Table.Cell>
                    <Code variant="subtle">{name}</Code>
                  </Table.Cell>
                  <Table.Cell>
                    <Text textStyle={name}>Demo Text</Text>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
