import { describe, expect, it } from "vitest";
import { mdxDocumentSchema as appSchema } from "./mdx-document";
import { mdxDocumentSchema as buildSchema } from "../../../../packages/nimbus-docs-build/src/schemas/mdx-document";

const document = (related?: string[]) => ({
  meta: {
    id: "Components-Skeleton",
    title: "Skeleton",
    description: "A loading placeholder.",
    order: 1,
    repoPath: "skeleton.mdx",
    menu: ["Components", "Feedback", "Skeleton"],
    route: "components/feedback/skeleton",
    tags: [],
    toc: [],
    ...(related ? { related } : {}),
  },
  mdx: "",
});

describe.each([
  ["nimbus-docs-build", buildSchema],
  ["apps/docs", appSchema],
])("%s mdx-document schema", (_name, schema) => {
  it("defaults related to an empty list", () => {
    expect(schema.parse(document()).meta.related).toEqual([]);
  });

  it("keeps related ids in the written order", () => {
    const related = ["Components-SkeletonText", "Components-SkeletonCircle"];
    expect(schema.parse(document(related)).meta.related).toEqual(related);
  });
});
