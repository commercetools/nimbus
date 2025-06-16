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
 * Change the open state with a controlled prop
 */
export const IsOpenControlled: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },

  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
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

/**
 * Granularity story
 * Demonstrates available granularity options
 */
export const Granularity: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    return (
      <Stack>
        <Box>
          <DatePicker {...args} granularity="day" />
        </Box>
        <Box>
          <DatePicker {...args} granularity="hour" />
        </Box>
        <Box>
          <DatePicker {...args} granularity="minute" />
        </Box>
        <Box>
          <DatePicker {...args} granularity="second" />
        </Box>
      </Stack>
    );
  },
};

/**
 * Custom Width story
 * Demonstrates that DatePicker accepts a width property
 */
export const CustomWidth: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    return (
      <Stack>
        <Box>
          <DatePicker {...args} width="256px" />
        </Box>
        <Box>
          <DatePicker {...args} width="512px" />
        </Box>
        <Box>
          <DatePicker {...args} width="full" />
        </Box>
      </Stack>
    );
  },
};
