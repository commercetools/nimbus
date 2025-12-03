import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import type { Key } from "react-aria-components";
import { Select, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("Select - Basic rendering", () => {
  it("renders select trigger button", () => {
    render(
      <NimbusProvider>
        <Select.Root aria-label="Select an option">
          <Select.Options>
            <Select.Option id="1">Option 1</Select.Option>
          </Select.Options>
        </Select.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /Select an option/ })
    ).toBeInTheDocument();
  });

  it("displays default placeholder text", () => {
    render(
      <NimbusProvider>
        <Select.Root aria-label="Select an option">
          <Select.Options>
            <Select.Option id="1">Option 1</Select.Option>
          </Select.Options>
        </Select.Root>
      </NimbusProvider>
    );

    // Default placeholder is "Select an item"
    expect(screen.getByText("Select an item")).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the component
 * @docs-order 2
 */
describe("Select - Interactions", () => {
  it("opens dropdown when button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Select.Root aria-label="Select an option">
          <Select.Options>
            <Select.Option id="1">Option 1</Select.Option>
            <Select.Option id="2">Option 2</Select.Option>
          </Select.Options>
        </Select.Root>
      </NimbusProvider>
    );

    const select = screen.getByRole("button", { name: /Select an option/ });
    await user.click(select);

    // The popover is rendered via a react portal outside of the select root
    // and can only be found by querying the document directly
    await waitFor(() => {
      const listbox = document.querySelector('[role="listbox"]');
      expect(listbox).toBeInTheDocument();
    });
  });

  it("selects an option when clicked", async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();
    render(
      <NimbusProvider>
        <Select.Root
          aria-label="Select an option"
          onSelectionChange={handleSelectionChange}
        >
          <Select.Options>
            <Select.Option id="1">Option 1</Select.Option>
            <Select.Option id="2">Option 2</Select.Option>
          </Select.Options>
        </Select.Root>
      </NimbusProvider>
    );

    const select = screen.getByRole("button", { name: /Select an option/ });
    await user.click(select);

    // Options are in the portal, query the document directly
    await waitFor(() => {
      const options = document.querySelectorAll('[role="option"]');
      expect(options.length).toBeGreaterThan(0);
    });
    const options = document.querySelectorAll('[role="option"]');
    await user.click(options[1]);

    expect(handleSelectionChange).toHaveBeenCalledWith("2");
  });
});

/**
 * @docs-section controlled-state
 * @docs-title Controlled State Tests
 * @docs-description Test controlled selection state
 * @docs-order 3
 */
describe("Select - Controlled state", () => {
  it("displays selected value", () => {
    const TestComponent = () => {
      const [selectedKey] = useState<Key | null>("2");
      return (
        <NimbusProvider>
          <Select.Root
            selectedKey={selectedKey}
            onSelectionChange={() => {}}
            aria-label="Select an option"
          >
            <Select.Options>
              <Select.Option id="1">Option 1</Select.Option>
              <Select.Option id="2">Option 2</Select.Option>
            </Select.Options>
          </Select.Root>
        </NimbusProvider>
      );
    };

    render(<TestComponent />);

    // The selected value appears in the button label
    const button = screen.getByRole("button", { name: /Select an option/ });
    expect(button).toHaveTextContent("Option 2");
  });
});

/**
 * @docs-section option-groups
 * @docs-title Option Group Tests
 * @docs-description Test rendering with option groups
 * @docs-order 4
 */
describe("Select - Option groups", () => {
  it("renders grouped options", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Select.Root aria-label="Select an option">
          <Select.Options>
            <Select.OptionGroup label="Fruits">
              <Select.Option id="apple">Apple</Select.Option>
              <Select.Option id="banana">Banana</Select.Option>
            </Select.OptionGroup>
            <Select.OptionGroup label="Vegetables">
              <Select.Option id="carrot">Carrot</Select.Option>
            </Select.OptionGroup>
          </Select.Options>
        </Select.Root>
      </NimbusProvider>
    );

    const select = screen.getByRole("button", { name: /Select an option/ });
    await user.click(select);

    await waitFor(() => {
      expect(screen.getByText("Fruits")).toBeInTheDocument();
      expect(screen.getByText("Vegetables")).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section disabled-state
 * @docs-title Disabled State Tests
 * @docs-description Test that the select is properly disabled
 * @docs-order 5
 */
describe("Select - Disabled state", () => {
  it("renders disabled select", () => {
    render(
      <NimbusProvider>
        <Select.Root isDisabled aria-label="Select an option">
          <Select.Options>
            <Select.Option id="1">Option 1</Select.Option>
          </Select.Options>
        </Select.Root>
      </NimbusProvider>
    );

    const select = screen.getByRole("button", { name: /Select an option/ });
    expect(select).toBeDisabled();
  });
});

/**
 * @docs-section invalid-state
 * @docs-title Invalid State Tests
 * @docs-description Test that the select is properly marked as invalid
 * @docs-order 6
 */
describe("Select - Invalid state", () => {
  it("renders invalid select", () => {
    render(
      <NimbusProvider>
        <Select.Root isInvalid aria-label="Select an option">
          <Select.Options>
            <Select.Option id="1">Option 1</Select.Option>
          </Select.Options>
        </Select.Root>
      </NimbusProvider>
    );

    // Invalid state is on the root element.
    const button = screen.getByRole("button", { name: /Select an option/ });
    const selectRoot = button.closest('[data-invalid="true"]');
    expect(selectRoot).toBeInTheDocument();
  });
});
