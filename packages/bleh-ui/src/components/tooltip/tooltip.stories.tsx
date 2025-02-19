//import { createRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, expect } from "@storybook/test";
import { Box, Button, Stack, Text } from "@/components";
import { Tooltip, type TooltipProps } from "./index";
import { InfoIcon } from "@bleh-ui/icons";

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
  title: "components/Tooltip",
  component: Tooltip,
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

export const Base: Story = {
  render: () => {
    return (
      <Tooltip content="I am what's being displayed">I am the trigger</Tooltip>
    );
  },
};

export const TooltipOnInlineText: Story = {
  render: () => {
    return (
      <Text maxW="prose">
        Testing, if Tooltip can be used in an inline context.{" "}
        <Tooltip content="I am what's being displayed">
          I am the trigger.
        </Tooltip>{" "}
        Here is some more text, just to surround the trigger.
      </Text>
    );
  },
};

export const ButtonAsTrigger: Story = {
  render: () => {
    return (
      <Tooltip content="I am what's being displayed">
        <Button onPress={() => alert("onPress still works")}>
          I have my own action handler
        </Button>
      </Tooltip>
    );
  },
};

export const ComplexContent: Story = {
  render: () => {
    return (
      <Box display="flex" h="512px">
        <Box m="auto">
          <Tooltip
            placement="right bottom"
            isOpen
            content={
              <>
                <InfoIcon /> We could also add more complex things into the
                content, but I don't think it's wise.
              </>
            }
          >
            <Button>I am the trigger</Button>
          </Tooltip>
        </Box>
      </Box>
    );
  },
};

/**
 * Shows all possible placements
 */
export const Placement: Story = {
  args: {
    // isOpen: true,
  },
  render: (args) => {
    return (
      <Box px="256px" pt="64px">
        <Stack direction="column" alignItems="start">
          {Object.entries(placements).map(([type, values]) => (
            <Stack direction="row" alignItems="center" key={type} wrap="wrap">
              {values.map((placement) => (
                <Box key={placement} h="60px" w="200px">
                  <Tooltip
                    delay={0}
                    placement={placement}
                    content={<>{`Tooltip content for tooltip ${placement}`}</>}
                  >
                    <Button>{placement}</Button>
                  </Tooltip>
                </Box>
              ))}
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  },
};
