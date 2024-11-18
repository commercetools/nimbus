import { atom } from "jotai";
import { documentationAtom } from "./documentation";

export const searchableDocItems = atom((get) => {
  const data = get(documentationAtom);
  const items = Object.keys(data).map((key) => data[key].meta);

  return items;
});
