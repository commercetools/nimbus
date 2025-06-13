import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./date-picker";
import { I18nProvider } from "react-aria";
import { Box, Stack } from "@/components";

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
 * Base story
 * Demonstrates the most basic implementation
 */
export const Base: Story = {
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
 * Base story
 * Demonstrates the most basic implementation
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
