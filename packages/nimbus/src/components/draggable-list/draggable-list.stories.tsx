import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { useState } from "react";
import { Flex } from "@/components";
import { DraggableList } from "./draggable-list";
import { items, fieldItems } from "./utils/draggable-list.test-data";

/**
 * Helper function to drag an item using keyboard navigation
 * @param canvas - The testing-library canvas element
 * @param itemLabel - The label of the item to drag
 * @param steps - Number of arrow key presses to move (positive = down, negative = up)
 */
async function dragItem(
  canvas: ReturnType<typeof within>,
  itemLabel: string,
  steps: number
) {
  // Find the source item row
  const sourceElement = await canvas.findByRole("row", {
    name: itemLabel,
  });

  // Focus the source item
  sourceElement.focus();

  // Press left arrow to focus the drag handle, then Enter to enter drag mode
  await userEvent.keyboard("{ArrowLeft}");
  await userEvent.keyboard("{Enter}");

  // Navigate using arrow keys
  const key = steps > 0 ? "{ArrowDown}" : "{ArrowUp}";
  for (let i = 0; i < Math.abs(steps); i++) {
    // Delay to ensure drag mode is fully activated
    await new Promise((resolve) => setTimeout(resolve, 50));
    await userEvent.keyboard(key);
  }

  // Drop the item with Enter
  await userEvent.keyboard("{Enter}");
}

const meta: Meta<typeof DraggableList.Root> = {
  title: "Components/DraggableList",
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => {
    return <DraggableList.Root aria-label="base list" items={items} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step(
      "Renders a gridlist with the expected number of items",
      async () => {
        // Item renders a grid
        const grid = await canvas.findByRole("grid", { name: /base list/i });
        // Ensure that items are rendered.
        // The first tick paints the empty state, so we need to make sure they have been loaded
        await new Promise((resolve) => setTimeout(resolve, 10));
        const itemNodes = await within(grid).findAllByRole("gridcell");
        // Grid renders 5 items
        expect(itemNodes.length).toBe(5);
      }
    );
    await step("Renders each item with expected content", async () => {
      for await (const item of items) {
        // Item has expected accessible label
        const itemNode = await canvas.findByLabelText(item.label as string);
        // Item contains node with expected aria role
        await within(itemNode).findByRole("gridcell");
        // Item has expected text content
        await within(itemNode).findByText(item.label as string);
        // Item has drag handle button
        await within(itemNode).findByRole("button", {
          name: new RegExp(`Drag ${item.label}`, "i"),
        });
      }
    });
  },
};

export const DragAndDrop: Story = {
  render: () => {
    return <DraggableList.Root aria-label="dnd list" items={items} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Check that drag cursor appears on hover", async () => {
      for await (const item of items) {
        const itemNode = await canvas.findByLabelText(item.label as string);
        // Hover over the item
        await userEvent.hover(itemNode);
        // Wait for any hover state changes and verify cursor style
        await waitFor(() => {
          const computedStyle = window.getComputedStyle(itemNode);
          // Verify the cursor is set to grab or move (common drag cursors)
          expect(["grab"]).toContain(computedStyle.cursor);
        });
        // Unhover to reset state
        await userEvent.unhover(itemNode);
      }
    });

    await step("Test that items can be dragged", async () => {
      const grid = await canvas.findByRole("grid", { name: /dnd list/i });
      // Ensure that items are rendered.
      // The first tick paints the empty state, so we need to make sure they have been loaded
      await new Promise((resolve) => setTimeout(resolve, 10));
      // Get first item to drag
      const firstItem = items[0]; // key: "1"

      // Verify initial order by checking data-key attributes
      const initialItems = await within(grid).findAllByRole("row");
      expect(initialItems[0]).toHaveAttribute("data-key", "1");
      expect(initialItems[1]).toHaveAttribute("data-key", "2");
      expect(initialItems[2]).toHaveAttribute("data-key", "3");

      // Drag first item down 1 position (1 arrow press to move past item 2)
      await dragItem(canvas, firstItem.label as string, 1);

      // Wait for reorder and verify the list order changed
      await waitFor(
        async () => {
          const reorderedItems = await within(grid).findAllByRole("row");
          // After dragging first item down 1 position, order should be: 2, 1, 3
          expect(reorderedItems[0]).toHaveAttribute("data-key", "2");
          expect(reorderedItems[1]).toHaveAttribute("data-key", "1");
          expect(reorderedItems[2]).toHaveAttribute("data-key", "3");
        },
        { timeout: 2000 }
      );
    });
  },
};

