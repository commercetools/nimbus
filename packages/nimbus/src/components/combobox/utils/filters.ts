import type { Node } from "react-stately";

/**
 * Default text-based filter for combobox items
 * Filters individual items by their text content
 * Does NOT handle sections - use createSectionAwareFilter for that
 *
 * @param nodes - Collection nodes to filter
 * @param inputValue - Current filter text from input
 * @returns Filtered collection nodes containing only items that match the input
 *
 * @example
 * ```tsx
 * <ComboBox.Root
 *   items={items}
 *   filter={filterByText}
 *   placeholder="Search..."
 * />
 * ```
 *
 * **Behavior:**
 * - Case-insensitive substring matching
 * - Returns all nodes when input is empty or whitespace
 * - Filters based on Node.textValue property
 * - Does not preserve sections (use section-aware filter for that)
 *
 * **Note:** This filter works on individual items only. For filtering with
 * sections preserved, use `createSectionAwareFilter` to wrap your custom
 * filter logic.
 */
export function filterByText<T extends object>(
  nodes: Iterable<Node<T>>,
  inputValue: string
): Iterable<Node<T>> {
  if (!inputValue.trim()) return nodes;

  const lowerInput = inputValue.toLowerCase();

  const filtered: Node<T>[] = [];
  for (const node of nodes) {
    if (node.textValue.toLowerCase().includes(lowerInput)) {
      filtered.push(node);
    }
  }

  return filtered;
}
