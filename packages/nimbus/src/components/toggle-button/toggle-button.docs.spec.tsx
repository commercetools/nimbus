import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleButton, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements and states
 * @docs-order 1
 */
describe("ToggleButton - Basic rendering", () => {
  it("renders toggle button with text content", () => {
    render(
      <NimbusProvider>
        <ToggleButton>Toggle Me</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /toggle me/i });
    expect(button).toBeInTheDocument();
  });

  it("renders in unselected state by default", () => {
    render(
      <NimbusProvider>
        <ToggleButton>Toggle</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("renders with icon and text", () => {
    render(
      <NimbusProvider>
        <ToggleButton>
          <svg data-testid="test-icon" />
          Like
        </ToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <ToggleButton size="2xs">Extra Small</ToggleButton>
      </NimbusProvider>
    );

    let button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <ToggleButton size="xs">Small</ToggleButton>
      </NimbusProvider>
    );

    button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <ToggleButton size="md">Medium</ToggleButton>
      </NimbusProvider>
    );

    button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the toggle button
 * @docs-order 2
 */
describe("ToggleButton - Interactions", () => {
  it("toggles state when clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButton onChange={handleChange}>Toggle</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");

    // Click to select
    await user.click(button);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute("aria-pressed", "true");

    // Click to unselect
    await user.click(button);
    expect(handleChange).toHaveBeenCalledWith(false);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles with keyboard (Enter)", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButton onChange={handleChange}>Toggle</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    button.focus();

    await user.keyboard("{Enter}");
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("toggles with keyboard (Space)", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButton onChange={handleChange}>Toggle</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    button.focus();

    await user.keyboard(" ");
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("is focusable with Tab key", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <ToggleButton>Toggle</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).not.toHaveFocus();

    await user.tab();
    expect(button).toHaveFocus();
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled toggle button behavior
 * @docs-order 3
 */
describe("ToggleButton - Controlled mode", () => {
  it("respects controlled isSelected prop", () => {
    const { rerender } = render(
      <NimbusProvider>
        <ToggleButton isSelected={false} onChange={vi.fn()}>
          Toggle
        </ToggleButton>
      </NimbusProvider>
    );

    let button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");

    rerender(
      <NimbusProvider>
        <ToggleButton isSelected={true} onChange={vi.fn()}>
          Toggle
        </ToggleButton>
      </NimbusProvider>
    );

    button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onChange when clicked in controlled mode", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButton isSelected={false} onChange={handleChange}>
          Toggle
        </ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleChange).toHaveBeenCalledWith(true);
  });
});

/**
 * @docs-section uncontrolled-mode
 * @docs-title Uncontrolled Mode Tests
 * @docs-description Test uncontrolled toggle button behavior
 * @docs-order 4
 */
describe("ToggleButton - Uncontrolled mode", () => {
  it("starts with defaultSelected value", () => {
    render(
      <NimbusProvider>
        <ToggleButton defaultSelected={true}>Toggle</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("manages internal state when uncontrolled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButton defaultSelected={false} onChange={handleChange}>
          Toggle
        </ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute("aria-pressed", "true");

    await user.click(button);
    expect(handleChange).toHaveBeenCalledWith(false);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
});

/**
 * @docs-section states
 * @docs-title State Tests
 * @docs-description Test different states like disabled
 * @docs-order 5
 */
describe("ToggleButton - States", () => {
  it("renders disabled state", () => {
    render(
      <NimbusProvider>
        <ToggleButton isDisabled>Disabled</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("does not respond to clicks when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButton isDisabled onChange={handleChange}>
          Disabled
        </ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("cannot receive focus when disabled", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <ToggleButton isDisabled>Disabled</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    await user.tab();

    expect(button).not.toHaveFocus();
  });

  it("renders selected state", () => {
    render(
      <NimbusProvider>
        <ToggleButton isSelected>Selected</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});

/**
 * @docs-section variants
 * @docs-title Visual Variant Tests
 * @docs-description Test different visual variants and color palettes
 * @docs-order 6
 */
describe("ToggleButton - Variants", () => {
  it("renders outline variant", () => {
    render(
      <NimbusProvider>
        <ToggleButton variant="outline">Outline</ToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders ghost variant", () => {
    render(
      <NimbusProvider>
        <ToggleButton variant="ghost">Ghost</ToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with different color palettes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <ToggleButton colorPalette="primary">Primary</ToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <ToggleButton colorPalette="neutral">Neutral</ToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <ToggleButton colorPalette="critical">Critical</ToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <ToggleButton colorPalette="info">Info</ToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Test ARIA attributes and keyboard accessibility
 * @docs-order 7
 */
describe("ToggleButton - Accessibility", () => {
  it("has proper button role", () => {
    render(
      <NimbusProvider>
        <ToggleButton>Toggle</ToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has aria-pressed attribute", () => {
    render(
      <NimbusProvider>
        <ToggleButton isSelected={false}>Toggle</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("updates aria-pressed when toggled", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <ToggleButton defaultSelected={false}>Toggle</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("supports aria-label for icon-only buttons", () => {
    render(
      <NimbusProvider>
        <ToggleButton aria-label="Add to favorites">
          <svg data-testid="icon" />
        </ToggleButton>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /add to favorites/i })
    ).toBeInTheDocument();
  });

  it("is keyboard accessible", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButton onChange={handleChange}>Toggle</ToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");

    // Focus with Tab
    await user.tab();
    expect(button).toHaveFocus();

    // Activate with Enter
    await user.keyboard("{Enter}");
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
