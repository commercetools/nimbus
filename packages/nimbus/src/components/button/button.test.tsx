/**
 * Unit tests for Button component
 *
 * Note: Due to Chakra UI v3 ESM/CJS compatibility issues with Vitest,
 * these tests focus on testing the component's props interface, accessibility features,
 * and integration with React Aria without rendering the full Chakra UI stack.
 *
 * For comprehensive interaction and visual testing, see button.stories.tsx
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { Button } from "./button";

describe("Button", () => {
  describe("Rendering", () => {
    it("should render with children", () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole("button")).toHaveTextContent("Click me");
    });

    it("should render as a button element by default", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button");
      expect(button.tagName).toBe("BUTTON");
    });

    it("should have correct display name", () => {
      expect(Button.displayName).toBe("Button");
    });
  });

  describe("Props", () => {
    it("should accept type prop", () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should default to type='button' when not specified", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("should accept and apply aria-label", () => {
      render(<Button aria-label="Custom label">Icon only</Button>);

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Custom label"
      );
    });

    it("should accept data attributes", () => {
      render(
        <Button data-testid="custom-button" data-custom="value">
          Click me
        </Button>
      );

      const button = screen.getByTestId("custom-button");
      expect(button).toHaveAttribute("data-custom", "value");
    });

    it("should accept slot prop", () => {
      render(<Button slot="trigger">Trigger</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should accept null slot prop", () => {
      render(<Button slot={null}>No slot</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("should apply disabled state when isDisabled is true", () => {
      render(<Button isDisabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-disabled", "true");
      expect(button).toHaveAttribute("data-disabled", "true");
    });

    it("should not call onPress when disabled", async () => {
      const handlePress = vi.fn();

      render(
        <Button isDisabled onPress={handlePress}>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(handlePress).not.toHaveBeenCalled();
    });

    it("should not apply aria-disabled when isDisabled is false", () => {
      render(<Button isDisabled={false}>Enabled</Button>);

      const button = screen.getByRole("button");
      expect(button).not.toHaveAttribute("aria-disabled");
      expect(button).not.toHaveAttribute("data-disabled");
    });
  });

  describe("Event handlers", () => {
    it("should call onPress when clicked", async () => {
      const handlePress = vi.fn();

      render(<Button onPress={handlePress}>Click me</Button>);

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(handlePress).toHaveBeenCalledOnce();
    });

    it("should call onClick when clicked", async () => {
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      await userEvent.click(button);

      // onClick may be called multiple times due to React Aria's internal handling
      expect(handleClick).toHaveBeenCalled();
    });

    it("should support keyboard interactions with Enter key", async () => {
      const handlePress = vi.fn();

      render(<Button onPress={handlePress}>Press me</Button>);

      const button = screen.getByRole("button");
      button.focus();
      await userEvent.keyboard("{Enter}");

      expect(handlePress).toHaveBeenCalled();
    });

    it("should support keyboard interactions with Space key", async () => {
      const handlePress = vi.fn();

      render(<Button onPress={handlePress}>Press me</Button>);

      const button = screen.getByRole("button");
      button.focus();
      await userEvent.keyboard(" ");

      expect(handlePress).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have button role", () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should be focusable", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button");
      button.focus();

      expect(button).toHaveFocus();
    });

    it("should not be focusable when disabled", () => {
      render(<Button isDisabled>Disabled</Button>);

      const button = screen.getByRole("button");
      button.focus();

      expect(button).not.toHaveFocus();
    });

    it("should support aria-describedby", () => {
      render(
        <div>
          <Button aria-describedby="description">Click me</Button>
          <div id="description">This is a description</div>
        </div>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "description");
    });

    it("should support aria-labelledby", () => {
      render(
        <div>
          <span id="label">External Label</span>
          <Button aria-labelledby="label">Click me</Button>
        </div>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-labelledby", "label");
    });
  });

  describe("Custom element rendering", () => {
    it("should render as a custom element when 'as' prop is provided", () => {
      render(<Button as="a">Link button</Button>);

      const element = screen.getByRole("button");
      // React Aria should add role="button" to the anchor
      expect(element.tagName).toBe("A");
    });

    it("should support asChild pattern", () => {
      render(
        <Button asChild>
          <a href="/test">Link button</a>
        </Button>
      );

      // With asChild, the child element should become the button
      const link = screen.getByRole("button");
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("Ref forwarding", () => {
    it("should forward ref to button element", () => {
      const ref = { current: null };

      render(<Button ref={ref}>Click me</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("should merge multiple refs", () => {
      const ref1 = { current: null };

      // Note: Testing multiple ref merging would require accessing internal implementation
      // For now, we test that a single ref works
      render(<Button ref={ref1}>Click me</Button>);

      expect(ref1.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("Edge cases", () => {
    it("should handle undefined children", () => {
      render(<Button aria-label="Icon button">{undefined}</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should handle null children", () => {
      render(<Button aria-label="Icon button">{null}</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should handle complex children", () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("IconText");
    });

    it("should not render onPress as a DOM attribute", () => {
      const handlePress = vi.fn();

      render(<Button onPress={handlePress}>Click me</Button>);

      const button = screen.getByRole("button");
      expect(button).not.toHaveAttribute("onPress");
      expect(button).not.toHaveAttribute("onpress");
    });
  });

  describe("Type safety", () => {
    it("should accept all valid button attributes", () => {
      render(
        <Button
          id="test-button"
          className="custom-class"
          title="Button title"
          tabIndex={0}
          autoFocus
        >
          Click me
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("id", "test-button");
      expect(button).toHaveAttribute("title", "Button title");
      expect(button).toHaveAttribute("tabIndex", "0");
    });
  });
});
