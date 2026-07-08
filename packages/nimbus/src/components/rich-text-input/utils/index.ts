// Core utilities for rich text editor functionality
export { createEmptyValue, toHTML, fromHTML } from "./html-serialization";
export { isEmpty } from "./is-empty";
export {
  validSlateStateAdapter,
  isMarkActive,
  isBlockActive,
  toggleMark,
  toggleBlock,
  focusEditor,
  resetEditor,
  withLinks,
  Element,
  Leaf,
  Softbreaker,
} from "./slate-helpers";
export type * from "./types";
