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

    // Base helper functions
    const getDateSegments = () => canvas.getAllByRole("spinbutton");
    const getCalendarButton = () =>
      canvas.findByRole("button", { name: /calendar/i });
    const getClearButton = () =>
      canvas.findByRole("button", { name: /clear/i });

    const openCalendar = async () => {
      const calendarButton = await getCalendarButton();
      await userEvent.click(calendarButton);
      await waitFor(async () => {
        const calendar = within(document.body).queryByRole("application");
        await expect(calendar).toBeInTheDocument();
      });
    };

    const closeCalendar = async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(async () => {
        const calendar = within(document.body).queryByRole("application");
        await expect(calendar).not.toBeInTheDocument();
      });
    };

    await step(
      "Renders with proper DateRangePicker structure and ARIA attributes",
      async () => {
        // DateRangePicker should have a group container with proper aria-label
        const dateGroup = await canvas.findByRole("group", {
          name: "Select a date range",
        });
        await expect(dateGroup).toHaveAttribute(
          "aria-label",
          "Select a date range"
        );

        // Should contain 6 segments total (2 DateInputs × 3 segments each: start month/day/year + end month/day/year)
        const dateSegments = getDateSegments();
        await expect(dateSegments.length).toBeGreaterThanOrEqual(6);

        // Should have a calendar toggle button
        const calendarButton = await getCalendarButton();
        await expect(calendarButton).toBeInTheDocument();
      }
    );

    await step("Date segments are focusable and navigable", async () => {
      const dateSegments = getDateSegments();

      // First segment should be focusable with Tab
      await userEvent.tab();
      await waitFor(async () => {
        await expect(dateSegments[0]).toHaveFocus();
      });

      // Should be able to navigate between segments with arrow keys
      await userEvent.keyboard("{ArrowRight}");
      if (dateSegments.length > 1) {
        await waitFor(async () => {
          await expect(dateSegments[1]).toHaveFocus();
        });
      }

      // Should be able to navigate to calendar button
      const calendarButton = await getCalendarButton();

      // Tab through remaining segments to reach calendar button
      for (let i = 0; i < 4; i++) {
        await userEvent.tab();
      }

      // Check if calendar button has focus or if we need more tabs
      if (!calendarButton.matches(":focus")) {
        await userEvent.tab();
      }
      await waitFor(async () => {
        await expect(calendarButton).toHaveFocus();
      });
    });

    await step("Date segments accept keyboard input", async () => {
      const dateSegments = getDateSegments();
      const firstSegment = dateSegments[0];

      // Focus first segment and type a value
      await userEvent.click(firstSegment);
      await userEvent.keyboard("12");

      // Segment should have the typed value
      await waitFor(async () => {
        await expect(firstSegment).toHaveAttribute("aria-valuenow", "12");
      });

      // Clear segments for next tests by selecting all and deleting
      for (const segment of dateSegments) {
        await userEvent.click(segment);
        await userEvent.keyboard("{Delete}");
        await userEvent.keyboard("{Delete}");
      }
      //TODO: go back to check/add an assert to validate ctrlA really cleared all in DatePicker.Stories
      // Segment should be cleared and show empty state
      await waitFor(async () => {
        await expect(firstSegment).toHaveAttribute("aria-valuetext", "Empty");
      });
    });

    await step("Calendar popover opens and closes correctly", async () => {
      // Initially, calendar should not be visible (check in entire document since popover is portaled)
      let calendar = within(document.body).queryByRole("application");
      await expect(calendar).not.toBeInTheDocument();

      await openCalendar();

      await closeCalendar();
    });

    await step("Clear button functionality works correctly", async () => {
      const dateSegments = getDateSegments();

      // Initially, clear button should be disabled (no value selected)
      const clearButton = await getClearButton();
      await waitFor(async () => {
        await expect(clearButton).toBeDisabled();
      });

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
      await waitFor(async () => {
        await expect(clearButton).not.toBeDisabled();
      });

      // Click clear button to remove values
      await userEvent.click(clearButton);

      // After clearing, segments return to placeholder state (showing current date)
      // The segments will still have values (current date placeholders) but DatePicker considers it "empty"
      // Clear button should be disabled again indicating no actual value is selected
      await waitFor(async () => {
        await expect(clearButton).toBeDisabled();
      });
    });

    await step("Date selection from calendar works", async () => {
      await openCalendar();

      // Find calendar grid and selectable date cells (search in document body)
      const calendarGrid = await within(document.body).findByRole("grid");
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
          const clearButton = await getClearButton();
          await waitFor(async () => {
            await expect(clearButton).not.toBeDisabled();
          });
        }
      }
    });

    await step("Start and end date inputs work independently", async () => {
      await closeCalendar();

      const dateSegments = getDateSegments();

      // Test start date only - set May 28, 2025
      await userEvent.click(dateSegments[0]);
      await userEvent.keyboard("5");
      await userEvent.click(dateSegments[1]);
      await userEvent.keyboard("28");
      await userEvent.click(dateSegments[2]);
      await userEvent.keyboard("2025");

      // Verify start date is set correctly
      await waitFor(async () => {
        await expect(dateSegments[0]).toHaveAttribute("aria-valuenow", "5");
        await expect(dateSegments[1]).toHaveAttribute("aria-valuenow", "28");
        await expect(dateSegments[2]).toHaveAttribute("aria-valuenow", "2025");
      });

      // Verify end date segments are still in placeholder state
      await waitFor(async () => {
        await expect(dateSegments[3]).toHaveAttribute(
          "aria-valuetext",
          "Empty"
        );
        await expect(dateSegments[4]).toHaveAttribute(
          "aria-valuetext",
          "Empty"
        );
        await expect(dateSegments[5]).toHaveAttribute(
          "aria-valuetext",
          "Empty"
        );
      });

      // Test end date only - set December 25, 2025
      await userEvent.click(dateSegments[3]); // end month
      await userEvent.keyboard("12");
      await userEvent.click(dateSegments[4]); // end day
      await userEvent.keyboard("25");
      await userEvent.click(dateSegments[5]); // end year
      await userEvent.keyboard("2025");

      // Verify both start and end dates are set correctly
      await waitFor(async () => {
        // Start date should remain unchanged
        await expect(dateSegments[0]).toHaveAttribute("aria-valuenow", "5");
        await expect(dateSegments[1]).toHaveAttribute("aria-valuenow", "28");
        await expect(dateSegments[2]).toHaveAttribute("aria-valuenow", "2025");

        // End date should be set to new values
        await expect(dateSegments[3]).toHaveAttribute("aria-valuenow", "12");
        await expect(dateSegments[4]).toHaveAttribute("aria-valuenow", "25");
        await expect(dateSegments[5]).toHaveAttribute("aria-valuenow", "2025");
      });

      // Verify clear button is enabled since we have a complete range
      const clearButton = await getClearButton();
      await waitFor(async () => {
        await expect(clearButton).not.toBeDisabled();
      });
    });
  },
};

