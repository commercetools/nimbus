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
  title: "Components/Calendar",
  component: Calendar,
  argTypes: {
    //
  },
  decorators: [
    (Story) => (
      <I18nProvider locale="de-US">
        <Box display="inline-block" borderRadius="200" p="400" boxShadow="4">
          <Story />
        </Box>
      </I18nProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: (args: CalendarProps<DateValue>) => <Calendar {...args} />,
};

/**
 * Display more than one month
 */
export const CustomWidth: Story = {
  args: {
    width: "480px",
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
