import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, NimbusProvider, Tooltip } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Button renders with expected content and attributes
 * @docs-order 1
 */
describe("Button - Basic rendering", () => {
  it("renders with correct text", () => {
    render(
      <NimbusProvider>
        <Button>Click me</Button>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("renders with custom data attributes", () => {
    render(
      <NimbusProvider>
        <Button data-testid="my-button">Action</Button>
      </NimbusProvider>
    );

    expect(screen.getByTestId("my-button")).toBeInTheDocument();
  });

  it("renders as an anchor element when using the as prop", () => {
    render(
      <NimbusProvider>
        <Button as="a" href="/home" data-testid="link-button">
          Go Home
        </Button>
      </NimbusProvider>
    );

    const element = screen.getByTestId("link-button");
    expect(element.tagName).toBe("A");
    expect(element).toHaveAttribute("href", "/home");
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the Button
 * @docs-order 2
 */
describe("Button - Interactions", () => {
  it("calls onPress when clicked", async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();

    render(
      <NimbusProvider>
        <Button onPress={handlePress}>Action</Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /action/i });
    await user.click(button);

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();

    render(
      <NimbusProvider>
        <Button isDisabled onPress={handlePress}>
          Action
        </Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /action/i });
    await user.click(button);

    expect(handlePress).not.toHaveBeenCalled();
  });
});

/**
 * @docs-section keyboard
 * @docs-title Keyboard Navigation Tests
 * @docs-description Test keyboard interactions with the Button
 * @docs-order 3
 */
describe("Button - Keyboard navigation", () => {
  it("is focusable with Tab key", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Button>Focus me</Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /focus me/i });
    await user.tab();

    expect(button).toHaveFocus();
  });

  it("can be activated with Enter key", async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();

    render(
      <NimbusProvider>
        <Button onPress={handlePress}>Press me</Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /press me/i });
    button.focus();

    await user.keyboard("{Enter}");

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it("can be activated with Space key", async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();

    render(
      <NimbusProvider>
        <Button onPress={handlePress}>Press me</Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /press me/i });
    button.focus();

    await user.keyboard(" ");

    expect(handlePress).toHaveBeenCalledTimes(1);
  });
});

/**
 * @docs-section states
 * @docs-title State Tests
 * @docs-description Test different states of the Button
 * @docs-order 4
 */
describe("Button - States", () => {
  it("applies disabled state on native button", () => {
    render(
      <NimbusProvider>
        <Button isDisabled>Disabled</Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it("is not focusable when disabled", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Button isDisabled>Cannot focus</Button>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /cannot focus/i });
    await user.tab();

    expect(button).not.toHaveFocus();
  });
});

/**
 * @docs-section disabled-with-tooltip
 * @docs-title Tooltip on a disabled Button
 * @docs-description Pair `isDisabled` with `allowFocusWhenDisabled` to keep a
 * disabled button focusable and hoverable so a Tooltip can explain why the
 * action is unavailable. The button is announced as disabled (`aria-disabled`)
 * and its action stays suppressed.
 * @docs-order 5
 */
describe("Button - Disabled with a Tooltip", () => {
  it("stays focusable so a Tooltip can explain why it is disabled", async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();

    render(
      <NimbusProvider>
        <Tooltip.Root delay={0} closeDelay={0}>
          <Button isDisabled allowFocusWhenDisabled onPress={handlePress}>
            Publish
          </Button>
          <Tooltip.Content>
            Complete all required fields to publish.
          </Tooltip.Content>
        </Tooltip.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /publish/i });

    // Announced as disabled, but still reachable (no native `disabled`).
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();

    // Keyboard users can focus it and the tooltip reveals the explanation.
    await user.tab();
    expect(button).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      /required fields/i
    );

    // ...yet the action remains suppressed.
    await user.click(button);
    expect(handlePress).not.toHaveBeenCalled();
  });
});

/**
 * @docs-section variants
 * @docs-title Visual Variant Tests
 * @docs-description Test rendering with different visual variants and sizes
 * @docs-order 5
 */
describe("Button - Visual variants", () => {
  it("renders with different size variants", () => {
    const { rerender } = render(
      <NimbusProvider>
        <Button size="sm">Small</Button>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <Button size="md">Medium</Button>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with different visual variants", () => {
    const { rerender } = render(
      <NimbusProvider>
        <Button variant="solid">Solid</Button>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <Button variant="outline">Outline</Button>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with color palettes", () => {
    render(
      <NimbusProvider>
        <Button colorPalette="primary" variant="solid">
          Primary
        </Button>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /primary/i })
    ).toBeInTheDocument();
  });
});
