import fs from "fs/promises";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  findIllustration,
  findUnknownIllustrations,
  formatUnknownIllustrations,
  listIllustrationNames,
} from "./illustration-sources";

describe("listIllustrationNames", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), "illustration-sources-"));
  });

  afterEach(async () => {
    await fs.rm(dir, { recursive: true });
  });

  it("finds sources in nested folders and ignores other files", async () => {
    await fs.mkdir(path.join(dir, "components", "button"), { recursive: true });
    await fs.mkdir(path.join(dir, "docs", "illustrations"), {
      recursive: true,
    });
    await fs.writeFile(
      path.join(dir, "components", "button", "button.illustration.ts"),
      ""
    );
    await fs.writeFile(
      path.join(dir, "components", "button", "button.tsx"),
      ""
    );
    await fs.writeFile(
      path.join(dir, "docs", "illustrations", "hooks.illustration.ts"),
      ""
    );

    expect(await listIllustrationNames(dir)).toEqual(
      new Set(["button", "hooks"])
    );
  });

  it("returns an empty set for a folder that does not exist", async () => {
    expect(await listIllustrationNames(path.join(dir, "missing"))).toEqual(
      new Set()
    );
  });
});

describe("findUnknownIllustrations", () => {
  const known = new Set(["button", "design-tokens"]);

  it("reports names that match no source, with the file", () => {
    const docs: Array<{ file: string; meta: { illustration?: string } }> = [
      { file: "tokens.mdx", meta: { illustration: "design-tokens" } },
      { file: "hooks.mdx", meta: { illustration: "hook" } },
      { file: "button.mdx", meta: {} },
    ];
    expect(findUnknownIllustrations(docs, known)).toEqual([
      { file: "hooks.mdx", name: "hook" },
    ]);
  });

  it("reports nothing when every name is known", () => {
    const docs = [{ file: "a.mdx", meta: { illustration: "button" } }];
    expect(findUnknownIllustrations(docs, known)).toEqual([]);
  });
});

describe("formatUnknownIllustrations", () => {
  it("names each page and value", () => {
    expect(
      formatUnknownIllustrations([{ file: "hooks.mdx", name: "hook" }])
    ).toContain('"hook" (hooks.mdx)');
  });
});

describe("findIllustration", () => {
  let root: string;
  const known = new Set(["button", "design-tokens"]);

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), "find-illustration-"));
    await fs.mkdir(path.join(root, "button"));
    await fs.writeFile(path.join(root, "button", "button.illustration.ts"), "");
  });

  afterEach(async () => {
    await fs.rm(root, { recursive: true });
  });

  it("uses the source next to a main doc page", async () => {
    expect(
      await findIllustration(root, { repoPath: "button/button.mdx" }, known)
    ).toEqual(["button"]);
  });

  it("prefers the illustration field over the source next to the page", async () => {
    const meta = {
      repoPath: "button/button.mdx",
      illustration: "design-tokens",
    };
    expect(await findIllustration(root, meta, known)).toEqual([
      "design-tokens",
    ]);
  });

  it("uses the illustration field on a page without its own source", async () => {
    const meta = { repoPath: "docs/tokens.mdx", illustration: "design-tokens" };
    expect(await findIllustration(root, meta, known)).toEqual([
      "design-tokens",
    ]);
  });

  it("returns nothing for an unknown illustration name", async () => {
    const meta = { repoPath: "button/button.mdx", illustration: "nope" };
    expect(await findIllustration(root, meta, known)).toEqual([]);
  });

  it("ignores view pages such as button.dev.mdx", async () => {
    expect(
      await findIllustration(root, { repoPath: "button/button.dev.mdx" }, known)
    ).toEqual([]);
  });
});
