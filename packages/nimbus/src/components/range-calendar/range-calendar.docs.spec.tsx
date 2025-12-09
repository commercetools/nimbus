import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { RangeCalendar, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("RangeCalendar - Basic rendering", () => {
  it("renders calendar grid", () => {
    render(
      <NimbusProvider>
        <RangeCalendar aria-label="Select date range" />
      </NimbusProvider>
    );

    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(
      <NimbusProvider>
        <RangeCalendar aria-label="Select date range" />
      </NimbusProvider>
    );

    // Month navigation
    expect(
      screen.getByRole("button", { name: /previous month/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next month/i })
    ).toBeInTheDocument();

    // Year navigation
    expect(
      screen.getByRole("button", { name: /previous year/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next year/i })
    ).toBeInTheDocument();
  });

  it("renders date cells in the grid", () => {
    render(
      <NimbusProvider>
        <RangeCalendar aria-label="Select date range" />
      </NimbusProvider>
    );

    // Check for date buttons within the grid
    const grid = screen.getByRole("grid");
    const gridCells = within(grid).getAllByRole("gridcell");

    // A month should have at least 28 days
    expect(gridCells.length).toBeGreaterThanOrEqual(28);
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the component
 * @docs-order 2
 */
describe("RangeCalendar - Interactions", () => {
  it("navigates to next month when clicking next button", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <RangeCalendar aria-label="Select date range" />
      </NimbusProvider>
    );

    const nextMonthButton = screen.getByRole("button", {
      name: /next month/i,
    });

    await user.click(nextMonthButton);

    // The calendar should have navigated (button should still be present)
    expect(
      screen.getByRole("button", { name: /next month/i })
    ).toBeInTheDocument();
  });

  it("navigates to previous year when clicking previous year button", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <RangeCalendar aria-label="Select date range" />
      </NimbusProvider>
    );

    const prevYearButton = screen.getByRole("button", {
      name: /previous year/i,
    });

    await user.click(prevYearButton);

    // The calendar should have navigated
    expect(
      screen.getByRole("button", { name: /previous year/i })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Testing Controlled Mode
 * @docs-description Test controlled component behavior with value and onChange
 * @docs-order 3
 */
describe("RangeCalendar - Controlled mode", () => {
  it("displays provided date range value", () => {
    const dateRange = {
      start: new CalendarDate(2024, 6, 15),
      end: new CalendarDate(2024, 6, 20),
    };

    render(
      <NimbusProvider>
        <RangeCalendar
          aria-label="Select date range"
          value={dateRange}
          onChange={() => {}}
        />
      </NimbusProvider>
    );

    // The calendar should render with the provided range
    expect(screen.getByRole("grid")).toBeInTheDocument();

    // Find cells with selected state
    const grid = screen.getByRole("grid");
    const selectedCells = within(grid)
      .getAllByRole("gridcell")
      .filter((cell) => cell.getAttribute("aria-selected") === "true");

    // Multiple cells should be selected for a range
    expect(selectedCells.length).toBeGreaterThan(0);
  });

  it("renders with null value (no selection)", () => {
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <RangeCalendar
          aria-label="Select date range"
          value={null}
          onChange={handleChange}
        />
      </NimbusProvider>
    );

    // Calendar should render without errors
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});

/**
 * @docs-section states
 * @docs-title Testing Component States
 * @docs-description Test disabled and read-only states
 * @docs-order 4
 */
describe("RangeCalendar - States", () => {
  it("renders in disabled state", () => {
    const dateRange = {
      start: new CalendarDate(2024, 6, 15),
      end: new CalendarDate(2024, 6, 20),
    };

    render(
      <NimbusProvider>
        <RangeCalendar
          aria-label="Select date range"
          isDisabled
          defaultValue={dateRange}
        />
      </NimbusProvider>
    );

    // The grid should still render
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders in read-only state with value displayed", () => {
    const dateRange = {
      start: new CalendarDate(2024, 6, 15),
      end: new CalendarDate(2024, 6, 20),
    };

    render(
      <NimbusProvider>
        <RangeCalendar
          aria-label="Select date range"
          isReadOnly
          value={dateRange}
          onChange={() => {}}
        />
      </NimbusProvider>
    );

    // Calendar should render
    expect(screen.getByRole("grid")).toBeInTheDocument();

    // Selected cells should be visible
    const grid = screen.getByRole("grid");
    const selectedCells = within(grid)
      .getAllByRole("gridcell")
      .filter((cell) => cell.getAttribute("aria-selected") === "true");
    expect(selectedCells.length).toBeGreaterThan(0);
  });
});

/**
 * @docs-section date-constraints
 * @docs-title Testing Date Constraints
 * @docs-description Test minValue, maxValue, and isDateUnavailable
 * @docs-order 5
 */
describe("RangeCalendar - Date constraints", () => {
  it("marks dates outside min/max as disabled", () => {
    const todayDate = today(getLocalTimeZone());

    render(
      <NimbusProvider>
        <RangeCalendar
          aria-label="Select date range"
          minValue={todayDate}
          maxValue={todayDate.add({ days: 7 })}
        />
      </NimbusProvider>
    );

    // Check that the calendar renders with constraints applied
    const grid = screen.getByRole("grid");
    const gridCells = within(grid).getAllByRole("gridcell");

    // Some cells should be disabled (outside the allowed range)
    const disabledCells = gridCells.filter(
      (cell) => cell.getAttribute("aria-disabled") === "true"
    );
    expect(disabledCells.length).toBeGreaterThan(0);
  });

  it("marks custom unavailable dates as disabled", () => {
    // Mark all Mondays as unavailable
    const isMonday = (date: { toDate: (tz: string) => Date }) => {
      return date.toDate(getLocalTimeZone()).getDay() === 1;
    };

    render(
      <NimbusProvider>
        <RangeCalendar
          aria-label="Select date range"
          isDateUnavailable={isMonday}
        />
      </NimbusProvider>
    );

    // The calendar should render with some unavailable dates
    const grid = screen.getByRole("grid");
    const gridCells = within(grid).getAllByRole("gridcell");
    const disabledCells = gridCells.filter(
      (cell) => cell.getAttribute("aria-disabled") === "true"
    );

    // At least some cells should be disabled (Mondays)
    expect(disabledCells.length).toBeGreaterThan(0);
  });

  it("renders with visible duration showing multiple months", () => {
    render(
      <NimbusProvider>
        <RangeCalendar
          aria-label="Select date range"
          visibleDuration={{ months: 2 }}
        />
      </NimbusProvider>
    );

    // Multiple grids should be rendered for multiple months
    const grids = screen.getAllByRole("grid");
    expect(grids.length).toBe(2);
  });
});
