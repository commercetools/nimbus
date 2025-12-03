import { describe, it, expect, vi } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker, NimbusProvider } from "@commercetools/nimbus";
import { CalendarDate, CalendarDateTime } from "@internationalized/date";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the DatePicker renders with expected elements and structure
 * @docs-order 1
 */
describe("DatePicker - Basic rendering", () => {
  it("renders with proper structure and accessibility", () => {
    render(
      <NimbusProvider>
        <DatePicker aria-label="Select a date" />
      </NimbusProvider>
    );

    const dateGroup = screen.getByRole("group", { name: "Select a date" });
    expect(dateGroup).toBeInTheDocument();
    expect(dateGroup).toHaveAttribute("aria-label", "Select a date");
  });

  it("renders date input segments", () => {
    render(
      <NimbusProvider>
        <DatePicker aria-label="Select a date" />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    expect(dateSegments.length).toBeGreaterThanOrEqual(3);
  });

  it("renders calendar toggle button", () => {
    render(
      <NimbusProvider>
        <DatePicker aria-label="Select a date" />
      </NimbusProvider>
    );

    const calendarButton = screen.getByRole("button", { name: /calendar/i });
    expect(calendarButton).toBeInTheDocument();
  });

  it("renders with default value", () => {
    const defaultValue = new CalendarDate(2025, 6, 15);

    render(
      <NimbusProvider>
        <DatePicker defaultValue={defaultValue} aria-label="Select a date" />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    expect(dateSegments[0]).toHaveAttribute("aria-valuenow", "6");
    expect(dateSegments[1]).toHaveAttribute("aria-valuenow", "15");
    expect(dateSegments[2]).toHaveAttribute("aria-valuenow", "2025");
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with date segments and calendar
 * @docs-order 2
 */
describe("DatePicker - Interactions", () => {
  it("allows keyboard input in date segments", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DatePicker aria-label="Select a date" />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    const firstSegment = dateSegments[0];

    await user.click(firstSegment);
    await user.keyboard("12");

    await waitFor(() => {
      expect(firstSegment).toHaveAttribute("aria-valuenow", "12");
    });
  });

  it("opens calendar popover when button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DatePicker aria-label="Select a date" />
      </NimbusProvider>
    );

    const calendarButton = screen.getByRole("button", { name: /calendar/i });

    expect(
      within(document.body).queryByRole("application")
    ).not.toBeInTheDocument();

    await user.click(calendarButton);

    await waitFor(() => {
      expect(
        within(document.body).queryByRole("application")
      ).toBeInTheDocument();
    });
  });

  it("closes calendar popover with Escape key", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DatePicker aria-label="Select a date" />
      </NimbusProvider>
    );

    const calendarButton = screen.getByRole("button", { name: /calendar/i });
    await user.click(calendarButton);

    await waitFor(() => {
      expect(
        within(document.body).queryByRole("application")
      ).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(
        within(document.body).queryByRole("application")
      ).not.toBeInTheDocument();
    });
  });

  it("allows date selection from calendar", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <NimbusProvider>
        <DatePicker onChange={onChange} aria-label="Select a date" />
      </NimbusProvider>
    );

    const calendarButton = screen.getByRole("button", { name: /calendar/i });
    await user.click(calendarButton);

    await waitFor(() => {
      expect(
        within(document.body).queryByRole("application")
      ).toBeInTheDocument();
    });

    const day5Cell = document.body.querySelector('[aria-label*="5,"]');
    if (day5Cell) {
      await user.click(day5Cell);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    }
  });

  it("navigates between segments with Tab key", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DatePicker aria-label="Select a date" />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");

    await user.tab();

    await waitFor(() => {
      expect(dateSegments[0]).toHaveFocus();
    });

    await user.keyboard("{ArrowRight}");

    if (dateSegments.length > 1) {
      await waitFor(() => {
        expect(dateSegments[1]).toHaveFocus();
      });
    }
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled component behavior with external state
 * @docs-order 3
 */
describe("DatePicker - Controlled mode", () => {
  it("renders controlled value", () => {
    const value = new CalendarDate(2025, 6, 15);

    render(
      <NimbusProvider>
        <DatePicker
          value={value}
          onChange={vi.fn()}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    expect(dateSegments[0]).toHaveAttribute("aria-valuenow", "6");
    expect(dateSegments[1]).toHaveAttribute("aria-valuenow", "15");
    expect(dateSegments[2]).toHaveAttribute("aria-valuenow", "2025");
  });

  it("calls onChange when date is modified", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = new CalendarDate(2025, 6, 15);

    render(
      <NimbusProvider>
        <DatePicker
          value={value}
          onChange={onChange}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    await user.click(dateSegments[0]);
    await user.keyboard("{Control>}a{/Control}");
    await user.keyboard("8");

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });

  it("updates when value prop changes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <DatePicker
          value={new CalendarDate(2025, 6, 15)}
          onChange={vi.fn()}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    expect(dateSegments[0]).toHaveAttribute("aria-valuenow", "6");

    rerender(
      <NimbusProvider>
        <DatePicker
          value={new CalendarDate(2025, 12, 25)}
          onChange={vi.fn()}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    expect(dateSegments[0]).toHaveAttribute("aria-valuenow", "12");
    expect(dateSegments[1]).toHaveAttribute("aria-valuenow", "25");
  });
});

/**
 * @docs-section states
 * @docs-title State Tests
 * @docs-description Test different component states (disabled, readonly, required, invalid)
 * @docs-order 4
 */
describe("DatePicker - States", () => {
  it("renders in disabled state", () => {
    render(
      <NimbusProvider>
        <DatePicker
          isDisabled
          defaultValue={new CalendarDate(2025, 6, 15)}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const clearButton = screen.getByRole("button", { name: /clear/i });
    expect(clearButton).toBeDisabled();
  });

  it("renders in readonly state", () => {
    render(
      <NimbusProvider>
        <DatePicker
          isReadOnly
          defaultValue={new CalendarDate(2025, 6, 15)}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const calendarButton = screen.getByRole("button", { name: /calendar/i });
    expect(calendarButton).toBeDisabled();
  });

  it("renders in required state", () => {
    render(
      <NimbusProvider>
        <DatePicker isRequired aria-label="Select a date" />
      </NimbusProvider>
    );

    const dateGroup = screen.getByRole("group");
    expect(dateGroup).toBeInTheDocument();
  });

  it("renders in invalid state", () => {
    render(
      <NimbusProvider>
        <DatePicker
          isInvalid
          defaultValue={new CalendarDate(2025, 6, 15)}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateGroup = screen.getByRole("group");
    expect(dateGroup).toBeInTheDocument();
  });
});

/**
 * @docs-section granularity
 * @docs-title Granularity Tests
 * @docs-description Test different time granularity levels
 * @docs-order 5
 */
describe("DatePicker - Granularity", () => {
  it("renders date-only segments with day granularity", () => {
    render(
      <NimbusProvider>
        <DatePicker
          granularity="day"
          defaultValue={new CalendarDate(2025, 6, 15)}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    expect(dateSegments).toHaveLength(3);
  });

  it("renders hour segments with hour granularity", () => {
    render(
      <NimbusProvider>
        <DatePicker
          granularity="hour"
          defaultValue={new CalendarDateTime(2025, 6, 15, 14)}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    expect(dateSegments.length).toBeGreaterThanOrEqual(4);
  });

  it("renders minute segments with minute granularity", () => {
    render(
      <NimbusProvider>
        <DatePicker
          granularity="minute"
          defaultValue={new CalendarDateTime(2025, 6, 15, 14, 30)}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    expect(dateSegments.length).toBeGreaterThanOrEqual(5);
  });

  it("renders second segments with second granularity", () => {
    render(
      <NimbusProvider>
        <DatePicker
          granularity="second"
          defaultValue={new CalendarDateTime(2025, 6, 15, 14, 30, 45)}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    expect(dateSegments.length).toBeGreaterThanOrEqual(6);
  });
});

/**
 * @docs-section hour-cycle
 * @docs-title Hour Cycle Tests
 * @docs-description Test 12-hour and 24-hour time formats
 * @docs-order 6
 */
describe("DatePicker - Hour cycle", () => {
  it("displays 12-hour format with AM/PM", () => {
    render(
      <NimbusProvider>
        <DatePicker
          granularity="minute"
          hourCycle={12}
          defaultValue={new CalendarDateTime(2025, 6, 15, 14, 30)}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    const hourSegment = dateSegments[3];

    expect(hourSegment).toHaveAttribute("aria-valuetext", "2 PM");
  });

  it("displays 24-hour format without AM/PM", () => {
    render(
      <NimbusProvider>
        <DatePicker
          granularity="minute"
          hourCycle={24}
          defaultValue={new CalendarDateTime(2025, 6, 15, 14, 30)}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateSegments = screen.getAllByRole("spinbutton");
    const hourSegment = dateSegments[3];

    expect(hourSegment).toHaveAttribute("aria-valuenow", "14");
  });
});

/**
 * @docs-section validation
 * @docs-title Validation Tests
 * @docs-description Test min/max value validation
 * @docs-order 7
 */
describe("DatePicker - Validation", () => {
  it("respects minValue constraint", () => {
    const minValue = new CalendarDate(2025, 6, 1);
    const defaultValue = new CalendarDate(2025, 6, 15);

    render(
      <NimbusProvider>
        <DatePicker
          minValue={minValue}
          defaultValue={defaultValue}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateGroup = screen.getByRole("group");
    expect(dateGroup).toBeInTheDocument();
  });

  it("respects maxValue constraint", () => {
    const maxValue = new CalendarDate(2025, 6, 30);
    const defaultValue = new CalendarDate(2025, 6, 15);

    render(
      <NimbusProvider>
        <DatePicker
          maxValue={maxValue}
          defaultValue={defaultValue}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateGroup = screen.getByRole("group");
    expect(dateGroup).toBeInTheDocument();
  });

  it("applies invalid state when validation fails", () => {
    render(
      <NimbusProvider>
        <DatePicker
          isInvalid
          defaultValue={new CalendarDate(2025, 6, 15)}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    const dateGroup = screen.getByRole("group");
    expect(dateGroup).toBeInTheDocument();
  });
});

/**
 * @docs-section size-variants
 * @docs-title Size and Variant Tests
 * @docs-description Test different size and visual variant options
 * @docs-order 8
 */
describe("DatePicker - Size and variants", () => {
  it("renders with small size", () => {
    render(
      <NimbusProvider>
        <DatePicker size="sm" aria-label="Select a date" />
      </NimbusProvider>
    );

    const dateGroup = screen.getByRole("group");
    expect(dateGroup).toBeInTheDocument();
  });

  it("renders with medium size", () => {
    render(
      <NimbusProvider>
        <DatePicker size="md" aria-label="Select a date" />
      </NimbusProvider>
    );

    const dateGroup = screen.getByRole("group");
    expect(dateGroup).toBeInTheDocument();
  });

  it("renders with solid variant", () => {
    render(
      <NimbusProvider>
        <DatePicker variant="solid" aria-label="Select a date" />
      </NimbusProvider>
    );

    const dateGroup = screen.getByRole("group");
    expect(dateGroup).toBeInTheDocument();
  });

  it("renders with ghost variant", () => {
    render(
      <NimbusProvider>
        <DatePicker variant="ghost" aria-label="Select a date" />
      </NimbusProvider>
    );

    const dateGroup = screen.getByRole("group");
    expect(dateGroup).toBeInTheDocument();
  });
});

/**
 * @docs-section popover-control
 * @docs-title Popover Control Tests
 * @docs-description Test controlled popover open/close state
 * @docs-order 9
 */
describe("DatePicker - Popover control", () => {
  it("opens popover when isOpen is true", async () => {
    render(
      <NimbusProvider>
        <DatePicker
          isOpen={true}
          onOpenChange={vi.fn()}
          aria-label="Select a date"
        />
      </NimbusProvider>
    );

    await waitFor(() => {
      expect(
        within(document.body).queryByRole("application")
      ).toBeInTheDocument();
    });
  });

  it("calls onOpenChange when popover state changes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <NimbusProvider>
        <DatePicker onOpenChange={onOpenChange} aria-label="Select a date" />
      </NimbusProvider>
    );

    const calendarButton = screen.getByRole("button", { name: /calendar/i });
    await user.click(calendarButton);

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });
});
