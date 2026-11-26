// @vitest-environment jsdom
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { evaluate } from "@mdx-js/mdx";
import { NimbusProvider } from "@commercetools/nimbus";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { describe, expect, it } from "vitest";
import { Blockquote } from "./blockquote";
import { Paragraph } from "./paragraph";

const components = { blockquote: Blockquote, p: Paragraph };

/** Renders MDX with the component map of the docs app. */
const render = async (mdx: string) => {
  const { default: Content } = await evaluate(mdx, {
    jsx,
    jsxs,
    Fragment,
  } as Parameters<typeof evaluate>[1]);
  return renderToStaticMarkup(
    createElement(NimbusProvider, null, createElement(Content, { components }))
  );
};

describe("Blockquote", () => {
  it("reads a marker that is followed by a plain line break", async () => {
    const html = await render("> [!TIP]\n> Your package manager resolves it.");

    expect(html).not.toContain("[!TIP]");
    expect(html).toContain("Tip");
    expect(html).toContain("Your package manager resolves it.");
  });

  it("reads a marker that is followed by two trailing spaces", async () => {
    const html = await render("> [!NOTE]  \n> Nimbus requires React 19.x.");

    expect(html).not.toContain("[!NOTE]");
    expect(html).toContain("Note");
    expect(html).toContain("Nimbus requires React 19.x.");
    expect(html).not.toContain("<br");
  });

  it("reads a marker that stands alone on its line", async () => {
    const html = await render("> [!WARNING]\n>\n> Second paragraph.");

    expect(html).not.toContain("[!WARNING]");
    expect(html).toContain("Warning");
    expect(html).toContain("Second paragraph.");
  });

  it("keeps text after the first line of a multi-line paragraph", async () => {
    const html = await render("> [!TIP]\n> First line\n> second line");

    expect(html).toContain("First line");
    expect(html).toContain("second line");
  });

  it("shows a quote without a marker as plain text", async () => {
    const html = await render("> Just a quote.");

    expect(html).toContain("Just a quote.");
    expect(html).not.toContain("Tip");
  });

  it("does not read a marker in the middle of a paragraph", async () => {
    const html = await render("> See [!TIP] for more.");

    expect(html).toContain("[!TIP]");
  });
});
