/**
 * Renders every `<name>.illustration.ts` to an SVG for the docs app. The SVGs
 * are build output (gitignored), written as `<name>.svg` into one folder. Only
 * files whose content changed are written. Names without a source are listed.
 *
 *   pnpm illustrations:generate [--only button,switch] [--out <dir>] [--watch]
 *
 * `--out` defaults to `apps/docs/src/data/illustrations`. `--watch` renders
 * again when an illustration source changes.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  watch,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { discover, SRC_DIR } from "../../src/illustration-kit/discover";
import {
  renderIllustration,
  type IllustrationDefinition,
} from "../../src/illustration-kit";

const option = (flag: string) => {
  const at = process.argv.indexOf(flag);
  return at === -1 ? undefined : process.argv[at + 1];
};

const HERE = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(
  option("--out") ?? join(HERE, "../../../../apps/docs/src/data/illustrations")
);
const only = option("--only")?.split(",");

const render = async (name: string, dir: string, bust = "") => {
  const source = join(dir, `${name}.illustration.ts`);
  const module = (await import(`${pathToFileURL(source).href}${bust}`)) as {
    default: IllustrationDefinition;
  };
  return renderIllustration(module.default);
};

/** Writes the SVG if it changed. Returns whether it did. */
const write = (name: string, svg: string) => {
  const target = join(outDir, `${name}.svg`);
  if (existsSync(target) && readFileSync(target, "utf8") === svg) return false;
  writeFileSync(target, svg);
  return true;
};

const generate = async () => {
  mkdirSync(outDir, { recursive: true });
  const required = discover();
  const missing: string[] = [];
  let written = 0;
  let unchanged = 0;

  for (const { name, dir } of required) {
    if (only && !only.includes(name)) continue;
    if (!existsSync(join(dir, `${name}.illustration.ts`))) {
      missing.push(name);
      continue;
    }
    if (write(name, await render(name, dir))) {
      written++;
      console.log(`wrote ${name}.svg`);
    } else {
      unchanged++;
    }
  }

  // Remove SVGs of components that no longer exist
  if (!only) {
    const known = new Set(required.map((item) => `${item.name}.svg`));
    for (const file of readdirSync(outDir)) {
      if (file.endsWith(".svg") && !known.has(file)) {
        rmSync(join(outDir, file));
        console.log(`removed ${file}`);
      }
    }
  }

  console.log(
    `${written} written, ${unchanged} unchanged, ${missing.length} without a source (${outDir})`
  );
  if (missing.length > 0) console.log(`missing: ${missing.join(", ")}`);
};

await generate();

if (process.argv.includes("--watch")) {
  console.log("Watching illustration sources...");
  const byFile = new Map(
    discover().map((item) => [`${item.name}.illustration.ts`, item])
  );
  watch(SRC_DIR, { recursive: true }, async (_event, file) => {
    const item = file && byFile.get(file.split("/").pop()!);
    if (!item) return;
    try {
      // a new query string makes node load the changed file again
      const svg = await render(item.name, item.dir, `?t=${Date.now()}`);
      if (write(item.name, svg)) console.log(`wrote ${item.name}.svg`);
    } catch (error) {
      console.error(`${item.name}: ${(error as Error).message}`);
    }
  });
}