// export const Uncontrolled: Story = {
//   args: {
//     ["aria-label"]: "Select a date range",
//   },
//   render: (args) => {
//     return (
//       <Stack direction="column" gap="400" alignItems="start">
//         <Text>With defaultValue (2025-01-15 to 2025-01-20)</Text>
//         <DateRangePicker
//           {...args}
//           defaultValue={{
//             start: new CalendarDate(2025, 1, 15),
//             end: new CalendarDate(2025, 1, 20),
//           }}
//           aria-label="With default value"
//         />
//         <Text>No defaultValue (empty)</Text>
//         <DateRangePicker {...args} aria-label="Without default value" />
//       </Stack>
//     );
//   },
// };

// export const Controlled: Story = {
//   args: {
//     ["aria-label"]: "Select a date range",
//   },
//   render: (args) => {
//     const [range, setRange] = useState<{
//       start: DateValue;
//       end: DateValue;
//     } | null>({
//       start: new CalendarDate(2025, 6, 15),
//       end: new CalendarDate(2025, 6, 20),
//     });

//     return (
//       <Stack direction="column" gap="400" alignItems="start">
//         <Text>
//           Controlled DateRangePicker (
//           <span>
//             current value:{" "}
//             {range
//               ? `${range.start.toString()} to ${range.end.toString()}`
//               : "null"}
//           </span>
//           )
//         </Text>
//         <DateRangePicker
//           {...args}
//           value={range}
//           onChange={setRange}
//           aria-label="Controlled date range picker"
//         />
//         <Button onPress={() => setRange(null)}>Reset</Button>
//       </Stack>
//     );
//   },
// };

