import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FileTrigger,
  Button,
  IconButton,
  Stack,
  Text,
} from "@commercetools/nimbus";
import { AttachFile } from "@commercetools/nimbus-icons";
import { userEvent, within, expect, fn } from "storybook/test";
import { useState } from "react";

const meta: Meta<typeof FileTrigger> = {
  title: "Components/FileTrigger",
  component: FileTrigger,
};

export default meta;

type Story = StoryObj<typeof FileTrigger>;

/** Returns the visually-hidden file input rendered by React Aria's FileTrigger. */
const getFileInput = (canvasElement: HTMLElement): HTMLInputElement => {
  const input =
    canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) throw new Error("FileTrigger did not render a file input");
  return input;
};

const makeFile = (name: string, type = "text/plain") =>
  new File(["hello"], name, { type });

/**
 * Base case: a Nimbus Button as the child trigger, single-file selection.
 */
export const Base: Story = {
  args: {
    onSelect: fn(),
  },
  render: (args) => (
    <FileTrigger {...args}>
      <Button aria-label="Upload file">Upload file</Button>
    </FileTrigger>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = getFileInput(canvasElement);

    await step("Renders a Nimbus Button as the trigger", async () => {
      const button = canvas.getByRole("button", { name: /upload file/i });
      await expect(button.tagName).toBe("BUTTON");
    });

    await step("Renders a hidden file input", async () => {
      await expect(input).toBeInTheDocument();
      await expect(input).toHaveAttribute("type", "file");
    });

    await step(
      "Hidden input is removed from the layout (display:none) so only the child is interactive",
      async () => {
        const style = window.getComputedStyle(input);
        await expect(style.display).toBe("none");
      }
    );

    await step(
      "Single file selection fires onSelect with a FileList of one",
      async () => {
        await userEvent.upload(input, makeFile("report.txt"));
        await expect(args.onSelect).toHaveBeenCalledTimes(1);
        const files = (args.onSelect as ReturnType<typeof fn>).mock
          .calls[0][0] as FileList;
        await expect(files).toBeInstanceOf(FileList);
        await expect(files.length).toBe(1);
        await expect(files[0].name).toBe("report.txt");
      }
    );

    await step("Single-select input has no multiple attribute", async () => {
      await expect(input).not.toHaveAttribute("multiple");
    });
  },
};

/**
 * `allowsMultiple` lets the user pick more than one file at once.
 */
export const AllowsMultiple: Story = {
  args: {
    allowsMultiple: true,
    onSelect: fn(),
  },
  render: (args) => (
    <FileTrigger {...args}>
      <Button aria-label="Upload files">Upload files</Button>
    </FileTrigger>
  ),
  play: async ({ canvasElement, args, step }) => {
    const input = getFileInput(canvasElement);

    await step("Hidden input has the multiple attribute", async () => {
      await expect(input).toHaveAttribute("multiple");
    });

    await step("Selecting multiple files reports all of them", async () => {
      await userEvent.upload(input, [
        makeFile("a.txt"),
        makeFile("b.txt"),
        makeFile("c.txt"),
      ]);
      await expect(args.onSelect).toHaveBeenCalledTimes(1);
      const files = (args.onSelect as ReturnType<typeof fn>).mock
        .calls[0][0] as FileList;
      await expect(files.length).toBe(3);
    });
  },
};

/**
 * `acceptedFileTypes` restricts the picker via the input's `accept` attribute.
 */
export const AcceptedFileTypes: Story = {
  args: {
    acceptedFileTypes: ["image/png", ".pdf"],
    onSelect: fn(),
  },
  render: (args) => (
    <FileTrigger {...args}>
      <Button aria-label="Upload image or PDF">Upload image or PDF</Button>
    </FileTrigger>
  ),
  play: async ({ canvasElement, step }) => {
    const input = getFileInput(canvasElement);

    await step("accept attribute reflects accepted types", async () => {
      await expect(input).toHaveAttribute("accept", "image/png,.pdf");
    });
  },
};

/**
 * `acceptDirectory` enables selecting a whole folder.
 */
export const AcceptDirectory: Story = {
  args: {
    acceptDirectory: true,
    onSelect: fn(),
  },
  render: (args) => (
    <FileTrigger {...args}>
      <Button aria-label="Select folder">Select folder</Button>
    </FileTrigger>
  ),
  play: async ({ canvasElement, step }) => {
    const input = getFileInput(canvasElement);

    await step("Hidden input has directory-selection attribute", async () => {
      await expect(input).toHaveAttribute("webkitdirectory");
    });
  },
};

