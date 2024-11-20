import { atom } from "jotai";
import { system } from "@bleh-ui/react";
import { orderBy } from "lodash";

export const themeSpacingTokensAtom = atom((get) => {
  const obj = Object.fromEntries(system.tokens.categoryMap.get("spacing"));
  const shaped = Object.keys(obj).map((tokenId) => {
    return {
      id: tokenId,
      label: tokenId,
      value: obj[tokenId],
    };
  });

  // Every token that starts with a "-" is a duplicate of a regular token
  // allowing usage in negative margins. Not needed for display purposes.
  const onlyPositiveValues = shaped.filter((v) => v.id[0] !== "-");

  return orderBy(onlyPositiveValues, (v) => parseFloat(v.value.value), "asc");
});
