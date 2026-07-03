/**
 * Helpers for the hast `node` that `react-markdown` passes to every renderer.
 * Pure and React-free so they can be unit-tested in isolation.
 */

/** Minimal structural type for the hast nodes react-markdown passes as `node`. */
export type HastNodeLike = {
  type?: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNodeLike[];
};

/**
 * Return a shallow copy of a renderer's props with the hast `node` removed, so
 * it is never spread onto a DOM element (which would leak
 * `node="[object Object]"`). Avoids an unused destructured binding.
 */
export function withoutNode<T extends { node?: unknown }>(
  props: T
): Omit<T, "node"> {
  const rest = { ...props };
  delete (rest as { node?: unknown }).node;
  return rest as Omit<T, "node">;
}

/**
 * Recursively extract the visible text of a hast node — used to derive an
 * accessible name for GFM task-list checkboxes from their item text. Inline
 * formatting (bold/italic/link text) is still captured, but nested sub-lists
 * (`ul`/`ol`) are skipped so a parent task item's label does not absorb its
 * sub-items' text.
 */
export function getNodeText(node: HastNodeLike | undefined | null): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  if (!node.children) return "";
  return node.children
    .filter((child) => child.tagName !== "ul" && child.tagName !== "ol")
    .map(getNodeText)
    .join("")
    .trim();
}
