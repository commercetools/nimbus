import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./date-picker";
import { I18nProvider } from "react-aria";
import { Button, Stack, FormField, Text } from "@/components";
import { useState } from "react";
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  getLocalTimeZone,
} from "@internationalized/date";
import type { DateValue } from "react-aria";
import { userEvent, within, expect, waitFor } from "@storybook/test";

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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Renders with proper DatePicker structure and accessibility",
      async () => {
        // DatePicker should have a group container with proper aria-label
        const dateGroup = canvas.getByRole("group", { name: "Select a date" });
        await expect(dateGroup).toBeInTheDocument();
        await expect(dateGroup).toHaveAttribute("aria-label", "Select a date");

        // Should contain date input segments (React Aria uses segmented date input)
        const dateSegments = canvas.getAllByRole("spinbutton");

        // Should have at least month, day, year segments for basic date input
        await expect(dateSegments.length).toBeGreaterThanOrEqual(3);

        // Should have calendar toggle button
        const calendarButton = canvas.getByRole("button", {
          name: /calendar/i,
        });
        await expect(calendarButton).toBeInTheDocument();
      }
    );

    await step("Date segments are focusable and navigable", async () => {
      const dateSegments = canvas.getAllByRole("spinbutton");

      // First segment should be focusable with Tab
      await userEvent.tab();
      await expect(dateSegments[0]).toHaveFocus();

      // Should be able to navigate between segments with arrow keys
      await userEvent.keyboard("{ArrowRight}");
      if (dateSegments.length > 1) {
        await expect(dateSegments[1]).toHaveFocus();
      }

      // Should be able to navigate to calendar button eventually
      await userEvent.tab();
      await userEvent.tab(); // May need multiple tabs depending on segments
      const calendarButton = canvas.getByRole("button", { name: /calendar/i });
      // Check if calendar button has focus or if we need more tabs
      if (!calendarButton.matches(":focus")) {
        await userEvent.tab();
      }
      await expect(calendarButton).toHaveFocus();
    });

    await step("Date segments accept keyboard input", async () => {
      const dateSegments = canvas.getAllByRole("spinbutton");
      const firstSegment = dateSegments[0];

      // Focus first segment and type a value
      await userEvent.click(firstSegment);
      await userEvent.keyboard("12");

      // Segment should have the typed value
      await expect(firstSegment).toHaveAttribute("aria-valuenow", "12");

      // Clear segments for next tests by selecting all and deleting
      for (const segment of dateSegments) {
        await userEvent.click(segment);
        await userEvent.keyboard("{Control>}a{/Control}");
        await userEvent.keyboard("{Delete}");
      }
    });

    await step("Calendar popover opens and closes correctly", async () => {
      const calendarButton = canvas.getByRole("button", { name: /calendar/i });

      // Initially, calendar should not be visible (check in entire document since popover is portaled)
      let calendar = within(document.body).queryByRole("application");
      await expect(calendar).not.toBeInTheDocument();

      // Click calendar button to open popover
      await userEvent.click(calendarButton);

      // Wait for calendar to appear (it's rendered in a portal)
      await waitFor(async () => {
        calendar = within(document.body).queryByRole("application");
        await expect(calendar).toBeInTheDocument();
      });

      // Should be able to close with Escape key
      await userEvent.keyboard("{Escape}");

      // Wait for calendar to disappear
      await waitFor(async () => {
        calendar = within(document.body).queryByRole("application");
        await expect(calendar).not.toBeInTheDocument();
      });
    });

    await step("Clear button functionality works correctly", async () => {
      const dateSegments = canvas.getAllByRole("spinbutton");

      // Initially, clear button should be disabled (no value selected)
      const clearButton = canvas.getByRole("button", { name: /clear/i });
      await expect(clearButton).toBeDisabled();

      // Set a date value first by changing from placeholder values
      await userEvent.click(dateSegments[0]); // month
      await userEvent.keyboard("1");
      if (dateSegments[1]) {
        await userEvent.click(dateSegments[1]); // day
        await userEvent.keyboard("15");
      }
      if (dateSegments[2]) {
        await userEvent.click(dateSegments[2]); // year
        await userEvent.keyboard("2025");
      }

      // Clear button should now be enabled (actual date was entered)
      await expect(clearButton).not.toBeDisabled();

      // Click clear button to remove values
      await userEvent.click(clearButton);

      // After clearing, segments return to placeholder state (showing current date)
      // The segments will still have values (current date placeholders) but DatePicker considers it "empty"
      // Clear button should be disabled again indicating no actual value is selected
      await expect(clearButton).toBeDisabled();
    });

    await step("Date selection from calendar works", async () => {
      const calendarButton = canvas.getByRole("button", { name: /calendar/i });

      // Open calendar
      await userEvent.click(calendarButton);

      // Wait for calendar to appear in the document
      await waitFor(async () => {
        const calendar = within(document.body).queryByRole("application");
        await expect(calendar).toBeInTheDocument();
      });

      // Find calendar grid and selectable date cells (search in document body)
      const calendarGrid = within(document.body).getByRole("grid");
      await expect(calendarGrid).toBeInTheDocument();

      // Find available date buttons (gridcell role with button inside)
      const dateCells = within(document.body).getAllByRole("gridcell");
      const availableDates = dateCells.filter((cell) => {
        const button = cell.querySelector("button");
        return button && !button.hasAttribute("aria-disabled");
      });

      if (availableDates.length > 0) {
        const dateButton = availableDates[0].querySelector("button");
        if (dateButton) {
          await userEvent.click(dateButton);

          // Calendar should close after selection (default behavior)
          await waitFor(async () => {
            const calendarAfterSelection = within(document.body).queryByRole(
              "application"
            );
            await expect(calendarAfterSelection).not.toBeInTheDocument();
          });

          // After selecting a date, clear button should be enabled indicating a value is selected
          const clearButton = canvas.getByRole("button", { name: /clear/i });
          await expect(clearButton).not.toBeDisabled();
        }
      }
    });

    await step("DatePicker has proper ARIA attributes", async () => {
      const dateGroup = canvas.getByRole("group", { name: "Select a date" });

      // Group should have proper role and label
      await expect(dateGroup).toHaveAttribute("role", "group");
      await expect(dateGroup).toHaveAttribute("aria-label", "Select a date");

      // Date segments should have proper spinbutton role and ARIA attributes
      const dateSegments = canvas.getAllByRole("spinbutton");
      for (const segment of dateSegments) {
        await expect(segment).toHaveAttribute("role", "spinbutton");
        await expect(segment).toHaveAttribute("tabindex", "0");
        // Each segment should have an aria-label describing what it represents
        const ariaLabel = segment.getAttribute("aria-label");
        await expect(ariaLabel).toBeTruthy();
      }
    });
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

        <Text>Date and hour</Text>
        <DatePicker
          {...args}
          granularity="hour"
          defaultValue={new CalendarDateTime(2025, 6, 15, 14)}
          aria-label="Date and time picker (hour)"
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
