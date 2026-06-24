import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Markdown } from "@commercetools/nimbus";
import type { MarkdownComponents } from "./markdown.types";
import { withoutNode } from "./markdown.utils";
import { expect, waitFor, within } from "storybook/test";
import rehypeRaw from "rehype-raw";

const meta: Meta<typeof Markdown> = {
  title: "Components/Markdown",
  component: Markdown,
};

export default meta;

type Story = StoryObj<typeof meta>;

const standardSource = `# Heading One

A paragraph with **bold**, _italic_, and \`inline code\`.

## Heading Two

- First item
- Second item

> A blockquote.

\`\`\`ts
const answer = 42;
\`\`\`
`;

/**
 * Every standard markdown element renders as the corresponding Nimbus-styled,
 * semantic element using the Figma typography scale.
 */
export const Defaults: Story = {
  render: () => <Markdown>{standardSource}</Markdown>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const h1 = canvas.getByRole("heading", { level: 1, name: "Heading One" });
    expect(h1.tagName).toBe("H1");
    expect(canvas.getByRole("heading", { level: 2, name: "Heading Two" }));

    // Paragraph with inline formatting.
    expect(canvasElement.querySelector("strong")).toHaveTextContent("bold");
    expect(canvasElement.querySelector("em")).toHaveTextContent("italic");

    // Inline code renders as <code>, code block as <pre><code>.
    expect(canvasElement.querySelector("pre code")).toHaveTextContent(
      "const answer = 42;"
    );

    // List + blockquote.
    expect(canvas.getAllByRole("listitem")).toHaveLength(2);
    expect(canvasElement.querySelector("blockquote")).toHaveTextContent(
      "A blockquote."
    );

    // Default renderers never leak the hast `node` prop to the DOM.
    expect(h1).not.toHaveAttribute("node");
    expect(canvasElement.querySelector("p")).not.toHaveAttribute("node");
  },
};

const gfmSource = `| Feature | Status |
| --- | --- |
| Tables | Done |

- [x] Completed task
- [ ] Pending task

~~struck through~~

Visit https://example.com for more.
`;

/** GitHub Flavored Markdown: tables, task lists, strikethrough, autolinks. */
export const GitHubFlavoredMarkdown: Story = {
  render: () => <Markdown>{gfmSource}</Markdown>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Table with header-cell scope semantics.
    expect(canvas.getByRole("table"));
    const headerCell = canvasElement.querySelector("th");
    expect(headerCell).toHaveAttribute("scope", "col");

    // Task-list checkboxes are read-only with a name derived from item text.
    const checkboxes = canvasElement.querySelectorAll<HTMLInputElement>(
      "input[type='checkbox']"
    );
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[0]).toHaveAttribute("aria-label", "Completed task");
    expect(checkboxes[0].readOnly).toBe(true);

    // Strikethrough + autolink.
    expect(canvasElement.querySelector("del")).toHaveTextContent(
      "struck through"
    );
    expect(canvas.getByRole("link", { name: /example\.com/ })).toHaveAttribute(
      "href",
      "https://example.com"
    );
  },
};

/** A single override replaces one element; all other defaults stay intact. */
export const PerElementOverride: Story = {
  render: () => {
    const components: MarkdownComponents = {
      a: ({ children, ...props }) => (
        <a data-testid="custom-link" {...withoutNode(props)}>
          {children}
        </a>
      ),
    };
    return (
      <Markdown components={components}>
        {`[a link](https://example.com) inside a paragraph with \`code\`.`}
      </Markdown>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Anchor uses the override.
    const link = canvas.getByTestId("custom-link");
    expect(link).toHaveAttribute("href", "https://example.com");
    // Override does not leak `node`.
    expect(link).not.toHaveAttribute("node");
    // Other defaults remain (inline code still rendered).
    expect(canvasElement.querySelector("code")).toHaveTextContent("code");
  },
};

/** A rehype plugin emits a non-standard node rendered via `components`. */
export const CustomNodeRenderer: Story = {
  render: () => {
    const rehypeAppendBadge = () => (tree: { children: unknown[] }) => {
      tree.children.push({
        type: "element",
        tagName: "mark",
        properties: {},
        children: [{ type: "text", value: "BADGE" }],
      });
    };
    const components: MarkdownComponents = {
      mark: (props) => (
        <span data-testid="custom-node" {...withoutNode(props)} />
      ),
    };
    return (
      <Markdown
        rehypePlugins={[rehypeAppendBadge]}
        allowedElements={["p", "mark"]}
        components={components}
      >
        {`Some text.`}
      </Markdown>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByTestId("custom-node");
    expect(badge).toHaveTextContent("BADGE");
  },
};

const untrustedSource = `Normal **text** survives.

<script>window.__pwned = true;</script>

<iframe src="https://evil.example"></iframe>

[dangerous](javascript:alert(1))

![a cat](https://cdn.example.com/cat.png)
`;

/** Untrusted (default) posture blocks raw HTML and neutralizes dangerous URLs. */
export const SecurityUntrusted: Story = {
  render: () => (
    <Markdown rehypePlugins={[rehypeRaw]}>{untrustedSource}</Markdown>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Scope element queries to the rendered markdown root so they don't match
    // framework-injected nodes elsewhere in the story canvas.
    const root = canvasElement.querySelector(
      ".nimbus-markdown__root"
    ) as HTMLElement;

    // Safe content still renders.
    expect(root.querySelector("strong")).toHaveTextContent("text");

    // Raw HTML is not rendered live — even with rehype-raw appended, the
    // allowlist strips dangerous elements.
    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("iframe")).toBeNull();
    // The injection did not execute.
    expect(
      (window as unknown as { __pwned?: boolean }).__pwned
    ).toBeUndefined();

    // Dangerous URL neutralized by react-markdown's urlTransform — the
    // `javascript:` protocol is stripped from the anchor's href.
    const anchor = root.querySelector("a");
    expect(anchor).toHaveTextContent("dangerous");
    expect(anchor?.getAttribute("href") ?? "").not.toContain("javascript:");

    // Images carry lazy-loading + no-referrer and are gated by app CSP.
    const img = canvas.getByRole("img", { name: "a cat" });
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("referrerpolicy", "no-referrer");
  },
};

/** Trusted content may opt into raw HTML; dangerous tags are still sanitized. */
export const TrustedRawHtml: Story = {
  render: () => (
    <Markdown trust="trusted" allowRawHtml>
      {`Inline <b>bold html</b> and <em>emphasis</em>.

<script>window.__trustedPwned = true;</script>`}
    </Markdown>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      ".nimbus-markdown__root"
    ) as HTMLElement;
    // Safe raw HTML renders.
    expect(root.querySelector("b")).toHaveTextContent("bold html");
    // Dangerous raw HTML stripped by rehype-sanitize (runs after rehype-raw).
    expect(root.querySelector("script")).toBeNull();
    expect(
      (window as unknown as { __trustedPwned?: boolean }).__trustedPwned
    ).toBeUndefined();
  },
};

