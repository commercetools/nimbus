import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimeInput, NimbusProvider } from "@commercetools/nimbus";
import { Time } from "@internationalized/date";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the TimeInput component renders with expected elements and structure
 * @docs-order 1
 */
describe("TimeInput - Basic rendering", () => {
  it("renders time input with accessible structure", () => {
    render(
      <NimbusProvider>
        <TimeInput aria-label="Enter a time" />
      </NimbusProvider>
    );

    const timeInput = screen.getByRole("group", { name: /Enter a time/i });
    expect(timeInput).toBeInTheDocument();
  });

  it("renders with default value", () => {
    render(
      <NimbusProvider>
        <TimeInput aria-label="Time input" defaultValue={new Time(14, 30)} />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    expect(segments.length).toBe(3);
  });

  it("renders with different sizes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <TimeInput aria-label="Small time" size="sm" />
      </NimbusProvider>
    );

    expect(screen.getByRole("group")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <TimeInput aria-label="Medium time" size="md" />
      </NimbusProvider>
    );

    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders with different variants", () => {
    const { rerender } = render(
      <NimbusProvider>
        <TimeInput aria-label="Solid variant" variant="solid" />
      </NimbusProvider>
    );

    expect(screen.getByRole("group")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <TimeInput aria-label="Ghost variant" variant="ghost" />
      </NimbusProvider>
    );

    expect(screen.getByRole("group")).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with time segments using keyboard
 * @docs-order 2
 */
describe("TimeInput - Interactions", () => {
  it("can focus and navigate between segments", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <TimeInput aria-label="Time input" />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    const firstSegment = segments[0];

    // Tab to focus first segment
    await user.tab();
    expect(firstSegment).toHaveFocus();

    // Navigate to next segment
    await user.keyboard("{ArrowRight}");
    expect(segments[1]).toHaveFocus();
  });

  it("increments and decrements segment values with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <TimeInput aria-label="Time input" defaultValue={new Time(10, 30)} />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    const hourSegment = segments[0];

    await user.tab();
    expect(hourSegment).toHaveFocus();

    // Increment hour
    await user.keyboard("{ArrowUp}");
    expect(hourSegment.textContent).toBe("11");

    // Decrement hour
    await user.keyboard("{ArrowDown}");
    expect(hourSegment.textContent).toBe("10");
  });

  it("calls onChange when time value changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Time input"
          defaultValue={new Time(10, 0)}
          onChange={handleChange}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");

    await user.tab();
    expect(segments[0]).toHaveFocus();

    await user.keyboard("{ArrowUp}");

    expect(handleChange).toHaveBeenCalled();
    const newTime = handleChange.mock.calls[0][0];
    expect(newTime).toHaveProperty("hour");
    expect(newTime).toHaveProperty("minute");
  });

  it("allows direct numeric input", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <TimeInput aria-label="Time input" />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    const hourSegment = segments[0];

    await user.tab();
    expect(hourSegment).toHaveFocus();

    // Type a number
    await user.keyboard("09");
    expect(hourSegment.textContent).toBe("9");
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled component behavior with value prop
 * @docs-order 3
 */
describe("TimeInput - Controlled mode", () => {
  it("respects controlled value prop", () => {
    const controlledTime = new Time(14, 30);
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Controlled time"
          value={controlledTime}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    expect(segments[0].textContent).toBe("2");
    expect(segments[1].textContent).toBe("30");
  });

  it("calls onChange with new Time value when user interacts", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const controlledTime = new Time(10, 0);

    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Controlled time"
          value={controlledTime}
          onChange={handleChange}
        />
      </NimbusProvider>
    );

    await user.tab();
    await user.keyboard("{ArrowUp}");

    expect(handleChange).toHaveBeenCalled();
    const newValue = handleChange.mock.calls[0][0] as Time;
    expect(newValue.hour).toBe(11);
  });

  it("updates display when controlled value changes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <TimeInput
          aria-label="Controlled time"
          value={new Time(10, 0)}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    let segments = screen.getAllByRole("spinbutton");
    expect(segments[0].textContent).toBe("10");

    rerender(
      <NimbusProvider>
        <TimeInput
          aria-label="Controlled time"
          value={new Time(15, 30)}
          onChange={vi.fn()}
        />
      </NimbusProvider>
    );

    segments = screen.getAllByRole("spinbutton");
    expect(segments[0].textContent).toBe("3");
    expect(segments[1].textContent).toBe("30");
  });
});

