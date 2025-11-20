import type { StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { type Selection } from "react-aria-components";
import {
  Stack,
  Heading,
  Text,
  TextInput,
  Select,
  Checkbox,
  Button,
  Box,
  Flex,
} from "@/components";
import {
  comprehensiveColumns,
  comprehensiveData,
  nestedComprehensiveTableColumns,
} from "../test-data";
import type {
  DataTableProps,
  DataTableRowItem,
  SortDescriptor,
} from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const AllFeatures: Story = {
  render: () => {
    // Feature toggles
    const [search, setSearch] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["1"]));
    const [visibleColumns, setVisibleColumns] = useState([
      "name",
      "age",
      "role",
      "email",
      "status",
    ]);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
      column: "name",
      direction: "ascending",
    });

    // Settings
    const [isResizable, setIsResizable] = useState(true);
    const [allowsSorting, setAllowsSorting] = useState(true);
    const [isRowClickable, setIsRowClickable] = useState(true);
    const [stickyHeader, setStickyHeader] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const [density, setDensity] = useState<"default" | "condensed">("default");
    const [selectionMode, setSelectionMode] = useState<
      "none" | "single" | "multiple"
    >("multiple");
    const [disallowEmptySelection, setDisallowEmptySelection] = useState(true);

    const allColumns = comprehensiveColumns.map((col) => col.id);
    // Create nested table data with proper React components
    const modifiedComprehensiveData = comprehensiveData.map((item) => ({
      ...item,
      children: item.children && (
        <Box p="400">
          <Heading size="sm" mb="300" color="neutral.12">
            {item.name as React.ReactNode} Details
          </Heading>
          <DataTableWithModals
            columns={nestedComprehensiveTableColumns}
            rows={item.children as DataTableRowItem[]}
            allowsSorting={true}
            isResizable={true}
            onRowClick={() => {}}
          />
        </Box>
      ),
    }));

    const handleColumnToggle = (colId: string) => {
      setVisibleColumns((prev) =>
        prev.includes(colId)
          ? prev.filter((id) => id !== colId)
          : [...prev, colId]
      );
    };

    const selectedCount = Array.from(selectedKeys).length;

    return (
      <Stack gap="500">
        <Stack gap="300">
          <Heading size="lg">🚀 DataTable - All Features Showcase</Heading>
          <Text color="neutral.11" fontSize="400">
            Comprehensive demo showcasing all DataTable capabilities. Toggle
            features below to see how they work together.
          </Text>
        </Stack>

        {/* Controls Section */}
        <Box
          p="500"
          bg="neutral.2"
          borderRadius="200"
          border="1px solid"
          borderColor="neutral.6"
        >
          {/* Search */}
          <Box mb="500">
            <Heading size="sm" mb="200" fontSize="350" fontWeight="600">
              🔍 Search & Filter
            </Heading>
            <TextInput
              value={search}
              onChange={setSearch}
              placeholder="Filter table..."
              width="300px"
              aria-label="filter table"
            />
          </Box>

          {/* Column Visibility */}
          <Box mb="500">
            <Heading size="sm" mb="200" fontSize="350" fontWeight="600">
              👁️ Column Visibility
            </Heading>
            <Flex flexWrap="wrap" gap="300">
              {allColumns.map((colId) => (
                <Checkbox
                  key={colId}
                  isSelected={visibleColumns.includes(colId)}
                  onChange={() => handleColumnToggle(colId)}
                >
                  {colId.charAt(0).toUpperCase() + colId.slice(1)}
                </Checkbox>
              ))}
            </Flex>
          </Box>

          {/* Table Settings */}
          <Box marginBottom="500">
            <Heading
              size="lg"
              marginBottom="200"
              fontSize="350"
              fontWeight="600"
            >
              ⚙️ Table Settings
            </Heading>
            <Flex flexWrap="wrap" gap="400">
              <Checkbox isSelected={isResizable} onChange={setIsResizable}>
                Resizable Columns{" "}
              </Checkbox>
              <Checkbox isSelected={allowsSorting} onChange={setAllowsSorting}>
                Sorting
              </Checkbox>
              <Checkbox
                isSelected={isRowClickable}
                onChange={setIsRowClickable}
              >
                Clickable Rows
              </Checkbox>
              <Checkbox isSelected={stickyHeader} onChange={setStickyHeader}>
                Sticky Header
              </Checkbox>
              <Checkbox isSelected={isTruncated} onChange={setIsTruncated}>
                Text Truncation
              </Checkbox>
              <Checkbox
                isSelected={density === "condensed"}
                onChange={(checked) =>
                  setDensity(checked ? "condensed" : "default")
                }
              >
                Condensed Mode
              </Checkbox>
            </Flex>
          </Box>

          {/* Selection Settings */}
          <Box marginBottom="500">
            <Heading
              size="lg"
              marginBottom="200"
              fontSize="350"
              fontWeight="600"
            >
              ✅ Selection Settings
            </Heading>
            <Flex alignItems="center" gap="400" marginBottom="200">
              <Text as="label" fontSize="350" id="select-selection-mode">
                Selection Mode:
              </Text>
              <Select.Root
                selectedKey={selectionMode}
                onSelectionChange={(key) =>
                  setSelectionMode(key as "none" | "single" | "multiple")
                }
                size="sm"
                aria-labelledby="select-selection-mode"
              >
                <Select.Options>
                  <Select.Option id="none">None</Select.Option>
                  <Select.Option id="single">Single</Select.Option>
                  <Select.Option id="multiple">Multiple</Select.Option>
                </Select.Options>
              </Select.Root>
              {selectionMode !== "none" && (
                <Checkbox
                  isSelected={disallowEmptySelection}
                  onChange={setDisallowEmptySelection}
                >
                  Require Selection
                </Checkbox>
              )}
            </Flex>
            {selectionMode !== "none" && (
              <Text fontSize="350" color="neutral.11">
                <Text as="span" fontWeight="600">
                  Selected:
                </Text>{" "}
                {selectedCount} row(s) |{" "}
                <Text as="span" fontWeight="600">
                  IDs:
                </Text>{" "}
                {Array.from(selectedKeys).join(", ") || "None"}
              </Text>
            )}
          </Box>

          {/* Quick Actions */}
          <Box>
            <Heading
              size="lg"
              marginBottom="200"
              fontSize="350"
              fontWeight="600"
            >
              🎯 Quick Actions
            </Heading>
            <Flex gap="200" flexWrap="wrap">
              <Button
                onPress={() => setSelectedKeys(new Set())}
                isDisabled={selectionMode === "none"}
                size="xs"
                variant="outline"
              >
                Clear Selection
              </Button>
              <Button
                onPress={() => setVisibleColumns(allColumns)}
                size="xs"
                variant="outline"
              >
                Show All Columns
              </Button>
              <Button
                onPress={() => setVisibleColumns(["name", "role", "status"])}
                size="xs"
                variant="outline"
              >
                Minimal View
              </Button>
              <Button
                onPress={() => setSearch("Engineer")}
                size="xs"
                variant="outline"
              >
                Search "Engineer"
              </Button>
            </Flex>
          </Box>
        </Box>

        {/* Data Table */}
        <Box
          border="1px solid"
          borderColor="neutral.4"
          borderRadius="200"
          overflow="hidden"
          maxHeight={stickyHeader ? "400px" : "none"}
          // overflowY={stickyHeader ? "auto" : "visible"}
        >
          <DataTableWithModals
            columns={comprehensiveColumns}
            rows={modifiedComprehensiveData}
            visibleColumns={visibleColumns}
            search={search}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            selectionMode={selectionMode}
            disallowEmptySelection={disallowEmptySelection}
            isResizable={isResizable}
            allowsSorting={allowsSorting}
            maxHeight={stickyHeader ? "400px" : undefined}
            isTruncated={isTruncated}
            density={density}
            nestedKey="children"
            onRowClick={isRowClickable ? () => {} : undefined}
          />
        </Box>
        {/* Feature Information */}
        <Box
          p="400"
          bg="info.2"
          borderRadius="200"
          border="1px solid"
          borderColor="info.4"
          fontSize="350"
        >
          <Heading size="lg" marginBottom="300" fontSize="400" fontWeight="600">
            💡 Features Demonstrated
          </Heading>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gap="300"
          >
            <Box>
              <Text fontWeight="600">✨ Core Features:</Text>
              <Box as="ul" marginLeft="400" paddingLeft="0" marginTop="100">
                <Text as="li">Column visibility management</Text>
                <Text as="li">Resizable columns</Text>
                <Text as="li">Search with highlighting</Text>
                <Text as="li">Sorting (controlled)</Text>
              </Box>
            </Box>
            <Box>
              <Text fontWeight="600">🎯 Selection:</Text>
              <Box as="ul" marginLeft="400" paddingLeft="0" marginTop="100">
                <Text as="li">Single/Multiple selection modes</Text>
                <Text as="li">Required selection option</Text>
                <Text as="li">Programmatic selection control</Text>
              </Box>
            </Box>
            <Box>
              <Text fontWeight="600">🚀 Advanced:</Text>
              <Box as="ul" marginLeft="400" paddingLeft="0" marginTop="100">
                <Text as="li">Nested rows with expand/collapse</Text>
                <Text as="li">Custom cell rendering (Status badges)</Text>
                <Text as="li">Text truncation with hover</Text>
                <Text as="li">Sticky headers</Text>
                <Text as="li">Density options</Text>
                <Text as="li">Clickable rows</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    );
  },
  args: {},
};

