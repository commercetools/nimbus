import { Code, system, DataTable, Text } from "@commercetools/nimbus";
export const TextStylesDemo = () => {
  const obj = system._config.theme?.textStyles || [];
  const items = Object.entries(obj).map(([name, value]) => ({
    id: name,
    name,
    value,
  }));

  const columns = [
    {
      id: "name",
      header: "Token-Name",
      accessor: (row: { name: string }) => row.name,
      width: 200,
      render: ({ value }: { value: string }) => (
        <Code variant="subtle">{value}</Code>
      ),
    },
    {
      id: "demo",
      header: "Demo",
      accessor: (row: { name: string }) => row.name,
      render: ({ value }: { value: string }) => (
        <Text textStyle={value}>Demo Text</Text>
      ),
    },
  ];

  return (
    <div>
      <DataTable columns={columns} rows={items} />
    </div>
  );
};
