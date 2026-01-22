import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("PasswordInput - Basic rendering", () => {
  it("renders password input field", () => {
    render(
      <NimbusProvider>
        <PasswordInput aria-label="Password" />
      </NimbusProvider>
    );

    // Verify input is present with password type
    const input = screen.getByLabelText("Password");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });

  it("renders visibility toggle button", () => {
    render(
      <NimbusProvider>
        <PasswordInput aria-label="Password" />
      </NimbusProvider>
    );

    // Verify toggle button is present
    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();
  });

  it("renders with placeholder text", () => {
    render(
      <NimbusProvider>
        <PasswordInput
          aria-label="Password"
          placeholder="Enter your password"
        />
      </NimbusProvider>
    );

    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the component
 * @docs-order 2
 */
describe("PasswordInput - Interactions", () => {
  it("toggles password visibility when button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <PasswordInput aria-label="Password" />
      </NimbusProvider>
    );

    const input = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button");

    // Initially type is password
    expect(input).toHaveAttribute("type", "password");

    // Click to show password
    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    // Click again to hide password
    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("calls onChange with entered value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <PasswordInput aria-label="Password" onChange={handleChange} />
      </NimbusProvider>
    );

    const input = screen.getByLabelText("Password");
    await user.type(input, "Secret123");

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue("Secret123");
  });

  it("updates value when user types", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <PasswordInput placeholder="Type password" aria-label="Password" />
      </NimbusProvider>
    );

    const input = screen.getByLabelText("Password");
    await user.type(input, "MyPassword123");

    expect(input).toHaveValue("MyPassword123");
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Testing Controlled Mode
 * @docs-description Test controlled component behavior
 * @docs-order 3
 */
describe("PasswordInput - Controlled mode", () => {
  it("displays controlled value", () => {
    render(
      <NimbusProvider>
        <PasswordInput
          value="controlled value"
          onChange={() => {}}
          aria-label="Password"
        />
      </NimbusProvider>
    );

    const input = screen.getByLabelText("Password");
    expect(input).toHaveValue("controlled value");
  });

  it("updates when controlled value changes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <PasswordInput
          value="first value"
          onChange={() => {}}
          aria-label="Password"
        />
      </NimbusProvider>
    );

    expect(screen.getByLabelText("Password")).toHaveValue("first value");

    rerender(
      <NimbusProvider>
        <PasswordInput
          value="second value"
          onChange={() => {}}
          aria-label="Password"
        />
      </NimbusProvider>
    );

    expect(screen.getByLabelText("Password")).toHaveValue("second value");
  });

  it("clears controlled value", async () => {
    const user = userEvent.setup();
    let currentValue = "Test";

    const { rerender } = render(
      <NimbusProvider>
        <PasswordInput
          value={currentValue}
          onChange={(value: string) => {
            currentValue = value;
          }}
          aria-label="Password"
        />
      </NimbusProvider>
    );

    const input = screen.getByLabelText("Password");
    expect(input).toHaveValue("Test");

    await user.clear(input);

    // Rerender with cleared value
    rerender(
      <NimbusProvider>
        <PasswordInput
          value=""
          onChange={(value: string) => {
            currentValue = value;
          }}
          aria-label="Password"
        />
      </NimbusProvider>
    );

    expect(input).toHaveValue("");
  });
});

/**
 * @docs-section leading-element
 * @docs-title Testing Leading Element
 * @docs-description Test custom leading element rendering
 * @docs-order 4
 */
describe("PasswordInput - Leading element", () => {
  it("renders leading element", () => {
    render(
      <NimbusProvider>
        <PasswordInput
          aria-label="Password"
          leadingElement={<span data-testid="lock-icon">🔒</span>}
          placeholder="Password"
        />
      </NimbusProvider>
    );

    expect(screen.getByTestId("lock-icon")).toBeInTheDocument();
  });

  it("renders input with leading element", () => {
    render(
      <NimbusProvider>
        <PasswordInput
          leadingElement={<span data-testid="icon">Icon</span>}
          aria-label="Password with icon"
        />
      </NimbusProvider>
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByLabelText(/password with icon/i)).toBeInTheDocument();
  });
});

/**
 * @docs-section keyboard-navigation
 * @docs-title Testing Keyboard Navigation
 * @docs-description Test keyboard interactions
 * @docs-order 5
 */
describe("PasswordInput - Keyboard navigation", () => {
  it("toggles visibility with Enter key", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <PasswordInput aria-label="Password" />
      </NimbusProvider>
    );

    const input = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button");

    // Use userEvent.tab() to focus elements (avoids act() warnings)
    // First tab focuses the input, second tab focuses the toggle button
    await user.tab();
    await user.tab();
    expect(toggleButton).toHaveFocus();

    // Press Enter to toggle
    await user.keyboard("{Enter}");
    expect(input).toHaveAttribute("type", "text");

    // Press Space to toggle back
    await user.keyboard(" ");
    expect(input).toHaveAttribute("type", "password");
  });

  it("moves focus between input and button with Tab", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <PasswordInput aria-label="Password" />
      </NimbusProvider>
    );

    const input = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button");

    // Tab to input
    await user.tab();
    expect(input).toHaveFocus();

    // Tab to toggle button
    await user.tab();
    expect(toggleButton).toHaveFocus();
  });
});

/**
 * @docs-section validation-states
 * @docs-title Testing Validation States
 * @docs-description Test different validation states
 * @docs-order 6
 */
describe("PasswordInput - Validation states", () => {
  it("renders disabled state", () => {
    render(
      <NimbusProvider>
        <PasswordInput
          isDisabled
          placeholder="Disabled"
          aria-label="Password"
        />
      </NimbusProvider>
    );

    const input = screen.getByLabelText("Password");
    expect(input).toBeDisabled();
  });

  it("renders invalid state", () => {
    render(
      <NimbusProvider>
        <PasswordInput isInvalid placeholder="Invalid" aria-label="Password" />
      </NimbusProvider>
    );

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders read-only state", () => {
    render(
      <NimbusProvider>
        <PasswordInput
          isReadOnly
          value="Read-only password"
          onChange={() => {}}
          aria-label="Password"
        />
      </NimbusProvider>
    );

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("readonly");
  });

  it("renders required state", () => {
    render(
      <NimbusProvider>
        <PasswordInput
          isRequired
          placeholder="Required"
          aria-label="Password"
        />
      </NimbusProvider>
    );

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("aria-required", "true");
  });
});
