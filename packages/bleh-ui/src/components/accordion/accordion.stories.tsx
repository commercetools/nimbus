import type { Meta, StoryObj } from "@storybook/react";
import Accordion from "./accordion";
import type { AccordionProps } from "./accordion.types";
import { Button } from "@/components";
import { expect, userEvent, waitFor } from "@storybook/test";

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

const sizes: AccordionProps["size"][] = ["sm", "md"];

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
    const accordion = canvasElement.querySelector(
      '[data-slot="root"]'
    ) as HTMLElement;

    const trigger = accordion.querySelector(
      '[data-slot="trigger"]'
    ) as HTMLButtonElement;

    const panel = accordion.querySelector(
      '[data-slot="panel"]'
    ) as HTMLDivElement;

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
    const accordion = canvasElement.querySelector(
      '[data-slot="root"]'
    ) as HTMLElement;
    const additionalButtons = accordion.querySelectorAll("button");
    const trigger = accordion.querySelector(
      '[data-slot="trigger"]'
    ) as HTMLButtonElement;

    await step("Additional buttons don't trigger accordion", async () => {
      const panel = accordion.querySelector(
        '[data-slot="panel"]'
      ) as HTMLDivElement;
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
      const panel = accordion.querySelector(
        '[data-slot="panel"]'
      ) as HTMLDivElement;
      await userEvent.click(trigger);
      await expect(panel).toBeVisible();
    });
  },
};

export const Sizes: Story = {
  render: () => (
    <>
      {sizes.map((size, index) => (
        <Accordion.Root key={index} size={size}>
          <Accordion.Item value={size}>
            <Accordion.Header>{size} size</Accordion.Header>
            <Accordion.Content>{size} size</Accordion.Content>
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
