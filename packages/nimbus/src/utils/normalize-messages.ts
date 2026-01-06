import type { LocalizedString } from "@internationalized/string";

/**
 * Normalizes compiled messages to match LocalizedString signature.
 *
 * This function adapts messages compiled by @internationalized/string-compiler
 * to match the signature expected by LocalizedStringDictionary.
 *
 * @see packages/i18n/README.md for detailed explanation of why this normalization is needed.
 */
export function normalizeMessages(
  messages: Record<
    string,
    string | ((args: Record<string, string | number>) => string)
  >
): Record<string, LocalizedString> {
  const adapted: Record<string, LocalizedString> = {};
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value === "function") {
      // Wrap function to accept undefined args and optional formatter
      // Filter out booleans from args since:
      // 1. Compiled functions only accept string | number (not boolean)
      // 2. Nimbus messages don't use boolean variables, so filtering is safe
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      adapted[key] = ((args, _formatter) => {
        if (!args) return value({});
        // Convert Variables to Record<string, string | number> by filtering booleans
        const filteredArgs: Record<string, string | number> = {};
        for (const [k, v] of Object.entries(args)) {
          if (typeof v === "string" || typeof v === "number") {
            filteredArgs[k] = v;
          }
          // Booleans are intentionally filtered out - not used in our message variables
        }
        return value(filteredArgs);
      }) as LocalizedString;
    } else {
      // Strings are already compatible with LocalizedString, pass through
      adapted[key] = value;
    }
  }
  return adapted;
}
