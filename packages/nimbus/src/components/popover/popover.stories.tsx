import { useState } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";
import {
  Box,
  Button,
  IconButton,
  Popover,
  Stack,
  Text,
  TextInput,
} from "@commercetools/nimbus";
import { MoreVert } from "@commercetools/nimbus-icons";

const meta: Meta<typeof Popover.Content> = {
  title: "Components/Popover",
  component: Popover.Content,
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Records onOpenChange calls for the Controlled story's assertions. */
const onOpenChangeSpy = fn();

/** Portal-aware canvas: Content renders at the document root. */
const portalCanvas = (canvasElement: HTMLElement) =>
  within((canvasElement.parentNode as HTMLElement) ?? canvasElement);

/**
 * Base
 *
 * The three-part composition: a Root that owns open state, a Trigger, and a
 * Content surface that supplies its own dialog.
 */
export const Base: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Open popover</Popover.Trigger>
      <Popover.Content aria-label="Example popover">
        <Stack gap="200">
          <Text fontWeight="700">Popover title</Text>
          <Text>Rich, interactive content lives here.</Text>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open popover" });

    await step("Root mounts no DOM element of its own", async () => {
      // Root renders RaDialogTrigger via `asChild`, which mounts nothing, so no
      // popover element may appear anywhere in the trigger's ancestry. (Asserted
      // against the ancestor chain rather than `parentElement` directly, since
      // Storybook wraps every story in its own padded container.)
      const ancestors: Element[] = [];
      for (
        let node = trigger.parentElement;
        node && node !== canvasElement;
        node = node.parentElement
      ) {
        ancestors.push(node);
      }
      const popoverAncestors = ancestors.filter((el) =>
        String(el.className).includes("nimbus-popover")
      );
      expect(popoverAncestors).toHaveLength(0);
    });

    await step("Trigger exposes collapsed popover affordance", async () => {
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).not.toHaveAttribute("aria-controls");
      // Note: React Aria deliberately omits aria-haspopup for dialog-type
      // overlays (it only sets it for menu and listbox), because screen readers
      // often announce other values as "menu". We do not override that.
      await expect(trigger).not.toHaveAttribute("aria-haspopup");
    });

    await step("Click trigger opens the popover", async () => {
      await userEvent.click(trigger);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      // aria-controls appears only while open, pointing at the overlay.
      await expect(trigger).toHaveAttribute("aria-controls");
    });

    await step("Dialog carries the accessible name", async () => {
      await expect(canvas.getByRole("dialog")).toHaveAccessibleName(
        "Example popover"
      );
    });

    await step("Slot recipe context crosses the portal", async () => {
      // Content renders at the document root, so this proves Root's
      // withProvider context reaches it rather than falling back to unstyled.
      const dialog = canvas.getByRole("dialog");
      await expect(dialog.className).toContain("nimbus-popover");
      await expect(String(dialog.parentElement?.className)).toContain(
        "nimbus-popover"
      );
    });

    await step("Click trigger again closes the popover", async () => {
      await userEvent.click(trigger);
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  },
};

/**
 * Escape closes
 *
 * Escape dismisses the popover and returns focus to the trigger.
 */
export const EscapeToClose: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Open popover</Popover.Trigger>
      <Popover.Content aria-label="Dismissable popover">
        <Text>Press Escape to close.</Text>
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open popover" });

    await step("Open the popover", async () => {
      await userEvent.click(trigger);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("Escape closes and returns focus to the trigger", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
      await expect(trigger).toHaveFocus();
    });
  },
};

/**
 * Outside press closes
 *
 * Pressing outside the popover dismisses it.
 */
