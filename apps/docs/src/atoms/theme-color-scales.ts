import { atom } from "jotai";
import { system } from "@bleh-ui/react";

/** The currently active browser route*/
export const themeColorScalesAtom = atom(
  system.tokens.categoryMap.get("colors")
);
