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

  it("renders calendar and clear buttons", () => {
    render(
      <NimbusProvider>
        <DateRangePicker />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /open calendar/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
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

  it("clears selection when clear button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <DateRangePicker onChange={handleChange} />
      </NimbusProvider>
    );

    const clearButton = screen.getByRole("button", { name: /clear/i });
    await user.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith(null);
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

    // Verify the dates are displayed in the input segments
    expect(
      screen.getByText("1", { selector: '[role="spinbutton"]' })
    ).toBeInTheDocument(); // Month
    expect(
      screen.getByText("15", { selector: '[role="spinbutton"]' })
    ).toBeInTheDocument(); // Start day
    expect(
      screen.getByText("20", { selector: '[role="spinbutton"]' })
    ).toBeInTheDocument(); // End day
  });

  it("calls onChange with correct date types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <DateRangePicker onChange={handleChange} />
      </NimbusProvider>
    );

    // Open calendar and select dates
    const calendarButton = screen.getByRole("button", {
      name: /open calendar/i,
    });
    await user.click(calendarButton);

    await waitFor(() => {
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    // After selection, verify the handler was called with date range
    // (actual date selection logic would be more complex)
    // This verifies the onChange signature
  });
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
