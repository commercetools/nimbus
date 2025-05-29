import type { Meta, StoryObj } from "@storybook/react";
import { TimeInput } from "./time-input";
import { Stack, Text } from "@/components";
import { TextInput } from "../text-input";
import { parseZonedDateTime } from "@internationalized/date";

const michaelsBirthday = parseZonedDateTime("1985-12-17T04:45[Europe/Berlin]");

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof TimeInput> = {
  title: "components/TimeInput",
  component: TimeInput,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof TimeInput>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {},
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="column">
        {["sm", "md"].map((size) => (
          <>
            <TimeInput key={size} {...args} size={size as "sm" | "md"} />
            <TextInput size={size as "sm" | "md"} />
          </>
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo TimeInput",
  },
};

/**
 * Showcase Hour Cycle
 */
export const HourCycle: Story = {
  args: {
    defaultValue: michaelsBirthday,
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400">
        <TimeInput {...args} hourCycle={12} aria-label="Hour Cycle 12" />
        <TimeInput {...args} hourCycle={24} aria-label="Hour Cycle 24" />
      </Stack>
    );
  },
};

/**
 * Showcase Hide Time Zone
 */
export const HideTimeZone: Story = {
  args: {
    defaultValue: michaelsBirthday,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400">
        <Text>Show the timezone (if present in value) (default)</Text>
        <TimeInput {...args} aria-label="Timezone shown" />
        <Text>Hide the timezone</Text>
        <TimeInput {...args} hideTimeZone aria-label="Timezone hidden" />
      </Stack>
    );
  },
};

/**
 * Showcase Granularity
 */
export const Granularity: Story = {
  args: {
    defaultValue: michaelsBirthday,
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Granularity: hour</Text>
        <TimeInput {...args} granularity="hour" aria-label="Granularity hour" />
        <Text>Granularity: minute (default)</Text>
        <TimeInput
          {...args}
          granularity="minute"
          aria-label="Granularity minute"
        />
        <Text>Granularity: second</Text>
        <TimeInput
          {...args}
          granularity="second"
          aria-label="Granularity second"
        />
      </Stack>
    );
  },
};

/**
 * Showcase Should Force Leading Zeros
 */
export const ShouldForceLeadingZeros: Story = {
  args: {
    defaultValue: michaelsBirthday,
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Should force leading zeros: true</Text>
        <TimeInput
          {...args}
          shouldForceLeadingZeros={true}
          aria-label="Force leading zeros true"
        />
        <Text>Should force leading zeros: false (default)</Text>
        <TimeInput
          {...args}
          shouldForceLeadingZeros={false}
          aria-label="Force leading zeros false"
        />
      </Stack>
    );
  },
};
