import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("SearchInput - Basic rendering", () => {
  it("renders search input with search icon", () => {
    render(
      <NimbusProvider>
        <SearchInput placeholder="Search..." aria-label="Search" />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toBeInTheDocument();
    expect(searchBox).toHaveAttribute("type", "search");
    expect(searchBox).toHaveAttribute("placeholder", "Search...");
  });

  it("renders with clear button (hidden when empty)", () => {
    render(
      <NimbusProvider>
        <SearchInput placeholder="Search..." aria-label="Search" />
      </NimbusProvider>
    );

    // Clear button is always in DOM
    const clearButton = screen.getByRole("button", { hidden: true });
    expect(clearButton).toBeInTheDocument();

    // But hidden visually when empty
    const computedStyle = window.getComputedStyle(clearButton);
    expect(computedStyle.opacity).toBe("0");
    expect(computedStyle.pointerEvents).toBe("none");
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the search input
 * @docs-order 2
 */
describe("SearchInput - Interactions", () => {
  it("handles typing in search input", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <SearchInput placeholder="Search..." aria-label="Search" />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test query");

    expect(searchBox).toHaveValue("test query");
  });

  it("calls onChange with string value on input", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <SearchInput
          onChange={handleChange}
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test");

    // onChange receives string, not event
    expect(handleChange).toHaveBeenCalledWith("test");
  });

  it("shows clear button when input has value", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <SearchInput placeholder="Search..." aria-label="Search" />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test");

    const clearButton = screen.getByRole("button");

    await waitFor(() => {
      const computedStyle = window.getComputedStyle(clearButton);
      expect(computedStyle.opacity).toBe("1");
      expect(computedStyle.pointerEvents).toBe("auto");
    });
  });

  it("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <SearchInput placeholder="Search..." aria-label="Search" />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test query");
    expect(searchBox).toHaveValue("test query");

    const clearButton = screen.getByRole("button");
    await user.click(clearButton);

    expect(searchBox).toHaveValue("");
  });

  it("calls onClear when clear button is clicked", async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(
      <NimbusProvider>
        <SearchInput
          defaultValue="test"
          onClear={handleClear}
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    const clearButton = screen.getByRole("button");
    await user.click(clearButton);

    expect(handleClear).toHaveBeenCalled();
  });
});

/**
 * @docs-section keyboard-navigation
 * @docs-title Keyboard Navigation Tests
 * @docs-description Test keyboard interactions and shortcuts
 * @docs-order 3
 */
describe("SearchInput - Keyboard navigation", () => {
  it("focuses on tab key", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <SearchInput placeholder="Search..." aria-label="Search" />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).not.toHaveFocus();

    await user.tab();
    expect(searchBox).toHaveFocus();
  });

  it("clears input on Escape key", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <SearchInput placeholder="Search..." aria-label="Search" />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test query");
    expect(searchBox).toHaveValue("test query");

    await user.keyboard("{Escape}");
    expect(searchBox).toHaveValue("");
  });

  it("calls onSubmit on Enter key", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <NimbusProvider>
        <SearchInput
          onSubmit={handleSubmit}
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test query");
    await user.keyboard("{Enter}");

    expect(handleSubmit).toHaveBeenCalledWith("test query");
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled component behavior
 * @docs-order 4
 */
describe("SearchInput - Controlled mode", () => {
  it("updates controlled value via onChange", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { rerender } = render(
      <NimbusProvider>
        <SearchInput
          value=""
          onChange={handleChange}
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test");

    // onChange called once per character - receives strings
    expect(handleChange).toHaveBeenCalledTimes(4);

    // Verify all calls receive strings
    for (const call of handleChange.mock.calls) {
      expect(typeof call[0]).toBe("string");
    }

    // Rerender with new value
    rerender(
      <NimbusProvider>
        <SearchInput
          value="test"
          onChange={handleChange}
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    expect(searchBox).toHaveValue("test");
  });

  it("can be programmatically cleared", async () => {
    let value = "initial value";
    const handleChange = vi.fn((newValue: string) => {
      value = newValue;
    });

    const { rerender } = render(
      <NimbusProvider>
        <SearchInput
          value={value}
          onChange={handleChange}
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toHaveValue("initial value");

    // Programmatically clear
    value = "";
    rerender(
      <NimbusProvider>
        <SearchInput
          value={value}
          onChange={handleChange}
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    expect(searchBox).toHaveValue("");
  });
});

/**
 * @docs-section states
 * @docs-title State Tests
 * @docs-description Test disabled, invalid, and read-only states
 * @docs-order 5
 */
describe("SearchInput - States", () => {
  it("disables input when isDisabled is true", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <SearchInput isDisabled placeholder="Search..." aria-label="Search" />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toBeDisabled();

    // Cannot type when disabled
    await user.type(searchBox, "test");
    expect(searchBox).toHaveValue("");
  });

  it("marks input as invalid when isInvalid is true", () => {
    render(
      <NimbusProvider>
        <SearchInput isInvalid placeholder="Search..." aria-label="Search" />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    // Check parent container for data-invalid attribute
    const container = searchBox.closest("[data-invalid]");
    expect(container).toHaveAttribute("data-invalid", "true");
  });

  it("prevents editing when isReadOnly is true", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <SearchInput
          isReadOnly
          defaultValue="read-only value"
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toHaveAttribute("readonly");
    expect(searchBox).toHaveValue("read-only value");

    // Cannot type when read-only
    await user.click(searchBox);
    await user.type(searchBox, "test");
    expect(searchBox).toHaveValue("read-only value");
  });

  it("disables clear button when input is disabled", () => {
    render(
      <NimbusProvider>
        <SearchInput
          isDisabled
          defaultValue="test"
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    const clearButton = screen.getByRole("button", { hidden: true });
    expect(clearButton).toBeDisabled();
  });

  it("disables clear button when input is read-only", () => {
    render(
      <NimbusProvider>
        <SearchInput
          isReadOnly
          defaultValue="test"
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    const clearButton = screen.getByRole("button");
    expect(clearButton).toBeDisabled();
  });
});

/**
 * @docs-section event-handlers
 * @docs-title Event Handler Tests
 * @docs-description Test onChange, onSubmit, and onClear event handlers
 * @docs-order 6
 */
describe("SearchInput - Event handlers", () => {
  it("calls all event handlers appropriately", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const handleSubmit = vi.fn();
    const handleClear = vi.fn();

    render(
      <NimbusProvider>
        <SearchInput
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClear={handleClear}
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");

    // Type to trigger onChange
    await user.type(searchBox, "test");
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith("test");

    // Press Enter to trigger onSubmit
    await user.keyboard("{Enter}");
    expect(handleSubmit).toHaveBeenCalledWith("test");

    // Click clear button to trigger onClear
    const clearButton = screen.getByRole("button");
    await user.click(clearButton);
    expect(handleClear).toHaveBeenCalled();
  });

  it("clears value on Escape key when focused", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <SearchInput
          defaultValue="test value"
          placeholder="Search..."
          aria-label="Search"
        />
      </NimbusProvider>
    );

    const searchBox = screen.getByRole("searchbox");
    expect(searchBox).toHaveValue("test value");

    // Focus the input first
    await user.click(searchBox);
    await user.keyboard("{Escape}");

    expect(searchBox).toHaveValue("");
  });
});
