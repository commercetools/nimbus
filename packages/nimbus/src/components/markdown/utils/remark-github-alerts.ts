/**
 * A Nimbus-owned remark plugin that recognizes GitHub-style alerts (a.k.a.
 * admonitions) — a blockquote whose first line is a marker like `[!NOTE]`,
 * `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, or `[!CAUTION]`:
 *
 * ```md
 * > [!WARNING]
 * > Be careful.
 * ```
 *
 * Pure mdast manipulation — no new dependencies. A matching blockquote is tagged
 * with `data.hProperties["data-alert"] = <type>` so it renders as
 * `<blockquote data-alert="warning">`, and the marker line is stripped from the
 * content. The blockquote renderer reads `data-alert` to apply the callout
 * styling, icon, and (localized) type label. A blockquote without a recognized
 * marker is left untouched and renders as an ordinary quote.
 *
 * Matching follows GitHub: the marker must be alone on the first line of the
 * blockquote (case-insensitive), otherwise the blockquote is treated as plain.
 */

/** Minimal structural mdast node — avoids a direct dependency on mdast types. */
type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

/** Recognized alert types, lowercased — also the `data-alert` attribute value. */
export const ALERT_TYPES = [
  "note",
  "tip",
  "important",
  "warning",
  "caution",
] as const;

// The marker must be alone on the blockquote's first line (trailing whitespace
// allowed), then end-of-string or a newline. Capturing the type for tagging.
const MARKER_RE =
  /^[ \t]*\[!(note|tip|important|warning|caution)\][ \t]*(?:\r?\n|$)/i;

/**
 * If `blockquote` opens with a recognized alert marker, strip the marker from
 * its first paragraph and tag the node for the renderer. No-op otherwise.
 */
function applyAlert(blockquote: MdNode): void {
  const firstParagraph = blockquote.children?.[0];
  if (!firstParagraph || firstParagraph.type !== "paragraph") return;

  const firstText = firstParagraph.children?.[0];
  if (
    !firstText ||
    firstText.type !== "text" ||
    typeof firstText.value !== "string"
  )
    return;

  const match = MARKER_RE.exec(firstText.value);
  if (!match) return;
  const type = match[1].toLowerCase();

  // Strip the marker (and its trailing newline) from the leading text node.
  firstText.value = firstText.value.slice(match[0].length);

  // If the marker stood alone, the leading text (and possibly the whole first
  // paragraph) is now empty — drop the emptied nodes so no blank line renders.
  if (firstText.value === "") {
    firstParagraph.children!.shift();
    if (firstParagraph.children![0]?.type === "break") {
      firstParagraph.children!.shift();
    }
  }
  if (firstParagraph.children!.length === 0) {
    blockquote.children!.shift();
  }

  blockquote.data = blockquote.data ?? {};
  blockquote.data.hProperties = {
    ...(blockquote.data.hProperties ?? {}),
    "data-alert": type,
  };
}

/** Recursively visit every blockquote (including nested ones). */
function transform(node: MdNode): void {
  if (!Array.isArray(node.children)) return;
  for (const child of node.children) {
    if (child.type === "blockquote") applyAlert(child);
    transform(child);
  }
}

/**
 * Remark plugin (unified attacher). Parameterless and always safe to include —
 * a no-op for blockquotes without a recognized marker.
 */
export function remarkGithubAlerts() {
  return function transformer(tree: MdNode) {
    transform(tree);
  };
}