export const OutsidePressToClose: Story = {
  render: () => (
    <Stack gap="400">
      <Popover.Root>
        <Popover.Trigger>Open popover</Popover.Trigger>
        <Popover.Content aria-label="Dismissable popover">
          <Text>Click outside to close.</Text>
        </Popover.Content>
      </Popover.Root>
      <Text data-testid="outside">Outside content</Text>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open popover" });

    await step("Open the popover", async () => {
      await userEvent.click(trigger);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("Press outside dismisses the popover", async () => {
      await userEvent.click(document.body);
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    await step("Focus returns to the trigger", async () => {
      // The dismissing press landed on a non-focusable area, so React Aria
      // restores focus. Pressing a focusable element outside would leave focus
      // on that element instead.
      await expect(trigger).toHaveFocus();
    });
  },
};

/**
 * Keyboard activation
 *
 * The trigger toggles on Enter and Space.
 */
export const KeyboardActivation: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Open popover</Popover.Trigger>
      <Popover.Content aria-label="Keyboard popover">
        <Text>Opened from the keyboard.</Text>
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open popover" });

    await step("Enter on a focused trigger opens the popover", async () => {
      await userEvent.tab();
      await expect(trigger).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("Escape closes it again", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    await step("Space on a focused trigger opens the popover", async () => {
      await expect(trigger).toHaveFocus();
      await userEvent.keyboard("{ }");
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });
  },
};

/**
 * Controlled
 *
 * With `isOpen` and `onOpenChange`, the consumer owns the open state — the
 * popover does not close itself.
 */
export const Controlled: Story = {
  render: () => {
    const ControlledPopover = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <Popover.Root
          isOpen={isOpen}
          onOpenChange={(next) => {
            // Records every request but only ever applies `open`, proving the
            // popover does not close itself in controlled mode.
            onOpenChangeSpy(next);
            if (next) setIsOpen(true);
          }}
        >
          <Popover.Trigger>Open popover</Popover.Trigger>
          <Popover.Content aria-label="Controlled popover">
            <Text>Escape will not close this.</Text>
          </Popover.Content>
        </Popover.Root>
      );
    };
    return <ControlledPopover />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    onOpenChangeSpy.mockClear();

    const trigger = canvas.getByRole("button", { name: "Open popover" });

    await step("Opens when the consumer applies the state", async () => {
      await userEvent.click(trigger);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
      await expect(onOpenChangeSpy).toHaveBeenCalledWith(true);
    });

    await step("Escape requests close but does not close", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(onOpenChangeSpy).toHaveBeenCalledWith(false);
      });
      await expect(canvas.getByRole("dialog")).toBeInTheDocument();
    });
  },
};

/**
 * Interactive content
 *
 * Typing inside the popover does not dismiss it.
 */
export const InteractiveContent: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Edit name</Popover.Trigger>
      <Popover.Content aria-label="Edit name">
        <Stack gap="200">
          <TextInput aria-label="Name" />
          <Button>Save</Button>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);

    await step("Open the popover", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Edit name" }));
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("Typing does not dismiss the popover", async () => {
      const input = canvas.getByRole("textbox", { name: "Name" });
      await userEvent.click(input);
      await userEvent.type(input, "Ada");
      await expect(input).toHaveValue("Ada");
      await expect(canvas.getByRole("dialog")).toBeInTheDocument();
    });

    await step("Buttons inside remain operable", async () => {
      await expect(canvas.getByRole("button", { name: "Save" })).toBeEnabled();
    });
  },
};

/**
 * Custom trigger
 *
 * `asChild` applies trigger behavior to a supplied pressable element rather
 * than nesting one button inside another. React Aria delivers the trigger
 * contract to that element through context, so its own props — `id`,
 * `aria-label`, `isDisabled` — go on the element itself, not on the Trigger.
 */
export const CustomTrigger: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton
          id="custom-trigger"
          aria-label="Options"
          size="xs"
          variant="ghost"
        >
          <MoreVert />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content aria-label="Options">
        <Text>Options list</Text>
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Options" });

    await step("No nested interactive element is produced", async () => {
      expect(trigger.querySelector("button")).toBeNull();
      expect(canvas.getAllByRole("button", { name: "Options" })).toHaveLength(
        1
      );
    });

    await step("The supplied element keeps its own props", async () => {
      await expect(trigger).toHaveAttribute("id", "custom-trigger");
    });

    await step(
      "React Aria wires the trigger contract via context",
      async () => {
        // Nothing is forwarded by Popover.Trigger in asChild mode; the child
        // picks this up from DialogTrigger's PressResponder.
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
      }
    );

    await step("The custom trigger opens the popover", async () => {
      await userEvent.click(trigger);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });
  },
};

/**
 * Close from content
 *
 * A function child receives `close`, so content can dismiss its own popover.
 */
