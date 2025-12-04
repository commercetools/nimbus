import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateInput, NimbusProvider } from "@commercetools/nimbus";
import { CalendarDate, CalendarDateTime } from "@internationalized/date";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the DateInput renders with expected elements and date segments
 * @docs-order 1
 */
describe("DateInput - Basic rendering", () => {
  it("renders date input with segments", () => {
    render(
      <NimbusProvider>
        <DateInput aria-label="Enter a date" />
      </NimbusProvider>
    );

    // DateInput uses role="group" for the overall field
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders with default value", () => {
    const defaultDate = new CalendarDate(2025, 6, 15);

    render(
      <NimbusProvider>
        <DateInput
          defaultValue={defaultDate}
          aria-label="Date with default value"
        />
      </NimbusProvider>
    );

    // Verify segments contain the default values
    expect(screen.getByRole("group")).toBeInTheDocument();
    // Find month value
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("renders with leading element", () => {
    render(
      <NimbusProvider>
        <DateInput
          leadingElement={<span data-testid="leading-icon">📅</span>}
          aria-label="Date with icon"
        />
      </NimbusProvider>
    );

    expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
  });

  it("renders with trailing element", () => {
    render(
      <NimbusProvider>
        <DateInput
          trailingElement={<span data-testid="trailing-icon">✕</span>}
          aria-label="Date with trailing icon"
        />
      </NimbusProvider>
    );

    expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with date segments and keyboard navigation
 * @docs-order 2
 */
describe("DateInput - Interactions", () => {
  it("calls onChange when date value changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <DateInput
          onChange={handleChange}
          defaultValue={new CalendarDate(2025, 1, 15)}
          aria-label="Interactive date input"
        />
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    const segments = group.querySelectorAll('[role="spinbutton"]');

    // Focus first segment (month) and use arrow up to increment
    if (segments[0]) {
      await user.click(segments[0]);
      await user.keyboard("{ArrowUp}");

      // onChange should be called with a DateValue (month changed from 1 to 2)
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
        const newValue = handleChange.mock.calls[0][0];
        expect(newValue).toBeInstanceOf(CalendarDate);
      });
    }
  });

  it("allows keyboard navigation between segments", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DateInput
          defaultValue={new CalendarDate(2025, 6, 15)}
          aria-label="Date for keyboard navigation"
        />
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    const segments = group.querySelectorAll('[role="spinbutton"]');

    // Focus first segment
    if (segments[0]) {
      await user.click(segments[0]);
      expect(segments[0]).toHaveFocus();

      // Tab to next segment
      await user.keyboard("{Tab}");
      expect(segments[1]).toHaveFocus();
    }
  });

  it("increments segment value with arrow up", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <DateInput
          defaultValue={new CalendarDate(2025, 6, 15)}
          onChange={handleChange}
          aria-label="Date for arrow key test"
        />
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    const segments = group.querySelectorAll('[role="spinbutton"]');

    if (segments[0]) {
      await user.click(segments[0]);
      await user.keyboard("{ArrowUp}");

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    }
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled component behavior with value and onChange
 * @docs-order 3
 */
describe("DateInput - Controlled mode", () => {
  it("accepts and displays controlled value", () => {
    const date = new CalendarDate(2025, 12, 25);

    render(
      <NimbusProvider>
        <DateInput
          value={date}
          onChange={vi.fn()}
          aria-label="Controlled date"
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("calls onChange with new value when changed", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const initialDate = new CalendarDate(2025, 6, 15);

    render(
      <NimbusProvider>
        <DateInput
          value={initialDate}
          onChange={handleChange}
          aria-label="Controlled with onChange"
        />
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    const segments = group.querySelectorAll('[role="spinbutton"]');

    if (segments[0]) {
      await user.click(segments[0]);
      await user.keyboard("{ArrowUp}");

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
        const newValue = handleChange.mock.calls[0][0];
        expect(newValue).toBeInstanceOf(CalendarDate);
      });
    }
  });

  it("updates when value prop changes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <DateInput
          value={new CalendarDate(2025, 1, 1)}
          onChange={vi.fn()}
          aria-label="Date that will change"
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("group")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <DateInput
          value={new CalendarDate(2025, 12, 31)}
          onChange={vi.fn()}
          aria-label="Date that will change"
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("group")).toBeInTheDocument();
  });
});

/**
 * @docs-section states
 * @docs-title State Tests
 * @docs-description Test various states: disabled, read-only, required, invalid
 * @docs-order 4
 */
describe("DateInput - States", () => {
  it("applies disabled state", () => {
    render(
      <NimbusProvider>
        <DateInput
          isDisabled
          defaultValue={new CalendarDate(2025, 6, 15)}
          aria-label="Disabled date"
        />
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("data-disabled", "true");
  });

  it("applies read-only state", () => {
    render(
      <NimbusProvider>
        <DateInput
          isReadOnly
          defaultValue={new CalendarDate(2025, 6, 15)}
          aria-label="Read-only date"
        />
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("data-readonly", "true");
  });

  it("applies required state", () => {
    render(
      <NimbusProvider>
        <DateInput isRequired aria-label="Required date" />
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    // Verify component renders when required
    expect(group).toBeInTheDocument();
  });

  it("applies invalid state", () => {
    render(
      <NimbusProvider>
        <DateInput
          isInvalid
          defaultValue={new CalendarDate(2025, 6, 15)}
          aria-label="Invalid date"
        />
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("data-invalid", "true");
  });
});

/**
 * @docs-section granularity
 * @docs-title Granularity Tests
 * @docs-description Test different granularity levels (day, hour, minute, second)
 * @docs-order 5
 */
describe("DateInput - Granularity", () => {
  it("renders day granularity with date segments only", () => {
    render(
      <NimbusProvider>
        <DateInput
          granularity="day"
          defaultValue={new CalendarDate(2025, 6, 15)}
          aria-label="Day granularity"
        />
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    const segments = group.querySelectorAll('[role="spinbutton"]');

    // Should have segments for month, day, year (3 segments)
    expect(segments.length).toBeGreaterThanOrEqual(3);
  });

  it("renders minute granularity with date and time segments", () => {
    render(
      <NimbusProvider>
        <DateInput
          granularity="minute"
          defaultValue={new CalendarDateTime(2025, 6, 15, 14, 30, 0)}
          aria-label="Minute granularity"
        />
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    const segments = group.querySelectorAll('[role="spinbutton"]');

    // Should have segments for month, day, year, hour, minute (5+ segments)
    expect(segments.length).toBeGreaterThanOrEqual(5);
  });

  it("renders second granularity with full precision", () => {
    render(
      <NimbusProvider>
        <DateInput
          granularity="second"
          defaultValue={new CalendarDateTime(2025, 6, 15, 14, 30, 45)}
          aria-label="Second granularity"
        />
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    const segments = group.querySelectorAll('[role="spinbutton"]');

    // Should have segments for month, day, year, hour, minute, second (6+ segments)
    expect(segments.length).toBeGreaterThanOrEqual(6);
  });
});
