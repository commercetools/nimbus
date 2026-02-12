/**
 * Unit tests for Button component
 *
 * Tests are adapted from button.stories.tsx to provide unit test coverage
 * of the same behaviors tested in the interactive Storybook stories.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { Button } from "./button";
import { createRef, Children, cloneElement, isValidElement } from "react";

describe("Button", () => {
  describe("Base", () => {
    it("Uses a <button> element by default", () => {
      render(
        <Button data-testid="test" aria-label="test-button">
          Button
        </Button>
      );

      const button = screen.getByTestId("test");
      expect(button.tagName).toBe("BUTTON");
    });

    it("Forwards data- & aria-attributes", () => {
      render(
        <Button data-testid="test" aria-label="test-button">
          Button
        </Button>
      );

      const button = screen.getByTestId("test");
      expect(button).toHaveAttribute("data-testid", "test");
      expect(button).toHaveAttribute("aria-label", "test-button");
    });

    it("Is clickable", async () => {
      const user = userEvent;
      const onPress = vi.fn();
      render(
        <Button onPress={onPress} data-testid="test" aria-label="test-button">
          Button
        </Button>
      );

      const button = screen.getByTestId("test");
      await user.click(button);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("Is focusable with <tab> key", async () => {
      render(
        <Button data-testid="test" aria-label="test-button">
          Button
        </Button>
      );

      const button = screen.getByTestId("test");
      await userEvent.tab();
      expect(button).toHaveFocus();
    });

    it("Can be triggered with enter", async () => {
      const onPress = vi.fn();
      render(
        <Button onPress={onPress} data-testid="test" aria-label="test-button">
          Button
        </Button>
      );

      await userEvent.tab();
      await userEvent.keyboard("{enter}");
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("Can be triggered with space-bar", async () => {
      const onPress = vi.fn();
      render(
        <Button onPress={onPress} data-testid="test" aria-label="test-button">
          Button
        </Button>
      );

      const button = screen.getByTestId("test");
      await userEvent.tab();
      expect(button).toHaveFocus();
      await userEvent.keyboard(" ");
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe("Disabled", () => {
    it("Can not be clicked", async () => {
      const onPress = vi.fn();
      render(
        <Button isDisabled onPress={onPress} data-testid="test">
          Disabled Button
        </Button>
      );

      const button = screen.getByTestId("test");
      await userEvent.click(button);
      await userEvent.click(button);
      expect(onPress).toHaveBeenCalledTimes(0);
    });

    it("Can not be focused", async () => {
      render(
        <Button isDisabled data-testid="test">
          Disabled Button
        </Button>
      );

      const button = screen.getByTestId("test");
      await userEvent.tab();
      expect(button).not.toHaveFocus();
    });

    it("Sets aria-disabled and data-disabled attributes", () => {
      render(
        <Button isDisabled data-testid="test">
          Disabled Button
        </Button>
      );

      const button = screen.getByTestId("test");
      expect(button).toHaveAttribute("aria-disabled", "true");
      expect(button).toHaveAttribute("data-disabled", "true");
    });

    it("Supports HTML disabled prop", () => {
      render(
        <Button disabled data-testid="test">
          Disabled Button
        </Button>
      );

      const button = screen.getByTestId("test");
      expect(button).toHaveAttribute("aria-disabled", "true");
      expect(button).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("AsLink", () => {
    it("Uses an <a> element", () => {
      render(
        <Button as="a" href="/" data-testid="test">
          Link disguised as Button
        </Button>
      );

      const link = screen.getByTestId("test");
      expect(link.tagName).toBe("A");
    });
  });

  describe("WithAsChild", () => {
    it("Uses an <a> element", () => {
      render(
        <Button asChild data-testid="test">
          <a>I look like a button but am using an a-tag</a>
        </Button>
      );

      const link = screen.getByTestId("test");
      expect(link.tagName).toBe("A");
    });
  });

  describe("WithRef", () => {
    it("Does accept ref's", () => {
      const buttonRef = createRef<HTMLButtonElement>();

      render(<Button ref={buttonRef}>Demo Button</Button>);

      const button = screen.getByRole("button");
      expect(buttonRef.current).toBe(button);
    });
  });

  describe("Context disabled", () => {
    it("Sets disabled via ButtonContext", () => {
      render(
        <Button.Context.Provider
          value={{
            isDisabled: true,
            id: "test-id",
            "aria-controls": "panel-1",
            "aria-expanded": false,
            onPress: () => {},
            onPressStart: () => {},
          }}
        >
          <Button data-testid="test">Test</Button>
        </Button.Context.Provider>
      );

      const button = screen.getByTestId("test");
      expect(button).toHaveAttribute("aria-disabled", "true");
      expect(button).toHaveAttribute("data-disabled", "true");
      expect(button).toHaveAttribute("aria-controls", "panel-1");
    });
  });

  describe("cloneElement disabled", () => {
    it("Receives isDisabled via cloneElement", () => {
      const disclosureProps = {
        isDisabled: true,
        id: "test-id",
        "aria-controls": "panel-1",
        "aria-expanded": false,
        onPress: () => {},
        onPressStart: () => {},
      };

      const Wrapper = ({ children }: { children: React.ReactNode }) => {
        const child = Children.only(children);
        if (isValidElement(child)) {
          return cloneElement(
            child,
            disclosureProps as Record<string, unknown>
          );
        }
        return null;
      };

      render(
        <Wrapper>
          <Button data-testid="test">Test</Button>
        </Wrapper>
      );

      const button = screen.getByTestId("test");
      expect(button).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("DOM prop filtering", () => {
    it("Does not forward React Aria event props to DOM", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <Button.Context.Provider
          value={{
            onFocusChange: () => {},
            onHoverStart: () => {},
            onPressChange: () => {},
          }}
        >
          <Button data-testid="test">Test</Button>
        </Button.Context.Provider>
      );

      // Should not warn about unknown event handler properties
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("Unknown event handler property")
      );

      consoleSpy.mockRestore();
    });
  });
});
