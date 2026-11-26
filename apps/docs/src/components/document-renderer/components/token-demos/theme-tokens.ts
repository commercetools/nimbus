import { system } from "@commercetools/nimbus";

export interface ThemeToken {
  id: string;
  value: string;
}

/** The tokens of one category, in the order of the theme. */
export const tokensOf = (category: string): ThemeToken[] =>
  Array.from(system.tokens.categoryMap.get(category) ?? [], ([id, token]) => ({
    id,
    value: String(token.value),
  }));
