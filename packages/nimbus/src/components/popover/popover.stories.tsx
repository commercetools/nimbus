import { useState } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Popover,
  Stack,
  Text,
  TextInput,
} from "@commercetools/nimbus";
import type { PopoverContentProps } from "@commercetools/nimbus";
import { MoreVert } from "@commercetools/nimbus-icons";

const meta: Meta<typeof Popover.Content> = {
  title: "Components/Popover",
  component: Popover.Content,
};

export default meta;

type Story = StoryObj<typeof Popover.Content>;

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
      // Focus restoration happens after the exit animation unmounts the
      // overlay, so it is not observable on the same tick as the dismissal.
      await waitFor(() => expect(trigger).toHaveFocus());
    });
  },
};

/**
 * Escape does not reach a parent overlay
 *
 * A popover inside a Dialog takes Escape for itself: the popover closes and the
 * Dialog stays open, so one Escape never dismisses two layers.
 */
export const EscapeStopsAtThePopover: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Parent dialog</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Popover.Root>
            <Popover.Trigger>Open popover</Popover.Trigger>
            <Popover.Content aria-label="Nested popover">
              <Text>Escape closes only this.</Text>
            </Popover.Content>
          </Popover.Root>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);

    await step("Open the dialog, then the popover inside it", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open dialog" })
      );
      const dialogTrigger = await waitFor(() =>
        canvas.getByRole("button", { name: "Open popover" })
      );
      await userEvent.click(dialogTrigger);
      // Both overlays are open: the Dialog and the popover's own dialog element.
      await waitFor(() =>
        expect(canvas.getAllByRole("dialog")).toHaveLength(2)
      );
    });

    await step(
      "Escape closes the popover and leaves the dialog open",
      async () => {
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(
            canvas.queryByRole("dialog", { name: "Nested popover" })
          ).not.toBeInTheDocument()
        );
        // The parent survives, which is the half a single-overlay story cannot show.
        await expect(canvas.getByRole("dialog")).toBeInTheDocument();
        await expect(
          canvas.getByRole("button", { name: "Open popover" })
        ).toBeInTheDocument();
      }
    );

    await step("A second Escape then closes the dialog", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() =>
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
      );
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
      // on that element instead. Restoration lands after the exit animation
      // unmounts the overlay, so it is not observable on the dismissal tick.
      await waitFor(() => expect(trigger).toHaveFocus());
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
      // Escape restored focus to the trigger asynchronously, after the exit
      // animation unmounted the overlay. Without the wait, the keyboard press
      // below can land before the trigger is focused again.
      await waitFor(() => expect(trigger).toHaveFocus());
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
      // Restoration lands after the exit animation unmounts the overlay.
      await waitFor(() => expect(trigger).toHaveFocus());
    });
  },
};

/**
 * Focus containment
 *
 * The default popover is modal: opening it moves focus into the dialog, Tab and
 * Shift+Tab cycle inside it rather than escaping to the page, and dismissing it
 * returns focus to the trigger. `NonModal` below keeps all of that — containment
 * comes from the dialog rather than from modality — and changes only what the
 * rest of the page is to assistive technology.
 */
export const FocusContainment: Story = {
  render: () => (
    <Stack gap="400">
      <Button>Before</Button>
      <Popover.Root>
        <Popover.Trigger>Open popover</Popover.Trigger>
        <Popover.Content aria-label="Contained popover">
          <Stack gap="200">
            <TextInput aria-label="Search" />
            <Button>Apply</Button>
            <Button>Reset</Button>
          </Stack>
        </Popover.Content>
      </Popover.Root>
      <Button>After</Button>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open popover" });

    let dialog!: HTMLElement;

    await step("Opening moves focus into the dialog", async () => {
      await userEvent.click(trigger);
      dialog = await waitFor(() => canvas.getByRole("dialog"));
      // React Aria focuses the dialog itself (tabindex="-1") when no child
      // requests autoFocus. `contains` covers both that case and a focused
      // descendant, since a node contains itself.
      await waitFor(() =>
        expect(dialog.contains(document.activeElement)).toBe(true)
      );
    });

    await step("Tab cycles forward without leaving the dialog", async () => {
      // Three focusable children, tabbed five times: focus must wrap inside the
      // dialog instead of reaching "After" or the browser chrome.
      for (let i = 0; i < 5; i++) {
        await userEvent.tab();
        expect(dialog.contains(document.activeElement)).toBe(true);
      }
    });

    await step("Shift+Tab cycles backward without leaving either", async () => {
      for (let i = 0; i < 4; i++) {
        await userEvent.tab({ shift: true });
        expect(dialog.contains(document.activeElement)).toBe(true);
      }
    });

    await step("Neither outside button ever took focus", async () => {
      // The complement of the two cycles above: containment is only meaningful
      // if the tab order never reached the page behind the popover.
      const before = canvas.getByRole("button", { name: "Before" });
      const after = canvas.getByRole("button", { name: "After" });
      expect(before).not.toHaveFocus();
      expect(after).not.toHaveFocus();
    });

    await step("The page behind the modal popover is inert", async () => {
      // The half `isNonModal` actually turns off, asserted here so the pair of
      // stories brackets it: modal marks the rest of the page `inert` and locks
      // page scroll; `NonModal` asserts the absence of both.
      const after = canvas.getByRole("button", { name: "After" });
      expect(after.closest("[inert]")).not.toBeNull();
      expect(getComputedStyle(document.documentElement).overflow).toBe(
        "hidden"
      );
    });

    await step("Dismissal returns focus to the trigger", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
      await waitFor(() => expect(trigger).toHaveFocus());
    });
  },
};

