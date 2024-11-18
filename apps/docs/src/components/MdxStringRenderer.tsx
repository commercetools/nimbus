"use client";

import { useState, useEffect } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { remarkMark } from "remark-mark-highlight";

import type { FC, ReactNode } from "react";
import type { MDXComponents, MDXProps } from "mdx/types";
import type { EvaluateOptions } from "@mdx-js/mdx";

type ReactMDXContent = (props: MDXProps) => ReactNode;
type Runtime = Pick<EvaluateOptions, "jsx" | "jsxs" | "Fragment">;

const runtime = { jsx, jsxs, Fragment } as Runtime;

export const MdxStringRenderer: FC<{
  content?: string;
  components?: MDXComponents;
}> = ({ content = "", components }) => {
  const [MdxContent, setMdxContent] = useState<ReactMDXContent>(
    () => () => null
  );

  useEffect(() => {
    evaluate(content, {
      ...runtime,
      remarkPlugins: [remarkGfm, remarkMark],
    }).then((r) => {
      setMdxContent(() => r.default);
    });
  }, [content]);

  return <MdxContent components={components} />;
};
