/**
 * Strips markdown and HTML tags from the input string.
 *
 * @param input - The string containing markdown and HTML to be stripped.
 * @returns The cleaned string without markdown and HTML tags.
 */
export function stripMarkdown(input: string): string {
  // Remove HTML tags
  let cleanText: string = input.replace(/<\/?[^>]+(>|$)/g, "");

  // Remove markdown syntax
  cleanText = cleanText
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
    .replace(/[`*~_>#-]/g, "") // Remove common markdown characters
    .replace(/!\[.*?\]/g, "") // Remove image placeholder
    .replace(/\[.*?\]/g, "") // Remove link placeholder
    .replace(/^\s*\d+\.\s+/g, ""); // Remove ordered list numbers

  // Remove line breaks and trim whitespace
  cleanText = cleanText.replace(/\n/g, " ").trim();

  return cleanText;
}
