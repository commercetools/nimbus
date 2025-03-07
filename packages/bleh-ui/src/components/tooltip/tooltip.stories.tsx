import { createRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect } from "@storybook/test";
import {
  Tooltip,
  TooltipTrigger,
  Button,
  Stack,
  type TooltipProps,
} from "@/components";

const placements = {
  top: ["top", "top left", "top right", "top start", "top end"],
  bottom: [
    "bottom",
    "bottom left",
    "bottom right",
    "bottom start",
    "bottom end",
  ],
  left: ["left", "left top", "left bottom"],
  right: ["right", "right top", "right bottom"],
  start: ["start", "start top", "start bottom"],
  end: ["end", "end top", "end bottom"],
};

const allPlacements = Object.values(placements).flatMap((x) => x);

const meta: Meta<typeof Tooltip> = {
  title: "components/tooltip/Tooltip",
  component: Tooltip,
  argTypes: {
    placement: {
      options: allPlacements,
      control: { type: "select" },
    },
  },
  render: (args) => (
    <TooltipTrigger delay={0} closeDelay={0}>
      <Button>hover/focus me</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Tooltip>;

/**
 * Demonstrates the most basic implementation
 */
const tooltipRef = createRef<HTMLDivElement>();
export const Base: Story = {
  args: {
    children: "Demo Tooltip",
    ref: tooltipRef,
  },
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
    await step("it forwards a ref to the tooltip", async () => {
      const button = canvas.getByRole("button", { name: "hover/focus me" });

      button.focus();
      const tooltip = await canvas.findByRole("tooltip", {
        name: "Demo Tooltip",
      });
      await expect(tooltipRef.current).toBe(tooltip);
    });
  },
};

/**
 * Shows all possible placements
 */
export const Placement: Story = {
  args: {},
  render: () => {
    return (
      <Stack
        direction="column"
        alignItems="start"
        marginY="1000"
        marginX="2000"
      >
        {Object.entries(placements).map(([type, values]) => (
          <Stack direction="row" alignItems="center" key={type} wrap="wrap">
            {values.map((placement) => (
              <TooltipTrigger key={placement} delay={0}>
                <Button w="200px" h="60px">
                  {placement}
                </Button>
                <Tooltip placement={placement as TooltipProps["placement"]}>
                  {placement}
                </Tooltip>
              </TooltipTrigger>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    for (const placement of allPlacements) {
      await step(`Implements ${placement} placement on focus`, async () => {
        const button = await canvas.findByRole("button", {
          name: placement,
        });

        button.focus();

        const tooltip = await canvas.findByRole("tooltip", {
          name: placement,
        });

        await expect(tooltip).toHaveTextContent(placement);
      });
    }
  },
};
