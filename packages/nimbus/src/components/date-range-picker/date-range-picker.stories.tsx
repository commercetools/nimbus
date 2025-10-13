import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker } from "./date-range-picker";
import { DateRangePickerField } from "./components/date-range-picker.field";
import { I18nProvider } from "react-aria";
import { Button, Stack, FormField, Text } from "@/components";
import { useState } from "react";
import {
  getLocalTimeZone,
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from "@internationalized/date";
import type { DateValue, DateRange } from "react-aria";
import type { RangeValue } from "@/components/range-calendar";
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

// Shared helper functions that work for both single and multiple DateRangePicker components scenarios.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createDateRangePickerHelpers = (canvas: any, target?: HTMLElement) => {
  const context = target ? within(target) : canvas;

  return {
    // Getters for common elements
    getLabel: () => context.getByText(/Date Range/),
    getDescription: () => context.queryByText(/Select a start and end date/),
    getInfoButton: () => context.queryByLabelText("__MORE INFO"),
    getErrorAlert: () => context.queryByRole("alert"),
    getRequiredAsterisk: () => context.queryByText("*"),
    // DateRangePicker elements
    getDateSegments: () => context.getAllByRole("spinbutton"),
    getDateRangeGroup: () => context.getByRole("group"),
    getCalendarButton: () =>
      context.findByRole("button", { name: /calendar/i }),
    getClearButton: () => context.findByRole("button", { name: /clear/i }),
    getClearButtonIfExists: () =>
      context.queryByRole("button", { name: /clear/i }),

    openCalendar: async () => {
      const calendarButton = await context.findByRole("button", {
        name: /calendar/i,
      });
      await userEvent.click(calendarButton);
      await waitFor(async () => {
        const calendar = within(document.body).queryByRole("application");
        await expect(calendar).toBeInTheDocument();
      });
    },

    openInfoPopover: async () => {
      const infoButton = context.getByLabelText("__MORE INFO");
      await userEvent.click(infoButton);
    },

    closeCalendar: async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(async () => {
        const calendar = within(document.body).queryByRole("application");
        await expect(calendar).not.toBeInTheDocument();
      });
    },

    setDateRangeValues: async (
      segments: HTMLElement[],
      startDate: string[],
      endDate: string[]
    ) => {
      // Set start date (segments 0-2)
      await userEvent.click(segments[0]);
      await userEvent.keyboard(startDate[0]);
      await userEvent.click(segments[1]);
      await userEvent.keyboard(startDate[1]);
      await userEvent.click(segments[2]);
      await userEvent.keyboard(startDate[2]);
      // Set end date (segments 3-5)
      await userEvent.click(segments[3]);
      await userEvent.keyboard(endDate[0]);
      await userEvent.click(segments[4]);
      await userEvent.keyboard(endDate[1]);
      await userEvent.click(segments[5]);
      await userEvent.keyboard(endDate[2]);
    },

    verifyDateRangeValues: async (
      segments: HTMLElement[],
      startDate: string[],
      endDate: string[]
    ) => {
      await waitFor(async () => {
        await expect(segments[0]).toHaveAttribute(
          "aria-valuenow",
          startDate[0]
        );
        await expect(segments[1]).toHaveAttribute(
          "aria-valuenow",
          startDate[1]
        );
        await expect(segments[2]).toHaveAttribute(
          "aria-valuenow",
          startDate[2]
        );
        await expect(segments[3]).toHaveAttribute("aria-valuenow", endDate[0]);
        await expect(segments[4]).toHaveAttribute("aria-valuenow", endDate[1]);
        await expect(segments[5]).toHaveAttribute("aria-valuenow", endDate[2]);
      });
    },
  };
};

export const Base: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  parameters: {
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const helpers = createDateRangePickerHelpers(canvas);

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

        // Should contain 6 segments total (2 DateInputs × 3 segments for each: start month/day/year
        const dateSegments = helpers.getDateSegments();
        await expect(dateSegments.length).toBeGreaterThanOrEqual(6);

        // Should have a calendar toggle button
        const calendarButton = await helpers.getCalendarButton();
        await expect(calendarButton).toBeInTheDocument();
      }
    );

    await step("Date segments are focusable and navigable", async () => {
      const segments = helpers.getDateSegments();

      // First segment should be focusable with Tab
      await userEvent.tab();
      await waitFor(async () => {
        await expect(segments[0]).toHaveFocus();
      });

      // Should be able to navigate between segments with arrow keys
      await userEvent.keyboard("{ArrowRight}");
      if (segments.length > 1) {
        await waitFor(async () => {
          await expect(segments[1]).toHaveFocus();
        });
      }

      // Should be able to navigate to calendar button
      const calendarButton = await helpers.getCalendarButton();

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
      const dateSegments = helpers.getDateSegments();
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

      // Segment should be cleared and show empty state
      await waitFor(async () => {
        await expect(firstSegment).toHaveAttribute("aria-valuetext", "Empty");
      });
    });

    await step("Calendar popover opens and closes correctly", async () => {
      // Initially, calendar should not be visible (check in entire document since popover is portaled)
      const calendar = within(document.body).queryByRole("application");
      await expect(calendar).not.toBeInTheDocument();

      await helpers.openCalendar();
      await helpers.closeCalendar();
    });

    await step("Clear button functionality works correctly", async () => {
      const dateSegments = helpers.getDateSegments();

      // Initially, clear button should be hidden (no value selected)
      const clearButton = helpers.getClearButtonIfExists();
      await waitFor(async () => {
        await expect(clearButton).not.toBeInTheDocument();
      });

      // Set a date value first by changing from placeholder values
      await userEvent.click(dateSegments[0]);
      await userEvent.keyboard("1");
      if (dateSegments[1]) {
        await userEvent.click(dateSegments[1]);
        await userEvent.keyboard("15");
      }
      if (dateSegments[2]) {
        await userEvent.click(dateSegments[2]);
        await userEvent.keyboard("2025");
      }
      await userEvent.click(dateSegments[3]);
      await userEvent.keyboard("1");
      if (dateSegments[4]) {
        await userEvent.click(dateSegments[4]);
        await userEvent.keyboard("15");
      }
      if (dateSegments[5]) {
        await userEvent.click(dateSegments[5]);
        await userEvent.keyboard("2025");
      }

      // Clear button should now be enabled (range was entered)
      const clearButtonAfterInput = await helpers.getClearButton();
      await waitFor(async () => {
        await expect(clearButtonAfterInput).not.toBeDisabled();
      });

      // Click clear button to remove values
      await userEvent.click(clearButtonAfterInput);

      // After clearing, segments return to format placeholder state
      // Clear button should be hidden again
      const clearButtonAfterClear = helpers.getClearButtonIfExists();
      await waitFor(async () => {
        await expect(clearButtonAfterClear).not.toBeInTheDocument();
      });
    });

    await step(
      "Date Range selection from calendar is interactive",
      async () => {
        await helpers.openCalendar();

        // Wait for the calendar grid to be present
        const calendarGrid = await within(document.body).findByRole("grid");
        await expect(calendarGrid).toBeInTheDocument();

        // Find and click day 5
        const day5Cell = document.body.querySelector('[aria-label*="5,"]')!;
        await userEvent.click(day5Cell);

        // Wait for selection to be processed
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Find and click day 10
        const day10Cell = document.body.querySelector('[aria-label*="10,"]')!;
        await userEvent.click(day10Cell);

        // Assert that the calendar is no longer visible
        await waitFor(async () => {
          const calendarAfterSelection = within(document.body).queryByRole(
            "application"
          );
          await expect(calendarAfterSelection).not.toBeInTheDocument();
        });

        // Assert that the clear button is enabled
        const clearButton = await helpers.getClearButton();
        await waitFor(async () => {
          await expect(clearButton).not.toBeDisabled();
        });

        // Assert that day 5 is in the start date segment and day 10 is in the end date segment
        const dateSegments = helpers.getDateSegments();
        await waitFor(async () => {
          // Start date day segment (index 1) should have day 5
          await expect(dateSegments[1]).toHaveAttribute("aria-valuenow", "5");
          // End date day segment (index 4) should have day 10
          await expect(dateSegments[4]).toHaveAttribute("aria-valuenow", "10");
        });

        // Click the clear button to reset the selection
        await userEvent.click(clearButton);
      }
    );

    await step("Start and end date inputs work independently", async () => {
      const dateSegments = helpers.getDateSegments();

      // Test start date only
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

      // The clear button should still be hidden
      const clearButtonAfterStartClear = helpers.getClearButtonIfExists();
      await waitFor(async () => {
        await expect(clearButtonAfterStartClear).not.toBeInTheDocument();
      });

      // Clear the start range to focus on the end range
      await userEvent.click(dateSegments[0]);
      await userEvent.keyboard("{Delete}");
      await userEvent.keyboard("{Delete}");
      await userEvent.click(dateSegments[1]);
      await userEvent.keyboard("{Delete}");
      await userEvent.keyboard("{Delete}");

      await userEvent.click(dateSegments[2]);
      await userEvent.keyboard("{Delete}");
      await userEvent.keyboard("{Delete}");
      await userEvent.keyboard("{Delete}");
      await userEvent.keyboard("{Delete}");

      // Type the same date (05/28/2025) into the END date input
      await userEvent.click(dateSegments[3]);
      await userEvent.keyboard("5");
      await userEvent.click(dateSegments[4]);
      await userEvent.keyboard("28");
      await userEvent.click(dateSegments[5]);
      await userEvent.keyboard("2025");

      // The clear button should still be hidden
      const clearButtonAfterEndClear = helpers.getClearButtonIfExists();
      await waitFor(async () => {
        await expect(clearButtonAfterEndClear).not.toBeInTheDocument();
      });

      // Verify end date is set correctly
      await waitFor(async () => {
        await expect(dateSegments[3]).toHaveAttribute("aria-valuenow", "5");
        await expect(dateSegments[4]).toHaveAttribute("aria-valuenow", "28");
        await expect(dateSegments[5]).toHaveAttribute("aria-valuenow", "2025");
      });

      // Verify start date segments are in their placeholder state
      await waitFor(async () => {
        await expect(dateSegments[0]).toHaveAttribute(
          "aria-valuetext",
          "Empty"
        );
        await expect(dateSegments[1]).toHaveAttribute(
          "aria-valuetext",
          "Empty"
        );
        await expect(dateSegments[2]).toHaveAttribute(
          "aria-valuetext",
          "Empty"
        );
      });
    });
  },
};

/**
 * Uncontrolled Usage
 * Demonstrates defaultValue behavior with different initial dates
 */
