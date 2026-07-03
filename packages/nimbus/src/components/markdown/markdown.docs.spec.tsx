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
 * @docs-section custom-components
 * @docs-title Embedding custom component tags
 * @docs-description Register a tag in `components`, then embed it in the source; its attributes arrive as props
 * @docs-order 3
 */
describe("Markdown - Custom component tags", () => {
  it("renders a registered custom tag with its attributes as props", () => {
    const components: MarkdownComponents = {
      SearchQueryResultCard: (props: { id?: string; node?: unknown }) => (
        <div data-testid="result-card" data-id={props.id} />
      ),
    };

    render(
      <NimbusProvider>
        <Markdown components={components}>
          {`Top result:\n\n<SearchQueryResultCard id="sku-42" />`}
        </Markdown>
      </NimbusProvider>
    );

    expect(screen.getByTestId("result-card")).toHaveAttribute(
      "data-id",
      "sku-42"
    );
  });

  it("leaves an unregistered tag inert", () => {
    const { container } = render(
      <NimbusProvider>
        <Markdown>{`Before <UnknownWidget /> after.`}</Markdown>
      </NimbusProvider>
    );

    const root = container.querySelector(".nimbus-markdown");
    expect(root?.querySelector("unknownwidget")).toBeNull();
    expect(screen.getByText(/Before/)).toBeInTheDocument();
  });
});

/**
 * @docs-section safe-by-default
 * @docs-title Safe by default
 * @docs-description Raw HTML is never rendered as live markup, and dangerous URLs are neutralized
 * @docs-order 4
 */
describe("Markdown - Safe by default", () => {
  it("does not render raw HTML", () => {
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
 * @docs-order 5
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
