import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultilineTextInput, NimbusProvider } from "@commercetools/nimbus";
import { useState } from "react";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("MultilineTextInput - Basic rendering", () => {
  it("renders textarea element", () => {
    render(
      <NimbusProvider>
        <MultilineTextInput aria-label="Description" />
      </NimbusProvider>
    );

    const textarea = screen.getByRole("textbox", { name: /description/i });
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("renders with placeholder text", () => {
    render(
      <NimbusProvider>
        <MultilineTextInput
          placeholder="Enter your message"
          aria-label="Message"
        />
      </NimbusProvider>
    );

    expect(
      screen.getByPlaceholderText(/enter your message/i)
    ).toBeInTheDocument();
  });

  it("renders with specified number of rows", () => {
    render(
      <NimbusProvider>
        <MultilineTextInput rows={5} aria-label="Description" />
      </NimbusProvider>
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("rows", "5");
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the textarea
 * @docs-order 2
 */
describe("MultilineTextInput - Interactions", () => {
  it("handles typing multi-line text", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <MultilineTextInput aria-label="Message" />
      </NimbusProvider>
    );

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "First line{Enter}Second line");

    expect(textarea).toHaveValue("First line\nSecond line");
  });

  it("calls onChange with typed value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <MultilineTextInput onChange={handleChange} aria-label="Message" />
      </NimbusProvider>
    );

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello");

    expect(handleChange).toHaveBeenCalledWith("Hello");
  });

  it("handles controlled mode updates", async () => {
    const { rerender } = render(
      <NimbusProvider>
        <MultilineTextInput
          value="Initial"
          onChange={() => {}}
          aria-label="Message"
        />
      </NimbusProvider>
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Initial");

    rerender(
      <NimbusProvider>
        <MultilineTextInput
          value="Updated"
          onChange={() => {}}
          aria-label="Message"
        />
      </NimbusProvider>
    );

    expect(textarea).toHaveValue("Updated");
  });
});

/**
 * @docs-section validation-states
 * @docs-title Testing States
 * @docs-description Verify different component states render correctly
 * @docs-order 3
 */
describe("MultilineTextInput - States", () => {
  it("handles disabled state", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <MultilineTextInput isDisabled aria-label="Message" />
      </NimbusProvider>
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();

    // Verify cannot type when disabled
    await user.type(textarea, "Test");
    expect(textarea).toHaveValue("");
  });

  it("handles invalid state", () => {
    render(
      <NimbusProvider>
        <MultilineTextInput isInvalid aria-label="Message" />
      </NimbusProvider>
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("data-invalid", "true");
  });

  it("handles required state", () => {
    render(
      <NimbusProvider>
        <MultilineTextInput isRequired aria-label="Message" />
      </NimbusProvider>
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-required", "true");
  });

  it("handles read-only state", () => {
    render(
      <NimbusProvider>
        <MultilineTextInput
          isReadOnly
          value="Read-only content"
          onChange={() => {}}
          aria-label="Message"
        />
      </NimbusProvider>
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("readonly");
  });
});

/**
 * @docs-section character-limits
 * @docs-title Testing with Character Limits
 * @docs-description Test application logic for character counting and validation
 * @docs-order 4
 */
describe("MultilineTextInput - Character limit", () => {
  it("enforces character limit validation", async () => {
    const user = userEvent.setup();
    const maxLength = 50;

    const TestComponent = () => {
      const [value, setValue] = useState("");
      const isOverLimit = value.length > maxLength;

      return (
        <>
          <MultilineTextInput
            value={value}
            onChange={setValue}
            isInvalid={isOverLimit}
            aria-label="Comment"
          />
          <div data-testid="char-count">
            {value.length}/{maxLength}
          </div>
        </>
      );
    };

    render(
      <NimbusProvider>
        <TestComponent />
      </NimbusProvider>
    );

    const textarea = screen.getByRole("textbox");
    const longText = "a".repeat(60); // Exceeds limit

    await user.type(textarea, longText);

    expect(textarea).toHaveAttribute("data-invalid", "true");
    expect(screen.getByTestId("char-count")).toHaveTextContent("60/50");
  });
});
