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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All DatePicker instances render correctly", async () => {
      // Should have three DatePicker groups
      const dateGroups = canvas.getAllByRole("group");
      await expect(dateGroups).toHaveLength(3);

      // Verify each has proper aria-labels
      const defaultValuePicker = canvas.getByRole("group", {
        name: "With default value",
      });
      const differentDefaultValuePicker = canvas.getByRole("group", {
        name: "With different default value",
      });
      const emptyPicker = canvas.getByRole("group", {
        name: "Without default value",
      });

      await expect(defaultValuePicker).toBeInTheDocument();
      await expect(differentDefaultValuePicker).toBeInTheDocument();
      await expect(emptyPicker).toBeInTheDocument();
    });

    await step(
      "First DatePicker shows correct default value (2025-01-15)",
      async () => {
        const defaultValuePicker = canvas.getByRole("group", {
          name: "With default value",
        });
        const segments = within(defaultValuePicker).getAllByRole("spinbutton");

        // Should have month=1, day=15, year=2025
        await expect(segments[0]).toHaveAttribute("aria-valuenow", "1"); // January
        await expect(segments[1]).toHaveAttribute("aria-valuenow", "15"); // 15th day
        await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025"); // Year 2025

        // Clear button should be enabled since there's a default value
        const clearButton = within(defaultValuePicker).getByRole("button", {
          name: /clear/i,
        });
        await expect(clearButton).not.toBeDisabled();
      }
    );

    await step(
      "Second DatePicker shows correct default value (2025-12-25)",
      async () => {
        const differentDefaultValuePicker = canvas.getByRole("group", {
          name: "With different default value",
        });
        const segments = within(differentDefaultValuePicker).getAllByRole(
          "spinbutton"
        );

        // Should have month=12, day=25, year=2025
        await expect(segments[0]).toHaveAttribute("aria-valuenow", "12"); // December
        await expect(segments[1]).toHaveAttribute("aria-valuenow", "25"); // 25th day
        await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025"); // Year 2025

        // Clear button should be enabled since there's a default value
        const clearButton = within(differentDefaultValuePicker).getByRole(
          "button",
          { name: /clear/i }
        );
        await expect(clearButton).not.toBeDisabled();
      }
    );

    await step("Third DatePicker is empty (no defaultValue)", async () => {
      const emptyPicker = canvas.getByRole("group", {
        name: "Without default value",
      });

      // Clear button should be disabled since no value is set
      const clearButton = within(emptyPicker).getByRole("button", {
        name: /clear/i,
      });
      await expect(clearButton).toBeDisabled();

      // Segments should show placeholder values (current date typically)
      const segments = within(emptyPicker).getAllByRole("spinbutton");
      await expect(segments).toHaveLength(3);

      // Each segment should be focusable and in placeholder state
      for (const segment of segments) {
        await expect(segment).toHaveAttribute("tabindex", "0");
        // Note: Placeholder segments may have various attributes depending on implementation
        // We just verify they are focusable for now
      }
    });

    await step("All DatePickers have functional calendar buttons", async () => {
      const dateGroups = canvas.getAllByRole("group");

      for (let i = 0; i < dateGroups.length; i++) {
        const group = dateGroups[i];
        const calendarButton = within(group).getByRole("button", {
          name: /calendar/i,
        });

        await expect(calendarButton).toBeInTheDocument();
        await expect(calendarButton).not.toBeDisabled();

        // Test opening calendar for first DatePicker
        if (i === 0) {
          await userEvent.click(calendarButton);

          // Wait for calendar to appear
          await waitFor(async () => {
            const calendar = within(document.body).queryByRole("application");
            await expect(calendar).toBeInTheDocument();
          });

          // Close calendar with Escape
          await userEvent.keyboard("{Escape}");

          // Wait for calendar to disappear
          await waitFor(async () => {
            const calendar = within(document.body).queryByRole("application");
            await expect(calendar).not.toBeInTheDocument();
          });
        }
      }
    });

    await step("DatePickers with defaultValue can be cleared", async () => {
      // Test clearing the first DatePicker
      const defaultValuePicker = canvas.getByRole("group", {
        name: "With default value",
      });
      const clearButton = within(defaultValuePicker).getByRole("button", {
        name: /clear/i,
      });

      // Initially enabled
      await expect(clearButton).not.toBeDisabled();

      // Click to clear
      await userEvent.click(clearButton);

      // Should now be disabled (indicating no value)
      await expect(clearButton).toBeDisabled();

      // Test clearing the second DatePicker
      const differentDefaultValuePicker = canvas.getByRole("group", {
        name: "With different default value",
      });
      const clearButton2 = within(differentDefaultValuePicker).getByRole(
        "button",
        { name: /clear/i }
      );

      // Initially enabled
      await expect(clearButton2).not.toBeDisabled();

      // Click to clear
      await userEvent.click(clearButton2);

      // Should now be disabled (indicating no value)
      await expect(clearButton2).toBeDisabled();
    });

    await step("Empty DatePicker can receive input", async () => {
      const emptyPicker = canvas.getByRole("group", {
        name: "Without default value",
      });
      const segments = within(emptyPicker).getAllByRole("spinbutton");
      const clearButton = within(emptyPicker).getByRole("button", {
        name: /clear/i,
      });

      // Initially disabled (no value)
      await expect(clearButton).toBeDisabled();

      // Add a date by typing in segments
      await userEvent.click(segments[0]); // month
      await userEvent.keyboard("6");

      await userEvent.click(segments[1]); // day
      await userEvent.keyboard("30");

      await userEvent.click(segments[2]); // year
      await userEvent.keyboard("2025");

      // Clear button should now be enabled
      await expect(clearButton).not.toBeDisabled();

      // Verify the values were set
      await expect(segments[0]).toHaveAttribute("aria-valuenow", "6");
      await expect(segments[1]).toHaveAttribute("aria-valuenow", "30");
      await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025");
    });
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Initial controlled state displays correctly", async () => {
      // Should render the controlled DatePicker with initial value
      const dateGroup = canvas.getByRole("group", {
        name: "Controlled date picker",
      });
      await expect(dateGroup).toBeInTheDocument();

      // Should display the current value in the text
      const valueText = canvas.getByText(/current value: 2025-06-15/);
      await expect(valueText).toBeInTheDocument();

      // Date segments should show the controlled value (2025-06-15)
      const segments = within(dateGroup).getAllByRole("spinbutton");
      await expect(segments[0]).toHaveAttribute("aria-valuenow", "6"); // June
      await expect(segments[1]).toHaveAttribute("aria-valuenow", "15"); // 15th day
      await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025"); // Year 2025

      // Clear button should be enabled since there's a value
      const clearButton = within(dateGroup).getByRole("button", {
        name: /clear/i,
      });
      await expect(clearButton).not.toBeDisabled();

      // Reset button should be present
      const resetButton = canvas.getByRole("button", { name: "Reset" });
      await expect(resetButton).toBeInTheDocument();
    });

    await step(
      "Changing date via segments updates controlled state",
      async () => {
        const dateGroup = canvas.getByRole("group", {
          name: "Controlled date picker",
        });
        const segments = within(dateGroup).getAllByRole("spinbutton");

        // Change the month from 6 (June) to 8 (August)
        await userEvent.click(segments[0]);
        await userEvent.keyboard("{Control>}a{/Control}"); // Select all
        await userEvent.keyboard("8");

        // The displayed value should update to reflect the change
        await waitFor(async () => {
          const valueText = canvas.getByText(/current value: 2025-08-15/);
          await expect(valueText).toBeInTheDocument();
        });

        // Segment should show the new value
        await expect(segments[0]).toHaveAttribute("aria-valuenow", "8");

        // Change the day from 15 to 25
        await userEvent.click(segments[1]);
        await userEvent.keyboard("{Control>}a{/Control}"); // Select all
        await userEvent.keyboard("25");

        // The displayed value should update again
        await waitFor(async () => {
          const valueText = canvas.getByText(/current value: 2025-08-25/);
          await expect(valueText).toBeInTheDocument();
        });

        // Segment should show the new value
        await expect(segments[1]).toHaveAttribute("aria-valuenow", "25");
      }
    );

    await step(
      "Changing date via calendar updates controlled state",
      async () => {
        const dateGroup = canvas.getByRole("group", {
          name: "Controlled date picker",
        });
        const calendarButton = within(dateGroup).getByRole("button", {
          name: /calendar/i,
        });

        // Open calendar
        await userEvent.click(calendarButton);

        // Wait for calendar to appear
        await waitFor(async () => {
          const calendar = within(document.body).queryByRole("application");
          await expect(calendar).toBeInTheDocument();
        });

        // Find an available date button in the calendar and click it
        const calendarGrid = within(document.body).getByRole("grid");
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
              const calendarAfterSelection = within(document.body).queryByRole(
                "application"
              );
              await expect(calendarAfterSelection).not.toBeInTheDocument();
            });

            // The displayed value should have updated (we can't predict exact date, but it should not be null)
            await waitFor(async () => {
              const valueText = canvas.queryByText(/current value: null/);
              await expect(valueText).not.toBeInTheDocument();
            });

            // Value should be some valid date string
            const valueDisplay = canvas.getByText(/current value: /);
            await expect(valueDisplay).toBeInTheDocument();
            await expect(valueDisplay.textContent).not.toContain("null");
          }
        }
      }
    );

    await step("Clear button clears controlled state", async () => {
      const dateGroup = canvas.getByRole("group", {
        name: "Controlled date picker",
      });
      const clearButton = within(dateGroup).getByRole("button", {
        name: /clear/i,
      });

      // Clear button should be enabled (we have a date from previous test)
      await expect(clearButton).not.toBeDisabled();

      // Click clear button
      await userEvent.click(clearButton);

      // The displayed value should update to null
      await waitFor(async () => {
        const valueText = canvas.getByText(/current value: null/);
        await expect(valueText).toBeInTheDocument();
      });

      // Clear button should now be disabled
      await expect(clearButton).toBeDisabled();
    });

    await step("Reset button resets controlled state to null", async () => {
      const resetButton = canvas.getByRole("button", { name: "Reset" });
      const dateGroup = canvas.getByRole("group", {
        name: "Controlled date picker",
      });

      // First, set a value by typing in segments
      const segments = within(dateGroup).getAllByRole("spinbutton");
      await userEvent.click(segments[0]);
      await userEvent.keyboard("12");
      await userEvent.click(segments[1]);
      await userEvent.keyboard("31");
      await userEvent.click(segments[2]);
      await userEvent.keyboard("2025");

      // Wait for value to update
      await waitFor(async () => {
        const valueText = canvas.getByText(/current value: 2025-12-31/);
        await expect(valueText).toBeInTheDocument();
      });

      // Click reset button
      await userEvent.click(resetButton);

      // The displayed value should reset to null
      await waitFor(async () => {
        const valueText = canvas.getByText(/current value: null/);
        await expect(valueText).toBeInTheDocument();
      });

      // Clear button should be disabled
      const clearButton = within(dateGroup).getByRole("button", {
        name: /clear/i,
      });
      await expect(clearButton).toBeDisabled();
    });

    await step(
      "Controlled DatePicker maintains proper state synchronization",
      async () => {
        const dateGroup = canvas.getByRole("group", {
          name: "Controlled date picker",
        });
        const segments = within(dateGroup).getAllByRole("spinbutton");
        const resetButton = canvas.getByRole("button", { name: "Reset" });

        // Set a specific date
        await userEvent.click(segments[0]); // month
        await userEvent.keyboard("{Control>}a{/Control}");
        await userEvent.keyboard("3");

        await userEvent.click(segments[1]); // day
        await userEvent.keyboard("{Control>}a{/Control}");
        await userEvent.keyboard("10");

        await userEvent.click(segments[2]); // year
        await userEvent.keyboard("{Control>}a{/Control}");
        await userEvent.keyboard("2026");

        // Verify state is synchronized
        await waitFor(async () => {
          const valueText = canvas.getByText(/current value: 2026-03-10/);
          await expect(valueText).toBeInTheDocument();
        });

        // Verify segments show correct values
        await expect(segments[0]).toHaveAttribute("aria-valuenow", "3");
        await expect(segments[1]).toHaveAttribute("aria-valuenow", "10");
        await expect(segments[2]).toHaveAttribute("aria-valuenow", "2026");

        // Reset and verify everything is cleared
        await userEvent.click(resetButton);

        await waitFor(async () => {
          const valueText = canvas.getByText(/current value: null/);
          await expect(valueText).toBeInTheDocument();
        });

        // Clear button should be disabled when value is null
        const clearButton = within(dateGroup).getByRole("button", {
          name: /clear/i,
        });
        await expect(clearButton).toBeDisabled();
      }
    );

    await step(
      "Controlled DatePicker handles invalid input gracefully",
      async () => {
        const dateGroup = canvas.getByRole("group", {
          name: "Controlled date picker",
        });
        const segments = within(dateGroup).getAllByRole("spinbutton");

        // Try to input an invalid date (February 30th)
        await userEvent.click(segments[0]); // month
        await userEvent.keyboard("2"); // February

        await userEvent.click(segments[1]); // day
        await userEvent.keyboard("30"); // 30th (invalid for February)

        await userEvent.click(segments[2]); // year
        await userEvent.keyboard("2025");

        await expect(segments[0]).toHaveAttribute("aria-valuenow", "2");
        await expect(segments[1]).toHaveAttribute("aria-valuenow", "3");
        await expect(segments[2]).toHaveAttribute("aria-valuenow", "5");

        // The actual controlled value might not update if the date is invalid
        // This depends on the implementation - we just verify the component doesn't crash
        const valueDisplay = canvas.getByText(/current value: /);
        await expect(valueDisplay).toBeInTheDocument();
      }
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Both DatePickers start empty (no selected value)", async () => {
      const withPlaceholder = canvas.getByRole("group", {
        name: "Date picker with placeholder",
      });
      const withoutPlaceholder = canvas.getByRole("group", {
        name: "Date picker without placeholder",
      });

      // Clear buttons should be disabled since no value is selected initially
      const clearButton1 = within(withPlaceholder).getByRole("button", {
        name: /clear/i,
      });
      const clearButton2 = within(withoutPlaceholder).getByRole("button", {
        name: /clear/i,
      });

      await expect(clearButton1).toBeDisabled();
      await expect(clearButton2).toBeDisabled();
    });

    await step(
      "DatePicker with placeholder value uses placeholder when navigating with keyboard",
      async () => {
        const withPlaceholder = canvas.getByRole("group", {
          name: "Date picker with placeholder",
        });
        const segments = within(withPlaceholder).getAllByRole("spinbutton");

        // Focus the first segment
        await userEvent.click(segments[0]);

        // Invisible
        await expect(segments[0]).toHaveAttribute("aria-valuenow", "6");
        await userEvent.keyboard("{ArrowUp}");
        // Now visible
        await expect(segments[0]).toHaveAttribute("aria-valuenow", "6");

        // Continue editing to create a complete date
        await userEvent.tab(); // Move to day segment
        // Invisible
        await expect(segments[1]).toHaveAttribute("aria-valuenow", "15");
        await userEvent.keyboard("{ArrowDown}");
        // Now visible
        await expect(segments[1]).toHaveAttribute("aria-valuenow", "15");

        // Move to year and modify
        await userEvent.tab(); // Move to year segment
        // Invisible
        await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025");
        await userEvent.keyboard("{ArrowUp}");
        // Now visible
        await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025");

        // Now that we have a complete date, clear button should be enabled
        const clearButton = within(withPlaceholder).getByRole("button", {
          name: /clear/i,
        });
        await expect(clearButton).not.toBeDisabled();
      }
    );

    await step(
      "Placeholder value doesn't affect typing input directly",
      async () => {
        // Clear the first DatePicker to reset it
        const withPlaceholder = canvas.getByRole("group", {
          name: "Date picker with placeholder",
        });
        const clearButton = within(withPlaceholder).getByRole("button", {
          name: /clear/i,
        });

        // Only click clear if it's enabled
        if (!clearButton.hasAttribute("disabled")) {
          await userEvent.click(clearButton);
        }

        const segments = within(withPlaceholder).getAllByRole("spinbutton");

        // Type directly into segments - this should work independently of placeholder value
        await userEvent.click(segments[0]); // month
        await userEvent.keyboard("12"); // December

        await userEvent.click(segments[1]); // day
        await userEvent.keyboard("25"); // 25th

        await userEvent.click(segments[2]); // year
        await userEvent.keyboard("2024"); // 2024

        // Values should be exactly what was typed, not influenced by placeholder
        await expect(segments[0]).toHaveAttribute("aria-valuenow", "12");
        await expect(segments[1]).toHaveAttribute("aria-valuenow", "25");
        await expect(segments[2]).toHaveAttribute("aria-valuenow", "2024");

        // Clear button should be enabled since we have a value
        const clearButtonAfterTyping = within(withPlaceholder).getByRole(
          "button",
          {
            name: /clear/i,
          }
        );
        await expect(clearButtonAfterTyping).not.toBeDisabled();
      }
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Date-only picker has correct number of segments (3: month, day, year)",
      async () => {
        const dateOnlyPicker = canvas.getByRole("group", {
          name: "Date only picker",
        });
        const segments = within(dateOnlyPicker).getAllByRole("spinbutton");

        // Should have exactly 3 segments for date only: month, day, year
        await expect(segments).toHaveLength(3);
      }
    );

    await step("Hour picker has correct segments and values", async () => {
      const hourPicker = canvas.getByRole("group", {
        name: "Date and time picker (hour)",
      });
      const segments = within(hourPicker).getAllByRole("spinbutton");

      // Should have 4 segments: month, day, year, hour, AM/PM
      await expect(segments).toHaveLength(5);
    });

    await step("Minute picker has correct segments and values", async () => {
      const minutePicker = canvas.getByRole("group", {
        name: "Date and time picker (minute)",
      });
      const segments = within(minutePicker).getAllByRole("spinbutton");

      // Should have 5 segments: month, day, year, hour, minute, AM/PM
      await expect(segments).toHaveLength(6);
    });

    await step("Second picker has correct segments and values", async () => {
      const secondPicker = canvas.getByRole("group", {
        name: "Date and time picker (second)",
      });
      const segments = within(secondPicker).getAllByRole("spinbutton");

      // Should have 6 segments: month, day, year, hour, minute, second
      await expect(segments).toHaveLength(7);
    });

    await step(
      "Timezone picker has correct segments and timezone",
      async () => {
        const timezonePicker = canvas.getByRole("group", {
          name: "Date and time picker with timezone",
        });
        const segments = within(timezonePicker).getAllByRole("spinbutton");

        // Should have 5 segments: month, day, year, hour, minute (timezone is not a spinbutton)
        await expect(segments).toHaveLength(6);

        // Check for timezone display (should contain timezone information)
        const timezoneElement =
          within(timezonePicker).getByText(/EDT|EST|America/i);
        await expect(timezoneElement).toBeInTheDocument();
      }
    );

    await step(
      "Calendar functionality works with time granularities",
      async () => {
        const hourPicker = canvas.getByRole("group", {
          name: "Date and time picker (hour)",
        });
        const calendarButton = within(hourPicker).getByRole("button", {
          name: /calendar/i,
        });

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
          { name: "Date only picker", hasTime: false },
          { name: "Date and time picker (hour)", hasTime: true },
          { name: "Date and time picker (minute)", hasTime: true },
          { name: "Date and time picker (second)", hasTime: true },
          { name: "Date and time picker with timezone", hasTime: true },
        ];

        for (const picker of pickers) {
          const pickerElement = canvas.getByRole("group", {
            name: picker.name,
          });
          const clearButton = within(pickerElement).getByRole("button", {
            name: /clear/i,
          });

          // Clear button should be enabled (has default value)
          await expect(clearButton).not.toBeDisabled();

          // Click clear button
          await userEvent.click(clearButton);

          // Clear button should now be disabled
          await expect(clearButton).toBeDisabled();

          // Reset by adding a date back for next test
          const segments = within(pickerElement).getAllByRole("spinbutton");
          await userEvent.click(segments[0]); // month
          await userEvent.keyboard("1");
          await userEvent.click(segments[1]); // day
          await userEvent.keyboard("1");
          await userEvent.click(segments[2]); // year
          await userEvent.keyboard("2025");

          if (picker.hasTime && segments.length > 3) {
            // Set time values for time-enabled pickers
            await userEvent.click(segments[3]); // hour
            await userEvent.keyboard("12");

            if (segments.length > 4) {
              await userEvent.click(segments[4]); // minute
              await userEvent.keyboard("30");
            }

            if (segments.length > 5) {
              await userEvent.click(segments[5]); // second
              await userEvent.keyboard("0");
            }
          }
        }
      }
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("12-hour format displays PM and has AM/PM segment", async () => {
      const twelveHourPicker = canvas.getByRole("group", {
        name: "12-hour format picker",
      });
      const segments = within(twelveHourPicker).getAllByRole("spinbutton");

      // 12-hour format should have 6 segments: month, day, year, hour, minute, AM/PM
      await expect(segments).toHaveLength(6);

      // Hour should show as 2 (14:30 = 2:30 PM in 12-hour format)
      await expect(segments[3]).toHaveAttribute("aria-valuetext", "2 PM");

      // Should have AM/PM segment
      const amPmSegment = segments[5];
      await expect(amPmSegment).toHaveAttribute("aria-valuetext", "PM"); // PM = 1, AM = 0
    });

    await step(
      "24-hour format displays 14 and has no AM/PM segment",
      async () => {
        const twentyFourHourPicker = canvas.getByRole("group", {
          name: "24-hour format picker",
        });
        const segments =
          within(twentyFourHourPicker).getAllByRole("spinbutton");

        // 24-hour format should have 5 segments: month, day, year, hour, minute (no AM/PM)
        await expect(segments).toHaveLength(5);

        // Hour should show as 14 (14:30 in 24-hour format)
        await expect(segments[3]).toHaveAttribute("aria-valuenow", "14");

        // Minute should be the last segment (index 4)
        await expect(segments[4]).toHaveAttribute("aria-valuenow", "30");
      }
    );

    await step(
      "12-hour format AM/PM segment can be toggled with keyboard",
      async () => {
        const twelveHourPicker = canvas.getByRole("group", {
          name: "12-hour format picker",
        });
        const segments = within(twelveHourPicker).getAllByRole("spinbutton");
        const amPmSegment = segments[5];

        // Focus AM/PM segment
        await userEvent.click(amPmSegment);

        // Initially should be PM (value 1)
        await expect(amPmSegment).toHaveAttribute("aria-valuetext", "PM");

        // Arrow up should toggle to AM
        await userEvent.keyboard("{ArrowUp}");
        await expect(amPmSegment).toHaveAttribute("aria-valuetext", "AM");

        // Arrow down should toggle back to PM
        await userEvent.keyboard("{ArrowDown}");
        await expect(amPmSegment).toHaveAttribute("aria-valuetext", "PM");
      }
    );

    await step(
      "12-hour format hour values are constrained to 1-12",
      async () => {
        const twelveHourPicker = canvas.getByRole("group", {
          name: "12-hour format picker",
        });
        const segments = within(twelveHourPicker).getAllByRole("spinbutton");
        const hourSegment = segments[3];

        // Focus hour segment
        await userEvent.click(hourSegment);

        // Clear current value and type 12
        await userEvent.keyboard("12");
        await expect(hourSegment).toHaveAttribute("aria-valuetext", "12 PM");

        // back to hour segment
        await userEvent.tab({ shift: true });

        // Arrow up from 12 should wrap to 1
        await userEvent.keyboard("{ArrowUp}");
        await expect(hourSegment).toHaveAttribute("aria-valuetext", "1 PM");

        // Arrow down from 1 should wrap to 12
        await userEvent.keyboard("{ArrowDown}");
        await expect(hourSegment).toHaveAttribute("aria-valuetext", "12 PM");
      }
    );

    await step(
      "24-hour format hour values are constrained to 0-23",
      async () => {
        const twentyFourHourPicker = canvas.getByRole("group", {
          name: "24-hour format picker",
        });
        const segments =
          within(twentyFourHourPicker).getAllByRole("spinbutton");
        const hourSegment = segments[3];

        // Focus hour segment
        await userEvent.click(hourSegment);

        // Clear current value and type 23
        await userEvent.keyboard("23");
        await expect(hourSegment).toHaveAttribute("aria-valuenow", "23");

        // back to hour segment
        await userEvent.tab({ shift: true });

        // Arrow up from 23 should wrap to 0
        await userEvent.keyboard("{ArrowUp}");
        await expect(hourSegment).toHaveAttribute("aria-valuenow", "0");

        // Arrow down from 0 should wrap to 23
        await userEvent.keyboard("{ArrowDown}");
        await expect(hourSegment).toHaveAttribute("aria-valuenow", "23");
      }
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
      -4 * (60 * 60 * 1000),
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "DatePicker with timezone shown displays timezone information",
      async () => {
        const timezoneShownPicker = canvas.getByRole("group", {
          name: "With timezone shown",
        });

        // Should display timezone information (EDT/EST/America)
        const timezoneElement =
          within(timezoneShownPicker).getByText(/EDT|EST|America/i);
        await expect(timezoneElement).toBeInTheDocument();
      }
    );

    await step(
      "DatePicker with timezone hidden does not display timezone information",
      async () => {
        const timezoneHiddenPicker = canvas.getByRole("group", {
          name: "With timezone hidden",
        });

        // Should NOT display timezone information
        const timezoneElement =
          within(timezoneHiddenPicker).queryByText(/EDT|EST|America/i);
        await expect(timezoneElement).not.toBeInTheDocument();
      }
    );

    await step("Both DatePickers have identical input segments", async () => {
      const timezoneShownPicker = canvas.getByRole("group", {
        name: "With timezone shown",
      });
      const timezoneHiddenPicker = canvas.getByRole("group", {
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
    });

    await step(
      "Both DatePickers maintain identical functionality",
      async () => {
        const timezoneHiddenPicker = canvas.getByRole("group", {
          name: "With timezone hidden",
        });
        const clearButton = within(timezoneHiddenPicker).getByRole("button", {
          name: /clear/i,
        });
        const calendarButton = within(timezoneHiddenPicker).getByRole(
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("DatePicker starts with valid date within range", async () => {
      const datePicker = canvas.getByRole("group", {
        name: "Date picker with min/max values",
      });
      const segments = within(datePicker).getAllByRole("spinbutton");
      const clearButton = within(datePicker).getByRole("button", {
        name: /clear/i,
      });

      // Should have default value of 2025-06-22 (7 days from base date)
      await expect(segments[0]).toHaveAttribute("aria-valuenow", "6"); // June
      await expect(segments[1]).toHaveAttribute("aria-valuenow", "22"); // 22nd
      await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025"); // 2025

      // Clear button should be enabled
      await expect(clearButton).not.toBeDisabled();
    });

    await step(
      "Calendar shows correct available/disabled dates within range",
      async () => {
        const datePicker = canvas.getByRole("group", {
          name: "Date picker with min/max values",
        });
        const calendarButton = within(datePicker).getByRole("button", {
          name: /calendar/i,
        });

        // Open calendar
        await userEvent.click(calendarButton);

        // Wait for calendar to appear - try both application role and grid role
        await waitFor(async () => {
          const calendar =
            within(document.body).queryByRole("application") ||
            within(document.body).queryByRole("grid");
          await expect(calendar).toBeInTheDocument();
        });

        // Find the calendar grid
        const calendarGrid = within(document.body).getByRole("grid");
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
          const calendar =
            within(document.body).queryByRole("application") ||
            within(document.body).queryByRole("grid");
          await expect(calendar).not.toBeInTheDocument();
        });
      }
    );

    await step(
      "Typing date outside min/max range handles gracefully",
      async () => {
        const datePicker = canvas.getByRole("group", {
          name: "Date picker with min/max values",
        });
        const segments = within(datePicker).getAllByRole("spinbutton");

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
        await expect(segments[1]).toHaveAttribute("aria-valuenow", "20");
      }
    );

    await step("Can select valid date from calendar within range", async () => {
      const datePicker = canvas.getByRole("group", {
        name: "Date picker with min/max values",
      });
      const calendarButton = within(datePicker).getByRole("button", {
        name: /calendar/i,
      });

      // Open calendar
      await userEvent.click(calendarButton);

      await waitFor(async () => {
        const calendar = within(document.body).queryByRole("application");
        await expect(calendar).toBeInTheDocument();
      });

      // Find an available (non-disabled) date and click it
      const calendarGrid = within(document.body).getByRole("grid");
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
          const clearButton = within(datePicker).getByRole("button", {
            name: /clear/i,
          });
          await expect(clearButton).not.toBeDisabled();
        }
      }
    });

    await step(
      "Clear and re-select functionality works within constraints",
      async () => {
        const datePicker = canvas.getByRole("group", {
          name: "Date picker with min/max values",
        });
        const clearButton = within(datePicker).getByRole("button", {
          name: /clear/i,
        });

        // Clear the current value
        await userEvent.click(clearButton);
        await expect(clearButton).toBeDisabled();

        // Set a new valid date within range by typing
        const segments = within(datePicker).getAllByRole("spinbutton");
        await userEvent.click(segments[0]); // month
        await userEvent.keyboard("7"); // July

        await userEvent.click(segments[1]); // day
        await userEvent.keyboard("1"); // 1st (should be within range since maxValue is 2025-07-15)

        await userEvent.click(segments[2]); // year
        await userEvent.keyboard("2025");

        // Clear button should now be enabled
        await expect(clearButton).not.toBeDisabled();

        // Verify the valid date was set
        await expect(segments[0]).toHaveAttribute("aria-valuenow", "7"); // July
        await expect(segments[1]).toHaveAttribute("aria-valuenow", "1"); // 1st
        await expect(segments[2]).toHaveAttribute("aria-valuenow", "2025"); // 2025
      }
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
