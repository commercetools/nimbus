import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./date-picker";
import { I18nProvider } from "react-aria";
import { Box, Button, Stack } from "@/components";
import { useState } from "react";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof DatePicker> = {
  title: "Components/Date/DatePicker",
  component: DatePicker,
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof DatePicker>;

/**
 * BAse story
 * Demonstrates the most basic implementation
 */
export const Base: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
};

/**
 * Sizes story
 * Demonstrates available sizes
 */
export const Sizes: Story = {
  args: {
    ["aria-label"]: "Select a date",
    granularity: "second",
  },
  render: (args) => {
    return (
      <Stack>
        <Box>
          <DatePicker size="sm" {...args} />
        </Box>
        <Box>
          <DatePicker size="md" {...args} />
        </Box>
      </Stack>
    );
  },
};

/**
 * Different Locale
 * Works with many locales
 */
export const GermanLocale: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    return (
      <I18nProvider locale="de-DE">
        <DatePicker {...args} />
      </I18nProvider>
    );
  },
};

/**
 * The Popover is open by default (uncontrolled)
 */
export const DefaultOpenUncontrolled: Story = {
  args: {
    ["aria-label"]: "Select a date",
    defaultOpen: true,
  },
};

/**
 * Change the open state with a controlled prop
 */
export const IsOpenControlled: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },

  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Stack alignItems="start">
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close" : "Open"}
        </Button>
        <DatePicker {...args} isOpen={isOpen} onOpenChange={setIsOpen} />
      </Stack>
    );
  },
};

export const GranularityDay: Story = {
  args: {
    ["aria-label"]: "Select a date",
    granularity: "day",
    isOpen: true,
  },
};

export const GranularityHour: Story = {
  args: {
    ["aria-label"]: "Select a date",
    granularity: "hour",
    isOpen: true,
  },
};

export const GranularityMinute: Story = {
  args: {
    ["aria-label"]: "Select a date",
    granularity: "minute",
    isOpen: true,
  },
};
export const GranularitySecond: Story = {
  args: {
    ["aria-label"]: "Select a date",
    granularity: "second",
    isOpen: true,
  },
};
