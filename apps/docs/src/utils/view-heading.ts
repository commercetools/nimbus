import type { ReactNode } from "react";

/**
 * Returns the plain text of the children of a heading. Children can be a
 * string, a list, or elements with their own children (for example inline code).
 */
export const headingText = (node: ReactNode | unknown): string => {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(headingText).join("");
  }
  if (typeof node === "object" && "props" in node) {
    return headingText(
      (node as { props?: { children?: unknown } }).props?.children
    );
  }
  return "";
};

const normalize = (text: string) => text.trim().toLowerCase();

/** Whether the text of a heading equals the label of the active view tab. */
export const matchesViewLabel = (text: string, label?: string): boolean =>
  !!label && normalize(text) === normalize(label);

type DepthItem = { value: string; depth: number };

/**
 * Applies the "duplicate view heading" rule to a table of contents. When the
 * first `h2` has the text of the active tab label, its entry is removed and the
 * entries below it (up to the next `h2`) move up one level. Otherwise the list
 * is returned unchanged.
 */
export const promoteViewHeading = <T extends DepthItem>(
  items: T[],
  label?: string
): T[] => {
  const first = items.findIndex((entry) => entry.depth === 2);
  if (first === -1 || !matchesViewLabel(items[first].value, label)) {
    return items;
  }

  const next = items.findIndex(
    (entry, index) => index > first && entry.depth <= 2
  );
  const end = next === -1 ? items.length : next;

  return [
    ...items.slice(0, first),
    ...items.slice(first + 1, end).map((entry) => ({
      ...entry,
      depth: entry.depth - 1,
    })),
    ...items.slice(end),
  ];
};
