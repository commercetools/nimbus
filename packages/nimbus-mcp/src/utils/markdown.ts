/**
 * Strips MDX/Markdown content for MCP tool responses to reduce context bloat.
 *
 * Removes frontmatter, JSX component tags (uppercase and lowercase HTML),
 * fenced code block fence markers (content preserved for searchability),
 * and markdown formatting. Collapses excess whitespace.
 *
 * Design notes:
 * - Fenced code blocks are extracted before any other transforms so that
 *   tag-stripping regexes never touch code examples. Only the fence markers
 *   (``` lines) are removed; code content is restored verbatim.
 * - Frontmatter regex has no /m flag so ^ anchors to the true start of the
 *   string only — mid-document --- separators are left intact.
 * - Inline code backtick markers are preserved for searchability.
 */
export function stripMarkdown(text: string): string {
  // --- Step 1: Extract fenced code blocks into placeholders ---
  // This prevents tag-stripping regexes from mangling code examples.
  // The null-byte delimiter (\uE000) is safe because MDX source never contains it.
  const codeBlocks: string[] = [];
  const withPlaceholders = text.replace(
    /^```[^\n]*\n([\s\S]*?)^```[ \t]*$/gm,
    (_, content: string) => {
      codeBlocks.push(content.trimEnd());
      return `\uE000CODE${codeBlocks.length - 1}\uE000`;
    }
  );

  // --- Step 2: Strip MDX/Markdown formatting from non-code text ---
  const stripped = withPlaceholders
    // Strip frontmatter (no /m flag — ^ must match true start of string)
    .replace(/^---[\s\S]*?---\n?/, "")
    // Strip uppercase JSX self-closing tags: <Component />
    .replace(/<[A-Z][^>]*\/>/g, "")
    // Strip uppercase JSX paired tags and their content: <Component>...</Component>
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "")
    // Strip lowercase HTML self-closing tags: <br />, <hr />
    .replace(/<[a-z][^>]*\/>/g, "")
    // Strip lowercase HTML tag markers but preserve text content: <div>, </div>
    .replace(/<\/?[a-z][^>]*>/g, "")
    // Strip markdown headings
    .replace(/#{1,6}\s/g, "")
    // Strip bold
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    // Strip italic
    .replace(/\*([^*]+)\*/g, "$1")
    // Strip images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    // Strip links (preserve text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Collapse excess blank lines
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // --- Step 3: Restore code block content (fence markers are not restored) ---
  return stripped.replace(
    /\uE000CODE(\d+)\uE000/g,
    (_, i) => codeBlocks[Number(i)]
  );
}
