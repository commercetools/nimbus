import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseCaseFile } from "./case-schema.js";
import type { EvalCaseFile } from "../src/types.js";

/** Reads and validates every `*.json` case file in `dir`, sorted by file name. */
export function loadCaseFiles(
  dir: string
): Array<{ file: string } & EvalCaseFile> {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => {
      const raw: unknown = JSON.parse(readFileSync(join(dir, file), "utf8"));
      return { file, ...parseCaseFile(raw, file) };
    });
}
