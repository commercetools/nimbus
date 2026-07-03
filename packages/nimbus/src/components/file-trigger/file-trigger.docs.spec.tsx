import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileTrigger, Button, NimbusProvider } from "@commercetools/nimbus";

const getFileInput = (container: HTMLElement): HTMLInputElement => {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) throw new Error("FileTrigger did not render a file input");
  return input;
};

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the FileTrigger renders a pressable child plus a hidden file input
 * @docs-order 1
 */
describe("FileTrigger - Basic rendering", () => {
  it("renders the child trigger and a hidden file input", () => {
    const { container } = render(
      <NimbusProvider>
        <FileTrigger>
          <Button aria-label="Upload file">Upload file</Button>
        </FileTrigger>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /upload file/i })
    ).toBeInTheDocument();
    expect(getFileInput(container)).toHaveAttribute("type", "file");
  });

  it("forwards acceptedFileTypes to the input's accept attribute", () => {
    const { container } = render(
      <NimbusProvider>
        <FileTrigger acceptedFileTypes={["image/png", ".pdf"]}>
          <Button aria-label="Upload">Upload</Button>
        </FileTrigger>
      </NimbusProvider>
    );

    expect(getFileInput(container)).toHaveAttribute("accept", "image/png,.pdf");
  });

  it("forwards allowsMultiple to the input's multiple attribute", () => {
    const { container } = render(
      <NimbusProvider>
        <FileTrigger allowsMultiple>
          <Button aria-label="Upload">Upload</Button>
        </FileTrigger>
      </NimbusProvider>
    );

    expect(getFileInput(container)).toHaveAttribute("multiple");
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test selecting files through the FileTrigger
 * @docs-order 2
 */
describe("FileTrigger - Interactions", () => {
  it("calls onSelect with a FileList when a file is selected", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    const { container } = render(
      <NimbusProvider>
        <FileTrigger onSelect={handleSelect}>
          <Button aria-label="Upload file">Upload file</Button>
        </FileTrigger>
      </NimbusProvider>
    );

    const file = new File(["hello"], "report.txt", { type: "text/plain" });
    await user.upload(getFileInput(container), file);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    const files = handleSelect.mock.calls[0][0] as FileList;
    expect(files.length).toBe(1);
    expect(files[0].name).toBe("report.txt");
  });

  it("reports every file when allowsMultiple is set", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    const { container } = render(
      <NimbusProvider>
        <FileTrigger allowsMultiple onSelect={handleSelect}>
          <Button aria-label="Upload files">Upload files</Button>
        </FileTrigger>
      </NimbusProvider>
    );

    await user.upload(getFileInput(container), [
      new File(["a"], "a.txt", { type: "text/plain" }),
      new File(["b"], "b.txt", { type: "text/plain" }),
    ]);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect((handleSelect.mock.calls[0][0] as FileList).length).toBe(2);
  });
});

/**
 * @docs-section states
 * @docs-title State Tests
 * @docs-description Disabling is delegated to the child trigger
 * @docs-order 3
 */
describe("FileTrigger - States", () => {
  it("does not select when the child button is disabled", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <NimbusProvider>
        <FileTrigger onSelect={handleSelect}>
          <Button aria-label="Upload file" isDisabled>
            Upload file
          </Button>
        </FileTrigger>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /upload file/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleSelect).not.toHaveBeenCalled();
  });
});
