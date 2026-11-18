import { spyOn } from "storybook/test";

/**
 * How the fake clipboard behaves in `captureCopiedText`.
 */
type ClipboardBehavior = {
  /** Whether `navigator.clipboard.writeText` resolves or rejects. */
  clipboardApi?: "resolve" | "reject";
  /** Whether the `execCommand("copy")` fallback succeeds. */
  execCommand?: "succeed" | "fail";
};

/**
 * Replaces the Clipboard API, `execCommand("copy")` and `window.prompt` (the
 * manual-copy prompt of the fallback) with fakes that record the copied text.
 * Call it in a story's `beforeEach` and return `restore`, so the fakes never
 * outlive the story.
 */
export const captureCopiedText = ({
  clipboardApi = "resolve",
  execCommand = "succeed",
}: ClipboardBehavior = {}) => {
  const copied: string[] = [];
  const writeTextSpy = spyOn(
    navigator.clipboard,
    "writeText"
  ).mockImplementation(async (text) => {
    if (clipboardApi === "reject") {
      throw new DOMException("Write permission denied.", "NotAllowedError");
    }
    copied.push(text);
  });
  const execCommandSpy = spyOn(document, "execCommand").mockImplementation(
    (command) => {
      if (command !== "copy" || execCommand === "fail") return false;
      const selection = document.getSelection();
      copied.push(
        selection !== null && selection.rangeCount > 0
          ? (selection.getRangeAt(0).commonAncestorContainer.textContent ?? "")
          : ""
      );
      return true;
    }
  );
  const promptSpy = spyOn(window, "prompt").mockReturnValue(null);
  return {
    copied,
    restore: () => {
      writeTextSpy.mockRestore();
      execCommandSpy.mockRestore();
      promptSpy.mockRestore();
    },
  };
};

/**
 * Replaces object URLs and anchor clicks with fakes that record every
 * download (file name and content) instead of starting it.
 */
export const captureDownloads = () => {
  const downloads: Array<{ fileName: string; blob: Blob }> = [];
  let lastBlob: Blob | undefined;
  const createSpy = spyOn(URL, "createObjectURL").mockImplementation(
    (object) => {
      lastBlob = object as Blob;
      return "blob:code-block-test";
    }
  );
  const revokeSpy = spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  const clickSpy = spyOn(
    HTMLAnchorElement.prototype,
    "click"
  ).mockImplementation(function (this: HTMLAnchorElement) {
    if (lastBlob !== undefined) {
      downloads.push({ fileName: this.download, blob: lastBlob });
    }
  });
  return {
    downloads,
    createObjectURL: createSpy,
    restore: () => {
      createSpy.mockRestore();
      revokeSpy.mockRestore();
      clickSpy.mockRestore();
    },
  };
};

/**
 * Returns the `.nimbus-code-block__line` elements inside `container`.
 */
export const getLines = (container: Element): HTMLElement[] =>
  Array.from(container.querySelectorAll(".nimbus-code-block__line"));

/**
 * Returns the line numbers (1-based positions) of the lines that carry
 * `data-mark="<mark>"`.
 */
export const getMarkedLinePositions = (
  container: Element,
  mark: "highlighted" | "added" | "removed"
): number[] =>
  getLines(container).flatMap((line, index) =>
    line.dataset.mark === mark ? [index + 1] : []
  );
