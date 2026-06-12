import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { useDragAndDrop, SearchField, Input } from "react-aria-components";
import { useListData } from "react-stately";
import {
  Autocomplete,
  useFilter,
  Virtualizer,
  ListLayout,
  ListBox,
  GridList,
  Stack,
  Button,
  Heading,
  Text,
  IconButton,
} from "@commercetools/nimbus";
import { DragIndicator } from "@commercetools/nimbus-icons";

const meta: Meta = {
  title: "Compositions/Autocomplete",
};

export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// FilteredVirtualizedList
// ---------------------------------------------------------------------------

const TOTAL_ITEMS = 5000;

const allVirtualItems = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
  id: String(i),
  name: `Item ${i}`,
}));

/**
 * Autocomplete + Virtualizer(ListLayout) + ListBox
 *
 * A SearchInput drives client-side filtering across 5,000 items while
 * Virtualizer ensures only the visible slice is rendered at any time.
 * Type to narrow the list; clear to restore all items.
 */
export const FilteredVirtualizedList: Story = {
  render: () => {
    const FilteredVirtualizedExample = () => {
      const { contains } = useFilter({ sensitivity: "base" });
      const [inputValue, setInputValue] = useState("");

      const filteredItems = inputValue
        ? allVirtualItems.filter((item) => contains(item.name, inputValue))
        : allVirtualItems;

      return (
        <Stack gap="200">
          <Autocomplete inputValue={inputValue} onInputChange={setInputValue}>
            <SearchField
              aria-label="Filter items"
              style={{
                display: "flex",
                padding: "6px 8px",
                border: "1px solid var(--chakra-colors-border)",
                borderRadius: 6,
              }}
            >
              <Input
                placeholder="Type to filter 5000 items..."
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  background: "transparent",
                }}
              />
            </SearchField>
            <div style={{ height: 400 }}>
              <Virtualizer
                layout={ListLayout}
                layoutOptions={{ estimatedRowSize: 40 }}
              >
                <ListBox.Root
                  aria-label="Virtualized items"
                  selectionMode="single"
                  items={filteredItems}
                  style={{ display: "block", padding: 0 }}
                >
                  {(item) => (
                    <ListBox.Item id={item.id}>{item.name}</ListBox.Item>
                  )}
                </ListBox.Root>
              </Virtualizer>
            </div>
          </Autocomplete>
          <Text color="fg.muted" data-testid="match-count">
            {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
          </Text>
        </Stack>
      );
    };

    return <FilteredVirtualizedExample />;
  },
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders search input and virtualized listbox", async () => {
      const input = canvas.getByRole("searchbox", { name: "Filter items" });
      expect(input).toBeInTheDocument();

      const listbox = canvas.getByRole("listbox", {
        name: "Virtualized items",
      });
      expect(listbox).toBeInTheDocument();
    });

    await step(
      "Initially renders a virtualized subset — far fewer than 5000 items in the DOM",
      async () => {
        const options = canvas.getAllByRole("option");
        expect(options.length).toBeGreaterThan(0);
        expect(options.length).toBeLessThan(100);
      }
    );

    await step(
      "Typing filters the list and updates the match count",
      async () => {
        const input = canvas.getByRole("searchbox", { name: "Filter items" });
        await userEvent.type(input, "Item 1");

        await waitFor(() => {
          // All visible options should contain "Item 1"
          const options = canvas.getAllByRole("option");
          expect(options.length).toBeGreaterThan(0);
          options.forEach((opt) => {
            expect(opt.textContent).toMatch(/Item 1/i);
          });
        });

        await waitFor(() => {
          const countEl = canvas.getByTestId("match-count");
          // "Item 1" matches Item 1, Item 10-19, Item 100-199, Item 1000-1999 → well under 5000
          expect(countEl.textContent).not.toBe("5000 items");
        });
      }
    );

    await step("Clearing the input restores all 5000 items", async () => {
      const input = canvas.getByRole("searchbox", { name: "Filter items" });
      await userEvent.clear(input);

      await waitFor(() => {
        const countEl = canvas.getByTestId("match-count");
        expect(countEl).toHaveTextContent("5000 items");
      });
    });
  },
};

// ---------------------------------------------------------------------------
// TransferList
// ---------------------------------------------------------------------------

const initialAvailable = [
  { id: "red", name: "Red" },
  { id: "green", name: "Green" },
  { id: "blue", name: "Blue" },
  { id: "yellow", name: "Yellow" },
  { id: "purple", name: "Purple" },
  { id: "orange", name: "Orange" },
];

/**
 * Two ListBox instances with selection — "Available" on left, "Selected" on
 * right.  Click "Add →" to move checked items from available to selected;
 * click "← Remove" to move them back.
 */
