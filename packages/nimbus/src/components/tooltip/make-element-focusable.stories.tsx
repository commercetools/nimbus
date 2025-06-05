import { createRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect } from "@storybook/test";
import { Tooltip, MakeElementFocusable } from "@/components";

const meta: Meta<typeof MakeElementFocusable> = {
  title: "components/Tooltip/MakeElementFocusable",
  component: MakeElementFocusable,
  render: (args) => (
    <Tooltip.Root delay={0} closeDelay={0}>
      <MakeElementFocusable {...args} />
      <Tooltip.Content>Demo Tooltip</Tooltip.Content>
    </Tooltip.Root>
  ),
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
//TODO: figure out props table for this component
type Story = StoryObj<typeof MakeElementFocusable>;

// TODO: how much do we want to test react-aria-components?
const elementRef = createRef<HTMLElement>();
export const Base: Story = {
  args: {
    children: <button>custom button</button>,
    ref: elementRef,
  },
  play: async ({ canvasElement, step }) => {
    // need to get the parent node in order to have the tooltip portal in scope
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step(
      "it renders a tooltip with the proper text when child is custom component",
      async () => {
        const button = canvas.getByRole("button", { name: "custom button" });
        button.click();
        button.focus();
        await canvas.findByRole("tooltip", {
          name: "Demo Tooltip",
        });
      }
    );
    await step("it forwards a ref to the custom element", async () => {
      const button = canvas.getByRole("button", { name: "custom button" });

      await expect(elementRef.current).toBe(button);
    });
  },
};
