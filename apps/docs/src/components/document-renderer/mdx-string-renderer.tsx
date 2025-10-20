import { useState, useEffect } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { remarkMark } from "remark-mark-highlight";
import { components } from "./components";

import type { FC, ReactNode } from "react";
import { MDXProps } from "mdx/types";
import type { EvaluateOptions } from "@mdx-js/mdx";

type ReactMDXContent = (props: MDXProps) => ReactNode;
type Runtime = Pick<EvaluateOptions, "jsx" | "jsxs" | "Fragment">;

const runtime = { jsx, jsxs, Fragment } as Runtime;

export const MdxStringRenderer: FC<{
  content?: string;
}> = ({ content = "" }) => {
  const [MdxContent, setMdxContent] = useState<ReactMDXContent>(
    () => () => null
  );
  const [isEvaluating, setIsEvaluating] = useState(true);
  const [renderedContent, setRenderedContent] = useState(content);

  useEffect(() => {
    // Mark as evaluating and clear old content when content changes
    setIsEvaluating(true);

    void evaluate(content, {
      ...runtime,
      remarkPlugins: [remarkGfm, remarkMark],
    }).then((r) => {
      setMdxContent(() => r.default);
      setRenderedContent(content);
      setIsEvaluating(false);
    });
  }, [content]);

  // Don't render stale content while evaluating new content
  // Only render if the evaluated content matches the current content
  if (isEvaluating || renderedContent !== content) {
    return null;
  }

  return <MdxContent components={components} />;
};