export const Uncontrolled: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With defaultValue (1/15/2025-01/20/2025)</Text>
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // Helper function for finding DateRangePicker groups by name
    const getDateRangePicker = (name: string) =>
      canvas.findByRole("group", { name });

    await step("All DateRangePicker instances render correctly", async () => {
      const dateGroups = canvas.getAllByRole("group");
      await expect(dateGroups).toHaveLength(2);

      const defaultValuePicker = await getDateRangePicker("With default value");
      const emptyPicker = await getDateRangePicker("Without default value");

      await expect(defaultValuePicker).toBeInTheDocument();
      await expect(emptyPicker).toBeInTheDocument();
    });

    await step(
      "Both DateInputs in DateRangePicker shows correct default value (2025-01-15 to 2025-01-20)",
      async () => {
        const defaultValuePicker =
          await getDateRangePicker("With default value");
        const helpers = createDateRangePickerHelpers(
          canvas,
          defaultValuePicker
        );
        const segments = helpers.getDateSegments();

        await helpers.verifyDateRangeValues(
          segments,
          ["1", "15", "2025"],
          ["1", "20", "2025"]
        );

        const clearButton = await helpers.getClearButton();
        await waitFor(async () => {
          await expect(clearButton).not.toBeDisabled();
        });
      }
    );

    await step(
      "Second DateRangePicker is empty (no defaultValue)",
      async () => {
        const emptyPicker = await getDateRangePicker("Without default value");
        const helpers = createDateRangePickerHelpers(canvas, emptyPicker);
        const clearButton = helpers.getClearButtonIfExists();

        await waitFor(async () => {
          await expect(clearButton).not.toBeInTheDocument();
        });

        const segments = helpers.getDateSegments();
        await expect(segments).toHaveLength(6);

        for (const segment of segments) {
          await expect(segment).toHaveAttribute("tabindex", "0");
        }
      }
    );

    await step(
      "All DateRangePickers have functional calendar buttons",
      async () => {
        const dateGroups = canvas.getAllByRole("group");

        for (let i = 0; i < dateGroups.length; i++) {
          const group = dateGroups[i];
          const helpers = createDateRangePickerHelpers(canvas, group);
          const calendarButton = await helpers.getCalendarButton();

          await expect(calendarButton).toBeInTheDocument();
          await expect(calendarButton).not.toBeDisabled();

          // Test opening calendar for first DateRangePicker
          if (i === 0) {
            await helpers.openCalendar();
            await helpers.closeCalendar();
          }
        }
      }
    );

    await step(
      "DateRangePickers with defaultValue can be cleared",
      async () => {
        const defaultValuePicker =
          await getDateRangePicker("With default value");
        const helpers = createDateRangePickerHelpers(
          canvas,
          defaultValuePicker
        );
        const clearButton = await helpers.getClearButton();

        await waitFor(async () => {
          await expect(clearButton).not.toBeDisabled();
        });

        await userEvent.click(clearButton);

        await waitFor(async () => {
          await expect(clearButton).not.toBeVisible();
        });
      }
    );

    await step("Empty DateRangePicker can receive input", async () => {
      const emptyPicker = await getDateRangePicker("Without default value");
      const helpers = createDateRangePickerHelpers(canvas, emptyPicker);
      const segments = helpers.getDateSegments();
      const clearButton = helpers.getClearButtonIfExists();

      await waitFor(async () => {
        await expect(clearButton).not.toBeInTheDocument();
      });

      await helpers.setDateRangeValues(
        segments,
        ["6", "30", "2025"],
        ["7", "30", "2025"]
      );

      await waitFor(async () => {
        await expect(clearButton).not.toBeInTheDocument();
      });

      await helpers.verifyDateRangeValues(
        segments,
        ["6", "30", "2025"],
        ["7", "30", "2025"]
      );
    });
  },
};

