import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./accordion";
import { Stack } from "./../stack";
import type { AccordionRootProps } from "./accordion.types";

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
  { value: "c", title: "Third Item", text: "Some value 3..." },
];

/**
 * Basic Case
 */
export const Basic: Story = {
  render: (args) => {
    return (
      <Stack>
        {items.map((item, index) => (
          <Accordion title={item.title} key={index} {...args} size={"md"}>
            {item.text}
          </Accordion>
        ))}
      </Stack>
    );
  },
};
/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack>
        {accordionSizes.map((size, index) => (
          <Accordion
            title={<>{size} size text</>}
            key={index}
            {...args}
            size={size}
          >
            <>{size} size text</>
          </Accordion>
        ))}
      </Stack>
    );
  },
};