// export const PlaceholderValue: Story = {
//   args: {
//     ["aria-label"]: "Select a date range",
//   },
//   render: (args) => {
//     return (
//       <Stack direction="column" gap="400" alignItems="start">
//         <Text>With placeholder value (2025-06-15 to 2025-06-20)</Text>
//         <DateRangePicker
//           {...args}
//           placeholderValue={{
//             start: new CalendarDate(2025, 6, 15),
//             end: new CalendarDate(2025, 6, 20),
//           }}
//           aria-label="Date range picker with placeholder"
//         />
//         <Text>Without placeholder value</Text>
//         <DateRangePicker
//           {...args}
//           aria-label="Date range picker without placeholder"
//         />
//       </Stack>
//     );
//   },
// };

// export const VariantsSizesAndStates: Story = {
//   args: {
//     ["aria-label"]: "Select a date range",
//   },
//   render: (args) => {
//     const states = [
//       { label: "Default", props: {} },
//       { label: "Disabled", props: { isDisabled: true } },
//       { label: "Read Only", props: { isReadOnly: true } },
//       { label: "Required", props: { isRequired: true } },
//       { label: "Invalid", props: { isInvalid: true } },
//     ];

//     const variants = ["solid", "ghost"] as const;

//     return (
//       <Stack direction="column" gap="600" alignItems="start">
//         {states.map((state) => (
//           <Stack
//             key={state.label}
//             direction="column"
//             gap="200"
//             alignItems="start"
//           >
//             <Stack direction="column" gap="400" alignItems="start">
//               <Text fontWeight="700">{state.label}</Text>
//               {variants.map((variant) => (
//                 <Stack
//                   key={variant}
//                   direction="column"
//                   gap="200"
//                   alignItems="start"
//                 >
//                   <Text
//                     fontSize="sm"
//                     color="neutral.11"
//                     textTransform="capitalize"
//                   >
//                     {variant}
//                   </Text>
//                   <DateRangePicker
//                     {...args}
//                     {...state.props}
//                     variant={variant}
//                     defaultValue={{
//                       start: new CalendarDate(2025, 6, 15),
//                       end: new CalendarDate(2025, 6, 20),
//                     }}
//                     aria-label={`${state.label} ${variant} date range picker`}
//                   />
//                 </Stack>
//               ))}
//             </Stack>
//           </Stack>
//         ))}
//       </Stack>
//     );
//   },
// };

// export const TimeSupport: Story = {
//   args: {
//     ["aria-label"]: "Select a date and time range",
//   },
//   render: (args) => {
//     return (
//       <Stack direction="column" gap="400" alignItems="start">
//         <Text>Date only (day granularity)</Text>
//         <DateRangePicker
//           {...args}
//           granularity="day"
//           defaultValue={{
//             start: new CalendarDate(2025, 6, 15),
//             end: new CalendarDate(2025, 6, 20),
//           }}
//           aria-label="Date only range picker"
//         />

//         <Text>Date and time to minute</Text>
//         <DateRangePicker
//           {...args}
//           granularity="minute"
//           defaultValue={{
//             start: new CalendarDateTime(2025, 6, 15, 14, 30),
//             end: new CalendarDateTime(2025, 6, 20, 16, 45),
//           }}
//           aria-label="Date and time range picker (minute)"
//         />

