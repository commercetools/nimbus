import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./index";
import type { CalendarProps } from "./calendar.types";
import {
  today,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";

import { I18nProvider } from "react-aria";
import { Box, Stack, Text } from "@/components";
import { useState } from "react";

const meta: Meta<typeof Calendar> = {
  title: "Components/Date/Calendar",
  component: Calendar,
  argTypes: {
    //
  },
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Base: Story = {};

/** Uncontrolled usage, with a starting Date supplied*/
export const DefaultValue: Story = {
  args: {
    defaultValue: today(getLocalTimeZone()),
  },
};

/**
 * Controlled usage, receiving the data via the value prop
 */
export const Controlled: Story = {
  render: (args: CalendarProps<DateValue>) => {
    const [date, setDate] = useState<DateValue | null>(null);
    return (
      <div>
        <Calendar {...args} value={date} onChange={setDate} />
        <Box mt="400" p="200">
          Selected date: {date ? date?.toString() : "null"}
        </Box>
      </div>
    );
  },
};

/**  focus the calendar when it mounts. */
export const Autofocus: Story = {
  args: {
    autoFocus: true,
  },
};

export const GermanCalendar: Story = {
  render: (args: CalendarProps<DateValue>) => (
    <I18nProvider locale="de-DE">
      <Calendar {...args} />
    </I18nProvider>
  ),
};

/**
 * Display more than one month
 */
export const CustomWidth: Story = {
  args: {
    width: "512px",
  },
  render: (args: CalendarProps<DateValue>) => <Calendar {...args} />,
};

/**
 * Display more than one month
 */
export const VisibleDuration: Story = {
  args: {
    defaultValue: today(getLocalTimeZone()),
    visibleDuration: { months: 3 },
    pageBehavior: "single",
  },
  render: (args: CalendarProps<DateValue>) => <Calendar {...args} />,
};

/**
 * Display more than one month
 */
export const CalendarFormStates: Story = {
  render: () => {
    return (
      <Stack align="start">
        <Text>Disabled</Text>
        <Calendar isDisabled />
        <Text>Read Only</Text>
        <Calendar isReadOnly />
        <Text>Invalid</Text>
        <Calendar isInvalid />
      </Stack>
    );
  },
};

/**
 * The minimum allowed date that a user may select.
 */
export const MinValue: Story = {
  args: {
    minValue: today(getLocalTimeZone()).add({ days: -1 }),
  },
};

/**
 * The maximum allowed date that a user may select.
 */
export const MaxValue: Story = {
  args: {
    maxValue: today(getLocalTimeZone()).add({ days: 1 }),
  },
};
