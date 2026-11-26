import { createElement } from "react";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { evaluate } from "@mdx-js/mdx";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { describe, expect, it } from "vitest";
import { remarkCodeTabs } from "./remark-code-tabs";
import { remarkLiveCode } from "./remark-live-code";

/**
 * Renders MDX with the same plugins as the docs app. `CodeTabs` and `code`
 * are replaced by simple elements so the output shows what they receive.
 */
const render = async (mdx: string) => {
  const { default: Content } = await evaluate(mdx, {
    jsx,
    jsxs,
    Fragment,
    remarkPlugins: [remarkCodeTabs, remarkLiveCode],
  } as Parameters<typeof evaluate>[1]);

  return renderToStaticMarkup(
    createElement(Content, {
      components: {
        CodeTabs: ({
          tabs,
          children,
        }: {
          tabs?: string;
          children?: ReactNode;
        }) => createElement("div", { "data-tabs": tabs }, children),
        code: ({
          className,
          children,
        }: {
          className?: string;
          children?: ReactNode;
        }) => createElement("code", { "data-class": className }, children),
      },
    })
  );
};

describe("remarkCodeTabs", () => {
  it("groups directly following labeled code blocks", async () => {
    const html = await render(
      [
        '```bash tab="pnpm"',
        "pnpm add a",
        "```",
        "",
        '```bash tab="npm"',
        "npm install a",
        "```",
        "",
        "```bash tab='yarn'",
        "yarn add a",
        "```",
      ].join("\n")
    );

    expect(html).toContain(
      'data-tabs="[&quot;pnpm&quot;,&quot;npm&quot;,&quot;yarn&quot;]"'
    );
    expect(html.match(/<div/g)).toHaveLength(1);
    expect(html).toContain("pnpm add a");
    expect(html).toContain("npm install a");
    expect(html).toContain("yarn add a");
    expect(html).toContain('data-class="language-bash"');
  });

  it("ends a group at text and starts a new one after it", async () => {
    const html = await render(
      [
        '```bash tab="pnpm"',
        "pnpm add a",
        "```",
        "",
        '```bash tab="npm"',
        "npm install a",
        "```",
        "",
        "Some text in between.",
        "",
        '```bash tab="pnpm"',
        "pnpm add b",
        "```",
        "",
        '```bash tab="npm"',
        "npm install b",
        "```",
      ].join("\n")
    );

    expect(html.match(/<div/g)).toHaveLength(2);
    expect(html).toContain("<p>Some text in between.</p>");
  });

  it("leaves a single labeled block as a normal code block", async () => {
    const html = await render(
      ['```bash tab="pnpm"', "pnpm add a", "```"].join("\n")
    );

    expect(html).not.toContain("<div");
    expect(html).toContain('data-class="language-bash"');
  });

  it("does not read a label as the live flag", async () => {
    const html = await render(
      [
        '```jsx tab="deliver"',
        "<A />",
        "```",
        "",
        '```tsx tab="TypeScript"',
        "<A />",
        "```",
      ].join("\n")
    );

    expect(html).toContain('data-class="language-jsx"');
    expect(html).not.toContain("-live");
  });

  it("leaves code blocks without a label alone", async () => {
    const html = await render(
      ["```bash", "a", "```", "", "```bash", "b", "```"].join("\n")
    );

    expect(html).not.toContain("<div");
  });
});
