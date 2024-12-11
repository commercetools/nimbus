import { atom } from "jotai";
import { documentationAtom } from "./documentation";
import { MdxFileFrontmatter } from "@/types";

function stripMarkdown(input: string) {
  // Remove HTML tags
  let cleanText = input.replace(/<\/?[^>]+(>|$)/g, "");

  // Remove markdown syntax
  cleanText = cleanText
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
    .replace(/[`*~_>#-]/g, "") // Remove common markdown characters
    .replace(/!\[.*?\]/g, "") // Remove image placeholder
    .replace(/\[.*?\]/g, "") // Remove link placeholder
    .replace(/^\s*\d+\.\s+/g, ""); // Remove ordered list numbers

  // Remove line breaks
  cleanText = cleanText.replace(/\n/g, " ").trim();

  return cleanText;
}

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
