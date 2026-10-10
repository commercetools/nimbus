export { CodeBlock } from "./code-block";
export type { CodeBlockProps } from "./code-block.types";
export {
  createPrismHighlighter,
  defaultCodeLanguages,
  type CreatePrismHighlighterOptions,
} from "./highlighter/create-prism-highlighter";
export {
  CodeHighlighterProvider,
  type CodeHighlighterProviderProps,
} from "./highlighter/code-highlighter-provider";
export type {
  CodeHighlighter,
  CodeLanguageDefinition,
  CodeLine,
  CodeLineSelection,
  CodeToken,
} from "./highlighter/code-highlighter.types";
