import type { BaseEditor, BaseText, Descendant } from "slate";
import type { ReactEditor } from "slate-react";
import type { HistoryEditor } from "slate-history";
import type { BLOCK_TAGS } from "../constants";

// Custom element type for Slate
export type CustomElement = {
  type: ElementFormat;
  children: Descendant[];
  align?: string;
  url?: string;
  htmlAttributes?: Record<string, string>;
};

// Custom text type for Slate
export type CustomText = BaseText & {
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  underline?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  strikethrough?: boolean;
};

export type ElementFormat = (typeof BLOCK_TAGS)[keyof typeof BLOCK_TAGS];

// Declare Slate's custom types
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