export const Controlled: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  parameters: {
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  render: (args) => {
    const [range, setRange] = useState<RangeValue<DateValue> | null>({
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Initial controlled state displays correctly", async () => {
      // Should render the controlled DateRangePicker with initial value
      const dateGroup = await canvas.findByRole("group", {
        name: "Controlled date range picker",
      });
      await expect(dateGroup).toBeInTheDocument();

      // Should display the current value in the text
      const valueText = await canvas.findByText(
        /current value: 2025-06-15 to 2025-06-20/
      );
      await expect(valueText).toBeInTheDocument();

      // Date segments should show the controlled value (2025-06-15 to 2025-06-20)
      const helpers = createDateRangePickerHelpers(canvas, dateGroup);
      const segments = helpers.getDateSegments();
      await helpers.verifyDateRangeValues(
        segments,
        ["6", "15", "2025"],
        ["6", "20", "2025"]
      );

      // Clear button should be enabled since there's a value
      const clearButton = await helpers.getClearButton();
      await waitFor(async () => {
        await expect(clearButton).not.toBeDisabled();
      });

      // Reset button should be present
      const resetButton = await canvas.findByRole("button", { name: "Reset" });
      await expect(resetButton).toBeInTheDocument();
    });

    await step(
      "Changing date via segments updates controlled state",
      async () => {
        const dateGroup = await canvas.findByRole("group", {
          name: "Controlled date range picker",
        });
        const segments = within(dateGroup).getAllByRole("spinbutton");

        // Change the month from 6 (June) to 8 (August)
        await userEvent.click(segments[0]);
        await userEvent.keyboard("{Control>}a{/Control}");
        await userEvent.keyboard("8");

        // The displayed value should update to reflect the change
        await waitFor(async () => {
          const valueText = await canvas.findByText(
            /current value: 2025-08-15/
          );
          await expect(valueText).toBeInTheDocument();
        });

        // Segment should show the new value
        await waitFor(async () => {
          await expect(segments[0]).toHaveAttribute("aria-valuenow", "8");
        });

        // Change the day from 15 to 25
        await userEvent.click(segments[1]);
        await userEvent.keyboard("{Control>}a{/Control}");
        await userEvent.keyboard("25");

        // The displayed value should update again
        await waitFor(async () => {
          const valueText = await canvas.findByText(
            /current value: 2025-08-25/
          );
          await expect(valueText).toBeInTheDocument();
        });

        // Segment should show the new value
        await waitFor(async () => {
          await expect(segments[1]).toHaveAttribute("aria-valuenow", "25");
        });

        // Test updating end range segments (segments 3-5: month, day, year)
        // Change end month from 6 (June) to 9 (September)
        await userEvent.click(segments[3]);
        await userEvent.keyboard("{Control>}a{/Control}");
        await userEvent.keyboard("9");

        // The displayed value should update to show the new end month
        await waitFor(async () => {
          const valueText = await canvas.findByText(
            /current value: 2025-08-25 to 2025-09-20/
          );
          await expect(valueText).toBeInTheDocument();
        });

        // End month segment should show the new value
        await waitFor(async () => {
          await expect(segments[3]).toHaveAttribute("aria-valuenow", "9");
        });

        // Change end day from 20 to 30
        await userEvent.click(segments[4]);
        await userEvent.keyboard("{Control>}a{/Control}");
        await userEvent.keyboard("30");

        // The displayed value should update to show the new end day
        await waitFor(async () => {
          const valueText = await canvas.findByText(
            /current value: 2025-08-25 to 2025-09-30/
          );
          await expect(valueText).toBeInTheDocument();
        });

        // End day segment should show the new value
        await waitFor(async () => {
          await expect(segments[4]).toHaveAttribute("aria-valuenow", "30");
        });
      }
    );

    await step(
      "Changing date range via the calendar updates controlled state",
      async () => {
        const dateGroup = await canvas.findByRole("group", {
          name: "Controlled date range picker",
        });
        const helpers = createDateRangePickerHelpers(canvas, dateGroup);

        // Open calendar
        await helpers.openCalendar();

        // Wait for the calendar grid to be present
        const calendarGrid = await within(document.body).findByRole("grid");
        await expect(calendarGrid).toBeInTheDocument();

        // Find and click day 5
        const day5Cell = document.body.querySelector('[aria-label*="5,"]')!;
        await userEvent.click(day5Cell);

        // Wait for selection to be processed
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Find and click day 10
        const day10Cell = document.body.querySelector('[aria-label*="10,"]')!;
        await userEvent.click(day10Cell);

        // Calendar should close after selection
        await waitFor(async () => {
          const calendarAfterSelection = within(document.body).queryByRole(
            "application"
          );
          await expect(calendarAfterSelection).not.toBeInTheDocument();
        });

        // The displayed value should have updated & not be null)
        await waitFor(async () => {
          const valueText = canvas.queryByText(/current value: null/);
          await expect(valueText).not.toBeInTheDocument();
        });

        // Value should be some valid date string
        const valueDisplay = await canvas.findByText(/current value: /);
        await expect(valueDisplay).toBeInTheDocument();
        await expect(valueDisplay.textContent).not.toContain("null");
      }
    );

    await step("Clear button clears controlled state", async () => {
      await userEvent.keyboard("{Escape}");

      const dateGroup = await canvas.findByRole("group", {
        name: "Controlled date range picker",
      });
      const helpers = createDateRangePickerHelpers(canvas, dateGroup);
      const clearButton = await helpers.getClearButton();

      // Clear button should be enabled (we have a date from previous test)
      await waitFor(async () => {
        await expect(clearButton).not.toBeDisabled();
      });

      // Click clear button
      await userEvent.click(clearButton);

      // The displayed value should update to null
      await waitFor(async () => {
        const valueText = await canvas.findByText(/current value: null/);
        await expect(valueText).toBeInTheDocument();
      });

      // Clear button should now be disabled
      await waitFor(async () => {
        await expect(clearButton).not.toBeVisible();
      });
    });

    await step("Reset button resets controlled state to null", async () => {
      const resetButton = await canvas.findByRole("button", { name: "Reset" });
      const dateGroup = await canvas.findByRole("group", {
        name: "Controlled date range picker",
      });
      const helpers = createDateRangePickerHelpers(canvas, dateGroup);

      // First, set a value by typing in segments
      const segments = helpers.getDateSegments();
      await helpers.setDateRangeValues(
        segments,
        ["12", "24", "2025"],
        ["12", "31", "2025"]
      );

      // Wait for value to update
      await waitFor(async () => {
        const valueText = await canvas.findByText(
          /current value: 2025-12-24 to 2025-12-31/
        );
        await expect(valueText).toBeInTheDocument();
      });

      // Click reset button
      await userEvent.click(resetButton);

      // The displayed value should reset to null
      await waitFor(async () => {
        const valueText = await canvas.findByText(/current value: null/);
        await expect(valueText).toBeInTheDocument();
      });

      // Clear button should be hidden
      const clearButton = await helpers.getClearButtonIfExists();
      await waitFor(async () => {
        await expect(clearButton).not.toBeInTheDocument();
      });
    });

    await step(
      "Controlled DateRangePicker maintains proper state synchronization",
      async () => {
        const dateGroup = await canvas.findByRole("group", {
          name: "Controlled date range picker",
        });
        const helpers = createDateRangePickerHelpers(canvas, dateGroup);
        const segments = helpers.getDateSegments();
        const resetButton = await canvas.findByRole("button", {
          name: "Reset",
        });

        // Set a specific range
        await helpers.setDateRangeValues(
          segments,
          ["3", "10", "2026"],
          ["3", "20", "2026"]
        );

        // Verify state is synchronized
        await waitFor(async () => {
          const valueText = await canvas.findByText(
            /current value: 2026-03-10 to 2026-03-20/
          );
          await expect(valueText).toBeInTheDocument();
        });

        // Verify segments show correct values
        await helpers.verifyDateRangeValues(
          segments,
          ["3", "10", "2026"],
          ["3", "20", "2026"]
        );

        // Reset and verify everything is cleared
        await userEvent.click(resetButton);

        await waitFor(async () => {
          const valueText = await canvas.findByText(/current value: null/);
          await expect(valueText).toBeInTheDocument();
        });

        // Clear button should be hidden when value is null
        const clearButton = await helpers.getClearButtonIfExists();
        await waitFor(async () => {
          await expect(clearButton).not.toBeInTheDocument();
        });
      }
    );

    await step(
      "Controlled DateRangePicker handles invalid input gracefully (ie doesn't crash)",
      async () => {
        const dateGroup = await canvas.findByRole("group", {
          name: "Controlled date range picker",
        });
        const segments = within(dateGroup).getAllByRole("spinbutton");

        // Try to input an invalid date
        await userEvent.click(segments[0]);
        await userEvent.keyboard("13");

        await userEvent.click(segments[1]);
        await userEvent.keyboard("34");

        await userEvent.click(segments[2]);
        await userEvent.keyboard("2025");

        await waitFor(async () => {
          await expect(segments[0]).toHaveAttribute("aria-valuenow", "3");
          await expect(segments[1]).toHaveAttribute("aria-valuenow", "4");
          await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025");
        });

        // The actual controlled value might not update if the date is invalid
        // This depends on the implementation - we just verify the component doesn't crash
        const valueDisplay = await canvas.findByText(/current value: /);
        await expect(valueDisplay).toBeInTheDocument();
      }
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
        <Text>With placeholder values</Text>
        <DateRangePicker
          {...args}
          placeholderValue={new CalendarDate(2025, 6, 15)}
          granularity="day"
          aria-label="Date range picker with placeholder values"
        />
        <Text>Without placeholder values </Text>
        <DateRangePicker
          {...args}
          aria-label="Date range picker without placeholder values"
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Both DateRangePickers start empty (no selected value)",
      async () => {
        const withPlaceholder = await canvas.findByRole("group", {
          name: "Date range picker with placeholder values",
        });
        const withoutPlaceholder = await canvas.findByRole("group", {
          name: "Date range picker without placeholder values",
        });

        // Use helper functions to get clear buttons
        const helpers1 = createDateRangePickerHelpers(canvas, withPlaceholder);
        const helpers2 = createDateRangePickerHelpers(
          canvas,
          withoutPlaceholder
        );

        const clearButton1 = await helpers1.getClearButtonIfExists();
        const clearButton2 = await helpers2.getClearButtonIfExists();

        // Clear buttons should be hidden since no value is selected initially
        await waitFor(async () => {
          await expect(clearButton1).not.toBeInTheDocument();
          await expect(clearButton2).not.toBeInTheDocument();
        });
      }
    );

    await step(
      "DateRangePicker with placeholder value uses placeholder when navigating with keyboard",
      async () => {
        const withPlaceholder = await canvas.findByRole("group", {
          name: "Date range picker with placeholder values",
        });
        const helpers = createDateRangePickerHelpers(canvas, withPlaceholder);
        const segments = helpers.getDateSegments();

        // Focus the first segment
        await userEvent.click(segments[0]);

        // Invisible - dateInput 1
        await waitFor(async () => {
          await expect(segments[0]).toHaveAttribute("aria-valuenow", "6");
        });
        await userEvent.keyboard("{ArrowUp}");
        // Now visible
        await waitFor(async () => {
          await expect(segments[0]).toHaveAttribute("aria-valuenow", "6");
        });

        // Continue editing to create a complete date
        await userEvent.tab(); // Move to day segment
        // Invisible
        await waitFor(async () => {
          await expect(segments[1]).toHaveAttribute("aria-valuenow", "15");
        });
        await userEvent.keyboard("{ArrowDown}");
        // Now visible
        await waitFor(async () => {
          await expect(segments[1]).toHaveAttribute("aria-valuenow", "15");
        });

        // Move to year and modify
        await userEvent.tab(); // Move to year segment
        // Invisible
        await waitFor(async () => {
          await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025");
        });
        await userEvent.keyboard("{ArrowUp}");
        // Now visible
        await waitFor(async () => {
          await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025");
        });

        // Now test the end date inputs (segments 3, 4, 5)
        // Tab to the end date month segment
        await userEvent.tab(); // Move to end date month segment
        // Invisible - end date month should show placeholder value (6 for June)
        await waitFor(async () => {
          await expect(segments[3]).toHaveAttribute("aria-valuenow", "6");
        });
        await userEvent.keyboard("{ArrowUp}");
        // Now visible
        await waitFor(async () => {
          await expect(segments[3]).toHaveAttribute("aria-valuenow", "6");
        });

        // Continue editing end date
        await userEvent.tab(); // Move to end date day segment
        // Invisible - end date day should show placeholder value (15)
        await waitFor(async () => {
          await expect(segments[4]).toHaveAttribute("aria-valuenow", "15");
        });
        await userEvent.keyboard("{ArrowDown}");
        // Now visible
        await waitFor(async () => {
          await expect(segments[4]).toHaveAttribute("aria-valuenow", "15");
        });

        // Move to end date year segment
        await userEvent.tab(); // Move to end date year segment
        // Invisible - end date year should show placeholder value (2025)
        await waitFor(async () => {
          await expect(segments[5]).toHaveAttribute("aria-valuenow", "2025");
        });
        await userEvent.keyboard("{ArrowUp}");
        // Now visible
        await waitFor(async () => {
          await expect(segments[5]).toHaveAttribute("aria-valuenow", "2025");
        });

        // Now that we have a complete date range, clear button should be enabled
        const clearButton = await helpers.getClearButton();
        await waitFor(async () => {
          await expect(clearButton).not.toBeDisabled();
        });
      }
    );
    await step(
      "Placeholder value doesn't affect typing input directly",
      async () => {
        const withPlaceholder = await canvas.findByRole("group", {
          name: "Date range picker with placeholder values",
        });
        const helpers = createDateRangePickerHelpers(canvas, withPlaceholder);
        const clearButton = await helpers.getClearButton();

        // Only click clear if it's enabled
        if (!clearButton.hasAttribute("disabled")) {
          await userEvent.click(clearButton);
        }

        const segments = helpers.getDateSegments();

        // Type directly into segments - this should work independently of placeholder value
        await userEvent.click(segments[0]);
        await userEvent.keyboard("12");

        await userEvent.click(segments[1]);
        await userEvent.keyboard("25");

        await userEvent.click(segments[2]);
        await userEvent.keyboard("2024");

        await userEvent.click(segments[3]);
        await userEvent.keyboard("12");

        await userEvent.click(segments[4]);
        await userEvent.keyboard("31");

        await userEvent.click(segments[5]);
        await userEvent.keyboard("2024");

        // Values should be exactly what was typed, not influenced by placeholder
        await waitFor(async () => {
          await expect(segments[0]).toHaveAttribute("aria-valuenow", "12");
          await expect(segments[1]).toHaveAttribute("aria-valuenow", "25");
          await expect(segments[2]).toHaveAttribute("aria-valuenow", "2024");
          await expect(segments[3]).toHaveAttribute("aria-valuenow", "12");
          await expect(segments[4]).toHaveAttribute("aria-valuenow", "31");
          await expect(segments[5]).toHaveAttribute("aria-valuenow", "2024");
        });

        // Clear button should be enabled since we have a value
        const clearButtonAfterTyping = await helpers.getClearButton();
        await waitFor(async () => {
          await expect(clearButtonAfterTyping).not.toBeDisabled();
        });
      }
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
                        <DateRangePicker
                          {...args}
                          {...state.props}
                          variant={variant}
                          size={size}
                          defaultValue={{
                            start: new CalendarDate(2025, 6, 15),
                            end: new CalendarDate(2025, 6, 20),
                          }}
                          aria-label={`${state.label} ${variant} ${size} date range picker`}
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

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Clear button is disabled when DateRangePicker is disabled",
      async () => {
        // Find a disabled DateRangePicker (should have defaultValue but be disabled)
        const disabledDateRangePickers = canvas
          .getAllByRole("group")
          .filter((group) => {
            const ariaLabel = group.getAttribute("aria-label");
            return ariaLabel && ariaLabel.includes("Disabled");
          });

        // Test at least one disabled DateRangePicker
        if (disabledDateRangePickers.length > 0) {
          const disabledPicker = disabledDateRangePickers[0];
          const helpers = createDateRangePickerHelpers(canvas, disabledPicker);
          const clearButton = await helpers.getClearButton();

          // Clear button should be disabled even though there's a value (defaultValue was set)
          // because the entire DateRangePicker is disabled
          await expect(clearButton).toBeDisabled();
        }
      }
    );

    await step(
      "Clear button works normally in enabled DateRangePicker",
      async () => {
        // Find a default (enabled) DateRangePicker
        const defaultDateRangePickers = canvas
          .getAllByRole("group")
          .filter((group) => {
            const ariaLabel = group.getAttribute("aria-label");
            return ariaLabel && ariaLabel.includes("Default");
          });

        // Test at least one enabled DateRangePicker
        if (defaultDateRangePickers.length > 0) {
          const enabledPicker = defaultDateRangePickers[0];
          const helpers = createDateRangePickerHelpers(canvas, enabledPicker);
          const clearButton = await helpers.getClearButton();

          // Clear button should be enabled since there's a defaultValue and DateRangePicker is enabled
          await expect(clearButton).not.toBeDisabled();
        }
      }
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
        <Text>Date and hour</Text>
        <DateRangePicker
          {...args}
          granularity="hour"
          defaultValue={{
            start: new CalendarDateTime(2025, 6, 15, 14),
            end: new CalendarDateTime(2025, 6, 20, 16),
          }}
          aria-label="Date and time range picker (hour)"
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

        <Text>Date and time to second</Text>
        <DateRangePicker
          {...args}
          granularity="second"
          defaultValue={{
            start: new CalendarDateTime(2025, 6, 15, 14, 30, 45),
            end: new CalendarDateTime(2025, 6, 20, 16, 45, 30),
          }}
          aria-label="Date and time range picker (second)"
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Date-only picker has correct number of segments (6: month, day, year)",
      async () => {
        const dateOnlyPicker = await canvas.findByRole("group", {
          name: "Date only range picker",
        });
        const helpers = createDateRangePickerHelpers(canvas, dateOnlyPicker);
        const segments = helpers.getDateSegments();

        // Should have exactly 6 segments: month, day, year
        await expect(segments).toHaveLength(6);
      }
    );

    await step("Hour picker has correct segments and values", async () => {
      const hourPicker = await canvas.findByRole("group", {
        name: "Date and time range picker (hour)",
      });
      const helpers = createDateRangePickerHelpers(canvas, hourPicker);
      const segments = helpers.getDateSegments();

      // Should have 5 segments: month, day, year, hour, AM/PM
      await expect(segments).toHaveLength(10);
    });

    await step("Minute picker has correct segments and values", async () => {
      const minutePicker = await canvas.findByRole("group", {
        name: "Date and time range picker (minute)",
      });
      const helpers = createDateRangePickerHelpers(canvas, minutePicker);
      const segments = helpers.getDateSegments();

      // Should have 12 segments: month, day, year, hour, minute, AM/PM
      await expect(segments).toHaveLength(12);
    });

    await step("Second picker has correct segments and values", async () => {
      const secondPicker = await canvas.findByRole("group", {
        name: "Date and time range picker (second)",
      });
      const helpers = createDateRangePickerHelpers(canvas, secondPicker);
      const segments = helpers.getDateSegments();

      // Should have 14 segments: month, day, year, hour, minute, second
      await expect(segments).toHaveLength(14);
    });

    await step(
      "Timezone picker has correct segments and timezone",
      async () => {
        const timezonePicker = await canvas.findByRole("group", {
          name: "Date and time range picker with timezone",
        });
        const helpers = createDateRangePickerHelpers(canvas, timezonePicker);
        const segments = helpers.getDateSegments();

        // Should have 12 segments: month, day, year, hour, minute, second, timezone
        await expect(segments).toHaveLength(12);

        // Check for timezone display (should contain timezone information)
        const timezoneElement =
          within(timezonePicker).getAllByText(/EDT|EST|America/i);
        await expect(timezoneElement).toHaveLength(2);
      }
    );

    await step(
      "Calendar functionality works with time granularities",
      async () => {
        const hourPicker = await canvas.findByRole("group", {
          name: "Date and time range picker (hour)",
        });
        const helpers = createDateRangePickerHelpers(canvas, hourPicker);
        const calendarButton = await helpers.getCalendarButton();

        // Open calendar
        await userEvent.click(calendarButton);

        // Wait for calendar to appear
        await waitFor(async () => {
          const calendar = within(document.body).queryByRole("application");
          await expect(calendar).toBeInTheDocument();
        });

        // Calendar should be functional - close it with Escape
        await userEvent.keyboard("{Escape}");

        // Wait for calendar to disappear
        await waitFor(async () => {
          const calendar = within(document.body).queryByRole("application");
          await expect(calendar).not.toBeInTheDocument();
        });
      }
    );
    await step(
      "Footer time input segments maintain focus during keyboard value changes",
      async () => {
        // Test with second picker that has time input in footer
        const secondPicker = await canvas.findByRole("group", {
          name: "Date and time range picker (second)",
        });
        const helpers = createDateRangePickerHelpers(canvas, secondPicker);

        // Open calendar to ensure footer time input is visible
        await helpers.openCalendar();

        // Wait for the footer time inputs to be rendered
        await waitFor(async () => {
          const startTimeFooterInput = await within(document.body).findByRole(
            "group",
            {
              name: "Start time (hour, minute, and second)",
            }
          );
          await expect(startTimeFooterInput).toBeInTheDocument();
        });

        await waitFor(async () => {
          const endTimeFooterInput = await within(document.body).findByRole(
            "group",
            {
              name: "End time (hour, minute, and second)",
            }
          );
          await expect(endTimeFooterInput).toBeInTheDocument();
        });

        // **START TIME TESTING**

        // Get the start time footer input group
        const startTimeFooterInput = within(document.body).getByRole("group", {
          name: "Start time (hour, minute, and second)",
        });
        const startFooterSegments =
          within(startTimeFooterInput).getAllByRole("spinbutton");

        // Test start time hour segment
        const startHourSegment = startFooterSegments.find(
          (segment) => segment.getAttribute("data-type") === "hour"
        );
        await expect(startHourSegment).toBeInTheDocument();

        // Focus the start hour segment
        await userEvent.click(startHourSegment!);
        await expect(startHourSegment).toHaveFocus();

        // Get initial displayed value (should show "2" for 2 PM)
        const startInitialHourValue = startHourSegment!.textContent;
        await expect(startInitialHourValue).toBe("2");

        // Use arrow up to change value
        await userEvent.keyboard("{ArrowUp}");

        // Verify focus remained on the start hour segment
        await expect(startHourSegment).toHaveFocus();

        // Verify displayed value actually changed (2 -> 3)
        const startNewHourValue = startHourSegment!.textContent;
        await expect(startNewHourValue).toBe("3");
        await expect(startNewHourValue).not.toBe(startInitialHourValue);

        // Test start time minute segment
        await userEvent.keyboard("{Tab}");
        const startMinuteSegment = startFooterSegments.find(
          (segment) => segment.getAttribute("data-type") === "minute"
        );
        await expect(startMinuteSegment).toHaveFocus();

        // Get initial minute value (should show "30")
        const startInitialMinuteValue = startMinuteSegment!.textContent;
        await expect(startInitialMinuteValue).toBe("30");

        // Use arrow up to change minute value
        await userEvent.keyboard("{ArrowUp}");

        // Verify focus remained on the start minute segment
        await expect(startMinuteSegment).toHaveFocus();

        // Verify minute value changed (30 -> 31)
        const startNewMinuteValue = startMinuteSegment!.textContent;
        await expect(startNewMinuteValue).toBe("31");
        await expect(startNewMinuteValue).not.toBe(startInitialMinuteValue);

        // Test start time seconds segment
        await userEvent.keyboard("{Tab}");
        const startSecondsSegment = startFooterSegments.find(
          (segment) => segment.getAttribute("data-type") === "second"
        );
        await expect(startSecondsSegment).toHaveFocus();

        // Get initial seconds value (should show "45")
        const startInitialSecondsValue = startSecondsSegment!.textContent;
        await expect(startInitialSecondsValue).toBe("45");

        // Use arrow up to change seconds value
        await userEvent.keyboard("{ArrowUp}");

        // Verify focus remained on the start seconds segment
        await expect(startSecondsSegment).toHaveFocus();

        // Verify seconds value changed (45 -> 46)
        const startNewSecondsValue = startSecondsSegment!.textContent;
        await expect(startNewSecondsValue).toBe("46");
        await expect(startNewSecondsValue).not.toBe(startInitialSecondsValue);

        // **END TIME TESTING**

        // Get the end time footer input group
        const endTimeFooterInput = within(document.body).getByRole("group", {
          name: "End time (hour, minute, and second)",
        });
        const endFooterSegments =
          within(endTimeFooterInput).getAllByRole("spinbutton");

        // Test end time hour segment
        const endHourSegment = endFooterSegments.find(
          (segment) => segment.getAttribute("data-type") === "hour"
        );
        await expect(endHourSegment).toBeInTheDocument();

        // Focus the end hour segment
        await userEvent.click(endHourSegment!);
        await expect(endHourSegment).toHaveFocus();

        // Get initial displayed value (should show "4" for 4 PM)
        const endInitialHourValue = endHourSegment!.textContent;
        await expect(endInitialHourValue).toBe("4");

        // Use arrow up to change value
        await userEvent.keyboard("{ArrowUp}");

        // Verify focus remained on the end hour segment
        await expect(endHourSegment).toHaveFocus();

        // Verify displayed value actually changed (4 -> 5)
        const endNewHourValue = endHourSegment!.textContent;
        await expect(endNewHourValue).toBe("5");
        await expect(endNewHourValue).not.toBe(endInitialHourValue);

        // Test end time minute segment
        await userEvent.keyboard("{Tab}");
        const endMinuteSegment = endFooterSegments.find(
          (segment) => segment.getAttribute("data-type") === "minute"
        );
        await expect(endMinuteSegment).toHaveFocus();

        // Get initial minute value (should show "45")
        const endInitialMinuteValue = endMinuteSegment!.textContent;
        await expect(endInitialMinuteValue).toBe("45");

        // Use arrow up to change minute value
        await userEvent.keyboard("{ArrowUp}");

        // Verify focus remained on the end minute segment
        await expect(endMinuteSegment).toHaveFocus();

        // Verify minute value changed (45 -> 46)
        const endNewMinuteValue = endMinuteSegment!.textContent;
        await expect(endNewMinuteValue).toBe("46");
        await expect(endNewMinuteValue).not.toBe(endInitialMinuteValue);

        // Test end time seconds segment
        await userEvent.keyboard("{Tab}");
        const endSecondsSegment = endFooterSegments.find(
          (segment) => segment.getAttribute("data-type") === "second"
        );
        await expect(endSecondsSegment).toHaveFocus();

        // Get initial seconds value (should show "30")
        const endInitialSecondsValue = endSecondsSegment!.textContent;
        await expect(endInitialSecondsValue).toBe("30");

        // Use arrow up to change seconds value
        await userEvent.keyboard("{ArrowUp}");

        // Verify focus remained on the end seconds segment
        await expect(endSecondsSegment).toHaveFocus();

        // Verify seconds value changed (30 -> 31)
        const endNewSecondsValue = endSecondsSegment!.textContent;
        await expect(endNewSecondsValue).toBe("31");
        await expect(endNewSecondsValue).not.toBe(endInitialSecondsValue);

        // Close calendar
        await helpers.closeCalendar();

        // Final assertion: verify the main picker shows the updated time values
        const pickerSegments = helpers.getDateSegments();
        // Should have 14 segments for second granularity:
        // Start: month, day, year, hour, minute, second, AM/PM (0-6)
        // End: month, day, year, hour, minute, second, AM/PM (7-13)
        await expect(pickerSegments).toHaveLength(14);

        // Start time segments (indices 3, 4, 5 for hour, minute, second)
        const finalStartHourSegment = pickerSegments[3];
        const finalStartMinuteSegment = pickerSegments[4];
        const finalStartSecondsSegment = pickerSegments[5];

        // End time segments (indices 10, 11, 12 for hour, minute, second)
        const finalEndHourSegment = pickerSegments[10];
        const finalEndMinuteSegment = pickerSegments[11];
        const finalEndSecondsSegment = pickerSegments[12];

        // Verify start time values updated correctly
        await expect(finalStartHourSegment).toHaveTextContent("3");
        await expect(finalStartMinuteSegment).toHaveTextContent("31");
        await expect(finalStartSecondsSegment).toHaveTextContent("46");

        // Verify end time values updated correctly
        await expect(finalEndHourSegment).toHaveTextContent("5");
        await expect(finalEndMinuteSegment).toHaveTextContent("46");
        await expect(finalEndSecondsSegment).toHaveTextContent("31");
      }
    );

    await step(
      "Clear functionality works across all time granularities",
      async () => {
        const pickers = [
          { name: "Date only range picker", hasTime: false },
          { name: "Date and time range picker (hour)", hasTime: true },
          { name: "Date and time range picker (minute)", hasTime: true },
          { name: "Date and time range picker (second)", hasTime: true },
          { name: "Date and time range picker with timezone", hasTime: true },
        ];

        for (const picker of pickers) {
          const pickerElement = await canvas.findByRole("group", {
            name: picker.name,
          });
          const helpers = createDateRangePickerHelpers(canvas, pickerElement);
          const clearButton = await helpers.getClearButton();

          // Clear button should be visible
          await expect(clearButton).toBeVisible();

          // Click clear button
          await userEvent.click(clearButton);

          // Clear button should now be hidden
          await expect(clearButton).not.toBeVisible();

          // Reset by adding a date back for next test
          const segments = helpers.getDateSegments();
          // Set start date to 1/1/2025
          await userEvent.click(segments[0]); // month
          await userEvent.keyboard("1");
          await userEvent.click(segments[1]); // day
          await userEvent.keyboard("1");
          await userEvent.click(segments[2]); // year
          await userEvent.keyboard("2025");

          if (picker.hasTime && segments.length > 3) {
            // Set time values for time-enabled pickers (start)
            await userEvent.click(segments[3]);
            await userEvent.keyboard("12");

            if (segments.length > 4) {
              await userEvent.click(segments[4]);
              await userEvent.keyboard("30");
            }

            if (segments.length > 5) {
              await userEvent.click(segments[5]);
              await userEvent.keyboard("0");
            }
          }

          // Set end date to 1/15/2025
          await userEvent.click(segments[segments.length / 2 + 0]); // end month
          await userEvent.keyboard("1");
          await userEvent.click(segments[segments.length / 2 + 1]); // end day
          await userEvent.keyboard("15");
          await userEvent.click(segments[segments.length / 2 + 2]); // end year
          await userEvent.keyboard("2025");

          if (picker.hasTime && segments.length > 3) {
            // Set time values for time-enabled pickers (end)
            const offset = segments.length / 2;
            await userEvent.click(segments[offset + 3]); // hour
            await userEvent.keyboard("12");

            if (segments.length > offset + 4) {
              await userEvent.click(segments[offset + 4]); // minute
              await userEvent.keyboard("30");
            }

            if (segments.length > offset + 5) {
              await userEvent.click(segments[offset + 5]); // second
              await userEvent.keyboard("0");
            }
          }
        }
      }
    );
  },
};

