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
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);

  useEffect(() => {
    // If content has changed, mark as evaluating and clear old content
    if (content !== currentContent) {
      setIsEvaluating(true);
      setCurrentContent(content);
    }

    void evaluate(content, {
      ...runtime,
      remarkPlugins: [remarkGfm, remarkMark],
    }).then((r) => {
      setMdxContent(() => r.default);
      setIsEvaluating(false);
    });
  }, [content, currentContent]);

  // Don't render stale content while evaluating new content
  if (isEvaluating) {
    return null;
  }

  return <MdxContent components={components} />;
};
