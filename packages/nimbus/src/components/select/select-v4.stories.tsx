import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchField, Input } from "react-aria-components";
import {
  Autocomplete,
  useFilter,
  Virtualizer,
  ListLayout,
  ListBox,
  Select,
  Text,
  Box,
} from "@commercetools/nimbus";
import { expect, within } from "storybook/test";

const meta: Meta = {
  title: "Compositions/Select v4",
};

export default meta;

type Story = StoryObj<typeof meta>;

const fruits = [
  { id: "apple", name: "Apple" },
  { id: "banana", name: "Banana" },
  { id: "orange", name: "Orange" },
  { id: "mango", name: "Mango" },
  { id: "kiwi", name: "Kiwi" },
  { id: "strawberry", name: "Strawberry" },
  { id: "blueberry", name: "Blueberry" },
  { id: "pineapple", name: "Pineapple" },
  { id: "watermelon", name: "Watermelon" },
  { id: "peach", name: "Peach" },
  { id: "pear", name: "Pear" },
  { id: "cherry", name: "Cherry" },
];

/**
 * SearchableSelect — A Select with a search field inside its popover.
 *
 * Uses the Autocomplete component to wrap a SearchField + Select.Options
 * (which is a React Aria ListBox) inside Select.Root's built-in popover.
 * The Autocomplete component handles filtering and virtual focus management
 * between the search input and the list.
 *
 * This implements the "searchable select" pattern from the Nimbus 4.0 RFC:
 * Select manages single-selection state and the trigger button while
 * Autocomplete handles live search filtering inside the popover.
 */
export const SearchableSelect: Story = {
  render: () => {
    const SearchableSelectExample = () => {
      const { contains } = useFilter({ sensitivity: "base" });

      return (
        <Box width="320px">
          <Text fontSize="350" color="fg.muted" marginBottom="100">
            Fruit
          </Text>
          <Select.Root
            aria-label="Select a fruit"
            data-testid="searchable-select"
          >
            <Autocomplete filter={contains}>
              <SearchField
                aria-label="Search fruits"
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
                  placeholder="Search..."
                  style={{
                    border: "none",
                    outline: "none",
                    flex: 1,
                    background: "transparent",
                    fontSize: 14,
                  }}
                />
              </SearchField>
              <Select.Options
                items={fruits}
                renderEmptyState={() => (
                  <Text padding="300" color="fg.muted">
                    No matches
                  </Text>
                )}
              >
                {(item) => (
                  <Select.Option id={item.id} textValue={item.name}>
                    {item.name}
                  </Select.Option>
                )}
              </Select.Options>
            </Autocomplete>
          </Select.Root>
        </Box>
      );
    };
    return <SearchableSelectExample />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the trigger button", async () => {
      const select = canvas.getByTestId("searchable-select");
      const button = select.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  },
};

const bigItems = Array.from({ length: 10000 }, (_, i) => ({
  id: String(i),
  name: `Option ${i}`,
}));

/**
 * VirtualizedSelect — A Select with 10,000 items rendered efficiently via Virtualizer.
 *
 * The Virtualizer only renders the visible slice of items in the DOM, keeping
 * memory usage and layout cost proportional to the viewport rather than the
 * total list size. Autocomplete provides live filtering on top of virtualization.
 *
 * Demonstrates: Select.Root (selection state) + Autocomplete (filtering) +
 * Virtualizer (windowed rendering) + ListBox (accessible list widget).
 *
 * Note: ListBox is used here instead of Select.Options because Virtualizer
 * requires direct ownership of its collection child and wraps it in a
 * scroll container — Select.Options works the same way for basic virtualization
 * but using ListBox.Root makes the virtualization boundary explicit.
 */
export const VirtualizedSelect: Story = {
  render: () => {
    const VirtualizedSelectExample = () => {
      const { contains } = useFilter({ sensitivity: "base" });
      const [inputValue, setInputValue] = useState("");

      const filtered = inputValue
        ? bigItems.filter((item) => contains(item.name, inputValue))
        : bigItems;

      return (
        <Box width="320px">
          <Text fontSize="350" color="fg.muted" marginBottom="100">
            Pick from 10,000 options
          </Text>
          <Select.Root
            aria-label="Select an option"
            data-testid="virtualized-select"
          >
            <Autocomplete inputValue={inputValue} onInputChange={setInputValue}>
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
          </Select.Root>
        </Box>
      );
    };
    return <VirtualizedSelectExample />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the trigger button", async () => {
      const select = canvas.getByTestId("virtualized-select");
      const button = select.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  },
};