export const EmptyState: Story = {
  render: () => {
    return <DraggableList.Root aria-label="empty list" />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders default empty message", async () => {
      const grid = await canvas.findByRole("grid", { name: /empty list/i });
      expect(grid).toHaveAttribute("data-empty");
      // The empty message is rendered via renderEmptyState
      await within(grid).findByText(/drop items here/i);
    });
  },
};

export const CustomEmptyState: Story = {
  render: () => {
    return (
      <DraggableList.Root
        aria-label="custom empty list"
        renderEmptyState="No items available"
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders custom empty message", async () => {
      const grid = await canvas.findByRole("grid", {
        name: /custom empty list/i,
      });
      expect(grid).toHaveAttribute("data-empty");
      await within(grid).findByText(/No items available/i);
    });
  },
};

export const CrossListDragAndDrop: Story = {
  render: () => {
    const ControlledLists = () => {
      const [leftItems, setLeftItems] = useState(items.slice(0, 3));
      const [rightItems, setRightItems] = useState(items.slice(3));

      return (
        <Flex gap={800} data-testid="cross-list-container">
          <DraggableList.Root
            aria-label="source list"
            items={leftItems}
            onUpdateItems={setLeftItems}
          />
          <DraggableList.Root
            aria-label="target list"
            items={rightItems}
            onUpdateItems={setRightItems}
          />
        </Flex>
      );
    };

    return <ControlledLists />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify initial state of both lists", async () => {
      const sourceGrid = await canvas.findByRole("grid", {
        name: /source list/i,
      });
      const targetGrid = await canvas.findByRole("grid", {
        name: /target list/i,
      });
      // Ensure that items are rendered.
      // The first tick paints the empty state, so we need to make sure they have been loaded
      await new Promise((resolve) => setTimeout(resolve, 10));

      const sourceItems = await within(sourceGrid).findAllByRole("row");
      const targetItems = await within(targetGrid).findAllByRole("row");

      expect(sourceItems.length).toBe(3);
      expect(targetItems.length).toBe(2);
    });

    await step("Drag item from source to target list", async () => {
      const sourceGrid = await canvas.findByRole("grid", {
        name: /source list/i,
      });
      const targetGrid = await canvas.findByRole("grid", {
        name: /target list/i,
      });

      // Get the first item from source list
      const firstItem = items[0]; // "Item 1"

      // Find the item in source list
      const sourceItemRow = await within(sourceGrid).findByRole("row", {
        name: firstItem.label as string,
      });
      sourceItemRow.focus();

      // Start drag
      await userEvent.keyboard("{ArrowLeft}");
      await userEvent.keyboard("{Enter}");

      // Navigate to target grid - this is complex in React Aria
      // For keyboard drag between lists, we need to use Tab to move between grids
      await userEvent.keyboard("{Tab}");

      // Drop in target list
      await userEvent.keyboard("{Enter}");

      // Wait for items to update
      await waitFor(
        async () => {
          const updatedSourceItems =
            await within(sourceGrid).findAllByRole("row");
          const updatedTargetItems =
            await within(targetGrid).findAllByRole("row");

          // Source should have one less item
          expect(updatedSourceItems.length).toBe(2);
          // Target should have one more item
          expect(updatedTargetItems.length).toBe(3);
        },
        { timeout: 2000 }
      );
    });
  },
};