export const CloseFromContent: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Discard changes</Popover.Trigger>
      <Popover.Content aria-label="Discard changes">
        {({ close }) => (
          <Stack gap="200">
            <Text>Discard your changes?</Text>
            <Button onPress={close}>Cancel</Button>
          </Stack>
        )}
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Discard changes" });

    await step("Open the popover", async () => {
      await userEvent.click(trigger);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("close() dismisses and restores focus", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
      await expect(trigger).toHaveFocus();
    });
  },
};

/**
 * Non-modal
 *
 * `isNonModal` relaxes React Aria's default containment so assistive
 * technologies can reach content outside the popover. Read the React Aria
 * guidance before using it — the contained default is preferable for most
 * popovers.
 */
export const NonModal: Story = {
  render: () => (
    <Stack gap="400">
      <Popover.Root>
        <Popover.Trigger>Open popover</Popover.Trigger>
        <Popover.Content isNonModal aria-label="Non-modal popover">
          <Text>Outside content stays reachable.</Text>
        </Popover.Content>
      </Popover.Root>
      <Button>Outside button</Button>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);

    await step("Open the popover", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open popover" })
      );
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step(
      "Outside content is not hidden from assistive tech",
      async () => {
        // This role query is the assertion: `getByRole` skips aria-hidden
        // subtrees, and without `isNonModal` React Aria's `ariaHideOutside`
        // hides the container holding this button, so the lookup would throw.
        const outside = canvas.getByRole("button", { name: "Outside button" });
        await expect(outside).toBeInTheDocument();
      }
    );
  },
};

/**
 * Placement
 *
 * Content accepts React Aria placement values. The alignment vocabulary depends
 * on the axis: vertical sides take `left`/`right`/`start`/`end`, horizontal
 * sides take `top`/`bottom`.
 *
 * Not snapshotted: placement is React Aria repositioning the same box, with no
 * arrow or layout change, so it is behavioral rather than visual (see
 * docs/chromatic-visual-testing.md).
 */
export const Placement: Story = {
  render: () => (
    <Box padding="2000">
      <Popover.Root defaultOpen>
        <Popover.Trigger>Opens to the right</Popover.Trigger>
        <Popover.Content placement="right top" aria-label="Placed popover">
          <Text>Placed with `right top`.</Text>
        </Popover.Content>
      </Popover.Root>
    </Box>
  ),
};

// VRT open-state snapshots: `defaultOpen` so Chromatic captures the settled
// surface (the entry animation pauses on its last frame).

const awaitOpen = async (canvasElement: HTMLElement) => {
  const canvas = portalCanvas(canvasElement);
  await waitFor(() => expect(canvas.getByRole("dialog")).toBeInTheDocument());
};

/**
 * The popover portals out and is absolutely positioned, so it adds no document
 * height and Chromatic's crop cuts it off. Reserve room for any open frame.
 */
const roomForPopover: Decorator = (Story) => (
  <Box minHeight="16rem">
    <Story />
  </Box>
);

/**
 * Open popover - the `content` surface: `bg`, `borderRadius: 200`,
 * `boxShadow: 5`, `padding: 400` and `zIndex: 1`. The recipe has no variants or
 * sizes, so this one frame covers every styled state of the surface.
 */
export const OpenPopover: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  decorators: [roomForPopover],
  render: () => (
    <Popover.Root defaultOpen>
      <Popover.Trigger>Open popover</Popover.Trigger>
      <Popover.Content aria-label="Example popover">
        <Stack gap="200">
          <Text fontWeight="700">Popover title</Text>
          <Text>Rich, interactive content lives here.</Text>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvasElement }) => awaitOpen(canvasElement),
};

/**
 * Focused trigger - the `trigger` slot's `focusRing: "outside"`. The trigger is
 * a bare `button`, not the Button recipe, so no other component's baseline
 * covers this ring. Reached via Tab (real keyboard, so `:focus-visible` fires)
 * and left closed, since the open frame moves focus into the dialog.
 */
export const FocusedTrigger: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Open popover</Popover.Trigger>
      <Popover.Content aria-label="Example popover">
        <Text>Not opened in this frame.</Text>
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = portalCanvas(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open popover" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
  },
};