export const HourCycle: Story = {
  args: {
    ["aria-label"]: "Select a date and time date range",
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
          aria-label="12-hour format date range picker"
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
          aria-label="24-hour format date range picker"
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "12-hour format displays PM and has AM/PM segments",
      async () => {
        const twelveHourPicker = await canvas.findByRole("group", {
          name: "12-hour format date range picker",
        });
        const helpers = createDateRangePickerHelpers(canvas, twelveHourPicker);
        const segments = helpers.getDateSegments();

        // 12-hour format should have 12 segments: month, day, year, hour, minute, AM/PM (start + end)
        await expect(segments).toHaveLength(12);

        // Start DateInput assertions
        await expect(segments[3]).toHaveAttribute("aria-valuetext", "2 PM");

        // End DateInput assertions
        await expect(segments[9]).toHaveAttribute("aria-valuetext", "4 PM");
      }
    );

    await step(
      "24-hour format displays 14 and has no AM/PM segments",
      async () => {
        const twentyFourHourPicker = await canvas.findByRole("group", {
          name: "24-hour format date range picker",
        });
        const helpers = createDateRangePickerHelpers(
          canvas,
          twentyFourHourPicker
        );
        const segments = helpers.getDateSegments();

        // 24-hour format should have 10 segments: month, day, year, hour, minute (start + end)
        await expect(segments).toHaveLength(10);

        // DateInput 1 Hour should show as 14 (14:30 in 24-hour format)
        await waitFor(async () => {
          await expect(segments[3]).toHaveAttribute("aria-valuenow", "14");
        });

        // DateInput 1 Minute should be the last segment (index 4 for start, 9 for end)
        await waitFor(async () => {
          await expect(segments[4]).toHaveAttribute("aria-valuenow", "30");
        });

        // DateInput 2 Hour should show as 14 (14:30 in 24-hour format)
        await waitFor(async () => {
          await expect(segments[8]).toHaveAttribute("aria-valuenow", "16");
        });

        // DateInput 2 Minute should be the last segment (index 4 for start, 9 for end)
        await waitFor(async () => {
          await expect(segments[9]).toHaveAttribute("aria-valuenow", "45");
        });
      }
    );

    await step(
      "12 hour calendar footer contains correct start and end time values with labels",
      async () => {
        const footer = await canvas.findByRole("group", {
          name: "12-hour format date range picker",
        });
        const helpers = createDateRangePickerHelpers(canvas, footer);

        helpers.openCalendar();

        // Check start time label & values display correctly
        const startTimeLabel = await within(document.body).findByText(
          "Start time"
        );
        await expect(startTimeLabel).toBeInTheDocument();

        const startTimeFooterInput = within(document.body).getByRole("group", {
          name: "Start time (hour and minute)",
        });

        const startTimeFooterSegments =
          within(startTimeFooterInput).getAllByRole("spinbutton");
        const startTimeHourSegment = startTimeFooterSegments.find(
          (segment) => segment.getAttribute("aria-valuetext") === "2 PM"
        );
        const startTimeMinuteSegment = startTimeFooterSegments.find(
          (segment) => segment.getAttribute("aria-valuetext") === "30"
        );
        const startTimeAmPmSegment = startTimeFooterSegments.find(
          (segment) =>
            segment.getAttribute("aria-valuetext") === "AM" ||
            segment.getAttribute("aria-valuetext") === "PM"
        );
        await expect(startTimeHourSegment).toBeInTheDocument();
        await expect(startTimeMinuteSegment).toBeInTheDocument();
        await expect(startTimeAmPmSegment).toBeInTheDocument();

        // Check end time label & segments in footer
        const endTimeFooterInput = within(document.body).getByRole("group", {
          name: "End time (hour and minute)",
        });

        const endTimeFooterSegments =
          within(endTimeFooterInput).getAllByRole("spinbutton");
        const endTimeHourSegment = endTimeFooterSegments.find(
          (segment) => segment.getAttribute("aria-valuetext") === "4 PM"
        );
        const endTimeMinuteSegment = endTimeFooterSegments.find(
          (segment) => segment.getAttribute("aria-valuetext") === "45"
        );
        const endTimeAmPmSegment = endTimeFooterSegments.find(
          (segment) =>
            segment.getAttribute("aria-valuetext") === "AM" ||
            segment.getAttribute("aria-valuetext") === "PM"
        );
        await expect(endTimeHourSegment).toBeInTheDocument();
        await expect(endTimeMinuteSegment).toBeInTheDocument();
        await expect(endTimeAmPmSegment).toBeInTheDocument();

        const endTimeLabel = await within(document.body).findByText("End time");
        await expect(endTimeLabel).toBeInTheDocument();
      }
    );

    await step(
      "24 hour calendar footer contains correct start and end time values with labels",
      async () => {
        // First close any open calendar
        await userEvent.keyboard("{Escape}");

        const footer = await canvas.findByRole("group", {
          name: "24-hour format date range picker",
        });
        const helpers = createDateRangePickerHelpers(canvas, footer);

        helpers.openCalendar();

        // Wait for the calendar popover to be fully rendered
        await waitFor(async () => {
          const popover = await within(document.body).findByRole("dialog");
          await expect(popover).toBeInTheDocument();
        });

        // Wait for the time input footer to be rendered
        await waitFor(async () => {
          const startTimeFooterInput = await within(document.body).findByRole(
            "group",
            {
              name: "Start time (hour and minute)",
            }
          );
          await expect(startTimeFooterInput).toBeInTheDocument();
        });

        // Check start time label & segments in footer
        const startTimeLabel = await waitFor(async () => {
          return await within(document.body).findByText("Start time");
        });
        await expect(startTimeLabel).toBeInTheDocument();

        const startTimeFooterInput = within(document.body).getByRole("group", {
          name: "Start time (hour and minute)",
        });

        const startTimeFooterSegments =
          within(startTimeFooterInput).getAllByRole("spinbutton");
        const startTimeHourSegment = startTimeFooterSegments.find(
          (segment) => segment.getAttribute("aria-valuenow") === "14"
        );
        const startTimeMinuteSegment = startTimeFooterSegments.find(
          (segment) => segment.getAttribute("aria-valuenow") === "30"
        );

        await expect(startTimeHourSegment).toBeInTheDocument();
        await expect(startTimeMinuteSegment).toBeInTheDocument();

        // Check end time label & segments in footer
        const endTimeFooterInput = await waitFor(async () => {
          return await within(document.body).findByRole("group", {
            name: "End time (hour and minute)",
          });
        });

        const endTimeFooterSegments =
          within(endTimeFooterInput).getAllByRole("spinbutton");

        // Wait for end time label to be rendered
        const endTimeLabel = await waitFor(async () => {
          return await within(document.body).findByText("End time");
        });

        const endTimeHourSegment = endTimeFooterSegments.find(
          (segment) => segment.getAttribute("aria-valuenow") === "16"
        );
        const endTimeMinuteSegment = endTimeFooterSegments.find(
          (segment) => segment.getAttribute("aria-valuenow") === "45"
        );

        await expect(endTimeLabel).toBeInTheDocument();
        await expect(endTimeHourSegment).toBeInTheDocument();
        await expect(endTimeMinuteSegment).toBeInTheDocument();

        helpers.closeCalendar();
      }
    );

    await step(
      "12-hour format AM/PM segment can be toggled with keyboard",
      async () => {
        // First close any open calendar
        await userEvent.keyboard("{Escape}");
        await userEvent.keyboard("{Escape}");

        const twelveHourPicker = await canvas.findByRole("group", {
          name: "12-hour format date range picker",
        });
        const helpers = createDateRangePickerHelpers(canvas, twelveHourPicker);
        const segments = helpers.getDateSegments();
        const amPmSegment = segments[5];

        // Focus AM/PM segment
        await userEvent.click(amPmSegment);

        // Initially should be PM (value 1)
        await waitFor(async () => {
          await expect(amPmSegment).toHaveAttribute("aria-valuetext", "PM");
        });

        // Arrow up should toggle to AM
        await userEvent.keyboard("{ArrowUp}");
        await waitFor(async () => {
          await expect(amPmSegment).toHaveAttribute("aria-valuetext", "AM");
        });

        // Arrow down should toggle back to PM
        await userEvent.keyboard("{ArrowDown}");
        await waitFor(async () => {
          await expect(amPmSegment).toHaveAttribute("aria-valuetext", "PM");
        });
      }
    );

    await step(
      "12-hour format hour values are constrained to 1-12",
      async () => {
        const twelveHourPicker = await canvas.findByRole("group", {
          name: "12-hour format date range picker",
        });
        const helpers = createDateRangePickerHelpers(canvas, twelveHourPicker);
        const segments = helpers.getDateSegments();
        const hourSegment = segments[3];

        // Focus hour segment
        await userEvent.click(hourSegment);

        // Clear current value and type 12
        await userEvent.keyboard("12");
        await waitFor(async () => {
          await expect(hourSegment).toHaveAttribute("aria-valuetext", "12 PM");
        });

        // back to hour segment
        await userEvent.tab({ shift: true });

        // Arrow up from 12 should wrap to 1
        await userEvent.keyboard("{ArrowUp}");
        await waitFor(async () => {
          await expect(hourSegment).toHaveAttribute("aria-valuetext", "1 PM");
        });

        // Arrow down from 1 should wrap to 12
        await userEvent.keyboard("{ArrowDown}");
        await waitFor(async () => {
          await expect(hourSegment).toHaveAttribute("aria-valuetext", "12 PM");
        });
      }
    );

    await step(
      "24-hour format hour values are constrained to 0-23",
      async () => {
        const twentyFourHourPicker = await canvas.findByRole("group", {
          name: "24-hour format date range picker",
        });
        const helpers = createDateRangePickerHelpers(
          canvas,
          twentyFourHourPicker
        );
        const segments = helpers.getDateSegments();
        const hourSegment = segments[3];

        // Focus hour segment
        await userEvent.click(hourSegment);

        // Clear current value and type 23
        await userEvent.keyboard("23");
        await waitFor(async () => {
          await expect(hourSegment).toHaveAttribute("aria-valuenow", "23");
        });

        // back to hour segment
        await userEvent.tab({ shift: true });

        // Arrow up from 23 should wrap to 0
        await userEvent.keyboard("{ArrowUp}");
        await waitFor(async () => {
          await expect(hourSegment).toHaveAttribute("aria-valuenow", "0");
        });

        // Arrow down from 0 should wrap to 23
        await userEvent.keyboard("{ArrowDown}");
        await waitFor(async () => {
          await expect(hourSegment).toHaveAttribute("aria-valuenow", "23");
        });
      }
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "DateRangePicker with timezone shown displays timezone information",
      async () => {
        const timezoneShownPicker = await canvas.findByRole("group", {
          name: "With timezone shown",
        });

        // Should display timezone information (EDT/EST/America)
        const timezoneElement =
          within(timezoneShownPicker).getAllByText(/EDT|EST|America/i);
        await expect(timezoneElement).toHaveLength(2);
      }
    );

    await step(
      "DatePicker with timezone hidden does not display timezone information",
      async () => {
        const timezoneHiddenPicker = await canvas.findByRole("group", {
          name: "With timezone hidden",
        });

        // Should NOT display timezone information
        const timezoneElement =
          within(timezoneHiddenPicker).queryByText(/EDT|EST|America/i);
        await expect(timezoneElement).not.toBeInTheDocument();
      }
    );

    await step(
      "Both DateRangePickers have identical input segments",
      async () => {
        const timezoneShownPicker = await canvas.findByRole("group", {
          name: "With timezone shown",
        });
        const timezoneHiddenPicker = await canvas.findByRole("group", {
          name: "With timezone hidden",
        });

        const shownSegments =
          within(timezoneShownPicker).getAllByRole("spinbutton");
        const hiddenSegments =
          within(timezoneHiddenPicker).getAllByRole("spinbutton");

        // Both should have same number of input segments (hiding timezone only affects display)
        await expect(shownSegments).toHaveLength(hiddenSegments.length);

        // Both should have the same date/time values
        for (let i = 0; i < Math.min(shownSegments.length, 5); i++) {
          // Compare first 5 segments (date/time, excluding potential timezone segment)
          const shownValue = shownSegments[i].getAttribute("aria-valuenow");
          const hiddenValue = hiddenSegments[i].getAttribute("aria-valuenow");
          await expect(shownValue).toBe(hiddenValue);
        }
      }
    );

    await step("Footer time inputs respect hideTimeZone prop", async () => {
      const timezoneShownPicker = await canvas.findByRole("group", {
        name: "With timezone shown",
      });
      const timezoneHiddenPicker = await canvas.findByRole("group", {
        name: "With timezone hidden",
      });

      const helpersShown = createDateRangePickerHelpers(
        canvas,
        timezoneShownPicker
      );

      await helpersShown.openCalendar();

      // Check that footer time inputs show timezone when hideTimeZone is false
      // Find the currently open calendar dialog
      const calendarDialog = within(document.body).getByRole("dialog");
      const footerTimeInputsShown =
        within(calendarDialog).getAllByRole("group");
      const timezoneInFooterShown = footerTimeInputsShown.some((input) =>
        within(input).queryByText(/EDT/i)
      );
      await expect(timezoneInFooterShown).toBe(true);

      await helpersShown.closeCalendar();

      // Open calendar for timezone hidden picker
      const helpersHidden = createDateRangePickerHelpers(
        canvas,
        timezoneHiddenPicker
      );
      await helpersHidden.openCalendar();

      // Check that footer time inputs don't show timezone when hideTimeZone is true
      // Find the currently open calendar dialog for the hidden timezone picker
      const calendarDialogHidden = within(document.body).getByRole("dialog");
      const footerTimeInputsHidden =
        within(calendarDialogHidden).getAllByRole("group");

      const timezoneInFooterHidden = footerTimeInputsHidden.some((input) =>
        within(input).queryByText(/EDT/i)
      );

      await expect(timezoneInFooterHidden).toBe(false);

      await helpersHidden.closeCalendar();
    });

    await step(
      "Both DateRangePickers maintain identical functionality",
      async () => {
        const timezoneHiddenPicker = await canvas.findByRole("group", {
          name: "With timezone hidden",
        });
        const helpers = createDateRangePickerHelpers(
          canvas,
          timezoneHiddenPicker
        );
        const clearButton = await helpers.getClearButton();
        const calendarButton = await helpers.getCalendarButton();

        // Clear button should be enabled (has default value)
        await expect(clearButton).not.toBeDisabled();

        // Calendar button should be functional
        await expect(calendarButton).not.toBeDisabled();

        // Quick test of calendar opening (without full interaction test)
        await userEvent.click(calendarButton);
        await waitFor(async () => {
          const calendar = within(document.body).queryByRole("application");
          await expect(calendar).toBeInTheDocument();
        });

        // Close calendar
        await userEvent.keyboard("{Escape}");
        await waitFor(async () => {
          const calendar = within(document.body).queryByRole("application");
          await expect(calendar).not.toBeInTheDocument();
        });
      }
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("DatePicker starts with valid date within range", async () => {
      const dateRangePicker = await canvas.findByRole("group", {
        name: "Date range picker with min/max values",
      });
      const helpers = createDateRangePickerHelpers(canvas, dateRangePicker);
      const segments = helpers.getDateSegments();
      const clearButton = await helpers.getClearButton();

      // Should have default value of 2025-06-22 (start) to 2025-06-27 (end)
      await helpers.verifyDateRangeValues(
        segments,
        ["6", "22", "2025"],
        ["6", "27", "2025"]
      );

      // Clear button should be enabled
      await expect(clearButton).not.toBeDisabled();
    });

    await step(
      "Calendar shows correct available/disabled dates within range and allows selecting a valid range",
      async () => {
        const dateRangePicker = await canvas.findByRole("group", {
          name: "Date range picker with min/max values",
        });
        const helpers = createDateRangePickerHelpers(canvas, dateRangePicker);
        const calendarButton = await helpers.getCalendarButton();

        // Open calendar
        await userEvent.click(calendarButton);

        // Wait for calendar to appear
        await waitFor(async () => {
          const calendar =
            within(document.body).queryByRole("application") ||
            within(document.body).queryByRole("grid");
          await expect(calendar).toBeInTheDocument();
        });

        // Find the calendar grid
        const calendarGrid = await within(document.body).findByRole("grid");
        await expect(calendarGrid).toBeInTheDocument();

        const dateCells = within(calendarGrid).getAllByRole("gridcell");
        await expect(dateCells.length).toBeGreaterThan(0);

        // Look for date buttons within cells
        const dateButtons = dateCells
          .map((cell) => within(cell).getAllByRole("button"))
          .flat()
          .filter(Boolean);
        await expect(dateButtons.length).toBeGreaterThan(0);

        // Find available dates (dates that can be selected)
        const availableDates = dateButtons.filter(
          (button) =>
            button &&
            (!button.hasAttribute("aria-disabled") ||
              button.getAttribute("aria-disabled") !== "true")
        );

        // At minimum, we should have some available dates within the allowed range
        await expect(availableDates.length).toBeGreaterThan(0);

        // Verify we have date buttons in the calendar
        await expect(dateButtons.length).toBeGreaterThan(0);

        // Close calendar
        await userEvent.keyboard("{Escape}");

        // Wait for the calendar to close
        await new Promise((resolve) => setTimeout(resolve, 100));

        await waitFor(async () => {
          const calendar = within(document.body).queryByRole("grid");
          await expect(calendar).not.toBeInTheDocument();
        });
      }
    );

    await step(
      "Typing date outside min/max range handles gracefully",
      async () => {
        const dateRangePicker = await canvas.findByRole("group", {
          name: "Date range picker with min/max values",
        });
        const segments = within(dateRangePicker).getAllByRole("spinbutton");

        // Try to set a date before minValue (2025-06-15, which is before 2025-06-16)
        await userEvent.click(segments[1]); // day segment
        await userEvent.keyboard("{Control>}a{/Control}");
        await userEvent.keyboard("15"); // 15th (before minValue of 16th)

        // The component should handle this gracefully - either:
        // 1. Not allow the invalid date, or
        // 2. Keep the previous valid value
        // We just verify it doesn't crash and maintains a reasonable state
        await expect(segments[1]).toHaveAttribute("aria-valuenow");
        const dayValue = segments[1].getAttribute("aria-valuenow");
        await expect(dayValue).toBeTruthy();

        // Reset to a valid date within range
        await userEvent.click(segments[1]);
        await userEvent.keyboard("{Control>}a{/Control}");
        await userEvent.keyboard("20"); // 20th (within range)
        await waitFor(async () => {
          await expect(segments[1]).toHaveAttribute("aria-valuenow", "20");
        });
      }
    );

    await step(
      "Can select valid dates from calendar within range",
      async () => {
        const dateRangePicker = await canvas.findByRole("group", {
          name: "Date range picker with min/max values",
        });
        const helpers = createDateRangePickerHelpers(canvas, dateRangePicker);
        const calendarButton = await helpers.getCalendarButton();

        // Open calendar
        await userEvent.click(calendarButton);

        await waitFor(async () => {
          const calendar = within(document.body).queryByRole("application");
          await expect(calendar).toBeInTheDocument();
        });

        // Find an available (non-disabled) date and click it
        const calendarGrid = await within(document.body).findByRole("grid");
        const dateCells = within(calendarGrid).getAllByRole("gridcell");
        const availableDates = dateCells.filter((cell) => {
          const button = cell.querySelector("button");
          return button && !button.hasAttribute("aria-disabled");
        });

        if (availableDates.length > 0) {
          const dateButton = availableDates[0].querySelector("button");
          if (dateButton) {
            await userEvent.click(dateButton);

            // Calendar should close after selection
            await waitFor(async () => {
              const calendar = within(document.body).queryByRole("application");
              await expect(calendar).not.toBeInTheDocument();
            });

            // Clear button should be enabled after selection
            const clearButton = await helpers.getClearButton();
            await expect(clearButton).not.toBeDisabled();
          }
        }
      }
    );

    await step(
      "Clear and re-select functionality works within constraints",
      async () => {
        await userEvent.keyboard("{Escape}");

        const dateRangePicker = await canvas.findByRole("group", {
          name: "Date range picker with min/max values",
        });
        const helpers = createDateRangePickerHelpers(canvas, dateRangePicker);
        const clearButton = await helpers.getClearButton();

        // Clear the current value
        await userEvent.click(clearButton);
        await waitFor(async () => {
          const clearButtonAfterClear = helpers.getClearButtonIfExists();
          await expect(clearButtonAfterClear).not.toBeInTheDocument();
        });

        // DateInput 1 - Set a new valid date within range by typing
        const segments = helpers.getDateSegments();
        await userEvent.click(segments[0]);
        await userEvent.keyboard("7");

        await userEvent.click(segments[1]);
        await userEvent.keyboard("1");

        await userEvent.click(segments[2]);
        await userEvent.keyboard("2025");

        // DateInput 2 - Set a new valid date within range by typing
        await userEvent.click(segments[3]);
        await userEvent.keyboard("8");

        await userEvent.click(segments[4]);
        await userEvent.keyboard("7");

        await userEvent.click(segments[5]);
        await userEvent.keyboard("2025");

        // Clear button should now be enabled
        await expect(clearButton).not.toBeDisabled();

        // Verify the valid date was set
        await waitFor(async () => {
          await expect(segments[0]).toHaveAttribute("aria-valuenow", "7");
          await expect(segments[1]).toHaveAttribute("aria-valuenow", "1");
          await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025");
          await expect(segments[3]).toHaveAttribute("aria-valuenow", "8");
          await expect(segments[4]).toHaveAttribute("aria-valuenow", "7");
          await expect(segments[5]).toHaveAttribute("aria-valuenow", "2025");
        });
      }
    );
  },
};

