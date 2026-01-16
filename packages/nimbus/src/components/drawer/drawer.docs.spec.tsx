import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Drawer, Button, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the drawer renders with expected elements
 * @docs-order 1
 */
describe("Drawer - Basic rendering", () => {
  it("renders trigger button", () => {
    render(
      <NimbusProvider>
        <Drawer.Root>
          <Drawer.Trigger>Open Drawer</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Body>Content</Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: "Open Drawer" })
    ).toBeInTheDocument();
  });

  it("does not render dialog when closed", () => {
    render(
      <NimbusProvider>
        <Drawer.Root>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Body>Content</Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </NimbusProvider>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test drawer opening and closing behavior
 * @docs-order 2
 */
describe("Drawer - Interactions", () => {
  it("opens drawer when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Drawer.Root>
          <Drawer.Trigger>Open Drawer</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Test Drawer</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>Content</Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </NimbusProvider>
    );

    const trigger = screen.getByRole("button", { name: "Open Drawer" });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Test Drawer" })
      ).toBeInTheDocument();
    });
  });

  it("closes drawer when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Drawer.Root>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Test</Drawer.Title>
              <Drawer.CloseTrigger />
            </Drawer.Header>
            <Drawer.Body>Content</Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes drawer when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Drawer.Root>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Body>Content</Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled State Tests
 * @docs-description Test controlled mode behavior
 * @docs-order 3
 */
describe("Drawer - Controlled state", () => {
  it("opens and closes via controlled prop", async () => {
    const user = userEvent.setup();

    const ControlledDrawer = () => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <NimbusProvider>
          <Button onPress={() => setIsOpen(true)}>External Open</Button>
          <Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen}>
            <Drawer.Content aria-label="Controlled drawer">
              <Drawer.Body>Content</Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        </NimbusProvider>
      );
    };

    render(<ControlledDrawer />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "External Open" }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls onOpenChange when drawer state changes", async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <NimbusProvider>
        <Drawer.Root onOpenChange={handleOpenChange}>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Body>Content</Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

/**
 * @docs-section portal-content
 * @docs-title Portal Content Tests
 * @docs-description Test drawer content rendering in portal
 * @docs-order 4
 */
describe("Drawer - Portal content", () => {
  it("renders drawer content in portal", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Drawer.Root>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Body>
              <div data-testid="portal-content">Portal Content</div>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(screen.getByTestId("portal-content")).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section dismissal
 * @docs-title Dismissal Behavior Tests
 * @docs-description Test different dismissal configurations
 * @docs-order 5
 */
describe("Drawer - Dismissal", () => {
  it("prevents Escape key dismissal when isKeyboardDismissDisabled", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Drawer.Root isKeyboardDismissDisabled={true}>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Body>Content</Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    // Drawer should still be open
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("accepts shouldCloseOnInteractOutside callback prop", () => {
    const shouldClose = vi.fn(() => false);

    render(
      <NimbusProvider>
        <Drawer.Root shouldCloseOnInteractOutside={shouldClose}>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Body>Content</Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </NimbusProvider>
    );

    // Verify component renders with the callback prop without errors
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });
});
