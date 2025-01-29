import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent, act } from "@/test/utils";

import { Button } from "./button";

describe("Button", () => {
  it("renders", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("has the correct role", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is keyboard accessible", async () => {
    const onPress = vi.fn();

    render(<Button onPress={onPress}>Click me</Button>);
    const button = screen.getByRole("button");

    await act(async () => {
      await userEvent.tab();
    });

    expect(button).toHaveFocus();

    await act(async () => {
      await userEvent.keyboard("{enter}");
    });

    expect(onPress).toHaveBeenCalledTimes(1);

    await act(async () => {
      await userEvent.keyboard(" ");
    });
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it("handles disabled state correctly", () => {
    render(
      <Button data-foo="bar" isDisabled>
        Click me
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("forwards aria-label correctly", () => {
    render(<Button aria-label="Custom label">Icon</Button>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Custom label"
    );
  });

  it("forwards data-attributes correctly", () => {
    render(<Button data-foo="Bar">Text</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-foo", "Bar");
  });

  it("renders as a custom element using 'as' prop", () => {
    render(<Button as="a" href="https://example.com" data-testid="hook" />);
    const link = screen.getByTestId("hook");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("renders child component when asChild is true", () => {
    render(
      <Button asChild data-testid="hook">
        <a href="https://example.com">Link Button</a>
      </Button>
    );
    const link = screen.getByTestId("hook");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});
