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

/**
 * Starts-with filter for combobox items
 * Matches items where textValue begins with the input
 *
 * @param nodes - Collection nodes to filter
 * @param inputValue - Current filter text from input
 * @returns Filtered collection nodes containing only items that start with the input
 *
 * @example
 * ```tsx
 * <ComboBox.Root
 *   items={items}
 *   filter={filterByStartsWith}
 *   placeholder="Type to filter..."
 * />
 * ```
 *
 * **Behavior:**
 * - Case-insensitive prefix matching
 * - More restrictive than substring matching
 * - Useful for autocomplete-style filtering
 * - Returns all nodes when input is empty
 *
 * **Use Cases:**
 * - Country/state selection where users type the beginning
 * - Name lookups where first letters matter
 * - Command palettes with prefix shortcuts
 */
export function filterByStartsWith<T extends object>(
  nodes: Iterable<Node<T>>,
  inputValue: string
): Iterable<Node<T>> {
  if (!inputValue.trim()) return nodes;

  const lowerInput = inputValue.toLowerCase();

  const filtered: Node<T>[] = [];
  for (const node of nodes) {
    if (node.textValue.toLowerCase().startsWith(lowerInput)) {
      filtered.push(node);
    }
  }

  return filtered;
}

/**
 * Case-sensitive filter for combobox items
 * Matches items with exact case matching
 *
 * @param nodes - Collection nodes to filter
 * @param inputValue - Current filter text from input
 * @returns Filtered collection nodes containing only items that match with exact case
 *
 * @example
 * ```tsx
 * <ComboBox.Root
 *   items={programmingLanguages}
 *   filter={filterByCaseSensitive}
 *   placeholder="Case-sensitive search..."
 * />
 * ```
 *
 * **Behavior:**
 * - Exact case matching (case-sensitive substring)
 * - More precise than case-insensitive filtering
 * - Returns all nodes when input is empty
 *
 * **Use Cases:**
 * - Code/variable name search
 * - File path filtering
 * - Technical identifiers that are case-sensitive
 */
export function filterByCaseSensitive<T extends object>(
  nodes: Iterable<Node<T>>,
  inputValue: string
): Iterable<Node<T>> {
  if (!inputValue.trim()) return nodes;

  const filtered: Node<T>[] = [];
  for (const node of nodes) {
    if (node.textValue.includes(inputValue)) {
      filtered.push(node);
    }
  }

  return filtered;
}

/**
 * Word boundary filter for combobox items
 * Matches items where input appears at word boundaries
 *
 * @param nodes - Collection nodes to filter
 * @param inputValue - Current filter text from input
 * @returns Filtered collection nodes where input matches at word boundaries
 *
 * @example
 * ```tsx
 * <ComboBox.Root
 *   items={items}
 *   filter={filterByWordBoundary}
 *   placeholder="Search by word..."
 * />
 * ```
 *
 * **Behavior:**
 * - Matches whole words or word beginnings
 * - Case-insensitive
 * - Input "eagle" matches "Bald Eagle" but not "beagle"
 * - Returns all nodes when input is empty
 *
 * **Use Cases:**
 * - Product search where partial words don't make sense
 * - Name search with multiple words
 * - Tag/category filtering
 */
