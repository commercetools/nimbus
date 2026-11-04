import type { Syntax } from "refractor/core";

/**
 * One highlighted piece of a line.
 */
export type CodeToken = {
  /**
   * The text of the token. Never contains a line break.
   */
  content: string;
  /**
   * Token types from the outermost to the innermost syntax element, for
   * example `["tag", "punctuation"]`. Empty for plain text.
   */
  types: readonly string[];
};

/**
 * One line of highlighted code, as a list of tokens. An empty line has no
 * tokens.
 */
export type CodeLine = readonly CodeToken[];

/**
 * A highlighting engine that turns code into lines of typed tokens.
 *
 * Use `createPrismHighlighter` for the default engine, or implement this type
 * to use another engine with `CodeHighlighterProvider`.
 */
export type CodeHighlighter = {
  /**
   * Returns the canonical id of a language or alias, or `undefined` when the
   * language is not supported (the code is then shown as plain text).
   */
  resolveLanguage(language: string): string | undefined;
  /**
   * Highlights `code` as `language`. Returns one entry per line of `code`; the
   * joined token contents of each line equal that line. May return a Promise
   * for engines that load grammars on demand.
   */
  highlight(
    code: string,
    language: string
  ): readonly CodeLine[] | Promise<readonly CodeLine[]>;
};

/**
 * A Prism grammar in the `refractor` format, for example the default export of
 * `refractor/java`. Pass it to `createPrismHighlighter({ additionalLanguages })`.
 */
export type CodeLanguageDefinition = Syntax;

/**
 * Line numbers and inclusive `[start, end]` ranges of displayed line numbers,
 * for example `[2, [5, 7]]` for lines 2, 5, 6 and 7.
 */
export type CodeLineSelection = ReadonlyArray<
  number | readonly [start: number, end: number]
>;
