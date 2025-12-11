import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioInput, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("RadioInput - Basic rendering", () => {
  it("renders radio group with options", () => {
    render(
      <NimbusProvider>
        <RadioInput.Root name="test-radio" aria-label="Test selection">
          <RadioInput.Option value="option1">Option 1</RadioInput.Option>
          <RadioInput.Option value="option2">Option 2</RadioInput.Option>
        </RadioInput.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /option 1/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /option 2/i })
    ).toBeInTheDocument();
  });

  it("renders with default value selected", () => {
    render(
      <NimbusProvider>
        <RadioInput.Root
          name="test-radio"
          defaultValue="option1"
          aria-label="Test selection"
        >
          <RadioInput.Option value="option1">Option 1</RadioInput.Option>
          <RadioInput.Option value="option2">Option 2</RadioInput.Option>
        </RadioInput.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("radio", { name: /option 1/i })).toBeChecked();
    expect(screen.getByRole("radio", { name: /option 2/i })).not.toBeChecked();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the component
 * @docs-order 2
 */
describe("RadioInput - Interactions", () => {
  it("calls onChange when option is selected", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <RadioInput.Root
          name="test-radio"
          onChange={handleChange}
          aria-label="Test selection"
        >
          <RadioInput.Option value="option1">Option 1</RadioInput.Option>
          <RadioInput.Option value="option2">Option 2</RadioInput.Option>
        </RadioInput.Root>
      </NimbusProvider>
    );

    const option2 = screen.getByRole("radio", { name: /option 2/i });
    await user.click(option2);

    expect(handleChange).toHaveBeenCalledWith("option2");
  });

  it("allows only one option to be selected at a time", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <RadioInput.Root
          name="test-radio"
          defaultValue="option1"
          aria-label="Test selection"
        >
          <RadioInput.Option value="option1">Option 1</RadioInput.Option>
          <RadioInput.Option value="option2">Option 2</RadioInput.Option>
          <RadioInput.Option value="option3">Option 3</RadioInput.Option>
        </RadioInput.Root>
      </NimbusProvider>
    );

    const option1 = screen.getByRole("radio", { name: /option 1/i });
    const option2 = screen.getByRole("radio", { name: /option 2/i });
    const option3 = screen.getByRole("radio", { name: /option 3/i });

    expect(option1).toBeChecked();
    expect(option2).not.toBeChecked();
    expect(option3).not.toBeChecked();

    await user.click(option2);

    await waitFor(() => {
      expect(option1).not.toBeChecked();
      expect(option2).toBeChecked();
      expect(option3).not.toBeChecked();
    });
  });

  it("supports keyboard navigation with arrow keys", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <RadioInput.Root name="test-radio" aria-label="Test selection">
          <RadioInput.Option value="option1">Option 1</RadioInput.Option>
          <RadioInput.Option value="option2">Option 2</RadioInput.Option>
        </RadioInput.Root>
      </NimbusProvider>
    );

    const option1 = screen.getByRole("radio", { name: /option 1/i });
    const option2 = screen.getByRole("radio", { name: /option 2/i });

    // Tab to focus the first option
    await user.tab();
    expect(option1).toHaveFocus();

    // Use arrow key to navigate to next option
    await user.keyboard("{ArrowDown}");
    expect(option2).toHaveFocus();

    // Select with Space
    await user.keyboard(" ");
    expect(option2).toBeChecked();
  });
});

/**
 * @docs-section disabled-state
 * @docs-title Testing Disabled State
 * @docs-description Test disabled state behavior
 * @docs-order 3
 */
describe("RadioInput - Disabled state", () => {
  it("prevents interaction when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <RadioInput.Root
          name="test-radio"
          isDisabled
          onChange={handleChange}
          aria-label="Test selection"
        >
          <RadioInput.Option value="option1">Option 1</RadioInput.Option>
          <RadioInput.Option value="option2">Option 2</RadioInput.Option>
        </RadioInput.Root>
      </NimbusProvider>
    );

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toHaveAttribute("aria-disabled", "true");

    const option1 = screen.getByRole("radio", { name: /option 1/i });
    await user.click(option1);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not receive focus when disabled", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <RadioInput.Root
          name="test-radio"
          isDisabled
          aria-label="Test selection"
        >
          <RadioInput.Option value="option1">Option 1</RadioInput.Option>
        </RadioInput.Root>
      </NimbusProvider>
    );

    await user.tab();
    const option1 = screen.getByRole("radio", { name: /option 1/i });
    expect(option1).not.toHaveFocus();
  });
});

/**
 * @docs-section invalid-state
 * @docs-title Testing Invalid State
 * @docs-description Test invalid state behavior
 * @docs-order 4
 */
describe("RadioInput - Invalid state", () => {
  it("applies invalid styling and attributes", () => {
    render(
      <NimbusProvider>
        <RadioInput.Root
          name="test-radio"
          isInvalid
          aria-label="Test selection"
        >
          <RadioInput.Option value="option1">Option 1</RadioInput.Option>
          <RadioInput.Option value="option2">Option 2</RadioInput.Option>
        </RadioInput.Root>
      </NimbusProvider>
    );

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toHaveAttribute("aria-invalid", "true");
  });
});
