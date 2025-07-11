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

//TODO:: Review that each test provides value by making it specific to dateRange.
//TODO:: Refactor b/c there is a bit much going on.
//TODO:: Review that comments are helpful.
//TODO:: Review for missing scenarios.
//TODO: Make sure that each action has a corresponding assert.
//TODO: Hover needs some help
//TODO:

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

// Shared helper functions that work for both single and multiple DateRangePicker components scenarios.
const createDateRangePickerHelpers = (canvas: any, target?: HTMLElement) => {
  const context = target ? within(target) : canvas;

  return {
    getDateSegments: () => context.getAllByRole("spinbutton"),
    getCalendarButton: () =>
      context.findByRole("button", { name: /calendar/i }),
    getClearButton: () => context.findByRole("button", { name: /clear/i }),

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
      const dateSegments = helpers.getDateSegments();

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
      let calendar = within(document.body).queryByRole("application");
      await expect(calendar).not.toBeInTheDocument();

      await helpers.openCalendar();
      await helpers.closeCalendar();
    });

    await step("Clear button functionality works correctly", async () => {
      const dateSegments = helpers.getDateSegments();

      // Initially, clear button should be disabled (no value selected)
      const clearButton = await helpers.getClearButton();
      await waitFor(async () => {
        await expect(clearButton).toBeDisabled();
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

      // Clear button should now be enabled (actual date was entered)
      await waitFor(async () => {
        await expect(clearButton).not.toBeDisabled();
      });

      // Click clear button to remove values
      await userEvent.click(clearButton);

      // After clearing, segments return to placeholder state (showing current date)
      // Clear button should be disabled again indicating no actual value is selected
      await waitFor(async () => {
        await expect(clearButton).toBeDisabled();
      });
    });

    //TODO: Test works, but cannot get past error: Uncaught DOMException: Element.releasePointerCapture: Invalid pointer id
    // await step("Date Range selection from calendar works", async () => {
    //   await helpers.openCalendar();

    //   // Wait for the calendar grid to be present
    //   const calendarGrid = await within(document.body).findByRole("grid");
    //   await expect(calendarGrid).toBeInTheDocument();

    //   // Find all <div role="button"> elements (calendar cells)
    //   const dateDivs = within(document.body).getAllByRole("button");

    //   // Select the cell with text "5" (start date)
    //   let startCell = dateDivs.find((div) => div.textContent === "5");
    //   if (!startCell) {
    //     startCell = dateDivs[0];
    //   }
    //   if (startCell) {
    //     fireEvent.pointerDown(startCell, { pointerId: 1 });
    //     fireEvent.pointerUp(startCell, { pointerId: 1 });
    //     fireEvent.click(startCell);
    //   }

    //   // Select the cell with text "10" (end date)
    //   let endCell = dateDivs.find((div) => div.textContent === "10");
    //   if (endCell) {
    //     fireEvent.pointerDown(endCell, { pointerId: 2 });
    //     fireEvent.pointerUp(endCell, { pointerId: 2 });
    //     fireEvent.click(endCell);
    //   }

    //   // Assert that the calendar is no longer visible
    //   await waitFor(async () => {
    //     const calendarAfterSelection = within(document.body).queryByRole(
    //       "application"
    //     );
    //     await expect(calendarAfterSelection).not.toBeInTheDocument();
    //   });

    //   // Assert that the clear button is enabled
    //   const clearButton = await helpers.getClearButton();
    //   await waitFor(async () => {
    //     await expect(clearButton).not.toBeDisabled();
    //   });

    //   // Assert that the date segments contain the correct values
    //   const dateSegments = helpers.getDateSegments();
    //   const now = new Date();
    //   const month = (now.getMonth() + 1).toString();
    //   const year = now.getFullYear().toString();
    //   await waitFor(async () => {
    //     // Start date segments
    //     await expect(dateSegments[0]).toHaveAttribute("aria-valuenow", month);
    //     await expect(dateSegments[1]).toHaveAttribute("aria-valuenow", "5");
    //     await expect(dateSegments[2]).toHaveAttribute("aria-valuenow", year);
    //     // End date segments
    //     await expect(dateSegments[3]).toHaveAttribute("aria-valuenow", month);
    //     await expect(dateSegments[4]).toHaveAttribute("aria-valuenow", "10");
    //     await expect(dateSegments[5]).toHaveAttribute("aria-valuenow", year);
    //   });
    // });

    await step("Start and end date inputs work independently", async () => {
      await helpers.closeCalendar();

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

      // Clear the calendar
      const clearButton = await helpers.getClearButton();
      await userEvent.click(clearButton);

      // Type the same date (05/28/2025) into the END date input
      await userEvent.click(dateSegments[3]);
      await userEvent.keyboard("5");
      await userEvent.click(dateSegments[4]);
      await userEvent.keyboard("28");
      await userEvent.click(dateSegments[5]);
      await userEvent.keyboard("2025");

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
        const clearButton = await helpers.getClearButton();

        await waitFor(async () => {
          await expect(clearButton).toBeDisabled();
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
          await expect(clearButton).toBeDisabled();
        });
      }
    );

    await step("Empty DateRangePicker can receive input", async () => {
      const emptyPicker = await getDateRangePicker("Without default value");
      const helpers = createDateRangePickerHelpers(canvas, emptyPicker);
      const segments = helpers.getDateSegments();
      const clearButton = await helpers.getClearButton();

      await waitFor(async () => {
        await expect(clearButton).toBeDisabled();
      });

      await helpers.setDateRangeValues(
        segments,
        ["6", "30", "2025"],
        ["7", "30", "2025"]
      );

      await waitFor(async () => {
        await expect(clearButton).not.toBeDisabled();
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

    //TODO: FIX - like base test, find a way to interact with the calendar. As is, this isnt doing much..but passing.
    // await step(
    //   "Changing date range via the calendar updates controlled state",
    //   async () => {
    //     const dateGroup = await canvas.findByRole("group", {
    //       name: "Controlled date range picker",
    //     });
    //     const helpers = createDateRangePickerHelpers(canvas, dateGroup);

    //     // Open calendar
    //     await helpers.openCalendar();

    //     // Find an available date button in the calendar and click it
    //     const calendarGrid = await within(document.body).findByRole("grid");
    //     const dateCells = within(calendarGrid).getAllByRole("gridcell");
    //     const availableDates = dateCells.filter((cell) => {
    //       const button = cell.querySelector("button");
    //       return button && !button.hasAttribute("aria-disabled");
    //     });

    //     if (availableDates.length > 0) {
    //       const dateButton = availableDates[0].querySelector("button");
    //       if (dateButton) {
    //         await userEvent.click(dateButton);

    //         // Calendar should close after selection
    //         await waitFor(async () => {
    //           const calendarAfterSelection = within(document.body).queryByRole(
    //             "application"
    //           );
    //           await expect(calendarAfterSelection).not.toBeInTheDocument();
    //         }
    //         );

    //         // The displayed value should have updated (we can't predict exact date, but it should not be null)
    //         await waitFor(async () => {
    //           const valueText = canvas.queryByText(/current value: null/);
    //           await expect(valueText).not.toBeInTheDocument();
    //         });

    //         // Value should be some valid date string
    //         const valueDisplay = await canvas.findByText(/current value: /);
    //         await expect(valueDisplay).toBeInTheDocument();
    //         await expect(valueDisplay.textContent).not.toContain("null");
    //       }
    //     }
    //   }
    // );

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
        await expect(clearButton).toBeDisabled();
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

      // Clear button should be disabled
      const clearButton = await helpers.getClearButton();
      await waitFor(async () => {
        await expect(clearButton).toBeDisabled();
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

        // Clear button should be disabled when value is null
        const clearButton = await helpers.getClearButton();
        await waitFor(async () => {
          await expect(clearButton).toBeDisabled();
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

        // Try to input an invalid date (February 30th)
        await userEvent.click(segments[0]);
        await userEvent.keyboard("2");

        await userEvent.click(segments[1]);
        await userEvent.keyboard("30");

        await userEvent.click(segments[2]);
        await userEvent.keyboard("2025");

        await waitFor(async () => {
          await expect(segments[0]).toHaveAttribute("aria-valuenow", "2");
          await expect(segments[1]).toHaveAttribute("aria-valuenow", "3");
          await expect(segments[2]).toHaveAttribute("aria-valuenow", "202");
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
        <Text>
          With placeholder values (start: 2025-06-15, end: 2025-06-20)
        </Text>
        <DateRangePicker
          {...args}
          placeholderValue={{
            start: new CalendarDate(2025, 6, 15),
            end: new CalendarDate(2025, 6, 20),
          }}
          granularity="day"
          aria-label="Date range picker with placeholder values"
        />
        <Text>Without placeholder value</Text>
        <DateRangePicker
          {...args}
          aria-label="Date range picker without placeholder"
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
          name: "Date range picker without placeholder",
        });

        // Use helper functions to get clear buttons
        const helpers1 = createDateRangePickerHelpers(canvas, withPlaceholder);
        const helpers2 = createDateRangePickerHelpers(
          canvas,
          withoutPlaceholder
        );

        const clearButton1 = await helpers1.getClearButton();
        const clearButton2 = await helpers2.getClearButton();

        // Clear buttons should be disabled since no value is selected initially
        await waitFor(async () => {
          await expect(clearButton1).toBeDisabled();
          await expect(clearButton2).toBeDisabled();
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
        // Invisible - end date day should show placeholder value (20)
        await waitFor(async () => {
          await expect(segments[4]).toHaveAttribute("aria-valuenow", "20");
        });
        await userEvent.keyboard("{ArrowDown}");
        // Now visible
        await waitFor(async () => {
          await expect(segments[4]).toHaveAttribute("aria-valuenow", "20");
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
          hideTimeZone
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

    //TODO: fix - dont hide timezone, but they should show disabled
    // await step(
    //   "Timezone picker has correct segments and timezone",
    //   async () => {
    //     const timezonePicker = await canvas.findByRole("group", {
    //       name: "Date and time range picker with timezone",
    //     });
    //     const helpers = createDateRangePickerHelpers(canvas, timezonePicker);
    //     const segments = helpers.getDateSegments();

    //     // Should have 12 segments: month, day, year, hour, minute, second, timezone
    //     await expect(segments).toHaveLength(12);

    //     // Check for timezone display (should contain timezone information)
    //     const timezoneElement =
    //       within(timezonePicker).getAllByText(/EDT|EST|America/i);
    //     await expect(timezoneElement).toHaveLength(2);
    //   }
    // );

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

          // Clear button should be enabled (has default value)
          await expect(clearButton).not.toBeDisabled();

          // Click clear button
          await userEvent.click(clearButton);

          // Clear button should now be disabled
          await expect(clearButton).toBeDisabled();

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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("12-hour format displays PM and has AM/PM segment", async () => {
      const twelveHourPicker = await canvas.findByRole("group", {
        name: "12-hour format range picker",
      });
      const helpers = createDateRangePickerHelpers(canvas, twelveHourPicker);
      const segments = helpers.getDateSegments();

      // 12-hour format should have 12 segments: month, day, year, hour, minute, AM/PM (start + end)
      await expect(segments).toHaveLength(12);

      // Hour should show as 2 (14:30 = 2:30 PM in 12-hour format)
      await expect(segments[3]).toHaveAttribute("aria-valuetext", "2 PM");

      // Should have AM/PM segment
      const amPmSegment = segments[5];
      await expect(amPmSegment).toHaveAttribute("aria-valuetext", "PM"); // PM = 1, AM = 0
    });

    await step(
      "24-hour format displays 14 and has no AM/PM segment",
      async () => {
        const twentyFourHourPicker = await canvas.findByRole("group", {
          name: "24-hour format range picker",
        });
        const helpers = createDateRangePickerHelpers(
          canvas,
          twentyFourHourPicker
        );
        const segments = helpers.getDateSegments();

        // 24-hour format should have 10 segments: month, day, year, hour, minute (start + end)
        await expect(segments).toHaveLength(10);

        // Hour should show as 14 (14:30 in 24-hour format)
        await waitFor(async () => {
          await expect(segments[3]).toHaveAttribute("aria-valuenow", "14");
        });

        // Minute should be the last segment (index 4 for start, 9 for end)
        await waitFor(async () => {
          await expect(segments[4]).toHaveAttribute("aria-valuenow", "30");
        });
      }
    );

    await step(
      "12-hour format AM/PM segment can be toggled with keyboard",
      async () => {
        const twelveHourPicker = await canvas.findByRole("group", {
          name: "12-hour format range picker",
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
          name: "12-hour format range picker",
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
          name: "24-hour format range picker",
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

    await step(
      "Both DateRangePickers maintain identical functionality",
      async () => {
        const timezoneHiddenPicker = await canvas.findByRole("group", {
          name: "With timezone hidden",
        });
        const clearButton = await within(timezoneHiddenPicker).findByRole(
          "button",
          {
            name: /clear/i,
          }
        );
        const calendarButton = await within(timezoneHiddenPicker).findByRole(
          "button",
          { name: /calendar/i }
        );

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

    // await step("Can select valid date from calendar within range", async () => {
    //   const dateRangePicker = await canvas.findByRole("group", {
    //     name: "Date picker with min/max values",
    //   });
    //   const calendarButton = await within(datePicker).findByRole("button", {
    //     name: /calendar/i,
    //   });

    //   // Open calendar
    //   await userEvent.click(calendarButton);

    //   await waitFor(async () => {
    //     const calendar = within(document.body).queryByRole("application");
    //     await expect(calendar).toBeInTheDocument();
    //   });

    //   // Find an available (non-disabled) date and click it
    //   const calendarGrid = await within(document.body).findByRole("grid");
    //   const dateCells = within(calendarGrid).getAllByRole("gridcell");
    //   const availableDates = dateCells.filter((cell) => {
    //     const button = cell.querySelector("button");
    //     return button && !button.hasAttribute("aria-disabled");
    //   });

    //   if (availableDates.length > 0) {
    //     const dateButton = availableDates[0].querySelector("button");
    //     if (dateButton) {
    //       await userEvent.click(dateButton);

    //       // Calendar should close after selection
    //       await waitFor(async () => {
    //         const calendar = within(document.body).queryByRole("application");
    //         await expect(calendar).not.toBeInTheDocument();
    //       });

    //       // Clear button should be enabled after selection
    //       const clearButton = await within(datePicker).findByRole("button", {
    //         name: /clear/i,
    //       });
    //       await expect(clearButton).not.toBeDisabled();
    //     }
    //   }
    // });

    // await step(
    //   "Clear and re-select functionality works within constraints",
    //   async () => {
    //     await userEvent.keyboard("{Escape}");

    //     const dateRangePicker = await canvas.findByRole("group", {
    //       name: "Date picker with min/max values",
    //     });
    //     const clearButton = await within(datePicker).findByRole("button", {
    //       name: /clear/i,
    //     });

    //     // Clear the current value
    //     await userEvent.click(clearButton);
    //     await waitFor(async () => {
    //       await expect(clearButton).toBeDisabled();
    //     });

    //     // Set a new valid date within range by typing
    //     const segments = within(datePicker).getAllByRole("spinbutton");
    //     await userEvent.click(segments[0]); // month
    //     await userEvent.keyboard("7"); // July

    //     await userEvent.click(segments[1]); // day
    //     await userEvent.keyboard("1"); // 1st (should be within range since maxValue is 2025-07-15)

    //     await userEvent.click(segments[2]); // year
    //     await userEvent.keyboard("2025");

    //     // Clear button should now be enabled
    //     await expect(clearButton).not.toBeDisabled();

    //     // Verify the valid date was set
    //     await waitFor(async () => {
    //       await expect(segments[0]).toHaveAttribute("aria-valuenow", "7"); // July
    //       await expect(segments[1]).toHaveAttribute("aria-valuenow", "1"); // 1st
    //       await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025"); // 2025
    //     });
    //   }
    // );
  },
};

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