//         <Text>With time zone</Text>
//         <DateRangePicker
//           {...args}
//           granularity="minute"
//           defaultValue={{
//             start: new ZonedDateTime(
//               2025,
//               6,
//               15,
//               "America/New_York",
//               -4 * 60 * 60 * 1000,
//               14,
//               30
//             ),
//             end: new ZonedDateTime(
//               2025,
//               6,
//               20,
//               "America/New_York",
//               -4 * 60 * 60 * 1000,
//               16,
//               45
//             ),
//           }}
//           aria-label="Date and time range picker with timezone"
//         />
//       </Stack>
//     );
//   },
// };

// export const HourCycle: Story = {
//   args: {
//     ["aria-label"]: "Select a date and time range",
//   },
//   render: (args) => {
//     return (
//       <Stack direction="column" gap="400" alignItems="start">
//         <Text>12-hour format (default for en-US)</Text>
//         <DateRangePicker
//           {...args}
//           granularity="minute"
//           hourCycle={12}
//           defaultValue={{
//             start: new CalendarDateTime(2025, 6, 15, 14, 30),
//             end: new CalendarDateTime(2025, 6, 20, 16, 45),
//           }}
//           aria-label="12-hour format range picker"
//         />

//         <Text>24-hour format</Text>
//         <DateRangePicker
//           {...args}
//           granularity="minute"
//           hourCycle={24}
//           defaultValue={{
//             start: new CalendarDateTime(2025, 6, 15, 14, 30),
//             end: new CalendarDateTime(2025, 6, 20, 16, 45),
//           }}
//           aria-label="24-hour format range picker"
//         />
//       </Stack>
//     );
//   },
// };

// export const HideTimeZone: Story = {
//   args: {
//     ["aria-label"]: "Select a date and time range",
//   },
//   render: (args) => {
//     const zonedDateTimeRange = {
//       start: new ZonedDateTime(
//         2025,
//         6,
//         15,
//         "America/New_York",
//         -4 * (60 * 60 * 1000),
//         14,
//         30
//       ),
//       end: new ZonedDateTime(
//         2025,
//         6,
//         20,
//         "America/New_York",
//         -4 * (60 * 60 * 1000),
//         16,
//         45
//       ),
//     };

//     return (
//       <Stack direction="column" gap="400" alignItems="start">
//         <Text>With time zone shown (default)</Text>
//         <DateRangePicker
//           {...args}
//           granularity="minute"
//           defaultValue={zonedDateTimeRange}
//           aria-label="With timezone shown"
//         />

//         <Text>With time zone hidden</Text>
//         <DateRangePicker
//           {...args}
//           granularity="minute"
//           hideTimeZone
//           defaultValue={zonedDateTimeRange}
//           aria-label="With timezone hidden"
//         />
//       </Stack>
//     );
//   },
// };

// export const MinMaxValues: Story = {
//   args: {
//     ["aria-label"]: "Select a date range",
//   },
//   render: (args) => {
//     const today = new CalendarDate(2025, 6, 15);
//     const minDate = today.add({ days: 1 });
//     const maxDate = today.add({ days: 30 });

//     return (
//       <Stack direction="column" gap="400" alignItems="start">
//         <Text>
//           Restricted range: {minDate.toString()} to {maxDate.toString()}
//         </Text>
//         <DateRangePicker
//           {...args}
//           minValue={minDate}
//           maxValue={maxDate}
//           defaultValue={{
//             start: today.add({ days: 7 }),
//             end: today.add({ days: 12 }),
//           }}
//           aria-label="Date range picker with min/max values"
//         />
//         <Text fontSize="sm" color="neutral.11">
//           Try selecting dates outside the allowed range in the calendar.
//         </Text>
//       </Stack>
//     );
//   },
// };

// export const UnavailableDates: Story = {
//   args: {
//     ["aria-label"]: "Select a date range",
//   },
//   render: (args) => {
//     const isOddDay = (date: DateValue) => {
//       return date.day % 2 === 1;
//     };

