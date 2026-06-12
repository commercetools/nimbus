import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Key, Selection } from "react-aria-components";
import {
  Collection,
  SearchField,
  Input,
  Popover,
  DialogTrigger,
  Button as RaButton,
  Dialog,
} from "react-aria-components";
import {
  Autocomplete,
  useFilter,
  Virtualizer,
  ListLayout,
  ListBox,
  Tree,
  GridList,
  Stack,
  Box,
  Text,
  TextInput,
  Button,
} from "@commercetools/nimbus";
import { expect, fn, userEvent, within } from "storybook/test";

const meta: Meta = {
  title: "Compositions/ComboBox v4",
};

export default meta;

type Story = StoryObj<typeof meta>;

interface CategoryNode {
  id: string;
  name: string;
  children: CategoryNode[];
}

const categoryTree: CategoryNode[] = [
  {
    id: "clothing",
    name: "Clothing",
    children: [
      {
        id: "mens",
        name: "Men's Wear",
        children: [
          { id: "shirts", name: "Shirts", children: [] },
          { id: "trousers", name: "Trousers", children: [] },
        ],
      },
      {
        id: "womens",
        name: "Women's Wear",
        children: [
          { id: "dresses", name: "Dresses", children: [] },
          { id: "skirts", name: "Skirts", children: [] },
        ],
      },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    children: [
      { id: "bags", name: "Bags", children: [] },
      { id: "jewelry", name: "Jewelry", children: [] },
    ],
  },
  {
    id: "footwear",
    name: "Footwear",
    children: [
      { id: "sneakers", name: "Sneakers", children: [] },
      { id: "boots", name: "Boots", children: [] },
      { id: "sandals", name: "Sandals", children: [] },
    ],
  },
];

function collectAllIds(nodes: CategoryNode[]): Key[] {
  const ids: Key[] = [];
  function walk(list: CategoryNode[]) {
    for (const n of list) {
      ids.push(n.id);
      walk(n.children);
    }
  }
  walk(nodes);
  return ids;
}

function filterTree(
  nodes: CategoryNode[],
  text: string,
  matcher: (a: string, b: string) => boolean
): CategoryNode[] {
  const result: CategoryNode[] = [];
  for (const node of nodes) {
    const childMatches = filterTree(node.children, text, matcher);
    if (matcher(node.name, text) || childMatches.length > 0) {
      result.push({
        ...node,
        children: childMatches.length > 0 ? childMatches : node.children,
      });
    }
  }
  return result;
}

function renderCategoryNode(node: CategoryNode) {
  return (
    <Tree.Item key={node.id} id={node.id} textValue={node.name}>
      <Tree.ItemContent>
        <Tree.Indicator />
        {node.name}
      </Tree.ItemContent>
      {node.children.length > 0 && (
        <Collection items={node.children}>{renderCategoryNode}</Collection>
      )}
    </Tree.Item>
  );
}

/**
 * Tree ComboBox — the original motivating use case for Nimbus 4.0.
 *
 * A text input with a popover containing a filterable category tree.
 * Demonstrates: Autocomplete (filtering + virtual focus) + Tree (hierarchy)
 * composed inside a popover triggered by an input.
 */
export const TreeComboBox: Story = {
  render: () => {
    const TreeComboBoxExample = () => {
      const { contains } = useFilter({ sensitivity: "base" });
      const [inputValue, setInputValue] = useState("");
      const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
      );
      const [isOpen, setIsOpen] = useState(false);

      const filteredTree = inputValue
        ? filterTree(categoryTree, inputValue, contains)
        : categoryTree;
      const allIds = collectAllIds(filteredTree);

      const handleSelect = useCallback((keys: Selection) => {
        if (keys === "all" || keys.size === 0) return;
        const key = [...keys][0] as string;
        setSelectedCategory(key);
        setInputValue(key);
        setIsOpen(false);
      }, []);

      return (
        <Box width="320px">
          <Text fontSize="350" color="fg.muted" marginBottom="100">
            Category
          </Text>
          <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <RaButton
              onPress={() => setIsOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "8px 12px",
                border: "1px solid var(--chakra-colors-border)",
                borderRadius: 6,
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {selectedCategory || "Select a category..."}
            </RaButton>
            <Popover
              placement="bottom start"
              style={{
                width: 320,
                maxHeight: 360,
                overflow: "auto",
                background: "var(--chakra-colors-bg-panel)",
                border: "1px solid var(--chakra-colors-border)",
                borderRadius: 8,
                boxShadow: "var(--chakra-shadows-lg)",
                padding: 4,
              }}
            >
              <Dialog aria-label="Select category">
                <Autocomplete
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                >
                  <SearchField
                    aria-label="Filter categories"
                    autoFocus
                    style={{
                      display: "flex",
                      padding: "6px 8px",
                      border: "1px solid var(--chakra-colors-border)",
                      borderRadius: 6,
                      marginBottom: 4,
                    }}
                  >
                    <Input
                      placeholder="Search categories..."
                      style={{
                        border: "none",
                        outline: "none",
                        flex: 1,
                        background: "transparent",
                        fontSize: 14,
                      }}
                    />
                  </SearchField>
                  <Tree.Root
                    aria-label="Category tree"
                    selectionMode="single"
                    onSelectionChange={handleSelect}
                    defaultExpandedKeys={allIds}
                    items={filteredTree}
                    size="sm"
                  >
                    {renderCategoryNode}
                  </Tree.Root>
                </Autocomplete>
              </Dialog>
            </Popover>
          </DialogTrigger>
        </Box>
      );
    };
    return <TreeComboBoxExample />;
  },
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders the trigger button", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Select a category...",
      });
      expect(trigger).toBeInTheDocument();
    });
  },
};

