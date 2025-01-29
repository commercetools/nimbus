import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";

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

    await userEvent.tab();
    expect(button).toHaveFocus();

    await userEvent.keyboard("{enter}");
    expect(onPress).toHaveBeenCalledTimes(1);

    await userEvent.keyboard(" ");
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
});
