/**
 * Formats JSDoc-style descriptions for display in the props table.
 *
 * Handles:
 * - example-blocks: Extracts code and formats as markdown code fences
 * - param-tags: Formats as bulleted list or removes
 * - returns-tags: Formats or removes
 * - deprecated-tags: Highlights prominently
 * - Other JSDoc tags: Preserves or removes based on configuration
 *
 * @param description - Raw JSDoc description string
 * @returns Formatted markdown string safe for MDX rendering
 */
export function formatJSDocDescription(
  description: string | undefined
): string {
  if (!description) {
    return "";
  }

  let formatted = description;

  // 1. Extract and format @example blocks
  // Pattern: @example ```lang\ncode\n```
  formatted = formatted.replace(
    /@example\s+```(\w+)?\n([\s\S]*?)```/g,
    (_match, lang, code) => {
      // Remove the @example tag, keep only the code block
      const language = lang || "tsx";
      return `\n\n**Example:**\n\n\`\`\`${language}\n${code.trim()}\n\`\`\`\n\n`;
    }
  );

  // 2. Format @deprecated tag
  formatted = formatted.replace(
    /@deprecated\s+(.+?)(?=\n@|\n\n|$)/gs,
    (_match, text) => {
      return `\n\n> **⚠️ Deprecated:** ${text.trim()}\n\n`;
    }
  );

  // 3. Format @param tags (convert to list or remove)
  // Pattern: @param name - description
  const paramMatches = [
    ...formatted.matchAll(/@param\s+(\w+)\s+-?\s*(.+?)(?=\n@|\n\n|$)/gs),
  ];
  if (paramMatches.length > 0) {
    let paramSection = "\n\n**Parameters:**\n\n";
    paramMatches.forEach(([fullMatch, paramName, paramDesc]) => {
      paramSection += `- \`${paramName}\` - ${paramDesc.trim()}\n`;
      // Remove the original @param tag
      formatted = formatted.replace(fullMatch, "");
    });
    // Add formatted params section at the end
    formatted += paramSection;
  }

  // 4. Format @returns tag
  formatted = formatted.replace(
    /@returns?\s+(.+?)(?=\n@|\n\n|$)/gs,
    (_match, text) => {
      return `\n\n**Returns:** ${text.trim()}\n\n`;
    }
  );

  // 5. Handle @see tags with links (convert to markdown links)
  formatted = formatted.replace(/@see\s+{@link\s+([^}]+)}/g, (_match, url) => {
    return `\n\n[See documentation](${url})\n\n`;
  });

  // 6. Clean up common JSDoc tags that shouldn't display
  // (These are typically for tooling, not user docs)
  formatted = formatted.replace(
    /@(?:internal|private|protected|public|readonly|see|since|version)\s+[^\n]*/g,
    ""
  );

  // 7. Clean up excessive whitespace
  formatted = formatted
    .replace(/\n{3,}/g, "\n\n") // Max 2 consecutive newlines
    .trim();

  return formatted;
}

/**
 * Alternative: Minimal sanitization (just remove @example tag, keep code)
 * Use this if you want to keep JSDoc tags visible but clean up @example
 */
export function sanitizeJSDocExamples(description: string | undefined): string {
  if (!description) {
    return "";
  }

  // Simply remove the @example tag but keep the code block
  return description.replace(/@example\s+/g, "\n\n**Example:**\n\n");
}
