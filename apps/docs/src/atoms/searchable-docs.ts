import { atom } from "jotai";
import { documentationAtom } from "./documentation";
import { MdxFileFrontmatter } from "@/types";
import { stripMarkdown } from "@/src/utils/stip-markdown";

export type SearchableDocItem = MdxFileFrontmatter["meta"] & {
  content: string;
};

export const searchableDocItemsAtom = atom((get) => {
  const data = get(documentationAtom);
  const items: SearchableDocItem[] = Object.keys(data).map((key) => ({
    ...data[key].meta,
    content: stripMarkdown(data[key].mdx),
  }));
  return items;
});

export const searchQueryAtom = atom("");