/**
 * `defaultCamera` hints which camera mobile devices should use, mapping to the
 * input's `capture` attribute.
 *
 * NOTE: `capture` is only honored by mobile browsers with a camera. On desktop
 * it is ignored entirely and the normal file dialog opens — so this story
 * asserts the rendered `capture` attribute rather than that a camera launches.
 */
export const CameraCapture: Story = {
  args: {
    defaultCamera: "environment",
    acceptedFileTypes: ["image/*"],
    onSelect: fn(),
  },
  render: (args) => (
    <FileTrigger {...args}>
      <Button aria-label="Take photo">Take photo</Button>
    </FileTrigger>
  ),
  play: async ({ canvasElement, step }) => {
    const input = getFileInput(canvasElement);

    await step("capture attribute reflects the camera hint", async () => {
      await expect(input).toHaveAttribute("capture", "environment");
    });
  },
};

/**
 * Any pressable Nimbus component works as the child — here an `IconButton` for a
 * compact "attach" affordance. The accessible name comes from the child's
 * `aria-label`.
 */
export const IconButtonTrigger: Story = {
  args: {
    onSelect: fn(),
  },
  render: (args) => (
    <FileTrigger {...args}>
      <IconButton aria-label="Attach file" variant="ghost">
        <AttachFile />
      </IconButton>
    </FileTrigger>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const input = getFileInput(canvasElement);

    await step("IconButton acts as the trigger", async () => {
      const button = canvas.getByRole("button", { name: /attach file/i });
      await expect(button.tagName).toBe("BUTTON");
      await expect(button).toHaveAccessibleName("Attach file");
    });

    await step("Selecting a file fires onSelect", async () => {
      await userEvent.upload(input, makeFile("photo.png", "image/png"));
      await expect(args.onSelect).toHaveBeenCalledTimes(1);
      const files = (args.onSelect as ReturnType<typeof fn>).mock
        .calls[0][0] as FileList;
      await expect(files[0].name).toBe("photo.png");
    });
  },
};

/**
 * Disabling is delegated to the child: a disabled Button cannot open the picker.
 */
export const DisabledChild: Story = {
  args: {
    onSelect: fn(),
  },
  render: (args) => (
    <FileTrigger {...args}>
      <Button aria-label="Upload file" isDisabled>
        Upload file
      </Button>
    </FileTrigger>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("The child button is disabled", async () => {
      const button = canvas.getByRole("button", { name: /upload file/i });
      await expect(button).toBeDisabled();
    });

    await step("Pressing the disabled trigger does not select", async () => {
      const button = canvas.getByRole("button", { name: /upload file/i });
      await userEvent.click(button);
      await expect(args.onSelect).not.toHaveBeenCalled();
    });
  },
};

/**
 * The trigger is a real, keyboard-focusable button; activation semantics are
 * delegated to the child via React Aria.
 */
export const KeyboardAccessible: Story = {
  args: {
    onSelect: fn(),
  },
  render: (args) => (
    <FileTrigger {...args}>
      <Button aria-label="Upload file">Upload file</Button>
    </FileTrigger>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Trigger is focusable with the Tab key", async () => {
      const button = canvas.getByRole("button", { name: /upload file/i });
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });

    await step("Accessible name is derived from the child button", async () => {
      const button = canvas.getByRole("button", { name: /upload file/i });
      await expect(button).toHaveAccessibleName("Upload file");
    });
  },
};

/**
 * Demonstrates lifting the selection into state for display — the common
 * consumer pattern.
 */
export const WithSelectedFileName: Story = {
  args: {
    onSelect: fn(),
  },
  render: (args) => {
    const Demo = () => {
      const [name, setName] = useState<string>("");
      return (
        <Stack>
          <FileTrigger
            {...args}
            onSelect={(files) => {
              args.onSelect?.(files);
              const list = files ? Array.from(files) : [];
              setName(list[0]?.name ?? "");
            }}
          >
            <Button aria-label="Choose file">Choose file</Button>
          </FileTrigger>
          <Text data-testid="selected-file">{name || "No file selected"}</Text>
        </Stack>
      );
    };
    return <Demo />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = getFileInput(canvasElement);

    await step("Selecting a file updates the displayed name", async () => {
      await userEvent.upload(input, makeFile("invoice.pdf"));
      await expect(canvas.getByTestId("selected-file")).toHaveTextContent(
        "invoice.pdf"
      );
    });
  },
};
