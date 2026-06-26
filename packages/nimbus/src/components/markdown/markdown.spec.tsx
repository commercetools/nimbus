import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { NimbusProvider, Markdown } from "@commercetools/nimbus";

describe("Markdown — robust to empty and malformed input", () => {
  it("renders empty and whitespace-only sources without throwing", () => {
    expect(() =>
      render(
        <NimbusProvider>
          <Markdown>{""}</Markdown>
        </NimbusProvider>
      )
    ).not.toThrow();
    expect(() =>
      render(
        <NimbusProvider>
          <Markdown>{"   \n\n  "}</Markdown>
        </NimbusProvider>
      )
    ).not.toThrow();
  });

  it("renders malformed/partial markup without throwing", () => {
    const malformed = "**bold without close\n\n| a | b\n| - \n\n```ts\nlet x =";
    expect(() =>
      render(
        <NimbusProvider>
          <Markdown>{malformed}</Markdown>
        </NimbusProvider>
      )
    ).not.toThrow();
  });

  it("renders a malformed partial frame without throwing while streaming", () => {
    expect(() =>
      render(
        <NimbusProvider>
          <Markdown isStreaming>{"Here is a [link](http"}</Markdown>
        </NimbusProvider>
      )
    ).not.toThrow();
  });
});

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

  it("warns when allowedElements and disallowedElements are both passed", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <NimbusProvider>
        <Markdown allowedElements={["p"]} disallowedElements={["a"]}>
          {"Some text."}
        </Markdown>
      </NimbusProvider>
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("mutually exclusive")
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
