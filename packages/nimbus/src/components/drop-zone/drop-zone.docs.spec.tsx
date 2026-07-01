import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  DropZone,
  FileTrigger,
  Button,
  NimbusProvider,
} from "@commercetools/nimbus";
import type {
  DropEvent,
  DragTypes,
  DropOperation,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the drop zone renders with an accessible name
 * @docs-order 1
 */
describe("DropZone - Basic rendering", () => {
  it("renders with an explicit accessible name", () => {
    render(
      <NimbusProvider>
        <DropZone aria-label="Upload files" />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /upload files/i })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section on-drop-handling
 * @docs-title Handling Dropped Files
 * @docs-description Extract native File objects from a DropEvent and share the result with a composed FileTrigger
 * @docs-order 2
 */
describe("DropZone - onDrop file extraction", () => {
  it("resolves File objects from file drag items via getFile()", async () => {
    const handleFiles = vi.fn();

    const handleDrop = async (event: DropEvent) => {
      const files = await Promise.all(
        event.items
          .filter((item) => item.kind === "file")
          .map((item) =>
            "getFile" in item ? item.getFile() : Promise.resolve(null)
          )
      );
      handleFiles(files.filter((file): file is File => file !== null));
    };

    const fakeFile = new File(["hello"], "report.txt", {
      type: "text/plain",
    });
    const fakeEvent = {
      items: [
        {
          kind: "file" as const,
          type: "text/plain",
          name: "report.txt",
          getFile: () => Promise.resolve(fakeFile),
        },
      ],
    } as unknown as DropEvent;

    await handleDrop(fakeEvent);

    expect(handleFiles).toHaveBeenCalledTimes(1);
    expect(handleFiles).toHaveBeenCalledWith([fakeFile]);
  });

  it("shares a single handleFiles helper between onDrop and a composed FileTrigger", async () => {
    const handleFiles = vi.fn();

    const handleDrop = async (event: DropEvent) => {
      const files = await Promise.all(
        event.items
          .filter((item) => item.kind === "file")
          .map((item) =>
            "getFile" in item ? item.getFile() : Promise.resolve(null)
          )
      );
      handleFiles(files.filter((file): file is File => file !== null));
    };

    const handleSelect = (fileList: FileList | null) => {
      handleFiles(fileList ? Array.from(fileList) : []);
    };

    render(
      <NimbusProvider>
        <DropZone onDrop={handleDrop}>
          <FileTrigger onSelect={handleSelect}>
            <Button>Browse files</Button>
          </FileTrigger>
        </DropZone>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /browse files/i })
    ).toBeInTheDocument();

    // Both paths funnel through the same handleFiles helper.
    handleSelect(null);
    expect(handleFiles).toHaveBeenCalledWith([]);
  });
});

/**
 * @docs-section restricting-drop-types
 * @docs-title Restricting Accepted Drop Types
 * @docs-description Use getDropOperation as a type guard to reject unsupported drag types
 * @docs-order 3
 */
describe("DropZone - getDropOperation guard", () => {
  it("rejects types the zone does not accept", () => {
    const acceptedType = "image/png";
    const getDropOperation = (types: DragTypes): DropOperation =>
      types.has(acceptedType) ? "copy" : "cancel";

    const rejectingTypes = new Set(["application/x-msdownload"]);
    const acceptingTypes = new Set([acceptedType]);

    expect(getDropOperation(rejectingTypes as unknown as DragTypes)).toBe(
      "cancel"
    );
    expect(getDropOperation(acceptingTypes as unknown as DragTypes)).toBe(
      "copy"
    );
  });

  it("renders with a getDropOperation guard supplied", () => {
    const getDropOperation = (types: DragTypes): DropOperation =>
      types.has("image/png") ? "copy" : "cancel";

    render(
      <NimbusProvider>
        <DropZone getDropOperation={getDropOperation} />
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

/**
 * @docs-section disabled-both
 * @docs-title Disabling the Zone and Its Composed Trigger
 * @docs-description Set isDisabled explicitly on both DropZone and the composed FileTrigger/Button
 * @docs-order 4
 */
describe("DropZone - disabled composition", () => {
  it("disables both the drop target and the composed button", () => {
    const { container } = render(
      <NimbusProvider>
        <DropZone isDisabled data-testid="drop-zone-root">
          <FileTrigger>
            <Button isDisabled>Browse files</Button>
          </FileTrigger>
        </DropZone>
      </NimbusProvider>
    );

    const zone = container.querySelector(
      "[data-testid='drop-zone-root']"
    ) as HTMLElement;
    const trigger = screen.getByRole("button", { name: /browse files/i });

    expect(zone).toHaveAttribute("data-disabled", "true");
    expect(trigger).toBeDisabled();
  });
});
