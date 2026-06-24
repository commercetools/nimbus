import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { NimbusProvider, Markdown } from "@commercetools/nimbus";

describe("Markdown — development-mode warnings", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("warns when author markdown skips a heading level", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <NimbusProvider>
        <Markdown>{"# Title\n\n### Skipped to three"}</Markdown>
      </NimbusProvider>
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Heading level skip")
    );
  });

  it("warns when an image is missing alt text", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <NimbusProvider>
        <Markdown>{"![](https://cdn.example.com/x.png)"}</Markdown>
      </NimbusProvider>
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("missing alt text")
    );
  });

  it("does not warn for a well-formed document", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <NimbusProvider>
        <Markdown>
          {"# Title\n\n## Section\n\n![a cat](https://cdn.example.com/cat.png)"}
        </Markdown>
      </NimbusProvider>
    );
    expect(warn).not.toHaveBeenCalled();
  });
});
