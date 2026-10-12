import { z } from "zod";
import type { EvalCaseFile } from "../src/types.js";

const selector = {
  path: z.string().optional(),
  field: z.string().min(1),
  value: z.unknown(),
};

const expectationSchema = z
  .strictObject({
    isError: z.boolean().optional(),
    contains: z.union([z.string(), z.array(z.string())]).optional(),
    notContains: z.union([z.string(), z.array(z.string())]).optional(),
    field: z.record(z.string(), z.unknown()).optional(),
    rankWithin: z
      .strictObject({
        ...selector,
        k: z.number().int().min(1),
        also: z.record(z.string(), z.unknown()).optional(),
      })
      .optional(),
    absent: z.strictObject(selector).optional(),
    length: z
      .strictObject({
        path: z.string().optional(),
        min: z.number().int().min(0).optional(),
        max: z.number().int().min(0).optional(),
      })
      .optional(),
    maxChars: z.number().int().min(1).optional(),
  })
  .refine((e) => Object.keys(e).length > 0, {
    message: "expect must declare at least one expectation",
  });

const caseSchema = z.strictObject({
  id: z.string().min(1),
  input: z.record(z.string(), z.unknown()),
  expect: expectationSchema,
});

export const caseFileSchema = z.strictObject({
  tool: z.string().min(1),
  cases: z.array(caseSchema).min(1),
});

/** Human-readable location of a zod issue, e.g. `cases[2] ("deep-term") › expect`. */
function describeIssuePath(raw: unknown, path: PropertyKey[]): string {
  const segments: string[] = [];
  let cursor: unknown = raw;
  for (const seg of path) {
    if (typeof seg === "number") {
      segments[segments.length - 1] += `[${seg}]`;
      cursor = Array.isArray(cursor) ? cursor[seg] : undefined;
      if (cursor && typeof cursor === "object" && "id" in cursor) {
        const id = (cursor as { id?: unknown }).id;
        if (typeof id === "string")
          segments[segments.length - 1] += ` ("${id}")`;
      }
    } else {
      segments.push(String(seg));
      cursor =
        cursor && typeof cursor === "object"
          ? (cursor as Record<PropertyKey, unknown>)[seg]
          : undefined;
    }
  }
  return segments.join(" › ") || "(root)";
}

/**
 * Validates one case file. Throws an Error naming the file, the case and the
 * offending key so a typo in an expectation fails before any tool is called.
 */
export function parseCaseFile(raw: unknown, fileName: string): EvalCaseFile {
  const result = caseFileSchema.safeParse(raw);
  if (result.success) return result.data as EvalCaseFile;

  const lines = result.error.issues.map((issue) => {
    const where = describeIssuePath(raw, issue.path);
    if (issue.code === "unrecognized_keys") {
      const keys = issue.keys.map((k) => `"${k}"`).join(", ");
      return `  ${where}: unknown key ${keys}`;
    }
    return `  ${where}: ${issue.message}`;
  });
  throw new Error(`Invalid eval case file ${fileName}:\n${lines.join("\n")}`);
}
