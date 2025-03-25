import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./accordion";
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
  {
    value: "c",
    title: "Third Item",
    text: "Very long Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

/**
 * Basic Case
 */
export const Basic: Story = {
  render: (args) => {
    return (
      <>
        {items.map((item, index) => (
          <Accordion title={item.title} key={index} {...args} size={"md"}>
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
                <button onClick={() => console.log(item.title)}>
                  Click me
                </button>
                <button onClick={() => console.log(item.title)}>
                  Click me
                </button>
                {/* <button onClick={() => console.log(item.title)}>
                  Click me
                </button>
                <button onClick={() => console.log(item.title)}>
                  Click me
                </button> */}
              </div>
            }
          >
            {item.text}
          </Accordion>
        ))}
      </>
    );
  },
};
