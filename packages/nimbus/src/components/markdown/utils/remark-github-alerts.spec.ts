import { describe, it, expect } from "vitest";
import { remarkGithubAlerts } from "./remark-github-alerts";

type SpecNode = {
  type: string;
  value?: string;
  data?: { hProperties?: Record<string, unknown> };
  children?: SpecNode[];
};

// Minimal mdast builders — the plugin only inspects type/value/children.
const text = (value: string): SpecNode => ({ type: "text", value });
const brk = (): SpecNode => ({ type: "break" });
const para = (...children: SpecNode[]): SpecNode => ({
  type: "paragraph",
  children,
});
const quote = (...children: SpecNode[]): SpecNode => ({
  type: "blockquote",
  children,
});
const root = (...children: SpecNode[]): SpecNode => ({
  type: "root",
  children,
});

/** Run the plugin's transformer over a tree (mutates in place). */
function run(tree: SpecNode): SpecNode {
  const transformer = remarkGithubAlerts();
  transformer(tree as unknown as Parameters<typeof transformer>[0]);
  return tree;
}

const alertOf = (node: SpecNode) => node.data?.hProperties?.["data-alert"];

describe("markdown utils — remarkGithubAlerts", () => {
  it("tags a marker-only first line and drops the emptied paragraph", () => {
    const bq = quote(para(text("[!NOTE]")), para(text("Body.")));
    run(root(bq));
    expect(alertOf(bq)).toBe("note");
    expect(bq.children).toHaveLength(1);
    expect(bq.children![0].children![0].value).toBe("Body.");
  });

  it("strips the marker from a single-paragraph alert", () => {
    const bq = quote(para(text("[!WARNING]\nBe careful.")));
    run(root(bq));
    expect(alertOf(bq)).toBe("warning");
    expect(bq.children![0].children![0].value).toBe("Be careful.");
  });

  it("drops a hard break left immediately after a marker-only line", () => {
    const bq = quote(para(text("[!TIP]"), brk(), text("Pro tip.")));
    run(root(bq));
    expect(alertOf(bq)).toBe("tip");
    expect(bq.children![0].children![0].value).toBe("Pro tip.");
  });

  it("matches case-insensitively and normalizes the type to lowercase", () => {
    const bq = quote(para(text("[!Caution]\nDanger.")));
    run(root(bq));
    expect(alertOf(bq)).toBe("caution");
  });

  it("tags all five recognized types", () => {
    for (const type of ["note", "tip", "important", "warning", "caution"]) {
      const bq = quote(para(text(`[!${type.toUpperCase()}]\nx`)));
      run(root(bq));
      expect(alertOf(bq)).toBe(type);
    }
  });

  it("ignores a marker with trailing text on the same line", () => {
    const bq = quote(para(text("[!NOTE] not an alert")));
    run(root(bq));
    expect(alertOf(bq)).toBeUndefined();
    expect(bq.children![0].children![0].value).toBe("[!NOTE] not an alert");
  });

  it("ignores an unrecognized marker", () => {
    const bq = quote(para(text("[!FOO]\nx")));
    run(root(bq));
    expect(alertOf(bq)).toBeUndefined();
  });

  it("leaves a plain blockquote untouched", () => {
    const bq = quote(para(text("Just a quote.")));
    run(root(bq));
    expect(alertOf(bq)).toBeUndefined();
    expect(bq.children![0].children![0].value).toBe("Just a quote.");
  });

  it("tags a nested blockquote", () => {
    const inner = quote(para(text("[!IMPORTANT]\ndeep")));
    run(root(quote(para(text("outer")), inner)));
    expect(alertOf(inner)).toBe("important");
  });
});
