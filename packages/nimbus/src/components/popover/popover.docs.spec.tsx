import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import {
  Popover,
  Button,
  TextInput,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the popover renders its trigger and keeps content out of the DOM until opened
 * @docs-order 1
 */
describe("Popover - Basic rendering", () => {
  it("renders the trigger", () => {
    render(
      <NimbusProvider>
        <Popover.Root>
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Example popover">
            Content
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: "Open popover" })
    ).toBeInTheDocument();
  });

  it("does not render content while closed", () => {
    render(
      <NimbusProvider>
        <Popover.Root>
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Example popover">
            Content
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders content on mount when defaultOpen is set", async () => {
    render(
      <NimbusProvider>
        <Popover.Root defaultOpen>
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Example popover">
            Content
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section opening-closing
 * @docs-title Opening and Closing Interaction Tests
 * @docs-description Test every route into and out of the popover
 * @docs-order 2
 */
describe("Popover - Opening and closing", () => {
  it("opens when the trigger is pressed", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Popover.Root>
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Example popover">
            Content
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("closes when the trigger is pressed again", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Popover.Root>
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Example popover">
            Content
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );

    const trigger = screen.getByRole("button", { name: "Open popover" });
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.click(trigger);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  // Note: focus restoration to the trigger is verified in popover.stories.tsx
  // (EscapeToClose). React Aria's focus restore does not survive JSDOM, so
  // asserting it here would give consumers an example that fails in their own
  // JSDOM suites.
  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Popover.Root>
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Example popover">
            Content
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );

    const trigger = screen.getByRole("button", { name: "Open popover" });
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes via the close callback handed to a function child", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Popover.Root>
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Example popover">
            {({ close }) => <Button onPress={close}>Done</Button>}
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section keyboard
 * @docs-title Keyboard Interaction Tests
 * @docs-description Verify the trigger is operable from the keyboard
 * @docs-order 3
 */
describe("Popover - Keyboard interaction", () => {
  it("opens on Enter when the trigger is focused", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Popover.Root>
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Example popover">
            Content
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "Open popover" })).toHaveFocus();

    await user.keyboard("{Enter}");
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section controlled
 * @docs-title Controlled State Tests
 * @docs-description Verify the popover reports state changes without applying them itself
 * @docs-order 4
 */
describe("Popover - Controlled state", () => {
  it("reflects the isOpen prop and reports close requests", async () => {
    const user = userEvent.setup();
    const seen: boolean[] = [];

    const ControlledPopover = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <Popover.Root
          isOpen={isOpen}
          onOpenChange={(next) => {
            seen.push(next);
            // Only ever applies `open`, so a close request is observable
            // without the popover actually closing.
            if (next) setIsOpen(true);
          }}
        >
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Example popover">
            Content
          </Popover.Content>
        </Popover.Root>
      );
    };

    render(
      <NimbusProvider>
        <ControlledPopover />
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(seen).toContain(true);

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(seen).toContain(false);
    });
    // Still open: the consumer never applied the close.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify naming, roles and ARIA state on the trigger
 * @docs-order 5
 */
describe("Popover - Accessibility", () => {
  it("names the dialog from aria-label", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Popover.Root>
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Filters">Content</Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toHaveAccessibleName("Filters");
    });
  });

  it("exposes aria-expanded on the trigger", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Popover.Root>
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Example popover">
            Content
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );

    const trigger = screen.getByRole("button", { name: "Open popover" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });
});

/**
 * @docs-section interactive-content
 * @docs-title Interactive Content Tests
 * @docs-description Verify inputs inside the popover work and do not dismiss it
 * @docs-order 6
 */
describe("Popover - Interactive content", () => {
  it("accepts typed input without dismissing", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Popover.Root>
          <Popover.Trigger>Edit name</Popover.Trigger>
          <Popover.Content aria-label="Edit name">
            <TextInput aria-label="Name" />
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Edit name" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const input = screen.getByRole("textbox", { name: "Name" });
    await user.click(input);
    await user.type(input, "Ada");

    expect(input).toHaveValue("Ada");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