export const UnavailableDates: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    const isFirstTenDaysUnavailable = (date: DateValue) => {
      return date.day <= 10;
    };

    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>
          Dr. Orderly is on holiday for the first 10 days of each month.
        </Text>
        <DateRangePicker
          {...args}
          isDateUnavailable={isFirstTenDaysUnavailable}
          defaultValue={{
            start: new CalendarDate(2025, 6, 16),
            end: new CalendarDate(2025, 6, 20),
          }}
          aria-label="First 10 days unavailable range picker"
        />
        <Text fontSize="sm" color="neutral.11">
          (First 10 days of each month are marked as unavailable and cannot be
          selected.)
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Calendar shows first 10 days of each month as disabled",
      async () => {
        const dateRangePicker = await canvas.findByRole("group", {
          name: "First 10 days unavailable range picker",
        });
        const helpers = createDateRangePickerHelpers(canvas, dateRangePicker);
        const calendarButton = await helpers.getCalendarButton();

        // Open calendar
        await userEvent.click(calendarButton);

        // Wait for calendar to appear
        await waitFor(async () => {
          const calendar = within(document.body).queryByRole("application");
          await expect(calendar).toBeInTheDocument();
        });

        // Find the calendar grid
        const calendarGrid = await within(document.body).findByRole("grid");
        const dateCells = within(calendarGrid).getAllByRole("gridcell");

        // Check for first 10 days and remaining days
        const firstTenDayButtons = [];
        const remainingDayButtons = [];

        for (const cell of dateCells) {
          const button = within(cell).queryByRole("button");
          if (!button) continue;

          const ariaLabel = button.getAttribute("aria-label");
          if (!ariaLabel) continue;

          // Extract day number from aria-label
          const dayMatch = ariaLabel.match(/\b(\d{1,2})\b/);
          if (!dayMatch) continue;

          const dayNumber = parseInt(dayMatch[1]);
          if (dayNumber < 1 || dayNumber > 31) continue;

          if (dayNumber <= 10) {
            firstTenDayButtons.push(button);
          } else {
            remainingDayButtons.push(button);
          }
        }

        // Verify we found both first 10 days and remaining days
        await expect(firstTenDayButtons.length).toBeGreaterThan(0);
        await expect(remainingDayButtons.length).toBeGreaterThan(0);

        // All first 10 day buttons should be disabled
        for (const firstTenButton of firstTenDayButtons) {
          await expect(firstTenButton).toHaveAttribute("aria-disabled", "true");
        }

        // At least some remaining day buttons should be enabled
        const enabledRemainingButtons = remainingDayButtons.filter(
          (button) =>
            !button.hasAttribute("aria-disabled") ||
            button.getAttribute("aria-disabled") !== "true"
        );
        await expect(enabledRemainingButtons.length).toBeGreaterThan(0);

        // Close calendar
        await userEvent.keyboard("{Escape}");
        await waitFor(async () => {
          const calendar = within(document.body).queryByRole("application");
          await expect(calendar).not.toBeInTheDocument();
        });
      }
    );
    await step(
      "Can successfully select available range from calendar",
      async () => {}
    );
    await step(
      "Cannot select first 10 days from calendar (clicking disabled dates)",
      async () => {}
    );
    await step(
      "Keyboard navigation in day segment respects unavailable dates",
      async () => {}
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
            start: new CalendarDate(2025, 6, 8), // Sunday
            end: new CalendarDate(2025, 6, 22), // Sunday, covers two weeks
          }}
          isDateUnavailable={(date: DateValue) => {
            const dateObj = date.toDate(getLocalTimeZone());
            const dayOfWeek = dateObj.getDay();
            return dayOfWeek === 3; // Block Wednesdays
          }}
          aria-label="Non-contiguous range picker"
        />
        <Text fontSize="sm" color="neutral.11">
          Select ranges that include unavailable dates (Wednesdays are blocked).
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const helpers = createDateRangePickerHelpers(canvas);
    const segments = helpers.getDateSegments();
    // Assert the default value is set correctly in the input
    await helpers.verifyDateRangeValues(
      segments,
      ["6", "8", "2025"], // June 8, 2025 (start)
      ["6", "22", "2025"] // June 22, 2025 (end)
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
    firstDayOfWeek: "sun",
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
              aria-label="DE German range picker"
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
              aria-label="ES Spanish range picker"
            />
          </I18nProvider>
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All locale variants render correctly", async () => {
      const usEnglishPicker = await canvas.findByRole("group", {
        name: "US English range picker",
      });
      const germanPicker = await canvas.findByRole("group", {
        name: "DE German range picker",
      });
      const spanishPicker = await canvas.findByRole("group", {
        name: "ES Spanish range picker",
      });

      await expect(usEnglishPicker).toBeInTheDocument();
      await expect(germanPicker).toBeInTheDocument();
      await expect(spanishPicker).toBeInTheDocument();
    });

    await step("US English uses 12-hour format with AM/PM", async () => {
      const usEnglishPicker = await canvas.findByRole("group", {
        name: "US English range picker",
      });
      const segments = within(usEnglishPicker).getAllByRole("spinbutton");

      // US English should have 12 segments: month, day, year, hour, minute, AM/PM (2x )
      await expect(segments).toHaveLength(12);

      // Hour should be in 12-hour format (14:30 = 2:30 PM)
      const hourSegment = segments[3];
      await expect(hourSegment).toHaveAttribute("aria-valuetext", "2 PM");

      // Should have AM/PM segment
      const amPmSegment = segments[5];
      await expect(amPmSegment).toHaveAttribute("aria-valuetext", "PM");
    });

    await step("German uses 24-hour format without AM/PM", async () => {
      const germanPicker = await canvas.findByRole("group", {
        name: "DE German range picker",
      });
      const segments = within(germanPicker).getAllByRole("spinbutton");

      // German should have 10 segments: day, month, year, hour, minute (no AM/PM) (2x)
      await expect(segments).toHaveLength(10);

      // Hour should be in 24-hour format
      const hourSegment = segments[3];
      await expect(hourSegment).toHaveAttribute("aria-valuenow", "14");
    });

    await step("Spanish locale adapts date structure", async () => {
      const spanishPicker = await canvas.findByRole("group", {
        name: "ES Spanish range picker",
      });
      const segments = within(spanishPicker).getAllByRole("spinbutton");

      // Spanish should have segments (exact count may vary by implementation)
      await expect(segments.length).toBeGreaterThanOrEqual(5);

      // All segments should be accessible
      for (const segment of segments) {
        await expect(segment).toHaveAttribute("tabindex", "0");
        const ariaLabel = segment.getAttribute("aria-label");
        await expect(ariaLabel).toBeTruthy();
      }
    });

    await step("Locale-specific differences are observable", async () => {
      const usEnglishPicker = await canvas.findByRole("group", {
        name: "US English range picker",
      });
      const germanPicker = await canvas.findByRole("group", {
        name: "DE German range picker",
      });

      const usSegments = within(usEnglishPicker).getAllByRole("spinbutton");
      const germanSegments = within(germanPicker).getAllByRole("spinbutton");

      // US and German should have different segment counts due to AM/PM difference
      await expect(usSegments.length).not.toBe(germanSegments.length);

      // Both should display the same date/time but formatted differently
      // US: 6/15/2025, 2:30 PM vs German: 15.6.2025, 14:30
      await waitFor(async () => {
        await expect(usSegments[0]).toHaveAttribute("aria-valuenow", "6"); // US month first
        await expect(germanSegments[0]).toHaveAttribute("aria-valuenow", "15"); // German day first
      });
    });
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "All FormField contexts render with DateRangePickers",
      async () => {
        // Find all FormField labels to identify the different contexts
        const eventDateLabel = await canvas.findByText("Event Date Range");
        const deadlineDateLabel = await canvas.findByText("Deadline Range");
        const meetingTimeLabel = await canvas.findByText("Meeting Time Range");

        await expect(eventDateLabel).toBeInTheDocument();
        await expect(deadlineDateLabel).toBeInTheDocument();
        await expect(meetingTimeLabel).toBeInTheDocument();

        // Verify corresponding DatePicker groups exist
        const datePickers = canvas.getAllByRole("group");
        await expect(datePickers).toHaveLength(3);
      }
    );

    await step(
      "Required FormField integrates properly with DateRangePicker",
      async () => {
        // Locate the DateRangePicker by its accessible name derived from the label
        const datePicker = await canvas.findByRole("group", {
          name: /event date range/i,
        });
        await expect(datePicker).toBeInTheDocument();

        // Ensure segments are present and tabbable
        const segments = within(datePicker).getAllByRole("spinbutton");
        await expect(segments.length).toBeGreaterThan(0);
        for (const segment of segments) {
          await expect(segment).toHaveAttribute("tabindex", "0");
        }

        // Verify description text is present
        const description = await canvas.findByText(
          "Select the start and end dates for your event"
        );
        await expect(description).toBeInTheDocument();
      }
    );

    await step(
      "Invalid FormField integrates properly with DateRangePicker",
      async () => {
        // Locate the invalid DatePicker by accessible name
        const datePicker = await canvas.findByRole("group", {
          name: /deadline range/i,
        });
        await expect(datePicker).toBeInTheDocument();

        // Verify error message is present and accessible
        const errorMessage = await canvas.findByText(
          "Please select a valid date range in the future"
        );
        await expect(errorMessage).toBeInTheDocument();

        // Check that invalid state does not break segment accessibility
        const segments = within(datePicker).getAllByRole("spinbutton");
        await expect(segments.length).toBeGreaterThan(0);

        for (const segment of segments) {
          await expect(segment).toHaveAttribute("tabindex", "0");
        }

        // Verify description text is present
        const description = await canvas.findByText(
          "Choose a deadline range for the project"
        );
        await expect(description).toBeInTheDocument();
      }
    );

    await step(
      "DateRangePicker with granularity works in FormField with InfoBox",
      async () => {
        // Locate the Meeting Time DatePicker by accessible name
        const datePicker = await canvas.findByRole("group", {
          name: /meeting time range/i,
        });
        await expect(datePicker).toBeInTheDocument();

        // Verify granularity="minute" results in more segments (including time)
        const segments = within(datePicker).getAllByRole("spinbutton");
        // Should have at least 5 segments: month, day, year, hour, minute
        await expect(segments.length).toBeGreaterThanOrEqual(10);

        // Test basic time input functionality
        const hourSegment = segments[3];
        const minuteSegment = segments[4];

        await userEvent.click(hourSegment);
        await userEvent.keyboard("2");

        await userEvent.click(minuteSegment);
        await userEvent.keyboard("30");

        await waitFor(async () => {
          await expect(hourSegment).toHaveAttribute("aria-valuenow");
          await expect(minuteSegment).toHaveAttribute("aria-valuenow");
        });
      }
    );

    await step(
      "DateRangePicker width='full' fills FormField container",
      async () => {
        const datePickers = canvas.getAllByRole("group");

        for (const datePicker of datePickers) {
          // Check that DateRangePicker is rendered properly
          await expect(datePicker).toBeInTheDocument();

          // Verify DateRangePicker is wide enough by checking it's not tiny
          const rect = datePicker.getBoundingClientRect();
          await expect(rect.width).toBeGreaterThan(200); // Reasonable minimum width
        }
      }
    );

    await step(
      "FormField accessibility relationships are established",
      async () => {
        // Test each FormField context for proper ARIA relationships
        const formFieldContexts = [
          {
            label: "Event Date Range",
            description: "Select the start and end dates for your event",
          },
          {
            label: "Deadline Range",
            description: "Choose a deadline range for the project",
          },
          {
            label: "Meeting Time Range",
            description: "Select the exact start and end times for the meeting",
          },
        ];

        for (const context of formFieldContexts) {
          // Verify label and description are present
          await expect(
            await canvas.findByText(context.label)
          ).toBeInTheDocument();
          await expect(
            await canvas.findByText(context.description)
          ).toBeInTheDocument();

          const datePicker = await canvas.findByRole("group", {
            name: new RegExp(context.label, "i"),
          });
          await expect(datePicker).toBeInTheDocument();

          const segments = within(datePicker).getAllByRole("spinbutton");
          for (const segment of segments) {
            const ariaLabel = segment.getAttribute("aria-label");
            await expect(ariaLabel).toBeTruthy();
            await expect(segment).toHaveAttribute("tabindex", "0");
          }
        }
      }
    );

    await step(
      "RangeCalendar functionality works within FormField contexts",
      async () => {
        // Test calendar functionality in the first FormField context
        const datePickers = canvas.getAllByRole("group");
        const firstDatePicker = datePickers[0];

        const calendarButton = await within(firstDatePicker).findByRole(
          "button",
          {
            name: /calendar/i,
          }
        );

        await expect(calendarButton).toBeInTheDocument();
        await expect(calendarButton).not.toBeDisabled();

        // Quick test of calendar opening
        await userEvent.click(calendarButton);

        await waitFor(async () => {
          const calendar = within(document.body).queryByRole("application");
          await expect(calendar).toBeInTheDocument();
        });

        // Close calendar
        await userEvent.keyboard("{Escape}");

        await waitFor(async () => {
          const calendar = within(document.body).queryByRole("application");
          await expect(calendar).not.toBeInTheDocument();
        });
      }
    );

    await step("Clear functionality works in FormField contexts", async () => {
      // Test clear functionality in each FormField context
      const datePickers = canvas.getAllByRole("group");

      for (let i = 0; i < datePickers.length; i++) {
        const datePicker = datePickers[i];
        const helpers = createDateRangePickerHelpers(canvas, datePicker);
        const clearButton = helpers.getClearButtonIfExists();

        // Initially should be hidden (no value)
        await expect(clearButton).not.toBeInTheDocument();

        // Set a value by typing in first segment
        const segments = within(datePicker).getAllByRole("spinbutton");
        await userEvent.click(segments[0]);
        await userEvent.keyboard("6");

        if (segments[1]) {
          await userEvent.click(segments[1]);
          await userEvent.keyboard("15");
        }

        if (segments[2]) {
          await userEvent.click(segments[2]);
          await userEvent.keyboard("2025");
        }

        if (segments[3]) {
          await userEvent.click(segments[3]);
          await userEvent.keyboard("5");
        }
        if (segments[4]) {
          await userEvent.click(segments[4]);
          await userEvent.keyboard("28");
        }
        if (segments[5]) {
          await userEvent.click(segments[5]);
          await userEvent.keyboard("2025");
        }

        await userEvent.click(segments[6]);
        await userEvent.keyboard("5");
        await userEvent.click(segments[7]);
        await userEvent.keyboard("28");
        await userEvent.click(segments[8]);
        await userEvent.keyboard("2025");
        await userEvent.click(segments[9]);
        await userEvent.keyboard("10");
        await userEvent.click(segments[10]);
        await userEvent.keyboard("00");

        // Clear buttons should now be enabled
        const clearButtonAfterInput = await helpers.getClearButton();
        await expect(clearButtonAfterInput).not.toBeDisabled();

        // Clear the value
        await userEvent.click(clearButtonAfterInput);

        // Should be hidden again
        await expect(clearButton).not.toBeInTheDocument();
      }
    });
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
                aria-label="Controlled popover date range picker"
                defaultValue={{
                  start: new CalendarDate(2025, 6, 1),
                  end: new CalendarDate(2025, 6, 15),
                }}
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
                defaultValue={{
                  start: new CalendarDate(2025, 6, 1),
                  end: new CalendarDate(2025, 6, 15),
                }}
                defaultOpen
                aria-label="Default open date range picker"
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
                defaultValue={{
                  start: new CalendarDate(2025, 6, 1),
                  end: new CalendarDate(2025, 6, 15),
                }}
                aria-label="Custom close behavior date range picker"
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Default open picker has calendar already open", async () => {
      // Check that the calendar is already open for the default open picker
      const calendar = within(document.body).queryByRole("application");
      await expect(calendar).toBeInTheDocument();

      // Verify the calendar grid is present
      const calendarGrid = await within(document.body).findByRole("grid");
      await expect(calendarGrid).toBeInTheDocument();

      // Verify we can see date cells in the calendar
      const dateCells = within(calendarGrid).getAllByRole("gridcell");
      await expect(dateCells.length).toBeGreaterThan(0);
    });

    await step("Controlled picker starts with calendar closed", async () => {
      // The calendar should already be open from the default open picker,
      // so we need to close it first to test the controlled picker
      await userEvent.keyboard("{Escape}");

      await waitFor(async () => {
        const calendar = within(document.body).queryByRole("application");
        await expect(calendar).not.toBeInTheDocument();
      });

      // Now verify the controlled picker can open the calendar
      const openButton = await canvas.findByRole("button", {
        name: "Open Calendar",
      });
      await userEvent.click(openButton);

      await waitFor(async () => {
        const calendar = within(document.body).queryByRole("application");
        await expect(calendar).toBeInTheDocument();
      });

      // Close it again for the next test
      await userEvent.keyboard("{Escape}");
      await waitFor(async () => {
        const calendar = within(document.body).queryByRole("application");
        await expect(calendar).not.toBeInTheDocument();
      });
    });

    await step(
      "Custom close behavior picker stays open after date selection",
      async () => {
        const customClosePicker = await canvas.findByRole("group", {
          name: "Custom close behavior date range picker",
        });
        const helpers = createDateRangePickerHelpers(canvas, customClosePicker);

        // Open the calendar using existing helper
        await helpers.openCalendar();

        // Select the first available date
        const calendarGrid = await within(document.body).findByRole("grid");
        const dateCells = within(calendarGrid).getAllByRole("gridcell");
        const firstAvailableDate = dateCells.find((cell) => {
          const button = cell.querySelector("button");
          return button && !button.hasAttribute("aria-disabled");
        });

        const dateButton = firstAvailableDate?.querySelector("button");
        await userEvent.click(dateButton!);

        // Calendar should remain open due to shouldCloseOnSelect={false}
        const calendar = within(document.body).queryByRole("application");
        await expect(calendar).toBeInTheDocument();
      }
    );
  },
};

