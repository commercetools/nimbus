import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./accordion";
import type { AccordionRootProps } from "./accordion.types";
import { Button, Checkbox, Flex, Avatar } from "@/components";
import { userEvent, expect, waitFor } from "@storybook/test";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Accordion> = {
  title: "components/Accordion",
  component: Accordion,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Accordion>;

const accordionSizes: AccordionRootProps["size"][] = ["sm", "md"];

const items = [
  { value: "a", title: "First Item", text: "Some value 1..." },
  { value: "b", title: "Second Item", text: "Some value 2..." },
  {
    value: "c",
    title: "Third Item",
    text: "Some value 3",
  },
];

/**
 * Basic Case
 */
export const Base: Story = {
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Header>Test Accordion</Accordion.Header>
      <Accordion.Content>Test Accordion Content</Accordion.Content>
    </Accordion>
  ),
  play: async ({ canvasElement, step }) => {
    // const canvas = within(canvasElement);
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

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    return (
      <>
        {accordionSizes.map((size, index) => (
          <Accordion key={index} {...args} size={size}>
            <Accordion.Header>{<>{size} size</>}</Accordion.Header>
            <Accordion.Content>
              <>{size} size text</>
            </Accordion.Content>
          </Accordion>
        ))}
      </>
    );
  },
};

// /**
//  * With buttons on the trigger
//  */
const AccordionContent = () => {
  const avatarImg = "https://thispersondoesnotexist.com/ ";

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
      <Avatar src={avatarImg} firstName="Michael" lastName="Douglas" />
      <Checkbox>Yes?</Checkbox>
      <Checkbox>No?</Checkbox>
    </div>
  );
};
export const WithAdditionalContentsOnTrigger: Story = {
  render: (args) => {
    return (
      <>
        {items.map((item, index) => (
          <Accordion key={index} {...args} size={"md"}>
            <Accordion.Header
              additionalTriggerComponent={
                <div style={{ padding: "10px" }}>
                  <Button marginRight="100" tone="primary">
                    Click me
                  </Button>
                  <Button marginRight="100" tone="neutral">
                    Click me
                  </Button>
                  <Button marginRight="100" tone="critical">
                    Click me
                  </Button>
                </div>
              }
            >
              {item.title}
            </Accordion.Header>
            <Accordion.Content>
              <Flex
                justifyContent="space-between"
                alignItems={"center"}
                borderColor="neutral.4"
              >
                <div style={{ marginRight: "100" }}>{item.text}</div>
                <AccordionContent />
              </Flex>
            </Accordion.Content>
          </Accordion>
        ))}
      </>
    );
  },
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
