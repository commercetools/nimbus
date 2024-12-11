import { atom } from "jotai";
import { activeDocAtom } from "./active-doc.ts";

/** The currently active browser route*/
export const activeTocAtom = atom((get) => {
  const doc = get(activeDocAtom);
  return doc?.meta.toc || [];
});
