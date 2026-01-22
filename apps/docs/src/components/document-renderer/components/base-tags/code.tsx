import { Box, Code as StyledCode } from "@commercetools/nimbus";
import { LiveCodeEditor } from "@/components/document-renderer/components/live-code-editor/live-code-editor.tsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

export const Code = (props: CodeProps) => {
  const { className, children, ...rest } = props;
  const isLiveEditor = className?.includes("-live");
  const isDevEnv = className?.includes("-live-dev");

  if (className) {
    if (isLiveEditor) {
      return (
        <LiveCodeEditor
          {...props}
          defaultActiveTab={isDevEnv ? "editor" : "preview"}
        />
      );
    }

    const language = className.replace(/language-/, "");

    return (
      <Box mb="400" display="block" fontSize="350">
        <SyntaxHighlighter
          language={language}
          // @ts-expect-error - the `style` property of SyntaxHighlighter specified a wrong type
          style={oneDark}
          {...rest}
          children={typeof children === "string" ? children : ""}
        />
      </Box>
    );
  } else {
    // Inline code
    return (
      <StyledCode asChild>
        <code {...props} />
      </StyledCode>
    );
  }
};
