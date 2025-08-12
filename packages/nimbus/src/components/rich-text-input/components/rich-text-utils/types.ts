import type {
  BaseEditor,
  BaseText,
  Descendant,
  Element as SlateElement,
  Text as SlateText,
} from "slate";
import type { ReactEditor } from "slate-react";
import type { HistoryEditor } from "slate-history";
import type { BLOCK_TAGS, MARK_TAGS } from "./constants";

// Custom element type for Slate
export interface CustomElement {
  type: ElementFormat;
  children: CustomText[];
  align?: string;
  url?: string;
  htmlAttributes?: Record<string, string>;
}

// Custom text type for Slate
export interface CustomText extends BaseText {
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  underline?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  strikethrough?: boolean;
}

export type ElementFormat =
  | (typeof BLOCK_TAGS)[keyof typeof BLOCK_TAGS]
  | (typeof MARK_TAGS)[keyof typeof MARK_TAGS];

// Declare Slate's custom types
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type SlateValue = Descendant[];
