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
 * Showcase State Variants
 * Demonstrates isDisabled, isReadOnly, isRequired, and isInvalid properties
 * for both style variants and sizes
 */
export const VariantsSizesAndStates: Story = {
  render: (args: DateInputProps) => {
    const states = [
      { label: "Default", props: {} },
      { label: "Disabled", props: { isDisabled: true } },
      { label: "Read Only", props: { isReadOnly: true } },
      { label: "Required", props: { isRequired: true } },
      { label: "Invalid", props: { isInvalid: true } },
    ];

    const variants = ["solid", "ghost"] as const;
    const sizes = ["sm", "md"] as const;

    return (
      <Stack direction="column" gap="600" alignItems="start">
        {states.map((state) => (
          <Stack
            key={state.label}
            direction="column"
            gap="200"
            alignItems="start"
          >
            <Stack direction="column" gap="400" alignItems="start">
              <Text fontWeight="700">{state.label}</Text>
              {variants.map((variant) => (
                <Stack
                  key={variant}
                  direction="column"
                  gap="200"
                  alignItems="start"
                >
                  <Stack direction="row" gap="400" alignItems="start">
                    {sizes.map((size) => (
                      <Stack
                        key={size}
                        direction="column"
                        gap="100"
                        alignItems="start"
                      >
                        <DateInput
                          {...args}
                          {...state.props}
                          variant={variant}
                          size={size}
                          defaultValue={new CalendarDate(2024, 6, 15)}
                          aria-label={`${state.label} ${variant} ${size} date input`}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  },
};
