import fs from "fs";
import path from "path";
import { parseMdx } from "./parse-mdx";
import { flog, parseTypes } from "./parse-types";

// Directory to watch
const directoryToWatch: string = "./../../packages";

const findFiles = (dir: string, extension: string) => {
  let results: string[] = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(findFiles(fullPath, extension));
    } else if (path.extname(file).toLowerCase() === extension.toLowerCase()) {
      results.push(fullPath);
    }
  });

  return results;
};

export const build = async () => {
  // Aggregate all mdx files
  const mdxFiles = findFiles(directoryToWatch, ".mdx");
  // Aggregate all ts & tsx files
  const tsFiles = findFiles(directoryToWatch, ".ts");
  const tsxFiles = findFiles(directoryToWatch, ".tsx");
  // ...combine them...
  const codeFiles = [...tsFiles, ...tsxFiles];

  // Process them
  await Promise.all(mdxFiles.map(parseMdx));
  await Promise.all(codeFiles.map(parseTypes));

  // wait a bit, cause it's cheaper than fixing the code
  await new Promise((resolve) => setTimeout(resolve, 5000));

  flog("✨ Documentation files created ✨");
};
