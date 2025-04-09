import type { Meta, StoryObj } from "@storybook/react";
import { within, expect, fn } from "@storybook/test";
import { Tooltip, TooltipTrigger, Button } from "@/components";

const meta: Meta<typeof TooltipTrigger> = {
  title: "components/tooltip/TooltipTrigger",
  component: TooltipTrigger,
  render: (args) => (
    <TooltipTrigger {...args}>
      <Button>hover/focus me</Button>
      <Tooltip>Demo Tooltip</Tooltip>
    </TooltipTrigger>
  ),
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
//TODO: each component is in its own file so that the props table gets built for it,
// is there a better way for declaring compound components such as this one?
type Story = StoryObj<typeof TooltipTrigger>;

// TODO: how much do we want to test react-aria-components?
export const Base: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    // need to get the parent node in order to have the tooltip portal in scope
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    await step("it renders a tooltip with the proper text", async () => {
      const button = canvas.getByRole("button", { name: "hover/focus me" });
      button.click();
      button.focus();
      await canvas.findByRole("tooltip", {
        name: "Demo Tooltip",
      });
    });
  },
};

export const Delay: Story = {
  args: {
    delay: 0,
  },
  play: async ({ canvasElement, step }) => {
    // need to get the parent node in order to have the tooltip portal in scope
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    await step("it renders a tooltip immediately when delay is 0", async () => {
      const button = canvas.getByRole("button", { name: "hover/focus me" });
      button.click();
      button.focus();
      await canvas.findByRole("tooltip", {
        name: "Demo Tooltip",
      });
    });
  },
};

export const isOpen: Story = {
  args: {
    isOpen: true,
  },
  play: async ({ canvasElement, step }) => {
    // need to get the parent node in order to have the tooltip portal in scope
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    await step("it renders tooltip on mount when isOpen is true", async () => {
      await canvas.findByRole("tooltip", {
        name: "Demo Tooltip",
      });
    });
    await step(
      "it does not hide tooltip on blur when isOpen is true",
      async () => {
        await canvas.findByRole("tooltip", {
          name: "Demo Tooltip",
        });
        const button = canvas.getByRole("button", { name: "hover/focus me" });
        button.click();
        button.focus();
        button.blur();
        await canvas.findByRole("tooltip", {
          name: "Demo Tooltip",
        });
      }
    );
  },
};

export const defaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
  play: async ({ canvasElement, step }) => {
    // need to get the parent node in order to have the tooltip portal in scope
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    await step(
      "it renders tooltip on mount when defaultOpen is true",
      async () => {
        await canvas.findByRole("tooltip", {
          name: "Demo Tooltip",
        });
      }
    );
    await step(
      "it does not hide tooltip on blur when isOpen is true",
      async () => {
        await canvas.findByRole("tooltip", {
          name: "Demo Tooltip",
        });
        const button = canvas.getByRole("button", { name: "hover/focus me" });
        button.click();
        button.focus();
        button.blur();
        await new Promise((resolve) => setTimeout(resolve, 1));
        await expect(
          canvas.queryByRole("tooltip", {
            name: "Demo Tooltip",
          })
        ).not.toBeInTheDocument();
      }
    );
  },
};

export const onOpenChange: Story = {
  args: {
    onOpenChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    // need to get the parent node in order to have the tooltip portal in scope
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step(
      "it should call onOpenChange when entering and exiting",
      async () => {
        const button = canvas.getByRole("button", { name: "hover/focus me" });
        button.click();
        button.focus();
        await expect(args.onOpenChange).toHaveBeenCalledTimes(1);
        button.blur();
        await expect(args.onOpenChange).toHaveBeenCalledTimes(2);
      }
    );
  },
};
