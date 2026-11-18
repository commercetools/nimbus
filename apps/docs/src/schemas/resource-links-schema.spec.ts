import { describe, expect, it } from "vitest";
import { mdxDocumentSchema as appSchema } from "./mdx-document";
import { mdxDocumentSchema as buildSchema } from "../../../../packages/nimbus-docs-build/src/schemas/mdx-document";

const document = (links: Record<string, string> = {}) => ({
  meta: {
    id: "Components-Button",
    title: "Button",
    description: "A button.",
    order: 1,
    repoPath: "button.mdx",
    menu: ["Components", "Buttons", "Button"],
    route: "components/buttons/button",
    tags: [],
    toc: [],
    ...links,
  },
  mdx: "",
});

describe.each([
  ["nimbus-docs-build", buildSchema],
  ["apps/docs", appSchema],
])("%s resource link fields", (_name, schema) => {
  it("leaves storybookLink and githubLink unset by default", () => {
    const { meta } = schema.parse(document());
    expect(meta.storybookLink).toBeUndefined();
    expect(meta.githubLink).toBeUndefined();
  });

  it("accepts absolute URLs", () => {
    const links = {
      storybookLink:
        "https://nimbus-storybook.vercel.app/?path=/story/components-buttons-button",
      githubLink:
        "https://github.com/commercetools/nimbus/tree/main/packages/nimbus/src/components/button",
    };
    const { meta } = schema.parse(document(links));
    expect(meta.storybookLink).toBe(links.storybookLink);
    expect(meta.githubLink).toBe(links.githubLink);
  });

  it.each(["storybookLink", "githubLink"])(
    "rejects a %s that is not an absolute URL",
    (field) => {
      expect(() => schema.parse(document({ [field]: "not a url" }))).toThrow();
    }
  );
});
