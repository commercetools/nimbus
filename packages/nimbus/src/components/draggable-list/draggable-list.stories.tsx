import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "@/components";
import { DraggableList } from "./draggable-list";
import { items } from "./utils/draggable-list.test-data";

const meta: Meta<typeof DraggableList.Root> = {
  title: "components/DraggableList",
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => {
    return (
      <Flex gap={800}>
        <DraggableList.Root aria-label="example list" items={items} />
        <DraggableList.Root
          aria-label="example drop target"
          width="2xs"
          removableItems
        />
      </Flex>
    );
  },
};
