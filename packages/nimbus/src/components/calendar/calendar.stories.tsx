import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Calendar, type CalendarProps, Stack, Text } from "@commercetools/nimbus";
import {
  today,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";

import { I18nProvider } from "react-aria";
import { useState } from "react";

const meta: Meta<typeof Calendar> = {
  title: "Components/Date/Calendar",
  component: Calendar,
  argTypes: {
    //
  },
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
    width: "720px",
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
 * Next and previous buttons are used to navigate between months.
 * The `pageBehavior` prop controls how the calendar navigates between months.
 *
 * - `single` navigates by one month at a time.
 * - `visible` navigates by the number of visible months.
 */
export const PagingBehaviour: Story = {
  args: {
    defaultValue: today(getLocalTimeZone()),
    visibleDuration: { months: 3 },
  },
  render: (args: CalendarProps<DateValue>) => (
    <Stack>
      <Text fontWeight="700">`single` - pages months by single months</Text>
      <Box>
        <Calendar {...args} pageBehavior="single" />
      </Box>
      <Box as="hr" my="400" />
      <Text fontWeight="700">
        `visible` - pages months by amount of visible months (+/-
        visibleDuration.months)
      </Text>
      <Box>
        <Calendar {...args} pageBehavior="visible" />
      </Box>
    </Stack>
  ),
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

/**
 * Allow only dates in the next 7 days by combining min and max values.
 */
export const MinAndMaxValue: Story = {
  args: {
    minValue: today(getLocalTimeZone()).add({ days: 1 }),
    maxValue: today(getLocalTimeZone()).add({ days: 7 }),
  },
  render: (args: CalendarProps<DateValue>) => (
    <Stack alignItems="start">
      <Text fontSize="sm" color="gray.600">
        Only dates from tomorrow to 7 days from today are available for
        selection.
      </Text>
      <Calendar {...args} />
    </Stack>
  ),
};

/**
 * Specify the day that starts the week.
 */
export const CustomWeekStartDay: Story = {
  args: {
    firstDayOfWeek: "tue",
  },
};

/**
 * Mark certain dates as unavailable for selection.
 * This example marks weekends as unavailable, making only weekdays selectable.
 */
export const UnavailableDates: Story = {
  args: {
    defaultValue: today(getLocalTimeZone()),
    isDateUnavailable: (date: DateValue) => {
      // Mark weekends as unavailable (only weekdays are selectable)
      const dayOfWeek = date.toDate(getLocalTimeZone()).getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
    },
  },
  render: (args: CalendarProps<DateValue>) => (
    <Stack alignItems="start">
      <Text fontSize="sm" color="gray.600">
        Only weekdays are available for selection. Weekends are disabled.
      </Text>
      <Calendar {...args} />
    </Stack>
  ),
};

/**
 * Shows the current day highlighted with a neutral.3 background.
 * The today highlighting is automatically applied without any configuration.
 */
export const TodayHighlighting: Story = {
  render: (args: CalendarProps<DateValue>) => (
    <Stack alignItems="start">
      <Text fontSize="sm" color="gray.600">
        Today's date is automatically highlighted with a neutral.3 background.
      </Text>
      <Calendar {...args} />
    </Stack>
  ),
};
