import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";
import { DropZone, FileTrigger, Button, Text } from "@commercetools/nimbus";
import {
  makeFileDataTransfer,
  makeDataTransfer,
  fireDrop,
  fireDragOver,
  fireDragLeave,
} from "./utils";

const meta: Meta<typeof DropZone> = {
  title: "Components/DropZone",
  component: DropZone,
};

export default meta;

type Story = StoryObj<typeof DropZone>;

/** Returns the drop-target root element (the RAC DropZone's outer div). */
const getRoot = (canvasElement: HTMLElement): HTMLElement => {
  const root = canvasElement.querySelector<HTMLElement>(
    "[data-testid='drop-zone-root']"
  );
  if (!root) throw new Error("DropZone root not found");
  return root;
};

const makeFile = (name: string, type = "text/plain") =>
  new File(["hello"], name, { type });

// ============================================================
// Base rendering (default content)
// ============================================================

export const Base: Story = {
  args: {
    "data-testid": "drop-zone-root",
  } as never,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);

    await step(
      "With no children, renders the default icon and instruction label",
      async () => {
        await expect(root).toBeInTheDocument();
        await expect(root).not.toHaveAttribute("data-drop-target");
        await expect(
          canvas.getByText(/drag and drop files here/i)
        ).toBeInTheDocument();
      }
    );

    await step(
      "The default label gives the zone an accessible name",
      async () => {
        const target = canvas.getByLabelText(/drag and drop files here/i);
        await expect(target).toBeInTheDocument();
        await expect(target).toHaveAccessibleName("Drag and drop files here");
      }
    );
  },
};

// ============================================================
// Accessible name override
// ============================================================

export const AccessibleName: Story = {
  args: {
    "data-testid": "drop-zone-root",
    "aria-label": "Upload files",
  } as never,
  play: async ({ canvasElement, step }) => {
    await step(
      "An explicit aria-label takes precedence over the default label",
      async () => {
        const canvas = within(canvasElement);
        const target = canvas.getByLabelText("Upload files");
        await expect(target).toBeInTheDocument();
        await expect(target).toHaveAccessibleName("Upload files");
        await expect(
          canvas.queryByText(/drag and drop files here/i)
        ).not.toBeInTheDocument();
      }
    );
  },
};

// ============================================================
// Drag behavior (default content still present, childless)
// ============================================================

export const DragAndDrop: Story = {
  args: {
    "data-testid": "drop-zone-root",
    onDrop: fn(),
  } as never,
  play: async ({ canvasElement, args, step }) => {
    const root = getRoot(canvasElement);

    await step(
      "A simulated drop fires onDrop with expected items",
      async () => {
        const dataTransfer = makeFileDataTransfer(makeFile("report.txt"));
        fireDrop(root, dataTransfer);

        await waitFor(() => {
          expect(args.onDrop).toHaveBeenCalledTimes(1);
        });
        const event = (args.onDrop as ReturnType<typeof fn>).mock.calls[0][0];
        expect(event.items).toHaveLength(1);
        expect(event.items[0].kind).toBe("file");
      }
    );

    await step(
      "Drag-enter sets data-drop-target and drag-leave clears it",
      async () => {
        const dataTransfer = makeFileDataTransfer(makeFile("photo.png"));
        fireDragOver(root, dataTransfer);
        await waitFor(() => {
          expect(root).toHaveAttribute("data-drop-target", "true");
        });

        fireDragLeave(root, dataTransfer);
        await waitFor(() => {
          expect(root).not.toHaveAttribute("data-drop-target");
        });
      }
    );

    await step(
      "An empty drop (0 items) is handled without throwing",
      async () => {
        const dataTransfer = makeDataTransfer([]);
        expect(() => fireDrop(root, dataTransfer)).not.toThrow();
      }
    );
  },
};

export const RestrictedDropTypes: Story = {
  args: {
    "data-testid": "drop-zone-root",
    onDrop: fn(),
    getDropOperation: () => "cancel",
  } as never,
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);

    await step(
      "getDropOperation returning 'cancel' does not set data-drop-target",
      async () => {
        const dataTransfer = makeFileDataTransfer(makeFile("virus.exe"));
        fireDragOver(root, dataTransfer);
        await expect(root).not.toHaveAttribute("data-drop-target", "true");
      }
    );
  },
};

// ============================================================
// Composition (children replace the default) + disabled
// ============================================================

export const WithFileTriggerComposition: Story = {
  args: {
    "data-testid": "drop-zone-root",
  } as never,
  render: (args) => (
    <DropZone {...args}>
      <Text slot="label">Drop files, or browse to choose them</Text>
      <FileTrigger onSelect={fn()}>
        <Button>Browse files</Button>
      </FileTrigger>
    </DropZone>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Children fully replace the default icon and label",
      async () => {
        await expect(
          canvas.queryByText(/drag and drop files here/i)
        ).not.toBeInTheDocument();
        await expect(
          canvas.getByText(/drop files, or browse to choose them/i)
        ).toBeInTheDocument();
      }
    );

    await step("A composed FileTrigger renders inside the zone", async () => {
      const button = canvas.getByRole("button", { name: /browse files/i });
      await expect(button).toBeInTheDocument();
    });

    await step("Opens the native file picker when activated", async () => {
      const input =
        canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
      await expect(input).toBeInTheDocument();
    });
  },
};

export const CustomContent: Story = {
  args: {
    "data-testid": "drop-zone-root",
  } as never,
  render: (args) => (
    <DropZone {...args}>
      <Text slot="label">Drop your logo here</Text>
    </DropZone>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Custom children replace the default entirely", async () => {
      await expect(
        canvas.getByText(/drop your logo here/i)
      ).toBeInTheDocument();
      await expect(
        canvas.queryByText(/drag and drop files here/i)
      ).not.toBeInTheDocument();
    });
  },
};

export const Disabled: Story = {
  args: {
    "data-testid": "drop-zone-root",
    isDisabled: true,
    onDrop: fn(),
  } as never,
  parameters: {
    // The disabled layer style intentionally reduces opacity (per WCAG's
    // exemption for disabled/inactive UI, 1.4.3/1.4.11 do not apply), which
    // trips the automated contrast checker. Matches the precedent in
    // data-table.stories.tsx for the same reason.
    a11y: {
      config: {
        rules: [
          { id: "color-contrast-apca-custom", enabled: false },
          { id: "color-contrast", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <DropZone {...args}>
      <FileTrigger onSelect={fn()}>
        <Button isDisabled>Browse files</Button>
      </FileTrigger>
    </DropZone>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);

    await step("isDisabled rejects drops on the zone", async () => {
      const dataTransfer = makeFileDataTransfer(makeFile("report.txt"));
      fireDrop(root, dataTransfer);
      await expect(args.onDrop).not.toHaveBeenCalled();
    });

    await step("The composed button is also disabled", async () => {
      const button = canvas.getByRole("button", { name: /browse files/i });
      await expect(button).toBeDisabled();
    });
  },
};

// ============================================================
// Keyboard
// ============================================================

export const KeyboardAccessible: Story = {
  args: {
    "data-testid": "drop-zone-root",
  } as never,
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);
    const innerButton = root.querySelector("button");

    await step(
      "The drop target is keyboard focusable and shows a focus ring",
      async () => {
        if (!innerButton) throw new Error("Expected an inner button");
        await userEvent.tab();
        await waitFor(() => {
          expect(innerButton).toHaveFocus();
        });
        await expect(root).toHaveAttribute("data-focus-visible", "true");
      }
    );
  },
};
