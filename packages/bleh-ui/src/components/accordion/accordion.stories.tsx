import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./accordion";
import type { AccordionRootProps } from "./accordion.types";
import { Button, Checkbox, Flex, Avatar } from "@/components";

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
  render: (args) => {
    return (
      <>
        {items.map((item, index) => (
          <Accordion title={item.title} key={index} {...args}>
            {item.text}
          </Accordion>
        ))}
      </>
    );
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
          <Accordion title={<>{size} size</>} key={index} {...args} size={size}>
            <>{size} size text</>
          </Accordion>
        ))}
      </>
    );
  },
};
/**
 * With buttons on the trigger
 */

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
export const WithButtonsOnTrigger: Story = {
  render: (args) => {
    return (
      <>
        {items.map((item, index) => (
          <Accordion
            title={item.title}
            key={index}
            {...args}
            size={"md"}
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
            <Flex
              justifyContent="space-between"
              alignItems={"center"}
              borderBottom="solid-25"
              borderColor="neutral.4"
            >
              <div style={{ marginRight: "100" }}>{item.text}</div>
              <AccordionContent />
            </Flex>
          </Accordion>
        ))}
      </>
    );
  },
};
