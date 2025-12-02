import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("Checkbox - Basic rendering", () => {
  it("renders checkbox element", () => {
    render(
      <NimbusProvider>
        <Checkbox>Test checkbox</Checkbox>
      </NimbusProvider>
    );

    // Verify checkbox is present
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders with label text", () => {
    render(
      <NimbusProvider>
        <Checkbox>Accept terms</Checkbox>
      </NimbusProvider>
    );

    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("renders with aria-label when no children provided", () => {
    render(
      <NimbusProvider>
        <Checkbox aria-label="Test checkbox" />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("checkbox", { name: /test checkbox/i })
    ).toBeInTheDocument();
  });

  it("renders unchecked by default", () => {
    render(
      <NimbusProvider>
        <Checkbox>Unchecked checkbox</Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });
});

/**
 * @docs-section selection-states
 * @docs-title Selection State Tests
 * @docs-description Test different selection states (checked, unchecked, indeterminate)
 * @docs-order 2
 */
describe("Checkbox - Selection states", () => {
  it("renders checked state", () => {
    render(
      <NimbusProvider>
        <Checkbox isSelected>Checked checkbox</Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("renders indeterminate state", () => {
    render(
      <NimbusProvider>
        <Checkbox isIndeterminate>Indeterminate checkbox</Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    // React Aria sets indeterminate state on the input element, not aria-checked
    expect(checkbox).toHaveProperty("indeterminate", true);
  });

  it("renders unchecked state explicitly", () => {
    render(
      <NimbusProvider>
        <Checkbox isSelected={false}>Unchecked checkbox</Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the component
 * @docs-order 3
 */
describe("Checkbox - Interactions", () => {
  it("toggles when clicked", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Checkbox>Toggle me</Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("calls onChange callback when toggled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <Checkbox onChange={handleChange}>Test checkbox</Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("toggles with spacebar when focused", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Checkbox>Keyboard toggle</Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    checkbox.focus();
    await user.keyboard(" ");

    expect(checkbox).toBeChecked();
  });

  it("toggles with enter key when focused", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Checkbox>Enter toggle</Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    checkbox.focus();
    await user.keyboard("{Enter}");

    expect(checkbox).toBeChecked();
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Testing Controlled Mode
 * @docs-description Test controlled component behavior
 * @docs-order 4
 */
describe("Checkbox - Controlled mode", () => {
  it("displays controlled value", () => {
    render(
      <NimbusProvider>
        <Checkbox isSelected={true} onChange={() => {}}>
          Controlled checkbox
        </Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("updates when controlled value changes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <Checkbox isSelected={false} onChange={() => {}}>
          Controlled checkbox
        </Checkbox>
      </NimbusProvider>
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();

    rerender(
      <NimbusProvider>
        <Checkbox isSelected={true} onChange={() => {}}>
          Controlled checkbox
        </Checkbox>
      </NimbusProvider>
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onChange when user interacts with controlled checkbox", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <Checkbox isSelected={false} onChange={handleChange}>
          Controlled checkbox
        </Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });
});

/**
 * @docs-section validation-states
 * @docs-title Testing Validation States
 * @docs-description Test different validation and state variations
 * @docs-order 5
 */
describe("Checkbox - Validation states", () => {
  it("renders disabled state", () => {
    render(
      <NimbusProvider>
        <Checkbox isDisabled>Disabled checkbox</Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <Checkbox isDisabled onChange={handleChange}>
          Disabled checkbox
        </Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("renders invalid state", () => {
    render(
      <NimbusProvider>
        <Checkbox isInvalid>Invalid checkbox</Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
  });

  it("renders checked and disabled state", () => {
    render(
      <NimbusProvider>
        <Checkbox isSelected isDisabled>
          Checked and disabled
        </Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });

  it("renders indeterminate and invalid state", () => {
    render(
      <NimbusProvider>
        <Checkbox isIndeterminate isInvalid>
          Indeterminate and invalid
        </Checkbox>
      </NimbusProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    // React Aria sets indeterminate state on the input element, not aria-checked
    expect(checkbox).toHaveProperty("indeterminate", true);
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
  });
});