export const RemovableItems: Story = {
  render: () => {
    const ControlledList = () => {
      const [listItems, setListItems] = useState(items);
      const onUpdateItems = fn(setListItems);

      return (
        <DraggableList.Root
          aria-label="removable list"
          items={listItems}
          removableItems
          onUpdateItems={onUpdateItems}
        />
      );
    };

    return <ControlledList />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify remove buttons are present", async () => {
      const grid = await canvas.findByRole("grid", {
        name: /removable list/i,
      });
      // Ensure that items are rendered.
      // The first tick paints the empty state, so we need to make sure they have been loaded
      await new Promise((resolve) => setTimeout(resolve, 10));
      const rows = await within(grid).findAllByRole("row");

      for await (const row of rows) {
        // Each row should have a remove button
        await within(row).findByRole("button", { name: /remove item/i });
      }
    });

    await step("Remove an item by clicking remove button", async () => {
      const grid = await canvas.findByRole("grid", {
        name: /removable list/i,
      });

      const initialRows = await within(grid).findAllByRole("row");
      const initialCount = initialRows.length;

      // Find the first item and its remove button
      const firstRow = initialRows[0];
      const removeButton = await within(firstRow).findByRole("button", {
        name: /remove item/i,
      });

      // Click the remove button
      await userEvent.click(removeButton);

      // Wait for the item to be removed
      await waitFor(
        async () => {
          const updatedRows = await within(grid).findAllByRole("row");
          expect(updatedRows.length).toBe(initialCount - 1);
        },
        { timeout: 2000 }
      );
    });

    await step("Remove item via keyboard", async () => {
      const grid = await canvas.findByRole("grid", {
        name: /removable list/i,
      });

      const rowsBefore = await within(grid).findAllByRole("row");
      const countBefore = rowsBefore.length;

      // Focus on a row and navigate to remove button
      const secondRow = rowsBefore[1];
      secondRow.focus();

      // Navigate right to the remove button (drag handle -> content -> remove)
      await userEvent.keyboard("{ArrowRight}");
      await userEvent.keyboard("{ArrowRight}");

      // Press Enter to remove
      await userEvent.keyboard("{Enter}");

      const updatedRows = await within(grid).findAllByRole("row");
      expect(updatedRows.length).toBe(countBefore - 1);
    });
  },
};

export const DisabledItems: Story = {
  render: () => {
    const itemsWithDisabled = [
      { key: "1", label: "Enabled Item 1" },
      { key: "2", label: "Disabled Item", isDisabled: true },
      { key: "3", label: "Enabled Item 2" },
    ];

    return (
      <DraggableList.Root
        aria-label="list with disabled items"
        items={itemsWithDisabled}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify disabled item has proper attributes", async () => {
      const grid = await canvas.findByRole("grid", {
        name: /list with disabled items/i,
      });
      const disabledRow = await within(grid).findByRole("row", {
        name: /Disabled Item/i,
      });

      expect(disabledRow).toHaveAttribute("data-disabled");
    });

    await step("Verify disabled item cannot be dragged", async () => {
      const grid = await canvas.findByRole("grid", {
        name: /list with disabled items/i,
      });

      const disabledRow = await within(grid).findByRole("row", {
        name: /Disabled Item/i,
      });

      // Try to focus and drag the disabled item
      disabledRow.focus();
      await userEvent.keyboard("{ArrowLeft}");
      await userEvent.keyboard("{Enter}");

      // The drag should not start - verify by checking if we can still navigate normally
      // If drag started, arrow keys would move the item
      await userEvent.keyboard("{ArrowDown}");

      // Disabled item should still be in place
      const rows = await within(grid).findAllByRole("row");
      expect(rows[1]).toHaveAttribute("data-key", "2");
    });
  },
};

