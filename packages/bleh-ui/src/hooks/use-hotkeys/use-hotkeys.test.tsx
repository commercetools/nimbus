import { render } from "@testing-library/react";
import { userEvent } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { useHotkeys } from "./use-hotkeys";

const TestComponent = ({ onHotkey = vi.fn() }) => {
  useHotkeys("ctrl+k", onHotkey);
  return <div data-testid="test-component">Press ctrl+k</div>;
};

describe("useHotkeys", () => {
  it("should trigger callback when hotkey is pressed", async () => {
    const onHotkey = vi.fn();
    const user = userEvent.setup();

    render(<TestComponent onHotkey={onHotkey} />);

    await user.keyboard("{Control>}k{/Control}");

    expect(onHotkey).toHaveBeenCalledTimes(1);
  });

  it("should not trigger callback for wrong key combination", async () => {
    const onHotkey = vi.fn();
    const user = userEvent.setup();

    render(<TestComponent onHotkey={onHotkey} />);

    await user.keyboard("{Control>}j{/Control}");

    expect(onHotkey).not.toHaveBeenCalled();
  });
});
