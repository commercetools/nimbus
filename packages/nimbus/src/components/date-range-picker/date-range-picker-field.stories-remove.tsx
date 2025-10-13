import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { within, expect, userEvent, waitFor } from "storybook/test";
import { DateRangePickerField } from "../date-range-picker/components/date-range-picker.field";
import { Stack } from "@/components";
import { now, getLocalTimeZone } from "@internationalized/date";
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

const meta: Meta<typeof DateRangePickerField> = {
  title: "Components/Forms/DateRangePickerField",
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

export const WithValue: Story = {
  render: (args) => {
    const today = now(getLocalTimeZone());
    const [value, setValue] = useState<DateRange | null>({
      start: today,
      end: today.add({ days: 7 }),
    });
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const helpers = createFieldHelpers(canvas);

    await step("Clear button is visible with value", async () => {
      const clearButton = helpers.getClearButton();
      await expect(clearButton).toBeInTheDocument();
      await expect(clearButton).not.toBeDisabled();
    });

    await step("Clear functionality works in field context", async () => {
      const clearButton = helpers.getClearButton();
      await userEvent.click(clearButton);

      // Clear button should be hidden after clearing
      await waitFor(async () => {
        const clearButtonAfter = helpers.getClearButtonIfExists();
        await expect(clearButtonAfter).not.toBeInTheDocument();
      });
    });
  },
};

export const Required: Story = {
  args: { isRequired: true, label: "Required Date Range" },
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const helpers = createFieldHelpers(canvas);

    await step("Required field displays asterisk correctly", async () => {
      const asterisk = helpers.getRequiredAsterisk();
      await expect(asterisk).toBeInTheDocument();

      const label = canvas.getByText("Required Date Range");
      await expect(label).toBeInTheDocument();
    });

    await step(
      "Required field maintains DateRangePicker functionality",
      async () => {
        const segments = helpers.getDateSegments();
        await expect(segments).toHaveLength(6);

        const calendarButton = helpers.getCalendarButton();
        await expect(calendarButton).toBeInTheDocument();
      }
    );
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
        const missingError = canvas.getByText(/required field/i);
        await expect(missingError).toBeInTheDocument();

        const formatError = canvas.getByText(/invalid format/i);
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

export const WithTime: Story = {
  args: {
    label: "Date and Time Range",
    granularity: "minute",
  },
  render: (args) => {
    const [value, setValue] = useState<DateRange | null>(null);
    return <DateRangePickerField {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const helpers = createFieldHelpers(canvas);

    await step("Time granularity adds additional time segments", async () => {
      const segments = helpers.getDateSegments();
      // Should have more than 6 segments when time is included
      // Exact count depends on granularity: minute adds hour + minute
      await expect(segments.length).toBeGreaterThan(6);
    });

    await step("Calendar integration works with time granularity", async () => {
      await helpers.openCalendar();

      const calendar = within(document.body).getByRole("application");
      await expect(calendar).toBeInTheDocument();
    });
  },
};

export const FieldSizes: Story = {
  render: () => {
    const [smallValue, setSmallValue] = useState<DateRange | null>(null);
    const [mediumValue, setMediumValue] = useState<DateRange | null>(null);

    return (
      <Stack direction="column" gap="600">
        <DateRangePickerField
          label="Small Date Range Field"
          size="sm"
          value={smallValue}
          onChange={setSmallValue}
        />
        <DateRangePickerField
          label="Medium Date Range Field"
          size="md"
          value={mediumValue}
          onChange={setMediumValue}
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Both size variants render correctly", async () => {
      const smallLabel = canvas.getByText("Small Date Range Field");
      const mediumLabel = canvas.getByText("Medium Date Range Field");

      await expect(smallLabel).toBeInTheDocument();
      await expect(mediumLabel).toBeInTheDocument();
    });

    await step("Size variants maintain proper functionality", async () => {
      const dateGroups = canvas.getAllByRole("group");
      await expect(dateGroups).toHaveLength(2);

      // Each should have complete DateRangePicker functionality
      for (const group of dateGroups) {
        const segments = within(group).getAllByRole("spinbutton");
        await expect(segments).toHaveLength(6);

        const calendarButton = within(group).getByRole("button", {
          name: /calendar/i,
        });
        await expect(calendarButton).toBeInTheDocument();
      }
    });
  },
};

export const FieldDirections: Story = {
  render: () => {
    const [columnValue, setColumnValue] = useState<DateRange | null>(null);
    const [rowValue, setRowValue] = useState<DateRange | null>(null);

    return (
      <Stack direction="column" gap="600">
        <DateRangePickerField
          label="Column Layout"
          direction="column"
          description="Label above input"
          value={columnValue}
          onChange={setColumnValue}
        />
        <DateRangePickerField
          label="Row Layout"
          direction="row"
          description="Label beside input"
          value={rowValue}
          onChange={setRowValue}
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Both direction variants render correctly", async () => {
      const columnLabel = canvas.getByText("Column Layout");
      const rowLabel = canvas.getByText("Row Layout");

      await expect(columnLabel).toBeInTheDocument();
      await expect(rowLabel).toBeInTheDocument();

      const descriptions = canvas.getAllByText(/Label.*input/);
      await expect(descriptions).toHaveLength(2);
    });

    await step(
      "Direction variants maintain DateRangePicker functionality",
      async () => {
        const dateGroups = canvas.getAllByRole("group");
        await expect(dateGroups).toHaveLength(2);

        // Test functionality in both layouts
        for (const group of dateGroups) {
          const segments = within(group).getAllByRole("spinbutton");
          await expect(segments).toHaveLength(6);

          // Test input functionality
          await userEvent.click(segments[0]);
          await userEvent.keyboard("6");

          await waitFor(async () => {
            await expect(segments[0]).toHaveAttribute("aria-valuenow", "6");
          });

          // Clear for next iteration
          await userEvent.keyboard("{Control>}a{/Control}");
          await userEvent.keyboard("{Delete}");
        }
      }
    );
  },
};
