import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextInput, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("TextInput - Basic rendering", () => {
  it("renders input element", () => {
    render(
      <NimbusProvider>
        <TextInput aria-label="Text input" placeholder="Enter text" />
      </NimbusProvider>
    );

    // Verify input is present
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with placeholder text", () => {
    render(
      <NimbusProvider>
        <TextInput aria-label="Email" placeholder="Email address" />
      </NimbusProvider>
    );

    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
  });

  it("renders with aria-label", () => {
    render(
      <NimbusProvider>
        <TextInput aria-label="User email" />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("textbox", { name: /user email/i })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the component
 * @docs-order 2
 */
describe("TextInput - Interactions", () => {
  it("updates value when user types", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <TextInput aria-label="Text input" placeholder="Type here" />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  it("calls onChange callback with string value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <TextInput aria-label="Text input" onChange={handleChange} />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "test");

    expect(handleChange).toHaveBeenCalled();
    expect(typeof handleChange.mock.calls[0][0]).toBe("string");
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Testing Controlled Mode
 * @docs-description Test controlled component behavior
 * @docs-order 3
 */
describe("TextInput - Controlled mode", () => {
  it("displays controlled value", () => {
    render(
      <NimbusProvider>
        <TextInput
          aria-label="Text input"
          value="controlled value"
          onChange={() => {}}
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("controlled value");
  });

  it("updates when controlled value changes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <TextInput
          aria-label="Text input"
          value="first value"
          onChange={() => {}}
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("textbox")).toHaveValue("first value");

    rerender(
      <NimbusProvider>
        <TextInput
          aria-label="Text input"
          value="second value"
          onChange={() => {}}
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("textbox")).toHaveValue("second value");
  });
});

/**
 * @docs-section leading-trailing-elements
 * @docs-title Testing Leading and Trailing Elements
 * @docs-description Test custom elements within the input
 * @docs-order 4
 */
describe("TextInput - Elements", () => {
  it("renders leading element", () => {
    render(
      <NimbusProvider>
        <TextInput
          aria-label="Search input"
          leadingElement={<span data-testid="icon">🔍</span>}
          placeholder="Search"
        />
      </NimbusProvider>
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders trailing element", () => {
    render(
      <NimbusProvider>
        <TextInput
          aria-label="Text input"
          trailingElement={<button data-testid="clear">Clear</button>}
          placeholder="Input"
        />
      </NimbusProvider>
    );

    expect(screen.getByTestId("clear")).toBeInTheDocument();
  });

  it("trailing button is interactive", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <NimbusProvider>
        <TextInput
          aria-label="Text input"
          trailingElement={<button onClick={handleClick}>Action</button>}
        />
      </NimbusProvider>
    );

    await user.click(screen.getByText("Action"));

    expect(handleClick).toHaveBeenCalled();
  });
});

/**
 * @docs-section validation-states
 * @docs-title Testing Validation States
 * @docs-description Test different validation states
 * @docs-order 5
 */
describe("TextInput - Validation states", () => {
  it("renders disabled state", () => {
    render(
      <NimbusProvider>
        <TextInput
          aria-label="Disabled input"
          isDisabled
          placeholder="Disabled"
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("renders invalid state", () => {
    render(
      <NimbusProvider>
        <TextInput aria-label="Invalid input" isInvalid placeholder="Invalid" />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders read-only state", () => {
    render(
      <NimbusProvider>
        <TextInput
          aria-label="Read-only input"
          isReadOnly
          value="Read-only"
          onChange={() => {}}
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readonly");
  });

  it("renders required state", () => {
    render(
      <NimbusProvider>
        <TextInput
          aria-label="Required input"
          isRequired
          placeholder="Required"
        />
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-required", "true");
  });
});
