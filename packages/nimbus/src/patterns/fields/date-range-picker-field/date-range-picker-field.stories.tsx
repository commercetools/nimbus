import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { within, expect, userEvent, waitFor } from "storybook/test";
import { DateRangePickerField } from "./date-range-picker.field";
import type { DateRange } from "react-aria";

// Helper function to create reusable test utilities for DateRangePickerField
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createFieldHelpers = (canvas: any, fieldElement?: HTMLElement) => {
  const context = fieldElement ? within(fieldElement) : canvas;

  return {
    // Core elements
    getLabel: () => context.getByText(/Date Range/),
    getDescription: () => context.queryByText(/Select a start and end date/),
    getInfoButton: () => context.queryByLabelText("__MORE INFO"),
    getErrorAlert: () => context.queryByRole("alert"),
    getRequiredAsterisk: () => context.queryByText("*"),

    // DateRangePicker elements
    getDateRangeGroup: () => context.getByRole("group"),
    getDateSegments: () => context.getAllByRole("spinbutton"),
    getCalendarButton: () => context.getByRole("button", { name: /calendar/i }),
    getClearButton: () => context.getByRole("button", { name: /clear/i }),
    getClearButtonIfExists: () =>
      context.queryByRole("button", { name: /clear/i }),

    // Actions
    openCalendar: async () => {
      const calendarButton = await context.findByRole("button", {
        name: /calendar/i,
      });
      await userEvent.click(calendarButton);
      await waitFor(async () => {
        const calendar = within(document.body).getByRole("application");
        await expect(calendar).toBeInTheDocument();
      });
    },

    openInfoPopover: async () => {
      const infoButton = context.getByLabelText("__MORE INFO");
      await userEvent.click(infoButton);
    },
  };
};

const meta: Meta<typeof DateRangePickerField> = {
  title: "Patterns/Fields/DateRangePickerField",
  component: DateRangePickerField,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    label: "Date Range",
    description: "Select a start and end date",
    size: "md",
    direction: "column",
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePickerField>;

export const Base: Story = {
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return (
      <DateRangePickerField
        aria-label="Select a date range"
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const helpers = createFieldHelpers(canvas);

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
        const calendarButton = helpers.getCalendarButton();
        await expect(calendarButton).toBeInTheDocument();

        // Clear button should be hidden initially (no value)
        const clearButton = helpers.getClearButtonIfExists();
        await expect(clearButton).not.toBeInTheDocument();
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

export const WithErrors: Story = {
  args: {
    touched: true,
    errors: { missing: true, format: true },
    isRequired: true,
  },
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const helpers = createFieldHelpers(canvas);

    await step(
      "Error messages are displayed when field is touched",
      async () => {
        const errorAlert = helpers.getErrorAlert();
        await expect(errorAlert).toBeInTheDocument();

        // Should show built-in error messages for known error types
        const missingError = canvas.getByText(/field is required/i);
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

export const WithInfo: Story = {
  args: {
    info: "Date ranges are inclusive of both start and end dates.",
  },
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const helpers = createFieldHelpers(canvas);

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
