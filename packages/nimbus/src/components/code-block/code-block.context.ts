import { createContext } from "react";
import type { CodeLine } from "./highlighter/code-highlighter.types";
import type { CodeBlockActionsPlacement } from "./code-block.types";

/**
 * Shared state that `CodeBlock.Root` provides to its parts.
 */
export type CodeBlockContextValue = {
  /** The original `code` string; copy and download use it. */
  code: string;
  /** The `language` prop as given (not resolved). */
  language: string | undefined;
  /** The highlighted, normalized lines. */
  lines: readonly CodeLine[];
  /** The number of lines shown while collapsed, when the block is collapsible. */
  maxLines: number | undefined;
  /** Whether the code has more lines than `maxLines`. */
  isCollapsible: boolean;
  /** Whether all lines are shown. */
  isExpanded: boolean;
  /** Expands or collapses the block. */
  setExpanded: (isExpanded: boolean) => void;
  /** The id that `CodeBlock.Title` renders. */
  titleId: string;
  /** Registers a rendered title; returns a function that removes it. */
  registerTitle: () => () => void;
  /** The id of the scrollable code element, for `aria-controls`. */
  contentId: string;
  /** Writes a message to the polite live region of the block. */
  announce: (message: string) => void;
};

/**
 * Internal context shared between `CodeBlock.Root` and its parts.
 *
 * @internal
 */
export const CodeBlockContext = createContext<
  CodeBlockContextValue | undefined
>(undefined);

/**
 * Tells `CodeBlock.Actions` whether it is placed in the header or next to the
 * code.
 *
 * @internal
 */
export const CodeBlockActionsPlacementContext = createContext<
  CodeBlockActionsPlacement | undefined
>(undefined);
