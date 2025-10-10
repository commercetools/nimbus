import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateRangePickerField } from "./date-range-picker-field";
import { now, getLocalTimeZone } from "@internationalized/date";
import type { DateRange } from "react-aria";

const meta: Meta<typeof DateRangePickerField> = {
  title: "Components/Forms/DateRangePickerField",
  component: DateRangePickerField,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    label: "Date Range",
    description: "Select a start and end date",
    size: "md",
    direction: "column",
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePickerField>;

export const Base: Story = {
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
};

export const WithValue: Story = {
  render: (args) => {
    const today = now(getLocalTimeZone());
    const [value, setValue] = useState<DateRange | null>({
      start: today,
      end: today.add({ days: 7 }),
    });
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
};

export const Required: Story = {
  args: { isRequired: true, label: "Required Date Range" },
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
};

export const WithErrors: Story = {
  args: {
    touched: true,
    errors: { missing: true, format: true },
    isRequired: true,
  },
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
};

export const WithCustomErrors: Story = {
  args: {
    touched: true,
    errors: { customError: true },
    renderError: (key: string) => {
      if (key === "customError") {
        return "Please select a valid date range for your booking.";
      }
      return null;
    },
  },
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
};

export const WithInfo: Story = {
  args: {
    info: "Date ranges are inclusive of both start and end dates.",
  },
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => {
    const today = now(getLocalTimeZone());
    const [value, setValue] = useState<DateRange | null>({
      start: today,
      end: today.add({ days: 7 }),
    });
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
};

export const WithTime: Story = {
  args: {
    label: "Date and Time Range",
    granularity: "minute",
  },
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
};
