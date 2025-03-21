import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./accordion";
import { Stack } from "./../stack";

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

const items = [
  { value: "a", title: "First Item", text: "Some value 1..." },
  { value: "b", title: "Second Item", text: "Some value 2..." },
  { value: "c", title: "Third Item", text: "Some value 3..." },
];

/**
 * Showcase Variants
 */
export const Basic: Story = {
  render: (args) => {
    return (
      <Stack>
        {items.map((item, index) => (
          <Accordion title={item.title} key={index} {...args}>
            {item.text}
          </Accordion>
        ))}
      </Stack>
    );
  },
};
