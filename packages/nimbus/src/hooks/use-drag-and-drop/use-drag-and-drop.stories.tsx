import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { useState } from "react";
import { Box, Flex, Stack, Text, DraggableList } from "@commercetools/nimbus";

const DRAG_DELAY_MS = 50;

const wait = (ms: number = DRAG_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function dragItem(
  canvas: ReturnType<typeof within>,
  itemLabel: string,
  steps: number
) {
  const sourceElement = await canvas.findByRole("row", { name: itemLabel });
  sourceElement.focus();

  await userEvent.keyboard("{ArrowLeft}");
  await userEvent.keyboard("{Enter}");

  const key = steps > 0 ? "{ArrowDown}" : "{ArrowUp}";
  for (let i = 0; i < Math.abs(steps); i++) {
    await wait();
    await userEvent.keyboard(key);
  }
  await userEvent.keyboard("{Enter}");
}

async function dragItemToList(
  canvas: ReturnType<typeof within>,
  itemLabel: string,
  tabCount: number = 1
) {
  const sourceElement = await canvas.findByRole("row", { name: itemLabel });
  sourceElement.focus();

  await userEvent.keyboard("{ArrowLeft}");
  await wait();
  await userEvent.keyboard("{Enter}");

  for (let i = 0; i < tabCount; i++) {
    await wait();
    await userEvent.keyboard("{Tab}");
  }

  await wait();
  await userEvent.keyboard("{Enter}");
}

type Item = { key: string; label: string };

const initialItems: Item[] = [
  { key: "1", label: "Apple" },
  { key: "2", label: "Banana" },
  { key: "3", label: "Cherry" },
  { key: "4", label: "Date" },
];

const ReorderDemo = () => {
  const [items, setItems] = useState<Item[]>(initialItems);

  return (
    <Stack gap="400">
      <DraggableList.Root
        aria-label="reorder list"
        items={items}
        onUpdateItems={(updated) => setItems(updated as Item[])}
      />
      <Text data-testid="order">
        {items.map((item) => item.label).join(", ")}
      </Text>
    </Stack>
  );
};

const NamespaceIsolationDemo = () => {
  const [alphaItems, setAlphaItems] = useState<Item[]>([
    { key: "a1", label: "Alpha 1" },
    { key: "a2", label: "Alpha 2" },
  ]);
  const [betaItems, setBetaItems] = useState<Item[]>([
    { key: "b1", label: "Beta 1" },
    { key: "b2", label: "Beta 2" },
  ]);

  return (
    <Flex gap="600">
      <Box>
        <DraggableList.Root
          aria-label="alpha list"
          items={alphaItems}
          onUpdateItems={(updated) => setAlphaItems(updated as Item[])}
          dragNamespace="alpha"
        />
        <Text data-testid="alpha-order">
          {alphaItems.map((i) => i.label).join(", ")}
        </Text>
      </Box>
      <Box>
        <DraggableList.Root
          aria-label="beta list"
          items={betaItems}
          onUpdateItems={(updated) => setBetaItems(updated as Item[])}
          dragNamespace="beta"
        />
        <Text data-testid="beta-order">
          {betaItems.map((i) => i.label).join(", ")}
        </Text>
      </Box>
    </Flex>
  );
};

const CrossListTransferDemo = () => {
  const [sourceItems, setSourceItems] = useState<Item[]>([
    { key: "s1", label: "Source 1" },
    { key: "s2", label: "Source 2" },
    { key: "s3", label: "Source 3" },
  ]);
  const [targetItems, setTargetItems] = useState<Item[]>([
    { key: "t1", label: "Target 1" },
  ]);

  return (
    <Flex gap="600">
      <Box>
        <DraggableList.Root
          aria-label="source list"
          items={sourceItems}
          onUpdateItems={(updated) => setSourceItems(updated as Item[])}
          dragNamespace="shared"
        />
        <Text data-testid="source-order">
          {sourceItems.map((i) => i.label).join(", ")}
        </Text>
      </Box>
      <Box>
        <DraggableList.Root
          aria-label="target list"
          items={targetItems}
          onUpdateItems={(updated) => setTargetItems(updated as Item[])}
          dragNamespace="shared"
        />
        <Text data-testid="target-order">
          {targetItems.map((i) => i.label).join(", ")}
        </Text>
      </Box>
    </Flex>
  );
};

const meta: Meta = {
  title: "Hooks/UseDragAndDrop",
  tags: ["!autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Reorder: Story = {
  render: () => <ReorderDemo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders all items in initial order", async () => {
      const grid = await canvas.findByRole("grid", { name: /reorder list/i });
      const rows = within(grid).getAllByRole("row");
      expect(rows).toHaveLength(4);
      expect(canvas.getByTestId("order")).toHaveTextContent(
        "Apple, Banana, Cherry, Date"
      );
    });

    await step("Reorders first item down one position", async () => {
      await dragItem(canvas, "Apple", 1);

      await waitFor(() => {
        expect(canvas.getByTestId("order")).toHaveTextContent(
          "Banana, Apple, Cherry, Date"
        );
      });
    });
  },
};

export const NamespaceIsolation: Story = {
  render: () => <NamespaceIsolationDemo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Both lists render independently", async () => {
      await canvas.findByRole("grid", { name: /alpha list/i });
      await canvas.findByRole("grid", { name: /beta list/i });
      expect(canvas.getByTestId("alpha-order")).toHaveTextContent(
        "Alpha 1, Alpha 2"
      );
      expect(canvas.getByTestId("beta-order")).toHaveTextContent(
        "Beta 1, Beta 2"
      );
    });

    await step("Reorder within alpha list works", async () => {
      await dragItem(canvas, "Alpha 1", 1);

      await waitFor(() => {
        expect(canvas.getByTestId("alpha-order")).toHaveTextContent(
          "Alpha 2, Alpha 1"
        );
      });
    });

    await step("Beta list is unaffected by alpha reorder", async () => {
      expect(canvas.getByTestId("beta-order")).toHaveTextContent(
        "Beta 1, Beta 2"
      );
    });
  },
};

export const CrossListTransfer: Story = {
  render: () => <CrossListTransferDemo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Both lists render with initial items", async () => {
      await canvas.findByRole("grid", { name: /source list/i });
      await canvas.findByRole("grid", { name: /target list/i });
      expect(canvas.getByTestId("source-order")).toHaveTextContent(
        "Source 1, Source 2, Source 3"
      );
      expect(canvas.getByTestId("target-order")).toHaveTextContent("Target 1");
    });

    await step("Transfer item from source to target", async () => {
      await dragItemToList(canvas, "Source 1", 1);

      await waitFor(() => {
        expect(canvas.getByTestId("source-order")).toHaveTextContent(
          "Source 2, Source 3"
        );
        expect(canvas.getByTestId("target-order")).toHaveTextContent(
          /Source 1/
        );
      });
    });
  },
};
