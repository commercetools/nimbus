import { describe, it, expect } from "vitest";
import { remarkCustomComponentTags } from "./remark-custom-component-tags";

type SpecNode = {
  type: string;
  value?: string;
  data?: { hName?: string; hProperties?: Record<string, unknown> };
  children?: SpecNode[];
};

// Minimal mdast builders — the plugin only inspects `type`/`value`/`children`.
const html = (value: string): SpecNode => ({ type: "html", value });
const text = (value: string): SpecNode => ({ type: "text", value });
const para = (...children: SpecNode[]): SpecNode => ({
  type: "paragraph",
  children,
});
const root = (...children: SpecNode[]): SpecNode => ({
  type: "root",
  children,
});

/** Run the configured plugin's transformer over a tree (mutates in place). */
function run(tree: SpecNode, names: string[]): SpecNode {
  const transformer = remarkCustomComponentTags({
    registeredNames: new Set(names),
  })();
  transformer(tree as unknown as Parameters<typeof transformer>[0]);
  return tree;
}

describe("markdown utils — remarkCustomComponentTags", () => {
  it("materializes a self-closing registered tag with parsed props", () => {
    const tree = run(
      root(html('<SearchQueryResultCard id="foo" title="Bar" />')),
      ["SearchQueryResultCard"]
    );
    expect(tree.children).toHaveLength(1);
    const node = tree.children![0];
    expect(node.type).toBe("nimbusCustomTag");
    expect(node.data!.hName).toBe("SearchQueryResultCard");
    expect(node.data!.hProperties).toEqual({ id: "foo", title: "Bar" });
    expect(node.children).toEqual([]);
  });

  it("preserves any casing on the tag name", () => {
    const tree = run(root(html("<myWidget />")), ["myWidget"]);
    expect(tree.children![0].data!.hName).toBe("myWidget");
  });

  it("pairs a block tag and wraps the between-content as children", () => {
    const tree = run(
      root(html('<Callout tone="info">'), para(text("hi")), html("</Callout>")),
      ["Callout"]
    );
    expect(tree.children).toHaveLength(1);
    const node = tree.children![0];
    expect(node.type).toBe("nimbusCustomTag");
    expect(node.data!.hProperties).toEqual({ tone: "info" });
    expect(node.children).toHaveLength(1);
    expect(node.children![0].type).toBe("paragraph");
  });

  it("pairs an inline tag inside a paragraph", () => {
    const tree = run(
      root(
        para(
          text("a "),
          html("<Badge>"),
          text("new"),
          html("</Badge>"),
          text(" b")
        )
      ),
      ["Badge"]
    );
    const paragraph = tree.children![0];
    const custom = paragraph.children!.find(
      (n) => n.type === "nimbusCustomTag"
    );
    expect(custom).toBeTruthy();
    expect(custom!.children![0]).toEqual(text("new"));
  });

  it("supports nested same-name tags", () => {
    const tree = run(
      root(
        html("<Card>"),
        html("<Card>"),
        para(text("inner")),
        html("</Card>"),
        html("</Card>")
      ),
      ["Card"]
    );
    expect(tree.children).toHaveLength(1);
    const outer = tree.children![0];
    expect(outer.type).toBe("nimbusCustomTag");
    expect(outer.children).toHaveLength(1);
    expect(outer.children![0].type).toBe("nimbusCustomTag");
  });

  it("leaves an unclosed opening tag inert", () => {
    const tree = run(root(html("<Card>"), para(text("hi"))), ["Card"]);
    expect(tree.children!.some((n) => n.type === "nimbusCustomTag")).toBe(
      false
    );
    expect(tree.children![0]).toEqual(html("<Card>"));
  });

  it("leaves a closing tag with no opening inert", () => {
    const tree = run(root(html("</Card>")), ["Card"]);
    expect(tree.children![0]).toEqual(html("</Card>"));
  });

  it("leaves unregistered tags untouched", () => {
    const tree = run(root(html("<Unknown />")), ["Card"]);
    expect(tree.children![0]).toEqual(html("<Unknown />"));
  });

  it("is a no-op when nothing is registered", () => {
    const tree = run(root(html("<Card />")), []);
    expect(tree.children![0]).toEqual(html("<Card />"));
  });
});
