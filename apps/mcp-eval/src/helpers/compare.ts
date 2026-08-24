/**
 * Structured comparison utilities for MCP tool responses.
 *
 * Compares responses field-by-field and produces a structured diff
 * suitable for terminal display or further analysis.
 */

/** A single field-level diff between two responses. */
export interface FieldDiff {
  field: string;
  status: "added" | "removed" | "changed" | "same";
  local?: unknown;
  published?: unknown;
}

/** Summary of a response comparison. */
export interface ComparisonResult {
  scenario: string;
  tool: string;
  localFieldCount: number;
  publishedFieldCount: number;
  diffs: FieldDiff[];
  addedFields: string[];
  removedFields: string[];
  changedFields: string[];
}

/**
 * Deep-compares two JSON objects field by field.
 * Only goes one level deep for readability — nested objects are compared by JSON equality.
 */
export function compareResponses(
  scenario: string,
  tool: string,
  local: Record<string, unknown>,
  published: Record<string, unknown>
): ComparisonResult {
  const allKeys = new Set([...Object.keys(local), ...Object.keys(published)]);
  const diffs: FieldDiff[] = [];
  const addedFields: string[] = [];
  const removedFields: string[] = [];
  const changedFields: string[] = [];

  for (const key of allKeys) {
    const inLocal = key in local;
    const inPublished = key in published;

    if (inLocal && !inPublished) {
      addedFields.push(key);
      diffs.push({ field: key, status: "added", local: local[key] });
    } else if (!inLocal && inPublished) {
      removedFields.push(key);
      diffs.push({
        field: key,
        status: "removed",
        published: published[key],
      });
    } else {
      const same =
        JSON.stringify(local[key]) === JSON.stringify(published[key]);
      if (same) {
        diffs.push({ field: key, status: "same" });
      } else {
        changedFields.push(key);
        diffs.push({
          field: key,
          status: "changed",
          local: local[key],
          published: published[key],
        });
      }
    }
  }

  return {
    scenario,
    tool,
    localFieldCount: Object.keys(local).length,
    publishedFieldCount: Object.keys(published).length,
    diffs,
    addedFields,
    removedFields,
    changedFields,
  };
}

/**
 * Counts how many components in a file-level migration response have
 * specific fields present (e.g. styleProps, propMappings, etc.).
 */
export function countFieldPresence(
  mappings: Array<Record<string, unknown>>,
  field: string
): number {
  return mappings.filter((m) => m[field] !== undefined).length;
}

/** Formats a comparison result as a terminal-friendly summary. */
export function formatComparison(result: ComparisonResult): string {
  const lines: string[] = [
    `\n── ${result.scenario} (${result.tool}) ──`,
    `  Fields: local=${result.localFieldCount} published=${result.publishedFieldCount}`,
  ];

  if (result.addedFields.length > 0) {
    lines.push(`  ✅ Added in local: ${result.addedFields.join(", ")}`);
  }
  if (result.removedFields.length > 0) {
    lines.push(`  ❌ Removed in local: ${result.removedFields.join(", ")}`);
  }
  if (result.changedFields.length > 0) {
    lines.push(`  ∆ Changed: ${result.changedFields.join(", ")}`);
    for (const diff of result.diffs.filter((d) => d.status === "changed")) {
      const localStr = summarizeValue(diff.local);
      const pubStr = summarizeValue(diff.published);
      lines.push(`    ${diff.field}: ${pubStr} → ${localStr}`);
    }
  }

  if (
    result.addedFields.length === 0 &&
    result.removedFields.length === 0 &&
    result.changedFields.length === 0
  ) {
    lines.push("  (identical)");
  }

  return lines.join("\n");
}

function summarizeValue(val: unknown): string {
  if (val === undefined) return "(absent)";
  if (typeof val === "string") {
    return val.length > 60 ? `"${val.slice(0, 57)}..."` : `"${val}"`;
  }
  if (Array.isArray(val)) return `[${val.length} items]`;
  if (typeof val === "object" && val !== null) {
    return `{${Object.keys(val).length} keys}`;
  }
  return String(val);
}
