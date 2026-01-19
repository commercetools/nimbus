import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Switch renders with expected elements and attributes
 * @docs-order 1
 */
describe("Switch - Basic rendering", () => {
  it("renders with label", () => {
    render(
      <NimbusProvider>
        <Switch>Enable notifications</Switch>
      </NimbusProvider>
    );

    expect(screen.getByText("Enable notifications")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("renders without visible label using aria-label", () => {
    render(
      <NimbusProvider>
        <Switch aria-label="Toggle feature" />
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAccessibleName("Toggle feature");
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the Switch
 * @docs-order 2
 */
describe("Switch - Interactions", () => {
  it("toggles when clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <Switch onChange={handleChange}>Toggle me</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();

    await user.click(switchElement);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("toggles with keyboard (Space)", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <Switch onChange={handleChange}>Keyboard toggle</Switch>
      </NimbusProvider>
    );

    // Use userEvent.tab() instead of element.focus() to avoid act() warnings
    await user.tab();
    await user.keyboard(" ");
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("maintains state through multiple toggles", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Switch defaultSelected={false}>Multi-toggle</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();

    await user.click(switchElement);
    expect(switchElement).toBeChecked();

    await user.click(switchElement);
    expect(switchElement).not.toBeChecked();
  });

  it("can be focused with Tab key", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Switch>Focusable switch</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");

    await user.tab();
    expect(switchElement).toHaveFocus();
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled state management
 * @docs-order 3
 */
describe("Switch - Controlled mode", () => {
  it("respects controlled isSelected prop", () => {
    const { rerender } = render(
      <NimbusProvider>
        <Switch isSelected={false}>Controlled switch</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();

    rerender(
      <NimbusProvider>
        <Switch isSelected={true}>Controlled switch</Switch>
      </NimbusProvider>
    );

    expect(switchElement).toBeChecked();
  });

  it("calls onChange with new value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <Switch isSelected={false} onChange={handleChange}>
          Controlled switch
        </Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    await user.click(switchElement);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("updates when isSelected prop changes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <Switch isSelected={false}>Toggle</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();

    rerender(
      <NimbusProvider>
        <Switch isSelected={true}>Toggle</Switch>
      </NimbusProvider>
    );

    expect(switchElement).toBeChecked();
  });
});

/**
 * @docs-section uncontrolled-mode
 * @docs-title Uncontrolled Mode Tests
 * @docs-description Test uncontrolled state management with defaultSelected
 * @docs-order 4
 */
describe("Switch - Uncontrolled mode", () => {
  it("uses defaultSelected for initial state", () => {
    render(
      <NimbusProvider>
        <Switch defaultSelected={true}>Default on</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeChecked();
  });

  it("manages its own state after initial render", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Switch defaultSelected={false}>Uncontrolled</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();

    await user.click(switchElement);
    expect(switchElement).toBeChecked();

    await user.click(switchElement);
    expect(switchElement).not.toBeChecked();
  });
});

/**
 * @docs-section states
 * @docs-title State Tests
 * @docs-description Test different component states (disabled, invalid, readonly)
 * @docs-order 5
 */
describe("Switch - States", () => {
  it("renders in disabled state", () => {
    render(
      <NimbusProvider>
        <Switch isDisabled>Disabled switch</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeDisabled();
  });

  it("does not respond to clicks when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <Switch isDisabled onChange={handleChange}>
          Disabled
        </Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    await user.click(switchElement);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("renders in invalid state", () => {
    render(
      <NimbusProvider>
        <Switch isInvalid>Invalid switch</Switch>
      </NimbusProvider>
    );

    const switchRoot = screen
      .getByText("Invalid switch")
      .closest("[data-slot='root']");
    expect(switchRoot).toHaveAttribute("data-invalid", "true");
  });

  it("renders in readonly state", () => {
    render(
      <NimbusProvider>
        <Switch isReadOnly isSelected={true}>
          Read-only switch
        </Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-readonly", "true");
  });

  it("does not toggle when readonly", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <Switch isReadOnly isSelected={false} onChange={handleChange}>
          Read-only
        </Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    await user.click(switchElement);

    expect(handleChange).not.toHaveBeenCalled();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify accessibility attributes and keyboard navigation
 * @docs-order 6
 */
describe("Switch - Accessibility", () => {
  it("has proper switch role", () => {
    render(
      <NimbusProvider>
        <Switch>Accessible switch</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
  });

  it("has accessible name from label", () => {
    render(
      <NimbusProvider>
        <Switch>Enable feature</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAccessibleName("Enable feature");
  });

  it("has accessible name from aria-label", () => {
    render(
      <NimbusProvider>
        <Switch aria-label="Toggle notifications" />
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAccessibleName("Toggle notifications");
  });

  it("supports aria-labelledby", () => {
    render(
      <NimbusProvider>
        <div>
          <span id="switch-label">Custom label</span>
          <Switch aria-labelledby="switch-label" />
        </div>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAccessibleName("Custom label");
  });
});

/**
 * @docs-section form-integration
 * @docs-title Form Integration Tests
 * @docs-description Test form-related functionality
 * @docs-order 7
 */
describe("Switch - Form integration", () => {
  it("supports name attribute for form submission", () => {
    render(
      <NimbusProvider>
        <Switch name="notifications">Enable notifications</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("name", "notifications");
  });

  it("supports value attribute", () => {
    render(
      <NimbusProvider>
        <Switch value="enabled">Enable feature</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("value", "enabled");
  });

  it("accepts isRequired prop", () => {
    render(
      <NimbusProvider>
        <Switch isRequired>Accept terms</Switch>
      </NimbusProvider>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
  });
});