//     return (
//       <Stack direction="column" gap="400" alignItems="start">
//         <Text>Dr. Orderly only accepts appointments on even days:</Text>
//         <DateRangePicker
//           {...args}
//           isDateUnavailable={isOddDay}
//           defaultValue={{
//             start: new CalendarDate(2025, 6, 16),
//             end: new CalendarDate(2025, 6, 20),
//           }}
//           aria-label="Even days only range picker"
//         />
//         <Text fontSize="sm" color="neutral.11">
//           (Odd-numbered days are marked as unavailable and cannot be selected.)
//         </Text>
//       </Stack>
//     );
//   },
// };

// export const NonContiguousRanges: Story = {
//   args: {
//     ["aria-label"]: "Select a date range",
//   },
//   render: (args) => {
//     return (
//       <Stack direction="column" gap="400" alignItems="start">
//         <Text>Allow selection of ranges that contain unavailable dates:</Text>
//         <DateRangePicker
//           {...args}
//           allowsNonContiguousRanges={true}
//           defaultValue={{
//             start: new CalendarDate(2025, 6, 10),
//             end: new CalendarDate(2025, 6, 25),
//           }}
//           isDateUnavailable={(date: DateValue) => {
//             const dateObj = date.toDate("UTC");
//             const dayOfWeek = dateObj.getDay();
//             return dayOfWeek === 1; // Block Mondays
//           }}
//           aria-label="Non-contiguous range picker"
//         />
//         <Text fontSize="sm" color="neutral.11">
//           Select ranges that include unavailable dates (Mondays are blocked).
//         </Text>
//       </Stack>
//     );
//   },
// };

// export const CustomWidth: Story = {
//   args: {
//     ["aria-label"]: "Select a date range",
//   },
//   render: (args) => {
//     return (
//       <Stack direction="column" gap="400" alignItems="start">
//         <Text>Width: 400px</Text>
//         <DateRangePicker {...args} width="400px" />

//         <Text>Width: 600px</Text>
//         <DateRangePicker {...args} width="600px" />

//         <Text>Width: full</Text>
//         <DateRangePicker {...args} width="full" />
//       </Stack>
//     );
//   },
// };

// export const MultipleLocales: Story = {
//   args: {
//     ["aria-label"]: "Select a date range",
//   },
//   render: (args) => {
//     return (
//       <Stack direction="column" gap="600" alignItems="start">
//         <Stack direction="column" gap="200" alignItems="start">
//           <Text fontWeight="700">English (US) - 12-hour format</Text>
//           <I18nProvider locale="en-US">
//             <DateRangePicker
//               {...args}
//               granularity="minute"
//               defaultValue={{
//                 start: new CalendarDateTime(2025, 6, 15, 14, 30),
//                 end: new CalendarDateTime(2025, 6, 20, 16, 45),
//               }}
//               aria-label="US English range picker"
//             />
//           </I18nProvider>
//         </Stack>

//         <Stack direction="column" gap="200" alignItems="start">
//           <Text fontWeight="700">German (DE) - 24-hour format</Text>
//           <I18nProvider locale="de-DE">
//             <DateRangePicker
//               {...args}
//               granularity="minute"
//               defaultValue={{
//                 start: new CalendarDateTime(2025, 6, 15, 14, 30),
//                 end: new CalendarDateTime(2025, 6, 20, 16, 45),
//               }}
//               aria-label="German range picker"
//             />
//           </I18nProvider>
//         </Stack>

//         <Stack direction="column" gap="200" alignItems="start">
//           <Text fontWeight="700">Spanish (ES) - Different date format</Text>
//           <I18nProvider locale="es-ES">
//             <DateRangePicker
//               {...args}
//               granularity="minute"
//               defaultValue={{
//                 start: new CalendarDateTime(2025, 6, 15, 14, 30),
//                 end: new CalendarDateTime(2025, 6, 20, 16, 45),
//               }}
//               aria-label="Spanish range picker"
//             />
//           </I18nProvider>
//         </Stack>
//       </Stack>
//     );
//   },
// };

