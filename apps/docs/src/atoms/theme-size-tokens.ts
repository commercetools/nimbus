import { atom } from "jotai";
import { system } from "@bleh-ui/react";

const shirtSizes = ["xs", "sm", "md", "lg", "xl"];

const assignGroup = ({ label }: { label: string }) => {
  switch (true) {
    case label.includes("breakpoint"):
      return "breakpoint";
    case shirtSizes.some((size) => label.includes(size)):
      return "large";
    case label.includes("/"):
      return "fraction";
    case /^\d+(\.\d+)?$/.test(label):
      return "regular";
    default:
      return "other";
  }
};

export const themeSizeTokensAtom = atom(() => {
  const tokenMap = system.tokens.categoryMap.get("sizes");
  const obj = tokenMap ? Object.fromEntries(tokenMap) : {};
  const shaped = Object.keys(obj).map((tokenId) => {
    const token = {
      id: tokenId,
      label: tokenId,
      value: obj[tokenId],
    };

    const group = assignGroup(token);

    return {
      ...token,
      group,
    };
  });

  return shaped;
});
