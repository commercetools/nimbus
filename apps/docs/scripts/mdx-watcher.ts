import chokidar from "chokidar";
import fs from "fs";
import matter from "gray-matter";
import { debounce } from "lodash";
import { TocItem, type MdxFileFrontmatter } from "../src/types";
import { menuToPath } from "../src/utils/sluggify";
import { read } from "to-vfile";

import { remark } from "remark";
import remarkFlexibleToc from "remark-flexible-toc";

// Thats where compiled docs will be saved
const compiledDocsFile = "./src/assets/docs.json";

const generateToc = async (fileRef) => {
  const toc: TocItem[] = [];

  await remark()
    //.use(gfm)
    .use(remarkFlexibleToc, { tocRef: toc })
    .process(await read(fileRef));

  return toc || [];
};

const writeDocs = debounce(() => {
  fs.writeFileSync(compiledDocsFile, JSON.stringify(documentation, null, 2));
  console.log("MDX Files compiled.");
}, 500);

const observable = (target, callback, _base = []) => {
  for (const key in target) {
    if (typeof target[key] === "object")
      target[key] = observable(target[key], callback, [..._base, key]);
  }
  return new Proxy(target, {
    set(target, key, value) {
      if (typeof value === "object")
        value = observable(value, callback, [..._base, key]);
      callback([..._base, key], (target[key] = value));
      return value;
    },
  });
};

const documentation: Record<string, MdxFileFrontmatter> = observable(
  {},
  writeDocs
);

// Directory to watch
const directoryToWatch: string = "./../../packages";

const parseMdx = async (filePath: string) => {
  fs.readFile(filePath, "utf8", async (err, content) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    const { data: meta, content: mdx } = matter(content) as unknown as {
      data: MdxFileFrontmatter["meta"];
      content: MdxFileFrontmatter["mdx"];
    };

    const toc = await generateToc(filePath);

    documentation[meta.id] = {
      meta: {
        ...meta,
        filePath,
        route: menuToPath(meta.menu),
        toc,
      },
      mdx,
    };
  });
};

// Action to trigger when .mdx file is created
async function handleFileAdd(filePath: string) {
  await parseMdx(filePath);
}

// Action to trigger when .mdx file is modified
async function handleFileChange(filePath: string) {
  await parseMdx(filePath);
}

// Initialize chokidar watcher
const watcher = chokidar.watch(directoryToWatch, {
  persistent: true,
  ignoreInitial: false, // Watch also for newly created files
  usePolling: true, // Can be set for environments that don't support native file watching
  // only watch .mdx files
  ignored: (path, stats) =>
    (stats?.isFile() && !path.endsWith(".mdx")) || false, // only watch js files
});

// Watch for add and change events on .mdx files
watcher
  .on("add", (filePath: string) => handleFileAdd(filePath))
  .on("change", (filePath: string) => handleFileChange(filePath))
  .on("error", (error: Error) => console.log("Error watching files:", error));

// Creating a watcher for the object

console.log(`Watching for documentation updates in ${directoryToWatch}...`);
