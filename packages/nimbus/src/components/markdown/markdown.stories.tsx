import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { Profiler, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Markdown } from "@commercetools/nimbus";
import type { MarkdownComponents } from "./markdown.types";
import { splitMarkdownIntoBlocks, withoutNode } from "./utils";
import { expect, waitFor, within } from "storybook/test";

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

const untrustedSource = `Normal **text** survives.

<script>window.__pwned = true;</script>

<iframe src="https://evil.example"></iframe>

[dangerous](javascript:alert(1))

![a cat](https://cdn.example.com/cat.png)
`;

/** Untrusted (default) posture blocks raw HTML and neutralizes dangerous URLs. */
export const SecurityUntrusted: Story = {
  render: () => <Markdown>{untrustedSource}</Markdown>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Scope element queries to the rendered markdown root so they don't match
    // framework-injected nodes elsewhere in the story canvas.
    const root = canvasElement.querySelector(".nimbus-markdown") as HTMLElement;

    // Safe content still renders.
    expect(root.querySelector("strong")).toHaveTextContent("text");

    // Raw HTML is not rendered live — `skipHtml` plus the element allowlist
    // strip dangerous elements under the untrusted default.
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
    const root = canvasElement.querySelector(".nimbus-markdown") as HTMLElement;
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
    const root = canvasElement.querySelector(".nimbus-markdown");
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
      const root = canvasElement.querySelector(".nimbus-markdown");
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
    expect(root).toHaveClass("nimbus-markdown");
    // The style prop landed on the outer container, not an inner element.
    // (The browser resolves `40ch` to a px value, so assert a width constraint
    // was applied rather than the literal token.)
    const maxWidth = getComputedStyle(root).maxWidth;
    expect(maxWidth).not.toBe("none");
    expect(maxWidth).toMatch(/px$/);
  },
};
// ---------------------------------------------------------------------------
// Interactive performance monitor (manual use only — NOT run in CI)
// ---------------------------------------------------------------------------
//
// This harness is intentionally built from plain DOM elements + inline styles
// (rather than Nimbus layout components) to keep its TypeScript instantiation
// footprint small — the component under test is `Markdown` itself.

/**
 * A rich markdown corpus streamed word-by-word, looped endlessly. Exercises
 * every renderer (headings, formatting, links, lists, task lists, a table, a
 * code block, a blockquote) so the stream is representative of real output.
 */
const PERF_CORPUS = `## Section heading

This paragraph mixes **bold**, _italic_, \`inline code\`, and an
[external link](https://commercetools.com) so every inline renderer is exercised
while the stream grows.

- A bullet item
- Another item with \`code\`
- [x] A completed task
- [ ] A pending task

| Metric | Value |
| --- | --- |
| Throughput | high |
| Latency | low |

> A blockquote to round out the block-level renderers.

\`\`\`ts
function stream(token) {
  buffer += token;
  return render(buffer);
}
\`\`\`
`;

// Word-ish chunks that preserve newlines — mimics token-by-token LLM output.
const PERF_TOKENS = PERF_CORPUS.match(/\s*\S+/g) ?? [];

const SPEEDS: Array<[string, number]> = [
  ["Fast", 8],
  ["Normal", 24],
  ["Slow", 80],
];

const panelStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  alignItems: "center",
  padding: 12,
  border: "1px solid #d4d4d4",
  borderRadius: 8,
  fontFamily: "system-ui, sans-serif",
};

const btnStyle = (active: boolean): CSSProperties => ({
  padding: "4px 10px",
  borderRadius: 6,
  border: "1px solid #d4d4d4",
  background: active ? "#1a1a1a" : "#fff",
  color: active ? "#fff" : "#1a1a1a",
  cursor: "pointer",
  font: "inherit",
  fontSize: 13,
});