const bigItems = Array.from({ length: 10000 }, (_, i) => ({
  id: String(i),
  name: `Option ${i}`,
}));

/**
 * Virtualized ComboBox — 10,000 items in a dropdown with Virtualizer.
 *
 * Proves the composition: Autocomplete (filtering) + Virtualizer (only
 * visible items rendered) + ListBox (selection).
 */
export const VirtualizedComboBox: Story = {
  render: () => {
    const VirtualizedComboBoxExample = () => {
      const { contains } = useFilter({ sensitivity: "base" });
      const [inputValue, setInputValue] = useState("");
      const [isOpen, setIsOpen] = useState(false);
      const [selected, setSelected] = useState<string | null>(null);

      const filtered = inputValue
        ? bigItems.filter((item) => contains(item.name, inputValue))
        : bigItems;

      return (
        <Box width="320px">
          <Text fontSize="350" color="fg.muted" marginBottom="100">
            Pick from 10,000 options
          </Text>
          <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <RaButton
              onPress={() => setIsOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "8px 12px",
                border: "1px solid var(--chakra-colors-border)",
                borderRadius: 6,
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {selected ? `Option ${selected}` : "Select an option..."}
            </RaButton>
            <Popover
              placement="bottom start"
              style={{
                width: 320,
                background: "var(--chakra-colors-bg-panel)",
                border: "1px solid var(--chakra-colors-border)",
                borderRadius: 8,
                boxShadow: "var(--chakra-shadows-lg)",
                padding: 4,
              }}
            >
              <Dialog aria-label="Select option">
                <Autocomplete
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                >
                  <SearchField
                    aria-label="Filter options"
                    autoFocus
                    style={{
                      display: "flex",
                      padding: "6px 8px",
                      border: "1px solid var(--chakra-colors-border)",
                      borderRadius: 6,
                      marginBottom: 4,
                    }}
                  >
                    <Input
                      placeholder="Search 10,000 options..."
                      style={{
                        border: "none",
                        outline: "none",
                        flex: 1,
                        background: "transparent",
                        fontSize: 14,
                      }}
                    />
                  </SearchField>
                  <div style={{ height: 300 }}>
                    <Virtualizer
                      layout={ListLayout}
                      layoutOptions={{ estimatedRowSize: 36 }}
                    >
                      <ListBox.Root
                        aria-label="Options"
                        selectionMode="single"
                        items={filtered}
                        onSelectionChange={(keys) => {
                          if (keys !== "all" && keys.size > 0) {
                            const key = [...keys][0] as string;
                            setSelected(key);
                            setIsOpen(false);
                          }
                        }}
                        style={{ display: "block", padding: 0 }}
                        renderEmptyState={() => (
                          <Text padding="300" color="fg.muted">
                            No matches
                          </Text>
                        )}
                      >
                        {(item) => (
                          <ListBox.Item id={item.id}>{item.name}</ListBox.Item>
                        )}
                      </ListBox.Root>
                    </Virtualizer>
                  </div>
                </Autocomplete>
              </Dialog>
            </Popover>
          </DialogTrigger>
        </Box>
      );
    };
    return <VirtualizedComboBoxExample />;
  },
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders the trigger", async () => {
      expect(
        canvas.getByRole("button", { name: "Select an option..." })
      ).toBeInTheDocument();
    });
  },
};

