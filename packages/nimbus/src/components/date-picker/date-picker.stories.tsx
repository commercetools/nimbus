import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./date-picker";
import { I18nProvider } from "react-aria";
import { Box, Button, Stack, FormField, Text } from "@/components";
import { useState } from "react";
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  today,
  getLocalTimeZone,
} from "@internationalized/date";
import type { DateValue } from "react-aria";

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
  },
};

/**
 * Uncontrolled Usage
 * Demonstrates defaultValue behavior with different initial dates
 */
export const Uncontrolled: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With defaultValue (2025-01-15)</Text>
        <DatePicker
          {...args}
          defaultValue={new CalendarDate(2025, 1, 15)}
          aria-label="With default value"
        />
        <Text>With defaultValue (2025-12-25)</Text>
        <DatePicker
          {...args}
          defaultValue={new CalendarDate(2025, 12, 25)}
          aria-label="With different default value"
        />
        <Text>No defaultValue (empty)</Text>
        <DatePicker {...args} aria-label="Without default value" />
      </Stack>
    );
  },
};

/**
 * Controlled Usage
 * Demonstrates how to use the DatePicker as a controlled component
 */
export const Controlled: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue | null>(
      new CalendarDate(2025, 6, 15)
    );
    const handleDateChange = (value: DateValue | null) => {
      setDate(value);
    };

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>
          Controlled DatePicker (
          <span>current value: {date === null ? "null" : date.toString()}</span>
          )
        </Text>
        <DatePicker
          {...args}
          value={date}
          onChange={handleDateChange}
          aria-label="Controlled date picker"
        />
        <Button onPress={() => setDate(null)}>Reset</Button>
      </Stack>
    );
  },
};

/**
 * Placeholder Value
 * Demonstrates the placeholderValue property which is used
 * to set the start value when the input is empty and handled with the keyboard.
 */
export const PlaceholderValue: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With placeholder value (2025-06-15)</Text>
        <DatePicker
          {...args}
          placeholderValue={new CalendarDate(2025, 6, 15)}
          aria-label="Date picker with placeholder"
        />
        <Text>Without placeholder value</Text>
        <DatePicker {...args} aria-label="Date picker without placeholder" />
      </Stack>
    );
  },
};

/**
 * Variants, Sizes, and States
 * Demonstrates all combinations of available sizes, variants, and form states
 */
export const VariantsSizesAndStates: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
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
                  <Text
                    fontSize="sm"
                    color="neutral.11"
                    textTransform="capitalize"
                  >
                    {variant}
                  </Text>
                  <Stack direction="row" gap="400" alignItems="start">
                    {sizes.map((size) => (
                      <Stack
                        key={size}
                        direction="column"
                        gap="100"
                        alignItems="start"
                      >
                        <Text fontSize="xs" color="neutral.10">
                          {size}
                        </Text>
                        <DatePicker
                          {...args}
                          {...state.props}
                          variant={variant}
                          size={size}
                          defaultValue={new CalendarDate(2025, 6, 15)}
                          aria-label={`${state.label} ${variant} ${size} date picker`}
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
 * Time Support
 * Demonstrates date and time selection with different granularities
 */
export const TimeSupport: Story = {
  args: {
    ["aria-label"]: "Select a date and time",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Date only (day granularity)</Text>
        <DatePicker
          {...args}
          granularity="day"
          defaultValue={new CalendarDate(2025, 6, 15)}
          aria-label="Date only picker"
        />

        <Text>Date and time to minute</Text>
        <DatePicker
          {...args}
          granularity="minute"
          defaultValue={new CalendarDateTime(2025, 6, 15, 14, 30)}
          aria-label="Date and time picker (minute)"
        />

        <Text>Date and time to second</Text>
        <DatePicker
          {...args}
          granularity="second"
          defaultValue={new CalendarDateTime(2025, 6, 15, 14, 30, 45)}
          aria-label="Date and time picker (second)"
        />

        <Text>With time zone</Text>
        <DatePicker
          {...args}
          granularity="minute"
          defaultValue={
            new ZonedDateTime(
              2025,
              6,
              15,
              "America/New_York",
              -4 * 60 * 60 * 1000,
              14,
              30
            )
          }
          aria-label="Date and time picker with timezone"
        />
      </Stack>
    );
  },
};

/**
 * Hour Cycle
 * Demonstrates 12-hour vs 24-hour time formats
 */
export const HourCycle: Story = {
  args: {
    ["aria-label"]: "Select a date and time",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>12-hour format (default for en-US)</Text>
        <DatePicker
          {...args}
          granularity="minute"
          hourCycle={12}
          defaultValue={new CalendarDateTime(2025, 6, 15, 14, 30)}
          aria-label="12-hour format picker"
        />

        <Text>24-hour format</Text>
        <DatePicker
          {...args}
          granularity="minute"
          hourCycle={24}
          defaultValue={new CalendarDateTime(2025, 6, 15, 14, 30)}
          aria-label="24-hour format picker"
        />
      </Stack>
    );
  },
};

/**
 * Hide Time Zone
 * Demonstrates hiding the time zone when using ZonedDateTime
 */
export const HideTimeZone: Story = {
  args: {
    ["aria-label"]: "Select a date and time",
  },
  render: (args) => {
    const zonedDateTime = new ZonedDateTime(
      2025,
      6,
      15,
      "America/New_York",
      -4 * 60 * 60 * 1000,
      14,
      30
    );

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With time zone shown (default)</Text>
        <DatePicker
          {...args}
          granularity="minute"
          defaultValue={zonedDateTime}
          aria-label="With timezone shown"
        />

        <Text>With time zone hidden</Text>
        <DatePicker
          {...args}
          granularity="minute"
          hideTimeZone
          defaultValue={zonedDateTime}
          aria-label="With timezone hidden"
        />
      </Stack>
    );
  },
};

