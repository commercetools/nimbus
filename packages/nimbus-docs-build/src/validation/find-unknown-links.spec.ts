import { describe, expect, it } from "vitest";
import { findUnknownInternalLinks } from "./find-unknown-links";

const doc = (route: string, mdx = "", viewKeys: string[] = []) => ({
  file: `${route}.mdx`,
  route,
  viewKeys,
  mdx,
});

describe("findUnknownInternalLinks", () => {
  it("accepts links to the route of a document and of its tabs", () => {
    const docs = [
      doc("learn/rules"),
      doc("components/button", "", ["dev"]),
      doc(
        "learn",
        "See [rules](/learn/rules), [Button](/components/button) and [dev](/components/button/dev/)."
      ),
    ];

    expect(findUnknownInternalLinks(docs)).toEqual([]);
  });

  it("ignores anchors, queries, static files and external links", () => {
    const docs = [
      doc("learn/rules"),
      doc(
        "learn",
        "[a](/learn/rules#8-mark-every-one-off) [b](/learn/rules?x=1) [c](/images/a.png) [d](https://example.com/x)"
      ),
    ];

    expect(findUnknownInternalLinks(docs)).toEqual([]);
  });

  it("accepts a path that differs only by dashes, which the docs app redirects", () => {
    const docs = [
      doc("components/utilities/nimbus-provider"),
      doc("learn", "[provider](/components/utilities/nimbusprovider)"),
    ];

    expect(findUnknownInternalLinks(docs)).toEqual([]);
  });

  it("reports a link to a path that is no page", () => {
    const docs = [
      doc(
        "learn",
        "Read [Core Concepts](/home/getting-started/core-concepts)."
      ),
    ];

    expect(findUnknownInternalLinks(docs)).toEqual([
      { file: "learn.mdx", path: "/home/getting-started/core-concepts" },
    ]);
  });
});
