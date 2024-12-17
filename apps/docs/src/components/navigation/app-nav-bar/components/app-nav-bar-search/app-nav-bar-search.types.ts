import { SearchableDocItem } from "@/atoms/searchable-docs";

export type SearchResultItemProps = {
  item: SearchableDocItem;
  score: number | undefined;
  ["data-active-item"]?: boolean;
};
