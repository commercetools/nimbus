import { refractor } from "refractor/core";
import bash from "refractor/bash";
import css from "refractor/css";
import diff from "refractor/diff";
import graphql from "refractor/graphql";
import http from "refractor/http";
import javascript from "refractor/javascript";
import json from "refractor/json";
import jsx from "refractor/jsx";
import markdown from "refractor/markdown";
import markup from "refractor/markup";
import sql from "refractor/sql";
import tsx from "refractor/tsx";
import typescript from "refractor/typescript";
import yaml from "refractor/yaml";
import type {
  CodeHighlighter,
  CodeLanguageDefinition,
  CodeLine,
  CodeToken,
} from "./code-highlighter.types";

const defaultLanguageDefinitions = [
  tsx,
  typescript,
  javascript,
  jsx,
  json,
  css,
  markup,
  bash,
  yaml,
  graphql,
  diff,
  sql,
  markdown,
  http,
] as const;

/**
 * Ids of the languages that `createPrismHighlighter` supports by default.
 */
export const defaultCodeLanguages: readonly string[] =
  defaultLanguageDefinitions.map((definition) => definition.displayName);

/**
 * Aliases added on top of the aliases that the grammars define themselves.
 * The shell aliases follow the commercetools docs kit.
 */
const defaultAliases: Readonly<Record<string, string>> = {
  ts: "typescript",
  js: "javascript",
  html: "markup",
  xml: "markup",
  svg: "markup",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  console: "bash",
  terminal: "bash",
  curl: "bash",
  yml: "yaml",
  md: "markdown",
  gql: "graphql",
};

/**
 * Language names that always mean "no highlighting".
 */
const plainTextLanguages: ReadonlySet<string> = new Set([
  "plaintext",
  "text",
  "txt",
]);

const lineBreak = /\r\n|\r|\n/;

type HastRoot = ReturnType<typeof refractor.highlight>;
type HastNode = HastRoot["children"][number];

/**
 * Options for `createPrismHighlighter`.
 */
export type CreatePrismHighlighterOptions = {
  /**
   * Extra grammars, for example the default export of `refractor/java`.
   */
  additionalLanguages?: readonly CodeLanguageDefinition[];
  /**
   * Extra aliases, as alias → language id (for example `{ jsonc: "json" }`).
   * They win over the default aliases.
   */
  aliases?: Readonly<Record<string, string>>;
};

/**
 * Creates a synchronous `CodeHighlighter` that uses Prism grammars through
 * `refractor`. It supports `defaultCodeLanguages` plus `additionalLanguages`.
 *
 * Each highlighter only resolves the languages and aliases it was created
 * with. The grammars themselves live in one registry shared by all
 * highlighters in the bundle, so a grammar that extends another grammar (for
 * example `refractor/jsdoc` extends `javascript`) changes that grammar for
 * every highlighter. No global object (such as `window.Prism`) is changed.
 *
 * @example
 * ```ts
 * import java from "refractor/java";
 *
 * const highlighter = createPrismHighlighter({ additionalLanguages: [java] });
 * ```
 */
export const createPrismHighlighter = ({
  additionalLanguages = [],
  aliases = {},
}: CreatePrismHighlighterOptions = {}): CodeHighlighter => {
  const languageIds = new Set<string>();
  const aliasTargets = new Map<string, string>();

  for (const definition of [
    ...defaultLanguageDefinitions,
    ...additionalLanguages,
  ]) {
    refractor.register(definition);
    languageIds.add(definition.displayName);
    for (const alias of definition.aliases ?? []) {
      aliasTargets.set(alias, definition.displayName);
    }
  }

  for (const [alias, target] of Object.entries({
    ...defaultAliases,
    ...aliases,
  })) {
    aliasTargets.set(alias, target);
  }

  const resolveLanguage = (language: string): string | undefined => {
    if (plainTextLanguages.has(language)) return undefined;
    if (languageIds.has(language)) return language;
    const target = aliasTargets.get(language);
    return target !== undefined && languageIds.has(target) ? target : undefined;
  };

  const highlight = (code: string, language: string): readonly CodeLine[] => {
    const languageId = resolveLanguage(language);
    if (languageId === undefined) return toPlainLines(code);
    return toLines(refractor.highlight(code, languageId));
  };

  return { resolveLanguage, highlight };
};

/**
 * Splits code into lines with one untyped token each.
 */
const toPlainLines = (code: string): CodeLine[] =>
  code
    .split(lineBreak)
    .map((line) => (line === "" ? [] : [{ content: line, types: [] }]));

/**
 * Turns refractor's hast tree into lines of tokens. Text nodes that contain
 * line breaks are split, and every piece keeps the types of all its ancestor
 * elements.
 */
const toLines = (root: HastRoot): CodeLine[] => {
  const lines: CodeToken[][] = [[]];

  const visit = (
    nodes: readonly HastNode[],
    types: readonly string[]
  ): void => {
    for (const node of nodes) {
      if (node.type === "text") {
        node.value.split(lineBreak).forEach((content, index) => {
          if (index > 0) lines.push([]);
          if (content !== "") lines[lines.length - 1].push({ content, types });
        });
      } else if (node.type === "element") {
        visit(node.children, [...types, ...getTokenTypes(node.properties)]);
      }
    }
  };

  visit(root.children, []);
  return lines;
};

/**
 * Reads the Prism token types from an element's classes, without the generic
 * `token` class.
 */
const getTokenTypes = (properties: Record<string, unknown>): string[] => {
  const { className } = properties;
  if (!Array.isArray(className)) return [];
  return className.filter(
    (name): name is string => typeof name === "string" && name !== "token"
  );
};