export const TransferList: Story = {
  render: () => {
    const TransferListExample = () => {
      const [available, setAvailable] = useState(initialAvailable);
      const [selected, setSelected] = useState<typeof initialAvailable>([]);

      const [availableSelection, setAvailableSelection] = useState<Set<string>>(
        new Set()
      );
      const [selectedSelection, setSelectedSelection] = useState<Set<string>>(
        new Set()
      );

      const handleAdd = () => {
        const toMove = available.filter((item) =>
          availableSelection.has(item.id)
        );
        setAvailable((prev) =>
          prev.filter((item) => !availableSelection.has(item.id))
        );
        setSelected((prev) => [...prev, ...toMove]);
        setAvailableSelection(new Set());
      };

      const handleRemove = () => {
        const toMove = selected.filter((item) =>
          selectedSelection.has(item.id)
        );
        setSelected((prev) =>
          prev.filter((item) => !selectedSelection.has(item.id))
        );
        setAvailable((prev) => [...prev, ...toMove]);
        setSelectedSelection(new Set());
      };

      return (
        <Stack direction="row" gap="400" alignItems="flex-start">
          {/* Available list */}
          <Stack gap="200">
            <Heading as="h3" fontSize="300">
              Available
            </Heading>
            <ListBox.Root
              aria-label="Available items"
              selectionMode="multiple"
              items={available}
              selectedKeys={availableSelection}
              onSelectionChange={(keys) =>
                setAvailableSelection(new Set(keys as Set<string>))
              }
              style={{ minHeight: 200, minWidth: 160 }}
            >
              {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
            </ListBox.Root>
            <Text color="fg.muted" fontSize="200" data-testid="available-count">
              {available.length} item{available.length !== 1 ? "s" : ""}
            </Text>
          </Stack>

          {/* Transfer buttons */}
          <Stack gap="200" justifyContent="center" paddingTop="800">
            <Button
              onPress={handleAdd}
              isDisabled={availableSelection.size === 0}
              data-testid="add-button"
            >
              Add →
            </Button>
            <Button
              onPress={handleRemove}
              isDisabled={selectedSelection.size === 0}
              data-testid="remove-button"
            >
              ← Remove
            </Button>
          </Stack>

          {/* Selected list */}
          <Stack gap="200">
            <Heading as="h3" fontSize="300">
              Selected
            </Heading>
            <ListBox.Root
              aria-label="Selected items"
              selectionMode="multiple"
              items={selected}
              selectedKeys={selectedSelection}
              onSelectionChange={(keys) =>
                setSelectedSelection(new Set(keys as Set<string>))
              }
              style={{ minHeight: 200, minWidth: 160 }}
            >
              {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
            </ListBox.Root>
            <Text color="fg.muted" fontSize="200" data-testid="selected-count">
              {selected.length} item{selected.length !== 1 ? "s" : ""}
            </Text>
          </Stack>
        </Stack>
      );
    };

    return <TransferListExample />;
  },
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders both lists with correct initial counts", async () => {
      const availableListbox = canvas.getByRole("listbox", {
        name: "Available items",
      });
      const selectedListbox = canvas.getByRole("listbox", {
        name: "Selected items",
      });

      expect(availableListbox).toBeInTheDocument();
      expect(selectedListbox).toBeInTheDocument();

      expect(canvas.getByTestId("available-count")).toHaveTextContent(
        "6 items"
      );
      expect(canvas.getByTestId("selected-count")).toHaveTextContent("0 items");
    });

    await step("Add button is disabled when nothing is selected", async () => {
      const addButton = canvas.getByTestId("add-button");
      expect(addButton).toBeDisabled();
    });

    await step(
      "Selecting items in Available list enables the Add button",
      async () => {
        const redOption = canvas.getByRole("option", { name: "Red" });
        const blueOption = canvas.getByRole("option", { name: "Blue" });

        await userEvent.click(redOption);
        await userEvent.click(blueOption);

        await waitFor(() => {
          const addButton = canvas.getByTestId("add-button");
          expect(addButton).not.toBeDisabled();
        });
      }
    );

    await step(
      "Clicking Add moves selected items to the Selected list",
      async () => {
        const addButton = canvas.getByTestId("add-button");
        await userEvent.click(addButton);

        await waitFor(() => {
          expect(canvas.getByTestId("available-count")).toHaveTextContent(
            "4 items"
          );
          expect(canvas.getByTestId("selected-count")).toHaveTextContent(
            "2 items"
          );
        });

        // Items should now appear in Selected list
        const selectedListbox = canvas.getByRole("listbox", {
          name: "Selected items",
        });
        expect(
          within(selectedListbox).getByRole("option", { name: "Red" })
        ).toBeInTheDocument();
        expect(
          within(selectedListbox).getByRole("option", { name: "Blue" })
        ).toBeInTheDocument();
      }
    );

    await step("Remove button moves items back to Available list", async () => {
      // Select "Red" in the Selected list
      const selectedListbox = canvas.getByRole("listbox", {
        name: "Selected items",
      });
      const redInSelected = within(selectedListbox).getByRole("option", {
        name: "Red",
      });
      await userEvent.click(redInSelected);

      const removeButton = canvas.getByTestId("remove-button");
      await userEvent.click(removeButton);

      await waitFor(() => {
        expect(canvas.getByTestId("available-count")).toHaveTextContent(
          "5 items"
        );
        expect(canvas.getByTestId("selected-count")).toHaveTextContent(
          "1 item"
        );
      });

      // "Red" should be back in Available list
      const availableListbox = canvas.getByRole("listbox", {
        name: "Available items",
      });
      expect(
        within(availableListbox).getByRole("option", { name: "Red" })
      ).toBeInTheDocument();
    });
  },
};

