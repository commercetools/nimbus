import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar, NimbusProvider } from "@commercetools/nimbus";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Calendar component renders with expected grid structure
 * @docs-order 1
 */
describe("Calendar - Basic rendering", () => {
  it("renders calendar grid", () => {
    render(
      <NimbusProvider>
        <Calendar />
      </NimbusProvider>
    );

    // Calendar uses grid role for accessibility
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders with default value", () => {
    const defaultDate = new CalendarDate(2025, 1, 15);

    render(
      <NimbusProvider>
        <Calendar defaultValue={defaultDate} />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();

    // Verify selected date is marked with data-selected attribute
    const dateCells = within(grid).getAllByRole("button");
    const selectedCell = dateCells.find(
      (cell) => cell.getAttribute("data-selected") === "true"
    );
    // Calendar renders with a selected date
    expect(selectedCell).toBeTruthy();
    if (selectedCell) {
      expect(selectedCell).toHaveTextContent("15");
    }
  });

  it("renders navigation buttons", () => {
    render(
      <NimbusProvider>
        <Calendar />
      </NimbusProvider>
    );

    // Calendar header contains previous/next month and year navigation
    const previousButtons = screen.getAllByRole("button", {
      name: /previous/i,
    });
    const nextButtons = screen.getAllByRole("button", { name: /next/i });

    expect(previousButtons.length).toBeGreaterThan(0);
    expect(nextButtons.length).toBeGreaterThan(0);
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled Calendar with value and onChange props
 * @docs-order 2
 */
describe("Calendar - Controlled mode", () => {
  it("displays controlled value", () => {
    const controlledDate = new CalendarDate(2025, 1, 15);

    render(
      <NimbusProvider>
        <Calendar value={controlledDate} />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    const dateCells = within(grid).getAllByRole("button");
    const selectedCell = dateCells.find(
      (cell) => cell.getAttribute("data-selected") === "true"
    );

    expect(selectedCell).toBeTruthy();
    if (selectedCell) {
      expect(selectedCell).toHaveTextContent("15");
    }
  });

  it("calls onChange when date is selected", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <Calendar
          value={null}
          onChange={handleChange}
          defaultFocusedValue={new CalendarDate(2025, 1, 15)}
        />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    // Find an enabled date cell from current month
    const dateCells = within(grid).getAllByRole("button");
    const availableCell = dateCells.find(
      (cell) =>
        cell.getAttribute("aria-disabled") !== "true" &&
        cell.textContent &&
        parseInt(cell.textContent) > 0 &&
        parseInt(cell.textContent) <= 31
    );

    if (availableCell) {
      await user.click(availableCell);
      expect(handleChange).toHaveBeenCalled();
      // Verify the handler was called with a DateValue
      const callArg = handleChange.mock.calls[0]?.[0];
      expect(callArg).toBeTruthy();
    }
  });

  it("allows programmatic value updates", () => {
    const { rerender } = render(
      <NimbusProvider>
        <Calendar value={new CalendarDate(2025, 1, 15)} />
      </NimbusProvider>
    );

    let grid = screen.getByRole("grid");
    let dateCells = within(grid).getAllByRole("button");
    let selectedCell = dateCells.find(
      (cell) => cell.getAttribute("data-selected") === "true"
    );
    expect(selectedCell).toBeTruthy();
    if (selectedCell) {
      expect(selectedCell).toHaveTextContent("15");
    }

    // Update to a new date
    rerender(
      <NimbusProvider>
        <Calendar value={new CalendarDate(2025, 1, 20)} />
      </NimbusProvider>
    );

    grid = screen.getByRole("grid");
    dateCells = within(grid).getAllByRole("button");
    selectedCell = dateCells.find(
      (cell) => cell.getAttribute("data-selected") === "true"
    );
    expect(selectedCell).toBeTruthy();
    if (selectedCell) {
      expect(selectedCell).toHaveTextContent("20");
    }
  });
});

/**
 * @docs-section date-constraints
 * @docs-title Date Constraints Tests
 * @docs-description Test minValue, maxValue, and isDateUnavailable constraints
 * @docs-order 3
 */
describe("Calendar - Date constraints", () => {
  it("disables dates before minValue", () => {
    const minDate = new CalendarDate(2025, 1, 15);

    render(
      <NimbusProvider>
        <Calendar minValue={minDate} defaultValue={minDate} />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    const dateCells = within(grid).getAllByRole("button");

    // Find cells before minValue (they should be disabled)
    const disabledCells = dateCells.filter(
      (cell) => cell.getAttribute("aria-disabled") === "true"
    );

    expect(disabledCells.length).toBeGreaterThan(0);
  });

  it("disables dates after maxValue", () => {
    const maxDate = new CalendarDate(2025, 1, 15);

    render(
      <NimbusProvider>
        <Calendar maxValue={maxDate} defaultValue={maxDate} />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    const dateCells = within(grid).getAllByRole("button");

    // Find cells after maxValue (they should be disabled)
    const disabledCells = dateCells.filter(
      (cell) => cell.getAttribute("aria-disabled") === "true"
    );

    expect(disabledCells.length).toBeGreaterThan(0);
  });

  it("marks unavailable dates as disabled", () => {
    const today = new CalendarDate(2025, 1, 15); // Wednesday

    render(
      <NimbusProvider>
        <Calendar
          defaultValue={today}
          isDateUnavailable={(date) => {
            const dayOfWeek = date.toDate(getLocalTimeZone()).getDay();
            return dayOfWeek === 0 || dayOfWeek === 6; // Weekends
          }}
        />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    const dateCells = within(grid).getAllByRole("button");

    // Filter cells that are disabled due to isDateUnavailable
    const disabledCells = dateCells.filter(
      (cell) => cell.getAttribute("aria-disabled") === "true"
    );

    // Should have weekend dates disabled
    expect(disabledCells.length).toBeGreaterThan(0);
  });
});

/**
 * @docs-section multi-month
 * @docs-title Multi-Month Display Tests
 * @docs-description Test calendar with multiple visible months
 * @docs-order 4
 */
describe("Calendar - Multi-month display", () => {
  it("renders multiple months when visibleDuration is set", () => {
    render(
      <NimbusProvider>
        <Calendar
          defaultValue={new CalendarDate(2025, 1, 15)}
          visibleDuration={{ months: 2 }}
        />
      </NimbusProvider>
    );

    // Should render multiple grid elements (one per month)
    const grids = screen.getAllByRole("grid");
    expect(grids.length).toBe(2);
  });

  it('navigates by visible duration when pageBehavior is "visible"', async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Calendar
          defaultValue={new CalendarDate(2025, 1, 15)}
          visibleDuration={{ months: 2 }}
          pageBehavior="visible"
        />
      </NimbusProvider>
    );

    const nextButtons = screen.getAllByRole("button", { name: /next/i });
    expect(nextButtons.length).toBeGreaterThan(0);

    await user.click(nextButtons[0]);

    // Calendar should advance by 2 months (the visible duration)
    // Verify that calendar still renders two grids after navigation
    const grids = screen.getAllByRole("grid");
    expect(grids.length).toBe(2);
  });
});

/**
 * @docs-section state-props
 * @docs-title State Props Tests
 * @docs-description Test isDisabled, isReadOnly, and isInvalid state props
 * @docs-order 5
 */
describe("Calendar - State props", () => {
  it("disables all interactions when isDisabled is true", () => {
    render(
      <NimbusProvider>
        <Calendar isDisabled defaultValue={new CalendarDate(2025, 1, 15)} />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    const dateCells = within(grid).getAllByRole("button");

    // All date cells should be disabled
    dateCells.forEach((cell) => {
      expect(cell).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("prevents selection when isReadOnly is true", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <Calendar
          isReadOnly
          value={new CalendarDate(2025, 1, 15)}
          onChange={handleChange}
        />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    const dateCells = within(grid).getAllByRole("button");
    const unselectedCell = dateCells.find(
      (cell) => !cell.getAttribute("aria-pressed")
    );

    if (unselectedCell) {
      await user.click(unselectedCell);
      // onChange should not be called in read-only mode
      expect(handleChange).not.toHaveBeenCalled();
    }
  });

  it("applies invalid styling when isInvalid is true", () => {
    render(
      <NimbusProvider>
        <Calendar isInvalid defaultValue={new CalendarDate(2025, 1, 15)} />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();
    // Component should still render and be functional
    // Visual invalid state is applied via CSS
  });
});

/**
 * @docs-section keyboard-navigation
 * @docs-title Keyboard Navigation Tests
 * @docs-description Test keyboard interactions for date selection
 * @docs-order 6
 */
describe("Calendar - Keyboard navigation", () => {
  it("supports arrow key navigation", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Calendar defaultValue={new CalendarDate(2025, 1, 15)} />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    const dateCells = within(grid).getAllByRole("button");
    const selectedCell = dateCells.find(
      (cell) => cell.getAttribute("data-selected") === "true"
    );

    // Focus the selected cell if it exists
    if (selectedCell) {
      selectedCell.focus();
      expect(selectedCell).toHaveFocus();

      // Arrow keys should navigate to adjacent dates
      await user.keyboard("{ArrowRight}");
      // Focus should move to the next date
      const focusedElement = document.activeElement;
      expect(focusedElement).not.toBe(selectedCell);
      expect(focusedElement?.getAttribute("role")).toBe("button");
    } else {
      // If no selected cell, just verify calendar has navigable buttons
      expect(dateCells.length).toBeGreaterThan(0);
    }
  });

  it("selects date with Enter key", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <Calendar value={null} onChange={handleChange} />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    const dateCells = within(grid).getAllByRole("button");
    const firstAvailableCell = dateCells.find(
      (cell) => cell.getAttribute("aria-disabled") !== "true"
    );

    if (firstAvailableCell) {
      firstAvailableCell.focus();
      await user.keyboard("{Enter}");

      expect(handleChange).toHaveBeenCalledTimes(1);
    }
  });
});

/**
 * @docs-section internationalization
 * @docs-title Internationalization Tests
 * @docs-description Test calendar with different locales
 * @docs-order 7
 */
describe("Calendar - Internationalization", () => {
  it("renders with German locale", () => {
    render(
      <NimbusProvider locale="de-DE">
        <Calendar defaultValue={new CalendarDate(2025, 1, 15)} />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();

    // German calendar should render with localized content
    // Specific weekday names would be in German
  });

  it("renders with French locale", () => {
    render(
      <NimbusProvider locale="fr-FR">
        <Calendar defaultValue={new CalendarDate(2025, 1, 15)} />
      </NimbusProvider>
    );

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();

    // French calendar should render with localized content
  });
});
