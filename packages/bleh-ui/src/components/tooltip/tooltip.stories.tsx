import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { TooltipProps as RATooltipProps } from "react-aria-components";
import {
  Tooltip,
  TooltipTrigger,
  // FocusableTooltipTrigger,
  type TooltipProps,
  Button,
  Stack,
} from "@/components";

const ComposedTooltip = ({
  buttonChild = "hover/focus me",
  ...props
}: TooltipProps & { buttonChild?: ReactNode }) => (
  <TooltipTrigger
    isOpen={props.isOpen}
    defaultOpen={props.defaultOpen}
    delay={0}
  >
    <Button>{buttonChild}</Button>
    <Tooltip {...props}>{props.children}</Tooltip>
  </TooltipTrigger>
);

// const ComposedTooltipCustomTrigger = (props: TooltipProps) => (
//   <TooltipTrigger>
//     <FocusableTooltipTrigger>
//       <button>hover/focus custom button</button>
//     </FocusableTooltipTrigger>

//     <Tooltip {...props}>I'm the tooltip</Tooltip>
//   </TooltipTrigger>
// );
/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Tooltip> = {
  title: "components/Tooltip",
  component: Tooltip,
  render: (args) => (
    <TooltipTrigger>
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
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    children: "Demo Tooltip",
  },
};

const placements = {
  top: ["top", "top left", "top right", "top start", "top end"],
  right: ["right", "right top", "right bottom"],
  bottom: [
    "bottom",
    "bottom left",
    "bottom right",
    "bottom start",
    "bottom end",
  ],
  end: ["end", "end top", "end bottom"],
  left: ["left", "left top", "left bottom"],
  start: ["start", "start top", "start bottom"],
};

/**
 * Showcase placements
 */
export const Placement: Story = {
  args: {},
  render: (args) => {
    return (
      <Stack
        direction="column"
        gap="400"
        alignItems="start"
        marginY="1000"
        marginX="2000"
      >
        {Object.entries(placements).map(([type, values]) => (
          <Stack
            direction="row"
            gap="3200"
            alignItems="center"
            marginY="400"
            key={type}
          >
            {values.map((placement: RATooltipProps["placement"]) => (
              <ComposedTooltip
                key={placement}
                {...args}
                placement={placement}
                buttonChild={placement}
              >
                {placement}
              </ComposedTooltip>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};
