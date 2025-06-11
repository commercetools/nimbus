import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./index";
import type { CalendarProps } from "./calendar.types";
import type { DateValue } from "@internationalized/date";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  argTypes: {
    //
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {},
  render: (args: CalendarProps<DateValue>) => <Calendar {...args} />,
};