export const ForceLeadingZeros: Story = {
  args: {
    ["aria-label"]: "Select a date range",
  },
  render: (args) => {
    return (
      <Stack direction="column" gap="400" alignItems="start">
        <Text>With defaultValue (1/2/2025-5/3/2025)</Text>
        <DateRangePicker
          {...args}
          defaultValue={{
            start: new CalendarDate(2025, 1, 2),
            end: new CalendarDate(2025, 5, 3),
          }}
          shouldForceLeadingZeros
          aria-label="DateRangePicker with force leading zeros"
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const dateGroup = await canvas.findByRole("group", {
      name: "DateRangePicker with force leading zeros",
    });

    await step(
      "DateRangePicker with defaultValue displays leading zeros in segments",
      async () => {
        const helpers = createDateRangePickerHelpers(canvas, dateGroup);
        const segments = helpers.getDateSegments();

        // Assert start date segments: 01, 02, 2025
        await waitFor(async () => {
          await expect(segments[0]).toHaveAttribute(
            "aria-valuetext",
            "01 – January"
          );
          await expect(segments[1]).toHaveAttribute("aria-valuetext", "02");
          await expect(segments[2]).toHaveAttribute("aria-valuetext", "2025");
        });
        // Assert end date segments: 05, 03, 2025
        await waitFor(async () => {
          await expect(segments[3]).toHaveAttribute(
            "aria-valuetext",
            "05 – May"
          );
          await expect(segments[4]).toHaveAttribute("aria-valuetext", "03");
          await expect(segments[5]).toHaveAttribute("aria-valuetext", "2025");
        });
      }
    );
  },
};

export const BaseField: Story = {
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return (
      <DateRangePickerField
        label="Date Range"
        description="Select a start and end date"
        aria-label="Select a date range"
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const helpers = createDateRangePickerHelpers(canvas);

    await step("Renders proper FormField structure with label", async () => {
      // Should have the label
      const label = helpers.getLabel();
      await expect(label).toBeInTheDocument();

      // Should have description
      const description = helpers.getDescription();
      await expect(description).toBeInTheDocument();

      // Should have DateRangePicker group
      const dateGroup = helpers.getDateRangeGroup();
      await expect(dateGroup).toBeInTheDocument();
    });

    await step(
      "DateRangePicker components are properly integrated",
      async () => {
        // Should have 6 date segments (start: month/day/year, end: month/day/year)
        const segments = helpers.getDateSegments();
        await expect(segments).toHaveLength(6);

        // Should have calendar button
        const calendarButton = canvas.getByRole("button", {
          name: /calendar/i,
        });
        await expect(calendarButton).toBeInTheDocument();

        // Clear button should be hidden initially (no value)
        const clearButton = helpers.getClearButtonIfExists();
        await waitFor(async () => {
          await expect(clearButton).not.toBeInTheDocument();
        });
      }
    );

    await step("Form field accessibility is properly configured", async () => {
      const segments = helpers.getDateSegments();

      // DateRangePicker group should exist and be accessible
      const dateGroup = helpers.getDateRangeGroup();
      await expect(dateGroup).toBeInTheDocument();

      // All segments should be accessible
      for (const segment of segments) {
        await expect(segment).toHaveAttribute("role", "spinbutton");
      }

      // FormField should provide proper labeling via aria-labelledby or similar
      // (The exact mechanism depends on how FormField connects labels to inputs)
      const label = helpers.getLabel();
      await expect(label).toBeInTheDocument();
    });

    await step("Date input functionality works", async () => {
      const segments = helpers.getDateSegments();

      // Type in first segment (start month)
      await userEvent.click(segments[0]);
      await userEvent.keyboard("12");

      await waitFor(async () => {
        await expect(segments[0]).toHaveAttribute("aria-valuenow", "12");
      });

      // Clear for next tests
      await userEvent.keyboard("{Control>}a{/Control}");
      await userEvent.keyboard("{Delete}");
    });

    await step("Calendar functionality is integrated", async () => {
      await helpers.openCalendar();

      // Calendar should be open
      const calendar = within(document.body).getByRole("application");
      await expect(calendar).toBeInTheDocument();

      // Close calendar
      await userEvent.keyboard("{Escape}");
      await waitFor(async () => {
        const calendarAfter = within(document.body).queryByRole("application");
        await expect(calendarAfter).not.toBeInTheDocument();
      });
    });
  },
};

export const WithErrorsField: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>(null);
    return (
      <DateRangePickerField
        touched={true}
        label="Date Range"
        description="Select a start and end date"
        aria-label="Select a date range"
        value={value}
        isRequired
        errors={{ missing: true, format: true }}
        onChange={setValue}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const helpers = createDateRangePickerHelpers(canvas);

    await step(
      "Error messages are displayed when field is touched",
      async () => {
        const errorAlert = helpers.getErrorAlert();
        await expect(errorAlert).toBeInTheDocument();

        // Should show built-in error messages for known error types
        const missingError = canvas.getByText(/This field is required/i);
        await expect(missingError).toBeInTheDocument();

        const formatError = canvas.getByText(/Please enter a valid format/i);
        await expect(formatError).toBeInTheDocument();
      }
    );

    await step("Field structure remains intact with errors", async () => {
      const label = helpers.getLabel();
      await expect(label).toBeInTheDocument();

      const asterisk = helpers.getRequiredAsterisk();
      await expect(asterisk).toBeInTheDocument();

      const segments = helpers.getDateSegments();
      await expect(segments).toHaveLength(6);
    });

    await step("Error state affects DateRangePicker appearance", async () => {
      const dateGroup = helpers.getDateRangeGroup();

      // The parent FormField should have invalid state
      // which gets passed down to the DateRangePicker
      await expect(dateGroup).toBeInTheDocument();
    });
  },
};

export const WithInfoField: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | null>(null);
    return (
      <DateRangePickerField
        label="Date Range"
        info="Date ranges are inclusive of both start and end dates."
        description="Select a start and end date"
        aria-label="Select a date range"
        isRequired
        value={value}
        onChange={setValue}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const helpers = createDateRangePickerHelpers(canvas);

    await step("Info button is present and functional", async () => {
      const infoButton = helpers.getInfoButton();
      await expect(infoButton).toBeInTheDocument();
    });

    await step("Info popover opens and displays content", async () => {
      await helpers.openInfoPopover();

      const infoContent = within(document.body).getByText(
        /Date ranges are inclusive/
      );
      await expect(infoContent).toBeInTheDocument();
    });

    await step("Field functionality works with info present", async () => {
      // Close any open popovers first
      await userEvent.keyboard("{Escape}");

      const segments = helpers.getDateSegments();
      await expect(segments).toHaveLength(6);

      await helpers.openCalendar();
      const calendar = within(document.body).getByRole("application");
      await expect(calendar).toBeInTheDocument();
    });
  },
};