/**
 * Non-modal
 *
 * `isNonModal` stops React Aria marking the rest of the page `inert` and locking
 * page scroll, so assistive technology can reach content outside the popover.
 * It does not lift focus containment — that comes from the dialog Content always
 * renders, not from modality — and an outside press still dismisses. Read the
 * React Aria guidance before using it; the modal default suits most popovers.
 */
export const NonModal: Story = {
  render: () => (
    <Stack gap="400">
      <Popover.Root isNonModal>
        <Popover.Trigger>Open popover</Popover.Trigger>
        <Popover.Content aria-label="Non-modal popover">
          <Stack gap="200">
            <Text>Outside content stays reachable.</Text>
            <Button>Inside one</Button>
            <Button>Inside two</Button>
          </Stack>
        </Popover.Content>
      </Popover.Root>
      <Button>Outside button</Button>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    let dialog!: HTMLElement;

    await step("Open the popover", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open popover" })
      );
      dialog = await waitFor(() => canvas.getByRole("dialog"));
    });

    await step("Rest of the page is left reachable", async () => {
      // React Aria hides the page behind a modal popover with `inert`, not
      // `aria-hidden` (`ariaHideOutside({shouldUseInert: true})`), so `inert` is
      // what has to be absent here. A role query cannot carry this assertion:
      // Testing Library skips aria-hidden subtrees but not inert ones, so the
      // lookup would succeed with or without `isNonModal` and prove nothing.
      const outside = canvas.getByRole("button", { name: "Outside button" });
      await expect(outside.closest("[inert]")).toBeNull();
      // The other half React Aria drops for a non-modal overlay: no scroll lock.
      await expect(
        getComputedStyle(document.documentElement).overflow
      ).not.toBe("hidden");
    });

    await step("Focus stays contained regardless", async () => {
      // The paired assertion for the doc claim: non-modal is about the page's
      // exposure, not about letting Tab leave the dialog. `Popover.Content`
      // always renders a dialog, and the dialog contains focus on its own.
      canvas.getByRole("button", { name: "Inside two" }).focus();
      for (let i = 0; i < 3; i++) {
        await userEvent.tab();
        await expect(dialog.contains(document.activeElement)).toBe(true);
      }
    });
  },
};

/**
 * Placement
 *
 * Root accepts React Aria placement values. The alignment vocabulary depends on
 * the axis: vertical sides take `left`/`right`/`start`/`end`, horizontal sides
 * take `top`/`bottom`.
 *
 * Not snapshotted: placement is React Aria repositioning the same box, with no
 * arrow or layout change, so it is behavioral rather than visual (see
 * docs/chromatic-visual-testing.md). The play asserts it instead.
 */
export const Placement: Story = {
  render: () => (
    <Box padding="2000">
      <Popover.Root defaultOpen placement="right top">
        <Popover.Trigger>Opens to the right</Popover.Trigger>
        <Popover.Content aria-label="Placed popover">
          <Text>Placed with `right top`.</Text>
        </Popover.Content>
      </Popover.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);

    await step("The requested placement reaches the surface", async () => {
      const dialog = await waitFor(() => canvas.getByRole("dialog"));
      // React Aria writes the resolved side onto the popover element that wraps
      // the dialog. It reports the axis only (`right`), not the alignment.
      const surface = dialog.closest("[data-placement]");
      await expect(surface).not.toBeNull();

      // Asserted as an axis rather than the exact side: React Aria may flip to
      // the opposite side when the viewport is tight, but a flip stays on the
      // requested axis. Landing on `right`/`left` therefore proves `right top`
      // was honoured, since the unset default would place it on `bottom`.
      const placement = surface!.getAttribute("data-placement");
      await expect(["right", "left"]).toContain(placement);
    });
  },
};

