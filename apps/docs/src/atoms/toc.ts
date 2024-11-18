import { atom } from "jotai";
import { activeDocAtom } from "./activeDoc";

/** The currently active browser route*/
export const activeTocAtom = atom((get) => {
  const doc = get(activeDocAtom);
  return doc?.meta.toc || [];
});