// export const InFormFieldContext: Story = {
//   args: {
//     ["aria-label"]: "Select a date range",
//   },
//   render: (args) => {
//     return (
//       <Stack direction="column" gap="400" alignItems="start">
//         <FormField.Root isRequired>
//           <FormField.Label>Event Date Range</FormField.Label>
//           <FormField.Input>
//             <DateRangePicker {...args} width="full" />
//           </FormField.Input>
//           <FormField.Description>
//             Select the start and end dates for your event
//           </FormField.Description>
//         </FormField.Root>

//         <FormField.Root isInvalid>
//           <FormField.Label>Deadline Range</FormField.Label>
//           <FormField.Input>
//             <DateRangePicker {...args} width="full" />
//           </FormField.Input>
//           <FormField.Description>
//             Choose a deadline range for the project
//           </FormField.Description>
//           <FormField.Error>
//             Please select a valid date range in the future
//           </FormField.Error>
//         </FormField.Root>

//         <FormField.Root>
//           <FormField.Label>Meeting Time Range</FormField.Label>
//           <FormField.Input>
//             <DateRangePicker {...args} granularity="minute" width="full" />
//           </FormField.Input>
//           <FormField.Description>
//             Select the exact start and end times for the meeting
//           </FormField.Description>
//           <FormField.InfoBox>
//             This date range picker supports minute-level precision. Use the
//             calendar to select dates and the time fields to set the exact times.
//           </FormField.InfoBox>
//         </FormField.Root>
//       </Stack>
//     );
//   },
// };

// export const PopoverBehavior: Story = {
//   args: {
//     ["aria-label"]: "Select a date range",
//   },
//   render: (args) => {
//     const [isOpen1, setIsOpen1] = useState(false);
//     const [isOpen2, setIsOpen2] = useState(false);

//     return (
//       <Stack direction="column" gap="600" alignItems="start">
//         <Stack direction="column" gap="400" alignItems="start">
//           <Text fontWeight="700">Controlled popover state</Text>
//           <Stack direction="row" gap="600" alignItems="start">
//             <Stack
//               direction="column"
//               gap="200"
//               flex="1"
//               minWidth="320px"
//               align="flex-start"
//             >
//               <Button onPress={() => setIsOpen1(true)}>Open Calendar</Button>
//             </Stack>
//             <Stack direction="column" gap="200" flex="1">
//               <DateRangePicker
//                 {...args}
//                 isOpen={isOpen1}
//                 onOpenChange={setIsOpen1}
//                 aria-label="Controlled popover range picker"
//               />
//             </Stack>
//           </Stack>
//         </Stack>

//         <Stack direction="column" gap="400" alignItems="start">
//           <Text fontWeight="700">Default open popover</Text>
//           <Stack direction="row" gap="600" alignItems="start">
//             <Stack direction="column" gap="200" flex="1" minWidth="320px">
//               <Text fontSize="sm" color="neutral.11">
//                 Calendar opens by default
//               </Text>
//             </Stack>
//             <Stack direction="column" gap="200" flex="1">
//               <DateRangePicker
//                 {...args}
//                 defaultOpen
//                 aria-label="Default open range picker"
//               />
//             </Stack>
//           </Stack>
//         </Stack>

//         <Stack direction="column" gap="400" alignItems="start">
//           <Text fontWeight="700">Custom close behavior</Text>
//           <Stack direction="row" gap="600" alignItems="start">
//             <Stack
//               direction="column"
//               gap="200"
//               flex="1"
//               minWidth="320px"
//               align="start"
//             >
//               <Text fontSize="sm" color="neutral.11">
//                 Calendar stays open after selecting a date range
//               </Text>
//             </Stack>
//             <Stack direction="column" gap="200" flex="1">
//               <DateRangePicker
//                 {...args}
//                 isOpen={isOpen2}
//                 onOpenChange={setIsOpen2}
//                 shouldCloseOnSelect={false}
//                 aria-label="Custom close behavior range picker"
//               />
//             </Stack>
//           </Stack>
//         </Stack>
//       </Stack>
//     );
//   },
// };
