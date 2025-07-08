import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker } from "./date-range-picker";
import { I18nProvider } from "react-aria";
import { Button, Stack, FormField, Text } from "@/components";
import { useState } from "react";
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from "@internationalized/date";
import type { DateValue } from "react-aria";
import { userEvent, within, expect, waitFor } from "storybook/test";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/Date/DateRangePicker",
  component: DateRangePicker,
  decorators: [
    (Story) => (
      <I18nProvider locale="en-US">
        <Story />
      </I18nProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Base: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders with proper DateRangePicker structure", async () => {
      const dateGroup = await canvas.findByRole("group", {
        name: "Select a date range",
      });
      await expect(dateGroup).toBeInTheDocument();

      // Should contain two date input segments
      const dateSegments = canvas.getAllByRole("spinbutton");
      await expect(dateSegments.length).toBeGreaterThanOrEqual(6); // 2 inputs × 3 segments each

      // Should have calendar toggle button
      const calendarButton = await canvas.findByRole("button", {
        name: /calendar/i,
      });
      await expect(calendarButton).toBeInTheDocument();
    });
  },
};

export const Uncontrolled: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With defaultValue (2025-01-15 to 2025-01-20)</Text>
        <DateRangePicker
          {...args}
          defaultValue={{
            start: new CalendarDate(2025, 1, 15),
            end: new CalendarDate(2025, 1, 20),
          }}
          aria-label="With default value"
        />
        <Text>No defaultValue (empty)</Text>
        <DateRangePicker {...args} aria-label="Without default value" />
      </Stack>
    );
  },
};

export const Controlled: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    const [range, setRange] = useState<{
      start: DateValue;
      end: DateValue;
    } | null>({
      start: new CalendarDate(2025, 6, 15),
      end: new CalendarDate(2025, 6, 20),
    });

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>
          Controlled DateRangePicker (
          <span>
            current value:{" "}
            {range
              ? `${range.start.toString()} to ${range.end.toString()}`
              : "null"}
          </span>
          )
        </Text>
        <DateRangePicker
          {...args}
          value={range}
          onChange={setRange}
          aria-label="Controlled date range picker"
        />
        <Button onPress={() => setRange(null)}>Reset</Button>
      </Stack>
    );
  },
};

export const PlaceholderValue: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With placeholder value (2025-06-15 to 2025-06-20)</Text>
        <DateRangePicker
          {...args}
          placeholderValue={{
            start: new CalendarDate(2025, 6, 15),
            end: new CalendarDate(2025, 6, 20),
          }}
          aria-label="Date range picker with placeholder"
        />
        <Text>Without placeholder value</Text>
        <DateRangePicker
          {...args}
          aria-label="Date range picker without placeholder"
        />
      </Stack>
    );
  },
};

export const VariantsSizesAndStates: Story = {
  args: {
    ["aria-label"]: "Select a date range",
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
                  <DateRangePicker
                    {...args}
                    {...state.props}
                    variant={variant}
                    defaultValue={{
                      start: new CalendarDate(2025, 6, 15),
                      end: new CalendarDate(2025, 6, 20),
                    }}
                    aria-label={`${state.label} ${variant} date range picker`}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  },
};

export const TimeSupport: Story = {
  args: {
    ["aria-label"]: "Select a date and time range",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Date only (day granularity)</Text>
        <DateRangePicker
          {...args}
          granularity="day"
          defaultValue={{
            start: new CalendarDate(2025, 6, 15),
            end: new CalendarDate(2025, 6, 20),
          }}
          aria-label="Date only range picker"
        />

        <Text>Date and time to minute</Text>
        <DateRangePicker
          {...args}
          granularity="minute"
          defaultValue={{
            start: new CalendarDateTime(2025, 6, 15, 14, 30),
            end: new CalendarDateTime(2025, 6, 20, 16, 45),
          }}
          aria-label="Date and time range picker (minute)"
        />

        <Text>With time zone</Text>
        <DateRangePicker
          {...args}
          granularity="minute"
          defaultValue={{
            start: new ZonedDateTime(
              2025,
              6,
              15,
              "America/New_York",
              -4 * 60 * 60 * 1000,
              14,
              30
            ),
            end: new ZonedDateTime(
              2025,
              6,
              20,
              "America/New_York",
              -4 * 60 * 60 * 1000,
              16,
              45
            ),
          }}
          aria-label="Date and time range picker with timezone"
        />
      </Stack>
    );
  },
};

