import type { Meta, StoryObj } from "@storybook/react";
import { DateInput } from "./date-input";
import type { DateInputProps } from "./date-input.types";
import { Button, FormField, Stack, Text } from "@/components";
import { CalendarDate } from "@internationalized/date";
import { useState } from "react";
import type { DateValue } from "react-aria";
import { I18nProvider } from "react-aria";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof DateInput> = {
  title: "Components/Date/DateInput",
  component: DateInput,
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
type Story = StoryObj<typeof DateInput>;

/**
 * Base story
 * Demonstrates the most basic implementation
 */
export const Base: Story = {
  args: {
    ["aria-label"]: "Enter a date",
  },
};

/**
 * Showcase Uncontrolled
 */
export const Uncontrolled: Story = {
  render: (args: DateInputProps) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With defaultValue (2024-01-15)</Text>
        <DateInput
          {...args}
          defaultValue={new CalendarDate(2024, 1, 15)}
          aria-label="With default value"
        />
        <Text>With defaultValue (2024-12-25)</Text>
        <DateInput
          {...args}
          defaultValue={new CalendarDate(2024, 12, 25)}
          aria-label="With different default value"
        />
        <Text>No defaultValue (empty)</Text>
        <DateInput {...args} aria-label="Without default value" />
      </Stack>
    );
  },
};

/**
 * Showcase Controlled
 * Demonstrates how to use the DateInput as a controlled component
 * with the value property and state management
 */
export const Controlled: Story = {
  render: (args: DateInputProps) => {
    const [date, setDate] = useState<DateValue | null>(
      new CalendarDate(2024, 6, 15)
    );
    const handleDateChange = (value: DateValue | null) => {
      setDate(value);
    };

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>
          Controlled DateInput (
          <span>current value: {date === null ? "null" : date.toString()}</span>
          )
        </Text>
        <DateInput
          {...args}
          value={date}
          onChange={handleDateChange}
          aria-label="Controlled date input"
        />
        <Button onPress={() => setDate(null)}>Reset</Button>
      </Stack>
    );
  },
};

/**
 * Showcase with FormField
 * Demonstrates integration with the FormField component
 */
export const WithFormField: Story = {
  render: (args: DateInputProps) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <FormField.Root isRequired>
          <FormField.Label>Birth Date</FormField.Label>
          <FormField.Input>
            <DateInput
              {...args}
              defaultValue={new CalendarDate(1990, 5, 15)}
              aria-label="Birth date"
            />
          </FormField.Input>
          <FormField.Description>
            Enter your date of birth
          </FormField.Description>
        </FormField.Root>

        <FormField.Root isInvalid>
          <FormField.Label>Event Date</FormField.Label>
          <FormField.Input>
            <DateInput {...args} aria-label="Event date" />
          </FormField.Input>
          <FormField.Description>Select the event date</FormField.Description>
          <FormField.Error>Please select a valid date</FormField.Error>
        </FormField.Root>
      </Stack>
    );
  },
};

/**
 * Showcase Size Variants
 */
export const SizeVariants: Story = {
  render: (args: DateInputProps) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Small size</Text>
        <DateInput
          {...args}
          size="sm"
          defaultValue={new CalendarDate(2024, 3, 10)}
          aria-label="Small date input"
        />
        <Text>Medium size (default)</Text>
        <DateInput
          {...args}
          size="md"
          defaultValue={new CalendarDate(2024, 3, 10)}
          aria-label="Medium date input"
        />
      </Stack>
    );
  },
};

/**
 * Showcase Style Variants
 */
export const StyleVariants: Story = {
  render: (args: DateInputProps) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Solid variant (default)</Text>
        <DateInput
          {...args}
          variant="solid"
          defaultValue={new CalendarDate(2024, 8, 20)}
          aria-label="Solid date input"
        />
        <Text>Ghost variant</Text>
        <DateInput
          {...args}
          variant="ghost"
          defaultValue={new CalendarDate(2024, 8, 20)}
          aria-label="Ghost date input"
        />
      </Stack>
    );
  },
};
