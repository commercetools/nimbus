import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Calendar,
  type CalendarProps,
  NimbusI18nProvider,
  Stack,
  Text,
} from "@commercetools/nimbus";
import {
  CalendarDate,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";
import { expect, userEvent, waitFor, within } from "storybook/test";

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

// Fixed anchor so date-dependent tests are deterministic. "today" stories
// (Base, TodayHighlighting) stay live. See FEC-1149.
const ANCHOR = new CalendarDate(2026, 5, 15);

/** Live default: lands on the current month so Storybook stays true. */
export const Base: Story = {};

/** Uncontrolled usage, with a starting Date supplied*/
export const DefaultValue: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    defaultValue: new CalendarDate(2025, 10, 31),
  },
};

/**
 * Controlled usage, receiving the data via the value prop
 */
export const Controlled: Story = {
  render: (args: CalendarProps<DateValue>) => {
    const [date, setDate] = useState<DateValue | null>(ANCHOR);
    return (
      <div>
        <Calendar {...args} value={date} onChange={setDate} />
        <Box mt="400" p="200">
          Selected date: {date ? date?.toString() : "null"}
        </Box>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Clicking a day updates the controlled value", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: /May 20, 2026/ })
      );
      await waitFor(() =>
        expect(canvasElement.textContent).toContain("Selected date: 2026-05-20")
      );
    });
  },
};

/**  focus the calendar when it mounts. */
export const Autofocus: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    autoFocus: true,
    defaultFocusedValue: ANCHOR,
  },
  play: async ({ canvasElement }) => {
    await waitFor(async () => {
      const focused = canvasElement.ownerDocument.activeElement;
      await expect(focused?.textContent?.trim()).toBe("15");
    });
  },
};

export const GermanCalendar: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    defaultFocusedValue: ANCHOR,
  },
  render: (args: CalendarProps<DateValue>) => (
    <NimbusI18nProvider locale="de-DE">
      <Calendar {...args} />
    </NimbusI18nProvider>
  ),
};

/**
 * Display more than one month
 */
export const CustomWidth: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    width: "720px",
    defaultFocusedValue: ANCHOR,
  },
  render: (args: CalendarProps<DateValue>) => <Calendar {...args} />,
};

/**
 * Display more than one month
 */
export const VisibleDuration: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    defaultValue: ANCHOR,
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
    defaultValue: ANCHOR,
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
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => {
    return (
      <Stack align="start">
        <Text>Disabled</Text>
        <Calendar isDisabled defaultFocusedValue={ANCHOR} />
        <Text>Read Only</Text>
        <Calendar isReadOnly defaultFocusedValue={ANCHOR} />
        <Text>Invalid</Text>
        <Calendar isInvalid defaultFocusedValue={ANCHOR} />
      </Stack>
    );
  },
};

/**
 * The minimum allowed date that a user may select.
 */
export const MinValue: Story = {
  args: {
    defaultFocusedValue: ANCHOR,
    minValue: ANCHOR.add({ days: -1 }),
  },
};

/**
 * The maximum allowed date that a user may select.
 */
export const MaxValue: Story = {
  args: {
    defaultFocusedValue: ANCHOR,
    maxValue: ANCHOR.add({ days: 1 }),
  },
};

/**
 * Allow only dates in a fixed window by combining min and max values.
 */
export const MinAndMaxValue: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    defaultFocusedValue: ANCHOR,
    minValue: ANCHOR.add({ days: 1 }),
    maxValue: ANCHOR.add({ days: 7 }),
  },
  render: (args: CalendarProps<DateValue>) => (
    <Stack alignItems="start">
      <Text fontSize="sm" color="gray.600">
        Only dates in a 7-day window are available for selection.
      </Text>
      <Calendar {...args} />
    </Stack>
  ),
};

/**
 * Specify the day that starts the week.
 */
export const CustomWeekStartDay: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    firstDayOfWeek: "tue",
    defaultFocusedValue: ANCHOR,
  },
};

/**
 * Mark certain dates as unavailable for selection.
 * This example marks weekends as unavailable, making only weekdays selectable.
 */
export const UnavailableDates: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    defaultValue: ANCHOR,
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
 *
 * Stays live (renders the real current month) so Storybook is true, and is not
 * snapshotted (the today cell would drift the baseline daily). The highlight is
 * verified behaviorally by the play function instead of by pixels.
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
  play: async ({ canvasElement }) => {
    const todayCells = canvasElement.querySelectorAll('[data-today="true"]');
    await expect(todayCells).toHaveLength(1);

    const nonTodayCell = canvasElement.querySelector('[data-today="false"]');
    if (!nonTodayCell) throw new Error("expected a non-today cell to compare");

    await expect(getComputedStyle(todayCells[0]).backgroundColor).not.toBe(
      getComputedStyle(nonTodayCell).backgroundColor
    );
  },
};
