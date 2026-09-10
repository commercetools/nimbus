import { useState } from "react";
import { ComboBox, Flex, FormField, SearchInput } from "@commercetools/nimbus";

const mockOrgs = [
  { id: "org-acme-retail", name: "Acme Retail Group" },
  { id: "org-acme-eu", name: "Acme Retail EU" },
  { id: "org-acme-us", name: "Acme Retail US" },
  { id: "org-partner-sandbox", name: "Partner Sandbox" },
];

export const AgentListFilters = ({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) => {
  const [selectedOrg, setSelectedOrg] = useState(["org-acme-retail"]);
  return (
  <Flex gap="300" wrap="wrap" align="flex-end">
    <FormField.Root size="sm" minWidth="180px">
      <FormField.Label>Organization</FormField.Label>
      <FormField.Input>
        <ComboBox.Root
          aria-label="Organization"
          size="sm"
          items={mockOrgs}
          selectionMode="single"
          selectedKeys={selectedOrg}
          onSelectionChange={(keys) => setSelectedOrg(Array.isArray(keys) ? keys.map(String) : [String(keys)])}
          menuTrigger="focus"
        >
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              {(item: { id: string; name: string }) => (
                <ComboBox.Option id={item.id} textValue={item.name}>
                  {item.name}
                </ComboBox.Option>
              )}
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </FormField.Input>
    </FormField.Root>
    <FormField.Root size="sm" flex="1" minWidth="200px">
      <FormField.Label>Search</FormField.Label>
      <FormField.Input>
        <SearchInput
          aria-label="Search agents"
          placeholder="Search agents..."
          size="sm"
          value={search}
          onChange={onSearchChange}
        />
      </FormField.Input>
    </FormField.Root>
  </Flex>
  );
};
