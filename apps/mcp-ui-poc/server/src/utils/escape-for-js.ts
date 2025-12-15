/**
 * Helper function to escape strings for safe JavaScript code generation
 * Uses JSON.stringify to handle all special characters (backslashes, quotes, newlines, etc.)
 * Then additionally escapes template literal special characters and single quotes
 * @param str String to escape
 * @returns Escaped string safe for JavaScript code in template literals
 */
export function escapeForJS(str: string): string {
  // JSON.stringify handles all JavaScript string escaping
  // Remove surrounding quotes since we'll add them in template
  const escaped = JSON.stringify(str).slice(1, -1);

  // Additionally escape template literal special characters
  // that could break out of the template literal context
  // Also escape single quotes since we use single-quoted strings in generated code
  return escaped
    .replace(/`/g, "\\`") // Escape backticks
    .replace(/\${/g, "\\${") // Escape ${ sequences
    .replace(/'/g, "\\'"); // Escape single quotes for single-quoted strings
}