// ---------------------------------------------------------------------------
// SortableListWithSearch
// ---------------------------------------------------------------------------

const initialSortableItems = [
  { id: "1", name: "Banana" },
  { id: "2", name: "Apple" },
  { id: "3", name: "Cherry" },
  { id: "4", name: "Date" },
  { id: "5", name: "Elderberry" },
];

/**
 * Autocomplete + GridList + dragAndDropHooks
 *
 * A SearchInput (via Autocomplete) filters items client-side while drag
 * handles allow reordering. GridList is used instead of ListBox because it
 * renders role="grid" / role="row", which supports interactive children
 * (drag-handle buttons) without an accessibility violation. The two concerns
 * compose independently: filtering narrows the displayed set; drag-and-drop
 * reorders the underlying state.
 */
export const SortableListWithSearch: Story = {
  render: () => {
    const SortableListWithSearchExample = () => {
      const { contains } = useFilter({ sensitivity: "base" });

      const list = useListData({ initialItems: initialSortableItems });

      const { dragAndDropHooks } = useDragAndDrop({
        getItems: (keys) =>
          [...keys].map((key) => ({
            "text/plain": list.getItem(key)?.name ?? "",
          })),
        onReorder(e) {
          if (e.target.dropPosition === "before") {
            list.moveBefore(e.target.key, [...e.keys]);
          } else if (e.target.dropPosition === "after") {
            list.moveAfter(e.target.key, [...e.keys]);
          }
        },
      });

      return (
        <Stack gap="200">
          <Autocomplete
            filter={(textValue, inputValue) => contains(textValue, inputValue)}
          >
            <SearchField
              aria-label="Filter and reorder"
              style={{
                display: "flex",
                padding: "6px 8px",
                border: "1px solid var(--chakra-colors-border)",
                borderRadius: 6,
                marginBottom: 4,
              }}
            >
              <Input
                placeholder="Type to filter..."
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  background: "transparent",
                }}
              />
            </SearchField>
            <GridList.Root
              aria-label="Sortable items"
              selectionMode="multiple"
              items={list.items}
              dragAndDropHooks={dragAndDropHooks}
            >
              {(item) => (
                <GridList.Item
                  id={item.id}
                  textValue={item.name}
                  data-testid={`item-${item.id}`}
                >
                  <IconButton
                    slot="drag"
                    size="2xs"
                    variant="ghost"
                    aria-label={`Reorder ${item.name}`}
                    data-testid={`drag-handle-${item.id}`}
                  >
                    <DragIndicator />
                  </IconButton>
                  {item.name}
                </GridList.Item>
              )}
            </GridList.Root>
          </Autocomplete>
        </Stack>
      );
    };

    return <SortableListWithSearchExample />;
  },
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  }) => {
    const canvas = within(canvasElement);

    await step("Renders search field and grid list", async () => {
      const input = canvas.getByRole("searchbox", {
        name: "Filter and reorder",
      });
      expect(input).toBeInTheDocument();

      const grid = canvas.getByRole("grid", { name: "Sortable items" });
      expect(grid).toBeInTheDocument();
    });

    await step("All items are rendered initially", async () => {
      const rows = canvas.getAllByRole("row");
      expect(rows).toHaveLength(initialSortableItems.length);
    });

    await step("Drag handles are present for each item", async () => {
      for (const item of initialSortableItems) {
        const handle = canvas.getByTestId(`drag-handle-${item.id}`);
        expect(handle).toBeInTheDocument();
      }
    });

    await step(
      "Typing filters items while preserving drag handles",
      async () => {
        const input = canvas.getByRole("searchbox", {
          name: "Filter and reorder",
        });
        await userEvent.type(input, "a");

        await waitFor(() => {
          // Items containing "a": Banana, Apple, Date
          expect(
            canvas.getByRole("row", { name: "Banana" })
          ).toBeInTheDocument();
          expect(
            canvas.getByRole("row", { name: "Apple" })
          ).toBeInTheDocument();
          expect(
            canvas.queryByRole("row", { name: "Cherry" })
          ).not.toBeInTheDocument();
        });

        // Drag handles for visible items should still be present
        const visibleRows = canvas.getAllByRole("row");
        expect(visibleRows.length).toBeGreaterThan(0);
      }
    );

    await step("Clearing search restores all items", async () => {
      const input = canvas.getByRole("searchbox", {
        name: "Filter and reorder",
      });
      await userEvent.clear(input);

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        expect(rows).toHaveLength(initialSortableItems.length);
      });
    });
  },
};