const StreamingPerfMonitor = () => {
  const [text, setText] = useState("");
  const [running, setRunning] = useState(true);
  const [intervalMs, setIntervalMs] = useState(24);
  const [, forceTick] = useState(0);

  // Mutable counters updated outside React state to avoid re-render storms.
  const tokenIndex = useRef(0);
  const loops = useRef(0);
  const tokenCount = useRef(0);
  const startTime = useRef(performance.now());
  const lastRenderMs = useRef(0);
  const maxRenderMs = useRef(0);
  const frames = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Stream loop: append the next token on an interval while running.
  useEffect(() => {
    if (!running) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const idx = tokenIndex.current;
      let chunk = PERF_TOKENS[idx] ?? "";
      tokenIndex.current = idx + 1;
      // Endless: when the corpus is exhausted, start a fresh numbered section.
      if (tokenIndex.current >= PERF_TOKENS.length) {
        tokenIndex.current = 0;
        loops.current += 1;
        chunk += `\n\n---\n\n# Cycle ${loops.current + 1}\n`;
      }
      tokenCount.current += 1;
      setText((prev) => prev + chunk);
      timer = setTimeout(tick, intervalMs);
    };
    timer = setTimeout(tick, intervalMs);
    return () => clearTimeout(timer);
  }, [running, intervalMs]);

  // FPS sampler via requestAnimationFrame.
  useEffect(() => {
    let raf: number;
    const loop = (now: number) => {
      const f = frames.current;
      f.push(now);
      while (f.length > 0 && now - f[0] > 1000) f.shift();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Re-render the dashboard a few times a second so the numbers update,
  // decoupled from the token rate.
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 250);
    return () => clearInterval(id);
  }, []);

  // Keep the latest content in view, like a chat transcript.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [text]);

  const reset = () => {
    tokenIndex.current = 0;
    loops.current = 0;
    tokenCount.current = 0;
    startTime.current = performance.now();
    lastRenderMs.current = 0;
    maxRenderMs.current = 0;
    setText("");
  };

  const elapsedMs = performance.now() - startTime.current;
  const tokensPerSec =
    elapsedMs > 0 ? (tokenCount.current / elapsedMs) * 1000 : 0;
  const blocks = splitMarkdownIntoBlocks(text).length;

  const stat = (label: string, value: string) => (
    <div key={label} style={{ minWidth: 90 }}>
      <div style={{ fontWeight: 700, fontSize: 14 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#737373" }}>{label}</div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: "80ch",
      }}
    >
      <div style={panelStyle}>
        <button style={btnStyle(false)} onClick={() => setRunning((r) => !r)}>
          {running ? "Pause" : "Resume"}
        </button>
        <button style={btnStyle(false)} onClick={reset}>
          Reset
        </button>
        <span style={{ fontSize: 12, color: "#737373" }}>Speed:</span>
        {SPEEDS.map(([label, ms]) => (
          <button
            key={label}
            style={btnStyle(intervalMs === ms)}
            onClick={() => setIntervalMs(ms)}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ ...panelStyle, background: "#fafafa" }}>
        {stat("tokens", String(tokenCount.current))}
        {stat("tokens/s", tokensPerSec.toFixed(0))}
        {stat("characters", text.length.toLocaleString())}
        {stat("blocks", String(blocks))}
        {stat("render (last)", `${lastRenderMs.current.toFixed(1)}ms`)}
        {stat("render (max)", `${maxRenderMs.current.toFixed(1)}ms`)}
        {stat("FPS", String(frames.current.length))}
        {stat("elapsed", `${(elapsedMs / 1000).toFixed(0)}s`)}
      </div>

      <div
        ref={scrollRef}
        style={{
          maxHeight: 420,
          overflowY: "auto",
          padding: 16,
          border: "1px solid #d4d4d4",
          borderRadius: 8,
        }}
      >
        <Profiler
          id="markdown-stream"
          onRender={(_id, _phase, actualDuration) => {
            lastRenderMs.current = actualDuration;
            if (actualDuration > maxRenderMs.current) {
              maxRenderMs.current = actualDuration;
            }
          }}
        >
          <Markdown isStreaming={running}>
            {text || "_Waiting for the first token…_"}
          </Markdown>
        </Profiler>
      </div>
    </div>
  );
};

/**
 * **Manual performance monitor — not run in CI.**
 *
 * Streams a rich markdown corpus word-by-word, endlessly, so you can watch the
 * component under sustained streaming load in the browser
 * (`pnpm start:storybook` → Components / Markdown / Streaming Performance).
 *
 * What to watch:
 * - **render (last/max)** — per-commit React render time via `<Profiler>`. Block
 *   memoization should keep this low and roughly flat as the document grows,
 *   because only the final block re-parses per token.
 * - **FPS** — should stay near your display's refresh rate while streaming.
 * - **blocks / characters** — grow without bound; hit **Reset** to clear. Note
 *   the streaming pre-pass (`remend` + block split) runs over the full string
 *   each token, so very long transcripts will show that cost climb — a useful
 *   thing to see before relying on truly unbounded streams.
 */
export const StreamingPerformance: Story = {
  // No play function, and excluded from the test runner: this story streams
  // forever and is meant for manual observation only.
  tags: ["!test", "!a11y-test"],
  render: () => <StreamingPerfMonitor />,
};
