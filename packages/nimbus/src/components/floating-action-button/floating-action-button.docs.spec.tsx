import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FloatingActionButton, NimbusProvider } from "@commercetools/nimbus";
import { Add as AddIcon } from "@commercetools/nimbus-icons";
import { useState } from "react";

/**
 * @docs-section panel-toggle
 * @docs-title Panel Toggle Integration
 * @docs-description Use FloatingActionButton to toggle application state such as a side panel
 * @docs-order 1
 */
describe("FloatingActionButton - Panel toggle integration", () => {
  const PanelToggle = () => {
    const [open, setOpen] = useState(false);
    return (
      <NimbusProvider>
        <FloatingActionButton
          aria-label={open ? "Close panel" : "Open panel"}
          onPress={() => setOpen((prev) => !prev)}
          data-testid="fab"
        >
          <AddIcon />
        </FloatingActionButton>
        {open && <div data-testid="panel">Panel content</div>}
      </NimbusProvider>
    );
  };

  it("opens a panel on press", async () => {
    const user = userEvent.setup();
    render(<PanelToggle />);

    expect(screen.queryByTestId("panel")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("fab"));

    expect(screen.getByTestId("panel")).toBeInTheDocument();
  });

  it("toggles the panel closed on second press", async () => {
    const user = userEvent.setup();
    render(<PanelToggle />);

    await user.click(screen.getByTestId("fab"));
    expect(screen.getByTestId("panel")).toBeInTheDocument();

    await user.click(screen.getByTestId("fab"));
    expect(screen.queryByTestId("panel")).not.toBeInTheDocument();
  });

  it("updates aria-label to reflect panel state", async () => {
    const user = userEvent.setup();
    render(<PanelToggle />);

    expect(
      screen.getByRole("button", { name: "Open panel" })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open panel" }));
    expect(
      screen.getByRole("button", { name: "Close panel" })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section async-action
 * @docs-title Async Action Integration
 * @docs-description Use FloatingActionButton to trigger an async operation
 * @docs-order 2
 */
describe("FloatingActionButton - Async action integration", () => {
  it("triggers an async callback on press", async () => {
    const user = userEvent.setup();
    const asyncAction = vi.fn().mockResolvedValue(undefined);

    render(
      <NimbusProvider>
        <FloatingActionButton
          aria-label="Save"
          onPress={asyncAction}
          data-testid="fab"
        >
          <AddIcon />
        </FloatingActionButton>
      </NimbusProvider>
    );

    await user.click(screen.getByTestId("fab"));

    expect(asyncAction).toHaveBeenCalledTimes(1);
  });

  it("does not trigger callback when disabled", async () => {
    const user = userEvent.setup();
    const asyncAction = vi.fn();

    render(
      <NimbusProvider>
        <FloatingActionButton
          aria-label="Save"
          onPress={asyncAction}
          isDisabled
          data-testid="fab"
        >
          <AddIcon />
        </FloatingActionButton>
      </NimbusProvider>
    );

    await user.click(screen.getByTestId("fab"));

    expect(asyncAction).not.toHaveBeenCalled();
  });
});

/**
 * @docs-section stacking
 * @docs-title Stacking Context
 * @docs-description The FAB has a default z-index of "banner" (1200) so it floats above page
 * content. Override the zIndex prop when your app uses a custom stacking context.
 * @docs-order 3
 */
describe("FloatingActionButton - Stacking context", () => {
  it("accepts a zIndex prop override for custom stacking contexts", () => {
    // zIndex is a Chakra style prop — applied via CSS class, not inline style.
    // This test verifies the prop is accepted and the component renders correctly.
    render(
      <NimbusProvider>
        <FloatingActionButton
          aria-label="Open assistant"
          zIndex={50}
          data-testid="fab"
        >
          <AddIcon />
        </FloatingActionButton>
      </NimbusProvider>
    );

    expect(screen.getByTestId("fab")).toBeInTheDocument();
  });
});

/**
 * @docs-section tracking
 * @docs-title Analytics Tracking Integration
 * @docs-description Use a persistent id for analytics tracking
 * @docs-order 4
 */
describe("FloatingActionButton - Analytics tracking integration", () => {
  it("renders with a persistent id for tracking", () => {
    const PERSISTENT_ID = "main-fab-open-assistant";

    render(
      <NimbusProvider>
        <FloatingActionButton
          id={PERSISTENT_ID}
          aria-label="Open assistant"
          data-testid="fab"
        >
          <AddIcon />
        </FloatingActionButton>
      </NimbusProvider>
    );

    expect(screen.getByTestId("fab")).toHaveAttribute("id", PERSISTENT_ID);
  });
});
