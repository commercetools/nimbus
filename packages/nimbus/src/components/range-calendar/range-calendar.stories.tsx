import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  RangeCalendar,
  type RangeCalendarProps,
  type RangeValue,
  Stack,
  Text,
} from "@commercetools/nimbus";
import {
  today,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";

import { I18nProvider } from "react-aria";
import { useState } from "react";

const meta: Meta<typeof RangeCalendar> = {
  title: "Components/Date/RangeCalendar",
  component: RangeCalendar,
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
type Story = StoryObj<typeof RangeCalendar>;

export const Base: Story = {};

export const DefaultValue: Story = {
  args: {
    defaultValue: {
      start: today(getLocalTimeZone()).add({ days: 3 }),
      end: today(getLocalTimeZone()).add({ days: 5 }),
    },
  },
};

/**
 * Controlled usage, receiving the data via the value prop
 */
export const Controlled: Story = {
  render: (args: RangeCalendarProps<DateValue>) => {
    const [range, setRange] = useState<RangeValue<DateValue> | null>(null);

    const formatDate = (date: DateValue) => {
      return date.toDate(getLocalTimeZone()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    return (
      <Stack width="fit-content">
        <RangeCalendar {...args} value={range} onChange={setRange} />
        <Box mt="400" p="200" bg="neutral.2" borderRadius="200">
          <Text fontWeight="600" mb="200">
            Selected Range:
          </Text>
          {range ? (
            <Text>
              {formatDate(range.start)} to {formatDate(range.end)}
            </Text>
          ) : (
            <Text color="gray.600">No range selected</Text>
          )}
        </Box>
      </Stack>
    );
  },
};

/** Focus the calendar when it mounts. */
export const Autofocus: Story = {
  args: {
    autoFocus: true,
  },
};

/**
 * Demonstrates internationalization with Spanish locale.
 */
export const SpanishCalendar: Story = {
  args: {
    // firstDayOfWeek: "sun",
  },

  render: (args: RangeCalendarProps<DateValue>) => (
    <I18nProvider locale="es-MX">
      <RangeCalendar {...args} />
    </I18nProvider>
  ),
};

/**
 * Demonstrates internationalization with German locale.
 */
export const GermanCalendar: Story = {
  args: {
    firstDayOfWeek: "sun",
  },

  render: (args: RangeCalendarProps<DateValue>) => (
    <I18nProvider locale="de-DE">
      <RangeCalendar {...args} />
    </I18nProvider>
  ),
};

/**
 * Demonstrates custom width styling.
 */
export const CustomWidth: Story = {
  args: {
    width: "720px",
  },
  render: (args: RangeCalendarProps<DateValue>) => <RangeCalendar {...args} />,
};

/**
 * Display more than one month
 */
export const VisibleDuration: Story = {
  args: {
    defaultValue: {
      start: today(getLocalTimeZone()).add({ days: 3 }),
      end: today(getLocalTimeZone()).add({ days: 8 }),
    },
    visibleDuration: { months: 3 },
    pageBehavior: "single",
  },
  render: (args: RangeCalendarProps<DateValue>) => <RangeCalendar {...args} />,
};

/**
 * Next and previous buttons are used to navigate between months.
 * The `pageBehavior` prop controls how the calendar navigates between months.
 *
 * - `single` navigates by one month at a time.
 * - `visible` navigates by the number of visible months.
 */
export const PagingBehavior: Story = {
  args: {
    defaultValue: {
      start: today(getLocalTimeZone()).add({ days: 3 }),
      end: today(getLocalTimeZone()).add({ days: 8 }),
    },
    visibleDuration: { months: 3 },
  },
  render: (args: RangeCalendarProps<DateValue>) => (
    <Stack>
      <Text fontWeight="700">`single` - pages months by single months</Text>
      <Box>
        <RangeCalendar {...args} pageBehavior="single" />
      </Box>
      <Box as="hr" my="400" />
      <Text fontWeight="700">
        `visible` - pages months by amount of visible months (+/-
        visibleDuration.months)
      </Text>
      <Box>
        <RangeCalendar {...args} pageBehavior="visible" />
      </Box>
    </Stack>
  ),
};

/**
 * Demonstrates different form states: disabled and read-only.
 */
export const CalendarFormStates: Story = {
  render: () => {
    const defaultRange = {
      start: today(getLocalTimeZone()).add({ days: 3 }),
      end: today(getLocalTimeZone()).add({ days: 8 }),
    };

    return (
      <Stack align="start">
        <Text>Disabled</Text>
        <RangeCalendar isDisabled defaultValue={defaultRange} />
        <Text>Read Only</Text>
        <RangeCalendar isReadOnly defaultValue={defaultRange} />
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
    maxValue: today(getLocalTimeZone()).add({ days: 7 }),
  },
};

/**
 * Allow only dates from 1 week back to 4 weeks ahead.
 */
export const MinAndMaxValue: Story = {
  args: {
    minValue: today(getLocalTimeZone()).subtract({ weeks: 1 }),
    maxValue: today(getLocalTimeZone()).add({ weeks: 1 }),
  },
  render: (args: RangeCalendarProps<DateValue>) => (
    <Stack alignItems="start">
      <Text fontSize="sm" color="gray.600">
        Selection is limited to dates from 1 week ago to 1 week from today.
      </Text>
      <RangeCalendar {...args} />
    </Stack>
  ),
};

/**
 * Specify the day that starts the week.
 */
export const CustomWeekStartDay: Story = {
  args: {
    firstDayOfWeek: "fri",
  },
  render: (args: RangeCalendarProps<DateValue>) => (
    <Stack alignItems="start">
      <Text fontSize="sm" color="gray.600">
        All weeks should legally begin on a Friday.
      </Text>
      <RangeCalendar {...args} />
    </Stack>
  ),
};

/**
 * Mark certain dates as unavailable for selection.
 * This example marks the third full week of each month as unavailable.
 */
export const UnavailableDates: Story = {
  args: {
    isDateUnavailable: (date: DateValue) => {
      const dateObj = date.toDate(getLocalTimeZone());
      const dayOfMonth = dateObj.getDate();

      // Third full week is typically days 15-21 of the month
      return dayOfMonth >= 15 && dayOfMonth <= 21;
    },
  },
  render: (args: RangeCalendarProps<DateValue>) => (
    <Stack alignItems="start">
      <Text fontSize="sm" color="gray.600">
        Roughly the third full week of each month is unavailable for selection.
      </Text>
      <RangeCalendar {...args} />
    </Stack>
  ),
};

/**
 * Allow selection of ranges that contain unavailable dates.
 * This enables selecting ranges that span across blocked-out periods.
 */
export const NonContiguousRanges: Story = {
  args: {
    allowsNonContiguousRanges: true,
    isDateUnavailable: (date: DateValue) => {
      const dateObj = date.toDate(getLocalTimeZone());
      const dayOfWeek = dateObj.getDay();

      // Block Mondays (day 1)
      return dayOfWeek === 1;
    },
  },
  render: (args: RangeCalendarProps<DateValue>) => (
    <Stack alignItems="start">
      <Text fontSize="sm" color="gray.600">
        Select ranges that include unavailable dates (Mondays are blocked).
      </Text>
      <RangeCalendar {...args} />
    </Stack>
  ),
};