export function filterByWordBoundary<T extends object>(
  nodes: Iterable<Node<T>>,
  inputValue: string
): Iterable<Node<T>> {
  if (!inputValue.trim()) return nodes;

  // Escape special regex characters
  const escapedInput = inputValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escapedInput}`, "i");

  const filtered: Node<T>[] = [];
  for (const node of nodes) {
    if (regex.test(node.textValue)) {
      filtered.push(node);
    }
  }

  return filtered;
}

/**
 * Fuzzy matching filter for combobox items
 * Matches items where all input characters appear in order (but not necessarily consecutive)
 *
 * @param nodes - Collection nodes to filter
 * @param inputValue - Current filter text from input
 * @returns Filtered collection nodes that match the fuzzy pattern
 *
 * @example
 * ```tsx
 * <ComboBox.Root
 *   items={items}
 *   filter={filterByFuzzy}
 *   placeholder="Fuzzy search..."
 * />
 * ```
 *
 * **Behavior:**
 * - Case-insensitive fuzzy matching
 * - Input "ble" matches "Bald Eagle"
 * - All characters must appear in order, but can have gaps
 * - More forgiving than substring matching
 * - Returns all nodes when input is empty
 *
 * **Use Cases:**
 * - Quick command/action selection
 * - File/folder navigation
 * - Large lists where users know approximate spelling
 * - Abbreviated lookups (e.g., "nj" for "New Jersey")
 */
export function filterByFuzzy<T extends object>(
  nodes: Iterable<Node<T>>,
  inputValue: string
): Iterable<Node<T>> {
  if (!inputValue.trim()) return nodes;

  const lowerInput = inputValue.toLowerCase();

  const filtered: Node<T>[] = [];
  for (const node of nodes) {
    const lowerText = node.textValue.toLowerCase();
    let inputIndex = 0;

    for (
      let i = 0;
      i < lowerText.length && inputIndex < lowerInput.length;
      i++
    ) {
      if (lowerText[i] === lowerInput[inputIndex]) {
        inputIndex++;
      }
    }

    if (inputIndex === lowerInput.length) {
      filtered.push(node);
    }
  }

  return filtered;
}

/**
 * Creates a filter that searches across multiple object properties
 * Useful when items have structured data with multiple searchable fields
 *
 * @param propertyPaths - Array of property paths to search (e.g., ['name', 'description', 'tags'])
 * @returns A filter function that searches across specified properties
 *
 * @example
 * ```tsx
 * type Product = {
 *   name: string;
 *   category: string;
 *   description: string;
 * };
 *
 * const productFilter = createMultiPropertyFilter<Product>(['name', 'category', 'description']);
 *
 * <ComboBox.Root
 *   items={products}
 *   filter={productFilter}
 *   placeholder="Search products..."
 * >
 *   {(item) => <ComboBox.Option textValue={item.name}>{item.name}</ComboBox.Option>}
 * </ComboBox.Root>
 * ```
 *
 * **Behavior:**
 * - Searches all specified properties
 * - Case-insensitive substring matching
 * - Matches if ANY property contains the input
 * - Returns all nodes when input is empty
 *
 * **Use Cases:**
 * - Product catalogs with multiple searchable fields
 * - User directories (search by name, email, department)
 * - Document search (title, author, tags, content)
 * - Complex data structures with nested properties
 *
 * **Note:** Uses node.value to access the original item data.
 * If you need to search nested properties, use dot notation: 'address.city'
 */
export function createMultiPropertyFilter<T extends object>(
  propertyPaths: string[]
): (nodes: Iterable<Node<T>>, inputValue: string) => Iterable<Node<T>> {
  return (nodes: Iterable<Node<T>>, inputValue: string): Iterable<Node<T>> => {
    if (!inputValue.trim()) return nodes;

    const lowerInput = inputValue.toLowerCase();

    const filtered: Node<T>[] = [];
    for (const node of nodes) {
      const item = node.value;
      if (!item) continue;

      // Check each property path
      const matches = propertyPaths.some((path) => {
        // Support nested properties with dot notation
        const value = path.split(".").reduce<unknown>((obj, key) => {
          return obj && typeof obj === "object"
            ? (obj as Record<string, unknown>)[key]
            : undefined;
        }, item);

        if (value === null || value === undefined) return false;

        const stringValue = String(value).toLowerCase();
        return stringValue.includes(lowerInput);
      });

      if (matches) {
        filtered.push(node);
      }
    }

    return filtered;
  };
}

/**
 * Creates a filter with custom scoring/ranking logic
 * Returns items sorted by relevance score (highest first)
 *
 * @param scoreFn - Function that returns a relevance score for each item (higher = more relevant)
 * @returns A filter function that sorts results by score
 *
 * @example
 * ```tsx
 * // Prefer items that start with input, but also include substring matches
 * const rankedFilter = createRankedFilter<SimpleOption>((node, inputValue) => {
 *   const text = node.textValue.toLowerCase();
 *   const input = inputValue.toLowerCase();
 *
 *   if (text.startsWith(input)) return 100; // Highest score for prefix match
 *   if (text.includes(input)) return 50;    // Lower score for substring match
 *   return 0;                               // No match
 * });
 *
 * <ComboBox.Root
 *   items={items}
 *   filter={rankedFilter}
 *   placeholder="Search..."
 * />
 * ```
 *
 * **Behavior:**
 * - Applies custom scoring logic to each item
 * - Filters out items with score <= 0
 * - Sorts remaining items by score (descending)
 * - Returns all nodes when input is empty
 *
 * **Use Cases:**
 * - Search with relevance ranking
 * - Prioritizing certain match types (prefix vs substring)
 * - Boosting items based on metadata (popularity, recency, etc.)
 * - Implementing search algorithms like TF-IDF
 *
 * **Score Guidelines:**
 * - Return 0 or negative for non-matches (will be filtered out)
 * - Higher scores = better matches
 * - Consider using score ranges (e.g., 0-100) for consistent behavior
 */
export function createRankedFilter<T extends object>(
  scoreFn: (node: Node<T>, inputValue: string) => number
): (nodes: Iterable<Node<T>>, inputValue: string) => Iterable<Node<T>> {
  return (nodes: Iterable<Node<T>>, inputValue: string): Iterable<Node<T>> => {
    if (!inputValue.trim()) return nodes;

    const scored: Array<{ node: Node<T>; score: number }> = [];

    for (const node of nodes) {
      const score = scoreFn(node, inputValue);
      if (score > 0) {
        scored.push({ node, score });
      }
    }

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return scored.map((item) => item.node);
  };
}

/**
 * Creates a filter that matches any of multiple input terms (OR logic)
 * Splits input by spaces and matches if any term matches
 *
 * @param baseFilter - The underlying filter to use for each term (defaults to filterByText)
 * @returns A filter function that matches any term
 *
 * @example
 * ```tsx
 * const multiTermFilter = createMultiTermFilter();
 *
 * <ComboBox.Root
 *   items={items}
 *   filter={multiTermFilter}
 *   placeholder="Search (space-separated terms)..."
 * />
 * // Input "eagle bison" matches both "Bald Eagle" and "Bison"
 * ```
 *
 * **Behavior:**
 * - Splits input by whitespace
 * - Matches if ANY term matches (OR logic)
 * - Each term is filtered using the base filter
 * - Returns all nodes when input is empty
 *
 * **Use Cases:**
 * - Search with multiple keywords
 * - Tag-based filtering (e.g., "react typescript")
 * - Alternative spellings or synonyms
 * - Flexible search where users enter multiple criteria
 *
 * **Note:** To require ALL terms to match (AND logic), consider chaining filters
 * or implementing a custom filter function.
 */
export function createMultiTermFilter<T extends object>(
  baseFilter: (
    nodes: Iterable<Node<T>>,
    inputValue: string
  ) => Iterable<Node<T>> = filterByText
): (nodes: Iterable<Node<T>>, inputValue: string) => Iterable<Node<T>> {
  return (nodes: Iterable<Node<T>>, inputValue: string): Iterable<Node<T>> => {
    if (!inputValue.trim()) return nodes;

    const terms = inputValue.split(/\s+/).filter((term) => term.length > 0);
    if (terms.length === 0) return nodes;

    // Collect all matching nodes across all terms
    const matchingKeys = new Set<React.Key>();

    for (const term of terms) {
      const filtered = baseFilter(nodes, term);
      for (const node of filtered) {
        matchingKeys.add(node.key);
      }
    }

    // Return nodes that matched any term
    const result: Node<T>[] = [];
    for (const node of nodes) {
      if (matchingKeys.has(node.key)) {
        result.push(node);
      }
    }

    return result;
  };
}

/**
 * Creates a section-aware filter that preserves section structure
 * Wraps a custom filter function to work with sections, hiding empty sections
 *
 * @param itemFilter - Filter function to apply to individual items
 * @returns A filter function that preserves sections and hides empty ones
 *
 * @example
 * ```tsx
 * // Using with built-in filters
 * const sectionAwareStartsWith = createSectionAwareFilter(
 *   (nodes, input) => filterByStartsWith(nodes, input)
 * );
 *
 * <ComboBox.Root
 *   items={sectionsWithItems}
 *   filter={sectionAwareStartsWith}
 * >
 *   {(section) => (
 *     <ComboBox.Section title={section.name}>
 *       {section.items.map((item) => (
 *         <ComboBox.Option key={item.id} textValue={item.name}>
 *           {item.name}
 *         </ComboBox.Option>
 *       ))}
 *     </ComboBox.Section>
 *   )}
 * </ComboBox.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Using with custom filter logic
 * const customSectionFilter = createSectionAwareFilter(
 *   (nodes, input) => {
 *     const lowerInput = input.toLowerCase();
 *     const filtered: Node<T>[] = [];
 *     for (const node of nodes) {
 *       // Custom filtering logic
 *       if (node.textValue.toLowerCase().startsWith(lowerInput)) {
 *         filtered.push(node);
 *       }
 *     }
 *     return filtered;
 *   }
 * );
 * ```
 *
 * **Behavior:**
 * - Applies the item filter to items within each section
 * - Preserves section nodes in the output
 * - Automatically hides sections that have no matching items
 * - Returns all nodes when input is empty
 *
 * **Use Cases:**
 * - Categorized combobox options (Animals → Mammals, Birds, etc.)
 * - Grouped data where sections provide context
 * - Multi-level hierarchies that need filtering
 * - Search where maintaining visual grouping is important
 *
 * **Important Notes:**
 * - The item filter receives ONLY item nodes (not section nodes)
 * - Section nodes are detected by checking node.type === "section"
 * - Empty sections are automatically excluded from results
 * - Section order is preserved from the original collection
 *
 * **Performance:**
 * - Filters items separately for each section
 * - More efficient than flat filtering for large datasets with many sections
 */
export function createSectionAwareFilter<T extends object>(
  itemFilter: (
    nodes: Iterable<Node<T>>,
    inputValue: string
  ) => Iterable<Node<T>>
): (nodes: Iterable<Node<T>>, inputValue: string) => Iterable<Node<T>> {
  return (nodes: Iterable<Node<T>>, inputValue: string): Iterable<Node<T>> => {
    if (!inputValue.trim()) return nodes;

    const result: Node<T>[] = [];
    let currentSection: Node<T> | null = null;
    const currentSectionItems: Node<T>[] = [];

    // Helper to flush current section if it has matching items
    const flushSection = () => {
      if (currentSection && currentSectionItems.length > 0) {
        result.push(currentSection);
        result.push(...currentSectionItems);
      }
      currentSectionItems.length = 0;
    };

    for (const node of nodes) {
      // Check if this is a section node
      if (node.type === "section") {
        // Flush previous section if any
        flushSection();
        // Store this section for potential inclusion
        currentSection = node;
      } else {
        // This is an item node - apply filter
        const filteredItems = Array.from(itemFilter([node], inputValue));
        if (filteredItems.length > 0) {
          currentSectionItems.push(...filteredItems);
        }
      }
    }

    // Flush the last section
    flushSection();

    return result;
  };
}