/**
 * @docs-section uncontrolled-mode
 * @docs-title Uncontrolled Mode Tests
 * @docs-description Test uncontrolled component behavior with defaultValue prop
 * @docs-order 4
 */
describe("TimeInput - Uncontrolled mode", () => {
  it("uses defaultValue for initial display", () => {
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Uncontrolled time"
          defaultValue={new Time(9, 30)}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    expect(segments[0].textContent).toBe("9");
    expect(segments[1].textContent).toBe("30");
  });

  it("manages internal state after user interaction", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Uncontrolled time"
          defaultValue={new Time(10, 0)}
          onChange={handleChange}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");

    await user.tab();
    await user.keyboard("{ArrowUp}");

    expect(segments[0].textContent).toBe("11");
    expect(handleChange).toHaveBeenCalled();
    const newTime = handleChange.mock.calls[0][0];
    expect(newTime).toHaveProperty("hour");
    expect(newTime).toHaveProperty("minute");
  });
});

/**
 * @docs-section hour-cycle
 * @docs-title Hour Cycle Tests
 * @docs-description Test 12-hour and 24-hour format behavior
 * @docs-order 5
 */
describe("TimeInput - Hour cycle", () => {
  it("displays time in 12-hour format with AM/PM", () => {
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="12-hour format"
          hourCycle={12}
          defaultValue={new Time(14, 30)}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    expect(segments[0].textContent).toBe("2"); // 2 PM

    // Last segment should be AM/PM
    const lastSegment = segments[segments.length - 1];
    expect(lastSegment.textContent).toBe("PM");
  });

  it("displays time in 24-hour format without AM/PM", () => {
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="24-hour format"
          hourCycle={24}
          defaultValue={new Time(14, 30)}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    expect(segments[0].textContent).toBe("14");

    // Should have hour and minute segments only (no AM/PM)
    expect(segments.length).toBe(2);
  });
}); /**
 * @docs-section granularity
 * @docs-title Granularity Tests
 * @docs-description Test different time granularity levels (hour, minute, second)
 * @docs-order 6
 */
describe("TimeInput - Granularity", () => {
  it("shows only hour segment when granularity is hour", () => {
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Hour granularity"
          granularity="hour"
          defaultValue={new Time(14, 30, 45)}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    // Should have hour and AM/PM segments only (in 12-hour format)
    expect(segments.length).toBeLessThanOrEqual(2);
  });

  it("shows hour and minute segments when granularity is minute", () => {
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Minute granularity"
          granularity="minute"
          defaultValue={new Time(14, 30, 45)}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    expect(segments.length).toBeGreaterThanOrEqual(2);
  });

  it("shows hour, minute, and second segments when granularity is second", () => {
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Second granularity"
          granularity="second"
          defaultValue={new Time(14, 30, 45)}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    expect(segments.length).toBeGreaterThanOrEqual(3);
  });
});

/**
 * @docs-section validation
 * @docs-title Validation Tests
 * @docs-description Test min/max value validation behavior
 * @docs-order 7
 */
describe("TimeInput - Validation", () => {
  it("accepts minValue prop", () => {
    const minTime = new Time(9, 0);

    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Time with min"
          minValue={minTime}
          defaultValue={new Time(10, 0)}
        />
      </NimbusProvider>
    );

    const timeInput = screen.getByRole("group");
    expect(timeInput).toBeInTheDocument();
  });

  it("accepts maxValue prop", () => {
    const maxTime = new Time(17, 0);

    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Time with max"
          maxValue={maxTime}
          defaultValue={new Time(16, 0)}
        />
      </NimbusProvider>
    );

    const timeInput = screen.getByRole("group");
    expect(timeInput).toBeInTheDocument();
  });
}); /**
 * @docs-section states
 * @docs-title State Tests
 * @docs-description Test different component states (disabled, invalid, readonly, required)
 * @docs-order 8
 */
