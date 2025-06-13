import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./index";
import type { CalendarProps } from "./calendar.types";
import {
  today,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";

import { I18nProvider } from "react-aria";
import { Box } from "@/components";

const meta: Meta<typeof Calendar> = {
  title: "Components/Date/Calendar",
  component: Calendar,
  argTypes: {
    //
  },
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Box w="8000" display="inline-block" borderRadius="200" boxShadow="4">
          <Story />
        </Box>
      </I18nProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Base: Story = {};

/** Uncontrolled, with starting Date */
export const DefaultValue: Story = {
  args: {
    defaultValue: today(getLocalTimeZone()),
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
    width: "9000",
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
  },
  render: (args: CalendarProps<DateValue>) => <Calendar {...args} />,
};

/**
 * Display more than one month
 */
export const Uncontrolled: Story = {
  args: {
    defaultValue: today(getLocalTimeZone()),
    visibleDuration: { months: 3 },
  },
  render: (args: CalendarProps<DateValue>) => <Calendar {...args} />,
};