/** Records Popover.Content's onClick for the forwarding story's assertions. */
const contentClickSpy = fn();

/**
 * Attribute forwarding
 *
 * Content renders two elements: the positioned surface (the `content` slot) and
 * the dialog inside it (the `dialog` slot). Style props go to the surface;
 * everything React Aria's `filterDOMProps` admits goes to the dialog. This pins
 * that split down, since both halves used to be dropped on the floor.
 */
export const AttributeForwarding: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Open popover</Popover.Trigger>
      <Popover.Content
        aria-label="Forwarding popover"
        id="filters-surface"
        className="consumer-class"
        data-testid="filters-content"
        onClick={contentClickSpy}
        maxWidth="4800"
      >
        <Text>Rich, interactive content lives here.</Text>
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open popover" });
    await userEvent.click(trigger);
    const dialog = await waitFor(() => canvas.getByRole("dialog"));
    const surface = dialog.parentElement!;

    await step("data-testid reaches the DOM", async () => {
      await expect(dialog).toHaveAttribute("data-testid", "filters-content");
    });

    await step(
      "id lands on the dialog and keeps aria-controls valid",
      async () => {
        // The dialog is the element the trigger points at, so a consumer id has
        // to replace React Aria's generated one on *that* element or the link
        // breaks. React Aria re-points aria-controls at whatever id it receives.
        await expect(dialog).toHaveAttribute("id", "filters-surface");
        await expect(trigger).toHaveAttribute(
          "aria-controls",
          "filters-surface"
        );
        await expect(document.getElementById("filters-surface")).toBe(dialog);
      }
    );

    await step(
      "className is added to the slot's classes, not swapped in",
      async () => {
        await expect(dialog).toHaveClass("consumer-class");
        await expect(dialog.className).toContain("nimbus-popover__dialog");
      }
    );

    await step("style props stay on the surface", async () => {
      // The recipe styles the surface, so style props must not follow the DOM
      // props onto the dialog.
      await expect(surface.className).toContain("nimbus-popover__content");
      await expect(surface).not.toHaveAttribute("data-testid");
    });

    await step("event handlers fire", async () => {
      await userEvent.click(dialog);
      await expect(contentClickSpy).toHaveBeenCalled();
    });
  },
};

/**
 * Root configuration
 *
 * Root is the compound's configuration surface. It renders `DialogTrigger`, but
 * accepts the behavioral props of the `Popover` and `Dialog` elements that
 * Content renders on its behalf, and publishes them through context.
 *
 * This covers all three destinations at once: `placement` reaches the surface,
 * `role` reaches the dialog, and `maxHeight` is React Aria's numeric positioning
 * cap. The last step checks the other half of the design — that none of the
 * three can be set on Content instead.
 *
 * Not snapshotted: nothing here changes the painted box beyond a height cap that
 * only engages in a short viewport, so it is behavioral rather than visual.
 */
export const RootConfiguration: Story = {
  render: () => (
    <Box padding="2000">
      <Popover.Root
        defaultOpen
        placement="right top"
        role="alertdialog"
        maxHeight={240}
      >
        <Popover.Trigger>Configured on Root</Popover.Trigger>
        <Popover.Content aria-label="Configured popover">
          <Text>Every option came from Root.</Text>
        </Popover.Content>
      </Popover.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);

    await step("Root's role reaches the dialog element", async () => {
      // `role` is a RaDialog prop, so it must land on the inner element rather
      // than the surface. RaDialog defaults to `role="dialog"`, so resolving by
      // the alertdialog role proves both that it arrived and that it replaced
      // the default.
      const dialog = await waitFor(() => canvas.getByRole("alertdialog"));
      await expect(dialog).toHaveAttribute("role", "alertdialog");
      await expect(dialog).toHaveClass("nimbus-popover__dialog");
    });

    await step("Root's placement reaches the surface element", async () => {
      const surface = canvas
        .getByRole("alertdialog")
        .closest("[data-placement]");
      await expect(surface).not.toBeNull();
      // Axis rather than exact side: React Aria may flip within the requested
      // axis in a tight viewport, but the unset default would be `bottom`.
      await expect(["right", "left"]).toContain(
        surface!.getAttribute("data-placement")
      );
    });

    await step("Root's maxHeight is the positioning cap", async () => {
      // React Aria writes its computed cap as an inline style on the surface.
      // Reaching the element as a number at all is the point: Chakra also
      // declares this name, and the CSS property it denotes cannot cap the
      // surface, because the inline value React Aria writes outranks a class.
      const surface = canvas
        .getByRole("alertdialog")
        .closest("[data-placement]") as HTMLElement;
      await expect(surface.style.maxHeight).toBeTruthy();
    });

    await step("Content rejects the same three names", async () => {
      // The compile-time half of "Root is the only configuration surface".
      // Each directive below fails the build with TS2578 (unused
      // '@ts-expect-error') the moment one of these names is admitted to
      // PopoverContentProps again. `role` is the one worth guarding: it is not
      // a Chakra style property, so without the exclusion it would be accepted
      // and then dropped — Content re-applies Root's `role` after the spread —
      // and its DOM type admits roles RaDialog rejects.
      const rejectedOnContent: PopoverContentProps[] = [
        // @ts-expect-error `role` is set on Popover.Root
        { role: "dialog" },
        // @ts-expect-error `offset` is set on Popover.Root
        { offset: 12 },
        // @ts-expect-error `maxHeight` is set on Popover.Root
        { maxHeight: 240 },
      ];
      await expect(rejectedOnContent).toHaveLength(3);
    });
  },
};

