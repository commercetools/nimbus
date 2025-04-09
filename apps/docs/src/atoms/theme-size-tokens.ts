import { atom } from "jotai";
import { system } from "@nimbus/react";

// Define shirt sizes
const SHIRT_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Assigns a group to a token based on its label.
 * @param {Object} param - The token object.
 * @param {string} param.label - The label of the token.
 * @returns {string} - The group name.
 */
const assignGroup = ({ label }: { label: string }): string => {
  if (label.includes("breakpoint")) {
    return "breakpoint";
  }
  if (SHIRT_SIZES.some((size) => label.includes(size))) {
    return "large";
  }
  if (label.includes("/")) {
    return "fraction";
  }
  if (/^\d+(\.\d+)?$/.test(label)) {
    return "regular";
  }
  return "other";
};

/**
 * Atom to manage theme size tokens.
 * @returns {Array} - The shaped tokens array.
 */
export const themeSizeTokensAtom = atom(() => {
  const tokenMap = system.tokens.categoryMap.get("sizes");
  const tokens = tokenMap ? Object.fromEntries(tokenMap) : {};

  return Object.keys(tokens).map((tokenId) => {
    const token = {
      id: tokenId,
      label: tokenId,
      value: tokens[tokenId],
    };

    const group = assignGroup(token);

    return {
      ...token,
      group,
    };
  });
});
