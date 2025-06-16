import type { Meta, StoryObj } from "@storybook/react";
import { DateInput } from "./date-input";
import type { DateInputProps } from "./date-input.types";
import { Button, FormField, Stack, Text } from "@/components";
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from "@internationalized/date";
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

/**
 * Showcase Hour Cycle
 * Demonstrates the hourCycle property with both 12-hour and 24-hour formats
 * when using date-time values that include time components
 */
export const HourCycle: Story = {
  render: (args: DateInputProps) => {
    // Create a date-time value with both date and time components
    const dateTimeValue = new CalendarDateTime(2024, 6, 15, 14, 30, 0);

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>12-hour format (2:30 PM)</Text>
        <DateInput
          {...args}
          defaultValue={dateTimeValue}
          hourCycle={12}
          aria-label="Date input with 12-hour format"
          data-testid="hour-cycle-12"
        />
        <Text>24-hour format (14:30)</Text>
        <DateInput
          {...args}
          defaultValue={dateTimeValue}
          hourCycle={24}
          aria-label="Date input with 24-hour format"
          data-testid="hour-cycle-24"
        />
      </Stack>
    );
  },
};

/**
 * Showcase Granularity
 * Demonstrates all available granularity levels in a single story
 */
export const Granularity: Story = {
  render: (args: DateInputProps) => {
    // Create a date-time value with all components for demonstration
    const dateTimeValue = new CalendarDateTime(2024, 6, 15, 14, 30, 45);
    const dateValue = new CalendarDate(2024, 6, 15);

    return (
      <>
        {["en-US", "de-DE"].map((locale) => (
          <I18nProvider locale={locale}>
            <Stack direction="column" gap="400" alignItems="start" mb="800">
              <Text fontWeight="700">{locale}</Text>
              <Text>Granularity: day (date only)</Text>
              <DateInput
                {...args}
                defaultValue={dateValue}
                granularity="day"
                aria-label="Granularity day"
                data-testid="granularity-day"
              />
              <Text>Granularity: hour (date + hour)</Text>
              <DateInput
                {...args}
                defaultValue={dateTimeValue}
                granularity="hour"
                aria-label="Granularity hour"
                data-testid="granularity-hour"
              />
              <Text>Granularity: minute (date + hour + minute)</Text>
              <DateInput
                {...args}
                defaultValue={dateTimeValue}
                granularity="minute"
                aria-label="Granularity minute"
                data-testid="granularity-minute"
              />
              <Text>Granularity: second (date + hour + minute + second)</Text>
              <DateInput
                {...args}
                defaultValue={dateTimeValue}
                granularity="second"
                aria-label="Granularity second"
                data-testid="granularity-second"
              />
            </Stack>
          </I18nProvider>
        ))}
      </>
    );
  },
};

/**
 * Showcase Hide Time Zone
 * Demonstrates the hideTimeZone property with datetime values that include timezone information
 */
export const HideTimeZone: Story = {
  render: (args: DateInputProps) => {
    // Create a zoned date-time value that includes timezone information
    const zonedDateTime = new ZonedDateTime(
      2024,
      6,
      15,
      "America/New_York",
      -4 * 60 * 60 * 1000,
      14,
      30,
      0
    );

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With timezone displayed (hideTimeZone=false)</Text>
        <DateInput
          {...args}
          defaultValue={zonedDateTime}
          hideTimeZone={false}
          granularity="minute"
          aria-label="Date input with timezone displayed"
          data-testid="timezone-visible"
        />
        <Text>With timezone hidden (hideTimeZone=true)</Text>
        <DateInput
          {...args}
          defaultValue={zonedDateTime}
          hideTimeZone={true}
          granularity="minute"
          aria-label="Date input with timezone hidden"
          data-testid="timezone-hidden"
        />
      </Stack>
    );
  },
};

/**
 * Showcase Should Force Leading Zeros
 * Demonstrates the shouldForceLeadingZeros property with different date values
 * to show the difference between forced leading zeros and locale-default behavior
 */
export const ShouldForceLeadingZeros: Story = {
  render: (args: DateInputProps) => {
    // Create date values with single-digit months and days to demonstrate leading zeros
    const singleDigitDate = new CalendarDate(2024, 3, 5); // March 5th
    const singleDigitDateTime = new CalendarDateTime(2024, 3, 5, 9, 7, 0); // March 5th, 9:07 AM

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text fontWeight="700">Date Only (March 5, 2024)</Text>
        <Text>Default behavior (locale-determined)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDate}
          granularity="day"
          aria-label="Date input with default leading zeros behavior"
          data-testid="leading-zeros-default-date"
        />
        <Text>Force leading zeros (shouldForceLeadingZeros=true)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDate}
          granularity="day"
          shouldForceLeadingZeros={true}
          aria-label="Date input with forced leading zeros"
          data-testid="leading-zeros-forced-date"
        />
        <Text>No leading zeros (shouldForceLeadingZeros=false)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDate}
          granularity="day"
          shouldForceLeadingZeros={false}
          aria-label="Date input without leading zeros"
          data-testid="leading-zeros-disabled-date"
        />

        <Text fontWeight="700">Date and Time (March 5, 2024, 9:07 AM)</Text>
        <Text>Default behavior (locale-determined)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDateTime}
          granularity="minute"
          aria-label="DateTime input with default leading zeros behavior"
          data-testid="leading-zeros-default-datetime"
        />
        <Text>Force leading zeros (shouldForceLeadingZeros=true)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDateTime}
          granularity="minute"
          shouldForceLeadingZeros={true}
          aria-label="DateTime input with forced leading zeros"
          data-testid="leading-zeros-forced-datetime"
        />
        <Text>No leading zeros (shouldForceLeadingZeros=false)</Text>
        <DateInput
          {...args}
          defaultValue={singleDigitDateTime}
          granularity="minute"
          shouldForceLeadingZeros={false}
          aria-label="DateTime input without leading zeros"
          data-testid="leading-zeros-disabled-datetime"
        />
      </Stack>
    );
  },
};
