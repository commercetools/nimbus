import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberInput, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("NumberInput - Basic rendering", () => {
  it("renders input element", () => {
    render(
      <NimbusProvider>
        <NumberInput aria-label="Quantity" />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox", { name: /quantity/i });
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("renders with placeholder text", () => {
    render(
      <NimbusProvider>
        <NumberInput placeholder="Enter quantity" aria-label="Quantity" />
      </NimbusProvider>
    );

    expect(screen.getByPlaceholderText(/enter quantity/i)).toBeInTheDocument();
  });

  it("renders increment and decrement buttons", () => {
    render(
      <NimbusProvider>
        <NumberInput aria-label="Quantity" />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /increment/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrement/i })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the number input
 * @docs-order 2
 */
describe("NumberInput - Interactions", () => {
  it("handles typing numeric values", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <NumberInput aria-label="Quantity" />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "42");

    expect(input).toHaveValue("42");
  });

  it("calls onChange with numeric value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <NumberInput onChange={handleChange} aria-label="Quantity" />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "10");
    // Blur the input to trigger onChange
    await user.tab();

    // NumberInput calls onChange with the numeric value after blur
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith(10);
  });

  it("handles increment button clicks", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <NumberInput value={5} onChange={handleChange} aria-label="Quantity" />
      </NimbusProvider>
    );

    const incrementButton = screen.getByRole("button", { name: /increment/i });
    await user.click(incrementButton);

    expect(handleChange).toHaveBeenCalledWith(6);
  });

  it("handles decrement button clicks", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <NumberInput value={5} onChange={handleChange} aria-label="Quantity" />
      </NimbusProvider>
    );

    const decrementButton = screen.getByRole("button", {
      name: /decrement/i,
    });
    await user.click(decrementButton);

    expect(handleChange).toHaveBeenCalledWith(4);
  });
});

/**
 * @docs-section constraints
 * @docs-title Testing Constraints
 * @docs-description Verify minimum, maximum, and step constraints
 * @docs-order 3
 */
describe("NumberInput - Constraints", () => {
  it("respects minimum value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <NumberInput
          value={2}
          minValue={1}
          onChange={handleChange}
          aria-label="Quantity"
        />
      </NimbusProvider>
    );

    const decrementButton = screen.getByRole("button", {
      name: /decrement/i,
    });

    // Decrement once: 2 -> 1 (at minimum)
    await user.click(decrementButton);
    expect(handleChange).toHaveBeenCalledWith(1);

    // Try clicking again - should stay at minimum
    await user.click(decrementButton);
    // Component still calls onChange but with the same minimum value
    expect(handleChange).toHaveBeenLastCalledWith(1);
  });

  it("respects maximum value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <NumberInput
          value={9}
          maxValue={10}
          onChange={handleChange}
          aria-label="Quantity"
        />
      </NimbusProvider>
    );

    const incrementButton = screen.getByRole("button", { name: /increment/i });

    // Increment once: 9 -> 10 (at maximum)
    await user.click(incrementButton);
    expect(handleChange).toHaveBeenCalledWith(10);

    // Try clicking again - should stay at maximum
    await user.click(incrementButton);
    // Component still calls onChange but with the same maximum value
    expect(handleChange).toHaveBeenLastCalledWith(10);
  });

  it("increments by step amount", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <NumberInput
          value={0}
          step={5}
          onChange={handleChange}
          aria-label="Quantity"
        />
      </NimbusProvider>
    );

    const incrementButton = screen.getByRole("button", { name: /increment/i });
    await user.click(incrementButton);

    expect(handleChange).toHaveBeenCalledWith(5);
  });
});

/**
 * @docs-section validation-states
 * @docs-title Testing Validation States
 * @docs-description Verify different component states render correctly
 * @docs-order 4
 */
describe("NumberInput - Validation states", () => {
  it("handles disabled state", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <NumberInput isDisabled aria-label="Quantity" />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    const incrementButton = screen.getByRole("button", { name: /increment/i });

    expect(input).toBeDisabled();
    expect(incrementButton).toBeDisabled();

    // Verify cannot type when disabled
    await user.type(input, "42");
    expect(input).toHaveValue("");
  });

  it("handles invalid state", () => {
    render(
      <NimbusProvider>
        <NumberInput isInvalid aria-label="Quantity" />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("data-invalid", "true");
  });

  it("handles required state", () => {
    render(
      <NimbusProvider>
        <NumberInput isRequired aria-label="Quantity" />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("handles read-only state", () => {
    render(
      <NimbusProvider>
        <NumberInput
          isReadOnly
          value={42}
          onChange={() => {}}
          aria-label="Quantity"
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    const incrementButton = screen.getByRole("button", { name: /increment/i });

    expect(input).toHaveAttribute("readonly");
    expect(incrementButton).toBeDisabled();
  });
});

/**
 * @docs-section decimal-precision
 * @docs-title Testing Decimal Precision
 * @docs-description Test precision handling for decimal numbers
 * @docs-order 5
 */
describe("NumberInput - Decimal precision", () => {
  it("handles decimal step increments", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <NumberInput
          value={0}
          step={0.1}
          onChange={handleChange}
          aria-label="Price"
        />
      </NimbusProvider>
    );

    const incrementButton = screen.getByRole("button", { name: /increment/i });
    await user.click(incrementButton);

    expect(handleChange).toHaveBeenCalledWith(0.1);
  });

  it("accepts decimal input", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <NumberInput step={0.01} onChange={handleChange} aria-label="Price" />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "12.34");
    // Blur the input to trigger onChange
    await user.tab();

    // NumberInput calls onChange with the numeric value after blur
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith(12.34);
  });
});
