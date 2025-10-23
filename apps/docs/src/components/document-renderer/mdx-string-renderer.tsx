import { useState, useEffect, useRef } from "react";
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
  const [mdxState, setMdxState] = useState<{
    content: string;
    component: ReactMDXContent;
  } | null>(null);

  const evaluatingRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip if we're already evaluating this content
    if (evaluatingRef.current === content) {
      return;
    }

    // Mark this content as being evaluated
    evaluatingRef.current = content;

    void evaluate(content, {
      ...runtime,
      remarkPlugins: [remarkGfm, remarkMark],
    }).then((r) => {
      // Only update if this is still the content we want
      // (user might have navigated away during evaluation)
      if (evaluatingRef.current === content) {
        setMdxState({
          content,
          component: r.default,
        });
        evaluatingRef.current = null;
      }
    });
  }, [content]);

  // Don't render if we haven't evaluated yet or if content has changed
  if (!mdxState || mdxState.content !== content) {
    return null;
  }

  const MdxContent = mdxState.component;
  return <MdxContent components={components} />;
};