const gridItems = [
  { id: "red", name: "Red", color: "#ef4444" },
  { id: "blue", name: "Blue", color: "#3b82f6" },
  { id: "green", name: "Green", color: "#22c55e" },
  { id: "yellow", name: "Yellow", color: "#eab308" },
  { id: "purple", name: "Purple", color: "#a855f7" },
  { id: "pink", name: "Pink", color: "#ec4899" },
  { id: "orange", name: "Orange", color: "#f97316" },
  { id: "teal", name: "Teal", color: "#14b8a6" },
];

/**
 * Grid Picker ComboBox — a color swatch picker using GridList in a popover.
 *
 * Demonstrates: Autocomplete + GridList composition for visual grid pickers
 * (emoji, icon, color swatches, etc.)
 */
export const GridPickerComboBox: Story = {
  render: () => {
    const GridPickerExample = () => {
      const { contains } = useFilter({ sensitivity: "base" });
      const [inputValue, setInputValue] = useState("");
      const [isOpen, setIsOpen] = useState(false);
      const [selected, setSelected] = useState<string | null>(null);

      const filtered = inputValue
        ? gridItems.filter((item) => contains(item.name, inputValue))
        : gridItems;

      const selectedItem = gridItems.find((i) => i.id === selected);

      return (
        <Box width="320px">
          <Text fontSize="350" color="fg.muted" marginBottom="100">
            Color
          </Text>
          <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <RaButton
              onPress={() => setIsOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "8px 12px",
                border: "1px solid var(--chakra-colors-border)",
                borderRadius: 6,
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {selectedItem && (
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: selectedItem.color,
                  }}
                />
              )}
              {selectedItem?.name || "Pick a color..."}
            </RaButton>
            <Popover
              placement="bottom start"
              style={{
                width: 320,
                background: "var(--chakra-colors-bg-panel)",
                border: "1px solid var(--chakra-colors-border)",
                borderRadius: 8,
                boxShadow: "var(--chakra-shadows-lg)",
                padding: 8,
              }}
            >
              <Dialog aria-label="Select color">
                <Autocomplete
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                >
                  <SearchField
                    aria-label="Filter colors"
                    autoFocus
                    style={{
                      display: "flex",
                      padding: "6px 8px",
                      border: "1px solid var(--chakra-colors-border)",
                      borderRadius: 6,
                      marginBottom: 8,
                    }}
                  >
                    <Input
                      placeholder="Search colors..."
                      style={{
                        border: "none",
                        outline: "none",
                        flex: 1,
                        background: "transparent",
                        fontSize: 14,
                      }}
                    />
                  </SearchField>
                  <GridList.Root
                    aria-label="Colors"
                    selectionMode="single"
                    layout="grid"
                    items={filtered}
                    onSelectionChange={(keys) => {
                      if (keys !== "all" && keys.size > 0) {
                        setSelected([...keys][0] as string);
                        setIsOpen(false);
                      }
                    }}
                  >
                    {(item) => (
                      <GridList.Item id={item.id} textValue={item.name}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          gap="100"
                          padding="200"
                        >
                          <Box
                            width="40px"
                            height="40px"
                            borderRadius="200"
                            style={{ background: item.color }}
                          />
                          <Text fontSize="300">{item.name}</Text>
                        </Box>
                      </GridList.Item>
                    )}
                  </GridList.Root>
                </Autocomplete>
              </Dialog>
            </Popover>
          </DialogTrigger>
        </Box>
      );
    };
    return <GridPickerExample />;
  },
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders the trigger", async () => {
      expect(
        canvas.getByRole("button", { name: "Pick a color..." })
      ).toBeInTheDocument();
    });
  },
};