export const HourCycle: Story = {
  args: {
    ["aria-label"]: "Select a date and time range",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>12-hour format (default for en-US)</Text>
        <DateRangePicker
          {...args}
          granularity="minute"
          hourCycle={12}
          defaultValue={{
            start: new CalendarDateTime(2025, 6, 15, 14, 30),
            end: new CalendarDateTime(2025, 6, 20, 16, 45),
          }}
          aria-label="12-hour format range picker"
        />

        <Text>24-hour format</Text>
        <DateRangePicker
          {...args}
          granularity="minute"
          hourCycle={24}
          defaultValue={{
            start: new CalendarDateTime(2025, 6, 15, 14, 30),
            end: new CalendarDateTime(2025, 6, 20, 16, 45),
          }}
          aria-label="24-hour format range picker"
        />
      </Stack>
    );
  },
};

export const HideTimeZone: Story = {
  args: {
    ["aria-label"]: "Select a date and time range",
  },
  render: (args) => {
    const zonedDateTimeRange = {
      start: new ZonedDateTime(
        2025,
        6,
        15,
        "America/New_York",
        -4 * (60 * 60 * 1000),
        14,
        30
      ),
      end: new ZonedDateTime(
        2025,
        6,
        20,
        "America/New_York",
        -4 * (60 * 60 * 1000),
        16,
        45
      ),
    };

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With time zone shown (default)</Text>
        <DateRangePicker
          {...args}
          granularity="minute"
          defaultValue={zonedDateTimeRange}
          aria-label="With timezone shown"
        />

        <Text>With time zone hidden</Text>
        <DateRangePicker
          {...args}
          granularity="minute"
          hideTimeZone
          defaultValue={zonedDateTimeRange}
          aria-label="With timezone hidden"
        />
      </Stack>
    );
  },
};

export const MinMaxValues: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    const today = new CalendarDate(2025, 6, 15);
    const minDate = today.add({ days: 1 });
    const maxDate = today.add({ days: 30 });

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>
          Restricted range: {minDate.toString()} to {maxDate.toString()}
        </Text>
        <DateRangePicker
          {...args}
          minValue={minDate}
          maxValue={maxDate}
          defaultValue={{
            start: today.add({ days: 7 }),
            end: today.add({ days: 12 }),
          }}
          aria-label="Date range picker with min/max values"
        />
        <Text fontSize="sm" color="neutral.11">
          Try selecting dates outside the allowed range in the calendar.
        </Text>
      </Stack>
    );
  },
};

export const UnavailableDates: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    const isOddDay = (date: DateValue) => {
      return date.day % 2 === 1;
    };

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Dr. Orderly only accepts appointments on even days:</Text>
        <DateRangePicker
          {...args}
          isDateUnavailable={isOddDay}
          defaultValue={{
            start: new CalendarDate(2025, 6, 16),
            end: new CalendarDate(2025, 6, 20),
          }}
          aria-label="Even days only range picker"
        />
        <Text fontSize="sm" color="neutral.11">
          (Odd-numbered days are marked as unavailable and cannot be selected.)
        </Text>
      </Stack>
    );
  },
};

export const NonContiguousRanges: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Allow selection of ranges that contain unavailable dates:</Text>
        <DateRangePicker
          {...args}
          allowsNonContiguousRanges={true}
          defaultValue={{
            start: new CalendarDate(2025, 6, 10),
            end: new CalendarDate(2025, 6, 25),
          }}
          isDateUnavailable={(date: DateValue) => {
            const dateObj = date.toDate("UTC");
            const dayOfWeek = dateObj.getDay();
            return dayOfWeek === 1; // Block Mondays
          }}
          aria-label="Non-contiguous range picker"
        />
        <Text fontSize="sm" color="neutral.11">
          Select ranges that include unavailable dates (Mondays are blocked).
        </Text>
      </Stack>
    );
  },
};

export const CustomWidth: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>Width: 400px</Text>
        <DateRangePicker {...args} width="400px" />

        <Text>Width: 600px</Text>
        <DateRangePicker {...args} width="600px" />

        <Text>Width: full</Text>
        <DateRangePicker {...args} width="full" />
      </Stack>
    );
  },
};