export const CustomChildren: Story = {
  render: () => {
    const customItems = [
      {
        key: "a",
        label: "Custom A",
        metadata: "extra data",
        colorPalette: "sky",
      },
      {
        key: "b",
        label: "Custom B",
        metadata: "more info",
        colorPalette: "yellow",
      },
      {
        key: "c",
        label: "Custom C",
        metadata: "additional",
        colorPalette: "pink",
      },
    ];

    return (
      <DraggableList.Root aria-label="custom children list" items={customItems}>
        {(item) => (
          <DraggableList.Item
            key={item.key}
            id={item.key}
            textValue={item.label}
            colorPalette={item.colorPalette}
          >
            <div>
              <strong>{item.label}</strong>
              <span> - {item.metadata}</span>
            </div>
          </DraggableList.Item>
        )}
      </DraggableList.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify custom content is rendered", async () => {
      const grid = await canvas.findByRole("grid", {
        name: /custom children list/i,
      });

      // Check for custom metadata content
      await within(
        await within(grid).findByRole("row", { name: /custom a/i })
      ).findByText(/extra data/i);
      await within(
        await within(grid).findByRole("row", { name: /custom b/i })
      ).findByText(/more info/i);
      await within(
        await within(grid).findByRole("row", { name: /custom c/i })
      ).findByText(/additional/i);
    });

    await step("Verify drag and drop works with custom children", async () => {
      const grid = await canvas.findByRole("grid", {
        name: /custom children list/i,
      });

      const rows = await within(grid).findAllByRole("row");
      expect(rows[0]).toHaveAttribute("data-key", "a");

      // Drag first item (Custom A) down 1 position (1 arrow press)
      await dragItem(canvas, "Custom A", 1);

      await waitFor(
        async () => {
          const updatedRows = await within(grid).findAllByRole("row");
          expect(updatedRows[0]).toHaveAttribute("data-key", "b");
          expect(updatedRows[1]).toHaveAttribute("data-key", "a");
        },
        { timeout: 2000 }
      );
    });
  },
};

export const ControlledMode: Story = {
  render: () => {
    const ControlledComponent = () => {
      const [listItems, setListItems] = useState(items);

      return (
        <>
          <DraggableList.Root
            aria-label="controlled list"
            items={listItems}
            onUpdateItems={setListItems}
          />
          <Flex mt="400" direction="column" gap={100}>
            <div data-testid="item-count">Items: {listItems.length}</div>
            <div data-testid="item-order">
              Order: {listItems.map((item) => item.key).join(" ")}
            </div>
          </Flex>
        </>
      );
    };

    return <ControlledComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify controlled state updates", async () => {
      // Verify Items in state have expected initial count and order
      expect(await canvas.findByTestId("item-count")).toHaveTextContent(
        "Items: 5"
      );
      expect(await canvas.findByTestId("item-order")).toHaveTextContent(
        "Order: 1 2 3 4 5"
      );
      // Ensure that items are rendered.
      // The first tick paints the empty state, so we need to make sure they have been loaded
      await new Promise((resolve) => setTimeout(resolve, 10));
      // Drag first item (Item 1) down 1 position (1 arrow press)
      await dragItem(canvas, items[0].label as string, 1);
      // Wait for reorder
      await waitFor(
        async () => {
          // Order has changed (1 is after 2)
          expect(await canvas.findByTestId("item-order")).toHaveTextContent(
            "Order: 2 1 3 4 5"
          );
          // Item count should remain the same
          expect(await canvas.findByTestId("item-count")).toHaveTextContent(
            "Items: 5"
          );
        },
        { timeout: 2000 }
      );
    });
  },
};

export const SizeVariants: Story = {
  render: () => {
    return (
      <Flex direction="column" gap={800}>
        <DraggableList.Root
          aria-label="small list"
          items={items.slice(0, 2)}
          size="sm"
        />
        <DraggableList.Root
          aria-label="medium list"
          items={items.slice(0, 2)}
          size="md"
        />
      </Flex>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify both size variants render", async () => {
      await canvas.findByRole("grid", { name: /small list/i });
      await canvas.findByRole("grid", { name: /medium list/i });
    });
  },
};