/** A partial inline construct renders as formatted content via remend. */
export const StreamingPartialConstruct: Story = {
  render: () => <Markdown isStreaming>{"A sentence with **bold tex"}</Markdown>,
  play: async ({ canvasElement }) => {
    // remend completes the unterminated bold so it renders as <strong>.
    await waitFor(() =>
      expect(canvasElement.querySelector("strong")).toHaveTextContent(
        "bold tex"
      )
    );
    // The root advertises a busy state while streaming.
    const root = canvasElement.querySelector(".nimbus-markdown__root");
    expect(root).toHaveAttribute("aria-busy", "true");
  },
};

const STREAM_CHUNKS = [
  "# Streamed\n\n",
  "We shipped **streaming** ",
  "with a `Markdown` component.\n",
];

/** End-to-end stream: busy → settled, with a single completion announcement. */
export const StreamingLifecycle: Story = {
  render: () => {
    const StreamDemo = () => {
      const [count, setCount] = useState(1);
      const done = count >= STREAM_CHUNKS.length;
      useEffect(() => {
        if (done) return;
        const id = setTimeout(() => setCount((c) => c + 1), 40);
        return () => clearTimeout(id);
      }, [count, done]);
      return (
        <Markdown isStreaming={!done}>
          {STREAM_CHUNKS.slice(0, count).join("")}
        </Markdown>
      );
    };
    return <StreamDemo />;
  },
  play: async ({ canvasElement }) => {
    // Final content renders.
    await waitFor(() =>
      expect(canvasElement.querySelector("strong")).toHaveTextContent(
        "streaming"
      )
    );
    // Once settled, aria-busy clears and a polite completion is announced.
    await waitFor(() => {
      const root = canvasElement.querySelector(".nimbus-markdown__root");
      expect(root).not.toHaveAttribute("aria-busy", "true");
    });
    await waitFor(() => {
      const status = canvasElement.querySelector("[role='status']");
      expect(status).toHaveTextContent("Response complete");
    });
  },
};

/** `headingOffset` shifts the rendered heading level to preserve page outline. */
export const HeadingOffset: Story = {
  render: () => <Markdown headingOffset={2}>{`# Top level`}</Markdown>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // markdown level 1 + offset 2 => h3
    const heading = canvas.getByRole("heading", {
      level: 3,
      name: "Top level",
    });
    expect(heading.tagName).toBe("H3");
  },
};

/** External links get rel/target, an i18n label, and a non-color indicator. */
export const ExternalLinkSemantics: Story = {
  render: () => (
    <Markdown>{`[commercetools](https://commercetools.com)`}</Markdown>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: /commercetools/ });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
    // i18n "opens in new tab" label is present for assistive tech.
    expect(link).toHaveTextContent("(opens in new tab)");
    // Visible, non-color indicator (an icon).
    expect(link.querySelector("svg")).toBeTruthy();
  },
};

/** Style props forward to the outer root container (standard Nimbus pattern). */
export const StylePropsForwarded: Story = {
  render: () => (
    <Markdown maxW="40ch" data-testid="md-root">
      {`# Constrained\n\nThis content is width-constrained by a style prop.`}
    </Markdown>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("md-root");
    expect(root).toHaveClass("nimbus-markdown__root");
    // The style prop landed on the outer container, not an inner element.
    // (The browser resolves `40ch` to a px value, so assert a width constraint
    // was applied rather than the literal token.)
    const maxWidth = getComputedStyle(root).maxWidth;
    expect(maxWidth).not.toBe("none");
    expect(maxWidth).toMatch(/px$/);
  },
};
