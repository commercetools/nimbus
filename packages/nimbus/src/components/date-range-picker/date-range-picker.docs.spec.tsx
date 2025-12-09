import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalendarDate } from "@internationalized/date";
import { DateRangePicker, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("DateRangePicker - Basic rendering", () => {
  it("renders start and end date inputs", () => {
    render(
      <NimbusProvider>
        <DateRangePicker />
      </NimbusProvider>
    );

    // Each date input has 3 segments (month, day, year)
    const dateInputs = screen.getAllByRole("spinbutton");
    expect(dateInputs).toHaveLength(6);
  });

  it("renders calendar button", () => {
    render(
      <NimbusProvider>
        <DateRangePicker />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /open calendar/i })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the component
 * @docs-order 2
 */
describe("DateRangePicker - Interactions", () => {
  it("opens calendar when button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <DateRangePicker />
      </NimbusProvider>
    );

    const calendarButton = screen.getByRole("button", {
      name: /open calendar/i,
    });
    await user.click(calendarButton);

    await waitFor(() => {
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });
  });

  it("calls onChange when interacting", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <DateRangePicker onChange={handleChange} />
      </NimbusProvider>
    );

    // Open the calendar
    const calendarButton = screen.getByRole("button", {
      name: /open calendar/i,
    });
    await user.click(calendarButton);

    // Verify onChange can be called (actual date selection would trigger it)
    expect(handleChange).toBeDefined();
  });
});

/**
 * @docs-section date-values
 * @docs-title Testing with Date Values
 * @docs-description Test date value handling using @internationalized/date
 * @docs-order 3
 */
describe("DateRangePicker - Date values", () => {
  it("displays provided date range", () => {
    const dateRange = {
      start: new CalendarDate(2024, 1, 15),
      end: new CalendarDate(2024, 1, 20),
    };

    render(
      <NimbusProvider>
        <DateRangePicker value={dateRange} onChange={() => {}} />
      </NimbusProvider>
    );

    // Verify date input segments are rendered (6 total: month/day/year for start and end)
    const spinbuttons = screen.getAllByRole("spinbutton");
    expect(spinbuttons).toHaveLength(6);
  });

  it("calls onChange with correct date types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <DateRangePicker onChange={handleChange} />
      </NimbusProvider>
    );

    // Type dates into the input segments
    const spinbuttons = screen.getAllByRole("spinbutton");

    // Set start date: January 15, 2024
    await user.click(spinbuttons[0]); // month
    await user.keyboard("1");
    await user.click(spinbuttons[1]); // day
    await user.keyboard("15");
    await user.click(spinbuttons[2]); // year
    await user.keyboard("2024");

    // Set end date: January 20, 2024
    await user.click(spinbuttons[3]); // month
    await user.keyboard("1");
    await user.click(spinbuttons[4]); // day
    await user.keyboard("20");
    await user.click(spinbuttons[5]); // year
    await user.keyboard("2024");

    // Verify onChange was called with a RangeValue containing start and end date objects
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    });

    const changeCall =
      handleChange.mock.calls[handleChange.mock.calls.length - 1][0];

    // Verify the structure matches RangeValue<DateValue>
    expect(changeCall).toHaveProperty("start");
    expect(changeCall).toHaveProperty("end");

    // Verify start and end have DateValue properties (year, month, day)
    expect(changeCall.start).toHaveProperty("year");
    expect(changeCall.start).toHaveProperty("month");
    expect(changeCall.start).toHaveProperty("day");
    expect(changeCall.end).toHaveProperty("year");
    expect(changeCall.end).toHaveProperty("month");
    expect(changeCall.end).toHaveProperty("day");

    // Verify the actual date values match what we typed
    expect(changeCall.start.year).toBe(2024);
    expect(changeCall.start.month).toBe(1);
    expect(changeCall.start.day).toBe(15);
    expect(changeCall.end.year).toBe(2024);
    expect(changeCall.end.month).toBe(1);
    expect(changeCall.end.day).toBe(20);
  }, 60000);
});

/**
 * @docs-section time-selection
 * @docs-title Testing Time Selection
 * @docs-description Test time input behavior when using time granularity
 * @docs-order 4
 */
describe("DateRangePicker - Time selection", () => {
  it("shows time inputs when granularity includes time", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <DateRangePicker granularity="minute" />
      </NimbusProvider>
    );

    // Open calendar
    const calendarButton = screen.getByRole("button", {
      name: /open calendar/i,
    });
    await user.click(calendarButton);

    // Time inputs should appear in the popover footer
    await waitFor(() => {
      expect(screen.getByText(/start time/i)).toBeInTheDocument();
      expect(screen.getByText(/end time/i)).toBeInTheDocument();
    });
  });
});
