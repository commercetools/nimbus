import { atom } from "jotai";
import { system } from "@nimbus/react";
import orderBy from "lodash/orderBy";

// Define the shape of a spacing token
interface SpacingToken {
  id: string;
  label: string;
  value: { value: string; originalValue: string };
}

/**
 * Atom to fetch and sort theme spacing tokens.
 * @returns {SpacingToken[]} Sorted array of spacing tokens.
 */
export const themeSpacingTokensAtom = atom<SpacingToken[]>(() => {
  // Retrieve the spacing tokens from the system
  const tokenMap = system.tokens.categoryMap.get("spacing");
  const obj = tokenMap ? Object.fromEntries(tokenMap) : {};

  // Shape the tokens into an array of objects
  const shaped: SpacingToken[] = Object.keys(obj).map((tokenId) => ({
    id: tokenId,
    label: tokenId,
    value: obj[tokenId],
  }));

  // Filter out tokens that start with a "-" (negative margins)
  const onlyPositiveValues = shaped.filter((v) => v.id[0] !== "-");

  // Sort the tokens by their numeric value in ascending order
  return orderBy(onlyPositiveValues, (v) => parseFloat(v.value.value), "asc");
});