export const Field: Story = {
  render: () => {
    const FieldComponent = () => {
      return (
        <DraggableList.Field
          label="Field Label"
          description="This is a helpful description"
          items={fieldItems}
        />
      );
    };

    return <FieldComponent />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify field label and description", async () => {
      await canvas.findByText("Field Label");
      await canvas.findByText("This is a helpful description");
    });

    await step("Verify draggable list is rendered within field", async () => {
      const grid = await canvas.findByRole("grid", { name: /field label/i });
      const rows = await within(grid).findAllByRole("row");
      expect(rows.length).toBe(5);
    });

    await step("Verify drag and drop works in field", async () => {
      const grid = await canvas.findByRole("grid", { name: /field label/i });
      const rows = await within(grid).findAllByRole("row");
      expect(rows.length).toBe(5);

      // Drag first item down 1 position (1 arrow press)
      await dragItem(canvas, fieldItems[0].label, 1);

      await waitFor(
        async () => {
          const updatedRows = await within(grid).findAllByRole("row");
          expect(updatedRows[0]).toHaveAttribute("data-key", "2");
        },
        { timeout: 2000 }
      );
    });
  },
};

export const FieldWithError: Story = {
  render: () => {
    return (
      <DraggableList.Field
        label="Required Field"
        description="Description text"
        error="This field is required"
        items={fieldItems}
        isInvalid
        isRequired
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify error message is displayed", async () => {
      await canvas.findByText("This field is required");
    });

    await step("Verify required indicator is present", async () => {
      // FormField should add required indicator to label
      const label = await canvas.findByText("Required Field");
      expect(label.parentElement).toContainHTML("*");
    });
  },
};

export const FieldDisabled: Story = {
  render: () => {
    return (
      <DraggableList.Field
        label="Disabled Field"
        description="This field is disabled"
        items={fieldItems}
        isDisabled
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify all items are disabled", async () => {
      const grid = await canvas.findByRole("grid", {
        name: /disabled field/i,
      });
      const rows = await within(grid).findAllByRole("row");

      for await (const row of rows) {
        expect(row).toHaveAttribute("data-disabled");
      }
    });

    await step("Verify drag is not possible when disabled", async () => {
      const grid = await canvas.findByRole("grid", {
        name: /disabled field/i,
      });
      const rows = await within(grid).findAllByRole("row");

      const firstRow = rows[0];
      firstRow.focus();

      // Try to initiate drag
      await userEvent.keyboard("{ArrowLeft}");
      await userEvent.keyboard("{Enter}");

      // Drag should not work - verify order hasn't changed
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{Enter}");

      const updatedRows = await within(grid).findAllByRole("row");
      expect(updatedRows[0]).toHaveAttribute("data-key", "1");
    });
  },
};

export const FieldWithInfoBox: Story = {
  render: () => {
    return (
      <DraggableList.Field
        label="List with Info"
        infoBox="This is additional information about this field"
        items={fieldItems}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify info box is displayed", async () => {
      const moreInfoButton = await canvas.findByRole("button", {
        name: /more info/i,
      });
      await userEvent.click(moreInfoButton);
      await within(document.body).findByText(
        /This is additional information about this field/i
      );
    });
  },
};

export const CustomColors: Story = {
  render: () => {
    const colorPalettes = [
      "sky",
      "mint",
      "lime",
      "yellow",
      "orange",
      "gold",
      "bronze",
      "grass",
      "green",
      "jade",
      "teal",
      "cyan",
      "blue",
      "indigo",
      "iris",
      "violet",
      "purple",
      "plum",
      "pink",
      "crimson",
      "ruby",
    ];
    return (
      <Flex flexWrap="wrap" gap="400">
        {colorPalettes.map((palette) => {
          const itemsForPalette = fieldItems.map((item) => ({
            ...item,
            key: `${palette}-${item.key}`,
          }));
          return (
            <DraggableList.Field
              key={palette}
              label={palette}
              items={itemsForPalette}
              removableItems
              width="3600"
              colorPalette={palette}
            />
          );
        })}
      </Flex>
    );
  },
};
