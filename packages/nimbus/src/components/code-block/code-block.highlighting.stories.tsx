import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect, waitFor, userEvent } from "storybook/test";
import java from "refractor/java";
import {
  CodeBlock,
  CodeHighlighterProvider,
  createPrismHighlighter,
  Button,
  Stack,
  type CodeHighlighter,
  type CodeLine,
} from "@commercetools/nimbus";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 *
 * Stories in this file cover the highlighting engine: grammars, aliases,
 * custom highlighters and asynchronous highlighters.
 */
const meta: Meta<typeof CodeBlock.Root> = {
  title: "Components/CodeBlock",
  component: CodeBlock.Root,
};

export default meta;
type Story = StoryObj<typeof meta>;

const getCodeElement = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(".nimbus-code-block__code");

/**
 * Splits code into lines of one token with the given type.
 */
const toTypedLines = (code: string, type: string): CodeLine[] =>
  code
    .split("\n")
    .map((line) => (line === "" ? [] : [{ content: line, types: [type] }]));

/**
 * A highlighter that resolves after a delay that depends on the code, so a
 * story can make an older request finish after a newer one.
 */
const createDelayedHighlighter = (
  delays: Record<string, number>
): CodeHighlighter => ({
  resolveLanguage: (language) => language,
  highlight: (code) =>
    new Promise((resolve) =>
      setTimeout(
        () => resolve(toTypedLines(code, "async-token")),
        delays[code] ?? 0
      )
    ),
});

// ---------------------------------------------------------------------------
// BashHighlighting
// ---------------------------------------------------------------------------

/**
 * Shell code is highlighted by the default `bash` grammar.
 */
export const BashHighlighting: Story = {
  render: () => (
    <CodeBlock.Root code="npm install --save foo # note" language="bash">
      <CodeBlock.Content />
    </CodeBlock.Root>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Shell code gets typed tokens", async () => {
      const code = getCodeElement(canvasElement);
      await expect(code?.querySelector(".token.comment")).toHaveTextContent(
        "# note"
      );
      await expect(code).toHaveTextContent("npm install --save foo # note");
    });
  },
};

// ---------------------------------------------------------------------------
// AliasResolvesLanguage
// ---------------------------------------------------------------------------

/**
 * The alias `sh` resolves to the `bash` grammar.
 */
export const AliasResolvesLanguage: Story = {
  render: () => (
    <Stack gap="400">
      <CodeBlock.Root
        code="npm install --save foo # note"
        language="sh"
        aria-label="Alias"
      >
        <CodeBlock.Content />
      </CodeBlock.Root>
      <CodeBlock.Root
        code="npm install --save foo # note"
        language="bash"
        aria-label="Language id"
      >
        <CodeBlock.Content />
      </CodeBlock.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("sh renders the same tokens as bash", async () => {
      const alias = getCodeElement(
        canvas.getByRole("region", { name: "Alias" })
      );
      const languageId = getCodeElement(
        canvas.getByRole("region", { name: "Language id" })
      );
      await expect(alias?.querySelectorAll(".token").length).toBeGreaterThan(0);
      await expect(alias?.innerHTML).toBe(languageId?.innerHTML);
    });
  },
};

// ---------------------------------------------------------------------------
// AdditionalLanguage
// ---------------------------------------------------------------------------

const javaHighlighter = createPrismHighlighter({ additionalLanguages: [java] });

/**
 * `createPrismHighlighter({ additionalLanguages })` adds grammars, here Java
 * from `refractor/java`, through `CodeHighlighterProvider`.
 */
export const AdditionalLanguage: Story = {
  render: () => (
    <CodeHighlighterProvider highlighter={javaHighlighter}>
      <CodeBlock.Root code="public class Greeter {}" language="java">
        <CodeBlock.Content />
      </CodeBlock.Root>
    </CodeHighlighterProvider>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Java code gets typed tokens", async () => {
      const code = getCodeElement(canvasElement);
      await expect(code?.querySelector(".token.keyword")).toHaveTextContent(
        "public"
      );
    });
  },
};

// ---------------------------------------------------------------------------
// CustomHighlighter
// ---------------------------------------------------------------------------

const customHighlighter: CodeHighlighter = {
  resolveLanguage: () => "custom",
  highlight: (code) => toTypedLines(code, "custom-token"),
};

/**
 * `CodeHighlighterProvider` replaces the default engine with any object that
 * implements `CodeHighlighter`.
 */
export const CustomHighlighter: Story = {
  render: () => (
    <CodeHighlighterProvider highlighter={customHighlighter}>
      <CodeBlock.Root code={"first line\nsecond line"} language="anything">
        <CodeBlock.Content />
      </CodeBlock.Root>
    </CodeHighlighterProvider>
  ),
  play: async ({ canvasElement, step }) => {
    await step("The block uses the custom highlighter's tokens", async () => {
      const tokens = getCodeElement(canvasElement)?.querySelectorAll(
        ".token.custom-token"
      );
      await expect(tokens).toHaveLength(2);
      await expect(tokens?.[1]).toHaveTextContent("second line");
    });
  },
};

// ---------------------------------------------------------------------------
// AsyncHighlighter
// ---------------------------------------------------------------------------

const slowHighlighter = createDelayedHighlighter({ "const slow = 1;": 400 });

/**
 * An asynchronous highlighter: the code is shown as plain text until the
 * Promise resolves, then as tokens.
 */
export const AsyncHighlighter: Story = {
  render: () => (
    <CodeHighlighterProvider highlighter={slowHighlighter}>
      <CodeBlock.Root code="const slow = 1;" language="any">
        <CodeBlock.Content />
      </CodeBlock.Root>
    </CodeHighlighterProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const code = getCodeElement(canvasElement);

    await step("The full code is visible as plain text first", async () => {
      await expect(code).toHaveTextContent("const slow = 1;");
      await expect(code?.querySelector(".token")).toBeNull();
    });

    await step("Tokens replace the plain text when resolved", async () => {
      await waitFor(() =>
        expect(code?.querySelector(".token.async-token")).toHaveTextContent(
          "const slow = 1;"
        )
      );
    });
  },
};

// ---------------------------------------------------------------------------
// AsyncOutdatedResult
// ---------------------------------------------------------------------------

const racingHighlighter = createDelayedHighlighter({
  "first request": 600,
  "second request": 100,
});

const AsyncOutdatedExample = () => {
  const [code, setCode] = useState("first request");
  return (
    <CodeHighlighterProvider highlighter={racingHighlighter}>
      <Stack gap="400" alignItems="flex-start">
        <Button onPress={() => setCode("second request")}>Change code</Button>
        <CodeBlock.Root code={code} language="any">
          <CodeBlock.Content />
        </CodeBlock.Root>
      </Stack>
    </CodeHighlighterProvider>
  );
};

/**
 * When the code changes while a request is pending, the older result is
 * discarded even if it resolves last.
 */
export const AsyncOutdatedResult: Story = {
  render: () => <AsyncOutdatedExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const code = getCodeElement(canvasElement);

    await step(
      "Change the code while the first request is pending",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Change code" })
        );
        await expect(code).toHaveTextContent("second request");
      }
    );

    await step("The newer result is shown", async () => {
      await waitFor(() =>
        expect(code?.querySelector(".token.async-token")).toHaveTextContent(
          "second request"
        )
      );
    });

    await step("The older result, resolving later, is discarded", async () => {
      // The first request resolves 600ms after render; wait past that.
      await new Promise((resolve) => setTimeout(resolve, 700));
      await expect(code).toHaveTextContent("second request");
      await expect(code).not.toHaveTextContent("first request");
    });
  },
};
