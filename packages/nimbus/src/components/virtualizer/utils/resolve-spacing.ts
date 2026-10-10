import { themeTokens } from "@commercetools/nimbus-tokens";
import type { VirtualizerSpacing } from "../virtualizer.types";

/**
 * Resolve a spacing value to pixels for a React Aria layout, which only
 * accepts numbers. A number is returned as is; a Nimbus spacing token key (for
 * example `"100"`) is looked up in the design tokens. An unknown token
 * resolves to `undefined`, so the layout falls back to its default, and logs a
 * development warning.
 */
export function resolveSpacing(
  value: VirtualizerSpacing | undefined
): number | undefined {
  if (value === undefined || typeof value === "number") return value;

  const token: { value: string } | undefined =
    themeTokens.spacing[value as keyof typeof themeTokens.spacing];
  if (token) return parseFloat(token.value);

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[Nimbus Virtualizer] Unknown spacing token "${String(value)}". ` +
        `Use a Nimbus spacing token such as "100" or a number of pixels.`
    );
  }
  return undefined;
}
