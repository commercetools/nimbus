import fs from "fs";
import matter from "gray-matter";
import { menuToPath } from "../../src/utils/sluggify";
import { MdxFileFrontmatter, TocItem } from "../../src/types";

import { read } from "to-vfile";
import { remark } from "remark";
import remarkFlexibleToc from "remark-flexible-toc";
import debounce from "lodash/debounce";
import { flog } from "./parse-types";
import { getPathFromMonorepoRoot } from "../../utils/find-monorepo-root";
import { mdxDocumentSchema } from "../../src/schemas/mdx-document";

// Thats where compiled docs will be saved
const compiledDocsFile = "./src/data/docs.json";

const writeDocs = debounce(() => {
  // Sort documentation by keys, to make sure the order does not change every time it recompiles
  const cleanDocumentation = Object.keys(documentation)
    .sort()
    .reduce((acc, key) => {
      acc[key] = documentation[key];
      return acc;
    }, {});

  fs.writeFileSync(
    compiledDocsFile,
    JSON.stringify(cleanDocumentation, null, 2)
  );
  flog("[MDX] Documentation updated");
}, 500);

const observable = (target, callback, _base = []) => {
  for (const key in target) {
    if (typeof target[key] === "object" && target[key] !== null)
      target[key] = observable(target[key], callback, [..._base, key]);
  }
  return new Proxy(target, {
    set(target, key, value) {
      if (typeof value === "object" && value !== null)
        value = observable(value, callback, [..._base, key]);
      callback([..._base, key], (target[key] = value));
      return true;
    },
    deleteProperty(target, key) {
      callback([..._base, key], undefined);
      return Reflect.deleteProperty(target, key);
    },
  });
};

const generateToc = async (fileRef) => {
  const toc: TocItem[] = [];

  await remark()
    //.use(gfm)
    .use(remarkFlexibleToc, { tocRef: toc })
    .process(await read(fileRef));

  return toc || [];
};

const documentation: Record<string, MdxFileFrontmatter> = observable(
  {},
  writeDocs
);

export const parseMdx = async (filePath: string) => {
  // Skip files from node_modules to avoid duplicated IDs
  if (filePath.includes("node_modules")) {
    return;
  }

  fs.readFile(filePath, "utf8", async (err, content) => {
    if (err) {
      const repoPath = await getPathFromMonorepoRoot(filePath);
      delete documentation[repoPath];
      flog(`[MDX] File ${filePath} not found. Removed from documentation.`);
      return;
    }

    const { data: meta, content: mdx } = matter(content) as unknown as {
      data: MdxFileFrontmatter["meta"];
      content: MdxFileFrontmatter["mdx"];
    };

    const toc = await generateToc(filePath);

    const repoPath = await getPathFromMonorepoRoot(filePath);

    const item = {
      meta: {
        ...meta,
        repoPath,
        order: meta.order || 999,
        route: menuToPath(meta.menu),
        toc,
      },
      mdx,
    };
    try {
      // Validate data before converting to a string
      const validData = mdxDocumentSchema.parse(item);

      // Convert the object to a YAML string
      documentation[repoPath] = validData;
      return;
    } catch (error) {
      console.error("Error serializing frontmatter:", error);
      throw error;
    }
  });
};
