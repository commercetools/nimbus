/**
 * Renders every `<name>.illustration.ts` to its committed `<name>.illustration.svg`.
 * Only files whose content changed are written. Names without a source are listed.
 *
 *   pnpm illustrations:generate [--only button,switch]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { discover } from "../../src/illustration-kit/discover";
import {
  renderIllustration,
  type IllustrationDefinition,
} from "../../src/illustration-kit";

const onlyArg = process.argv.indexOf("--only");
const only =
  onlyArg === -1 ? null : new Set(process.argv[onlyArg + 1]?.split(","));

const required = discover().filter((item) => !only || only.has(item.name));
const missing: string[] = [];
let written = 0;
let unchanged = 0;

for (const { name, dir } of required) {
  const source = join(dir, `${name}.illustration.ts`);
  if (!existsSync(source)) {
    missing.push(name);
    continue;
  }
  const module = (await import(pathToFileURL(source).href)) as {
    default: IllustrationDefinition;
  };
  const svg = renderIllustration(module.default);
  const target = join(dir, `${name}.illustration.svg`);
  if (existsSync(target) && readFileSync(target, "utf8") === svg) {
    unchanged++;
    continue;
  }
  writeFileSync(target, svg);
  written++;
  console.log(`wrote ${name}.illustration.svg`);
}

console.log(
  `${written} written, ${unchanged} unchanged, ${missing.length} without a source`
);
if (missing.length > 0) console.log(`missing: ${missing.join(", ")}`);