export const MultipleLocales: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="600" alignItems="start">
        <Stack direction="column" gap="200" alignItems="start">
          <Text fontWeight="700">English (US) - 12-hour format</Text>
          <I18nProvider locale="en-US">
            <DateRangePicker
              {...args}
              granularity="minute"
              defaultValue={{
                start: new CalendarDateTime(2025, 6, 15, 14, 30),
                end: new CalendarDateTime(2025, 6, 20, 16, 45),
              }}
              aria-label="US English range picker"
            />
          </I18nProvider>
        </Stack>

        <Stack direction="column" gap="200" alignItems="start">
          <Text fontWeight="700">German (DE) - 24-hour format</Text>
          <I18nProvider locale="de-DE">
            <DateRangePicker
              {...args}
              granularity="minute"
              defaultValue={{
                start: new CalendarDateTime(2025, 6, 15, 14, 30),
                end: new CalendarDateTime(2025, 6, 20, 16, 45),
              }}
              aria-label="German range picker"
            />
          </I18nProvider>
        </Stack>

        <Stack direction="column" gap="200" alignItems="start">
          <Text fontWeight="700">Spanish (ES) - Different date format</Text>
          <I18nProvider locale="es-ES">
            <DateRangePicker
              {...args}
              granularity="minute"
              defaultValue={{
                start: new CalendarDateTime(2025, 6, 15, 14, 30),
                end: new CalendarDateTime(2025, 6, 20, 16, 45),
              }}
              aria-label="Spanish range picker"
            />
          </I18nProvider>
        </Stack>
      </Stack>
    );
  },
};

export const InFormFieldContext: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <FormField.Root isRequired>
          <FormField.Label>Event Date Range</FormField.Label>
          <FormField.Input>
            <DateRangePicker {...args} width="full" />
          </FormField.Input>
          <FormField.Description>
            Select the start and end dates for your event
          </FormField.Description>
        </FormField.Root>

        <FormField.Root isInvalid>
          <FormField.Label>Deadline Range</FormField.Label>
          <FormField.Input>
            <DateRangePicker {...args} width="full" />
          </FormField.Input>
          <FormField.Description>
            Choose a deadline range for the project
          </FormField.Description>
          <FormField.Error>
            Please select a valid date range in the future
          </FormField.Error>
        </FormField.Root>

        <FormField.Root>
          <FormField.Label>Meeting Time Range</FormField.Label>
          <FormField.Input>
            <DateRangePicker {...args} granularity="minute" width="full" />
          </FormField.Input>
          <FormField.Description>
            Select the exact start and end times for the meeting
          </FormField.Description>
          <FormField.InfoBox>
            This date range picker supports minute-level precision. Use the
            calendar to select dates and the time fields to set the exact times.
          </FormField.InfoBox>
        </FormField.Root>
      </Stack>
    );
  },
};

export const PopoverBehavior: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);

    return (
      <Stack direction="column" gap="600" alignItems="start">
        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Controlled popover state</Text>
          <Stack direction="row" gap="600" alignItems="start">
            <Stack
              direction="column"
              gap="200"
              flex="1"
              minWidth="320px"
              align="flex-start"
            >
              <Button onPress={() => setIsOpen1(true)}>Open Calendar</Button>
            </Stack>
            <Stack direction="column" gap="200" flex="1">
              <DateRangePicker
                {...args}
                isOpen={isOpen1}
                onOpenChange={setIsOpen1}
                aria-label="Controlled popover range picker"
              />
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Default open popover</Text>
          <Stack direction="row" gap="600" alignItems="start">
            <Stack direction="column" gap="200" flex="1" minWidth="320px">
              <Text fontSize="sm" color="neutral.11">
                Calendar opens by default
              </Text>
            </Stack>
            <Stack direction="column" gap="200" flex="1">
              <DateRangePicker
                {...args}
                defaultOpen
                aria-label="Default open range picker"
              />
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="column" gap="400" alignItems="start">
          <Text fontWeight="700">Custom close behavior</Text>
          <Stack direction="row" gap="600" alignItems="start">
            <Stack
              direction="column"
              gap="200"
              flex="1"
              minWidth="320px"
              align="start"
            >
              <Text fontSize="sm" color="neutral.11">
                Calendar stays open after selecting a date range
              </Text>
            </Stack>
            <Stack direction="column" gap="200" flex="1">
              <DateRangePicker
                {...args}
                isOpen={isOpen2}
                onOpenChange={setIsOpen2}
                shouldCloseOnSelect={false}
                aria-label="Custom close behavior range picker"
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  },
};
