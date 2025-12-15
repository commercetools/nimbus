import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "@/components/checkbox";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("Checkbox - Basic rendering", () => {
  it("renders checkbox element", () => {
    render(<Checkbox>Test checkbox</Checkbox>);
    // Verify checkbox is present
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders with label text", () => {
    render(<Checkbox>Accept terms</Checkbox>);

    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("renders with aria-label when no children provided", () => {
    render(<Checkbox aria-label="Test checkbox" />);

    expect(
      screen.getByRole("checkbox", { name: /test checkbox/i })
    ).toBeInTheDocument();
  });

  it("renders unchecked by default", () => {
    render(<Checkbox>Unchecked checkbox</Checkbox>);

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
    render(<Checkbox isSelected>Checked checkbox</Checkbox>);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("renders indeterminate state", () => {
    render(<Checkbox isIndeterminate>Indeterminate checkbox</Checkbox>);

    const checkbox = screen.getByRole("checkbox");
    // React Aria sets indeterminate state on the input element, not aria-checked
    expect(checkbox).toHaveProperty("indeterminate", true);
  });

  it("renders unchecked state explicitly", () => {
    render(<Checkbox isSelected={false}>Unchecked checkbox</Checkbox>);

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
    render(<Checkbox>Toggle me</Checkbox>);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("calls onChange callback when toggled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange}>Test checkbox</Checkbox>);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("toggles with spacebar when focused", async () => {
    const user = userEvent.setup();
    render(<Checkbox>Keyboard toggle</Checkbox>);

    const checkbox = screen.getByRole("checkbox");
    checkbox.focus();
    await user.keyboard(" ");

    expect(checkbox).toBeChecked();
  });

  it("toggles with enter key when focused", async () => {
    const user = userEvent.setup();
    render(<Checkbox>Enter toggle</Checkbox>);

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
      <Checkbox isSelected={true} onChange={() => {}}>
        Controlled checkbox
      </Checkbox>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("updates when controlled value changes", () => {
    const { rerender, unmount } = render(
      <Checkbox isSelected={false} onChange={() => {}}>
        Controlled checkbox
      </Checkbox>
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();

    // Unmount and remount with new value
    // Note: rerender doesn't automatically re-wrap with providers
    unmount();
    render(
      <Checkbox isSelected={true} onChange={() => {}}>
        Controlled checkbox
      </Checkbox>
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onChange when user interacts with controlled checkbox", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Checkbox isSelected={false} onChange={handleChange}>
        Controlled checkbox
      </Checkbox>
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
    render(<Checkbox isDisabled>Disabled checkbox</Checkbox>);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Checkbox isDisabled onChange={handleChange}>
        Disabled checkbox
      </Checkbox>
    );

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("renders invalid state", () => {
    render(<Checkbox isInvalid>Invalid checkbox</Checkbox>);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
  });

  it("renders checked and disabled state", () => {
    render(
      <Checkbox isSelected isDisabled>
        Checked and disabled
      </Checkbox>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
    expect(checkbox).toBeDisabled();
  });

  it("renders indeterminate and invalid state", () => {
    render(
      <Checkbox isIndeterminate isInvalid>
        Indeterminate and invalid
      </Checkbox>
    );

    const checkbox = screen.getByRole("checkbox");
    // React Aria sets indeterminate state on the input element, not aria-checked
    expect(checkbox).toHaveProperty("indeterminate", true);
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
  });
});