/**
 * Min and Max Values
 * Demonstrates date range restrictions
 */
export const MinMaxValues: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    const today = new CalendarDate(2025, 6, 15); // Fixed "today" for consistent stories
    const minDate = today.add({ days: 1 });
    const maxDate = today.add({ days: 30 });

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>
          Restricted range: {minDate.toString()} to {maxDate.toString()}
        </Text>
        <DatePicker
          {...args}
          minValue={minDate}
          maxValue={maxDate}
          defaultValue={today.add({ days: 7 })}
          aria-label="Date picker with min/max values"
        />
        <Text fontSize="sm" color="neutral.11">
          Try selecting dates outside the allowed range in the calendar.
        </Text>
      </Stack>
    );
  },
};

/**
 * Unavailable Dates
 * Demonstrates marking specific dates as unavailable
 */
export const UnavailableDates: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    const isWeekend = (date: DateValue) => {
      const jsDate = date.toDate(getLocalTimeZone());
      const dayOfWeek = jsDate.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    };

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Business days only (weekends unavailable)</Text>
        <DatePicker
          {...args}
          isDateUnavailable={isWeekend}
          defaultValue={new CalendarDate(2025, 6, 16)} // Monday
          aria-label="Business days only picker"
        />
        <Text fontSize="sm" color="neutral.11">
          Weekends are marked as unavailable and cannot be selected.
        </Text>
      </Stack>
    );
  },
};

/**
 * Custom Validation
 * Demonstrates custom validation logic using isInvalid and error handling
 */
export const CustomValidation: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const isValidCustomDate = (date: DateValue): boolean => {
      // Only allow dates that are weekdays and in the future
      const jsDate = date.toDate(getLocalTimeZone());
      const dayOfWeek = jsDate.getDay();
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isFuture = date.compare(today(getLocalTimeZone())) > 0;

      return isWeekday && isFuture;
    };

    const handleDateChange = (newDate: DateValue | null) => {
      setDate(newDate);

      if (!newDate) {
        setValidationError("Date is required");
      } else if (!isValidCustomDate(newDate)) {
        setValidationError("Please select a future weekday");
      } else {
        setValidationError(null);
      }
    };

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Custom validation: Future weekdays only</Text>
        <DatePicker
          {...args}
          value={date}
          onChange={handleDateChange}
          isInvalid={!!validationError}
          aria-label="Custom validation picker"
        />
        {validationError && (
          <Text color="red.500" fontSize="sm">
            {validationError}
          </Text>
        )}
        <Text fontSize="sm" color="neutral.11">
          Only future weekdays are allowed. Try selecting a weekend or past
          date.
        </Text>
      </Stack>
    );
  },
};

/**
 * Calendar Configuration
 * Demonstrates calendar-specific configuration options
 */
