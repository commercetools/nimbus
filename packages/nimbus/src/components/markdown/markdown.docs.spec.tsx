import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Markdown, NimbusProvider } from "@commercetools/nimbus";
import type { MarkdownComponents } from "./markdown.types";

/**
 * @docs-section basic-rendering
 * @docs-title Basic rendering
 * @docs-description Render a Markdown string into Nimbus-styled, semantic elements
 * @docs-order 1
 */
describe("Markdown - Basic rendering", () => {
  it("renders headings, paragraphs, and inline formatting", () => {
    render(
      <NimbusProvider>
        <Markdown>{`# Release notes\n\nWe shipped **streaming** support.`}</Markdown>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Release notes" })
    ).toBeInTheDocument();
    expect(screen.getByText("streaming").tagName).toBe("STRONG");
  });
});

/**
 * @docs-section overrides
 * @docs-title Overriding an element renderer
 * @docs-description Replace a single element's renderer; all other defaults stay intact
 * @docs-order 2
 */
describe("Markdown - Per-element override", () => {
  it("renders anchors with a custom component", () => {
    const components: MarkdownComponents = {
      a: ({ children, href }) => (
        <a data-tracking="external" href={href}>
          {children}
        </a>
      ),
    };

    render(
      <NimbusProvider>
        <Markdown components={components}>
          {`Read the [docs](https://docs.example.com).`}
        </Markdown>
      </NimbusProvider>
    );

    const link = screen.getByRole("link", { name: "docs" });
    expect(link).toHaveAttribute("data-tracking", "external");
  });
});

/**
 * @docs-section safe-by-default
 * @docs-title Safe by default for untrusted content
 * @docs-description Raw HTML in untrusted (default) content is not rendered as live markup
 * @docs-order 3
 */
describe("Markdown - Untrusted content", () => {
  it("does not render raw HTML from untrusted sources", () => {
    const { container } = render(
      <NimbusProvider>
        <Markdown>{`Hello <script>alert(1)</script> world.`}</Markdown>
      </NimbusProvider>
    );

    const root = container.querySelector(".nimbus-markdown");
    expect(root?.querySelector("script")).toBeNull();
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
  });
});

/**
 * @docs-section streaming
 * @docs-title Rendering streamed (LLM) output
 * @docs-description Set `isStreaming` so partial tokens render cleanly while a response streams in
 * @docs-order 4
 */
describe("Markdown - Streaming", () => {
  it("completes an unterminated construct so it renders as formatted content", () => {
    render(
      <NimbusProvider>
        {/* A model has emitted a half-written bold span. */}
        <Markdown isStreaming>{`A sentence with **bold tex`}</Markdown>
      </NimbusProvider>
    );

    expect(screen.getByText("bold tex").tagName).toBe("STRONG");
  });
});
