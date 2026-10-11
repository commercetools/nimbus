import { useCallback, useId, useMemo, useState } from "react";
import { useDisclosureState } from "react-stately";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { extractStyleProps } from "@/utils";
import { CodeBlockRootSlot } from "../code-block.slots";
import {
  CodeBlockContext,
  type CodeBlockContextValue,
} from "../code-block.context";
import type { CodeBlockRootProps } from "../code-block.types";
import { useCodeHighlighter } from "../highlighter/code-highlighter-provider";
import { useHighlightedLines } from "../hooks/use-highlighted-lines";

/**
 * CodeBlock.Root - Holds the code, highlights it, and provides shared state to
 * all parts. Renders a `section`.
 *
 * The section is a region only when it has a name: `aria-label`, else the
 * text of `CodeBlock.Title`. The Title is detected after mount, so
 * server-rendered HTML has no region until then.
 *
 * @supportsStyleProps
 */
export const CodeBlockRoot = (props: CodeBlockRootProps) => {
  const {
    code,
    language,
    maxLines,
    isExpanded,
    defaultExpanded = false,
    onExpandedChange,
    "aria-label": ariaLabel,
    children,
    ref,
    ...restProps
  } = props;
  const recipe = useSlotRecipe({ key: "nimbusCodeBlock" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  const highlighter = useCodeHighlighter();
  const lines = useHighlightedLines(code, language, highlighter);
  const expandedState = useDisclosureState({
    isExpanded,
    defaultExpanded,
    onExpandedChange,
  });

  const titleId = useId();
  const contentId = useId();
  const [titleCount, setTitleCount] = useState(0);
  const registerTitle = useCallback(() => {
    setTitleCount((count) => count + 1);
    return () => setTitleCount((count) => count - 1);
  }, []);

  // `count` re-keys the message node, so an identical message (a second copy)
  // is announced again.
  const [announcement, setAnnouncement] = useState({ message: "", count: 0 });
  const announce = useCallback(
    (message: string) =>
      setAnnouncement((previous) => ({ message, count: previous.count + 1 })),
    []
  );

  const isCollapsible =
    maxLines !== undefined && maxLines >= 0 && lines.length > maxLines;

  const contextValue = useMemo<CodeBlockContextValue>(
    () => ({
      code,
      language,
      lines,
      maxLines,
      isCollapsible,
      isExpanded: expandedState.isExpanded,
      setExpanded: expandedState.setExpanded,
      titleId,
      registerTitle,
      contentId,
      announce,
    }),
    [
      code,
      language,
      lines,
      maxLines,
      isCollapsible,
      expandedState.isExpanded,
      expandedState.setExpanded,
      titleId,
      registerTitle,
      contentId,
      announce,
    ]
  );

  // A region only when named: unnamed blocks would otherwise be landmarks
  // with the same name (axe `landmark-unique`).
  const nameProps =
    ariaLabel !== undefined
      ? { role: "region", "aria-label": ariaLabel }
      : titleCount > 0
        ? { role: "region", "aria-labelledby": titleId }
        : {};

  return (
    <CodeBlockContext.Provider value={contextValue}>
      <CodeBlockRootSlot
        ref={ref}
        {...nameProps}
        {...recipeProps}
        {...styleProps}
        {...functionalProps}
      >
        {children}
        {/*
         * Always-mounted polite live region for copy feedback.
         * aria-atomic ensures the full message is announced.
         */}
        <VisuallyHidden>
          <span aria-live="polite" aria-atomic="true">
            <span key={announcement.count}>{announcement.message}</span>
          </span>
        </VisuallyHidden>
      </CodeBlockRootSlot>
    </CodeBlockContext.Provider>
  );
};

CodeBlockRoot.displayName = "CodeBlock.Root";
