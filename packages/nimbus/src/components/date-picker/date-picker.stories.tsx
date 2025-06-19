import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./date-picker";
import { I18nProvider } from "react-aria";
import { Box, Button, Stack, FormField } from "@/components";
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
 * Sizes and Variants story
 * Demonstrates all combinations of available sizes and variants
 */
export const SizesAndVariants: Story = {
  args: {
    ["aria-label"]: "Select a date",
    granularity: "second",
  },
  render: (args) => {
    const sizes = ["sm", "md"] as const;
    const variants = ["solid", "ghost"] as const;

    return (
      <Stack direction="column" gap="600">
        {sizes.map((size) => (
          <Stack key={size} direction="column" gap="300">
            <Box fontWeight="bold" textTransform="capitalize">
              Size: {size}
            </Box>
            <Stack direction="row" gap="400">
              {variants.map((variant) => (
                <Stack
                  key={variant}
                  direction="column"
                  gap="200"
                  alignItems="start"
                >
                  <Box
                    fontSize="sm"
                    color="neutral.11"
                    textTransform="capitalize"
                  >
                    {variant}
                  </Box>
                  <DatePicker size={size} variant={variant} {...args} />
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}
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

/**
 * InFormFieldContext story
 * Demonstrates the DatePicker working inside a FormField context
 */
export const InFormFieldContext: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        {/* Basic FormField integration */}
        <FormField.Root isRequired>
          <FormField.Label>Event Date</FormField.Label>
          <FormField.Input>
            <DatePicker {...args} width="full" />
          </FormField.Input>
          <FormField.Description>
            Select the date for your event
          </FormField.Description>
        </FormField.Root>

        {/* Invalid state */}
        <FormField.Root isInvalid>
          <FormField.Label>Deadline Date</FormField.Label>
          <FormField.Input>
            <DatePicker {...args} width="full" />
          </FormField.Input>
          <FormField.Description>
            Choose a deadline for the project
          </FormField.Description>
          <FormField.Error>
            Please select a valid date in the future
          </FormField.Error>
        </FormField.Root>

        {/* With granularity and info box */}
        <FormField.Root>
          <FormField.Label>Meeting Time</FormField.Label>
          <FormField.Input>
            <DatePicker {...args} granularity="minute" width="full" />
          </FormField.Input>
          <FormField.Description>
            Select the exact date and time for the meeting
          </FormField.Description>
          <FormField.InfoBox>
            This date picker supports minute-level precision. Use the calendar
            to select a date and the time fields to set the exact time.
          </FormField.InfoBox>
        </FormField.Root>
      </Stack>
    );
  },
};
