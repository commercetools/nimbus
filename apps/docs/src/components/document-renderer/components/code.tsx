import { Box, Code } from "@bleh-ui/react";
import { LiveCodeEditor } from "@/components/document-renderer/components/live-code-editor/live-code-editor.tsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


type CodeRendererProps = {
  className?: string,
  children?: string
}

export const CodeRenderer = (props: CodeRendererProps) => {
  const { className, children, ...rest } = props;

  if (className) {
    if (className.includes("-live")) {
      return <LiveCodeEditor {...props} />;
    }

    const language = className.replace(/language-/, "");

    return (
      <Box display="block" my="6" fontSize="sm">
        <SyntaxHighlighter style={oneDark} language={language} {...rest} children={children || ''} />
      </Box>
    );
  } else {
    return (
      <Code asChild>
        <code {...props} />
      </Code>
    );
  }
};
