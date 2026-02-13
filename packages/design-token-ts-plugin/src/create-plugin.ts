/**
 * Creates a proxy LanguageService that enriches completions with
 * design token CSS values.
 */

import type typescript from "typescript";
import type { TokenData } from "./token-data";
import { detectCategory } from "./category-detector";

export function createPlugin(
  _ts: typeof typescript,
  info: typescript.server.PluginCreateInfo,
  tokenData: TokenData
): typescript.LanguageService {
  const proxy = Object.create(null) as typescript.LanguageService;

  // Copy all methods from the original language service
  const ls = info.languageService as unknown as Record<string, unknown>;
  const p = proxy as unknown as Record<string, unknown>;
  for (const key of Object.keys(ls)) {
    const value = ls[key];
    if (typeof value === "function") {
      p[key] = (value as (...args: unknown[]) => unknown).bind(
        info.languageService
      );
    }
  }

  // Override getCompletionsAtPosition to enrich entries
  proxy.getCompletionsAtPosition = (
    fileName: string,
    position: number,
    options: typescript.GetCompletionsAtPositionOptions | undefined
  ) => {
    const original = info.languageService.getCompletionsAtPosition(
      fileName,
      position,
      options
    );

    if (!original || original.entries.length === 0) {
      return original;
    }

    // Extract entry names for category detection
    const entryNames = original.entries.map((e) => e.name);
    const category = detectCategory(entryNames, tokenData.categorySets);

    if (!category) {
      return original;
    }

    const values = tokenData.categoryValues[category];
    if (!values) {
      return original;
    }

    // Enrich each entry with its CSS value
    for (const entry of original.entries) {
      const cssValue = values[entry.name];
      if (cssValue !== undefined) {
        entry.labelDetails = { detail: ` = ${cssValue}` };
      }
    }

    return original;
  };

  return proxy;
}