/**
 * Style props stay on Content
 *
 * Root owns the overlay's behavior; Content owns how its own two elements look.
 *
 * Height is the one place those two touch the same CSS property, and React Aria
 * wins it outright: `useOverlayPosition` assigns `overlay.style.maxHeight`
 * imperatively on every position pass, so an inline value always beats Chakra's
 * class. Capping the surface therefore means `maxHeight` on Root; the name is
 * rejected on Content, and its `maxH` alias cannot take effect on this element.
 *
 * Not snapshotted: the padded surface is already covered by the VRT stories.
 */
export const ContentStyling: Story = {
  render: () => (
    <Box padding="2000">
      <Popover.Root defaultOpen placement="bottom start" maxHeight={320}>
        <Popover.Trigger>Styled content</Popover.Trigger>
        <Popover.Content padding="0" aria-label="Styled popover">
          <Box padding="400">
            <Text>Padding zeroed on the surface, restored inside.</Text>
          </Box>
        </Popover.Content>
      </Popover.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    const surface = async () =>
      (await waitFor(() => canvas.getByRole("dialog"))).closest(
        "[data-placement]"
      ) as HTMLElement;

    await step("Content's style props reach the surface", async () => {
      await expect(await surface()).toHaveStyle({ padding: "0px" });
    });

    await step("Root's maxHeight governs the height cap", async () => {
      // React Aria writes the cap inline as `min(available, userSetMaxHeight)`,
      // so it never exceeds what Root asked for.
      const cap = Number.parseFloat((await surface()).style.maxHeight);
      await expect(cap).toBeGreaterThan(0);
      await expect(cap).toBeLessThanOrEqual(320);
    });
  },
};

/**
 * Root's open state stays with the trigger
 *
 * React Aria's `Popover` declares `isOpen` / `defaultOpen` / `onOpenChange` too,
 * and derives its own state the moment either of the first two is set on it. If
 * Root forwarded them along with the rest of its configuration, the trigger
 * would toggle one state while the surface rendered another.
 *
 * This is the regression guard for that split: `defaultOpen` is set on Root, and
 * the trigger must still be able to close the surface. A leak would leave the
 * dialog on screen with `aria-expanded="false"`.
 */
export const RootOpenStateIsNotForwarded: Story = {
  render: () => (
    <Popover.Root defaultOpen placement="bottom start">
      <Popover.Trigger>Toggle popover</Popover.Trigger>
      <Popover.Content aria-label="State-owned popover">
        <Text>The trigger and this surface share one state.</Text>
      </Popover.Content>
    </Popover.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = portalCanvas(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Toggle popover" });

    await step("defaultOpen on Root opens the surface", async () => {
      await waitFor(() => expect(canvas.getByRole("dialog")).toBeVisible());
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    await step("The trigger closes the surface it did not open", async () => {
      await userEvent.click(trigger);
      await waitFor(() =>
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
      );
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    await step("And reopens it, so the two stay in step", async () => {
      await userEvent.click(trigger);
      await waitFor(() => expect(canvas.getByRole("dialog")).toBeVisible());
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  },
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
 * Focused trigger - the `trigger` slot's `focusVisibleRing: "outside"`. The
 * trigger is a bare `button`, not the Button recipe, so no other component's
 * baseline covers this ring. Reached via Tab (real keyboard, so
 * `:focus-visible` fires) and left closed, since the open frame moves focus
 * into the dialog.
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
