import type { Meta, StoryObj } from "@storybook/react";
import { TimeInput } from "./time-input";
import { Button, Stack, Text } from "@/components";
import { TextInput } from "../text-input";
import { parseZonedDateTime, Time } from "@internationalized/date";
import { useState } from "react";
import type { TimeValue } from "react-aria";
import { I18nProvider } from "react-aria";

const inventionOfTheInternet = parseZonedDateTime(
  "1993-04-30T14:30[Europe/Zurich]"
);

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
  args: {
    ["aria-label"]: "Enter a time",
  },
};

/**
 * Showcase Uncontrolled
 */
export const Uncontrolled: Story = {
  args: {
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With defaultValue (9:30 AM)</Text>
        <TimeInput
          {...args}
          defaultValue={new Time(9, 30)}
          aria-label="With default value"
        />
        <Text>With defaultValue (3:45 PM)</Text>
        <TimeInput
          {...args}
          defaultValue={new Time(15, 45)}
          aria-label="With different default value"
        />
        <Text>No defaultValue (empty)</Text>
        <TimeInput {...args} aria-label="Without default value" />
      </Stack>
    );
  },
};

/**
 * Showcase Controlled
 * Demonstrates how to use the TimeInput as a controlled component
 * with the value property and state management
 */
export const Controlled: Story = {
  args: {
    hideTimeZone: true,
  },
  render: (args) => {
    const [time, setTime] = useState<TimeValue | null>(new Time(12, 0));
    const handleTimeChange = (value: TimeValue | null) => {
      if (value) {
        setTime(value as Time);
      }
    };

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Controlled TimeInput (current value: {time?.toString()})</Text>
        <TimeInput
          {...args}
          value={time}
          onChange={handleTimeChange}
          aria-label="Controlled time input"
        />
        <Button onPress={() => setTime(null)}>Reset</Button>
      </Stack>
    );
  },
};

/**
 * Showcase IsInvalid
 */
export const IsInvalid: Story = {
  args: {
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>IsInvalid: true</Text>
        <TimeInput {...args} isInvalid={true} aria-label="IsInvalid true" />
        <Text>IsInvalid: false (default)</Text>
        <TimeInput {...args} isInvalid={false} aria-label="IsInvalid false" />
      </Stack>
    );
  },
};

/**
 * Showcase IsDisabled
 */
export const IsDisabled: Story = {
  args: {
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>IsDisabled: true</Text>
        <TimeInput {...args} isDisabled={true} aria-label="IsDisabled true" />
        <Text>IsDisabled: false (default)</Text>
        <TimeInput {...args} isDisabled={false} aria-label="IsDisabled false" />
      </Stack>
    );
  },
};

/**
 * Showcase IsReadOnly
 */
export const IsReadOnly: Story = {
  args: {
    defaultValue: inventionOfTheInternet, // So there's a value to see it's read-only
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>IsReadOnly: true</Text>
        <TimeInput {...args} isReadOnly={true} aria-label="IsReadOnly true" />
        <Text>IsReadOnly: false (default)</Text>
        <TimeInput {...args} isReadOnly={false} aria-label="IsReadOnly false" />
      </Stack>
    );
  },
};

/**
 * Showcase IsRequired
 */
export const IsRequired: Story = {
  args: {
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>IsRequired: true</Text>
        <TimeInput {...args} isRequired={true} aria-label="IsRequired true" />
        <Text>IsRequired: false (default)</Text>
        <TimeInput {...args} isRequired={false} aria-label="IsRequired false" />
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
    defaultValue: inventionOfTheInternet,
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
    defaultValue: inventionOfTheInternet,
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
    defaultValue: inventionOfTheInternet,
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
    defaultValue: inventionOfTheInternet,
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

/**
 * Showcase Placeholder Value
 * Unlike one could expect, the placeholderValue is not being displayed right away.
 * It rather controls the default values of each segment when the user first interacts with them
 */
export const PlaceholderValue: Story = {
  args: {
    placeholderValue: new Time(10, 0),
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With placeholderValue (starts with 10:00 AM)</Text>
        <TimeInput {...args} aria-label="With placeholder value" />
        <Text>Without placeholderValue (default placeholder)</Text>
        <TimeInput
          {...args}
          aria-label="Without placeholder value"
          hideTimeZone={true}
        />
      </Stack>
    );
  },
};

/**
 * Showcase Min and Max Value
 */
export const MinMaxValue: Story = {
  args: {
    hideTimeZone: true,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Min value set to 09:00</Text>
        <TimeInput
          {...args}
          minValue={new Time(9, 0)}
          aria-label="Min value 09:00"
        />
        <Text>Max value set to 17:00</Text>
        <TimeInput
          {...args}
          maxValue={new Time(17, 0)}
          aria-label="Max value 17:00"
        />
        <Text>Min value 10:00 and Max value 14:00</Text>
        <TimeInput
          {...args}
          minValue={new Time(10, 0)}
          maxValue={new Time(14, 0)}
          aria-label="Min value 10:00 and Max value 14:00"
        />
      </Stack>
    );
  },
};

/**
 * Showcase Different Locale
 */
export const DifferentLocales: Story = {
  args: {
    defaultValue: inventionOfTheInternet,
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="800">
        <Stack direction="column" gap="400">
          <Text fontWeight="600">German (de-DE)</Text>
          <I18nProvider locale="de-DE">
            <TimeInput {...args} aria-label="German locale" />
          </I18nProvider>
        </Stack>

        <Stack direction="column" gap="400">
          <Text fontWeight="600">French (fr-FR)</Text>
          <I18nProvider locale="fr-FR">
            <TimeInput {...args} aria-label="French locale" />
          </I18nProvider>
        </Stack>

        <Stack direction="column" gap="400">
          <Text fontWeight="600">Japanese (ja-JP)</Text>
          <I18nProvider locale="ja-JP">
            <TimeInput {...args} aria-label="Japanese locale" />
          </I18nProvider>
        </Stack>

        <Stack direction="column" gap="400">
          <Text fontWeight="600">Arabic (ar-SA)</Text>
          <I18nProvider locale="ar-SA">
            <TimeInput {...args} aria-label="Arabic locale" />
          </I18nProvider>
        </Stack>
      </Stack>
    );
  },
};
