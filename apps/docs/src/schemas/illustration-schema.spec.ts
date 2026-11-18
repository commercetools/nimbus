import { describe, expect, it } from "vitest";
import { mdxDocumentSchema as appSchema } from "./mdx-document";
import { mdxDocumentSchema as buildSchema } from "../../../../packages/nimbus-docs-build/src/schemas/mdx-document";

const document = (fields: Record<string, unknown> = {}) => ({
  meta: {
    id: "DesignTokens",
    title: "Design Tokens",
    description: "Tokens.",
    order: 1,
    repoPath: "tokens.mdx",
    menu: ["Home", "Design Tokens"],
    route: "home/design-tokens",
    tags: [],
    toc: [],
    ...fields,
  },
  mdx: "",
});

describe.each([
  ["nimbus-docs-build", buildSchema],
  ["apps/docs", appSchema],
])("%s illustration field", (_name, schema) => {
  it("is unset by default", () => {
    expect(schema.parse(document()).meta.illustration).toBeUndefined();
  });

  it("accepts an illustration name", () => {
    const { meta } = schema.parse(document({ illustration: "design-tokens" }));
    expect(meta.illustration).toBe("design-tokens");
  });

  it.each([[""], [42]])("rejects %j", (value) => {
    expect(() => schema.parse(document({ illustration: value }))).toThrow();
  });
});
