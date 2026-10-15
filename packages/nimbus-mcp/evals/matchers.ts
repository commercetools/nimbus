import { isDeepStrictEqual } from "node:util";
import type {
  EvalElementSelector,
  EvalExpectation,
  EvalMatcherResult,
  EvalToolResponse,
} from "../src/types.js";

const EXCERPT_CHARS = 200;

/** Resolves a minimal JSON path: dot segments and `[n]` indexes, e.g. `results[2].name`, `[0].matchedView`. */
export function getPath(root: unknown, path: string): unknown {
  if (path === "") return root;
  const segments = path.match(/[^.[\]]+|\[\d+\]/g) ?? [];
  let cursor: unknown = root;
  for (const raw of segments) {
    if (cursor === null || typeof cursor !== "object") return undefined;
    const key = raw.startsWith("[") ? Number(raw.slice(1, -1)) : raw;
    cursor = (cursor as Record<PropertyKey, unknown>)[key];
  }
  return cursor;
}

function excerpt(text: string): string {
  return text.length > EXCERPT_CHARS
    ? `${text.slice(0, EXCERPT_CHARS)}…`
    : text;
}

function parseJson(text: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false };
  }
}

function notJson(
  key: EvalMatcherResult["key"],
  expected: unknown,
  text: string
): EvalMatcherResult {
  return {
    key,
    ok: false,
    expected,
    actual: `response is not JSON: ${excerpt(text)}`,
  };
}

function resolveArray(
  root: unknown,
  path: string | undefined
): unknown[] | undefined {
  const value = getPath(root, path ?? "");
  return Array.isArray(value) ? value : undefined;
}

function asList(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

function findElement(list: unknown[], selector: EvalElementSelector): number {
  return list.findIndex((el) =>
    isDeepStrictEqual(getPath(el, selector.field), selector.value)
  );
}

/** Runs every expectation in `expectation` against `response`; one result per check. */
export function evaluateExpectations(
  expectation: EvalExpectation,
  response: EvalToolResponse
): EvalMatcherResult[] {
  const { text } = response;
  const results: EvalMatcherResult[] = [];
  const json = parseJson(text);

  for (const needle of asList(expectation.contains ?? [])) {
    results.push({
      key: "contains",
      ok: text.includes(needle),
      expected: needle,
      actual: excerpt(text),
    });
  }

  for (const needle of asList(expectation.notContains ?? [])) {
    const at = text.indexOf(needle);
    results.push({
      key: "notContains",
      ok: at === -1,
      expected: `text without ${JSON.stringify(needle)}`,
      actual:
        at === -1
          ? "absent"
          : `found at ${at}: ${excerpt(text.slice(Math.max(0, at - 40)))}`,
    });
  }

  if (expectation.maxChars !== undefined) {
    results.push({
      key: "maxChars",
      ok: text.length <= expectation.maxChars,
      expected: `<= ${expectation.maxChars} chars`,
      actual: `${text.length} chars`,
    });
  }

  if (expectation.isError !== undefined) {
    const actual = response.isError ?? false;
    results.push({
      key: "isError",
      ok: actual === expectation.isError,
      expected: expectation.isError,
      actual: `${actual} (${excerpt(text)})`,
    });
  }

  if (expectation.field) {
    for (const [path, expected] of Object.entries(expectation.field)) {
      if (!json.ok) {
        results.push(notJson("field", { [path]: expected }, text));
        continue;
      }
      const actual = getPath(json.value, path);
      results.push({
        key: "field",
        ok: isDeepStrictEqual(actual, expected),
        expected,
        actual,
      });
    }
  }

  if (expectation.rankWithin) {
    const spec = expectation.rankWithin;
    if (!json.ok) {
      results.push(notJson("rankWithin", spec, text));
    } else {
      const list = resolveArray(json.value, spec.path);
      if (!list) {
        results.push({
          key: "rankWithin",
          ok: false,
          expected: spec,
          actual: `no array at path ${JSON.stringify(spec.path ?? "")}`,
        });
      } else {
        const index = findElement(list, spec);
        const ranked = list
          .slice(0, spec.k)
          .map((el) => getPath(el, spec.field));
        if (index === -1 || index >= spec.k) {
          results.push({
            key: "rankWithin",
            ok: false,
            expected: `${spec.field} = ${JSON.stringify(spec.value)} within first ${spec.k}`,
            actual:
              index === -1
                ? `not found; first ${spec.k}: ${JSON.stringify(ranked)}`
                : `found at rank ${index + 1}; first ${spec.k}: ${JSON.stringify(ranked)}`,
          });
        } else {
          const element = list[index];
          const mismatches = Object.entries(spec.also ?? {}).filter(
            ([field, value]) =>
              !isDeepStrictEqual(getPath(element, field), value)
          );
          results.push({
            key: "rankWithin",
            ok: mismatches.length === 0,
            expected: `${spec.field} = ${JSON.stringify(spec.value)} within first ${spec.k}${
              spec.also ? ` with ${JSON.stringify(spec.also)}` : ""
            }`,
            actual:
              mismatches.length === 0
                ? `rank ${index + 1}`
                : `rank ${index + 1} but ${mismatches
                    .map(
                      ([field]) =>
                        `${field} = ${JSON.stringify(getPath(element, field))}`
                    )
                    .join(", ")}`,
          });
        }
      }
    }
  }

  if (expectation.absent) {
    const spec = expectation.absent;
    if (!json.ok) {
      results.push(notJson("absent", spec, text));
    } else {
      const list = resolveArray(json.value, spec.path);
      const index = list ? findElement(list, spec) : -1;
      results.push({
        key: "absent",
        ok: list !== undefined && index === -1,
        expected: `no element with ${spec.field} = ${JSON.stringify(spec.value)}`,
        actual: !list
          ? `no array at path ${JSON.stringify(spec.path ?? "")}`
          : index === -1
            ? "absent"
            : `present at rank ${index + 1}`,
      });
    }
  }

  if (expectation.length) {
    const spec = expectation.length;
    if (!json.ok) {
      results.push(notJson("length", spec, text));
    } else {
      const list = resolveArray(json.value, spec.path);
      const n = list?.length;
      const ok =
        n !== undefined &&
        (spec.min === undefined || n >= spec.min) &&
        (spec.max === undefined || n <= spec.max);
      results.push({
        key: "length",
        ok,
        expected: `length in [${spec.min ?? 0}, ${spec.max ?? "∞"}]`,
        actual:
          n === undefined
            ? `no array at path ${JSON.stringify(spec.path ?? "")}`
            : `length ${n}`,
      });
    }
  }

  return results;
}
