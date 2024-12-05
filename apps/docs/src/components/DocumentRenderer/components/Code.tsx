import { Box, Code } from "@bleh-ui/react";
import { LiveCodeEditor } from "../../LiveCodeEditor/LiveCodeEditor";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const CodeRenderer = (props) => {
  if (props.className) {
    if (props.className.includes("-live")) {
      return <LiveCodeEditor {...props} />;
    }

    const language = props.className.replace(/language-/, "");

    return (
      <Box display="block" my="6" fontSize="sm">
        <SyntaxHighlighter style={oneDark} language={language} {...props} />
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