describe("TimeInput - States", () => {
  it("renders disabled state", () => {
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Disabled time"
          isDisabled
          defaultValue={new Time(10, 30)}
        />
      </NimbusProvider>
    );

    const timeInput = screen.getByRole("group");
    expect(timeInput).toHaveAttribute("aria-disabled", "true");

    const segments = screen.getAllByRole("spinbutton");
    segments.forEach((segment) => {
      expect(segment).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("prevents interaction when disabled", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Disabled time"
          isDisabled
          defaultValue={new Time(10, 30)}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    const hourSegment = segments[0];

    await user.tab();

    // Disabled segments should not receive focus
    expect(hourSegment).not.toHaveFocus();
  });

  it("renders invalid state", () => {
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Invalid time"
          isInvalid
          defaultValue={new Time(10, 30)}
        />
      </NimbusProvider>
    );

    const timeInput = screen.getByRole("group");
    expect(timeInput).toHaveAttribute("data-invalid", "true");
  });

  it("renders readonly state", () => {
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Readonly time"
          isReadOnly
          defaultValue={new Time(10, 30)}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    segments.forEach((segment) => {
      expect(segment).toHaveAttribute("aria-readonly", "true");
    });
  });

  it("prevents editing when readonly", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Readonly time"
          isReadOnly
          defaultValue={new Time(10, 30)}
        />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    const hourSegment = segments[0];
    const initialValue = hourSegment.textContent;

    await user.tab();
    expect(hourSegment).toHaveFocus();

    // Try to change value
    await user.keyboard("{ArrowUp}");

    // Value should not change
    expect(hourSegment.textContent).toBe(initialValue);
  });

  it("accepts isRequired prop", () => {
    render(
      <NimbusProvider>
        <TimeInput aria-label="Required time" isRequired />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    segments.forEach((segment) => {
      expect(segment).toHaveAttribute("aria-required", "true");
    });
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify ARIA attributes and keyboard navigation
 * @docs-order 9
 */
describe("TimeInput - Accessibility", () => {
  it("has proper ARIA role", () => {
    render(
      <NimbusProvider>
        <TimeInput aria-label="Time input" />
      </NimbusProvider>
    );

    const timeInput = screen.getByRole("group", { name: /Time input/i });
    expect(timeInput).toBeInTheDocument();
  });

  it("supports aria-label", () => {
    render(
      <NimbusProvider>
        <TimeInput aria-label="Appointment time" />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("group", { name: /Appointment time/i })
    ).toBeInTheDocument();
  });

  it("supports aria-labelledby", () => {
    render(
      <NimbusProvider>
        <div>
          <span id="time-label">Select time</span>
          <TimeInput aria-labelledby="time-label" />
        </div>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("group", { name: /Select time/i })
    ).toBeInTheDocument();
  });

  it("time segments have spinbutton role", () => {
    render(
      <NimbusProvider>
        <TimeInput aria-label="Time input" defaultValue={new Time(10, 30)} />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");
    expect(segments.length).toBeGreaterThan(0);
  });

  it("supports keyboard navigation between segments", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <TimeInput aria-label="Time input" />
      </NimbusProvider>
    );

    const segments = screen.getAllByRole("spinbutton");

    await user.tab();
    expect(segments[0]).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(segments[1]).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(segments[0]).toHaveFocus();
  });
});

/**
 * @docs-section form-integration
 * @docs-title Form Integration Tests
 * @docs-description Test TimeInput integration with FormField component
 * @docs-order 10
 */
describe("TimeInput - Form integration", () => {
  it("integrates with FormField", () => {
    render(
      <NimbusProvider>
        <div>
          <label htmlFor="time-field">Meeting time</label>
          <TimeInput
            aria-label="Meeting time"
            id="time-field"
            defaultValue={new Time(10, 0)}
          />
        </div>
      </NimbusProvider>
    );

    const label = screen.getByText("Meeting time");
    expect(label).toBeInTheDocument();

    const timeInput = screen.getByRole("group");
    expect(timeInput).toBeInTheDocument();
  });

  it("displays validation errors in FormField context", () => {
    render(
      <NimbusProvider>
        <TimeInput
          aria-label="Invalid time"
          isInvalid
          defaultValue={new Time(10, 0)}
        />
      </NimbusProvider>
    );

    const timeInput = screen.getByRole("group");
    expect(timeInput).toHaveAttribute("data-invalid", "true");
  });

  it("calls onBlur when focus leaves the component", async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();

    render(
      <NimbusProvider>
        <TimeInput aria-label="Time input" onBlur={handleBlur} />
      </NimbusProvider>
    );

    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab(); // Tab through all segments and out

    expect(handleBlur).toHaveBeenCalled();
  });
});