export const CalendarConfiguration: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="600" alignItems="start">
        <Box>
          <Text fontWeight="700" mb="200">
            Custom week start (Tuesday)
          </Text>
          <DatePicker
            {...args}
            defaultValue={today(getLocalTimeZone())}
            firstDayOfWeek="tue"
            aria-label="Custom week start picker"
          />
        </Box>

        <Box>
          <Text fontWeight="700" mb="200">
            Page behavior configuration
          </Text>
          <DatePicker
            {...args}
            defaultValue={today(getLocalTimeZone())}
            pageBehavior="single"
            aria-label="Single page behavior picker"
          />
        </Box>
      </Stack>
    );
  },
};

/**
 * Custom Width
 * Demonstrates that DatePicker accepts a width property
 */
export const CustomWidth: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Width: 256px</Text>
        <DatePicker {...args} width="256px" />

        <Text>Width: 512px</Text>
        <DatePicker {...args} width="512px" />

        <Text>Width: full</Text>
        <DatePicker {...args} width="full" />
      </Stack>
    );
  },
};

/**
 * German Locale
 * Demonstrates internationalization support
 */
export const GermanLocale: Story = {
  args: {
    ["aria-label"]: "Datum auswählen",
  },
  render: (args) => {
    return (
      <I18nProvider locale="de-DE">
        <Stack direction="column" gap="400" alignItems="start">
          <Text>German locale with different granularities</Text>
          <DatePicker {...args} granularity="day" />
          <DatePicker
            {...args}
            granularity="minute"
            defaultValue={new CalendarDateTime(2025, 6, 15, 14, 30, 0)}
          />
        </Stack>
      </I18nProvider>
    );
  },
};

/**
 * Form Field Integration
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

/**
 * Popover Behavior
 * Demonstrates different popover opening and closing behaviors
 */
export const PopoverBehavior: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);

    return (
      <Stack direction="column" gap="600" alignItems="start">
        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Controlled popover state</Text>
          <DatePicker
            {...args}
            isOpen={isOpen1}
            onOpenChange={setIsOpen1}
            aria-label="Controlled popover picker"
          />
          <Stack direction="row" gap="200">
            <Button onPress={() => setIsOpen1(true)}>Open Calendar</Button>
            <Button onPress={() => setIsOpen1(false)}>Close Calendar</Button>
          </Stack>
        </Stack>

        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Default open popover</Text>
          <DatePicker {...args} defaultOpen aria-label="Default open picker" />
          <Text fontSize="sm" color="neutral.11">
            Calendar opens by default
          </Text>
        </Stack>

        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Custom close behavior</Text>
          <DatePicker
            {...args}
            isOpen={isOpen2}
            onOpenChange={setIsOpen2}
            shouldCloseOnSelect={false}
            aria-label="Custom close behavior picker"
          />
          <Text fontSize="sm" color="neutral.11">
            Calendar stays open after selecting a date
          </Text>
          <Button onPress={() => setIsOpen2(false)}>
            Manually Close Calendar
          </Button>
        </Stack>
      </Stack>
    );
  },
};

/**
 * Event Handling
 * Demonstrates various event handlers and their usage
 */
export const EventHandling: Story = {
  args: {
    ["aria-label"]: "Select a date",
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue | null>(null);
    const [events, setEvents] = useState<string[]>([]);

    const addEvent = (event: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setEvents((prev) => [...prev.slice(-4), `[${timestamp}] ${event}`]);
    };

    const handleDateChange = (newDate: DateValue | null) => {
      setDate(newDate);
      addEvent(`Date changed: ${newDate?.toString() || "null"}`);
    };

    const handleOpenChange = (isOpen: boolean) => {
      addEvent(`Popover ${isOpen ? "opened" : "closed"}`);
    };

    const handleFocus = () => {
      addEvent("DatePicker focused");
    };

    const handleBlur = () => {
      addEvent("DatePicker blurred");
    };

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text fontWeight="700">Event handling demonstration</Text>
        <DatePicker
          {...args}
          value={date}
          onChange={handleDateChange}
          onOpenChange={handleOpenChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Event handling picker"
        />

        <Stack direction="column" gap="200" alignItems="start">
          <Text fontWeight="600">Event Log (last 5 events):</Text>
          <Stack
            direction="column"
            gap="100"
            p="300"
            bg="gray.50"
            borderRadius="md"
            minHeight="120px"
            width="full"
          >
            {events.length === 0 ? (
              <Text color="gray.500">No events yet...</Text>
            ) : (
              events.map((event, index) => (
                <Text key={index} fontFamily="mono" fontSize="sm">
                  {event}
                </Text>
              ))
            )}
          </Stack>
          <Button onPress={() => setEvents([])}>Clear Log</Button>
        </Stack>
      </Stack>
    );
  },
};
