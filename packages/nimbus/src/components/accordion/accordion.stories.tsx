import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "./accordion";
import { Avatar, Button, Checkbox, Flex } from "@/components";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta: Meta<typeof Accordion.Root> = {
  title: "components/Accordion",
  component: Accordion.Root,
};

export default meta;

type Story = StoryObj<typeof Accordion.Root>;

const items = [
  { value: "a", title: "First Item", text: "Some value 1..." },
  { value: "b", title: "Second Item", text: "Some value 2..." },
  { value: "c", title: "Third Item", text: "Some value 3..." },
];

const sizes = ["sm", "md"] as const;

export const Basic: Story = {
  render: () => (
    <Accordion.Root>
      <Accordion.Item>
        <Accordion.Header>First Item</Accordion.Header>
        <Accordion.Content>First item content</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole("button", { name: "First Item" });
    const panel = canvas.getByRole("group", { hidden: true });

    await step("Can be focused with keyboard", async () => {
      await userEvent.tab();
      await waitFor(() => expect(trigger).toHaveFocus());
    });

    await step("Panel is initially hidden", async () => {
      await expect(panel).not.toBeVisible();
    });

    await step("Can be triggered with Enter key", async () => {
      await userEvent.keyboard("{Enter}");
      await expect(panel).toBeVisible();
    });

    await step("Can be triggered with Space key", async () => {
      await userEvent.keyboard(" ");
      await expect(panel).not.toBeVisible();
    });
  },
};

export const WithHeaderItemsToRight: Story = {
  render: () => (
    <Accordion.Root>
      <Accordion.Item value="a">
        <Accordion.Header>First Item</Accordion.Header>
        <Accordion.Content>First item content</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Header>
          Second Item
          <Accordion.HeaderRightContent>
            <Button tone="critical" m="100">
              First action
            </Button>
            <Button tone="neutral" m="100">
              Second Action
            </Button>
          </Accordion.HeaderRightContent>
        </Accordion.Header>
        <Accordion.Content>Second item content</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const additionalButtons = canvas.getAllByRole("button");
    const trigger = canvas.getByRole("button", { name: "Second Item" });

    await step("Additional buttons don't trigger accordion", async () => {
      const panel = canvas.getAllByRole("group", { hidden: true })[1];
      await expect(panel).not.toBeVisible();

      // Click additional buttons
      for (const button of Array.from(additionalButtons)) {
        if (button !== trigger) {
          await userEvent.click(button);
          await expect(panel).not.toBeVisible();
        }
      }
    });

    await step("Main trigger still works", async () => {
      const panel = canvas.getAllByRole("group", { hidden: true })[1];
      await userEvent.click(trigger);
      await expect(panel).toBeVisible();
    });

    await step("Main trigger still works", async () => {
      await userEvent.click(trigger);
    });
  },
};

const AccordionContent = () => {
  const avatarImg = "https://thispersondoesnotexist.com/ ";

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
      <Avatar src={avatarImg} firstName="Michael" lastName="Douglas" />
      <Checkbox marginLeft="100">Yes?</Checkbox>
      <Checkbox marginLeft="100">No?</Checkbox>
    </div>
  );
};

export const Sizes: Story = {
  render: () => (
    <>
      {sizes.map((size, index) => (
        <Accordion.Root key={index} size={size}>
          <Accordion.Item value={size}>
            <Accordion.Header>{size} size</Accordion.Header>
            <Accordion.Content>
              <Flex
                justifyContent="space-between"
                alignItems={"center"}
                borderColor="neutral.4"
              >
                <div style={{ marginRight: "100" }}>{size} size</div>
                <AccordionContent />
              </Flex>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      ))}
    </>
  ),
};

export const AllowMultiple: Story = {
  render: () => (
    <Accordion.Root allowsMultipleExpanded>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value}>
          <Accordion.Header>{item.title}</Accordion.Header>
          <Accordion.Content>{item.text}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Accordion.Root isDisabled>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value}>
          <Accordion.Header>{item.title}</Accordion.Header>
          <Accordion.Content>{item.text}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
};

export const DefaultExpandedKeys: Story = {
  render: () => (
    <Accordion.Root allowsMultipleExpanded defaultExpandedKeys={["a", "c"]}>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value}>
          <Accordion.Header>{item.title}</Accordion.Header>
          <Accordion.Content>{item.text}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const panels = canvas.getAllByRole("group", { hidden: true });

    await step("First and third items are initially expanded", async () => {
      await waitFor(() => {
        // First and third panels should be visible
        expect(panels[0]).toBeVisible();
        expect(panels[2]).toBeVisible();
        // Second panel should not be visible
        expect(panels[1]).not.toBeVisible();
      });
    });
  },
};
